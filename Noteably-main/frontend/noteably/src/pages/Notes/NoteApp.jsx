import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosRequest } from '../../services/studentService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NoteApp.css';
import '../Folder/FolderApp.css';

const ConfirmationDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="confirm-modal">
      <div className="confirm-content">
        <div className="dialog-content-with-image">
          <span>{message}</span>
        </div>
        <div className="confirm-buttons">
          <button onClick={onConfirm} className="ok-btn">Ok</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

function NoteApp() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const folderUrl = "https://noteeablyapp-production.up.railway.app/api/folders";
  const noteUrl = "https://noteeablyapp-production.up.railway.app/api/note";
  const parsedFolderId = parseInt(folderId, 10);

  const [data, setData] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
    note: "",
    folderId: parsedFolderId,
  });

  const [notes, setNotes] = useState([]);
  const [folderTitle, setFolderTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showRenameConfirm, setShowRenameConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const dropdownRef = useRef(null);
  const colors = ["#EF476F", "#F78C6B", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"];

  const fetchFolderDetails = useCallback(async () => {
    try {
      const res = await axiosRequest({ method: 'get', url: `${folderUrl}/${parsedFolderId}` });
      setFolderTitle(res.data.title);
    } catch (err) {
      console.error("Error fetching folder title:", err);
    }
  }, [parsedFolderId]);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axiosRequest({ method: 'get', url: `${folderUrl}/${parsedFolderId}/notes` });
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }, [parsedFolderId]);

  useEffect(() => {
    fetchFolderDetails();
    fetchNotes();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fetchFolderDetails, fetchNotes]);

  const handleChange = (value) => {
    setData((prev) => ({ ...prev, note: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!data.title.trim() || !data.note.trim()) {
      alert("Title and note cannot be empty!");
      return;
    }
    if (editingNoteId) {
      setShowRenameConfirm(true);
      return;
    }

    try {
      await axiosRequest({
        method: "post",
        url: `${noteUrl}/postnoterecord`,
        data: { ...data, folderId: parsedFolderId },
      });
      fetchNotes();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error creating note:", err);
      alert("Failed to save note.");
    }
  };

  const resetForm = () => {
    setData({
      title: "",
      date: new Date().toISOString().split('T')[0],
      note: "",
      folderId: parsedFolderId,
    });
    setEditingNoteId(null);
  };

  const handleEdit = (note) => {
    setData({
      title: note.title,
      date: new Date(note.date).toISOString().split('T')[0],
      note: note.note,
      folderId: parsedFolderId,
    });
    setEditingNoteId(note.noteId);
    setSelectedNote(note);
    setShowForm(true);
    setShowDropdown(null);
  };

  const handleDelete = (noteId) => {
    setSelectedNote({ noteId });
    setShowDeleteConfirm(true);
    setShowDropdown(null);
  };

  const confirmEdit = async () => {
    try {
      await axiosRequest({
        method: "put",
        url: `${noteUrl}/putNoteDetails/${editingNoteId}`,
        data: { ...data, folderId: parsedFolderId },
      });
      fetchNotes();
      resetForm();
      setShowForm(false);
      setShowRenameConfirm(false);
      setSelectedNote(null);
    } catch (err) {
      console.error("Error editing note:", err);
      alert("Failed to edit note.");
    }
  };

  const confirmDelete = async () => {
    try {
      await axiosRequest({ method: 'delete', url: `${noteUrl}/deleteNoteDetails/${selectedNote.noteId}` });
      fetchNotes();
      setShowDeleteConfirm(false);
      setSelectedNote(null);
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note.");
    }
  };

  const handleDropdownToggle = (noteId) => {
    setShowDropdown((prev) => (prev === noteId ? null : noteId));
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    resetForm();
  };

  const goBack = () => {
    navigate('/folders');
  };

  return (
    <div className="app-content">
      <ConfirmationDialog
        isOpen={showRenameConfirm}
        message={
          <div className="dialog-content-with-image">
            <img src="/ASSETS/popup-alert.png" alt="Edit" className="dialog-icon" />
            <span>Are you sure you want to edit this?</span>
          </div>
        }
        onConfirm={confirmEdit}
        onCancel={() => {
          setShowRenameConfirm(false);
          setSelectedNote(null);
        }}
      />
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        message={
          <div className="dialog-content-with-image">
            <img src="/ASSETS/popup-delete.png" alt="Delete" className="dialog-icon" />
            <span>Are you sure you want to delete this?</span>
          </div>
        }
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedNote(null);
        }}
      />

      <div className="folder-container">
        <div className="folder-header">
          <button id="back-button" onClick={goBack}>
            <img src="/ASSETS/backbtn.png" alt="Back" style={{ width: '20px', height: '20px' }} />
          </button>
          <div className="folder-title" style={{ fontSize: '23px', fontWeight: 'bold' }}>{folderTitle}</div>
          <small className="note-count">{notes.length} notes</small>
          <div className="folder-actions">
            <button id="add-button" onClick={toggleForm}>+</button>
          </div>
        </div>

        {showForm && (
          <div className="form-container">
            <form onSubmit={handleSubmit} className="note-form">
              <div className="form-header">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  required
                  className="form-title"
                />
                <button type="submit" className="save-button">
                  {editingNoteId ? "Save Changes" : "Save"}
                </button>
              </div>
              <input
                type="date"
                name="date"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
                required
                className="form-date"
              />
              <ReactQuill
                value={data.note}
                onChange={handleChange}
                placeholder="Write your notes here..."
                theme="snow"
                modules={{
                  toolbar: [
                    [{ font: [] }, { list: "ordered" }, { list: "bullet" }],
                    ["bold", "italic", "underline"],
                    [{ color: [] }, { background: [] }],
                    [{ header: "1" }, { header: "2" }],
                    ["link", "image"],
                  ],
                }}
              />
            </form>
          </div>
        )}

        <div className="notes-list">
          {!showForm && notes.map((note, index) => (
            <div className="note-card" style={{ backgroundColor: colors[index % colors.length] }} key={note.noteId}>
              <div>
                <div className="note-title">{note.title}</div>
                <div className="note-text">
                  {new Date(note.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div
                  className="note-content"
                  dangerouslySetInnerHTML={{ __html: note.note }}
                />
              </div>
              <div className="menu-icon" onClick={() => handleDropdownToggle(note.noteId)}>⋮</div>
              {showDropdown === note.noteId && (
                <div className="dropdown" ref={dropdownRef} style={{ '--note-color': colors[index % colors.length] }}>
                  <button className="dropdown-button edit" onClick={() => handleEdit(note)}>Edit</button>
                  <button className="dropdown-button delete" onClick={() => handleDelete(note.noteId)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoteApp;
