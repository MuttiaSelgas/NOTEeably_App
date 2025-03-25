package com.g3appdev.noteably.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g3appdev.noteably.Entity.FolderEntity;
import com.g3appdev.noteably.Repository.FolderRepository;

@Service
public class FolderService {

    @Autowired
    private FolderRepository folderRepository;

    // Create
    public FolderEntity postFolderRecord(FolderEntity folder) {
        return folderRepository.save(folder);
    }

    // Read all
    public List<FolderEntity> getAllFolders() {
        return folderRepository.findAll();
    }

    // Read by student ID
    public List<FolderEntity> getFoldersByStudentId(int studentId) {
        return folderRepository.findByStudentId(studentId);
    }

    // Read by ID
    public Optional<FolderEntity> getFolderById(int id) {
        return folderRepository.findById(id);
    }

    // Update
    public FolderEntity putFolderDetails(int id, FolderEntity folder) {
        if (folderRepository.existsById(id)) {
            folder.setFolderId(id);
            // Preserve the existing notes if not provided in the update
            if (folder.getNotes() == null) {
                folderRepository.findById(id)
                    .ifPresent(existingFolder -> folder.setNotes(existingFolder.getNotes()));
            }
            return folderRepository.save(folder);
        }
        return null;
    }

    // Delete
    public boolean deleteFolder(int id) {
        if (folderRepository.existsById(id)) {
            folderRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
