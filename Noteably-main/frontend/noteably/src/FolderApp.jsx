import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import './FolderApp.css';

function FolderApp() {
    const url = "http://localhost:8080/api/folders";
    const navigate = useNavigate();
    const studentId = localStorage.getItem('studentId');

    const [data, setData] = useState({
        folderId: "",
        title: "",
        dashboardId: 1
    });
    const [folders, setFolders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const [showRenameConfirm, setShowRenameConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);

    useEffect(() => {
        fetchFolders();
    }, []);

    useEffect(() => {
        // Close dropdown if clicked outside of the folder item
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null); // Close the dropdown if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside); // Listen for outside clicks

        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Clean up on unmount
        };
    }, []);

    const fetchFolders = async () => {
        try {
            const res = await Axios.get(`${url}/getByStudent/${studentId}`);
            setFolders(res.data);
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            const postUrl = `${url}/postFolderRecord`;
            const folderData = { ...data, studentId: parseInt(studentId, 10) };
            
            await Axios.post(postUrl, folderData, { headers: { 'Content-Type': 'application/json' } });
            setData({ folderId: "", title: "", dashboardId: 1 });
            setIsModalOpen(false);
            fetchFolders();
        } catch (error) {
            console.error("Error details:", error.response?.data || error.message);
            alert("Failed to create folder.");
        }
    };

    const handleConfirmedUpdate = async () => {
        try {
            const putUrl = `${url}/putFolderDetails/${data.folderId}`;
            const folderData = { ...data, studentId: parseInt(studentId, 10) };
            
            await Axios.put(putUrl, folderData, { headers: { 'Content-Type': 'application/json' } });
            setData({ folderId: "", title: "", dashboardId: 1 });
            setShowRenameConfirm(false);
            setIsModalOpen(false);
            fetchFolders();
        } catch (error) {
            console.error("Error details:", error.response?.data || error.message);
            alert("Failed to update folder.");
        }
    };

    const handle = (e) => {
        const { id, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const editFolder = (folder) => {
        setSelectedFolder(folder);
        setData({ folderId: folder.folderId, title: folder.title, dashboardId: folder.dashboardId || 1 });
        setIsModalOpen(true);
    };

    const confirmDelete = (folder) => {
        setSelectedFolder(folder);
        setShowDeleteConfirm(true);
        setOpenDropdown(null);
    };

    const handleDelete = async () => {
        try {
            await Axios.delete(`${url}/deleteFolder/${selectedFolder.folderId}`);
            setShowDeleteConfirm(false);
            fetchFolders();
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setShowRenameConfirm(true);
    };

    const filteredFolders = folders.filter((folder) => folder.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const toggleDropdown = (folderId) => {
        setOpenDropdown((prevState) => (prevState === folderId ? null : folderId)); // Toggle dropdown
    };

    const openFolder = (folderId) => {
        navigate(`/noteApp/${folderId}`, { state: { folderId } });
    };

    return (
        <main className='folder-app'>
            <div className="top-section">
                <input
                    type="text"
                    placeholder="Look for a folder"
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setIsModalOpen(true)} className="add-btn">+</button>
            </div>

            <div className="folder-grid">
                {filteredFolders.map((folder, index) => (
    <div key={folder.folderId} className="folder-item" onClick={(e) => {
        // Only open folder if not clicking dropdown or options icon
        if (!e.target.closest('.options-dropdown') && !e.target.closest('.options-icon')) {
            openFolder(folder.folderId);
        }
    }}>
        <img
            src={`./ASSETS/folder-${['blue', 'green', 'orange', 'red', 'yellow'][index % 5]}.png`}
            alt="Folder Icon"
            className="folder-icon"
        />
        <div className="folder-title" style={{ justifyContent: 'space-between' }}>
            <span>{folder.title}</span>
            <MoreVertIcon 
                className="options-icon" 
                style={{ marginLeft: 'auto' }} // Push to the right
                onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(folder.folderId);
                }} 
            />
        </div>
        {openDropdown === folder.folderId && (
            <div ref={dropdownRef} className="options-dropdown">
                <button onClick={(e) => {
                    e.stopPropagation();
                    editFolder(folder);
                }}>Rename</button>
                <button onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(folder);
                }}>Delete</button>
            </div>
        )}
    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {!showRenameConfirm ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (data.folderId) {
                                    // If updating existing folder
                                    setShowRenameConfirm(true);
                                    setIsModalOpen(false);
                                } else {
                                    // If creating new folder
                                    submit(e);
                                }
                            }}>
                                <input
                                    type="hidden"
                                    id="folderId"
                                    value={data.folderId}
                                />
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={handle}
                                    placeholder="Enter folder title"
                                    required
                                />
                                <button type="submit">{data.folderId ? 'Update' : 'Create'}</button>
                            </form>
                        ) : (
                            <div className="confirm-modal">
                                <div className="confirm-content">
                                    <div className="dialog-content-with-image">
                                        <img src="./ASSETS/popup-alert.png" alt="Edit Icon" className="dialog-icon" />
                                        <span>Are you sure you want to rename this?</span>
                                    </div>
                                    <div className="confirm-buttons">
                                        <button onClick={handleConfirmedUpdate} className="ok-btn">Ok</button>
                                        <button onClick={() => {
                                            setShowRenameConfirm(false);
                                            setIsModalOpen(true);
                                        }} className="cancel-btn">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {showRenameConfirm && (
                <div className="confirm-modal">
                    <div className="confirm-content">
                        <img src="./ASSETS/popup-alert.png" alt="Edit Icon" />
                        <div className="confirm-text">
                            <h3>Are you sure you want to rename this?</h3>
                            <div className="confirm-buttons">
                                <button onClick={handleConfirmedUpdate} className="ok-btn">Ok</button>
                                <button onClick={() => {
                                    setShowRenameConfirm(false);
                                    setIsModalOpen(true);
                                }} className="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="confirm-modal">
                    <div className="confirm-content">
                        <div className="dialog-content-with-image">
                            <img src="./ASSETS/popup-delete.png" alt="Delete Icon" className="dialog-icon"  />
                            <span>Are you sure you want to delete this?</span>
                        </div>
                        <div className="confirm-buttons">
                            <button onClick={handleDelete} className="ok-btn">Ok</button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default FolderApp;
