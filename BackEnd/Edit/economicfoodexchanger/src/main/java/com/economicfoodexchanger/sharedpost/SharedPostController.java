package com.economicfoodexchanger.sharedpost;

import com.economicfoodexchanger.User;
import com.economicfoodexchanger.UserDao;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Sort;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sharedpost")
public class SharedPostController {

    @Autowired
    SharedPostDao sharedPostDao;

    @Autowired
    UserDao userDao;

    @GetMapping("/all")
    public List<SharedPost> getAll() {
        return sharedPostDao.findAll(Sort.by(Sort.Direction.DESC, "createdateandtime"));
    }

    // Old upload method for backward compatibility (single SharedPost object)
    @PostMapping("/upload")
    public String uploadPost(SharedPost sharedPost) {
        try {
            sharedPostDao.save(sharedPost);
            return "Post uploaded successfully!";
        } catch (Exception e) {
            return "Upload failed: " + e.getMessage();
        }
    }

    // New upload method for multiple media files
    @PostMapping(value = "/upload-media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String uploadPostWithMedia(@RequestParam("title") String title,
                                      @RequestParam("description") String description,
                                      @RequestParam("longitude") String longitude,
                                      @RequestParam("latitude") String latitude,
                                      @RequestParam("quantity") String quantity,
                                      @RequestParam("files") MultipartFile[] files,
                                      @RequestParam(value = "userId", defaultValue = "1") Integer userId,
                                      @RequestPart(value = "categoreystatus_id", required = false) CategoreyStatus categoryStatus) {
        try {
            System.out.println(categoryStatus.toString());
            SharedPost sharedPost = new SharedPost();
            sharedPost.setTitle(title);
            sharedPost.setLongitude(longitude);
            sharedPost.setLatitude(latitude);
            sharedPost.setQuentity(quantity);
            sharedPost.setTitle(title);
            sharedPost.setDiscription(description);
            sharedPost.setCreatedateandtime(LocalDateTime.now());
            sharedPost.setUsername(userDao.getReferenceById(userId));

            // Parse category status JSON
            sharedPost.setCategoreyStatus(categoryStatus);

            MediaContainer mediaContainer = new MediaContainer();
            System.out.println("=== PROCESSING " + files.length + " FILES ===");

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    processAndAddMediaFile(file, mediaContainer);
                }
            }

            sharedPost.setMediaContainer(mediaContainer);
            sharedPostDao.save(sharedPost);

