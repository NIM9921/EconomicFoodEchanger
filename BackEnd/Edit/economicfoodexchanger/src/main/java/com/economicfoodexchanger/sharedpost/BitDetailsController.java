package com.economicfoodexchanger.sharedpost;

import com.economicfoodexchanger.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/bitdetails")

public class BitDetailsController {
    @Autowired
    BitDetailsDao bitDetailsDao;

    @Autowired
    SharedPostDao sharedPostDao;

    @Autowired
    UserDao userDao;

    @GetMapping("/all")
    public List<BitDetails> getAll() {
        return bitDetailsDao.findAll();
    }

    @PostMapping("/addbit")
    public String uploadBitDetails(@RequestBody BitDetails bitDetails, @RequestParam Integer postid) {

        bitDetails.setSharedpost(sharedPostDao.getReferenceById(postid));
        bitDetails.setUser(userDao.getReferenceById(1));
        System.out.println(bitDetails.getDeliverylocation());
        try {
            bitDetailsDao.save(bitDetails);
            return "Bit details uploaded successfully!";
        } catch (Exception e) {
            return "Upload failed: " + e.getMessage();
        }
    }
}