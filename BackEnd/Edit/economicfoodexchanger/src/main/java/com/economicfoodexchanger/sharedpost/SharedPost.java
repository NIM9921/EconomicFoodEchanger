package com.economicfoodexchanger.sharedpost;

import com.economicfoodexchanger.User;
import com.economicfoodexchanger.sharedpost.delivery.Delivery;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sharedpost")

@Data
@NoArgsConstructor
@AllArgsConstructor

public class SharedPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title")
    private String title;

    @Column(name = "discription")
    private String discription;

    @Column(name ="photos")
    private byte[] image;

    @Column(name = "createdateandtime")
    private LocalDateTime createdateandtime;

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private User username;


    @OneToMany(mappedBy = "sharedpost",fetch = FetchType.EAGER)
    private List<BitDetails> bitDetails;


    @OneToMany(mappedBy = "sharedPost", fetch = FetchType.EAGER)
    private List<Review> reviews;

}
