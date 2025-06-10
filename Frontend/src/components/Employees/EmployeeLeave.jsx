import React, { useState } from 'react';
import { Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([
    { id: 1, type: 'Annual Leave', startDate: '2025-06-15', endDate: '2025-06-17', days: 3, status: 'approved', reason: 'Family vacation' },
    { id: 2, type: 'Sick Leave', startDate: '2025-05-20', endDate: '2025-05-20', days: 1, status: 'approved', reason: 'Medical appointment' },
    { id: 3, type: 'Personal Leave', startDate: '2025-06-25', endDate: '2025-06-26', days: 2, status: 'pending', reason: 'Personal matters' }
  ]);

  const [newLeave, setNewLeave] = useState({
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const handleLeaveSubmit = () => {
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const startDate = new Date(newLeave.startDate);
    const endDate = new Date(newLeave.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    const leave = {
      id: leaves.length + 1,
      ...newLeave,
      days,
      status: 'pending'
    };
    
    setLeaves([...leaves, leave]);
    setNewLeave({ type: 'Annual Leave', startDate: '', endDate: '', reason: '' });
    setShowLeaveForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Leave Management</h2>
        <button
          onClick={() => setShowLeaveForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          <span>Request Leave</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="text-sm opacity-90">Annual Leave</div>
          <div className="text-2xl font-bold">15 Days</div>
          <div className="text-sm opacity-90">Remaining</div>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="text-sm opacity-90">Sick Leave</div>
          <div className="text-2xl font-bold">8 Days</div>
          <div className="text-sm opacity-90">Remaining</div>
        </div>
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="text-sm opacity-90">Personal Leave</div>
          <div className="text-2xl font-bold">3 Days</div>
          <div className="text-sm opacity-90">Remaining</div>
        </div>
        <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="text-sm opacity-90">Used This Year</div>
          <div className="text-2xl font-bold">12 Days</div>
          <div className="text-sm opacity-90">Total</div>
        </div>
      </div>

      {showLeaveForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Request New Leave</h3>
            <button
              onClick={() => setShowLeaveForm(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={newLeave.type}
                  onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                >
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>Personal Leave</option>
                  <option>Emergency Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                value={newLeave.reason}
                onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                placeholder="Please provide a reason for your leave request..."
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleLeaveSubmit}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowLeaveForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Start Date</th>
              <th className="px-4 py-3 text-left font-semibold">End Date</th>
              <th className="px-4 py-3 text-left font-semibold">Days</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaves.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3">{leave.type}</td>
                <td className="px-4 py-3">{leave.startDate}</td>
                <td className="px-4 py-3">{leave.endDate}</td>
                <td className="px-4 py-3">{leave.days}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
                    leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                    leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {leave.status === 'approved' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    <span>{leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}</span>
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs truncate">{leave.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveManagement;