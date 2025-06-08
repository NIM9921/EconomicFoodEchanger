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

    @Column(name = "amount")
    private  BigDecimal amount;

    @Column(name = "note")
    private  String note ;

    @Column(name = "file")
    private byte[]  file;

    @Column(name = "status")
    private boolean status;

    @Column(name = "filetype")
    private String filetype;

    @ManyToOne
    @JoinColumn(name = "payment_type_id", referencedColumnName = "id")
    PaymentType paymentType;


}
