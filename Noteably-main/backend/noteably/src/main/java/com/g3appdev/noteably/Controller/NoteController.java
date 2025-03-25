package com.g3appdev.noteably.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.g3appdev.noteably.Entity.NoteEntity;
import com.g3appdev.noteably.Entity.FolderEntity;
import com.g3appdev.noteably.Service.NoteService;
import com.g3appdev.noteably.Service.FolderService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/note")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private FolderService folderService;

    // Create operation
    @PostMapping("/postnoterecord")
    public NoteEntity createNote(@RequestBody NoteEntity note) {
        if (note.getFolderId() != null) {
            folderService.getFolderById(note.getFolderId())
                .ifPresent(folder -> note.setFolder(folder));
        }
        return noteService.createNote(note);
    }

    // Read operation - get all notes
    @GetMapping("/getAllNotes")
    public List<NoteEntity> getAllNotes() {
        return noteService.getAllNotes();
    }

    // Read operation - get notes by folder
    @GetMapping("/folder/{folderId}")
    public List<NoteEntity> getNotesByFolder(@PathVariable Integer folderId) {
        return noteService.getNotesByFolder(folderId);
    }

    // Read operation - get single note
    @GetMapping("/{id}")
    public NoteEntity getNoteById(@PathVariable Integer id) {
        return noteService.getNoteById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));
    }

    // Update operation
    @PutMapping("/putNoteDetails/{id}")
    public NoteEntity updateNote(@PathVariable Integer id, @RequestBody NoteEntity note) {
        // Set the folder if folderId is provided
        if (note.getFolderId() != null) {
            folderService.getFolderById(note.getFolderId())
                .ifPresent(folder -> note.setFolder(folder));
        }
        
        return noteService.updateNote(id, note)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));
    }

    // Delete operation
    @DeleteMapping("/deleteNoteDetails/{id}")
    public void deleteNote(@PathVariable Integer id) {
        if (!noteService.deleteNote(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
        }
    }
}
