package com.economicfoodexchanger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserDao userDao;

    @Autowired
    CommunityMemberDao communityMemberDao;

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
        System.out.println("Hello    World");
        System.out.println("id = " + id);
        Optional<User> user = userDao.findById(id);
        return user;
    }

    @GetMapping("/username/{username}")
    public User getUserByUserName(@PathVariable String username){
        Optional<User> user = Optional.of(userDao.findUserByUsername(username));
        return user.get();
    }

    @PostMapping()
    public ResponseEntity<?> save(@RequestBody User user) {
        try {
            // Check if user has a communityMember
            if (user.getCommunityMember() != null) {
                CommunityMember communityMember = user.getCommunityMember();

                // Save the CommunityMember first

                CommunityMember savedCommunityMember = communityMemberDao.save(communityMember);

                // Set the saved CommunityMember (with generated ID) back to the user
                user.setCommunityMember(savedCommunityMember);


            }

            // Now save the User

            User savedUser = userDao.save(user);
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {

            e.printStackTrace();

            // Return detailed error information
            return ResponseEntity.badRequest().body(new ErrorResponse(
                    "Failed to save user: " + e.getMessage(),
                    e.getClass().getSimpleName()
            ));
        }
    }

    // Helper class for error responses
    public static class ErrorResponse {
        private String message;
        private String errorType;

        public ErrorResponse(String message, String errorType) {
            this.message = message;
            this.errorType = errorType;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getErrorType() { return errorType; }
        public void setErrorType(String errorType) { this.errorType = errorType; }
    }

    @GetMapping("/logingrole")
    public String getUserRoleByUserId() {
        Optional<User> user = userDao.findById(1);
        if (user.isPresent()) {
            List<Role> roles = user.get().getRoleList();
            if (!roles.isEmpty()) {
                return roles.get(0).getName();
            }
        }
        return "User not found";
    }

    @GetMapping("/getbyid")
    public User getUserById(Integer id) {

        Optional<User> user = userDao.findById(1);
        return user.orElse(null);
    }

}
