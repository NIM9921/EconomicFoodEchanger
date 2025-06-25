package com.economicfoodexchanger.sharedpost;

import com.economicfoodexchanger.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedPostDao extends JpaRepository<SharedPost, Integer> {
    List<SharedPost> getAllByUsername(User user);
}
