import React, { useState, useEffect } from 'react';
import { Search, Calendar, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Layout from '../../components/layout/Layout';

const API_BASE = "http://localhost:5000";

const fetchAllPairings = async () => {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_BASE}/pairs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch pairings");
  return await response.json();
};

const StudentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allPairings, setAllPairings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // Fetch from backend
  useEffect(() => {
    const loadPairings = async () => {
      try {
        const data = await fetchAllPairings();
        setAllPairings(data);
      } catch (err) {
        console.error("Error fetching pairings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPairings();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-10 text-gray-600">
          Loading pairing history...
        </div>
      </Layout>
    );
  }

  // Filter pairings for current student
  const studentPairings = allPairings
    .filter(p => p.student1 === user?.name || p.student2 === user?.name)
    .map(p => ({
      ...p,
      partner: p.student1 === user?.name ? p.student2 : p.student1,
    }))
    .sort((a, b) => b.week - a.week);

  // Filter by search term
  const filteredPairings = studentPairings.filter(pairing =>
    pairing.partner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute most frequent partner
  const mostFrequentPartner = (() => {
    const partnerCounts = studentPairings.reduce((acc, p) => {
      acc[p.partner] = (acc[p.partner] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(partnerCounts).sort(([, a], [, b]) => b - a);
    return sorted.length ? sorted[0][0] : 'None';
  })();

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pairing History</h1>
            <p className="text-gray-600 mt-1">View all your past programming partners</p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search by partner name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Total Partners</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {new Set(studentPairings.map(p => p.partner)).size}
              </p>
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Total Weeks</h3>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {studentPairings.length}
              </p>
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Most Frequent</h3>
              <p className="text-lg font-semibold text-purple-600 mt-2">
                {mostFrequentPartner}
              </p>
            </div>
          </Card>
        </div>

        {/* Pairing History Table */}
        <Card>
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Week
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Partner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPairings.length > 0 ? (
                    filteredPairings.map((pairing, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-blue-600">
                                {pairing.week}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              Week {pairing.week}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-emerald-600">
                                {pairing.partner.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {pairing.partner}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pairing.createdAt
                            ? new Date(pairing.createdAt).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <User className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? 'No matching pairings found' : 'No pairing history yet'}
                          </h3>
                          <p className="text-sm">
                            {searchTerm 
                              ? 'Try adjusting your search terms'
                              : 'Your pairing history will appear here after your first assignment'}
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

export default StudentHistory;
