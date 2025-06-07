import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EmployeeSignup() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        position: '', // Optional: Add role/position field
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!values.name || !values.email || !values.password || !values.confirmPassword) {
            toast.error("All fields are required.");
            setLoading(false);
            return;
        }

        if (values.password !== values.confirmPassword) {
            toast.error("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const result = await axios.post(`${apiUrl}/employee/employeesignup`, values);
            if (result.data.signupStatus) {
                toast.success("Account created! Redirecting to login...");
                setTimeout(() => navigate('/employeelogin'), 1500);
            } else {
                const errorMessage = result.data.error || "Signup failed. Please try again.";
                toast.error(errorMessage);
            }
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error("Email already exists.");
            } else {
                console.error(error);
                toast.error("An error occurred during signup.");
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
                                }}>Full Name:</label>
                                <input
                                    type="text"
                                    name='name'
                                    placeholder='John Doe'
                                    value={values.name}
                                    onChange={handleInputChange}
                                    style={{
                                        border: '1px solid #a1c4fd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        width: '100%',
                                        marginBottom: '15px'
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='email' className="form-label" style={{
                                    color: '#5e72e4',
                                    fontWeight: '500'
                                }}>Email:</label>
                                <input
                                    type="email"
                                    name='email'
                                    placeholder='employee@company.com'
                                    value={values.email}
                                    onChange={handleInputChange}
                                    style={{
                                        border: '1px solid #a1c4fd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        width: '100%',
                                        marginBottom: '15px'
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='password' className="form-label" style={{
                                    color: '#5e72e4',
                                    fontWeight: '500'
                                }}>Password:</label>
                                <input
                                    type="password"
                                    name='password'
                                    placeholder='At least 8 characters'
                                    value={values.password}
                                    onChange={handleInputChange}
                                    style={{
                                        border: '1px solid #a1c4fd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        width: '100%',
                                        marginBottom: '15px'
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='confirmPassword' className="form-label" style={{
                                    color: '#5e72e4',
                                    fontWeight: '500'
                                }}>Confirm Password:</label>
                                <input
                                    type="password"
                                    name='confirmPassword'
                                    placeholder='Re-enter password'
                                    value={values.confirmPassword}
                                    onChange={handleInputChange}
                                    style={{
                                        border: '1px solid #a1c4fd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        width: '100%',
                                        marginBottom: '15px'
                                    }}
                                />
                            </div>
                            {/* Optional: Position/Role Field */}
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
                                        marginBottom: '20px'
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
                                    ':hover': !loading ? {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 7px 14px rgba(102, 126, 234, 0.3)'
                                    } : {}
                                }}
                            >
                                {loading ? 'Creating account...' : 'Sign Up'}
                            </button>
                            <div style={{
                                textAlign: 'center',
                                marginTop: '20px',
                                color: '#5e72e4'
                            }}>
                                <span>Already have an account? </span>
                                <Link
                                    to="/employeelogin"
                                    style={{
                                        color: '#764ba2',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        ':hover': {
                                            textDecoration: 'underline'
                                        }
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