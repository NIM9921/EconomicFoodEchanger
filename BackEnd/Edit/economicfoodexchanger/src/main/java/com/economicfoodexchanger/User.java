    package com.economicfoodexchanger;

    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.util.List;

    @Entity
    @Table(
            name = "user"
    )
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class    User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @Column(name = "name")
        private String name;

        @Column(name = "city", nullable = false, length = 45)
        private String city;

        @Column(name = "address", length = 45)
        private String address;

        @Column(name = "staus", nullable = false)
        private boolean status;

        @Column(name = "nic", unique = true, nullable = false, length = 12)
        private String nic;

        @Column(name = "mobilenumber", nullable = false)
        private Long mobileNumber;

        @Column(name = "username", unique = true, nullable = false, length = 45)
        private String username;

        @Column(name = "password", nullable = false, length = 45)
        private String password;

        @ManyToMany(fetch =FetchType.EAGER, cascade = CascadeType.ALL)
        @JoinTable(
                name = "user_has_role",
                joinColumns = @JoinColumn(name = "user_id"),
                inverseJoinColumns = @JoinColumn(name = "role_id")
        )
        private List<Role> roleList;

/*        @OneToOne
        @JoinColumn(name = "cummiunitymember_id", referencedColumnName = "id")
        private CommunityMember communityMember;*/
    }
