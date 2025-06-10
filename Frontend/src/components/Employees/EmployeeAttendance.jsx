import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const Attendance = () => {
  const employees = [
    { id: 1, name: 'Sarah Johnson', department: 'Marketing', status: 'Active', performance: 92, attendance: 98 },
    { id: 2, name: 'Mike Chen', department: 'Development', status: 'Active', performance: 88, attendance: 85 },
    { id: 3, name: 'Emily Davis', department: 'HR', status: 'Active', performance: 95, attendance: 100 },
    { id: 4, name: 'James Wilson', department: 'Sales', status: 'Active', performance: 90, attendance: 92 }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Reporting</h3>
        <div className="flex gap-2">
          <button className="text-gray-600 text-sm hover:text-gray-700">Today</button>
          <button className="text-gray-600 text-sm hover:text-gray-700">Week</button>
          <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">Month</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Attendance Overview</h4>
          <div className="space-y-3">
            {employees.map(employee => (
              <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{employee.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{employee.attendance}%</span>
                  {employee.attendance >= 95 ? 
                    <CheckCircle size={16} className="text-green-600" /> :
                    <AlertCircle size={16} className="text-yellow-600" />
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Attendance Stats</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-medium">Present Today</span>
              </div>
              <span className="text-lg font-bold text-green-600">38/42</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-yellow-600" />
                <span className="text-sm font-medium">Late Arrivals</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">2</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-600" />
                <span className="text-sm font-medium">Absent</span>
              </div>
              <span className="text-lg font-bold text-red-600">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;