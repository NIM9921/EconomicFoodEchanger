package com.economicfoodexchanger.story;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sharestory")


public class ShareStoryController {

    @Autowired
    ShareStoryDao shareStoryDao;

    @GetMapping("/all")
    public List<ShareStory> getAll(){return shareStoryDao.findAll();

    }

    @PostMapping("/upload")
    public String uploadStory(@RequestParam("title") String title,@RequestParam("description") String description,@RequestParam("image") MultipartFile file) {
        try {
            ShareStory story = new ShareStory();
            story.setTitle(title);
            story.setDiscription(description);
            story.setImage(file.getBytes());
            story.setCreatedateandtime(LocalDateTime.now());

            shareStoryDao.save(story);
            return "Story uploaded successfully!";
        } catch (Exception e) {
            return "Upload failed: " + e.getMessage();
        }
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
