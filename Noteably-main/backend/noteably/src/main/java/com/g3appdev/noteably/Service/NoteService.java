package com.g3appdev.noteably.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g3appdev.noteably.Entity.NoteEntity;
import com.g3appdev.noteably.Repository.NoteRepository;
import com.g3appdev.noteably.Repository.FolderRepository;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private FolderRepository folderRepository;

    // Create
    public NoteEntity createNote(NoteEntity note) {
        return noteRepository.save(note);
    }

    // Read all notes
    public List<NoteEntity> getAllNotes() {
        return noteRepository.findAll();
    }

    // Read notes by folder
    public List<NoteEntity> getNotesByFolder(Integer folderId) {
        return noteRepository.findByFolder_FolderId(folderId);
    }

    // Read single note
    public Optional<NoteEntity> getNoteById(Integer id) {
        return noteRepository.findById(id);
    }

    // Update
    public Optional<NoteEntity> updateNote(Integer id, NoteEntity updatedNote) {
        if (noteRepository.existsById(id)) {
            updatedNote.setNoteId(id);
            // Preserve the folder relationship if not provided in the update
            if (updatedNote.getFolder() == null) {
                noteRepository.findById(id)
                    .ifPresent(existingNote -> updatedNote.setFolder(existingNote.getFolder()));
            }
            return Optional.of(noteRepository.save(updatedNote));
        }
        return Optional.empty();
    }

    // Delete
    public boolean deleteNote(Integer id) {
        if (noteRepository.existsById(id)) {
            noteRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
