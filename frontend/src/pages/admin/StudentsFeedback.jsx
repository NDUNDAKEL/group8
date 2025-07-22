import React, { useState, useEffect } from "react";
import { Search, Star, MessageSquare, User } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Layout from "../../components/layout/Layout";

const API_BASE = "http://localhost:5000";

const StudentFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("auth_token");

  // Fetch all feedback on mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch feedback");

      const data = await res.json();
      console.log(data,"feedback data")

      setFeedbackList(
        data.map((f) => ({
          ...f,
          submitted_at: f.submitted_at || new Date().toISOString(),
        }))
      );
    } catch (err) {
      console.error(" Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Filter search
  const filteredFeedback = feedbackList.filter(
    (f) =>
      f.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.feedback_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-10 text-gray-600">Loading feedback...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Feedback</h1>
            <p className="text-gray-600 mt-1">
              View feedback submitted by students based on their pairings
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search feedback by student, partner, or text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Feedback Table */}
        <Card>
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Partner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feedback
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFeedback.length > 0 ? (
                    filteredFeedback.map((feedback) => (
                      <tr
                        key={feedback.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Student */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                              <span className="text-sm font-medium text-blue-600">
                                {feedback.student_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {feedback.student_name}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Partner */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {feedback.partner_name}
                        </td>

                        {/* Feedback Text */}
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span>{feedback.feedback_text}</span>
                          </div>
                        </td>

                        {/* Rating */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {renderStars(feedback.rating)}
                        </td>

                        {/* Submitted At */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(feedback.submitted_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <User className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm
                              ? "No feedback found"
                              : "No feedback submitted yet"}
                          </h3>
                          <p className="text-sm">
                            {searchTerm
                              ? "Try adjusting your search terms"
                              : "Students haven’t submitted any feedback yet."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentFeedback;
