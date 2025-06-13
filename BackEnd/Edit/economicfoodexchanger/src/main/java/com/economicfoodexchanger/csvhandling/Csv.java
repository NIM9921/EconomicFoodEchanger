package com.economicfoodexchanger.csvhandling;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "economiccsvreport")
public class Csv {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "file_name")
    private String file_name;

    @Column(name = "uploaddate")
    private LocalDateTime uploaddate;

    @Column(name = "report")
    private byte[] report;
}
