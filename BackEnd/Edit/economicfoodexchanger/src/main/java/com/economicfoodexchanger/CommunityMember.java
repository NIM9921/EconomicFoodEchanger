package com.economicfoodexchanger;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "cummiunitymember"
)
@Data
@NoArgsConstructor
@AllArgsConstructor


public class CommunityMember {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Integer id;

     @Column(name = "firstname")
     private String firstName ;

     @Column(name = "lastname")
     private String lastName;

     @Column(name = "email")
     private String email;

     @Column(name = "city")
     private String city;

     @Column(name = "address")
     private String address;

     @Column(name = "shoporfarmname")
     private String shopOrFarmName;

     @Column(name = "nic")
     private String nic;

     @Column(name = "mobilenumber")
     private String mobileNumber;

     @Column(name = "description")
     private String description ;
}


