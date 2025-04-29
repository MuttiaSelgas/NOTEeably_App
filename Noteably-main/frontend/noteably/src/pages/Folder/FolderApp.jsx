import React, { useState, useEffect, useRef, useCallback } from 'react';
import { axiosRequest, getAuthToken } from '../../services/studentService';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import './FolderApp.css';

function FolderApp() {
  const url = "http://localhost:8080/api/folders";
  const navigate = useNavigate();

  const fullStudentInfo = localStorage.getItem('fullStudentInfo');
  const studentId = (() => {
    try {
      return fullStudentInfo ? JSON.parse(fullStudentInfo).id : null;
    } catch {
      return null;
    }
  })();

  const [data, setData] = useState({ folderId: "", title: "", dashboardId: 1 });
  const [folders, setFolders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [showRenameConfirm, setShowRenameConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const fetchFolders = useCallback(async () => {
    if (!studentId) return;
    try {
      const res = await axiosRequest({ method: 'get', url: `${url}/getByStudent/${studentId}` });
      setFolders(res.data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  }, [studentId]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!studentId) return;
    try {
      const folderData = { ...data, studentId };
      await axiosRequest({ method: 'post', url: `${url}/postFolderRecord`, data: folderData });
      setData({ folderId: "", title: "", dashboardId: 1 });
      setIsModalOpen(false);
      fetchFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder.");
    }
  };

  const handleConfirmedUpdate = async () => {
    if (!studentId) return;
    try {
      const folderData = { ...data, studentId };
      await axiosRequest({ method: 'put', url: `${url}/putFolderDetails/${data.folderId}`, data: folderData });
      setData({ folderId: "", title: "", dashboardId: 1 });
      setShowRenameConfirm(false);
      setIsModalOpen(false);
      fetchFolders();
    } catch (error) {
      console.error("Error updating folder:", error);
      alert("Failed to update folder.");
    }
  };

  const handle = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
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
      const token = getAuthToken();
      await axiosRequest({
        method: 'delete',
        url: `${url}/deleteFolder/${selectedFolder.folderId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteConfirm(false);
      fetchFolders();
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const filteredFolders = folders.filter(folder =>
    folder.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeModal = () => setIsModalOpen(false);
  const toggleDropdown = (id) => setOpenDropdown(prev => (prev === id ? null : id));
  const openFolder = (id) => navigate(`/noteApp/${id}`, { state: { folderId: id } });

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
                style={{ marginLeft: 'auto' }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(folder.folderId);
                }}
              />
            </div>
            {openDropdown === folder.folderId && (
              <div ref={dropdownRef} className="options-dropdown">
                <button onClick={(e) => { e.stopPropagation(); editFolder(folder); }}>Rename</button>
                <button onClick={(e) => { e.stopPropagation(); confirmDelete(folder); }}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '10px', color: '#073B4C', fontWeight: 'bold' }}>
              {data.folderId ? 'Edit Folder' : 'Create Folder'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              data.folderId ? (setShowRenameConfirm(true), setIsModalOpen(false)) : submit(e);
            }}>
              <input type="hidden" id="folderId" value={data.folderId} />
              <input
                type="text"
                id="title"
                value={data.title}
                onChange={handle}
                placeholder="Enter folder title"
                required
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #ccc',
                  fontSize: '15px',
                  backgroundColor: '#fff',
                  marginBottom: '15px'
                }}
              />
              <button type="submit" className="submit-folder-btn">
                {data.folderId ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Rename */}
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

      {/* Confirm Delete */}
      {showDeleteConfirm && (
        <div className="confirm-modal">
          <div className="confirm-content">
            <div className="dialog-content-with-image">
              <img src="./ASSETS/popup-delete.png" alt="Delete Icon" className="dialog-icon" />
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
