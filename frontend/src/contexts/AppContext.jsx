import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(undefined);


const initialStudents = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    registeredAt: '2024-01-15',
    currentPairing: { partner: 'Bob Smith', week: 12 },
    preferences: {
      learningStyle: 'visual',
      pace: 'medium',
      topicInterest: 'frontend',
      collaboration: 'talkative'
    }
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    registeredAt: '2024-01-16',
    currentPairing: { partner: 'Alice Johnson', week: 12 },
    preferences: {
      learningStyle: 'auditory',
      pace: 'fast',
      topicInterest: 'backend',
      collaboration: 'quiet'
    }
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    registeredAt: '2024-01-17',
    currentPairing: { partner: 'David Wilson', week: 12 },
    preferences: {
      learningStyle: 'hands-on',
      pace: 'slow',
      topicInterest: 'fullstack',
      collaboration: 'mix'
    }
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    registeredAt: '2024-01-18',
    currentPairing: { partner: 'Carol Davis', week: 12 },
    preferences: {
      learningStyle: 'visual',
      pace: 'medium',
      topicInterest: 'frontend',
      collaboration: 'talkative'
    }
  }
];

const initialPairings = [
  { id: '1', week: 10, student1: 'Alice Johnson', student2: 'Carol Davis', createdAt: '2024-12-01' },
  { id: '2', week: 10, student1: 'Bob Smith', student2: 'David Wilson', createdAt: '2024-12-01' },
  { id: '3', week: 11, student1: 'Alice Johnson', student2: 'David Wilson', createdAt: '2024-12-08' },
  { id: '4', week: 11, student1: 'Bob Smith', student2: 'Carol Davis', createdAt: '2024-12-08' },
  { id: '5', week: 12, student1: 'Alice Johnson', student2: 'Bob Smith', createdAt: '2024-12-15' },
  { id: '6', week: 12, student1: 'Carol Davis', student2: 'David Wilson', createdAt: '2024-12-15' },
];

const initialAssessments = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of basic JavaScript concepts',
    timeLimit: 30,
    dueDate: '2024-12-31',
    isActive: true,
    questions: [
      {
        id: '1',
        text: 'What is the correct way to declare a variable in JavaScript?',
        type: 'multiple-choice',
        options: ['var x = 5', 'variable x = 5', 'x := 5', 'int x = 5'],
        correctAnswer: 'var x = 5'
      },
      {
        id: '2',
        text: 'Explain the concept of hoisting in JavaScript',
        type: 'text',
        maxLength: 500
      }
    ],
    createdAt: '2024-12-01'
  },
  {
    id: '2',
    title: 'React Basics',
    description: 'Assessment on React core concepts',
    timeLimit: 45,
    dueDate: '2024-12-25',
    isActive: false,
    questions: [
      {
        id: '1',
        text: 'What is JSX?',
        type: 'multiple-choice',
        options: [
          'A JavaScript extension',
          'A template language',
          'A state management library',
          'A build tool'
        ],
        correctAnswer: 'A JavaScript extension'
      }
    ],
    createdAt: '2024-12-05'
  }
];

const initialStudentResponses = [
  {
    id: '1',
    assessmentId: '1',
    studentEmail: 'alice@example.com',
    studentName: 'Alice Johnson',
    answers: {
      '1': 'var x = 5',
      '2': 'Hoisting is when variable and function declarations are moved to the top of their scope before code execution.'
    },
    score: 95,
    submittedAt: '2024-12-15T10:30:00Z',
    gradedAt: '2024-12-16T09:15:00Z'
  }
];


export const AppProvider = ({ children }) => {
  const [students, setStudents] = useState(initialStudents);
  const [pairings, setPairings] = useState(initialPairings);
  const [currentWeek, setCurrentWeekState] = useState(12);
  const [assessments, setAssessments] = useState(initialAssessments);
  const [studentResponses, setStudentResponses] = useState(initialStudentResponses);


  const addStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString(),
      preferences: studentData.preferences || {} 
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (updatedStudent) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  
  const updateStudentPreferences = (studentId, newPreferences) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, preferences: { ...student.preferences, ...newPreferences } }
          : student
      )
    );
  };

 
  const generatePairings = (newPairings) => {
    setPairings(prev => [...prev, ...newPairings]);
    setCurrentWeekState(prev => prev + 1);
  };

  const setCurrentWeek = (week) => {
    setCurrentWeekState(week);
  };

  
  const addAssessment = (assessmentData) => {
    const newAssessment = {
      ...assessmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: assessmentData.isActive || false,
    };
    setAssessments(prev => [...prev, newAssessment]);
  };

  const updateAssessment = (updatedAssessment) => {
    setAssessments(prev =>
      prev.map(assessment =>
        assessment.id === updatedAssessment.id ? updatedAssessment : assessment
      )
    );
  };

  const toggleAssessmentStatus = (id) => {
    setAssessments(prev =>
      prev.map(assessment =>
        assessment.id === id
          ? { ...assessment, isActive: !assessment.isActive }
          : assessment
      )
    );
  };

  const deleteAssessment = (id) => {
    setAssessments(prev => prev.filter(assessment => assessment.id !== id));
  };

  
  const submitStudentResponse = async (responseData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newResponse = {
          ...responseData,
          id: Date.now().toString(),
          submittedAt: new Date().toISOString(),
          score: calculateScore(responseData.assessmentId, responseData.answers)
        };
        setStudentResponses(prev => [...prev, newResponse]);
        resolve(newResponse);
      }, 500);
    });
  };

  const calculateScore = (assessmentId, answers) => {
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment) return 0;

    let correct = 0;
    let totalGradable = 0;

    assessment.questions.forEach(question => {
      if (question.type === 'multiple-choice') {
        totalGradable++;
        if (answers[question.id] === question.correctAnswer) {
          correct++;
        }
      }
    });

    return totalGradable > 0 ? Math.round((correct / totalGradable) * 100) : 0;
  };

  const gradeResponse = (responseId, score, feedback) => {
    setStudentResponses(prev =>
      prev.map(response =>
        response.id === responseId
          ? {
              ...response,
              score,
              feedback,
              gradedAt: new Date().toISOString()
            }
          : response
      )
    );
  };

  
  return (
    <AppContext.Provider
      value={{
        students,
        pairings,
        currentWeek,
        assessments,
        studentResponses,

        addStudent,
        updateStudent,
        deleteStudent,
        generatePairings,
        setCurrentWeek,

        addAssessment,
        updateAssessment,
        toggleAssessmentStatus,
        deleteAssessment,
        submitStudentResponse,
        gradeResponse,

        
        updateStudentPreferences
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
