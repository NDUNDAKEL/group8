import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';

const API_BASE = "http://localhost:5000";

const submitPairingFeedback = async (feedbackData) => {
  const token = localStorage.getItem("auth_token"); 
  

  const response = await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(feedbackData),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Failed to submit feedback");
  }

  return await response.json(); 
};

const fetchCurrentPairing = async () => {
  const token = localStorage.getItem("auth_token");
  console.log(" Token before fetch:", token);

console.log("➡️ Calling:", `${API_BASE}/pairings/current`);

  const response = await fetch(`${API_BASE}/pairings/current`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch current pairing");
  return await response.json(); 
};

const StudentDashboard = () => {
  const { user } = useAuth();

  const [currentWeek, setCurrentWeek] = useState(null);
  const [currentPartner, setCurrentPartner] = useState(null);

  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch current pairing info from backend
  useEffect(() => {
    const loadPairing = async () => {
      try {
        const data = await fetchCurrentPairing();
        console.log(data, "daaata")
        setCurrentPartner(data.partner);
        setCurrentWeek(data.week);
      } catch (err) {
        console.error("Error fetching pairing:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPairing();
  }, []);

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      setError("Please enter some feedback");
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      await submitPairingFeedback({
        week_number: currentWeek,
        feedback_text: comment,
      });
  
      setShowSuccess(true);
      setComment("");
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-10 text-gray-600">Loading your pairing...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your current pairing status and history
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Current Week</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                Week {currentWeek}
              </p>
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Current Partner</h3>
              <p className="text-xl font-semibold text-emerald-600 mt-2">
                {currentPartner || 'Not assigned'}
              </p>
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Total Pairings</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {currentWeek ? currentWeek - 1 : 0}
              </p>
            </div>
          </Card>
        </div>

        {/* Current Pairing Card */}
        <Card>
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-white" />
            </div>
            
            {currentPartner ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  You're paired with {currentPartner}
                </h2>
                <p className="text-gray-600 mb-6">
                  Week {currentWeek} • Pairing active
                </p>

                {/* Comment Feature */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Share feedback about this pairing
                    </h3>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="How is the pairing going? Any challenges or successes to share?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    {showSuccess && (
                      <p className="text-green-500 text-sm mb-2">
                         Feedback submitted successfully!
                      </p>
                    )}
                    <div className="flex justify-center gap-3">
                      <Button 
                        variant="outline" 
                        className="px-4"
                        onClick={() => setComment('')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="px-4"
                        onClick={handleSubmitComment}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No Current Pairing
                </h2>
                <p className="text-gray-600 mb-4">
                  You'll be assigned a partner for Week {currentWeek} soon!
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-yellow-800">
                    ⏳ Waiting for this week's pairing assignment
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
