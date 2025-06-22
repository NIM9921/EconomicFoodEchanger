package com.economicfoodexchanger.sharedpost.delivery;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryStatusHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "status_date_change")
    private LocalDateTime statusDateChange;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "delivery_staus_id", referencedColumnName = "id")
    private DeliveryStaus deliveryStaus;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "delivery_id", referencedColumnName = "id")
    private Delivery delivery;
    
    @PrePersist
    public void prePersist() {
        if (statusDateChange == null) {
            statusDateChange = LocalDateTime.now();
        }
    }
}
