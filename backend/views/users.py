from flask import Blueprint, request, jsonify,current_app
from extensions import db, bcrypt,mail
from models import User
import string
import random
from flask_mail import Message



from flask_jwt_extended import create_access_token, jwt_required,get_jwt_identity

import re


users_bp = Blueprint("users", __name__)

# Register user
def generate_password(length=12):
    """Generate a random password with letters, digits, and special characters"""
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(random.choice(characters) for _ in range(length))

@users_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    is_clerk_user = data.get("is_clerk", False)

    if is_clerk_user:
        required_fields = ["clerk_id", "email", "name"]
    else:
        required_fields = ["name", "email"]  # password is optional now

    if not data or not all(key in data for key in required_fields):
        return jsonify({"error": f"Missing required fields: {', '.join(required_fields)}"}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", data["email"]):
        return jsonify({"error": "Invalid email format"}), 400

    existing_user = None
    if is_clerk_user:
        existing_user = User.query.filter(
            (User.email == data["email"]) | (User.clerk_id == data["clerk_id"])
        ).first()
    else:
        existing_user = User.query.filter_by(email=data["email"]).first()

    if existing_user:
        if is_clerk_user:
            existing_user.name = data.get("name", existing_user.name)
            existing_user.email = data.get("email", existing_user.email)
            db.session.commit()

        additional_claims = {"auth_method": "clerk"} if is_clerk_user else {}
        token = create_access_token(
            identity=str(existing_user.id),
            additional_claims=additional_claims
        )
        return jsonify({
            "message": "User logged in successfully",
            "token": token,
            "user": {
                "id": existing_user.id,
                "name": existing_user.name,
                "email": existing_user.email,
                "role": existing_user.role
            }
        }), 200

    try:
        if is_clerk_user:
            user = User(
                name=data["name"],
                email=data["email"],
                clerk_id=data["clerk_id"],
                role="student",
                auth_method="clerk"
            )
        else:
            password = data.get("password")
            if not password:
                password = generate_password()
            elif len(password) < 8:
                return jsonify({"error": "Password must be at least 8 characters"}), 400

            hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
            user = User(
                name=data["name"],
                email=data["email"],
                password=hashed_pw,
                role="student",
                auth_method="email"
            )

        db.session.add(user)
        db.session.commit()

        # Send welcome email (for email-registered users)
        if not is_clerk_user:
            try:
                msg = Message(
                    subject="Welcome to Our Platform!",
                    sender=current_app.config["MAIL_DEFAULT_SENDER"],
                    recipients=[user.email]
                )
                msg.body = (
                    f"Hello {user.name},\n\n"
                    "Welcome to our platform! We're excited to have you on board.\n\n"
                    f"Your login email is: {user.email}\n"
                    f"Your password is: {password}\n\n"
                    "Please keep this information secure.\n\n"
                    "Best regards,\n"
                    "The Team"
                )
                mail.send(msg)
            except Exception as email_error:
                current_app.logger.error(f"Email sending failed: {email_error}")

        additional_claims = {"auth_method": "clerk"} if is_clerk_user else {}
        token = create_access_token(
            identity=str(user.id),
            additional_claims=additional_claims
        )

        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

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
        "user": {"id": user.id, "name": user.name, "role": user.role,"email":user.email}
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
    current_user = User.query.get(current_user_id)

    # Fetch the target user
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Allow self-edit OR admin edit
    if current_user.id != user.id :
        return jsonify({"error": "Unauthorized to edit this user"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Handle profile updates
    new_name = data.get("name")
    new_email = data.get("email")
    print(user)
    # Validate email
    if new_email:
        existing_user = User.query.filter_by(email=new_email).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({"error": "Email already taken"}), 400
        user.email = new_email

    if new_name:
        user.name = new_name

    # Handle password change if fields are provided
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")

    if any([current_password, new_password, confirm_password]):
        if not all([current_password, new_password, confirm_password]):
            return jsonify({"error": "All password fields are required for password change"}), 400
        
        if not user.check_password(current_password):
            return jsonify({"error": "Current password is incorrect"}), 400
            
        if new_password != confirm_password:
            return jsonify({"error": "New password and confirmation do not match"}), 400
            
        if len(new_password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400
            
        user.set_password(new_password)

    try:
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
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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