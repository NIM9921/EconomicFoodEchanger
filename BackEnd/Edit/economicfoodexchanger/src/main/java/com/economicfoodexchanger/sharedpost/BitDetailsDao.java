package com.economicfoodexchanger.sharedpost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BitDetailsDao extends JpaRepository<BitDetails, Integer> {


    List<BitDetails> findBySharedpost(SharedPost sharedPost);
}
