import React, { useState, useEffect, useCallback } from 'react';
import { getImageUrl, uploadProfilePicture, axiosRequest } from '../../services/studentService';
import { Box, Modal, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LockIcon from '@mui/icons-material/Lock';
import AddIcon from '@mui/icons-material/Add';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Settings.css';
import { useNavigate } from 'react-router-dom';

const AVATAR_OPTIONS = [
  { name: 'Red', path: '/ASSETS/Profile_red.png' },
  { name: 'Orange', path: '/ASSETS/Profile_orange.png' },
  { name: 'Yellow', path: '/ASSETS/Profile_yellow.png' },
  { name: 'Green', path: '/ASSETS/Profile_green.png' },
  { name: 'Blue', path: '/ASSETS/Profile_blue.png' },
];

function SettingsPage() {
  const [student, setStudent] = useState({
    name: '', course: '', contactNumber: '', email: '',
    newPassword: '', confirmPassword: '', profilePicture: '',
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const navigate = useNavigate();

  const fetchStudentData = useCallback(async () => {
    try {
      const fullStudentInfo = localStorage.getItem('fullStudentInfo');
      if (!fullStudentInfo) return navigate('/login');
      const { id } = JSON.parse(fullStudentInfo);
      const response = await axiosRequest({ method: 'get', url: `https://noteably.onrender.com/api/students/${id}` });
      const data = response.data;
      setStudent(prev => ({
        ...prev,
        name: data.name || '',
        course: data.course || '',
        contactNumber: data.contactNumber || '',
        email: data.email || '',
        profilePicture: data.profilePicture || '/ASSETS/Profile_blue.png',
      }));
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setStudent(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      if (student.newPassword && student.newPassword !== student.confirmPassword) {
        setAlertMessage("New passwords don't match!");
        setIsAlertVisible(true);
        return;
      }
      const { id } = JSON.parse(localStorage.getItem('fullStudentInfo'));
      await axiosRequest({
        method: 'put',
        url: `https://noteeablyapp-production.up.railway.app/api/students/${id}`,
        data: {
          name: student.name,
          course: student.course,
          contactNumber: student.contactNumber,
          email: student.email,
          password: student.newPassword || undefined,
          profilePicture: student.profilePicture,
        },
        headers: { 'Content-Type': 'application/json' },
      });
      setAlertMessage('Changes saved successfully!');
      setIsAlertVisible(true);
    } catch (error) {
      setAlertMessage('Failed to save changes. Please try again.');
      setIsAlertVisible(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setAlertMessage('User logged out successfully!');
    setIsAlertVisible(true);
    setTimeout(() => navigate('/login'), 2000);
  };


  return (
    <Box sx={{
        height: '100vh', // <- Fix here
        overflow: 'hidden', // prevent scroll
        padding: '40px',
        backgroundImage: 'url("/ASSETS/polkadot.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        borderRadius: '20px',
      }}>
      
      <div className="settings-container" style={{
        display: 'flex', flexDirection: 'row', gap: '2rem',
        background: 'white', padding: '2rem', borderRadius: '20px',
        border: '1px solid lightgray', width: '100%', maxWidth: '1200px'
      }}>
        {/* Left - Profile Picture */}
        <div style={{ flex: '1', textAlign: 'center', borderRight: '1px solid lightgray', paddingRight: '2rem' }}>
          <img src={getImageUrl(student.profilePicture)} alt="Profile" style={{
            width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem'
          }} />
        </div>

        {/* Right - Info and Buttons */}
        <div style={{ flex: '2' }}>
          <h2 style={{ color: '#118AB2' }}>{student.name}</h2>
          <p style={{ color: '#666' }}>Course: {student.course}</p>
          <p style={{ color: '#666' }}>Contact: {student.contactNumber}</p>
          <p style={{ color: '#666' }}>Email: {student.email}</p>

          <div style={{ marginTop: '20px', display: 'flex', gap: '1rem' }}>
            <IconButton onClick={() => setOpenProfileModal(true)} style={{ backgroundColor: '#118AB2', color: 'white' }}><PhotoCamera /></IconButton>
            <IconButton onClick={() => setOpenInfoModal(true)} style={{ backgroundColor: '#06D6A0', color: 'white' }}><EditIcon /></IconButton>
            <IconButton onClick={() => setOpenPasswordModal(true)} style={{ backgroundColor: '#EF476F', color: 'white' }}><LockIcon /></IconButton>
          </div>

          <div className="settings-footer" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <Modal open={openProfileModal} onClose={() => setOpenProfileModal(false)}>
  <Box sx={{
    background: 'white', padding: '2rem', borderRadius: '20px',
    margin: 'auto', marginTop: '10vh', maxWidth: '500px', boxShadow: 24, textAlign: 'center'
  }}>
    <h2 style={{ color: '#118AB2' }}>Change Profile Picture</h2>

    {/* Avatars */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
      {AVATAR_OPTIONS.map((avatar) => (
        <div
          key={avatar.name}
          onClick={() => {
            setStudent(prev => ({ ...prev, profilePicture: avatar.path }));
            setUploadedFile(null);
            setUploadedImageUrl(null);
          }}
          style={{
            borderRadius: '50%', padding: '5px',
            border: student.profilePicture === avatar.path ? '3px solid #118AB2' : '2px solid lightgray',
            cursor: 'pointer', position: 'relative'
          }}
        >
          <img src={avatar.path} alt={avatar.name} style={{ width: '70px', height: '70px', borderRadius: '50%' }} />
        </div>
      ))}

      {/* Uploaded Image (if exists) */}
      {uploadedImageUrl && (
        <div
          onClick={() => {
            setStudent(prev => ({ ...prev, profilePicture: uploadedImageUrl }));
          }}
          style={{
            borderRadius: '50%', padding: '5px',
            border: student.profilePicture === uploadedImageUrl ? '3px solid #118AB2' : '2px solid lightgray',
            cursor: 'pointer', position: 'relative'
          }}
        >
          <img src={uploadedImageUrl} alt="Uploaded" style={{ width: '70px', height: '70px', borderRadius: '50%' }} />
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setUploadedFile(null);
              setUploadedImageUrl(null);
            }}
            sx={{
              position: 'absolute', top: '-8px', right: '-8px',
              backgroundColor: 'red', color: 'white', width: '20px', height: '20px'
            }}
          >
            ×
          </IconButton>
        </div>
      )}
    </div>

    {/* Plus upload button */}
    <input type="file" id="upload-file" hidden accept="image/*" onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setUploadedFile(file);
        const url = URL.createObjectURL(file);
        setUploadedImageUrl(url);
        setStudent(prev => ({ ...prev, profilePicture: url })); // select uploaded
      }
    }} />
    <label htmlFor="upload-file">
      <IconButton component="span" style={{ backgroundColor: '#06D6A0', color: 'white', marginBottom: '1rem' }}>
        <AddIcon />
      </IconButton>
    </label>
    <p style={{ fontSize: '0.8rem', color: '#666' }}>Upload your own picture</p>

    {/* Save and Cancel */}
    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <Button
        variant="contained"
        color="success"
        onClick={async () => {
          try {
            if (uploadedFile) {
              const { id } = JSON.parse(localStorage.getItem('fullStudentInfo'));
              const response = await uploadProfilePicture(id, uploadedFile);
              setStudent(prev => ({ ...prev, profilePicture: response.profilePicture }));
            }
            await handleSaveChanges(); // save changes
            setUploadedFile(null);
            setUploadedImageUrl(null);
            setOpenProfileModal(false);
          } catch (error) {
            console.error('Error saving profile picture:', error);
          }
        }}
      >
        Save
      </Button>
      <Button variant="outlined" color="error" onClick={() => {
        setUploadedFile(null);
        setUploadedImageUrl(null);
        setOpenProfileModal(false);
      }}>
        Cancel
      </Button>
    </div>
  </Box>
</Modal>


      {/* Information Modal */}
<Modal open={openInfoModal} onClose={() => setOpenInfoModal(false)}>
  <Box sx={{
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '20px',
    margin: 'auto',
    marginTop: '10vh',
    maxWidth: '420px',
    width: '90%',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    alignItems: 'center'
  }}>
    <h2 style={{ color: '#118AB2', marginBottom: '0.5rem' }}>📝 Edit Information</h2>

    <input
      id="name"
      placeholder="Name"
      value={student.name}
      onChange={handleInputChange}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        fontSize: '14px'
      }}
    />
    <input
      id="course"
      placeholder="Course"
      value={student.course}
      onChange={handleInputChange}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        fontSize: '14px'
      }}
    />
    <input
      id="contactNumber"
      placeholder="Contact Number"
      value={student.contactNumber}
      onChange={handleInputChange}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        fontSize: '14px'
      }}
    />
    <input
      id="email"
      placeholder="Email"
      value={student.email}
      onChange={handleInputChange}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        fontSize: '14px'
      }}
    />

    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem', width: '100%' }}>
      <Button
        onClick={() => { handleSaveChanges(); setOpenInfoModal(false); }}
        variant="contained"
        sx={{ backgroundColor: '#06D6A0', '&:hover': { backgroundColor: '#04b886' }, borderRadius: '10px', minWidth: '100px' }}
      >
        Save
      </Button>
      <Button
        onClick={() => setOpenInfoModal(false)}
        variant="outlined"
        sx={{ color: '#EF476F', borderColor: '#EF476F', '&:hover': { borderColor: '#d03a5a', backgroundColor: '#fce8ec' }, borderRadius: '10px', minWidth: '100px' }}
      >
        Cancel
      </Button>
    </Box>
  </Box>
