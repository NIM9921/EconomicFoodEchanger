package com.economicfoodexchanger.sharedpost;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(name = "bitdetailscol", length = 255)
    private String bitdetailscol;

    @Column(name = "conformedstate")
    private boolean conformedstate;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sharedpost_id", referencedColumnName = "id")
    private SharedPost sharedpost;

}