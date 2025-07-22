from flask import Blueprint, request, jsonify
from extensions import db
from models import Quiz, QuizQuestion, QuizResult,User,Answer
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

quizzes_bp = Blueprint("quizzes", __name__)

# Create a quiz
@quizzes_bp.route("/quiz", methods=["POST"])
@jwt_required()
def create_quiz():
    data = request.get_json()
    
    # Make due_date optional
    due_date = None
    if data.get("due_date"):
        due_date = datetime.strptime(data["due_date"], "%Y-%m-%d")
    
    quiz = Quiz(
        title=data["title"],
        description=data.get("description"),
        time_limit=data.get("time_limit", 30),
        due_date=due_date
    )
    db.session.add(quiz)
    db.session.commit()
    return jsonify({"message": "Quiz created", "quiz_id": quiz.id}), 201
# Add quiz questions
@quizzes_bp.route("/quiz/<int:quiz_id>/questions", methods=["POST"])
@jwt_required()
def add_question(quiz_id):
    data = request.get_json()
    question = QuizQuestion(
        quiz_id=quiz_id,
        question_text=data["question_text"],
        option1=data["option1"],
        option2=data["option2"],
        option3=data["option3"],
        option4=data["option4"],
        correct_answer=data["correct_answer"]
    )
    db.session.add(question)
    db.session.commit()
    return jsonify({"message": "Question added"}), 201

# Get all quizzes
@quizzes_bp.route("/quiz", methods=["GET"])
def list_quizzes():
    quizzes = Quiz.query.all()
    return jsonify([{
            "id": q.id,
            "title": q.title,
            "description": q.description,
            "time_limit": q.time_limit,
            "due_date": q.due_date.isoformat() if q.due_date else None
        } for q in quizzes])

@quizzes_bp.route("/quiz/<int:quiz_id>/submit", methods=["POST"])
@jwt_required()
def submit_quiz(quiz_id):
    student_id = get_jwt_identity()
    data = request.get_json()

    # Get answers sent from frontend
    answers = data.get("answers", {})  # {question_id: selected_option}
    score = data.get("score", 0)

    # Save each individual answer
    for question_id, selected_option in answers.items():
        question = QuizQuestion.query.get(question_id)
        if not question:
            continue  # Skip invalid question IDs

        is_correct = (selected_option == question.correct_answer)

        answer = Answer(
            student_id=student_id,
            quiz_id=quiz_id,
            question_id=question_id,
            selected_option=selected_option,
            is_correct=is_correct
        )
        db.session.add(answer)

    # Save the overall quiz result
    quiz_result = QuizResult(
        student_id=student_id,
        quiz_id=quiz_id,
        score=score
    )
    db.session.add(quiz_result)

    db.session.commit()

    return jsonify({"message": "Quiz submitted!", "score": score}), 201


# Get quiz details with questions
@quizzes_bp.route("/quiz/<int:quiz_id>", methods=["GET"])
def get_quiz_details(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    questions = QuizQuestion.query.filter_by(quiz_id=quiz_id).all()
    
    return jsonify({
        "id": quiz.id,
        "title": quiz.title,
        "description": quiz.description,
        "time_limit": quiz.time_limit,
        "due_date": quiz.due_date.isoformat() if quiz.due_date else None,
        "questions": [q.to_dict() for q in questions]
    })

# Get quiz results for instructor
@quizzes_bp.route("/quiz/<int:quiz_id>/results", methods=["GET"])
@jwt_required()
def get_quiz_results(quiz_id):
    results = db.session.query(QuizResult, User).join(
        User, QuizResult.student_id == User.id
    ).filter(QuizResult.quiz_id == quiz_id).all()
    
    return jsonify([
        {
            "id": result.id,
            "student_id": result.student_id,
            "quiz_id": result.quiz_id,
            "score": result.score,
            "submitted_at": result.submitted_at.isoformat(),
            "student_name": user.name,
            "student_email": user.email
        }
        for result, user in results
    ])

# Get student's own results
@quizzes_bp.route("/student/results", methods=["GET"])
@jwt_required()
def get_student_results():
    user_id = get_jwt_identity()
    results = QuizResult.query.filter_by(student_id=user_id).all()
    
    return jsonify([
        {
            "id": result.id,
            "student_id": result.student_id,
            "quiz_id": result.quiz_id,
            "score": result.score,
            "submitted_at": result.submitted_at.isoformat()
        }
        for result in results
    ])

@quizzes_bp.route("/quiz/<int:quiz_id>", methods=["PUT"])
@jwt_required()
def update_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    data = request.get_json()
    
    quiz.title = data.get('title', quiz.title)
    quiz.description = data.get('description', quiz.description)
    quiz.time_limit = data.get('time_limit', quiz.time_limit)
    
    if 'due_date' in data:
        try:
            # Try parsing as full ISO datetime first
            if data["due_date"]:
                # Remove timezone info if present and parse
                due_date_str = data["due_date"].split('T')[0]  # Just get the date part
                quiz.due_date = datetime.strptime(due_date_str, "%Y-%m-%d")
            else:
                quiz.due_date = None
        except ValueError:
            # If parsing fails, set to None or handle differently
            quiz.due_date = None
    
    db.session.commit()
    return jsonify({"message": "Quiz updated successfully"}), 200
# Update a specific question
@quizzes_bp.route("/quiz/<int:quiz_id>/questions/<int:question_id>", methods=["PUT"])
@jwt_required()
def update_question(quiz_id, question_id):
    question = QuizQuestion.query.filter_by(quiz_id=quiz_id, id=question_id).first_or_404()
    data = request.get_json()
    
    question.question_text = data.get('question_text', question.question_text)
    question.option1 = data.get('option1', question.option1)
    question.option2 = data.get('option2', question.option2)
    question.option3 = data.get('option3', question.option3)
    question.option4 = data.get('option4', question.option4)
    question.correct_answer = data.get('correct_answer', question.correct_answer)
    
    db.session.commit()
    return jsonify({"message": "Question updated successfully"}), 200

# Delete a question
@quizzes_bp.route("/quiz/<int:quiz_id>/questions/<int:question_id>", methods=["DELETE"])
@jwt_required()
def delete_question(quiz_id, question_id):
    question = QuizQuestion.query.filter_by(quiz_id=quiz_id, id=question_id).first_or_404()
    db.session.delete(question)
    db.session.commit()
    return jsonify({"message": "Question deleted successfully"}), 200


@quizzes_bp.route("/quiz/<int:quiz_id>", methods=["DELETE"])
@jwt_required()
def delete_quiz(quiz_id):
    # First delete all questions
    QuizQuestion.query.filter_by(quiz_id=quiz_id).delete()
    
    # Then delete the quiz
    quiz = Quiz.query.get_or_404(quiz_id)
    db.session.delete(quiz)
    db.session.commit()
    
    return jsonify({"message": "Quiz and its questions deleted successfully"}), 200


@quizzes_bp.route("/quiz/<int:quiz_id>/answers", methods=["GET"])
@jwt_required()
def get_student_answers(quiz_id):
    try:
        user_id = get_jwt_identity()
        answers = Answer.query.filter_by(student_id=user_id, quiz_id=quiz_id).all()

        print(answers)

        return jsonify([
            {
                "question_id": ans.question_id,
                "selected_option": ans.selected_option,
                "is_correct": ans.is_correct,
                "submitted_at": ans.submitted_at.isoformat()
            }
            for ans in answers
        ])
    except Exception as e:
        print('sdfghfd')
    