</Modal>


      {/* Password Modal */}
<Modal open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
  <Box sx={{
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '20px',
    margin: 'auto',
    marginTop: '10vh',
    maxWidth: '420px',
    width: '90%',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    alignItems: 'center'
  }}>
    <h2 style={{ color: '#118AB2', marginBottom: '0.5rem' }}>🔐 Change Password</h2>

    <Box sx={{ width: '100%', position: 'relative' }}>
      <input
        id="newPassword"
        placeholder="New Password"
        type={showNewPassword ? 'text' : 'password'}
        value={student.newPassword}
        onChange={handleInputChange}
        style={{
          width: '100%',
          padding: '10px 40px 10px 12px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          fontSize: '14px',
        }}
      />
      <IconButton
        onClick={() => setShowNewPassword(!showNewPassword)}
        sx={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
      >
        {showNewPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </Box>

    <Box sx={{ width: '100%', position: 'relative' }}>
      <input
        id="confirmPassword"
        placeholder="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={student.confirmPassword}
        onChange={handleInputChange}
        style={{
          width: '100%',
          padding: '10px 40px 10px 12px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          fontSize: '14px',
        }}
      />
      <IconButton
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        sx={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
      >
        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem', width: '100%' }}>
      <Button
        onClick={() => { handleSaveChanges(); setOpenPasswordModal(false); }}
        variant="contained"
        sx={{ backgroundColor: '#06D6A0', '&:hover': { backgroundColor: '#04b886' }, borderRadius: '10px', minWidth: '100px' }}
      >
        Save
      </Button>
      <Button
        onClick={() => setOpenPasswordModal(false)}
        variant="outlined"
        sx={{ color: '#EF476F', borderColor: '#EF476F', '&:hover': { borderColor: '#d03a5a', backgroundColor: '#fce8ec' }, borderRadius: '10px', minWidth: '100px' }}
      >
        Cancel
      </Button>
    </Box>
  </Box>
</Modal>


      {isAlertVisible && (
        <div className="custom-alert">
          <img src="/ASSETS/popup-alert.png" alt="Alert" className="alert-icon" />
          <p>{alertMessage}</p>
        </div>
      )}
    </Box>
  );
}

export default SettingsPage;

