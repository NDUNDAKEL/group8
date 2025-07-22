from flask import Blueprint, request, jsonify
from extensions import db
from models import Feedback,User,Pair
from flask_jwt_extended import jwt_required, get_jwt_identity

feedback_bp = Blueprint("feedback", __name__)

# Submit feedback
@feedback_bp.route("/feedback", methods=["POST"])
@jwt_required()
def submit_feedback():
    user_id = get_jwt_identity()
    data = request.get_json()
    feedback = Feedback(
        student_id=user_id,
        week_number=data["week_number"],
        feedback_text=data["feedback_text"]
    )
    db.session.add(feedback)
    db.session.commit()
    return jsonify({"message": "Feedback submitted!"}), 201






@feedback_bp.route("/feedback", methods=["GET"])
@jwt_required()
def get_all_feedback():
    feedback_entries = Feedback.query.all()
    response = []


    for fb in feedback_entries:
        pair = Pair.query.get(fb.pair_id)
        student = User.query.get(fb.student_id)

        
        partner_name = None
        if pair:
            if pair.student1_id == fb.student_id:
                partner = User.query.get(pair.student2_id)
            else:
                partner = User.query.get(pair.student1_id)
            partner_name = partner.name if partner else "Unknown"

        response.append({
            "id": fb.id,
            "pair_id": fb.pair_id,
            "student_name": student.name if student else "Unknown",
            "partner_name": partner_name,
            "feedback_text": fb.feedback_text,
            
            "submitted_at": fb.submitted_at.isoformat()
        })

    return jsonify(response), 200