package com.economicfoodexchanger.userreport;


import com.economicfoodexchanger.User;
import com.economicfoodexchanger.UserController;
import com.economicfoodexchanger.UserDao;
import com.economicfoodexchanger.csvhandling.CsvController;
import com.economicfoodexchanger.sharedpost.SharedPostController;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/userreport")
public class UserReportController {

    @Autowired
    UserDao userDao;

    @Autowired
    SharedPostController sharedPostController;

    @Autowired
    CsvController csvController;

    @Autowired
    UserController userController;

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

    @GetMapping("/sharedpostComparsion")
    public LinkedHashSet<String> shredPostComparisonDetails(){
        Optional<User> user = userDao.findById(1);

        LinkedHashSet<String> uniqueTitles = new LinkedHashSet<>();
        if (user.isPresent()) {
            sharedPostController.getUserSharedPost(user.get()).forEach(sharedPost -> {
                uniqueTitles.add(sharedPost.getTitle());
            });
        }

        return  uniqueTitles;
    }

    @GetMapping("/recent-items")
    public List<RecentItem> getRecentItems() {
        try {
            // Get user shared post titles
            LinkedHashSet<String> userItems = shredPostComparisonDetails();
            
            // Get CSV data
            byte[] csvData = csvController.getLatestCsvFile();
            if (csvData == null) {
                return new ArrayList<>();
            }
            
            // Parse JSON from CSV data
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonData = objectMapper.readTree(csvData);
            JsonNode items = jsonData.get("items");
            
            // Get user role to determine price calculation logic
            String userRole = userController.getUserRoleByUserId();
            boolean isSeller = "seller".equalsIgnoreCase(userRole);
            
            List<RecentItem> recentItems = new ArrayList<>();
            int itemId = 1;
            
            // Process each user item
            for (String userItemName : userItems) {
                // Find matching item in CSV data
                for (JsonNode item : items) {
                    String csvItemName = item.get("Item-name").asText();
                    
                    // Case-insensitive matching
                    if (csvItemName.toLowerCase().contains(userItemName.toLowerCase()) || 
                        userItemName.toLowerCase().contains(csvItemName.toLowerCase())) {
                        
                        String category = item.get("category").asText();
                        
                        // Calculate price differences for both locations
                        double pettahDiff = calculatePriceDifference(item, "Pettah");
                        double dambullaDiff = calculatePriceDifference(item, "Dambulla");
                        
                        // Choose the best price based on user role
                        double bestPrice;
                        if (isSeller) {
                            // Seller wants highest price difference (best profit)
                            bestPrice = Math.max(pettahDiff, dambullaDiff);
                        } else {
                            // Buyer wants lowest price difference (best savings)
                            bestPrice = Math.min(pettahDiff, dambullaDiff);
                        }
                        
                        RecentItem recentItem = new RecentItem();
                        recentItem.setId(itemId++);
                        recentItem.setName(csvItemName);
                        recentItem.setPriceChanges(bestPrice);
                        recentItem.setCategory(category);
                        
                        recentItems.add(recentItem);
                        break; // Found match, move to next user item
                    }
                }
            }
            
            return recentItems;
            
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    private double calculatePriceDifference(JsonNode item, String location) {
        try {
            String todayKey = "Wholesale-" + location + "-today";
            String yesterdayKey = "Wholesale-" + location + "-yesterday";
            
            double today = Double.parseDouble(item.get(todayKey).asText());
            double yesterday = Double.parseDouble(item.get(yesterdayKey).asText());
            
            return today - yesterday;
        } catch (Exception e) {
            return 0.0;
        }
    }
    
    // Helper class for recent items response
    public static class RecentItem {
        private int id;
        private String name;
        private double priceChanges;
        private String category;
        
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public double getPriceChanges() { return priceChanges; }
        public void setPriceChanges(double price) { this.priceChanges = price; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }
}
