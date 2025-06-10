package com.economicfoodexchanger.sharedpost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/review")

public class ReviewController {
    @Autowired
    ReviewDao reviewDao;

    @GetMapping("/all")
    public List<Review> getAll() {
        return reviewDao.findAll();
    }
    @PostMapping("/upload")
    public String uploadReview(Review review) {
        try {
            reviewDao.save(review);
            return "Review uploaded successfully!";
        } catch (Exception e) {
            return "Upload failed: " + e.getMessage();
        }
    }


}
