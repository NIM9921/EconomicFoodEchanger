package com.economicfoodexchanger.dto;

public class UpdateStatusRequest {
    private Integer deliveryId;
    private Integer statusId;
    
    public UpdateStatusRequest() {}
    
    public UpdateStatusRequest(Integer deliveryId, Integer statusId) {
        this.deliveryId = deliveryId;
        this.statusId = statusId;
    }
    
    // Getters and setters
    public Integer getDeliveryId() { return deliveryId; }
    public void setDeliveryId(Integer deliveryId) { this.deliveryId = deliveryId; }
    public Integer getStatusId() { return statusId; }
    public void setStatusId(Integer statusId) { this.statusId = statusId; }
    
    @Override
    public String toString() {
        return "UpdateStatusRequest{" +
                "deliveryId=" + deliveryId +
                ", statusId=" + statusId +
                '}';
    }
}
