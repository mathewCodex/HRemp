// // import React, { useState } from "react";
// // import { Outlet, useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { useSpring, animated } from "react-spring";
// // import Sidebar from "./Sidebar";

// // const Dashboard = () => {
// //   const navigate = useNavigate();
// //   axios.defaults.withCredentials = true;
// //   const apiUrl = import.meta.env.VITE_API_URL;

// //   const [sidebarOpen, setSidebarOpen] = useState(true);

// //   const handleLogout = () => {
// //     axios.get(`${apiUrl}/auth/logout`).then((result) => {
// //       if (result.data.Status) {
// //         localStorage.removeItem("valid");
// //         navigate("/");
// //       }
// //     });
// //   };

// //   const toggleSidebar = () => {
// //     setSidebarOpen(!sidebarOpen);
// //   };

// //   const AnimatedComponent = () => {
// //     const props = useSpring({
// //       from: { opacity: 0 },
// //       to: { opacity: 1 },
// //       config: { duration: 600 },
// //     });

// //     return (
// //       <animated.div style={props}>
// //         <Outlet />
// //       </animated.div>
// //     );
// //   };

// //   return (
// //     <div className="container-fluid" style={{ overflow: "hidden" }}>
// //       <div
// //         className={`row flex-nowrap ${
// //           sidebarOpen ? "sidebar-open" : "sidebar-closed"
// //         }`}
// //       >
// //         <Sidebar
// //           sidebarOpen={sidebarOpen}
// //           toggleSidebar={toggleSidebar}
// //           handleLogout={handleLogout}
// //         />
// //         <div className="col p-0 rounded-lg bg-white">
// //           <div className="p-3 d-flex justify-content-center top--title">
// //             <h4 className="m-0">
// //               <span
// //                 style={{ fontWeight: "bold" }}
// //                 className={`animate-charcter ${!sidebarOpen ? "hidden" : ""}`}
// //               >
// //                 WORKSUITE
// //               </span>{" "}
// //               -
// //               <span
// //                 style={{
// //                   color: "#b2b2b2",
// //                   fontSize: "1.2rem",
// //                   fontWeight: "500",
// //                 }}
// //                 className={`${!sidebarOpen ? "hidden" : ""}`}
// //               >
// //                 {" "}
// //                 Project Management System
// //               </span>
// //             </h4>
// //           </div>
// //           <div
// //             className="mt-2"
// //             style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}
// //           >
// //             <AnimatedComponent />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useSpring, animated } from "react-spring";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Sidebar from "./Sidebar";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const apiUrl = import.meta.env.VITE_API_URL;
//   axios.defaults.withCredentials = true;

//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activePath, setActivePath] = useState("");

//   // Update active path when location changes
//   useEffect(() => {
//     setActivePath(location.pathname.split("/").pop());
//   }, [location]);

//   const handleLogout = async () => {
//     try {
//       const result = await axios.get(`${apiUrl}/auth/logout`);
//       if (result.data.Status) {
//         localStorage.removeItem("valid");
//         localStorage.removeItem("role");
//         toast.success("Logged out successfully");
//         setTimeout(() => navigate("/"), 1000);
//       }
//     } catch (error) {
//       toast.error("Logout failed. Please try again.");
//       console.error("Logout error:", error);
//     }
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   // Animation for main content
//   const contentAnimation = useSpring({
//     from: { opacity: 0, transform: "translateY(20px)" },
//     to: { opacity: 1, transform: "translateY(0)" },
//     config: { tension: 300, friction: 20 },
//   });

//   // Animation for title
//   const titleAnimation = useSpring({
//     from: { opacity: 0 },
//     to: { opacity: 1 },
//     delay: 200,
//   });

//   return (
//     <div className="container-fluid dashboard-container">
//       <div
//         className={`row flex-nowrap ${
//           sidebarOpen ? "sidebar-open" : "sidebar-closed"
//         }`}
//       >
//         {/* Sidebar Component */}
//         <Sidebar
//           sidebarOpen={sidebarOpen}
//           toggleSidebar={toggleSidebar}
//           handleLogout={handleLogout}
//           activePath={activePath}
//         />

//         {/* Main Content Area */}
//         <div className="col p-0 main-content-area">
//           {/* Header Section */}
//           <animated.div 
//             className="p-3 d-flex justify-content-center align-items-center top-header"
//             style={titleAnimation}
//           >
//             <h4 className="m-0 d-flex align-items-center">
//               <span className={`brand-title ${!sidebarOpen ? "collapsed" : ""}`}>
//                 WORKSUITE
//               </span>
//               <span className={`brand-subtitle ${!sidebarOpen ? "hidden" : ""}`}>
//                 - Project Management System
//               </span>
//             </h4>
//           </animated.div>

