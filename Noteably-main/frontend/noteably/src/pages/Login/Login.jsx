import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStudentByStudentId, loginStudent } from '../../services/studentService';
import './Login.css';
import Header from '../../components/Header';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [animationPhase, setAnimationPhase] = useState('pass-hide');
    const [customAlertMessage, setCustomAlertMessage] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            localStorage.clear();

            const response = await loginStudent({ email, password });

            if (response) {
                console.log('Login response:', response);

                if (response.student) {
                    const studentId = response.student.studentId;
                    localStorage.setItem('studentId', studentId);
                    localStorage.setItem('studentName', response.student.name);
                    localStorage.setItem('token', response.token);

                    const fullStudentInfo = await getStudentByStudentId(studentId);
                    localStorage.setItem('fullStudentInfo', JSON.stringify(fullStudentInfo));

                    showAlert('Login successful!');
                    setTimeout(() => navigate('/dashboard'), 1500);
                } else if (response.studentId) {
                    // fallback if student object is flat
                    const studentId = response.studentId;
                    localStorage.setItem('studentId', studentId);
                    localStorage.setItem('studentName', response.name);
                    showAlert('Login successful!');
                    setTimeout(() => navigate('/dashboard'), 1500);
                } else {
                    setMessage('Invalid login response structure.');
                }
            } else {
                setMessage('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            if (error.response) {
                if (error.response.status === 401) {
                    setMessage('Unauthorized: Invalid email or password.');
                } else if (error.response.status === 403) {
                    setMessage('Forbidden: Access denied.');
                } else {
                    setMessage('Error logging in. Please check your credentials.');
                }
            } else {
                setMessage('Error logging in. Please check your credentials.');
            }
        }
    };

    const handleTogglePassword = () => {
        if (showPassword) {
            setAnimationPhase('pass-inbetween');
            setTimeout(() => setAnimationPhase('pass-hide-transition'), 200);
            setTimeout(() => {
                setAnimationPhase('pass-hide');
                setShowPassword(false);
            }, 400);
        } else {
            setAnimationPhase('pass-inbetween');
            setTimeout(() => setAnimationPhase('pass-show-transition'), 200);
            setTimeout(() => {
                setAnimationPhase('pass-show');
                setShowPassword(true);
            }, 400);
        }
    };

    const showAlert = (message) => {
        setCustomAlertMessage(message);
        setIsAlertVisible(true);
        setTimeout(() => setIsAlertVisible(false), 2000);
    };

    const imageUrl = {
        'pass-hide': '/ASSETS/pass-hide.png',
        'pass-hide-transition': '/ASSETS/pass-hide-transition.png',
        'pass-inbetween': '/ASSETS/pass-inbetween.png',
        'pass-show-transition': '/ASSETS/pass-show-transition.png',
        'pass-show': '/ASSETS/pass-show.png',
    }[animationPhase];

    return (
        <div className="login-page">
            <Header />

            <div className="login-container">
                <img
                    src={imageUrl}
                    alt="Password visibility status"
                    className={`password-image ${animationPhase}`}
                />
                <div className="login-card">
                    <h2>Welcome back~!</h2>
                    <p>No account? <Link to="/register">Sign up</Link></p>
                    <form onSubmit={handleLogin} className="login-form">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <input
                                type="checkbox"
                                className="show-password-checkbox"
                                checked={showPassword}
                                onChange={handleTogglePassword}
                            />
                        </div>
                        <button type="submit" className="login-button">Log in</button>
                    </form>
                    {message && <p className="error-message">{message}</p>}
                </div>
            </div>

            {isAlertVisible && (
                <div className="custom-alert">
                    <img src="/ASSETS/popup-alert.png" alt="Success Icon" className="alert-icon" />
                    <p>{customAlertMessage}</p>
                </div>
            )}
        </div>
    );
};

export default Login;
