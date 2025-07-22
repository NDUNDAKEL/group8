import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, Users } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Layout from '../../components/layout/Layout';

const AdminPairings = () => {
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');

  // Fetch pairings from backend
  const fetchPairings = async (week = '') => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/pairs'; // default current week
      if (week) url += `?week=${week}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}` 
        }
      });
      const data = await res.json();
      setPairings(data);
    } catch (error) {
      console.error('Error fetching pairings:', error);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchPairings();
  }, []);

  // When selectedWeek changes, refetch
  useEffect(() => {
    if (selectedWeek === '') {
      fetchPairings(); // go back to current week
    } else {
      fetchPairings(selectedWeek);
    }
  }, [selectedWeek]);

  //Filter by search term
  const filteredPairings = pairings.filter(pairing =>
    searchTerm === '' ||
    pairing.student1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pairing.student2.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract weeks from current fetched pairings
  const weeks = [...new Set(pairings.map(p => p.week))].sort((a, b) => b - a);

  const handleExport = () => {
    const csvContent = [
      ['Week', 'Student 1', 'Student 2'],
      ...filteredPairings.map(p => [
        p.week,
        p.student1,
        p.student2
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pairing-history.csv';
    a.click();
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pairing Management</h1>
            <p className="text-gray-600 mt-1">
              View and manage student pairings for the current week or search past weeks
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Week selector */}
            <div>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Current Week</option>
                {/* Show only fetched weeks */}
                {weeks.map(week => (
                  <option key={week} value={week}>
                    Week {week}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              Showing {filteredPairings.length} pairings
            </div>
          </div>
        </Card>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Total Weeks (Fetched)</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{weeks.length}</p>
              </div>
            </Card>

            <Card className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Pairings Shown</h3>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{pairings.length}</p>
              </div>
            </Card>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="text-center text-gray-500">Loading pairings...</div>
        ) : (
          /* Pairings Table */
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Week
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student 1
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student 2
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPairings.length > 0 ? (
                    filteredPairings.map((pairing, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Week {pairing.week}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pairing.student1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pairing.student2}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <Users className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No pairings found for this week
                          </h3>
                          <p className="text-sm">
                            {selectedWeek
                              ? 'Try selecting another week'
                              : 'No current week pairings yet'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AdminPairings;
