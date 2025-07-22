import React, { useState } from "react";
import { BookOpen, Clock, Users, TrendingUp, CheckCircle } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Layout from "../../components/layout/Layout";

const LearningPreference = ({ student }) => {
  const [preferences, setPreferences] = useState({
    learningStyle: student?.preferences?.learningStyle || "",
    pace: student?.preferences?.pace || "",
    collaboration: student?.preferences?.collaboration || "",
    topicInterest: student?.preferences?.topicInterest || "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
  
    const token = localStorage.getItem("auth_token");
  
    const bodyData = {
      learning_style: preferences.learningStyle,
      collaboration_style: preferences.collaboration,
      preferred_pace: preferences.pace,
      preferred_topic: preferences.topicInterest,
    };
  
    const hasExistingPreferences = !!student?.preferences; 
    const method = hasExistingPreferences ? "PUT" : "POST";
  
    fetch("http://localhost:5000/learning-preferences", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Failed to save preferences");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Preferences saved:", data);
        setShowSuccess(true);
  
        // Instead of resetting completely, keep the saved preferences
        setPreferences({
          learningStyle: data.learning_style,
          pace: data.preferred_pace,
          collaboration: data.collaboration_style,
          topicInterest: data.preferred_topic,
        });
  
        setTimeout(() => setShowSuccess(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to save preferences:", err.message);
        setError(err.message);
      });
  };
  

  return (
    <Layout>
      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Learning Preferences</h2>
            {student?.name && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {student.name}
              </span>
            )}
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="rounded-md bg-green-50 p-4 mb-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-sm font-medium text-green-800">
                  Your preferences have been saved successfully!
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Learning Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                    Learning Style
                  </div>
                </label>
                <Select
                  name="learningStyle"
                  value={preferences.learningStyle}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select learning style" },
                    { value: "visual", label: "Visual (Learn by seeing)" },
                    { value: "auditory", label: "Auditory (Learn by hearing)" },
                    { value: "hands_on", label: "Hands-on (Learn by doing)" },
                  ]}
                  required
                />
              </div>

              {/* Pace */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    Pace of Learning
                  </div>
                </label>
                <Select
                  name="pace"
                  value={preferences.pace}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select preferred pace" },
                    { value: "fast", label: "Fast pace" },
                    { value: "medium", label: "Medium pace" },
                    { value: "slow", label: "Slow pace" },
                  ]}
                  required
                />
              </div>

              {/* Collaboration Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                    Collaboration Preference
                  </div>
                </label>
                <Select
                  name="collaboration"
                  value={preferences.collaboration}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select collaboration style" },
                    { value: "group_work", label: "Group work" },
                    { value: "pair_programming", label: "Pair programming" },
                    { value: "individual_work", label: "Individual work" },
                  ]}
                  required
                />
              </div>

              {/* Topic Interest */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
                    Topic Interest
                  </div>
                </label>
                <Select
                  name="topicInterest"
                  value={preferences.topicInterest}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select preferred topic" },
                    { value: "frontend", label: "Frontend Development" },
                    { value: "backend", label: "Backend Development" },
                    { value: "fullstack", label: "Fullstack Development" },
                    { value: "devops", label: "DevOps" },
                    { value: "datascience", label: "Data Science" },
                  ]}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">Save Preferences</Button>
            </div>
          </form>
        </div>
      </Card>
    </Layout>
  );
};

export default LearningPreference;
