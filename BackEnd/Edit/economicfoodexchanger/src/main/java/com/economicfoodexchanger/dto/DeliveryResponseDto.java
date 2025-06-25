package com.economicfoodexchanger.dto;

import com.economicfoodexchanger.sharedpost.SharedPost;
import com.economicfoodexchanger.sharedpost.delivery.DeliveryStaus;
import com.economicfoodexchanger.sharedpost.delivery.DeliveryStatusHistory;
import com.economicfoodexchanger.sharedpost.payment.Payment;

import java.util.List;

public class DeliveryResponseDto {
    private Integer id;
    private String trackingNumber;
    private String location;
    private String currentPackageLocation;
    private String deliveryCompany;
    private String description;
    private Payment payment;
    private SharedPost sharedPost;
    private DeliveryStaus currentStatus;
    private List<DeliveryStatusHistory> statusHistory;
    
    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getCurrentPackageLocation() { return currentPackageLocation; }
    public void setCurrentPackageLocation(String currentPackageLocation) { this.currentPackageLocation = currentPackageLocation; }
    public String getDeliveryCompany() { return deliveryCompany; }
    public void setDeliveryCompany(String deliveryCompany) { this.deliveryCompany = deliveryCompany; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }
    public SharedPost getSharedPost() { return sharedPost; }
    public void setSharedPost(SharedPost sharedPost) { this.sharedPost = sharedPost; }
    public DeliveryStaus getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(DeliveryStaus currentStatus) { this.currentStatus = currentStatus; }
    public List<DeliveryStatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<DeliveryStatusHistory> statusHistory) { this.statusHistory = statusHistory; }
}
