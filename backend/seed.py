from app import app
from models import User, LearningPreference, Quiz, QuizQuestion, Pair, Feedback, QuizResult, Answer
from datetime import datetime, timedelta
from extensions import db, bcrypt

def seed_data():
    with app.app_context():
        try:
            # 🔥 Clear existing data
            print("🔥 Clearing existing data...")
            db.drop_all()
            db.create_all()

            # ✅ 1. Create Users with hashed passwords
            print("👥 Creating users...")
            user1 = User(name="Alice", email="alice@example.com", role="student")
            user1.password = bcrypt.generate_password_hash("password123").decode('utf-8')

            user2 = User(name="Bob", email="bob@example.com", role="student")
            user2.password = bcrypt.generate_password_hash("password456").decode('utf-8')

            tm = User(name="Charlie", email="tm@example.com", role="tm")
            tm.password = bcrypt.generate_password_hash("tm_password").decode('utf-8')

            db.session.add_all([user1, user2, tm])
            db.session.commit()

            # ✅ 2. Learning Preferences
            print("🎓 Adding learning preferences...")
            lp1 = LearningPreference(
                user_id=user1.id,
                learning_style="visual",
                collaboration_style="group_work",
                preferred_pace="medium",
                preferred_topic="frontend"
            )
            lp2 = LearningPreference(
                user_id=user2.id,
                learning_style="hands_on",
                collaboration_style="pair_programming",
                preferred_pace="fast",
                preferred_topic="backend"
            )
            db.session.add_all([lp1, lp2])
            db.session.commit()

            # ✅ 3. Create a Quiz
            print("📝 Creating quiz...")
            quiz = Quiz(
                title="Python Basics",
                description="A simple quiz on Python basics",
                time_limit=30,
                due_date=datetime.utcnow() + timedelta(days=7)
            )
            db.session.add(quiz)
            db.session.commit()

            # ✅ 4. Quiz Questions
            print("❓ Adding quiz questions...")
            q1 = QuizQuestion(
                quiz_id=quiz.id,
                question_text="What is Python?",
                option1="Snake",
                option2="Programming language",
                option3="Car brand",
                option4="None",
                correct_answer="Programming language"
            )
            q2 = QuizQuestion(
                quiz_id=quiz.id,
                question_text="What does `print()` do in Python?",
                option1="Outputs text",
                option2="Takes input",
                option3="Loops data",
                option4="None",
                correct_answer="Outputs text"
            )
            db.session.add_all([q1, q2])
            db.session.commit()

            # ✅ 5. Pairing Users
            print("👫 Creating pairs...")
            pair = Pair(
                student1_id=user1.id,
                student2_id=user2.id,
                week_number=1,
                status="active"
            )
            db.session.add(pair)

            # ✅ 6. Feedback
            print("💬 Adding feedback...")
            feedback = Feedback(
                student_id=user1.id,
                week_number=1,
                feedback_text="This week was great for learning Flask!"
            )
            db.session.add(feedback)

            # ✅ 7. Quiz Result
            print("📊 Adding quiz results...")
            result = QuizResult(
                student_id=user1.id,
                quiz_id=quiz.id,
                score=85.5
            )
            db.session.add(result)
            db.session.commit()

            # ✅ 8. Answers (Alice's responses)
            print("📝 Adding answers for Alice...")
            # Alice answers correctly for Q1
            answer1 = Answer(
                student_id=user1.id,
                quiz_id=quiz.id,
                question_id=q1.id,
                selected_option="Programming language",
                is_correct=True
            )

            # Alice answers incorrectly for Q2
            answer2 = Answer(
                student_id=user1.id,
                quiz_id=quiz.id,
                question_id=q2.id,
                selected_option="Takes input",  # wrong answer
                is_correct=False
            )

            db.session.add_all([answer1, answer2])
            db.session.commit()

            print("✅ Seeding complete! Users, quiz, questions, results & answers added.")

        except Exception as e:
            db.session.rollback()
            print(f"❌ Error during seeding: {str(e)}")
            raise

if __name__ == "__main__":
    seed_data()
