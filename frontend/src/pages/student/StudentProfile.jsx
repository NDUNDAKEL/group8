import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Save,
  TrendingUp,
  Clock,
  Users as UsersIcon,
  BookOpen,
  Lock,
  Key,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Layout from "../../components/layout/Layout";

const API_BASE = "http://localhost:5000";

const StudentProfile = () => {
  const { user, updateUser } = useAuth(); // Logged-in user
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // State for learning preferences
  const [preferences, setPreferences] = useState(null);
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  // State for joined date & quick stats
  const [joinedDate, setJoinedDate] = useState(null);
  const [latestPairing, setLatestPairing] = useState(null);

  // Fetch learning preferences and user data on mount
  useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem("auth_token");

    // Fetch user data including joined date
    fetch(`${API_BASE}/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.created_at) {
          setJoinedDate(new Date(data.created_at));
        }
      })
      .catch((err) => console.error("Failed to fetch user:", err));

    // Fetch latest pairing for Quick Stats
    fetch(`${API_BASE}/pairs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const myPairings = data.filter(
          (p) => p.student1 === user.name || p.student2 === user.name
        );
        if (myPairings.length > 0) {
          const latest = [...myPairings].sort((a, b) => b.week - a.week)[0];
          setLatestPairing({
            partner:
              latest.student1 === user.name ? latest.student2 : latest.student1,
            week: latest.week,
          });
        }
      })
      .catch((err) => console.error("Failed to fetch pairings:", err));

    // Fetch learning preferences
    fetch(`${API_BASE}/learning-preferences/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error("Failed to fetch preferences");
        }
        return res.json();
      })
      .then((data) => {
        setPreferences(data || null);
        setLoadingPrefs(false);
      })
      .catch((err) => {
        console.error("Failed to load preferences:", err.message);
        setLoadingPrefs(false);
      });
  }, [user?.id, user?.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    // Password validation only when password fields are shown
    if (showPasswordFields) {
      if (!formData.current_password) {
        errors.current_password = "Current password is required";
      }
      if (!formData.new_password) {
        errors.new_password = "New password is required";
      } else if (formData.new_password.length < 8) {
        errors.new_password = "Password must be at least 8 characters";
      }
      if (!formData.confirm_password) {
        errors.confirm_password = "Please confirm your new password";
      } else if (formData.new_password !== formData.confirm_password) {
        errors.confirm_password = "Passwords do not match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const token = localStorage.getItem("auth_token");

    const dataToSend = {
      name: formData.name,
      email: formData.email,
    };

    // Only include password fields if they're being changed
    if (showPasswordFields) {
      dataToSend.current_password = formData.current_password;
      dataToSend.new_password = formData.new_password;
      dataToSend.confirm_password = formData.confirm_password;
    }

    try {
      const response = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      // First check if response is OK
      if (!response.ok) {
        // Try to parse error message
        let errorMsg = "Failed to update profile";
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          // If response isn't JSON, use status text
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      // Parse successful response
      const data = await response.json();
      
      console.log("✅ Profile updated:", data.user);
      updateUser(data.user);
      alert("Profile updated successfully!");
      setIsEditing(false);
      setShowPasswordFields(false);
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: ""
      }));
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    // Clear password fields when toggling off
    if (showPasswordFields) {
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
    setFormErrors({});
    setIsEditing(false);
    setShowPasswordFields(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600 mt-1 capitalize">{user?.role}</p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {user?.email}
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined{" "}
                    {joinedDate
                      ? joinedDate.toLocaleDateString()
                      : "Loading..."}
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Partner</span>
                  <span className="font-medium text-gray-900">
                    {latestPairing?.partner || "None"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Week</span>
                  <span className="font-medium text-gray-900">
                    {latestPairing ? `Week ${latestPairing.week}` : "N/A"}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Form & Preferences */}
          <div className="lg:col-span-2">
            {/* Profile Form */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  error={formErrors.name}
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                  error={formErrors.email}
                />

                {isEditing && (
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={togglePasswordFields}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      {showPasswordFields
                        ? "Cancel Password Change"
                        : "Change Password"}
                    </Button>

                    {showPasswordFields && (
                      <div className="mt-4 space-y-4">
                        <Input
                          label="Current Password"
                          type="password"
                          name="current_password"
                          value={formData.current_password}
                          onChange={handleChange}
                          placeholder="Enter your current password"
                          error={formErrors.current_password}
                        />
                        <Input
                          label="New Password"
                          type="password"
                          name="new_password"
                          value={formData.new_password}
                          onChange={handleChange}
                          placeholder="Enter your new password"
                          error={formErrors.new_password}
                        />
                        <Input
                          label="Confirm New Password"
                          type="password"
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          placeholder="Confirm your new password"
                          error={formErrors.confirm_password}
                        />
                      </div>
                    )}
                  </div>
                )}

                {isEditing && (
                  <div className="flex gap-4 pt-2">
                    <Button type="submit" isLoading={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </Card>

            {/* Learning Preferences */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Learning Preferences
              </h3>

              {loadingPrefs ? (
                <p className="text-gray-500">Loading preferences...</p>
              ) : preferences ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-700 mb-1">
                      <BookOpen className="h-4 w-4 mr-2" /> Learning Style
                    </div>
                    <p className="font-medium capitalize">
                      {preferences.learning_style}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-700 mb-1">
                      <Clock className="h-4 w-4 mr-2" /> Preferred Pace
                    </div>
                    <p className="font-medium capitalize">
                      {preferences.preferred_pace}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-700 mb-1">
                      <UsersIcon className="h-4 w-4 mr-2" /> Collaboration Style
                    </div>
                    <p className="font-medium capitalize">
                      {preferences.collaboration_style}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-700 mb-1">
                      <TrendingUp className="h-4 w-4 mr-2" /> Topic Interest
                    </div>
                    <p className="font-medium capitalize">
                      {preferences.preferred_topic}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  No preferences set yet. Go to the{" "}
                  <strong>Learning Preferences</strong> page to set them.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;