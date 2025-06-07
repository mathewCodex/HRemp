import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EmployeeLogin() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [values, setValues] = useState({
        email: '',
        password: ''
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
        
        if (!values.email || !values.password) {
            toast.error("Email and password are required.");
            setLoading(false);
            return;
        }
    
        try {
            const result = await axios.post(`${apiUrl}/employee/employeelogin`, values);
            if (result.data.loginStatus) {
                localStorage.setItem('valid', 'true');
                toast.success("Login successful!");
                navigate('/employeedetail/'+result.data.id);
            } else {
                const errorMessage = result.data.error || "Invalid email or password.";
                toast.error(errorMessage);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("Invalid email or password.");
            } else {
                console.error(error);
                toast.error("An error occurred.");
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
                        }}>Employee Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor='email' className="form-label" style={{
                                    color: '#5e72e4',
                                    fontWeight: '500'
                                }}>Email:</label>
                                <input
                                    type="email"
                                    id="emailInput"
                                    name='email'
                                    autoComplete='off'
                                    placeholder='example@gmail.com'
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
                                    placeholder='Your password'
                                    value={values.password}
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
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    opacity: loading ? 0.7 : 1,
                                    ':hover': {
                                        transform: loading ? 'none' : 'translateY(-2px)',
                                        boxShadow: loading ? 'none' : '0 7px 14px rgba(102, 126, 234, 0.3)'
                                    }
                                }}
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>

                            {/* Added Sign Up redirect */}
                            <div style={{
                                textAlign: 'center',
                                marginTop: '20px',
                                color: '#5e72e4'
                            }}>
                                <span>Don't have an account? </span>
                                <Link 
                                    to="/employeesignup" 
                                    style={{
                                        color: '#764ba2',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        ':hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeLogin;