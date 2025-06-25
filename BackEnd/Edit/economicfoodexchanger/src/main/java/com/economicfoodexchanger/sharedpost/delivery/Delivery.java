package com.economicfoodexchanger.sharedpost.delivery;

import com.economicfoodexchanger.sharedpost.SharedPost;
import com.economicfoodexchanger.sharedpost.payment.Payment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Entity
@Table(name = "delivery")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "location", length = 45)
    private String location;

    @Column(name = "current_package_location")
    private String currentPackageLocation;

    @Column(name = "delivery_company")
    private String deliveryCompany;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "payment_id", referencedColumnName = "id")
    private Payment payment;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sharedpost_id", referencedColumnName = "id")
    private SharedPost sharedPost;

    @JsonIgnore
    @OneToMany(mappedBy = "delivery", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DeliveryStatusHistory> statusHistory = new ArrayList<>();

    // Helper method to get current status
    @Transient
    public DeliveryStaus getCurrentStatus() {
        return statusHistory.stream()
                .max(Comparator.comparing(DeliveryStatusHistory::getStatusDateChange))
                .map(DeliveryStatusHistory::getDeliveryStaus)
                .orElse(null);
    }

    // Helper method to add status change (use with caution - requires transaction context)
    public void addStatusChange(DeliveryStaus newStatus) {
        DeliveryStatusHistory history = new DeliveryStatusHistory();
        history.setDelivery(this);
        history.setDeliveryStaus(newStatus);
        history.setStatusDateChange(LocalDateTime.now());
        
        // Initialize the collection if it's null
        if (this.statusHistory == null) {
            this.statusHistory = new ArrayList<>();
        }
        
        this.statusHistory.add(history);
    }
}

