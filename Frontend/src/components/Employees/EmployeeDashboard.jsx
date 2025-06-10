import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  BarChart3
} from 'lucide-react';

// Import all the separate components
import Overview from './Overview';
import EmployeeProfile from './EmployeeProfile';
import EmployeeNotifications from './EmployeeNotifications';
import EmployeePayroll from './EmployeePayroll';
import EmployeePerformance from './EmployeePerformance';
import EmployeeAttendance from './EmployeeAttendance';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'profiles':
        return <EmployeeProfile />;
      case 'notifications':
        return <EmployeeNotifications />;
      case 'payroll':
        return <EmployeePayroll />;
      case 'performance':
        return <EmployeePerformance />;
      case 'attendance':
        return <EmployeeAttendance />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management Dashboard</h1>
          <p className="text-gray-600">Manage your workforce with comprehensive tools and insights</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <TabButton 
            id="overview" 
            label="Overview" 
            icon={BarChart3} 
            active={activeTab === 'overview'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="profiles" 
            label="Employee Profiles" 
            icon={User} 
            active={activeTab === 'profiles'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="notifications" 
            label="Leave & Notifications" 
            icon={Bell} 
            active={activeTab === 'notifications'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="payroll" 
            label="Payroll" 
            icon={DollarSign} 
            active={activeTab === 'payroll'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="performance" 
            label="Performance" 
            icon={TrendingUp} 
            active={activeTab === 'performance'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="attendance" 
            label="Attendance" 
            icon={Calendar} 
            active={activeTab === 'attendance'} 
            onClick={setActiveTab} 
          />
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default EmployeeDashboard;