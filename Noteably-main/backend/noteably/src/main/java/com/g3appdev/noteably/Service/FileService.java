package com.g3appdev.noteably.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import net.coobird.thumbnailator.Thumbnails;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileService {
    private static final String UPLOAD_DIR = "uploads/profile-pictures";
    private static final String SERVER_URL = "http://localhost:8080";

    public String saveProfilePicture(int studentId, MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Clean filename and generate unique name
        String cleanFilename = file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-]", "_");
        String filename = studentId + "_" + System.currentTimeMillis() + "_" + cleanFilename;
        File outputFile = new File(uploadDir, filename);

        // Save file with compression
        Thumbnails.of(file.getInputStream())
            .size(800, 800)
            .outputQuality(0.8)
            .toFile(outputFile);

        System.out.println("File saved to: " + outputFile.getAbsolutePath());

        // Return the URL that will be used to access the file
        return SERVER_URL + "/" + UPLOAD_DIR + "/" + filename;
    }

    public Path getFilePath(String filename) {
        return Paths.get(UPLOAD_DIR).resolve(filename);
    }
}
