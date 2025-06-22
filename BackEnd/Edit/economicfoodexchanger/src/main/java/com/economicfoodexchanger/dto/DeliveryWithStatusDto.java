package com.economicfoodexchanger.dto;

import com.economicfoodexchanger.sharedpost.delivery.DeliveryStatusHistory;

import java.util.List;

public class DeliveryWithStatusDto {
    private DeliveryResponseDto delivery;
    private DeliveryStatusHistory currentStatus;
    private List<DeliveryStatusHistory> statusHistory;
    
    public DeliveryWithStatusDto(DeliveryResponseDto delivery, DeliveryStatusHistory currentStatus, List<DeliveryStatusHistory> statusHistory) {
        this.delivery = delivery;
        this.currentStatus = currentStatus;
        this.statusHistory = statusHistory;
    }
    
    // Getters and setters
    public DeliveryResponseDto getDelivery() { return delivery; }
    public void setDelivery(DeliveryResponseDto delivery) { this.delivery = delivery; }
    public DeliveryStatusHistory getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(DeliveryStatusHistory currentStatus) { this.currentStatus = currentStatus; }
    public List<DeliveryStatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<DeliveryStatusHistory> statusHistory) { this.statusHistory = statusHistory; }
}

