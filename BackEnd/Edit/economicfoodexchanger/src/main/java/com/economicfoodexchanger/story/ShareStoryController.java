package com.economicfoodexchanger.story;


import com.economicfoodexchanger.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sharestory")


public class ShareStoryController {

    @Autowired
    ShareStoryDao shareStoryDao;

    @Autowired
    UserDao userDao;

    @GetMapping("/all")
    public List<ShareStory> getAll() {
        return shareStoryDao.findAll(Sort.by(Sort.Direction.DESC, "createdateandtime"));

    }

    @PostMapping("/upload")
    public String uploadStory(@RequestParam("title") String title,
                              @RequestParam("description") String description,
                              @RequestParam("image") MultipartFile file) {

        try {
            ShareStory story = new ShareStory();
            story.setTitle(title);
            story.setDiscription(description);

            // Show original image size
            byte[] originalBytes = file.getBytes();
            System.out.println("=== IMAGE COMPRESSION INFO ===");
            System.out.println("Original image size: " + formatFileSize(originalBytes.length));

            // Compress image before saving
            byte[] compressedImage = compressImage(originalBytes);
            story.setImage(compressedImage);

            // Show compressed image size and compression ratio
            story.setCreatedateandtime(LocalDateTime.now());
            story.setUsername(userDao.getReferenceById(1));

            shareStoryDao.save(story);
            return "Story uploaded successfully!";
        } catch (Exception e) {
            return "Upload failed: " + e.getMessage();
        }
    }

    // Add this helper method to format file sizes nicely
    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        else return String.format("%.1f MB", bytes / (1024.0 * 1024.0));
    }

    // Your existing compression method stays the same
    private byte[] compressImage(byte[] imageBytes) throws IOException {
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageBytes));

        // Show original image dimensions
        System.out.println("Original dimensions: " + originalImage.getWidth() + "x" + originalImage.getHeight());

        // Resize if too large
        int maxWidth = 800;
        int maxHeight = 600;

        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();

        // Calculate new dimensions
        int newWidth = originalWidth;
        int newHeight = originalHeight;

        if (originalWidth > maxWidth || originalHeight > maxHeight) {
            double ratio = Math.min((double) maxWidth / originalWidth, (double) maxHeight / originalHeight);
            newWidth = (int) (originalWidth * ratio);
            newHeight = (int) (originalHeight * ratio);
        }

        // Show new dimensions
        System.out.println("Compressed dimensions: " + newWidth + "x" + newHeight);

        // Create compressed image
        BufferedImage compressedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = compressedImage.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        g2d.dispose();

        // Convert to byte array with compression
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(compressedImage, "jpg", baos);

        return baos.toByteArray();
    }


    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer id) {
        Optional<ShareStory> story = shareStoryDao.findById(id);
        if (story.isPresent() && story.get().getImage() != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(story.get().getImage());
        }
        return ResponseEntity.notFound().build();
    }


}