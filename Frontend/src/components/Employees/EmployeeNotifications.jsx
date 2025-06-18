import React, { useState, useEffect } from "react";
import { Calendar, Clock, DollarSign } from "lucide-react";
import axios from "axios";
const EmployeeNotifications = () => {
  const [notifications, setNotification] = useState([
    {
      id: 1,
      type: "leave",
      message: "Sarah Johnson requested 3 days leave",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      type: "attendance",
      message: "Late arrival alert for Mike Chen",
      time: "4 hours ago",
      status: "new",
    },
    {
      id: 3,
      type: "payroll",
      message: "Payroll processing complete for March",
      time: "1 day ago",
      status: "completed",
    },
  ]);

  // const apiUrl = import.meta.env.VITE_API_URL;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/notification/`)
      .then((result) => {
        if (result.data.success && Array.isArray(result.data.Result)) {
          setNotification(result.data.Result[0]);
        } else {
          console.error("Invalid response format:", result.data);
        }
      })
      .catch((err) => console.error(err));
  }, [setNotification]);
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Leave & Notifications
        </h3>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div
              className={`p-2 rounded-lg ${
                notification.type === "leave"
                  ? "bg-yellow-100"
                  : notification.type === "attendance"
                  ? "bg-red-100"
                  : "bg-green-100"
              }`}
            >
              {notification.type === "leave" && (
                <Calendar size={16} className="text-yellow-600" />
              )}
              {notification.type === "attendance" && (
                <Clock size={16} className="text-red-600" />
              )}
              {notification.type === "payroll" && (
                <DollarSign size={16} className="text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.message}
              </p>
              <p className="text-xs text-gray-600 mt-1">{notification.time}</p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                notification.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : notification.status === "new"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {notification.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeNotifications;
