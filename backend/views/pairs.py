from flask import Blueprint, jsonify,request
from extensions import db
from models import Pair, User, LearningPreference
from flask_jwt_extended import jwt_required,get_jwt_identity
import random
import itertools

pairs_bp = Blueprint("pairs", __name__)


from datetime import datetime

def get_current_week():
    return datetime.utcnow().isocalendar()[1]  # current ISO week number

@pairs_bp.route("/pairs", methods=["GET"])
# @jwt_required(optional=True)
def list_pairs():
    requested_week = request.args.get("week", type=int)

    if requested_week is not None:
        # Filter only for requested week
        pairs = Pair.query.filter_by(week_number=requested_week).all()
    else:
        # Return ALL pairs
        pairs = Pair.query.all()

    return jsonify([
        {
            "student1": p.student1.name,
            "student2": p.student2.name,
            "week": p.week_number,
            "createdAt": p.created_at.isoformat()
        }
        for p in pairs
    ])


@pairs_bp.route("/students", methods=["GET", "OPTIONS"])
# @jwt_required(optional=True)
def get_students():
    try:
        students = User.query.filter_by(role="student").all()
        return jsonify([
            {"id": s.id, "name": s.name, "email": s.email}
            for s in students
        ])
    except Exception as e:
        print("Error fetching students:", e)
        return jsonify({"error": "Could not fetch students"}), 500


@pairs_bp.route("/pairs/generate", methods=["POST"])
@jwt_required()
def generate_pairs():
    try:
        students = User.query.filter_by(role="student").all()
        
        if len(students) < 2:
            return jsonify({"error": "Need at least 2 students to create pairs"}), 400
        
        total_students = len(students)
        
        # Get current week number
        current_week = db.session.query(db.func.max(Pair.week_number)).scalar() or 0
        next_week = current_week + 1
        
        # Get all existing pairs as sets 
        existing_pairs = set()
        pairs_query = db.session.query(Pair.student1_id, Pair.student2_id).all()
        
        for p in pairs_query:
            # Store as sorted tuple to avoid order issues
            pair_tuple = tuple(sorted([p.student1_id, p.student2_id]))
            existing_pairs.add(pair_tuple)
        
        print(f"Existing pairs: {existing_pairs}")
        
        def get_preferences(user):
            prefs = LearningPreference.query.filter_by(user_id=user.id).first()
            return {
                "learningStyle": prefs.learning_style if prefs else None,
                "pace": prefs.preferred_pace if prefs else None,
                "topicInterest": prefs.preferred_topic if prefs else None,
                "collaboration": prefs.collaboration_style if prefs else None
            }
        
        def have_paired_before(a, b):
            pair_tuple = tuple(sorted([a.id, b.id]))
            return pair_tuple in existing_pairs
        
        def calculate_compatibility(a, b):
            prefs_a = get_preferences(a)
            prefs_b = get_preferences(b)
            score = 0
            
            # Base compatibility score
            if prefs_a["learningStyle"] == prefs_b["learningStyle"]:
                score += 2
            if prefs_a["pace"] == prefs_b["pace"]:
                score += 2
            if prefs_a["topicInterest"] == prefs_b["topicInterest"]:
                score += 1
            if prefs_a["collaboration"] == prefs_b["collaboration"]:
                score += 1
            
            
            if have_paired_before(a, b):
                score -= 50  # Increased penalty
            
            # Add random factor for diversity
            score += random.uniform(-2, 2)
            
            return score
        
        # Try multiple pairing attempts and pick the best one
        best_pairings = []
        best_score = float('-inf')
        
        for attempt in range(10):  # Try 10 different arrangements
            # Shuffle students for randomness
            available = students[:]
            random.shuffle(available)
            
            current_pairings = []
            current_score = 0
            temp_available = available[:]
            
            while len(temp_available) >= 2:
                s1 = temp_available.pop(0)
                best_match = None
                best_match_score = float('-inf')
                best_index = -1
                
                # Find best match for s1
                for idx, candidate in enumerate(temp_available):
                    compatibility = calculate_compatibility(s1, candidate)
                    if compatibility > best_match_score:
                        best_match_score = compatibility
                        best_match = candidate
                        best_index = idx
                
                if best_match:
                    temp_available.pop(best_index)
                    current_pairings.append((s1, best_match))
                    current_score += best_match_score
            
            # If this arrangement is better, use it
            if current_score > best_score:
                best_score = current_score
                best_pairings = current_pairings
        
        # Create pairs from best arrangement
        new_pairs = []
        leftover_student = None
        
        # Handle leftover student
        remaining_students = [s for s in students if not any(s in pair for pair in best_pairings)]
        if remaining_students:
            leftover_student = remaining_students[0].name
        
        # Save pairs to database
        for s1, s2 in best_pairings:
            pair = Pair(
                student1_id=s1.id,
                student2_id=s2.id,
                week_number=next_week,
                status="active"
            )
            db.session.add(pair)
            new_pairs.append({
                "student1": s1.name,
                "student2": s2.name,
                "week": next_week
            })
        
        # If no new pairs could be created, reset the pairing history
        if not new_pairs:
            print("No new pairs possible, resetting pairing history...")
            # Delete all existing pairs to start fresh
            db.session.query(Pair).delete()
            db.session.commit()
            
            # Try again with fresh start
            return generate_pairs()
        
        db.session.commit()
        
        print(f"Generated {len(new_pairs)} pairs for week {next_week}")
        print(f"Unpaired student: {leftover_student}")
        
        return jsonify({
            "week": next_week,
            "pairings": new_pairs,
            "unpaired": leftover_student
        }), 201
        
    except Exception as e:
        print("ERROR in /pairs/generate:", e)
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    




@pairs_bp.route("/pairings/current", methods=["GET"])
@jwt_required()
def get_current_pairing():
    current_user_id = get_jwt_identity()

    # Get the latest generated week
    current_week = db.session.query(db.func.max(Pair.week_number)).scalar()

    if not current_week:
        return jsonify({"partner": None, "week": None})

    # Find the pairing for this user in the latest week
    pairing = Pair.query.filter(
        Pair.week_number == current_week,
        (Pair.student1_id == current_user_id) | (Pair.student2_id == current_user_id)
    ).first()

    if not pairing:
        return jsonify({"partner": None, "week": current_week})

    partner_name = (
        pairing.student2.name
        if pairing.student1_id == current_user_id
        else pairing.student1.name
    )

    return jsonify({
        "partner": partner_name,
        "week": current_week
    })
