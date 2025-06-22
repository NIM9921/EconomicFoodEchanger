package com.economicfoodexchanger.sharedpost.delivery;

import com.economicfoodexchanger.sharedpost.SharedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryDao extends JpaRepository<Delivery, Integer> {
    Delivery findBysharedPost(SharedPost sharedPost);
}
