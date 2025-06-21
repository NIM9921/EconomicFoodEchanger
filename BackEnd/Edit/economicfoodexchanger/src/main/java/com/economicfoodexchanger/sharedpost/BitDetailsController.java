package com.economicfoodexchanger.sharedpost;

import com.economicfoodexchanger.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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


    @GetMapping("/getbypostid")
    public List<BitDetails> getByPostId(@RequestParam Integer postid) {

        SharedPost sharedPost = sharedPostDao.getReferenceById(postid);
        return bitDetailsDao.findBySharedpost(sharedPost);
    }

    public boolean UpdateConfirmation(@RequestParam Integer bitId) {
        Optional<BitDetails> bitDetailsDetails = bitDetailsDao.findById(bitId);
        if (bitDetailsDetails.isPresent()) {
            BitDetails bitDetails = bitDetailsDetails.get();
            bitDetails.setConformedstate(true);
            bitDetailsDao.save(bitDetails);
            return true;
        }
        return false;
    }
}