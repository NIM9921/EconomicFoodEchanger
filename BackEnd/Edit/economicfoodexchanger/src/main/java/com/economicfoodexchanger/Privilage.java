package com.economicfoodexchanger;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "privilage"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Privilage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "insert")
    boolean insert;

    @Column(name = "select")
    boolean select;

    @Column(name = "update")
    boolean update;

    @Column(name = "delete")
    boolean delete;

    @ManyToOne
    @JoinColumn(name = "module_id", referencedColumnName = "id")
    Module module_id;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    Role role_id;
}
