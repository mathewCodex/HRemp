import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EmployeeSignup() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [values, setValues] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      position: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const validateForm = () => {
      const newErrors = {};

      if (!values.name.trim()) newErrors.name = "Name is required";
      if (!values.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!values.password) {
        newErrors.password = "Password is required";
      } else if (values.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (values.password !== values.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
      // Clear error when user types
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setLoading(true);

      try {
        const { data } = await axios.post(
          `${apiUrl}/api/auth/signup`,
          {
            name: values.name,
            email: values.email,
            password: values.password,
            position: values.position,
            role: "employee",
          },
          {
            withCredentials: true,
          }
        );
       
        console.log(data);
        if (data.signupStatus) {
          toast.success("Employee account created! Redirecting to login...");
          setTimeout(() => navigate("/employeelogin"), 2000);
        } else {
          toast.error(data.error || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("Signup error:", error);
        if (error.response?.data?.errors) {
          // Handle server-side validation errors
          error.response.data.errors.forEach((err) => {
            toast.error(err.msg);
          });
        } else if (error.response?.status === 409) {
          toast.error("Email already exists.");
        } else {
          toast.error(
            error.response?.data?.error || "An error occurred during signup."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    return (
        <div id='form-body' style={{
            background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 50%, #d4b6f4 100%)',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div className='d-flex justify-content-center align-items-center vh-100'>
                <ToastContainer position="bottom-right" />
                <div className="p-1 rounded" style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    width: '100%',
                    maxWidth: '400px'
                }}>
                    <div style={{
                        padding: '30px',
                        borderRadius: '12px'
                    }}>
                        <h2 style={{
                            color: '#5e72e4',
                            textAlign: 'center',
                            marginBottom: '30px'
                        }}>Employee Signup</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor='name' className="form-label" style={{
                                    color: '#5e72e4',
                                    fontWeight: '500'
                                }}>Name:</label>
                                <input
                                    type="text"
                                    name='name'
                                    autoComplete='off'
                                    placeholder='John Doe'
                                    value={values.name}
                                    onChange={handleInputChange}
                                    style={{
                                        border: errors.name ? '1px solid #ff3860' : '1px solid #a1c4fd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        width: '100%',
                                        marginBottom: '5px'
                                    }}
                                />
                                {errors.name && <div style={{ color: '#ff3860', fontSize: '0.8rem', marginBottom: '10px' }}>{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor='email' className="form-label" style={{
                                    color: '#5e72e4',
                                    fontWeight: '500'
                                }}>Email:</label>
                                <input
                                    type="email"
                                    name='email'
                                    autoComplete='off'
                                    placeholder='employee@example.com'
                                    value={values.email}
                                    onChange={handleInputChange}
                                    style={{
                                        border: errors.email ? '1px solid #ff3860' : '1px solid #a1c4fd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        width: '100%',
                                        marginBottom: '5px'
                                    }}
                                />
                                {errors.email && <div style={{ color: '#ff3860', fontSize: '0.8rem', marginBottom: '10px' }}>{errors.email}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor='password' className="form-label" style={{
                                    color: '#5e72e4',
                                    fontWeight: '500'
                                }}>Password:</label>
                                <input
                                    type="password"
                                    name='password'
                                    placeholder='Your password (min 8 characters)'
                                    value={values.password}
                                    onChange={handleInputChange}
                                    style={{
                                        border: errors.password ? '1px solid #ff3860' : '1px solid #a1c4fd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        width: '100%',
                                        marginBottom: '5px'
                                    }}
                                />
                                {errors.password && <div style={{ color: '#ff3860', fontSize: '0.8rem', marginBottom: '10px' }}>{errors.password}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor='confirmPassword' className="form-label" style={{
                                    color: '#5e72e4',
                                    fontWeight: '500'
                                }}>Confirm Password:</label>
                                <input
                                    type="password"
                                    name='confirmPassword'
                                    placeholder='Confirm password'
                                    value={values.confirmPassword}
                                    onChange={handleInputChange}
                                    style={{
                                        border: errors.confirmPassword ? '1px solid #ff3860' : '1px solid #a1c4fd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        width: '100%',
                                        marginBottom: '5px'
                                    }}
                                />
                                {errors.confirmPassword && <div style={{ color: '#ff3860', fontSize: '0.8rem', marginBottom: '10px' }}>{errors.confirmPassword}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor='position' className="form-label" style={{
                                    color: '#5e72e4',
                                    fontWeight: '500'
                                }}>Position (Optional):</label>
                                <input
                                    type="text"
                                    name='position'
                                    placeholder='e.g., Developer, Manager'
                                    value={values.position}
                                    onChange={handleInputChange}
                                    style={{
                                        border: '1px solid #a1c4fd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        width: '100%',
                                        marginBottom: '5px'
                                    }}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{
                                    background: 'linear-gradient(to right, #667eea, #764ba2)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 20px',
                                    borderRadius: '8px',
                                    width: '100%',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                    transition: 'all 0.3s ease',
                                    marginTop: '10px'
                                }}
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                            
                            <div style={{
                                textAlign: 'center',
                                marginTop: '20px',
                                color: '#5e72e4'
                            }}>
                                Already have an account?{' '}
                                <Link 
                                    to="/employeelogin" 
                                    style={{
                                        color: '#764ba2',
                                        fontWeight: '600',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeSignup;