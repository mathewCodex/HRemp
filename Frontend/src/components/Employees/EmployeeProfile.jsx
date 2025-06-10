import React from 'react';
import { Search, Filter, MoreVertical } from 'lucide-react';

const EmployeeProfile = () => {
  const employees = [
    { id: 1, name: 'Sarah Johnson', department: 'Marketing', status: 'Active', performance: 92, attendance: 98 },
    { id: 2, name: 'Mike Chen', department: 'Development', status: 'Active', performance: 88, attendance: 85 },
    { id: 3, name: 'Emily Davis', department: 'HR', status: 'Active', performance: 95, attendance: 100 },
    { id: 4, name: 'James Wilson', department: 'Sales', status: 'Active', performance: 90, attendance: 92 }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Employee Profiles</h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Search size={18} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Filter size={18} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {employees.map(employee => (
          <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{employee.name}</h4>
                <p className="text-sm text-gray-600">{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {employee.status}
              </span>
              <button className="p-1 hover:bg-gray-200 rounded">
                <MoreVertical size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeProfile;