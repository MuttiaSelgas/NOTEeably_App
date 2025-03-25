import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Box, Typography, Paper } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import './FolderWidget.css'; // Ensure you have a CSS file for styling

import { useNavigate } from 'react-router-dom';

const FolderWidget = () => {
    const navigate = useNavigate();
    
    const openFolder = (folderId) => {
        navigate(`/noteApp/${folderId}`);
    };
    const url = "http://localhost:8080/api/folders";
    const studentId = localStorage.getItem('studentId');
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const res = await Axios.get(`${url}/getByStudent/${studentId}`);
                setFolders(res.data);
            } catch (error) {
                console.error("Error fetching folders:", error);
            }
        };

        fetchFolders();
    }, [studentId]);

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                borderRadius: '20px',
                backgroundColor: 'white',
                border: '2px solid #F78C6B', 
                boxShadow: '0 3px 2px rgba(0, 0, 0, 0.15)',
            }}
        >
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#F78C6B', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        
                    }}
                >
                    <FolderIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#F78C6B' }}>
                    Folders
                </Typography>
            </Box>
            <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    ml: '16px',
                    overflow: 'auto',
                    maxHeight: '300px',
                }}>
                {folders.map((folder, index) => (
                    <Box key={folder.folderId} className="folder-item" sx={{ width: '150px', textAlign: 'center' }} onClick={() => openFolder(folder.folderId)}>
                        <img
                            src={`./ASSETS/folder-${['blue', 'green', 'orange', 'red', 'yellow'][index % 5]}.png`}
                            alt="Folder Icon"
                            className="folder-icon"
                        />
                        <Typography variant="body2" >{folder.title}</Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default FolderWidget;