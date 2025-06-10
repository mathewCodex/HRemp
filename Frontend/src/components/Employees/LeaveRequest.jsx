import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { io } from 'socket.io-client';

const LeaveRequest = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [requests, setRequests] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io(process.env.REACT_APP_API_URL, {
      withCredentials: true
    });
    setSocket(newSocket);

    // Join user's room
    if (user?.id) {
      newSocket.emit('join', user.id);
    }

    // Listen for leave status updates
    newSocket.on('leave_status_update', (data) => {
      setRequests(prev => prev.map(req => 
        req._id === data.requestId ? { ...req, status: data.status } : req
      ));
    });

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [user]);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('/api/leave/my-requests', {
        withCredentials: true
      });
      setRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/leave', formData, {
        withCredentials: true
      });
      alert('Leave request submitted successfully!');
      setFormData({
        startDate: '',
        endDate: '',
        reason: ''
      });
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Failed to submit leave request');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Leave Request</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Reason (Optional)</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Request
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">My Leave Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Start Date</th>
              <th className="py-2 px-4 border">End Date</th>
              <th className="py-2 px-4 border">Reason</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td className="py-2 px-4 border">
                  {format(new Date(request.startDate), 'MMM dd, yyyy')}
                </td>
                <td className="py-2 px-4 border">
                  {format(new Date(request.endDate), 'MMM dd, yyyy')}
                </td>
                <td className="py-2 px-4 border">{request.reason || '-'}</td>
                <td className="py-2 px-4 border">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequest;