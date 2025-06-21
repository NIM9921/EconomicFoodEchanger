package com.economicfoodexchanger.sharedpost.delivery;

import com.economicfoodexchanger.sharedpost.SharedPost;
import com.economicfoodexchanger.sharedpost.SharedPostDao;
import com.economicfoodexchanger.sharedpost.payment.Payment;
import com.economicfoodexchanger.sharedpost.payment.PaymentDao;
import com.economicfoodexchanger.sharedpost.payment.PaymentType;
import com.economicfoodexchanger.sharedpost.payment.PaymentTypeDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@RestController
@RequestMapping("/delivery")
public class DeliveryController {

    @Autowired
    DeliveryDao deliveryDao;

    @Autowired
    PaymentDao paymentDao;

    @Autowired
    PaymentTypeDao paymentTypeDao;

    @Autowired
    SharedPostDao sharedPostDao;

    @Autowired
    DeliveryStatusDao deliveryStatusDao;

    @GetMapping(value = "/getbypostid")
    public Delivery DeliveryGetByPost(@RequestParam(value = "postId") Integer postId) {

        SharedPost sharedPost = sharedPostDao.getReferenceById(postId);
        return deliveryDao.findBysharedPost(sharedPost);
    }

    @GetMapping(value = "/getbyid")
    public Delivery DeliveryGetByBit(@RequestParam(value = "deliveryid") Integer Id) {
        return deliveryDao.getReferenceById(Id);
    }

    public Delivery InitialDeliverySave(Delivery delivery, SharedPost post) {
        Payment initalPayment = CreateInitialPayement();

        if (initalPayment != null) {
            delivery.setPayment(initalPayment);
            
            // Use findById instead of getReferenceById to get initialized entity
            DeliveryStaus deliveryStatus = deliveryStatusDao.findById(3)
                .orElseThrow(() -> new ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, 
                    "Delivery status with ID 3 not found"));
            
            delivery.setDeliveryStatus(deliveryStatus);
            delivery.setSharedPost(post);
            return deliveryDao.save(delivery);
        } else {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create initial payment for delivery");
        }
    }

    public Payment CreateInitialPayement() {
        BigDecimal amount = new BigDecimal("0.0");
        
        // Use findById instead of getReferenceById
        PaymentType paymentType = paymentTypeDao.findById(5)
            .orElseThrow(() -> new RuntimeException("Payment type with ID 5 not found"));
        
        Payment payment = new Payment();
        payment.setAmount(amount);
        payment.setPaymentType(paymentType);
        payment.setStatus(false);

        try {
            return paymentDao.save(payment);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create initial payment: " + e.getMessage());
        }
    }
}
