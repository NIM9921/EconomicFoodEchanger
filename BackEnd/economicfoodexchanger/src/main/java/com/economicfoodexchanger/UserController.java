package com.economicfoodexchanger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserDao userDao;

    @GetMapping("/all")
    public List<User> getAll(){
        return userDao.findAll();
    }

/*    @PostMapping()
    public User save(@RequestBody User user){
        return userDao.save(user);
    }
*/

    @GetMapping("/id/{id}")
    public Optional<User> getByUserID(@PathVariable Integer id){
        System.out.println("id = " + id);
        Optional<User> user = userDao.findById(id);
        return user;
    }

    @GetMapping("/username/{username}")
    public User getUserByUserName(@PathVariable String username){
        Optional<User> user = Optional.of(userDao.findUserByUsername(username));
        return user.get();
    }
}
