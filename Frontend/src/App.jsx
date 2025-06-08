// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "react-toastify/dist/ReactToastify.css";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import axios from "axios";
// import Login from "./components/AdminLogin";
// import AdminSignUp from "./components/AdminSignUp";
// import Dashboard from "./components/Dashboard";
// import Home from "./components/Home";
// import Employee from "./components/Employee";
// import Category from "./components/Category";
// import ManageAdmin from "./components/ManageAdmin";
// import AddCategory from "./components/AddCategory";
// import AddEmployee from "./components/AddEmployee";
// import EditEmployee from "./components/EditEmployee";
// import Start from "./components/Start";
// import EmployeeLogin from "./components/EmployeeLogin";
// import EmployeeDetail from "./components/EmployeeDetail";
// import PrivateRoute from "./components/PrivateRoute";
// import Office from "./components/Office";
// import AdminProjects from "./components/PMT/AdminProjects";
// import AdminTasks from "./components/PMT/AdminTasks";
// import Clients from "./components/PMT/Clients";
// import EmployeeSignup from "./components/EmployeeSignUp";

// // Constants for role management
// const ROLES = {
//   ADMIN: 'admin',
//   EMPLOYEE: 'employee'
// };

// // Enhanced ProtectedRoute component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const [auth, setAuth] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const verifyAuth = async () => {
//       try {
//         // First check localStorage
//         const authData = localStorage.getItem('auth');
//         if (!authData) {
//           setLoading(false);
//           return;
//         }

//         const parsedAuth = JSON.parse(authData);
//         if (!parsedAuth?.isAuthenticated) {
//           localStorage.removeItem('auth');
//           setLoading(false);
//           return;
//         }

//         // Verify with server
//         const response = await axios.get('/api/verify', {
//           withCredentials: true
//         });
        
//         if (response.data.Status) {
//           setAuth({
//             ...parsedAuth,
//             role: response.data.role || parsedAuth.role,
//             id: response.data.id
//           });
//         } else {
//           localStorage.removeItem('auth');
//           setAuth(null);
//         }
//       } catch (err) {
//         console.error('Auth verification failed:', err);
//         localStorage.removeItem('auth');
//         setAuth(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyAuth();
//   }, []);

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!auth || !auth.isAuthenticated) {
//     return <Navigate to="/adminlogin" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(auth.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// function App() {
//   // Set axios defaults
//   useEffect(() => {
//     axios.defaults.withCredentials = true;
//     axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//   }, []);

//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Start />} />
//           <Route path="/adminlogin" element={<Login />} />
//           <Route path="/adminsignup" element={<AdminSignUp />} />
//           <Route path="/employeelogin" element={<EmployeeLogin />} />
//           <Route path="/employeesignup" element={<EmployeeSignup />} />

//           {/* Employee Routes */}
//           <Route
//             path="/employeedetail/:id"
//             element={
//               <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.ADMIN]}>
//                 <EmployeeDetail />
//               </ProtectedRoute>
//             }
//           />

//           {/* Admin Dashboard with Nested Routes */}
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<Home />} />
//             <Route path="employee" element={<Employee />} />
//             <Route path="category" element={<Category />} />
//             <Route path="manageadmin" element={<ManageAdmin />} />
//             <Route path="add_category" element={<AddCategory />} />
//             <Route path="add_employee" element={<AddEmployee />} />
//             <Route path="edit_employee/:id" element={<EditEmployee />} />
//             <Route path="projects" element={<AdminProjects />} />
//             <Route path="clients" element={<Clients />} />
//             <Route path="tasks" element={<AdminTasks />} />
//             <Route path="officeaddress" element={<Office />} />
//           </Route>

//           {/* Fallback route */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>

//       {/* Global Toast Container */}
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </>
//   );
// }

// export default App;
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react"; // Add these imports
import axios from "axios"; // Add this import

import Login from "./components/AdminLogin";
import AdminSignUp from "./components/AdminSignUp";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Employee from "./components/Employee";
import Category from "./components/Category";
import ManageAdmin from "./components/ManageAdmin";
import AddCategory from "./components/AddCategory";
import AddEmployee from "./components/AddEmployee";
import EditEmployee from "./components/EditEmployee";
import Start from "./components/Start";
import EmployeeLogin from "./components/EmployeeLogin";
import EmployeeDetail from "./components/EmployeeDetail";
import PrivateRoute from "./components/PrivateRoute";
import Office from "./components/Office";
import AdminProjects from "./components/PMT/AdminProjects";
import AdminTasks from "./components/PMT/AdminTasks";
import Clients from "./components/PMT/Clients";
import EmployeeSignup from "./components/EmployeeSignUp";

// Constants for role management
const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
};

// Enhanced ProtectedRoute component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // First check localStorage
        const authData = JSON.parse(localStorage.getItem('auth'));
        if (!authData?.isAuthenticated) {
          setLoading(false);
          return;
        }

        // Verify with server
        const response = await axios.get(`${apiUrl}/verify`, {
          withCredentials: true
        });
        
        if (response.data.Status) {
          setAuth({
            isAuthenticated: true,
            user: response.data.user || authData.user,
            role: response.data.role || authData.user?.role
          });
        } else {
          localStorage.removeItem('auth');
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        localStorage.removeItem('auth');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [apiUrl]);

  if (loading) return <div>Loading...</div>;

  if (!auth?.isAuthenticated) return <Navigate to="/adminlogin" replace />;

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Start />} />
          <Route path="/adminlogin" element={<Login />} />
          <Route path="/adminsignup" element={<AdminSignUp />} />
          <Route path="/employeelogin" element={<EmployeeLogin />} />
          <Route path="/employeesignup" element={<EmployeeSignup />} />

          {/* Employee Routes */}
          <Route
            path="/employeedetail/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.ADMIN]}>
                <EmployeeDetail />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard with Nested Routes */}
          <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="employee" element={<Employee />} />
            <Route path="category" element={<Category />} />
            <Route path="manageadmin" element={<ManageAdmin />} />
            <Route path="add_category" element={<AddCategory />} />
            <Route path="add_employee" element={<AddEmployee />} />
            <Route path="edit_employee/:id" element={<EditEmployee />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="clients" element={<Clients />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="officeaddress" element={<Office />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Global Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;