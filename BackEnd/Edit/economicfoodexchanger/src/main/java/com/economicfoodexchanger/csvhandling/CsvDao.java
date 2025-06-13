package com.economicfoodexchanger.csvhandling;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CsvDao extends JpaRepository<Csv, Integer> {
}
