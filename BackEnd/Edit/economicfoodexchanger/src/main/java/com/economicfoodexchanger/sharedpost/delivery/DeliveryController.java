package com.economicfoodexchanger.sharedpost.delivery;

import com.economicfoodexchanger.dto.DeliveryResponseDto;
import com.economicfoodexchanger.dto.DeliveryWithStatusDto;
import com.economicfoodexchanger.dto.UpdateStatusRequest;
import com.economicfoodexchanger.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private DeliveryDao deliveryDao;

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

    @PutMapping(value = "/update-all-details")
    public HashMap<String,Object> updateAllDeliveryDetails(@RequestBody HashMap<String,Object> AllDeliveryDetails ,@RequestParam(value = "deliveryId") Integer deliveryId) {

        HashMap<String, Object> response = new HashMap<>();
        try {
            Optional<Delivery> ExisitingOptionalDelivery = deliveryDao.findById(deliveryId);
            if (ExisitingOptionalDelivery.isPresent()) {
                Delivery ExisitingDelivery = ExisitingOptionalDelivery.get();
                
                // Update tracking number
                if (AllDeliveryDetails.containsKey("trackingNumber")) {
                    ExisitingDelivery.setTrackingNumber((String) AllDeliveryDetails.get("trackingNumber"));
                }
                
                // Update location
                if(AllDeliveryDetails.containsKey("location")){
                    ExisitingDelivery.setLocation((String) AllDeliveryDetails.get("location"));
                }
                
                // Update current package location
                if(AllDeliveryDetails.containsKey("currentPackageLocation")){
                    ExisitingDelivery.setCurrentPackageLocation((String) AllDeliveryDetails.get("currentPackageLocation"));
                }
                
                // Update delivery company
                if (AllDeliveryDetails.containsKey("deliveryCompany")){
                    ExisitingDelivery.setDeliveryCompany((String) AllDeliveryDetails.get("deliveryCompany"));
                }

                // Update description if provided
                if (AllDeliveryDetails.containsKey("description")) {
                    ExisitingDelivery.setDescription((String) AllDeliveryDetails.get("description"));
                }

                // Save the delivery
                Delivery savedDelivery = deliveryDao.save(ExisitingDelivery);

                // Update delivery status if provided
                if (AllDeliveryDetails.containsKey("deliveryStatus")) {
                    Integer statusId = (Integer) AllDeliveryDetails.get("deliveryStatus");
                    
                    UpdateStatusRequest requestStatusRequest = new UpdateStatusRequest();
                    requestStatusRequest.setDeliveryId(savedDelivery.getId());
                    requestStatusRequest.setStatusId(statusId);

                    ResponseEntity<String> statusUpdateResult = updateDeliveryStatus(requestStatusRequest);
                    
                    if (statusUpdateResult.getStatusCode().is2xxSuccessful()) {
                        response.put("success", true);
                        response.put("message", "Delivery updated successfully");
                        response.put("deliveryId", savedDelivery.getId());
                        response.put("statusUpdateMessage", statusUpdateResult.getBody());
                    } else {
                        response.put("success", false);
                        response.put("message", "Delivery updated but status update failed");
                        response.put("error", statusUpdateResult.getBody());
                    }
                } else {
                    response.put("success", true);
                    response.put("message", "Delivery updated successfully (no status change)");
                    response.put("deliveryId", savedDelivery.getId());
                }

            } else {
                response.put("success", false);
                response.put("error", "Delivery not found for ID: " + deliveryId);
            }
        } catch (ClassCastException e) {
            response.put("success", false);
            response.put("error", "Invalid data type in request: " + e.getMessage());
            System.err.println("ClassCastException in updateAllDeliveryDetails: " + e.getMessage());
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to update delivery: " + e.getMessage());
            System.err.println("Exception in updateAllDeliveryDetails: " + e.getMessage());
            e.printStackTrace();
        }

        return response;
    }
}