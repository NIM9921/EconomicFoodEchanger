package com.economicfoodexchanger;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.List;

@Repository
public interface UserDao extends JpaRepository<User,Integer> {

    User findUserByUsername(String username);

    @Query(value = "SELECT u.id, u.name, SUM(bd.bitrate * bd.needamount) AS total_profit " +
            "FROM user u " +
            "JOIN sharedpost sp ON u.id = sp.user_id " +
            "JOIN bitdetails bd ON sp.id = bd.sharedpost_id " +
            "JOIN categoreystatus cs ON cs.id = sp.categoreystatus_id " +
            "WHERE cs.status = 'Selling post' " +
            "AND u.name = ?1 " +
            "AND bd.conformedstate = 1 " +
            "GROUP BY u.id, u.name " +
            "ORDER BY total_profit",
            nativeQuery = true)
    Map<String, Object> getUserProfit(String username);

    @Query(value = "SELECT u.id, u.name, SUM(bd.bitrate * bd.needamount) AS total_cost " +
            "FROM user u " +
            "JOIN sharedpost sp ON u.id = sp.user_id " +
            "JOIN bitdetails bd ON sp.id = bd.sharedpost_id " +
            "JOIN categoreystatus cs ON cs.id = sp.categoreystatus_id " +
            "WHERE cs.status = 'Buying post' " +
            "AND u.name = ?1 " +
            "AND bd.conformedstate = 1 " +
            "GROUP BY u.id, u.name " +
            "ORDER BY total_cost",
            nativeQuery = true)
    Map<String, Object> getUserCost(String username);

    @Query(value = "select u.id, u.name, count(sp.id) as post_count from sharedpost sp join user u On sp.user_id = u.id join categoreystatus cs on cs.id = sp.categoreystatus_id where sp.categoreystatus_id=:postTypeId and u.name=:username Group by u.id ,u.name order by post_count", nativeQuery = true)
    Map<String, Object> getUserSharedBuyingPostCOunt(@Param("username") String username,@Param("postTypeId") int postTypeId);
}
