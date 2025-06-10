import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Clock, CheckCircle, XCircle, 
  TrendingUp, DollarSign, FileText, Settings,
  Plus, Edit, Trash2, Eye, Search, Filter,
  Download, Upload, Bell, Shield, BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      status: 'Active',
      joinDate: '2023-01-15',
      salary: 85000,
      attendance: 95,
      performance: 4.5
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      status: 'Active',
      joinDate: '2022-08-20',
      salary: 75000,
      attendance: 92,
      performance: 4.2
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@company.com',
      department: 'Sales',
      position: 'Sales Representative',
      status: 'On Leave',
      joinDate: '2023-03-10',
      salary: 65000,
      attendance: 88,
      performance: 4.0
    }
  ]);

  const [attendanceData, setAttendanceData] = useState([
    { date: '2024-06-09', employee: 'John Doe', checkIn: '09:00', checkOut: '17:30', status: 'Present' },
    { date: '2024-06-09', employee: 'Sarah Johnson', checkIn: '08:45', checkOut: '17:15', status: 'Present' },
    { date: '2024-06-09', employee: 'Mike Chen', checkIn: '', checkOut: '', status: 'Absent' }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employee: 'Mike Chen',
      type: 'Sick Leave',
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      days: 3,
      status: 'Pending',
      reason: 'Medical appointment'
    },
    {
      id: 2,
      employee: 'Sarah Johnson',
      type: 'Vacation',
      startDate: '2024-06-15',
      endDate: '2024-06-20',
      days: 5,
      status: 'Approved',
      reason: 'Family vacation'
    }
  ]);

  const [payrollData, setPayrollData] = useState([
    {
      id: 1,
      employee: 'John Doe',
      baseSalary: 85000,
      overtime: 1200,
      bonus: 5000,
      deductions: 850,
      netPay: 90350,
      status: 'Processed'
    },
    {
      id: 2,
      employee: 'Sarah Johnson',
      baseSalary: 75000,
      overtime: 800,
      bonus: 3000,
      deductions: 750,
      netPay: 78050,
      status: 'Pending'
    }
  ]);

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'Active').length,
    onLeave: employees.filter(e => e.status === 'On Leave').length,
    pendingLeaves: leaveRequests.filter(r => r.status === 'Pending').length,
    avgAttendance: Math.round(employees.reduce((acc, emp) => acc + emp.attendance, 0) / employees.length),
    avgPerformance: (employees.reduce((acc, emp) => acc + emp.performance, 0) / employees.length).toFixed(1)
  };

  const handleLeaveApproval = (id, status) => {
    setLeaveRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status } : req)
    );
  };

  const tabs = [
    { id: 'employees', label: 'Employee Records', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leaves', label: 'Leave Management', icon: Calendar },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderEmployeeRecords = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Employee Records</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-800">{stats.activeEmployees}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-gray-800">{stats.onLeave}</p>
            </div>
            <Calendar className="text-yellow-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-gray-800">{stats.avgPerformance}</p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Employee List</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Filter size={16} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Position</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Performance</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{employee.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{employee.position}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      employee.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{employee.performance}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${(employee.performance / 5) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Attendance Management</h2>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
            <Download size={16} />
            Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Upload size={16} />
            Import
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-800">
                {attendanceData.filter(a => a.status === 'Present').length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-gray-800">
                {attendanceData.filter(a => a.status === 'Absent').length}
              </p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-gray-800">{stats.avgAttendance}%</p>
            </div>
            <BarChart3 className="text-blue-500" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Today's Attendance</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Check In</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Check Out</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hours</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{record.employee}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.checkIn || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.checkOut || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {record.checkIn && record.checkOut ? '8.5' : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.status === 'Present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLeaves = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Leave Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Settings size={16} />
          Leave Policies
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingLeaves}</p>
            </div>
            <Bell className="text-yellow-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved This Month</p>
              <p className="text-2xl font-bold text-gray-800">
                {leaveRequests.filter(r => r.status === 'Approved').length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Leave Requests</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Reason</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaveRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{request.employee}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{request.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {request.startDate} to {request.endDate} ({request.days} days)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{request.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === 'Approved' 
                        ? 'bg-green-100 text-green-800' 
                        : request.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {request.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleLeaveApproval(request.id, 'Approved')}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleLeaveApproval(request.id, 'Rejected')}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPayroll = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Payroll Management</h2>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
            <Plus size={16} />
            Process Payroll
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Current Month Payroll</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Base Salary</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Overtime</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bonus</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Deductions</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Net Pay</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payrollData.map((payroll) => (
                <tr key={payroll.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{payroll.employee}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${payroll.baseSalary.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${payroll.overtime.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${payroll.bonus.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${payroll.deductions.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">${payroll.netPay.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payroll.status === 'Processed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payroll.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Attendance Report</h3>
            <Clock className="text-blue-500" size={24} />
          </div>
          <p className="text-gray-600 mb-4">Generate detailed attendance reports</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Generate Report
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Performance Report</h3>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <p className="text-gray-600 mb-4">Employee performance analytics</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Generate Report
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Payroll Report</h3>
            <DollarSign className="text-purple-500" size={24} />
          </div>
          <p className="text-gray-600 mb-4">Salary and compensation reports</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">User Management</h3>
            <Shield className="text-blue-500" size={24} />
          </div>
          <p className="text-gray-600 mb-4">Manage user roles and permissions</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Manage Users
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">System Configuration</h3>
            <Settings className="text-gray-500" size={24} />
          </div>
          <p className="text-gray-600 mb-4">Configure system settings</p>
          <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700">
            Configure
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'employees': return renderEmployeeRecords();
      case 'attendance': return renderAttendance();
      case 'leaves': return renderLeaves();
      case 'performance': return renderEmployeeRecords(); // You can create a separate performance component
      case 'payroll': return renderPayroll();
      case 'reports': return renderReports();
      case 'settings': return renderSettings();
      default: return renderEmployeeRecords();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;