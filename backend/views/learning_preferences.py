from flask import Blueprint, request, jsonify
from extensions import db
from models import LearningPreference
from flask_jwt_extended import jwt_required, get_jwt_identity

learning_pref_bp = Blueprint("learning_preferences_bp", __name__)

# CREATE or UPDATE 
@learning_pref_bp.route("/learning-preferences", methods=["POST"])
@jwt_required()
def save_learning_preferences():
    user_id = get_jwt_identity()  
    data = request.get_json()

    existing_pref = LearningPreference.query.filter_by(user_id=user_id).first()

    if existing_pref:
        # Update existing record
        existing_pref.learning_style = data.get("learning_style")
        existing_pref.collaboration_style = data.get("collaboration_style")
        existing_pref.preferred_pace = data.get("preferred_pace")
        existing_pref.preferred_topic = data.get("preferred_topic")
        message = "Preferences updated successfully"
    else:
        #  Create new record
        new_pref = LearningPreference(
            user_id=user_id,
            learning_style=data.get("learning_style"),
            collaboration_style=data.get("collaboration_style"),
            preferred_pace=data.get("preferred_pace"),
            preferred_topic=data.get("preferred_topic")
        )
        db.session.add(new_pref)
        message = "Preferences created successfully"

    db.session.commit()
    return jsonify({"message": message}), 200


# GET a specific user’s preferences
@learning_pref_bp.route("/learning-preferences/<int:user_id>", methods=["GET"])
def get_learning_preference(user_id):
    pref = LearningPreference.query.filter_by(user_id=user_id).first()

    if not pref:
        return jsonify({"message": "No preferences found"}), 404
    
    return jsonify({
        "learning_style": pref.learning_style,
        "collaboration_style": pref.collaboration_style,
        "preferred_pace": pref.preferred_pace,
        "preferred_topic": pref.preferred_topic
    }), 200


#  DELETE preferences
@learning_pref_bp.route("/learning-preferences/<int:user_id>", methods=["DELETE"])
def delete_learning_preference(user_id):
    pref = LearningPreference.query.filter_by(user_id=user_id).first()
    if not pref:
        return jsonify({"message": "No learning preference found"}), 404
    
    db.session.delete(pref)
    db.session.commit()
    return jsonify({"message": "Learning preference deleted"}), 200
