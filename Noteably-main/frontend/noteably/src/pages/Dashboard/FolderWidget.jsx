import React, { useEffect, useState } from 'react';
import { axiosRequest } from '../../services/studentService';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './FolderWidget.css';

const FolderWidget = () => {
    const navigate = useNavigate();
    
    const openFolder = (folderId) => {
        navigate(`/noteApp/${folderId}`);
    };

    const url = "https://noteeablyapp-production.up.railway.app/api/folders";
    const fullStudentInfo = localStorage.getItem('fullStudentInfo');
    let studentId = null;
    if (fullStudentInfo) {
        try {
            const studentObj = JSON.parse(fullStudentInfo);
            studentId = studentObj.id;
        } catch (error) {
            console.error("Error parsing fullStudentInfo from localStorage", error);
        }
    }

    const [folders, setFolders] = useState([]);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const res = await axiosRequest({ method: 'get', url: `${url}/getByStudent/${studentId}` });
                setFolders(res.data);
            } catch (error) {
                console.error("Error fetching folders:", error);
            }
        };

        fetchFolders();
    }, [studentId]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                ml: '8px',
                overflowY: 'auto',
                maxHeight: '200px', // Adjust for compact height
            }}
        >
            {folders.map((folder, index) => (
                <Box
                    key={folder.folderId}
                    className="folder-item"
                    sx={{ width: '120px', textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => openFolder(folder.folderId)}
                >
                    <img
                        src={`./ASSETS/folder-${['blue', 'green', 'orange', 'red', 'yellow'][index % 5]}.png`}
                        alt="Folder Icon"
                        className="folder-icon"
                    />
                    <Typography variant="body2">{folder.title}</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default FolderWidget;
