import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, User, Lock } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Layout from "../../components/layout/Layout";

const API_BASE = "http://localhost:5000";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "",
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();
      const studentsOnly = data.filter((s) => s.role === "student");

      setStudents(
        studentsOnly.map((s) => ({
          ...s,
          registeredAt: s.created_at || new Date().toISOString(),
        }))
      );
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    } else if (
      students.some(
        (s) => s.email === formData.email && s.id !== editingStudent?.id
      )
    ) {
      errors.email = "Email already exists";
    }

    // Password validation only when editing and password fields are shown
    if (editingStudent && showPasswordFields) {
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

    const dataToSend = {
      name: formData.name,
      email: formData.email
    };

    // Only include password fields if they're being changed
    if (editingStudent && showPasswordFields) {
      dataToSend.current_password = formData.current_password;
      dataToSend.new_password = formData.new_password;
      dataToSend.confirm_password = formData.confirm_password;
    }

    if (editingStudent) {
      await updateStudent(editingStudent.id, dataToSend);
    } else {
      await addStudent(dataToSend);
    }

    resetForm();
    fetchStudents();
  };

  const addStudent = async (student) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          name: student.name,
          email: student.email,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to add student");
        return;
      }

      alert("✅ Student added successfully");
    } catch (err) {
      console.error("Failed to add student:", err);
    }
  };

  const updateStudent = async (id, student) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(student),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update student");
        return;
      }

      alert("Student updated successfully");
    } catch (err) {
      console.error("Failed to update student:", err);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete student");
        return;
      }

      alert("✅ Student deleted successfully");
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student:", err);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: "", 
      email: "",
      current_password: "",
      new_password: "",
      confirm_password: ""
    });
    setFormErrors({});
    setShowForm(false);
    setEditingStudent(null);
    setShowPasswordFields(false);
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      current_password: "",
      new_password: "",
      confirm_password: ""
    });
    setEditingStudent(student);
    setShowForm(true);
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    // Clear password fields when toggling off
    if (showPasswordFields) {
      setFormData(prev => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: ""
      }));
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-10 text-gray-600">Loading students...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header and search remain the same */}
        {/* ... */}

        {/* Add/Edit Form */}
        {showForm && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  error={formErrors.name}
                  placeholder="Enter student's full name"
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  error={formErrors.email}
                  placeholder="Enter student's email"
                />

                {/* Password change section (only shown when editing) */}
                {editingStudent && (
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={togglePasswordFields}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {showPasswordFields ? "Cancel Password Change" : "Change Password"}
                      </Button>
                    </div>

                    {showPasswordFields && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <Input
                          label="Current Password"
                          type="password"
                          value={formData.current_password}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, current_password: e.target.value }))
                          }
                          error={formErrors.current_password}
                          placeholder="Enter current password"
                        />

                        <Input
                          label="New Password"
                          type="password"
                          value={formData.new_password}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, new_password: e.target.value }))
                          }
                          error={formErrors.new_password}
                          placeholder="Enter new password"
                        />

                        <Input
                          label="Confirm Password"
                          type="password"
                          value={formData.confirm_password}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, confirm_password: e.target.value }))
                          }
                          error={formErrors.confirm_password}
                          placeholder="Confirm new password"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit">
                  {editingStudent ? "Update Student" : "Add Student"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Students Table (remains the same) */}
        {/* ... */}
      </div>
    </Layout>
  );
};

export default ManageStudents;