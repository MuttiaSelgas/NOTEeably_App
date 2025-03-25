package com.g3appdev.noteably.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.g3appdev.noteably.Entity.FolderEntity;
import com.g3appdev.noteably.Entity.NoteEntity;
import com.g3appdev.noteably.Service.FolderService;
import com.g3appdev.noteably.Service.NoteService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/folders")
public class FolderController {

    @Autowired
    private FolderService folderService;

    @Autowired
    private NoteService noteService;

    // Create a new folder
    @PostMapping("/postFolderRecord")
    public FolderEntity postFolderRecord(@RequestBody FolderEntity folder) {
        if (folder == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Folder data cannot be null");
        }

        // Handle notes if present
        if (folder.getNotes() != null) {
            for (NoteEntity note : folder.getNotes()) {
                note.setFolder(folder); // Set bidirectional relationship
            }
        }

        return folderService.postFolderRecord(folder);
    }

    // Get all folders
    @GetMapping("/getAllFolders")
    public List<FolderEntity> getAllFolders() {
        return folderService.getAllFolders();
    }

    // Get folder by ID
    @GetMapping("/{id}")
    public FolderEntity getFolderById(@PathVariable int id) {
        return folderService.getFolderById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder not found"));
    }

    // Get folders by student ID
    @GetMapping("/getByStudent/{studentId}")
    public List<FolderEntity> getFoldersByStudentId(@PathVariable int studentId) {
        return folderService.getFoldersByStudentId(studentId);
    }

    // Update a folder
    @PutMapping("/putFolderDetails/{id}")
    public FolderEntity putFolderDetails(@PathVariable int id, @RequestBody FolderEntity folder) {
        // Set the folder ID from the path
        folder.setFolderId(id);
        
        // Handle notes if present
        if (folder.getNotes() != null) {
            for (NoteEntity note : folder.getNotes()) {
                note.setFolder(folder); // Maintain bidirectional relationship
            }
        }

        FolderEntity updatedFolder = folderService.putFolderDetails(id, folder);
        if (updatedFolder == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder not found");
        }
        return updatedFolder;
    }

    // Delete a folder
    @DeleteMapping("/deleteFolder/{id}")
    public String deleteFolder(@PathVariable int id) {
        if (!folderService.deleteFolder(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder not found");
        }
        return "Folder deleted successfully";
    }

    // Add a note to a folder
    @PostMapping("/{folderId}/notes")
    public NoteEntity addNoteToFolder(@PathVariable int folderId, @RequestBody NoteEntity note) {
        FolderEntity folder = folderService.getFolderById(folderId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder not found"));
        
        note.setFolder(folder);
        return noteService.createNote(note);
    }

    // Get all notes in a folder
    @GetMapping("/{folderId}/notes")
    public List<NoteEntity> getNotesByFolder(@PathVariable int folderId) {
        FolderEntity folder = folderService.getFolderById(folderId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder not found"));
        
        return folder.getNotes();
    }
}
