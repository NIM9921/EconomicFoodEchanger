package com.economicfoodexchanger.userreport;


import com.economicfoodexchanger.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/userreport")
public class UserReportController {

    @Autowired
    UserDao userDao;

    //http://localhost:8080/userreport
    @GetMapping
    public HashMap<String,String> UserReport() {

        HashMap<String,String> userReport = new HashMap<>();

        Map<String,Object> userReportGet = userDao.getUserCost("nimni");
        userReport.put("total_cost", String.valueOf(userReportGet.get("total_cost")));

        userReportGet = userDao.getUserProfit("nimni");
        userReport.put("total_profit", String.valueOf(userReportGet.get("total_profit")));

        userReportGet = userDao.getUserSharedBuyingPostCOunt("nimni",2);
        userReport.put("shared_buying_post_count", String.valueOf(userReportGet.get("post_count")));

        userReportGet = userDao.getUserSharedBuyingPostCOunt("nimni",1);
        userReport.put("shared_selling_post_count", String.valueOf(userReportGet.get("post_count")));

        userReportGet = userDao.getUserProfit("nimni");
        System.out.println(userReport.get("total_profit"));

        return userReport;
    }

}