            return "Post with " + mediaContainer.getMediaFiles().size() + " media files uploaded successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Upload failed: " + e.getMessage();
        }
    }

    private void processAndAddMediaFile(MultipartFile file, MediaContainer mediaContainer) throws IOException {
        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();
        
        if (contentType != null) {
            if (contentType.startsWith("image/")) {
                // Compress images
                byte[] compressedData = compressImage(file.getBytes());
                mediaContainer.addMediaFile(new MediaContainer.MediaFile(
                    compressedData, contentType, fileName, MediaContainer.MediaType.IMAGE));
                
                System.out.println("IMAGE: " + fileName + 
                    " - Original: " + formatFileSize(file.getSize()) + 
                    " - Compressed: " + formatFileSize(compressedData.length));
                    
            } else if (contentType.startsWith("video/")) {
                // Store videos as-is (you can add compression here if needed)
                byte[] videoData = file.getBytes();
                mediaContainer.addMediaFile(new MediaContainer.MediaFile(
                    videoData, contentType, fileName, MediaContainer.MediaType.VIDEO));
                
                System.out.println("VIDEO: " + fileName + 
                    " - Size: " + formatFileSize(videoData.length));
            } else {
                System.out.println("Unsupported media type: " + contentType + " for file: " + fileName);
            }
        }
    }

    private byte[] compressImage(byte[] imageBytes) throws IOException {
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageBytes));
        
        if (originalImage == null) {
            return imageBytes;
        }

        // Image compression settings
        int maxWidth = 1200;
        int maxHeight = 900;
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();

        int newWidth = originalWidth;
        int newHeight = originalHeight;

        if (originalWidth > maxWidth || originalHeight > maxHeight) {
            double ratio = Math.min((double) maxWidth / originalWidth, (double) maxHeight / originalHeight);
            newWidth = (int) (originalWidth * ratio);
            newHeight = (int) (originalHeight * ratio);
        }

        System.out.println("Original dimensions: " + originalWidth + "x" + originalHeight);
        System.out.println("Compressed dimensions: " + newWidth + "x" + newHeight);

        BufferedImage compressedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = compressedImage.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        g2d.dispose();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(compressedImage, "jpg", baos);

        return baos.toByteArray();
    }

    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        else return String.format("%.1f MB", bytes / (1024.0 * 1024.0));
    }

    // Keep existing method for backward compatibility
    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer id) {
        return getMedia(id, 0); // Get first media file
    }

    // New method to get specific media by index
    @GetMapping("/media/{id}/{index}")
    public ResponseEntity<byte[]> getMedia(@PathVariable Integer id, @PathVariable Integer index) {
        Optional<SharedPost> post = sharedPostDao.findById(id);
        
        if (post.isPresent()) {
            SharedPost sharedPost = post.get();
            MediaContainer.MediaFile mediaFile = sharedPost.getMediaFile(index);
            
            if (mediaFile != null) {
                HttpHeaders headers = new HttpHeaders();
                
                if (mediaFile.getContentType() != null) {
                    headers.setContentType(MediaType.parseMediaType(mediaFile.getContentType()));
                } else {
                    // Fallback based on media type
                    if (mediaFile.getMediaType() == MediaContainer.MediaType.IMAGE) {
                        headers.setContentType(MediaType.IMAGE_JPEG);
                    } else if (mediaFile.getMediaType() == MediaContainer.MediaType.VIDEO) {
                        headers.setContentType(MediaType.parseMediaType("video/mp4"));
                    }
                }
                
                if (mediaFile.getFileName() != null) {
                    headers.add("Content-Disposition", "inline; filename=\"" + mediaFile.getFileName() + "\"");
                }
                
                return ResponseEntity.ok()
                        .headers(headers)
                        .body(mediaFile.getData());
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    // Get information about all media files in a post
    @GetMapping("/{id}/media-info")
    public ResponseEntity<MediaInfo> getMediaInfo(@PathVariable Integer id) {
        Optional<SharedPost> post = sharedPostDao.findById(id);
        
        if (post.isPresent()) {
            SharedPost sharedPost = post.get();
            MediaContainer mediaContainer = sharedPost.getMediaContainer();
            List<MediaContainer.MediaFile> mediaFiles = mediaContainer.getMediaFiles();
            
            MediaInfo info = new MediaInfo();
            info.setTotalFiles(mediaFiles.size());
            
            for (int i = 0; i < mediaFiles.size(); i++) {
                MediaContainer.MediaFile file = mediaFiles.get(i);
                MediaInfo.FileInfo fileInfo = new MediaInfo.FileInfo();
                fileInfo.setIndex(i);
                fileInfo.setFileName(file.getFileName());
                fileInfo.setContentType(file.getContentType());
                fileInfo.setMediaType(file.getMediaType().toString());
                fileInfo.setFileSize(file.getFileSize());
                fileInfo.setUrl("/sharedpost/media/" + id + "/" + i);
                
                info.getFiles().add(fileInfo);
            }
            
            return ResponseEntity.ok(info);
        }
        
        return ResponseEntity.notFound().build();
    }

    // Helper class for media information response
    public static class MediaInfo {
        private int totalFiles;
        private List<FileInfo> files = new ArrayList<>();
        
        public int getTotalFiles() { return totalFiles; }
        public void setTotalFiles(int totalFiles) { this.totalFiles = totalFiles; }
        public List<FileInfo> getFiles() { return files; }
        public void setFiles(List<FileInfo> files) { this.files = files; }
        
        public static class FileInfo {
            private int index;
            private String fileName;
            private String contentType;
            private String mediaType;
            private long fileSize;
            private String url;
            
            public int getIndex() { return index; }
            public void setIndex(int index) { this.index = index; }
            public String getFileName() { return fileName; }
            public void setFileName(String fileName) { this.fileName = fileName; }
            public String getContentType() { return contentType; }
            public void setContentType(String contentType) { this.contentType = contentType; }
            public String getMediaType() { return mediaType; }
            public void setMediaType(String mediaType) { this.mediaType = mediaType; }
            public long getFileSize() { return fileSize; }
            public void setFileSize(long fileSize) { this.fileSize = fileSize; }
            public String getUrl() { return url; }
            public void setUrl(String url) { this.url = url; }
        }
    }

    public List<SharedPost> getUserSharedPost(User UserId){

        System.out.println("UserId = " + UserId.getUsername());
        List<SharedPost> sharedPostList = sharedPostDao.getAllByUsername(UserId);
        System.out.println(UserId.getId());
        return sharedPostList;
    }
}