
package com.economicfoodexchanger.sharedpost;
import com.economicfoodexchanger.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

public interface SharedPostDao extends JpaRepository<SharedPost, Integer> {

    List<SharedPost> getAllByUsername(User user);

}
