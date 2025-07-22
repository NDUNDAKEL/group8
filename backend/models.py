from flask_sqlalchemy import SQLAlchemy

from datetime import datetime
from sqlalchemy_serializer import SerializerMixin
from extensions import db

class User(db.Model,SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ("-learning_pref.user", "-quizzes.student", "-feedbacks.student") 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  
    role = db.Column(db.String(10), default='student')  
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # One-to-one relationship with learning preference
    learning_pref = db.relationship('LearningPreference', backref='user', uselist=False)
    quizzes = db.relationship('QuizResult', backref='student', lazy=True)
    feedbacks = db.relationship('Feedback', backref='student', lazy=True)





class LearningPreference(db.Model,SerializerMixin):
    __tablename__ = 'learning_preferences'
    serialize_rules = ("-user.learning_pref",) 
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    learning_style = db.Column(db.Enum('visual', 'auditory', 'hands_on', name='learning_style_enum'))
    collaboration_style = db.Column(db.Enum('group_work', 'pair_programming', 'individual_work', name='collab_style_enum'))
    preferred_pace = db.Column(db.Enum('fast', 'medium', 'slow', name='pace_enum'))
    preferred_topic = db.Column(db.Enum('frontend', 'backend', 'fullstack', 'devops', 'datascience', name='topic_enum'))



class Quiz(db.Model,SerializerMixin):
    __tablename__ = 'quizzes'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    time_limit = db.Column(db.Integer)  
    due_date = db.Column(db.DateTime)

    # Questions for the quiz
    questions = db.relationship('QuizQuestion', backref='quiz', lazy=True)


    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'time_limit': self.time_limit,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'questions': [q.to_dict() for q in self.questions]
        }


class QuizQuestion(db.Model,SerializerMixin):
    __tablename__ = 'quiz_questions'
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'))
    question_text = db.Column(db.Text, nullable=False)
    option1 = db.Column(db.String(255))
    option2 = db.Column(db.String(255))
    option3 = db.Column(db.String(255))
    option4 = db.Column(db.String(255))
    correct_answer = db.Column(db.String(255))  


    def to_dict(self):
        return {
            'id': self.id,
            'quiz_id': self.quiz_id,
            'question_text': self.question_text,
            'option1': self.option1,
            'option2': self.option2,
            'option3': self.option3,
            'option4': self.option4,
            'correct_answer': self.correct_answer
        }



class Pair(db.Model, SerializerMixin):
    __tablename__ = 'pairs'
    id = db.Column(db.Integer, primary_key=True)

    student1_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="CASCADE")
    )
    student2_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="CASCADE")
    )

    week_number = db.Column(db.Integer, nullable=False)
    status = db.Column(
        db.Enum('active', 'archived', name='pair_status_enum'),
        default='active'
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student1 = db.relationship(
        'User',
        foreign_keys=[student1_id],
        passive_deletes=True
    )
    student2 = db.relationship(
        'User',
        foreign_keys=[student2_id],
        passive_deletes=True
    )




class Feedback(db.Model,SerializerMixin):
    __tablename__ = 'feedbacks'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    week_number = db.Column(db.Integer, nullable=False)
    feedback_text = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class QuizResult(db.Model,SerializerMixin):
    __tablename__ = 'quiz_results'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'))
    score = db.Column(db.Float)  
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)






class Answer(db.Model):
    __tablename__ = "answers"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), nullable=False)  
    question_id = db.Column(db.Integer, db.ForeignKey("quiz_questions.id"), nullable=False)  

    selected_option = db.Column(db.String(255), nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship("User", backref="answers")
    quiz = db.relationship("Quiz", backref="answers")
    question = db.relationship("QuizQuestion", backref="answers")

  
