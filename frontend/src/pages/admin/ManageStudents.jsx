import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, User } from "lucide-react";
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
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [formErrors, setFormErrors] = useState({});

  const token = localStorage.getItem("auth_token");

  // Fetch all students on mount
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
      setStudents(
        data.map((s) => ({
          ...s,
          registeredAt: s.created_at || new Date().toISOString(),
        }))
      );
    } catch (err) {
      console.error(" Error fetching students:", err);
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add or Update Student
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingStudent) {
      // Update student
      await updateStudent(editingStudent.id, formData);
    } else {
      //  Create student
      await addStudent(formData);
    }

    resetForm();
    fetchStudents(); // refresh list
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
          password: "default123", //  temporary password for new student
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to add student");
        return;
      }

      alert("✅ Student added successfully");
    } catch (err) {
      console.error(" Failed to add student:", err);
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
        body: JSON.stringify({
          name: student.name,
          email: student.email,
        }),
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
      fetchStudents(); // refresh list
    } catch (err) {
      console.error(" Failed to delete student:", err);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "" });
    setFormErrors({});
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
    });
    setEditingStudent(student);
    setShowForm(true);
  };

  // Filter search
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
            <p className="text-gray-600 mt-1">
              Add, edit, and remove students from the system
            </p>
          </div>

          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

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

        {/* Students Table */}
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
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                              <span className="text-sm font-medium text-blue-600">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(student.registeredAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(student)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteStudent(student.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <User className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? "No students found" : "No students yet"}
                          </h3>
                          <p className="text-sm">
                            {searchTerm
                              ? "Try adjusting your search terms"
                              : "Add your first student to get started"}
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

export default ManageStudents;
