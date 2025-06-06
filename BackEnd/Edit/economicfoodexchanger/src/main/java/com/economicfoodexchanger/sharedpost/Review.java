package com.economicfoodexchanger.sharedpost;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "review")
@Data
@NoArgsConstructor
@AllArgsConstructor


public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column (name = "comment", length = 45)
    private String comment;

    @Column(name = "rate", length = 45)
    private String rate;

    @ManyToOne
    @JoinColumn(name = "sharedpost_id", referencedColumnName = "id")
    private SharedPost sharedPost;
}



