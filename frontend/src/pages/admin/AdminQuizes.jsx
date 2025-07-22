import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Layout from "../../components/layout/Layout";
import Textarea from '../../components/ui/TextArea';
import { Plus, FileText, BarChart2, Check, X, Clock, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const InstructorAssessments = () => {
  const { user } = useAuth();
  const API_BASE_URL = 'http://localhost:5000';

 
  const [assessments, setAssessments] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('manage');
  const [currentView, setCurrentView] = useState('list'); 
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [expandedAssessment, setExpandedAssessment] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    dueDate: '',
    isActive: true,
    questions: []
  });
  
  const [questionForm, setQuestionForm] = useState({
    text: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    maxLength: 500
  });

 // Load assessments on component mount
useEffect(() => {
  const fetchAssessments = async () => {
    try {
      setLoading(true);
      // First fetch the list of quizzes
      const response = await fetch(`${API_BASE_URL}/quiz`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }
      
      const quizzes = await response.json();
      
      // Then fetch questions for each quiz
      console.log(quizzes)
      const quizzesWithQuestions = await Promise.all(
        
        quizzes.map(async (quiz) => {
          try {
            const questionsResponse = await fetch(`${API_BASE_URL}/quiz/${quiz.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              }
            });
            
            if (!questionsResponse.ok) {
              console.error(`Failed to fetch questions for quiz ${quiz.id}`);
              return {
                ...quiz,
                isActive: true,
                questions: []
              };
            }
            
            const questions = await questionsResponse.json();
            return {
              ...quiz,
              isActive: true,
              questions: questions || []
            };
          } catch (err) {
            console.error(`Error fetching questions for quiz ${quiz.id}:`, err);
            return {
              ...quiz,
              isActive: true,
              questions: []
            };
          }
        })
      );
      
      setAssessments(quizzesWithQuestions);
    } catch (err) {
      setError('Failed to load assessments');
      console.error('Error loading assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchAssessments();
}, []);

  const loadQuizResults = async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/results`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      
      const results = await response.json();
      setQuizResults(results);
    } catch (err) {
      console.error('Error loading quiz results:', err);
    }
  };

  // Reset form when switching to create view
  const startCreateAssessment = () => {
    setFormData({
      title: '',
      description: '',
      timeLimit: 30,
      dueDate: '',
      isActive: true,
      questions: []
    });
    setCurrentView('create');
    setCurrentAssessment(null);
    setSelectedQuestion(null);
  };

  // Load assessment data when editing
  const startEditAssessment = async (assessment) => {
    try {
      setLoading(true);
      // Fetch the full assessment details including questions
      const response = await fetch(`${API_BASE_URL}/quiz/${assessment.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch assessment details');
      }
      
      const fullAssessment = await response.json();
      
      setCurrentAssessment(fullAssessment);
      setFormData({
        title: fullAssessment.title,
        description: fullAssessment.description,
        timeLimit: fullAssessment.time_limit || 30,
        dueDate: fullAssessment.due_date || '',
        isActive: fullAssessment.isActive ?? true,
        questions: fullAssessment.questions.map(q => ({
          id: q.id,
          text: q.question_text,
          type: 'multiple-choice',
          options: [
            q.option1 || '',
            q.option2 || '',
            q.option3 || '',
            q.option4 || ''
          ].filter(opt => opt !== ''),
          correctAnswer: q.correct_answer
        }))
      });
      setCurrentView('edit');
    } catch (err) {
      setError('Failed to load assessment details');
      console.error('Error loading assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewAssessmentDetails = async (assessment) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/quiz/${assessment.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch assessment details');
      }
      
      const fullAssessment = await response.json();
      setCurrentAssessment({
        ...fullAssessment,
        questions: fullAssessment.questions || []
      });
      setCurrentView('details');
    } catch (err) {
      setError('Failed to load assessment details');
      console.error('Error loading assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionFormChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm(prev => ({ ...prev, options: newOptions }));
  };

  const addQuestionToForm = () => {
    if (!questionForm.text) return;
    
    const newQuestion = {
      id: Date.now(), // Temporary ID for new questions
      text: questionForm.text,
      type: questionForm.type,
      options: questionForm.options.filter(opt => opt.trim() !== ''),
      correctAnswer: questionForm.correctAnswer
    };
    
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    // Reset question form
    setQuestionForm({
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      maxLength: 500
    });
  };

  const editQuestion = (question) => {
    setSelectedQuestion(question);
    setQuestionForm({
      text: question.text,
      type: question.type,
      options: [...question.options, '', '', ''].slice(0, 4), // Ensure 4 options
      correctAnswer: question.correctAnswer,
      maxLength: 500
    });
  };

  const updateQuestion = () => {
    if (!selectedQuestion || !questionForm.text) return;
    
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === selectedQuestion.id ? {
          ...q,
          text: questionForm.text,
          options: questionForm.options.filter(opt => opt.trim() !== ''),
          correctAnswer: questionForm.correctAnswer
        } : q
      )
    }));
    
    setSelectedQuestion(null);
    // Reset question form
    setQuestionForm({
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      maxLength: 500
    });
  };

  const removeQuestion = (index) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(index, 1);
      return { ...prev, questions: newQuestions };
    });
  };

  const handleDeleteAssessment = async (assessmentId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this assessment and all its questions?')) {
        return;
      }
  
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/quiz/${assessmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete assessment');
      }
  
      // Update UI immediately
      setAssessments(prev => prev.filter(a => a.id !== assessmentId));
      
      // If currently viewing this assessment, go back to list
      if (currentAssessment?.id === assessmentId) {
        setCurrentView('list');
        setCurrentAssessment(null);
      }
  
    } catch (err) {
      setError('Failed to delete assessment: ' + err.message);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSubmitAssessment = async () => {
    if (!formData.title || formData.questions.length === 0) return;
    
    try {
      setLoading(true);
      
      if (currentView === 'create') {
                // Create new assessment
                const response = await fetch(`${API_BASE_URL}/quiz`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                  },
                  body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    time_limit: formData.timeLimit,
                    due_date: formData.dueDate
                  })
                });
        
                if (!response.ok) {
                  throw new Error('Failed to create assessment');
                }
        
                const newAssessment = await response.json();
        
                // Add questions to the assessment
                for (const question of formData.questions) {
                  await fetch(`${API_BASE_URL}/quiz/${newAssessment.quiz_id}/questions`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    },
                    body: JSON.stringify({
                      question_text: question.text,
                      option1: question.options[0] || null,
                      option2: question.options[1] || null,
                      option3: question.options[2] || null,
                      option4: question.options[3] || null,
                      correct_answer: question.correctAnswer
                    })
                  });
                }
      } else if (currentView === 'edit' && currentAssessment) {
        // Update basic quiz info
        await fetch(`${API_BASE_URL}/quiz/${currentAssessment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            time_limit: formData.timeLimit,
            due_date: formData.dueDate
          })
        });
  
        const existingQuestions = currentAssessment.questions || [];
  const newQuestions = formData.questions;

  // First handle updates to existing questions
  for (const newQ of newQuestions) {
    // Check if this is an existing question (has an ID that matches backend)
    const existingQ = existingQuestions.find(q => q.id === newQ.id);
    if (existingQ) {
      await fetch(`${API_BASE_URL}/quiz/${currentAssessment.id}/questions/${newQ.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
              body: JSON.stringify({
                question_text: newQ.text,
                option1: newQ.options[0] || null,
                option2: newQ.options[1] || null,
                option3: newQ.options[2] || null,
                option4: newQ.options[3] || null,
                correct_answer: newQ.correctAnswer
              })
            });
          } else if (!newQ.id) {
            // New question - add it
            await fetch(`${API_BASE_URL}/quiz/${currentAssessment.id}/questions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              },
              body: JSON.stringify({
                question_text: newQ.text,
                option1: newQ.options[0] || null,
                option2: newQ.options[1] || null,
                option3: newQ.options[2] || null,
                option4: newQ.options[3] || null,
                correct_answer: newQ.correctAnswer
              })
            });
          }
        }
  
        // Delete removed questions
        for (const oldQ of existingQuestions) {
          if (!newQuestions.some(q => q.id === oldQ.id)) {
            await fetch(`${API_BASE_URL}/quiz/${currentAssessment.id}/questions/${oldQ.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              }
            });
          }
        }
      }
  
      // Refresh data
      const updatedResponse = await fetch(`${API_BASE_URL}/quiz`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      const updatedData = await updatedResponse.json();
      setAssessments(updatedData.map(quiz => ({
        ...quiz,
        isActive: true,
        questions: quiz.questions || []
      })));
      
      setCurrentView('list');
    } catch (err) {
      setError(currentView === 'create' ? 'Failed to create assessment' : 'Failed to update assessment');
      console.error('Error saving assessment:', err);
    } finally {
      setLoading(false);
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

  // Assessment Details View
  if (currentView === 'details' && currentAssessment) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentAssessment.title}</h1>
              <p className="text-gray-600 mt-1">{currentAssessment.description}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentView('list')}
            >
              Back to Assessments
            </Button>
          </div>

          <Card>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Time Limit</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentAssessment.time_limit || 'Not specified'} minutes
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentAssessment.due_date || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>
                
                {currentAssessment.questions && currentAssessment.questions.length > 0 ? (
                  <div className="space-y-4">
                    {currentAssessment.questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{index + 1}. {question.question_text}</p>
                            <ul className="mt-2 space-y-1">
                              {[question.option1, question.option2, question.option3, question.option4]
                                .filter(opt => opt !== null && opt !== '')
                                .map((option, i) => (
                                  <li key={i} className="flex items-center">
                                    <input
                                      type="radio"
                                      checked={option === question.correct_answer}
                                      readOnly
                                      className="h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <span className="ml-2">{option}</span>
                                    {option === question.correct_answer && (
                                      <span className="ml-2 text-green-600">
                                        <Check className="h-4 w-4 inline" />
                                      </span>
                                    )}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-500">No questions found</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // Main list view
  if (currentView === 'list' && activeTab === 'manage') {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Assessments</h1>
              <p className="text-gray-600 mt-1">Create and manage student assessments</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant={activeTab === 'manage' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('manage')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Manage
              </Button>
              <Button
                variant={activeTab === 'results' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('results')}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Results
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={startCreateAssessment}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </div>

          {assessments.length === 0 ? (
            <Card>
              <div className="text-center p-8">
                <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No assessments created yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first assessment.
                </p>
                <div className="mt-6">
                  <Button onClick={startCreateAssessment}>
                    Create Assessment
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {assessments.map(assessment => (
                <Card key={assessment.id}>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                        <p className="text-gray-600 text-sm">{assessment.description}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1.5" />
                        {assessment.questions?.length || 0} questions
                      </span>
                      {assessment.time_limit && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5" />
                          {assessment.time_limit} min
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditAssessment(assessment)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewAssessmentDetails(assessment)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
    variant="outline"
    size="sm"
    onClick={() => {
      if (window.confirm('Are you sure you want to delete this assessment?')) {
        handleDeleteAssessment(assessment.id);
      }
    }}
    className="text-red-600 hover:text-red-800"
  >
    <Trash2 className="h-4 w-4 mr-2" />
    Delete
  </Button>
                     
                    </div>

                    {expandedAssessment === assessment.id && (
  <div className="mt-4 pt-4 border-t border-gray-200">
    <h4 className="font-medium mb-3">Questions Preview</h4>
    <div className="space-y-4">
      {/* Safely handle questions array */}
      {(Array.isArray(assessment.questions) ? assessment.questions : [])
        .slice(0, 3)
        .map((question, index) => (
          <div key={question.id || index} className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium">{index + 1}. {question.question_text}</p>
            <ul className="mt-2 space-y-1">
              {[question.option1, question.option2, question.option3, question.option4]
                .filter(opt => opt !== null && opt !== undefined)
                .map((option, i) => (
                  <li key={i} className="flex items-center">
                    <input
                      type="radio"
                      checked={option === question.correct_answer}
                      readOnly
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2">{option}</span>
                    {option === question.correct_answer && (
                      <span className="ml-2 text-green-600">
                        <Check className="h-4 w-4 inline" />
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      {/* Show "more questions" only if there are more than 3 */}
      {Array.isArray(assessment.questions) && assessment.questions.length > 3 && (
        <div className="text-center text-sm text-gray-500">
          + {assessment.questions.length - 3} more questions
        </div>
      )}
      {/* Show message if no questions */}
      {(!assessment.questions || assessment.questions.length === 0) && (
        <div className="text-center text-sm text-gray-500">
          No questions available for this assessment
        </div>
      )}
    </div>
  </div>
)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Create/edit form view
  if (currentView === 'create' || currentView === 'edit') {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentView === 'create' ? 'Create Assessment' : 'Edit Assessment'}
              </h1>
              <Button
                variant="outline"
                onClick={() => setCurrentView('list')}
                className="mt-2"
              >
                Back to Assessments
              </Button>
            </div>
          </div>

          <Card>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Assessment title"
                  required
                />
                
                <Input
                  label="Time Limit (minutes)"
                  type="number"
                  name="timeLimit"
                  value={formData.timeLimit}
                  onChange={handleFormChange}
                  min="1"
                />
              </div>
              
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Assessment description"
                rows={3}
              />
              
              <Input
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleFormChange}
              />
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>
                
                {formData.questions.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {formData.questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{index + 1}. {question.text}</p>
                            <ul className="mt-2 space-y-1">
                              {question.options.map((option, i) => (
                                <li key={i} className="flex items-center">
                                  <input
                                    type="radio"
                                    checked={option === question.correctAnswer}
                                    readOnly
                                    className="h-4 w-4 text-blue-600 border-gray-300"
                                  />
                                  <span className="ml-2">{option}</span>
                                  {option === question.correctAnswer && (
                                    <span className="ml-2 text-green-600">
                                      <Check className="h-4 w-4 inline" />
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editQuestion(question)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => removeQuestion(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
                    <p className="text-gray-500">No questions added yet</p>
                  </div>
                )}
                
                <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium">
                    {selectedQuestion ? 'Edit Question' : 'Add New Question'}
                  </h4>
                  
                  <Textarea
                    label="Question Text"
                    name="text"
                    value={questionForm.text}
                    onChange={handleQuestionFormChange}
                    placeholder="Enter the question"
                    rows={2}
                  />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={option === questionForm.correctAnswer}
                          onChange={() => setQuestionForm(prev => ({ 
                            ...prev, 
                            correctAnswer: option 
                          }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 mt-1">
                      Select the correct answer by clicking the radio button
                    </p>
                  </div>
                  
                  {selectedQuestion ? (
                    <div className="flex space-x-2">
                      <Button
                        onClick={updateQuestion}
                        disabled={!questionForm.text}
                        fullWidth
                      >
                        Update Question
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedQuestion(null);
                          setQuestionForm({
                            text: '',
                            type: 'multiple-choice',
                            options: ['', '', '', ''],
                            correctAnswer: '',
                            maxLength: 500
                          });
                        }}
                        fullWidth
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={addQuestionToForm}
                      disabled={!questionForm.text}
                      variant="outline"
                      fullWidth
                    >
                      Add Question
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('list')}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitAssessment}
                  disabled={!formData.title || formData.questions.length === 0 || loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      {currentView === 'create' ? 'Creating...' : 'Updating...'}
                    </span>
                  ) : (
                    currentView === 'create' ? 'Create Assessment' : 'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // Results view
  if (activeTab === 'results') {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
              <p className="text-gray-600 mt-1">View and grade student submissions</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant={activeTab === 'manage' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('manage')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Manage
              </Button>
              <Button
                variant={activeTab === 'results' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('results')}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Results
              </Button>
            </div>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assessment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students Completed
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assessments.map(assessment => (
                    <tr key={assessment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{assessment.title}</div>
                        <div className="text-sm text-gray-500">{assessment.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">0</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-500">N/A</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            loadQuizResults(assessment.id);
                            viewAssessmentDetails(assessment);
                          }}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return null;
};

export default InstructorAssessments;