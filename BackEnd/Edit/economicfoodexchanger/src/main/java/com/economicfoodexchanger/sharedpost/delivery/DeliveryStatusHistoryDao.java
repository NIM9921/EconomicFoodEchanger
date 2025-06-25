package com.economicfoodexchanger.sharedpost.delivery;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryStatusHistoryDao extends JpaRepository<DeliveryStatusHistory, Integer> {
    
    List<DeliveryStatusHistory> findByDeliveryIdOrderByStatusDateChangeDesc(Integer deliveryId);
    
    @Query("SELECT dsh FROM DeliveryStatusHistory dsh WHERE dsh.delivery.id = :deliveryId ORDER BY dsh.statusDateChange DESC")
    List<DeliveryStatusHistory> findLatestStatusByDeliveryId(@Param("deliveryId") Integer deliveryId);
    
    @Query("SELECT dsh FROM DeliveryStatusHistory dsh WHERE dsh.delivery.id = :deliveryId AND dsh.statusDateChange = (SELECT MAX(dsh2.statusDateChange) FROM DeliveryStatusHistory dsh2 WHERE dsh2.delivery.id = :deliveryId)")
    DeliveryStatusHistory findCurrentStatusByDeliveryId(@Param("deliveryId") Integer deliveryId);
}
