package ir.ifoto.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Slf4j
@Service
public class StorageService {
    
    private final String storageType;
    private final MinioService minioService;
    private final Path localStoragePath;
    
    public StorageService(
            @Value("${ifoto.storage.type:minio}") String storageType,
            @Value("${ifoto.storage.local.base-path:/var/ifoto/storage}") String localStoragePath,
            MinioService minioService) {
        this.storageType = storageType;
        this.minioService = minioService;
        this.localStoragePath = Paths.get(localStoragePath);
        
        if ("local".equals(storageType)) {
            try {
                Files.createDirectories(this.localStoragePath);
            } catch (IOException e) {
                throw new RuntimeException("Could not create storage directory", e);
            }
        }
    }
    
    /**
     * Store a file and return its path
     */
    public String store(MultipartFile file, String folder, String filename) {
        try {
            if ("minio".equals(storageType)) {
                return minioService.uploadFile(file, folder, filename);
            } else {
                return storeLocally(file, folder, filename);
            }
        } catch (Exception e) {
            log.error("Failed to store file: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to store file", e);
        }
    }
    
    /**
     * Store file locally
     */
    private String storeLocally(MultipartFile file, String folder, String filename) throws IOException {
        Path folderPath = localStoragePath.resolve(folder);
        Files.createDirectories(folderPath);
        
        Path filePath = folderPath.resolve(filename);
        
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        }
        
        return folder + "/" + filename;
    }
    
    /**
     * Get URL for a stored file
     */
    public String getUrl(String storagePath) {
        if ("minio".equals(storageType)) {
            return minioService.getFileUrl(storagePath);
        } else {
            return "/storage/" + storagePath;
        }
    }
    
    /**
     * Delete a file
     */
    public void delete(String storagePath) {
        try {
            if ("minio".equals(storageType)) {
                minioService.deleteFile(storagePath);
            } else {
                deleteLocally(storagePath);
            }
        } catch (Exception e) {
            log.error("Failed to delete file: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete file", e);
        }
    }
    
    /**
     * Delete file locally
     */
    private void deleteLocally(String storagePath) throws IOException {
        Path filePath = localStoragePath.resolve(storagePath);
        Files.deleteIfExists(filePath);
    }
}
