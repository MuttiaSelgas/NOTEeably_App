package com.g3appdev.noteably.Controller;

import com.g3appdev.noteably.Service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/uploads")
public class FileController {

    @Autowired
    private FileService fileService;

    private final Map<String, MediaType> mediaTypes = new HashMap<String, MediaType>() {{
        put("jpg", MediaType.IMAGE_JPEG);
        put("jpeg", MediaType.IMAGE_JPEG);
        put("png", MediaType.IMAGE_PNG);
        put("gif", MediaType.IMAGE_GIF);
    }};

    @GetMapping("/profile-pictures/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = fileService.getFilePath(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
                MediaType mediaType = mediaTypes.getOrDefault(extension, MediaType.APPLICATION_OCTET_STREAM);

                return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                    .body(resource);
            }

            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}
