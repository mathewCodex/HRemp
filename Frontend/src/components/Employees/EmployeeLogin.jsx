// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function EmployeeLogin() {
//     const apiUrl = import.meta.env.VITE_API_URL;
//     const [values, setValues] = useState({
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     axios.defaults.withCredentials = true;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setValues({ ...values, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
        
//         if (!values.email || !values.password) {
//             toast.error("Email and password are required.");
//             setLoading(false);
//             return;
//         }
    
//         try {
//             const result = await axios.post(`${apiUrl}/employee/employeelogin`, values);
//             if (result.data.loginStatus) {
//                 localStorage.setItem('valid', 'true');
//                 toast.success("Login successful!");
//                 navigate('/employeedetail/'+result.data.id);
//             } else {
//                 const errorMessage = result.data.error || "Invalid email or password.";
//                 toast.error(errorMessage);
//             }
//         } catch (error) {
//             if (error.response && error.response.status === 404) {
//                 toast.error("Invalid email or password.");
//             } else {
//                 console.error(error);
//                 toast.error("An error occurred.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     return (
//         <div id='form-body' style={{
//             background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 50%, #d4b6f4 100%)',
//             minHeight: '100vh',
//             padding: '20px'
//         }}>
//             <div className='d-flex justify-content-center align-items-center vh-100'>
//                 <div className="p-1 rounded" style={{
//                     background: 'rgba(255, 255, 255, 0.9)',
//                     boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
//                     backdropFilter: 'blur(5px)',
//                     border: '1px solid rgba(255, 255, 255, 0.3)',
//                     width: '100%',
//                     maxWidth: '400px'
//                 }}>
//                     <div style={{
//                         padding: '30px',
//                         borderRadius: '12px'
//                     }}>
//                         <h2 style={{
//                             color: '#5e72e4',
//                             textAlign: 'center',
//                             marginBottom: '30px'
//                         }}>Employee Login</h2>
//                         <form onSubmit={handleSubmit}>
//                             <div className="mb-3">
//                                 <label htmlFor='email' className="form-label" style={{
//                                     color: '#5e72e4',
//                                     fontWeight: '500'
//                                 }}>Email:</label>
//                                 <input
//                                     type="email"
//                                     id="emailInput"
//                                     name='email'
//                                     autoComplete='off'
//                                     placeholder='example@gmail.com'
//                                     value={values.email}
//                                     onChange={handleInputChange}
//                                     style={{
//                                         border: '1px solid #a1c4fd',
//                                         borderRadius: '8px',
//                                         padding: '10px',
//                                         width: '100%',
//                                         marginBottom: '15px'
//                                     }}
//                                 />
//                             </div>
//                             <div className="mb-3">
//                                 <label htmlFor='password' className="form-label" style={{
//                                     color: '#5e72e4',
//                                     fontWeight: '500'
//                                 }}>Password:</label>
//                                 <input
//                                     type="password"
//                                     name='password'
//                                     placeholder='Your password'
//                                     value={values.password}
//                                     onChange={handleInputChange}
//                                     style={{
//                                         border: '1px solid #a1c4fd',
//                                         borderRadius: '8px',
//                                         padding: '10px',
//                                         width: '100%',
//                                         marginBottom: '20px'
//                                     }}
//                                 />
//                             </div>
//                             <button 
//                                 type="submit" 
//                                 disabled={loading}
//                                 style={{
//                                     background: 'linear-gradient(to right, #667eea, #764ba2)',
//                                     color: 'white',
//                                     border: 'none',
//                                     padding: '12px 20px',
//                                     borderRadius: '8px',
//                                     width: '100%',
//                                     fontWeight: '600',
//                                     cursor: 'pointer',
//                                     transition: 'all 0.3s ease',
//                                     opacity: loading ? 0.7 : 1
//                                 }}
//                                 onMouseEnter={(e) => {
//                                     if (!loading) {
//                                         e.target.style.transform = 'translateY(-2px)';
//                                         e.target.style.boxShadow = '0 7px 14px rgba(102, 126, 234, 0.3)';
//                                     }
//                                 }}
//                                 onMouseLeave={(e) => {
//                                     e.target.style.transform = 'none';
//                                     e.target.style.boxShadow = 'none';
//                                 }}
//                             >
//                                 {loading ? 'Logging in...' : 'Log in'}
//                             </button>

//                             <div style={{
//                                 textAlign: 'center',
//                                 marginTop: '20px',
//                                 color: '#5e72e4'
//                             }}>
//                                 <span>Don't have an account? </span>
//                                 <Link 
//                                     to="/employeesignup" 
//                                     style={{
//                                         color: '#764ba2',
//                                         fontWeight: '600',
//                                         textDecoration: 'none'
//                                     }}
//                                     onMouseEnter={(e) => {
//                                         e.target.style.textDecoration = 'underline';
//                                     }}
//                                     onMouseLeave={(e) => {
//                                         e.target.style.textDecoration = 'none';
//                                     }}
//                                 >
//                                     Sign up
//                                 </Link>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
            
//             {/* Move ToastContainer to the end and add proper configuration */}
//             <ToastContainer 
//                 position="top-right"
//                 autoClose={3000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="light"
//             />
//         </div>
//     );
// }

// export default EmployeeLogin;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function EmployeeLogin() {
    // API base URL, adjusted for employee authentication
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const [values, setValues] = useState({
      email: "",
      password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    // Configure axios to send cookies with requests
    useEffect(() => {
      axios.defaults.withCredentials = true;
    }, []);

    // Check if already authenticated as an employee
    // This assumes your localStorage 'auth' object will correctly reflect the employee's role
    useEffect(() => {
      const authData = JSON.parse(localStorage.getItem("auth"));
      if (
        authData?.isAuthenticated &&
        (authData.role === "employee" || authData.role === "admin")
      ) {
        // Redirect to employee dashboard if employee or admin is already logged in
        navigate("/employeedashboard", { replace: true });
      }
    }, [navigate]);

    // Form validation logic
    const validateForm = () => {
      const newErrors = {};
      if (!values.email.trim()) {
        newErrors.email = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!values.password) {
        newErrors.password = "Password is required";
      } else if (values.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Handler for input field changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
      // Clear error message for the field as user types
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission
      if (!validateForm()) return; // Validate form inputs

      setLoading(true); // Start loading state

      try {
        // Send login request to the employee login endpoint
        const response = await axios.post(
          `${apiUrl}/api/auth/login`, // Changed API endpoint
          {
            email: values.email.trim(),
            password: values.password.trim(),
          },
          {
            withCredentials: true, // Send cookies with the request
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Employee Login response:", response.data); // Debug log

        if (response.data.loginStatus) {
          // Store authentication data in localStorage
          // Ensure 'role' is correctly captured from your backend response (e.g., response.data.role)
          const authData = {
            isAuthenticated: true,
            user: response.data.user || null, // Assuming user data comes in response.data.user
            role: response.data.role || "employee", // Default to 'employee' if not explicitly provided
          };

          localStorage.setItem("auth", JSON.stringify(authData));
          console.log(authData);
          toast.success("Employee Login successful!"); // Show success notification

          // Navigate to the employee dashboard upon successful login
          navigate("/EmployeeDashboard", { replace: true });
        } else {
          // Show error message from the backend, or a generic one
          toast.error(response.data.message || "Employee Login failed");
        }
      } catch (error) {
        console.error("Employee Login error:", error); // Log the full error

        // Handle specific error responses
        if (error.response?.status === 401) {
          toast.error("Invalid email or password");
        } else if (error.response?.status === 500) {
          toast.error("Server error. Please try again later.");
        } else if (!error.response) {
          // Network error (no response from server)
          toast.error("Network error. Please check your connection.");
        } else {
          // Generic error for other HTTP status codes
          toast.error(error.response?.data?.message || "Employee Login failed");
        }
      } finally {
        setLoading(false); // End loading state
      }
    };
    

    return (
        <div id='form-body' style={{
            background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 50%, #d4b6f4 100%)',
            minHeight: '100vh',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className="login-container" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                padding: '40px',
                width: '100%',
                maxWidth: '450px',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{
                        color: '#5e72e4',
                        marginBottom: '10px',
                        fontSize: '28px',
                        fontWeight: '700'
                    }}>
                        Employee Login
                    </h2>
                    <p style={{ color: '#6c757d', fontSize: '14px' }}>
                        Enter your credentials to access your employee dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor='email' className="form-label" style={{
                            color: '#5e72e4',
                            fontWeight: '500',
                            marginBottom: '8px',
                            display: 'block'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name='email'
                            autoComplete='username'
                            placeholder='employee@example.com' /* Changed placeholder */
                            value={values.email}
                            onChange={handleInputChange}
                            style={{
                                border: errors.email ? '1px solid #ff3860' : '1px solid #ced4da',
                                borderRadius: '8px',
                                padding: '12px 15px',
                                width: '100%',
                                fontSize: '16px',
                                transition: 'border-color 0.3s ease',
                                outline: 'none'
                            }}
                        />
                        {errors.email && (
                            <div style={{ 
                                color: '#ff3860', 
                                fontSize: '0.8rem', 
                                marginTop: '5px' 
                            }}>
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label htmlFor='password' className="form-label" style={{
                                color: '#5e72e4',
                                fontWeight: '500',
                                marginBottom: '8px',
                                display: 'block'
                            }}>
                                Password
                            </label>
                            <button 
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#6c757d',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {passwordVisible ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                name='password'
                                autoComplete='current-password'
                                placeholder='Your password'
                                value={values.password}
                                onChange={handleInputChange}
                                style={{
                                    border: errors.password ? '1px solid #ff3860' : '1px solid #ced4da',
                                    borderRadius: '8px',
                                    padding: '12px 15px',
                                    width: '100%',
                                    fontSize: '16px',
                                    transition: 'border-color 0.3s ease',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        {errors.password && (
                            <div style={{ 
                                color: '#ff3860', 
                                fontSize: '0.8rem', 
                                marginTop: '5px' 
                            }}>
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                        <Link 
                            to="/forgot-password" /* Consider a separate employee forgot password route if needed */
                            style={{
                                color: '#6c757d',
                                fontSize: '0.9rem',
                                textDecoration: 'none'
                            }}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(to right, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            padding: '14px 20px',
                            borderRadius: '8px',
                            width: '100%',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            fontSize: '16px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            marginBottom: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>

                    <div style={{
                        textAlign: 'center',
                        color: '#6c757d',
                        fontSize: '0.9rem'
                    }}>
                        Don't have an account?{' '}
                        <Link 
                            to="/employeesignup" // Changed signup link
                            style={{
                                color: '#764ba2',
                                fontWeight: '600',
                                textDecoration: 'none'
                            }}
                        >
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmployeeLogin;