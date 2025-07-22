import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Layout from "../../components/layout/Layout";
import { CheckCircle, Clock, AlertCircle, BookOpen, Calendar } from 'lucide-react';

const StudentAssessment = () => {
  const { user } = useAuth();

  const [assessments, setAssessments] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all quizzes
        const assessmentsResponse = await fetch('http://localhost:5000/quiz', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        const assessmentsData = await assessmentsResponse.json();
        setAssessments(Array.isArray(assessmentsData) ? assessmentsData : []);

        // Fetch student’s quiz results
        const resultsResponse = await fetch('http://localhost:5000/student/results', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        const resultsData = await resultsResponse.json();
        setStudentResults(Array.isArray(resultsData) ? resultsData : []);

      } catch (err) {
        setError('Failed to load data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hasCompletedAssessment = (assessmentId) => {
    return studentResults.some(result => result.quiz_id === assessmentId);
  };

  const getStudentResult = (assessmentId) => {
    return studentResults.find(result => result.quiz_id === assessmentId);
  };

  const activeAssessments = assessments.filter(assessment =>
    !assessment.due_date || new Date(assessment.due_date) > new Date()
  );

  const calculateScore = (assessment, studentAnswers) => {
    if (!assessment?.questions || !studentAnswers) return 0;

    let correct = 0;
    assessment.questions.forEach(question => {
      if (studentAnswers[question.id] === question.correct_answer) {
        correct++;
      }
    });

    return Math.round((correct / assessment.questions.length) * 100);
  };

  const startAssessment = async (assessment, viewMode = false) => {
    try {
      // Load full quiz details with questions
      const response = await fetch(`http://localhost:5000/quiz/${assessment.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      const detailedAssessment = await response.json();

      setCurrentAssessment(detailedAssessment);

      if (viewMode) {
        // Fetch saved answers from backend
        const answersResponse = await fetch(`http://localhost:5000/quiz/${assessment.id}/answers`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        const savedAnswers = await answersResponse.json();

        
        const mappedAnswers = {};
        savedAnswers.forEach(ans => {
          mappedAnswers[ans.question_id] = ans.selected_option;
        });

        setAnswers(mappedAnswers);
        setSubmissionStatus('view');
      } else {
        // Fresh attempt  empty answers
        const initialAnswers = {};
        detailedAssessment.questions.forEach((question) => {
          initialAnswers[question.id] = '';
        });
        setAnswers(initialAnswers);
        setSubmissionStatus(null);
      }

      setCurrentResult(getStudentResult(assessment.id));
    } catch (err) {
      setError('Failed to load assessment details');
      console.error('Error loading assessment details:', err);
    }
  };

  useEffect(() => {
    if (currentAssessment && currentAssessment.time_limit && !submissionStatus) {
      const endTime = new Date(new Date().getTime() + currentAssessment.time_limit * 60000);

      const timer = setInterval(() => {
        const now = new Date();
        const diff = endTime.getTime() - now.getTime();

        if (diff <= 0) {
          clearInterval(timer);
          setTimeRemaining('Time expired');
          handleSubmit(); // Auto-submit
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentAssessment, submissionStatus]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (!currentAssessment) return;

    setIsSubmitting(true);

    try {
      const score = calculateScore(currentAssessment, answers);

      // Submit quiz result & answers
      const response = await fetch(`http://localhost:5000/quiz/${currentAssessment.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ score, answers }),
      });

      if (!response.ok) throw new Error('Submission failed');

      const newResult = {
        id: Date.now(),
        student_id: user?.id || 0,
        quiz_id: currentAssessment.id,
        score,
        submitted_at: new Date().toISOString()
      };

      setStudentResults(prev => [...prev, newResult]);
      setCurrentResult(newResult);
      setSubmissionStatus('success');
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && assessments.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading assessments...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center p-8">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
          <p className="text-gray-600 mt-1">Complete your assigned assessments</p>
        </div>

        {!currentAssessment ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAssessments.length > 0 ? (
              activeAssessments.map(assessment => {
                const isCompleted = hasCompletedAssessment(assessment.id);
                const result = getStudentResult(assessment.id);

                return (
                  <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                        {isCompleted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm">{assessment.description}</p>

                      {assessment.time_limit && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1.5" />
                          {`${assessment.time_limit} min`}
                        </div>
                      )}

                      {assessment.due_date && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          Due {new Date(assessment.due_date).toLocaleDateString()}
                        </div>
                      )}

                      {isCompleted && result && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm font-medium text-blue-700">
                              Score: {result.score}%
                            </span>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={() =>
                          hasCompletedAssessment(assessment.id)
                            ? startAssessment(assessment, true)
                            : startAssessment(assessment)
                        }
                        fullWidth
                      >
                        {hasCompletedAssessment(assessment.id) ? 'View Results' : 'Start Assessment'}
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full">
                <Card>
                  <div className="text-center p-8">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <BookOpen className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No assessments available</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Your teacher hasn't assigned any assessments yet. Check back later.
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Assessment Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentAssessment.title}</h2>
                <p className="text-gray-600">{currentAssessment.description}</p>
              </div>

              {timeRemaining && submissionStatus !== 'view' && (
                <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium text-blue-700">{timeRemaining}</span>
                </div>
              )}
            </div>

            {/* View Results Mode */}
            {submissionStatus === 'view' && currentResult && (
              <Card>
                <div className="space-y-8">
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium text-blue-700">
                        Your score: {currentResult.score}%
                      </span>
                    </div>
                  </div>

                  {currentAssessment.questions.map((question, index) => {
                    const studentAnswer = answers[question.id];
                    const isCorrect = studentAnswer === question.correct_answer;

                    return (
                      <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start">
                          <span className="flex-shrink-0 bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium text-gray-700 mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">{question.question_text}</h3>

                            {isCorrect ? (
                              <div className="bg-green-50 rounded-lg p-3">
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span className="text-sm font-medium text-green-700">
                                    Correct: {studentAnswer}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="bg-red-50 rounded-lg p-3">
                                  <div className="flex items-center">
                                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                                    <span className="text-sm font-medium text-red-700">
                                      Your answer: {studentAnswer || "No answer provided"}
                                    </span>
                                  </div>
                                </div>

                                <div className="bg-green-50 rounded-lg p-3">
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    <span className="text-sm font-medium text-green-700">
                                      Correct answer: {question.correct_answer}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setCurrentAssessment(null)}>Back to Assessments</Button>
                  </div>
                </div>
              </Card>
            )}

            {/*  Success screen after submission */}
            {submissionStatus === 'success' && (
              <Card>
                <div className="text-center p-8 space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-green-700">
                    Your assessment has been submitted successfully!
                  </h3>
                  {currentResult && (
                    <p className="text-gray-700">
                      You scored <span className="font-semibold">{currentResult.score}%</span>
                    </p>
                  )}
                  <Button onClick={() => setCurrentAssessment(null)} className="mt-4">
                    Back to Assessments
                  </Button>
                </div>
              </Card>
            )}

            {/* Take Assessment Mode */}
            {!submissionStatus && (
              <Card>
                <div className="space-y-8">
                  {currentAssessment.questions.map((question, index) => (
                    <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start">
                        <span className="flex-shrink-0 bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium text-gray-700 mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-3">{question.question_text}</h3>

                          <div className="space-y-2">
                            {[question.option1, question.option2, question.option3, question.option4]
                              .filter(Boolean)
                              .map(option => (
                                <div key={option} className="flex items-center">
                                  <input
                                    id={`${question.id}-${option}`}
                                    name={`question-${question.id}`}
                                    type="radio"
                                    checked={answers[question.id] === option}
                                    onChange={() => handleAnswerChange(question.id, option)}
                                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <label
                                    htmlFor={`${question.id}-${option}`}
                                    className="ml-3 block text-gray-700"
                                  >
                                    {option}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" onClick={() => setCurrentAssessment(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentAssessment;
