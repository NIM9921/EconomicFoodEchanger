package com.economicfoodexchanger.csvhandling;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/csvfileHandeling")
public class CsvController {

    @Autowired
    CsvDao csvDao;

    @GetMapping()
    public byte[] getLatestCsvFile() {
        Optional<Csv> latestCsv = csvDao.findAll(Sort.by(Sort.Direction.DESC, "uploaddate"))
                .stream()
                .findFirst();
        return latestCsv.map(Csv::getReport).orElse(null);
    }

    @GetMapping("/all")
    public List<byte[]> getAllCsvFiles() {
        return csvDao.findAll().stream()
                .map(Csv::getReport)
                .toList();
    }

    @PostMapping("/add")
    public byte[] addCsvRecord(@RequestBody Csv csv) {
        csv.setUploaddate(LocalDateTime.now());
        Csv savedCsv = csvDao.save(csv);
        return savedCsv.getReport();
    }
}
