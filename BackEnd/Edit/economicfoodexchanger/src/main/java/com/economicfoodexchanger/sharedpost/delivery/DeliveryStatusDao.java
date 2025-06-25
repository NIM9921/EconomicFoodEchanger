package com.economicfoodexchanger.sharedpost.delivery;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryStatusDao extends JpaRepository<DeliveryStaus, Integer> {
}
