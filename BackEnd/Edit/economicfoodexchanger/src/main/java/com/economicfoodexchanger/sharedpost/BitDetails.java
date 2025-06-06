package com.economicfoodexchanger.sharedpost;

import jakarta.persistence.*;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bitdetails")
@Data
@NoArgsConstructor
@AllArgsConstructor


public class BitDetails {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "bitrate", length = 45)
    private BigDecimal bitrate;

    @Column(name = "needamount", precision = 10, scale = 2)
    private BigDecimal needamount;

    @Column(name = "bitdetailscol", precision = 10, scale = 2)
    private BigDecimal bitdetailscol;

    @Column(name = "conformedstate", length = 45)
    private String conformedstate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sharedpost_id", referencedColumnName = "id")
    private SharedPost sharedpost;

}