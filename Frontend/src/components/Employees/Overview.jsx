import React from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  User, 
  DollarSign, 
  Bell, 
  FileText, 
  Settings 
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`text-${color}-600`} size={24} />
      </div>
    </div>
  </div>
);

const Overview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees" 
          value="42" 
          change="+3 this month" 
          icon={Users} 
        />
        <StatCard 
          title="Attendance Rate" 
          value="94.2%" 
          change="+2.1%" 
          icon={Calendar} 
          color="green"
        />
        <StatCard 
          title="Pending Leaves" 
          value="8" 
          change="-2 from last week" 
          icon={Clock} 
          color="yellow"
        />
        <StatCard 
          title="Performance Avg" 
          value="91.3%" 
          change="+5.2%" 
          icon={TrendingUp} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <User size={16} className="text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">New employee onboarded</p>
                <p className="text-xs text-gray-600">John Smith joined the Development team</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <DollarSign size={16} className="text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Payroll processed</p>
                <p className="text-xs text-gray-600">March 2024 payroll completed successfully</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
              <Bell size={16} className="text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Leave request pending</p>
                <p className="text-xs text-gray-600">Sarah Johnson - 3 days vacation leave</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <User size={18} />
              <span className="font-medium">Add Employee</span>
            </button>
            <button className="flex items-center gap-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <DollarSign size={18} />
              <span className="font-medium">Run Payroll</span>
            </button>
            <button className="flex items-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <FileText size={18} />
              <span className="font-medium">Generate Report</span>
            </button>
            <button className="flex items-center gap-2 p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <Settings size={18} />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;