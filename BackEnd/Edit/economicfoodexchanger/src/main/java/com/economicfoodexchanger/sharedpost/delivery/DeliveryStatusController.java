package com.economicfoodexchanger.sharedpost.delivery;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/deliveryStatus")
public class DeliveryStatusController {

    @Autowired
    DeliveryStatusDao deliveryStatusDao;

    //http://localhost:8080/deliveryStatus
    @GetMapping
    public List<DeliveryStaus> getAllDeliveryStatus() {
        return deliveryStatusDao.findAll();
    }

}
