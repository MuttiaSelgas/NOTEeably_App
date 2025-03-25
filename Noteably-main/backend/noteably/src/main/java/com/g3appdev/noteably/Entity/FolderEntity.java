package com.g3appdev.noteably.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "folders")
public class FolderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer folderId;

    private String title;

    private int studentId;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("folder")
    private List<NoteEntity> notes = new ArrayList<>();

    // Getters and Setters
    public Integer getFolderId() {
        return folderId;
    }

    public void setFolderId(Integer folderId) {
        this.folderId = folderId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public List<NoteEntity> getNotes() {
        return notes;
    }

    public void setNotes(List<NoteEntity> notes) {
        this.notes = notes;
        if (notes != null) {
            for (NoteEntity note : notes) {
                note.setFolder(this);
            }
        }
    }

    // Helper method to add a note
    public void addNote(NoteEntity note) {
        notes.add(note);
        note.setFolder(this);
    }

    // Helper method to remove a note
    public void removeNote(NoteEntity note) {
        notes.remove(note);
        note.setFolder(null);
    }
}
