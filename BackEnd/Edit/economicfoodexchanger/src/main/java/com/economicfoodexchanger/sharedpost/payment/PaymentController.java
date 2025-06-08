package com.economicfoodexchanger.sharedpost.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/payment")

public class PaymentController {
    @Autowired
    PaymentDao paymentDao;

    @GetMapping("/all")
    public List<Payment> getAllPayments() {
        return paymentDao.findAll();
    }

    @PostMapping("/upload")
    public String uploadPayment(Payment payment) {
        try {
            paymentDao.save(payment);
            return "Payment uploaded successfully!";
        } catch (Exception e) {
            return "Upload failed: " + e.getMessage();
        }
    }
    @GetMapping("/file/{id}")
    public ResponseEntity<byte[]> getPaymentFile(@PathVariable int id) {
        Optional<Payment> optionalPayment = paymentDao.findById(id);
        if (optionalPayment.isPresent()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(MediaType.ALL_VALUE))
                    .body(optionalPayment.get().getFile());
        }
        return ResponseEntity.notFound().build();
    }

}
