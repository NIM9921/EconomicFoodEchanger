package com.economicfoodexchanger.service;

import com.economicfoodexchanger.dto.DeliveryResponseDto;
import com.economicfoodexchanger.dto.DeliveryWithStatusDto;
import com.economicfoodexchanger.sharedpost.SharedPost;
import com.economicfoodexchanger.sharedpost.SharedPostDao;
import com.economicfoodexchanger.sharedpost.delivery.*;
import com.economicfoodexchanger.sharedpost.payment.Payment;
import com.economicfoodexchanger.sharedpost.payment.PaymentDao;
import com.economicfoodexchanger.sharedpost.payment.PaymentType;
import com.economicfoodexchanger.sharedpost.payment.PaymentTypeDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryDao deliveryDao;

    @Autowired
    private PaymentDao paymentDao;

    @Autowired
    private PaymentTypeDao paymentTypeDao;

    @Autowired
    private SharedPostDao sharedPostDao;

    @Autowired
    private DeliveryStatusDao deliveryStatusDao;

    @Autowired
    private DeliveryStatusHistoryDao deliveryStatusHistoryDao;

    public DeliveryResponseDto getDeliveryByPostId(Integer postId) {
        SharedPost sharedPost = sharedPostDao.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, 
                "SharedPost with ID " + postId + " not found"));
        
        Delivery delivery = deliveryDao.findBysharedPost(sharedPost);
        if (delivery == null) {
            throw new ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, 
                "Delivery not found for post ID " + postId);
        }
        
        return convertToDto(delivery);
    }

    public DeliveryResponseDto getDeliveryById(Integer id) {
        Delivery delivery = deliveryDao.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, 
                "Delivery with ID " + id + " not found"));
        
        return convertToDto(delivery);
    }

    @Transactional
    public void updateDeliveryStatus(Integer deliveryId, Integer statusId) {
        System.out.println("Service: Updating delivery " + deliveryId + " to status " + statusId);
        
        Delivery delivery = deliveryDao.findById(deliveryId)
            .orElseThrow(() -> {
                System.err.println("Delivery not found with ID: " + deliveryId);
                return new ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, 
                    "Delivery not found with ID: " + deliveryId);
            });
        
        DeliveryStaus newStatus = deliveryStatusDao.findById(statusId)
            .orElseThrow(() -> {
                System.err.println("Delivery status not found with ID: " + statusId);
                return new ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, 
                    "Delivery status not found with ID: " + statusId);
            });
        
        System.out.println("Found delivery: " + delivery.getId() + ", New status: " + newStatus.getName());
        
        // Create and save the history record directly instead of using the helper method
        DeliveryStatusHistory history = new DeliveryStatusHistory();
        history.setDelivery(delivery);
        history.setDeliveryStaus(newStatus);
        history.setStatusDateChange(LocalDateTime.now());
        
        deliveryStatusHistoryDao.save(history);
        
        System.out.println("Successfully updated delivery status. Delivery ID: " + delivery.getId());
    }

    public List<DeliveryStatusHistory> getStatusHistory(Integer deliveryId) {
        return deliveryStatusHistoryDao.findByDeliveryIdOrderByStatusDateChangeDesc(deliveryId);
    }

    public DeliveryStatusHistory getCurrentStatus(Integer deliveryId) {
        return deliveryStatusHistoryDao.findCurrentStatusByDeliveryId(deliveryId);
    }

    public DeliveryWithStatusDto getDeliveryWithStatus(Integer postId) {
        SharedPost sharedPost = sharedPostDao.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, 
                "SharedPost with ID " + postId + " not found"));
        
        Delivery delivery = deliveryDao.findBysharedPost(sharedPost);
        if (delivery == null) {
            throw new ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, 
                "Delivery not found for post ID " + postId);
        }
        
        // Convert to DTO to avoid lazy loading issues
        DeliveryResponseDto deliveryDto = convertToDto(delivery);
        
        DeliveryStatusHistory currentStatus = deliveryStatusHistoryDao.findCurrentStatusByDeliveryId(delivery.getId());
        List<DeliveryStatusHistory> statusHistory = deliveryStatusHistoryDao.findByDeliveryIdOrderByStatusDateChangeDesc(delivery.getId());
        
        return new DeliveryWithStatusDto(deliveryDto, currentStatus, statusHistory);
    }

    @Transactional
    public Delivery createInitialDelivery(Delivery delivery, SharedPost post) {
        Payment initialPayment = createInitialPayment();

        if (initialPayment != null) {
            delivery.setPayment(initialPayment);
            delivery.setSharedPost(post);
            
            DeliveryStaus initialStatus = deliveryStatusDao.findById(1)
                .orElseThrow(() -> new ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, 
                    "Delivery status with ID 1 not found"));
            
            // Save delivery first
            Delivery savedDelivery = deliveryDao.save(delivery);
            
            // Then create the initial status history
            DeliveryStatusHistory history = new DeliveryStatusHistory();
            history.setDelivery(savedDelivery);
            history.setDeliveryStaus(initialStatus);
            history.setStatusDateChange(LocalDateTime.now());
            deliveryStatusHistoryDao.save(history);
            
            return savedDelivery;
        } else {
            throw new ResponseStatusException(
                org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR, 
                "Failed to create initial payment for delivery");
        }
    }
    
    private Payment createInitialPayment() {
        BigDecimal amount = new BigDecimal("0.0");
        
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

    private DeliveryResponseDto convertToDto(Delivery delivery) {
        DeliveryResponseDto dto = new DeliveryResponseDto();
        dto.setId(delivery.getId());
        dto.setTrackingNumber(delivery.getTrackingNumber());
        dto.setLocation(delivery.getLocation());
        dto.setCurrentPackageLocation(delivery.getCurrentPackageLocation());
        dto.setDeliveryCompany(delivery.getDeliveryCompany());
        dto.setDescription(delivery.getDescription());
        dto.setPayment(delivery.getPayment());
        dto.setSharedPost(delivery.getSharedPost());
        
        DeliveryStatusHistory currentStatus = deliveryStatusHistoryDao.findCurrentStatusByDeliveryId(delivery.getId());
        if (currentStatus != null) {
            dto.setCurrentStatus(currentStatus.getDeliveryStaus());
        }
        
        List<DeliveryStatusHistory> statusHistory = deliveryStatusHistoryDao.findByDeliveryIdOrderByStatusDateChangeDesc(delivery.getId());
        dto.setStatusHistory(statusHistory);
        
        return dto;
    }
}
