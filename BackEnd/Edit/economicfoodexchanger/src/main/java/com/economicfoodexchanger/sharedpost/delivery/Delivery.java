package com.economicfoodexchanger.sharedpost.delivery;

import com.economicfoodexchanger.sharedpost.SharedPost;
import com.economicfoodexchanger.sharedpost.payment.Payment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Integer trackingNumber;

    @Column(name = "location", length = 45)
    private String location;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "delivery_staus_id", referencedColumnName = "id")
    private DeliveryStaus deliveryStatus;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "payment_id", referencedColumnName = "id")
    private Payment payment;

    @OneToOne
    @JoinColumn(name = "sharedpost_id", referencedColumnName = "id")
    private SharedPost sharedPost;
}
