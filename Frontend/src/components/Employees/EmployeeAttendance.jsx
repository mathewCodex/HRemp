import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const Attendance = () => {
  // const employees = [
  //   { id: 1, name: 'Sarah Johnson', department: 'Marketing', status: 'Active', performance: 92, attendance: 98 },
  //   { id: 2, name: 'Mike Chen', department: 'Development', status: 'Active', performance: 88, attendance: 85 },
  //   { id: 3, name: 'Emily Davis', department: 'HR', status: 'Active', performance: 95, attendance: 100 },
  //   { id: 4, name: 'James Wilson', department: 'Sales', status: 'Active', performance: 90, attendance: 92 }
  // ];
  const [attendance, setAttendance] = useState([]);
  const [timeIn, setTimeIn] = useState([]);
  const [loading, setLoading] = useState(true); // optional loading state
  const [error, setError] = useState(null); // optional error state
  const user = JSON.parse(localStorage.getItem("auth"));
  console.log(user.authData.user._id);
  const userId = user.authData.user._id;
  const dateVal = new Date.now().toString();
  useEffect(() => {
    const fetchEmployeedata = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/attendance/`); // Update this to your actual endpoint
        const data = await axios.get(
          `${apiUrl}/api/attendance/date/${dateVal}`
        ); //
        setAttendance(response.data.attendance || []);
        setTimeIn(data.data.attendance || []);
        // console.log(response.data.attendance);
      } catch (err) {
        setError("Failed to fetch employees");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeedata();
  }, [setEmployees, dateVal]);
  // useEffect(() => {
  //   const getTimeArrival = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}/api/attendance/date/${}`); // Update this to your actual endpoint

  //       setAttendance(response.data.attendance || []);
  //       // console.log(response.data.attendance);
  //     } catch (err) {
  //       setError("Failed to fetch employees");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchEmployeedata();
  // }, [setEmployees]);
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Attendance Reporting
        </h3>
        <div className="flex gap-2">
          <button className="text-gray-600 text-sm hover:text-gray-700">
            Today
          </button>
          <button className="text-gray-600 text-sm hover:text-gray-700">
            Week
          </button>
          <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">
            Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">
            Attendance Overview
          </h4>
          {loading ? (
            <p className="text-sm text-gray-500">
              Loading employees attendance...
            </p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <div className="space-y-3">
              {attendance.map((attendee) => (
                <div
                  key={attendee.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {attendee.total} available
                    </span>
                    {attendee.present >= 95 ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <AlertCircle size={16} className="text-yellow-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Attendance Stats</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-medium">Present Today</span>
              </div>
              {timeIn.map((time) => (
                <span className="text-lg font-bold text-green-600">
                  {time.present}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-yellow-600" />
                <span className="text-sm font-medium">Date</span>
              </div>
              {timeIn.map((time) => (
                <span className="text-lg font-bold text-yellow-600">
                  {timeIn.date}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-600" />
                <span className="text-sm font-medium">Absent</span>
              </div>
              {timeIn.map((time) => (
                <span className="text-lg font-bold text-red-600">
                  {time.absent}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;