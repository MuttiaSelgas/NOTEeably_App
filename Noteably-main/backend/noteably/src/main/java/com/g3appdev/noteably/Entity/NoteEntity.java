package com.g3appdev.noteably.Entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "notes")
public class NoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer noteId;

    private String title;

    private LocalDate schedule;

    @Column(columnDefinition = "TEXT")
    private String note;

    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "notes"})
    private FolderEntity folder;

    // Transient field for handling folderId in REST requests
    @Transient
    private Integer folderId;

    // Getters and Setters
    public Integer getNoteId() {
        return noteId;
    }

    public void setNoteId(Integer noteId) {
        this.noteId = noteId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getSchedule() {
        return schedule;
    }

    public void setSchedule(LocalDate schedule) {
        this.schedule = schedule;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public FolderEntity getFolder() {
        return folder;
    }

    public void setFolder(FolderEntity folder) {
        this.folder = folder;
        this.folderId = folder != null ? folder.getFolderId() : null;
    }

    // Getter and setter for the transient folderId field
    public Integer getFolderId() {
        if (folderId == null && folder != null) {
            return folder.getFolderId();
        }
        return folderId;
    }

    public void setFolderId(Integer folderId) {
        this.folderId = folderId;
    }
}
