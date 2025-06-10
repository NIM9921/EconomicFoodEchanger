package com.economicfoodexchanger.sharedpost;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categoreystatus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoreyStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "status")
    String status;

}
