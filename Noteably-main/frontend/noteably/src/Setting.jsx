import React, { useState, useEffect, useCallback } from 'react';
import { getImageUrl, uploadProfilePicture } from './studentService';
import { IconButton, Box} from '@mui/material';
import './Settings.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AVATAR_OPTIONS = [
    { name: 'Red', path: '/ASSETS/Profile_red.png' },
    { name: 'Orange', path: '/ASSETS/Profile_orange.png' },
    { name: 'Yellow', path: '/ASSETS/Profile_yellow.png' },
    { name: 'Green', path: '/ASSETS/Profile_green.png' },
    { name: 'Blue', path: '/ASSETS/Profile_blue.png' }
];

function SettingsPage() {
    const [student, setStudent] = useState({
        name: '',
        course: '',
        contactNumber: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profilePicture: '',
    });

    const navigate = useNavigate();

    const fetchStudentData = useCallback(async () => {
        try {
            const studentId = localStorage.getItem('studentId');
            if (!studentId) {
                //alert('No student ID found. Please log in again.');
                navigate('/login');
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/students/${studentId}`);
            const studentData = response.data;
            setStudent((prevState) => ({
                ...prevState,
                name: studentData.name || '',
                course: studentData.course || '',
                contactNumber: studentData.contactNumber || '',
                email: studentData.email || '',
                profilePicture: studentData.profilePicture || '/ASSETS/Profile_blue.png',
            }));
        } catch (error) {
            console.error('Error fetching student data:', error);
            //alert('Failed to fetch student data. Please try again.');
        }
    }, [navigate]);

    useEffect(() => {
        fetchStudentData();
    }, [fetchStudentData]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setStudent((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const studentId = localStorage.getItem('studentId');
            const response = await uploadProfilePicture(studentId, file);
            
            setStudent(prev => ({
                ...prev,
                profilePicture: response.profilePicture
            }));
            
           // alert('Profile picture updated successfully!');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
           // alert('Failed to upload profile picture. Please try again.');
        }
    };

    const handleSubmit = async () => {
        try {
            if (student.newPassword && student.newPassword !== student.confirmPassword) {
                //alert("New passwords don't match!");
                return;
            }

            const studentId = localStorage.getItem('studentId');
            await axios.put(
                `http://localhost:8080/api/students/${studentId}`,
                {
                    name: student.name,
                    course: student.course,
                    contactNumber: student.contactNumber,
                    email: student.email,
                    password: student.newPassword || undefined,
                    profilePicture: student.profilePicture,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            //alert('Settings updated successfully!');
            if (student.newPassword) {
                setStudent((prevState) => ({
                    ...prevState,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }));
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            //alert('Failed to update settings. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundImage: 'url("/ASSETS/polkadot.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '20px',
            borderRadius: '30px',
            border: '1px solid lightgray',
            padding: '40px',
            marginTop: '50px',
          }}>
        <div className="settings-container">
            <div className="profile-picture-section">
                <div className="current-avatar">
                    <h2>Profile Picture</h2>
                <img 
                    src={getImageUrl(student.profilePicture)} 
                    alt="Current Profile" 
                    className="current-avatar-img"
                />
                    <div className="upload-section">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="file-input"
                            id="profile-upload"
                        />
                        <label htmlFor="profile-upload" className="upload-button">
                            Upload New Picture
                        </label>
                    </div>
                </div>
                <div className="avatar-gallery">
                    <h3>Or Choose an Avatar</h3>
                    <div className="avatar-options">
                        {AVATAR_OPTIONS.map((avatar) => (
                            <div 
                                key={avatar.name} 
                                className={`avatar-option ${student.profilePicture === avatar.path ? 'selected' : ''}`}
                                onClick={() => setStudent(prev => ({ ...prev, profilePicture: avatar.path }))}
                            >
                                <img src={avatar.path} alt={`${avatar.name} Avatar`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="settings-grid">
                <div className="settings-card">
                    <div className="card-header">
                        <h2>Edit Profile</h2>
                    </div>
                    <div className="card-content">
                        <div className="input-group">
                            <label htmlFor="name">Your Name</label>
                            <input
                                id="name"
                                type="text"
                                value={student.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="course">Course</label>
                            <input
                                id="course"
                                type="text"
                                value={student.course}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="contactNumber">Contact Number</label>
                            <input
                                id="contactNumber"
                                type="tel"
                                value={student.contactNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={student.email}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <h2>Change Password</h2>
                    </div>
                    <div className="card-content">
                        <div className="input-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={student.newPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={student.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="settings-footer">
                <button className="save-button" onClick={handleSubmit}>
                    Save Changes
                </button>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
        </Box>
    );
}

export default SettingsPage;