//           {/* Main Content with Animation */}
//           <div 
//             className="content-wrapper"
//             style={{ maxHeight: "calc(100vh - 80px)" }}
//           >
//             <animated.div style={contentAnimation}>
//               <Outlet />
//             </animated.div>
//           </div>
//         </div>
//       </div>

//       {/* Global Toast Container */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       {/* CSS Styles */}
//       <style jsx>{`
//         .dashboard-container {
//           overflow: hidden;
//           height: 100vh;
//         }
//         .main-content-area {
//           background: #f8f9fa;
//           transition: all 0.3s ease;
//         }
//         .top-header {
//           background: #ffffff;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//           height: 60px;
//         }
//         .brand-title {
//           font-weight: 700;
//           color: #3a3a3a;
//           font-size: 1.4rem;
//           transition: all 0.3s ease;
//         }
//         .brand-title.collapsed {
//           font-size: 1.2rem;
//         }
//         .brand-subtitle {
//           color: #b2b2b2;
//           font-size: 1.1rem;
//           font-weight: 500;
//           margin-left: 0.5rem;
//           transition: all 0.3s ease;
//         }
//         .brand-subtitle.hidden {
//           opacity: 0;
//           width: 0;
//           margin-left: 0;
//         }
//         .content-wrapper {
//           overflow-y: auto;
//           padding: 20px;
//           background: #ffffff;
//           border-radius: 8px;
//           margin: 10px;
//           box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePath, setActivePath] = useState("");
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('auth');
        if (!authData) {
          navigate('/adminlogin');
          return;
        }

        const parsedAuth = JSON.parse(authData);
        if (!parsedAuth?.isAuthenticated) {
          navigate('/adminlogin');
          return;
        }

        setAuth(parsedAuth);
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('auth');
        navigate('/adminlogin');
      }
    };

    checkAuth();
  }, [navigate]);

  // Update active path when location changes
  useEffect(() => {
    setActivePath(location.pathname.split("/").pop());
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.get(`${apiUrl}/auth/logout`);
      localStorage.removeItem('auth');
      toast.success("Logged out successfully");
      navigate('/adminlogin');
    } catch (error) {
      console.error("Logout error:", error);
      // Even if server logout fails, clear local storage and redirect
      localStorage.removeItem('auth');
      navigate('/adminlogin');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Animation for main content
  const contentAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 20 },
  });

  // Animation for title
  const titleAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!auth) {
    return null;
  }

  return (
    <div className="container-fluid dashboard-container">
      <div className={`row flex-nowrap ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
          activePath={activePath}
          user={auth.user}
        />

        <div className="col p-0 main-content-area">
          <animated.div 
            className="p-3 d-flex justify-content-center align-items-center top-header"
            style={titleAnimation}
          >
            <h4 className="m-0 d-flex align-items-center">
              <span className={`brand-title ${!sidebarOpen ? "collapsed" : ""}`}>
                WORKSUITE
              </span>
              <span className={`brand-subtitle ${!sidebarOpen ? "hidden" : ""}`}>
                - Project Management System
              </span>
            </h4>
          </animated.div>

          <div className="content-wrapper" style={{ maxHeight: "calc(100vh - 80px)" }}>
            <animated.div style={contentAnimation}>
              <Outlet context={{ user: auth.user }} />
            </animated.div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <style jsx>{`
        .dashboard-container {
          overflow: hidden;
          height: 100vh;
        }
        .main-content-area {
          background: #f8f9fa;
          transition: all 0.3s ease;
        }
        .top-header {
          background: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          height: 60px;
        }
        .brand-title {
          font-weight: 700;
          color: #3a3a3a;
          font-size: 1.4rem;
          transition: all 0.3s ease;
        }
        .brand-title.collapsed {
          font-size: 1.2rem;
        }
        .brand-subtitle {
          color: #b2b2b2;
          font-size: 1.1rem;
          font-weight: 500;
          margin-left: 0.5rem;
          transition: all 0.3s ease;
        }
        .brand-subtitle.hidden {
          opacity: 0;
          width: 0;
          margin-left: 0;
        }
        .content-wrapper {
          overflow-y: auto;
          padding: 20px;
          background: #ffffff;
          border-radius: 8px;
          margin: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;