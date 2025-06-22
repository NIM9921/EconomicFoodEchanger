package com.economicfoodexchanger.sharedpost.delivery;

import com.economicfoodexchanger.dto.DeliveryResponseDto;
import com.economicfoodexchanger.dto.DeliveryWithStatusDto;
import com.economicfoodexchanger.dto.UpdateStatusRequest;
import com.economicfoodexchanger.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @GetMapping(value = "/getbypostid")
    public DeliveryResponseDto getDeliveryByPost(@RequestParam(value = "postId") Integer postId) {
        return deliveryService.getDeliveryByPostId(postId);
    }

    @GetMapping(value = "/getbyid")
    public DeliveryResponseDto getDeliveryById(@RequestParam(value = "deliveryid") Integer id) {
        return deliveryService.getDeliveryById(id);
    }

    //http://localhost:8080/delivery/update-status
    @PostMapping("/update-status")
    public ResponseEntity<String> updateDeliveryStatus(@RequestBody UpdateStatusRequest request) {
        try {
            System.out.println("Received update request - DeliveryId: " + request.getDeliveryId() + ", StatusId: " + request.getStatusId());
            
            if (request.getDeliveryId() == null || request.getStatusId() == null) {
                return ResponseEntity.badRequest().body("DeliveryId and StatusId are required");
            }
            
            deliveryService.updateDeliveryStatus(request.getDeliveryId(), request.getStatusId());
            return ResponseEntity.ok("Status updated successfully");
        } catch (Exception e) {
            System.err.println("Error updating delivery status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to update status: " + e.getMessage());
        }
    }
    
    //http://localhost:8080/delivery/status-history/1
    @GetMapping("/status-history/{deliveryId}")
    public List<DeliveryStatusHistory> getStatusHistory(@PathVariable Integer deliveryId) {
        return deliveryService.getStatusHistory(deliveryId);
    }
    
    //http://localhost:8080/delivery/current-status/1
    @GetMapping("/current-status/{deliveryId}")
    public ResponseEntity<DeliveryStatusHistory> getCurrentStatus(@PathVariable Integer deliveryId) {
        DeliveryStatusHistory currentStatus = deliveryService.getCurrentStatus(deliveryId);
        if (currentStatus != null) {
            return ResponseEntity.ok(currentStatus);
        }
        return ResponseEntity.notFound().build();
    }
    
    //http://localhost:8080/delivery/getbypostid-with-status?postId=1
    @GetMapping(value = "/getbypostid-with-status")
    public DeliveryWithStatusDto getDeliveryWithStatus(@RequestParam(value = "postId") Integer postId) {
        return deliveryService.getDeliveryWithStatus(postId);
    }
}