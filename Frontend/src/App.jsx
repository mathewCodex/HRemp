import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
// import Unauthorized from "./components/Unauthorized";
// import NotFound from "./components/NotFound";

// Constants for role management
const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
};

// Enhanced ProtectedRoute component
// In App.js, ensure ProtectedRoute checks cookies:
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get('/api/verify', {
          withCredentials: true
        });
        
        if (response.data.success) {
          setAuth(response.data.user);
        } else {
          localStorage.removeItem('auth');
        }
      } catch (err) {
        localStorage.removeItem('auth');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!auth) return <Navigate to="/adminlogin" replace />;

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/" replace />;
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
                      <Route path="adminsignup" element={<AdminSignUp />} />
          <Route path="/employeelogin" element={<EmployeeLogin />} />
          <Route path="/employeesignup" element={<EmployeeSignup />} />
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

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

          {/* 404 Not Found Route */}
          {/* <Route path="*" element={<NotFound />} /> */}
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