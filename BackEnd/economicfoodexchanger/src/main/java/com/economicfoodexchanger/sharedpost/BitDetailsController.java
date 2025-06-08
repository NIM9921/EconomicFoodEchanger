package com.economicfoodexchanger.sharedpost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/bitdetails")

public class BitDetailsController {
    @Autowired
    BitDetailsDao bitDetailsDao;

    @GetMapping("/all")
    public List<BitDetails> getAll() {
        return bitDetailsDao.findAll();
    }
    @PostMapping("/upload")
    public String uploadBitDetails(BitDetails bitDetails) {
        try {
            bitDetailsDao.save(bitDetails);
            return "Bit details uploaded successfully!";
        } catch (Exception e) {
            return "Upload failed: " + e.getMessage();
        }
    }
}
