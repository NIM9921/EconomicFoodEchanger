package com.economicfoodexchanger.sharedpost.payment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "payment")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    BigDecimal amount;
    String note ;

    @ManyToOne
    @JoinColumn(name = "payment_type_id", referencedColumnName = "id")
    Payment payment_type_id;
    boolean status;
}
