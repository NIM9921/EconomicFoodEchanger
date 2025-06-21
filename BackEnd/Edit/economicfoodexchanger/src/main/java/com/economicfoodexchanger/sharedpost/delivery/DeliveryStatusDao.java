package com.economicfoodexchanger.sharedpost.delivery;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryStatusDao extends JpaRepository<DeliveryStaus, Integer> {
}
