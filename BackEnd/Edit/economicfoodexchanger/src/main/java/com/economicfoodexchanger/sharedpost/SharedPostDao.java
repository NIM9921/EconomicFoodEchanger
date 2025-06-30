package com.economicfoodexchanger.sharedpost;

import com.economicfoodexchanger.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

@Repository
public interface SharedPostDao extends JpaRepository<SharedPost, Integer> {
    List<SharedPost> getAllByUsername(User user);

    public interface ProfitProjection {
        BigDecimal getTotalProfit();
        String getPostSharedDate();
    }

    public interface CostProjection {
        BigDecimal getTotalCost();
        String getPostSharedDate();
    }

    @Query(value = "SELECT " +
            "CAST(sp.quentity AS DECIMAL(10, 2)) * bd.bitrate AS totalProfit, " +
            "sp.createdateandtime AS postSharedDate " +
            "FROM sharedpost AS sp " +
            "JOIN bitdetails AS bd ON sp.id = bd.sharedpost_id " +
            "WHERE sp.user_id = 1 " +
            "AND sp.conformed = 1 " +
            "AND bd.conformedstate = 1 " +
            "AND sp.categoreystatus_id = 2",
            nativeQuery = true)
    List<ProfitProjection> getSellingRequestProfit();

    @Query(value = "SELECT " +
            "CAST(sp.quentity AS DECIMAL(10, 2)) * bd.bitrate AS totalCost, " +
            "sp.createdateandtime AS postSharedDate " +
            "FROM sharedpost AS sp " +
            "JOIN bitdetails AS bd ON sp.id = bd.sharedpost_id " +
            "WHERE sp.user_id = 1 " +
            "AND sp.conformed = 1 " +
            "AND bd.conformedstate = 1 " +
            "AND sp.categoreystatus_id = 1",
            nativeQuery = true)
    List<CostProjection> getBuyingRequestCost();
}
