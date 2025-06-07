package com.economicfoodexchanger.story;

import com.economicfoodexchanger.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sharestory")

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ShareStory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title")
    private String title;

    @Column(name = "discription")
    private String discription;


    @Column(name = "image")
    private byte[] image;

    @Column(name = "createdateandtime")
    private LocalDateTime createdateandtime;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User username;





}
