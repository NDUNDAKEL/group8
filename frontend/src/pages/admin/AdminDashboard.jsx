import React, { useState, useEffect } from "react";
import { Users, Calendar, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Layout from "../../components/layout/Layout";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  
  const totalPairings = pairings.length;
  const currentWeekPairings = pairings && pairings.length > 0 ? pairings.filter((p) => p.week === currentWeek) : [];


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("auth_token");
      

      try {
        // fetch students separately
        const resStudents = await fetch("http://localhost:5000/students", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // fetch pairings separately
        const resPairs = await fetch("http://localhost:5000/pairs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resStudents.ok || !resPairs.ok) {
          throw new Error("Failed to fetch data");
        }

        const studentsData = await resStudents.json();
        const pairsData = await resPairs.json();

        setStudents(studentsData);
        setPairings(pairsData);
        console.log('Fetched data:',  pairsData);

        // derive current week
        const latestWeek =
          pairsData.length > 0 ? Math.max(...pairsData.map((p) => p.week)) : 1;
        setCurrentWeek(latestWeek);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Call backend to generate new pairings
  const handleGeneratePairings = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("http://localhost:5000/pairs/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to generate");

      const data = await response.json();
      console.log('Generated pairings:', data);
      
      // Merge new pairings into state
      setPairings((prev) => [...prev, ...data.pairings]);
      setCurrentWeek(data.week);
    } catch (error) {
      console.error(error);
      alert("Could not generate pairings");
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage students and coordinate weekly pairings
            </p>
          </div>

          <Button onClick={handleGeneratePairings}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Next Week's Pairings
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Total Students
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {students.length}
              </p>
            </div>
          </Card>

          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Current Week
              </h3>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                Week {currentWeek}
              </p>
            </div>
          </Card>

          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Total Pairings
              </h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {totalPairings}
              </p>
            </div>
          </Card>

          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Active Pairs
              </h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {currentWeekPairings.length}
              </p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/students"
              className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Manage Students</h4>
              </div>
              <p className="text-sm text-gray-600">
                Add, edit, or remove students from the system
              </p>
            </Link>

            <Link
              to="/admin/pairings"
              className="p-6 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors group"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-200">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900">View Pairings</h4>
              </div>
              <p className="text-sm text-gray-600">
                Review and manage all pairing history
              </p>
            </Link>

            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-500">
                  Schedule Pairings
                </h4>
              </div>
              <p className="text-sm text-gray-500">
                Automated scheduling (Coming Soon)
              </p>
            </div>
          </div>
        </Card>

        {/* Current Week Pairings */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Week {currentWeek} Pairings
          </h3>
          {currentWeekPairings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentWeekPairings.map((pairing, index) => (
                <div
                  key={`${pairing.student1}-${pairing.student2}-${pairing.week}-${index}`}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {pairing.student1.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {pairing.student1}
                      </span>
                    </div>
                    <span className="text-gray-400">+</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">
                        {pairing.student2}
                      </span>
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-emerald-600">
                          {pairing.student2.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No pairings for this week
              </h4>
              <p className="text-gray-600 mb-4">
                Generate new pairings to get started
              </p>
              <Button onClick={handleGeneratePairings}>
                <Plus className="h-4 w-4 mr-2" />
                Generate Pairings
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;