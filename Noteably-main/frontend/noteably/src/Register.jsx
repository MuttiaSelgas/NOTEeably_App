import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStudent } from './studentService';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [student, setStudent] = useState({
        name: '',
        course: '',
        contactNumber: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addStudent(student).then(() => {
            //alert('Registration successful');
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
                        {/* Left: Image */}
                        <div className="register-image">
                            <img src="/ASSETS/register.png" alt="Register" />
                        </div>
                        {/* Right: Registration Form */}
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
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    className="auth-input"
                                />
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