from flask import Blueprint, request, jsonify
from extensions import db, bcrypt
from models import User

from flask_jwt_extended import create_access_token, jwt_required,get_jwt_identity

import re


users_bp = Blueprint("users", __name__)

# Register user
@users_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    # Validate required fields
    required_fields = ["name", "email", "password"]
    if not data or not all(key in data for key in required_fields):
        return jsonify({"error": "Missing required fields: name, email, password"}), 400
    
    # Validate email format and password length
    if not re.match(r"[^@]+@[^@]+\.[^@]+", data["email"]):
        return jsonify({"error": "Invalid email format"}), 400
    if len(data["password"]) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    
    # Check for existing email
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400

    try:
        hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
        user = User(name=data["name"], email=data["email"], password=hashed_pw)
        db.session.add(user)
        db.session.commit()
        token = create_access_token(identity=str(user.id))
        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": {"id": user.id, "name": user.name, "email": user.email}
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Login user
@users_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not all(key in data for key in ["email", "password"]):
        return jsonify({"error": "Missing email or password"}), 400
    
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "token": token,
        "user": {"id": user.id, "name": user.name, "role": user.role}
    }), 200

# Get all users (protected)
@users_bp.route("/users", methods=["GET"])

def get_users():
   
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in users])


@users_bp.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def edit_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)  # who is making the request

    # Fetch the target user
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Allow self-edit OR admin edit
    if current_user.id != user.id and current_user.role != "tm":
        return jsonify({"error": "Unauthorized to edit this user"}), 403

    data = request.get_json()
    new_name = data.get("name")
    new_email = data.get("email")

    # Validate email
    if new_email:
        existing_user = User.query.filter_by(email=new_email).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({"error": "Email already taken"}), 400
        user.email = new_email

    if new_name:
        user.name = new_name

    db.session.commit()

    return jsonify({
        "message": "User updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 200




@users_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Fetch target user
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    #  Allow self-view OR admin view
    if current_user.id != user.id and current_user.role != "tm":
        return jsonify({"error": "Unauthorized to view this user"}), 403

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }), 200



@users_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()  # ID from JWT token

    # Fetch the user to delete
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Only allow:
    # - The user themselves
    # - An admin
    current_user = User.query.get(current_user_id)
    if current_user.id != user.id and current_user.role != "tm":
        return jsonify({"error": "Unauthorized to delete this user"}), 403

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": f"User {user.name} deleted successfully"}), 200