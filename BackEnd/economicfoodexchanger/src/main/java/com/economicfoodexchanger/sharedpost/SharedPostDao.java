package com.economicfoodexchanger.sharedpost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

    public interface SharedPostDao extends JpaRepository<SharedPost, Integer>{

    }

