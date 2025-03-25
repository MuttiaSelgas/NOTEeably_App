import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStudent } from './studentService';
import { Link } from 'react-router-dom';
import './Register.css';
import Visibility from '@mui/icons-material/Visibility'; // Import MUI icon for showing password
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Import MUI icon for hiding password

const Register = () => {
    const [student, setStudent] = useState({
        name: '',
        course: '',
        contactNumber: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword); // Toggle password visibility
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addStudent(student).then(() => {
            navigate('/login');
        }).catch(error => {
            console.error('Registration failed:', error);
            alert('Registration failed');
        });
    };

    return (
        <div className="register-page">
            <header className="header">
                <Link to="/">
                    <img src="/ASSETS/noteably_logo.png" alt="Noteably Logo" className="logo" />
                </Link>
                <div className="auth-buttons">
                    <Link to="/register">
                        <button className="auth-button register">Register</button>
                    </Link>
                    <Link to="/login">
                        <button className="auth-button login">Log In</button>
                    </Link>
                </div>
            </header>

            <main className="main-content">
                <div className="auth-container">
                    <div className="register-content">
                        <div className="register-image">
                            <img src="/ASSETS/register.png" alt="Register" />
                        </div>
                        <div className="register-form">
                            <h1 className="auth-title">Register</h1>
                            <p>Existing User? <Link to="/login">Sign in</Link></p>
                            <form onSubmit={handleSubmit} className="auth-form">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    onChange={handleChange}
                                    className="auth-input"
                                />
                                <input
                                    type="text"
                                    name="course"
                                    placeholder="Course"
                                    onChange={handleChange}
                                    className="auth-input"
                                />
                                <input
                                    type="text"
                                    name="contactNumber"
                                    placeholder="Contact Number"
                                    onChange={handleChange}
                                    className="auth-input"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    className="auth-input"
                                />
                                <div className="password-container">
                                    <input
                                        type={showPassword ? "text" : "password"} // Toggle input type
                                        name="password"
                                        placeholder="Password"
                                        onChange={handleChange}
                                        className="auth-input"
                                    />
                                    {showPassword ? (
                                        <Visibility onClick={handleTogglePassword} className="toggle-password-icon" style={{ color: 'gray', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                                    ) : (
                                        <VisibilityOff onClick={handleTogglePassword} className="toggle-password-icon" style={{ color: 'gray', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                                    )}
                                </div>
                                <button type="submit" className="auth-button">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
