package com.g3appdev.noteably.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import net.coobird.thumbnailator.Thumbnails;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {
    private final Path uploadLocation;
    private static final String UPLOAD_DIR = "uploads/profile-pictures";

    public FileStorageService() {
        this.uploadLocation = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public String storeFile(int studentId, MultipartFile file) throws IOException {
        // Clean filename and generate unique name
        String cleanFilename = file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-]", "_");
        String filename = studentId + "_" + System.currentTimeMillis() + "_" + cleanFilename;
        Path targetLocation = this.uploadLocation.resolve(filename);

        // Create parent directories if they don't exist
        Files.createDirectories(targetLocation.getParent());

        // Save file with compression
        Thumbnails.of(file.getInputStream())
            .size(800, 800)
            .outputQuality(0.8)
            .toFile(targetLocation.toFile());

        // Generate file URL
        String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
            .path("/uploads/profile-pictures/")
            .path(filename)
            .toUriString();

        return fileUrl;
    }

    public Path getFilePath(String filename) {
        return uploadLocation.resolve(filename).normalize();
    }
}
