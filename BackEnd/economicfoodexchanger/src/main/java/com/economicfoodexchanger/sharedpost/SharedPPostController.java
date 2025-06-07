package com.economicfoodexchanger.sharedpost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sharedpost")

public class SharedPPostController {

@Autowired
    SharedPostDao sharedPostDao;

    @GetMapping("/all")
    public List<SharedPost> getAll() {return sharedPostDao.findAll();
    }
    @PostMapping("/upload")
    public String uploadPost(SharedPost sharedPost) {
        try {
            sharedPostDao.save(sharedPost);
            return "Post uploaded successfully!";
        } catch (Exception e    ) {
            return "Upload failed: " + e.getMessage();
        }
    }
    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer id) {
        Optional<SharedPost> post = sharedPostDao.findById(id);
        if (post.isPresent() && post.get().getImage() != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(post.get().getImage());
        }
        return ResponseEntity.notFound().build();
    }

}
