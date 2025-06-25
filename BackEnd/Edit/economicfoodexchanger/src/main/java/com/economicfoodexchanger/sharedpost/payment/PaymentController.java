package com.economicfoodexchanger.sharedpost.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/payment")

public class PaymentController {
    @Autowired
    PaymentDao paymentDao;

    @Autowired
    PaymentTypeDao paymentTypeDao;

    @GetMapping("/all")
    public List<Payment> getAllPayments() {
        return paymentDao.findAll();
    }

    @PostMapping("/upload")
    public String uploadPayment(Payment payment) {
        try {
            paymentDao.save(payment);
            return "Payment uploaded successfully!";
        } catch (Exception e) {
            return "Upload failed: " + e.getMessage();
        }
    }

    @GetMapping("/file/{id}")
    public ResponseEntity<byte[]> getPaymentFile(@PathVariable int id) {
        Optional<Payment> optionalPayment = paymentDao.findById(id);
        if (optionalPayment.isPresent()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(MediaType.ALL_VALUE))
                    .body(optionalPayment.get().getFile());
        }
        return ResponseEntity.notFound().build();
    }

    //http://localhost:8080/payment/file/getbyid?id=1
    @GetMapping("/file/getbyid")
    public ResponseEntity<?> getPaymentFileById(@RequestParam Integer id) {
        try {
            Optional<Payment> paymentOpt = paymentDao.findById(id);
            if (!paymentOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Payment payment = paymentOpt.get();
            
            // Check if payment has a file
            if (payment.getFile() == null || payment.getFile().length == 0) {
                return ResponseEntity.badRequest().body(new FileResponse(
                    null, 
                    null, 
                    false, 
                    "No file found for payment ID: " + id
                ));
            }
            
            // Determine content type based on filetype
            String contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE; // Default
            if (payment.getFiletype() != null && !payment.getFiletype().trim().isEmpty()) {
                String fileType = payment.getFiletype().toLowerCase().trim();
                switch (fileType) {
                    case "pdf":
                        contentType = "application/pdf";
                        break;
                    case "jpg":
                    case "jpeg":
                        contentType = "image/jpeg";
                        break;
                    case "png":
                        contentType = "image/png";
                        break;
                    case "gif":
                        contentType = "image/gif";
                        break;
                    case "doc":
                        contentType = "application/msword";
                        break;
                    case "docx":
                        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                        break;
                    case "xls":
                        contentType = "application/vnd.ms-excel";
                        break;
                    case "xlsx":
                        contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        break;
                    case "txt":
                        contentType = "text/plain";
                        break;
                    default:
                        contentType = "application/" + fileType;
                        break;
                }
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header("Content-Disposition", "inline; filename=\"payment_" + id + "_file." + 
                           (payment.getFiletype() != null ? payment.getFiletype() : "bin") + "\"")
                    .body(payment.getFile());
                    
        } catch (Exception e) {
            System.err.println("Error retrieving payment file: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new FileResponse(
                null, 
                null, 
                false, 
                "Error retrieving file: " + e.getMessage()
            ));
        }
    }
    
    //http://localhost:8080/payment/file/info?id=1
    @GetMapping("/file/info")
    public ResponseEntity<FileResponse> getPaymentFileInfo(@RequestParam Integer id) {
        try {
            Optional<Payment> paymentOpt = paymentDao.findById(id);
            if (!paymentOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Payment payment = paymentOpt.get();
            boolean hasFile = payment.getFile() != null && payment.getFile().length > 0;
            
            FileResponse response = new FileResponse(
                payment.getFiletype(),
                hasFile ? formatFileSize(payment.getFile().length) : "0 B",
                hasFile,
                hasFile ? "File available" : "No file attached"
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new FileResponse(
                null, 
                null, 
                false, 
                "Error retrieving file info: " + e.getMessage()
            ));
        }
    }
    
    @PutMapping(value = "/updatepayment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePayment(
            @RequestParam Integer paymentid,
            @RequestParam(required = false) String amount,
            @RequestParam(required = false) String note,
            @RequestParam(required = false) Integer paymentTypeId,
            @RequestParam(required = false) Boolean status,
            @RequestParam(required = false) String filetype,
            @RequestParam(required = false) MultipartFile file) {

        try {
            Optional<Payment> existingPaymentOpt = paymentDao.findById(paymentid);
            if (!existingPaymentOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Payment existingPayment = existingPaymentOpt.get();

            // Update amount if provided
            if (amount != null && !amount.trim().isEmpty()) {
                try {
                    existingPayment.setAmount(new java.math.BigDecimal(amount));
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("Invalid amount format");
                }
            }

            // Update note if provided (validate max 45 characters)
            if (note != null) {
                if (note.length() > 45) {
                    return ResponseEntity.badRequest().body("Note cannot exceed 45 characters");
                }
                existingPayment.setNote(note.trim().isEmpty() ? null : note.trim());
            }

            // Update payment type if provided
            if (paymentTypeId != null) {
                Optional<PaymentType> paymentTypeOpt = paymentTypeDao.findById(paymentTypeId);
                if (!paymentTypeOpt.isPresent()) {
                    return ResponseEntity.badRequest().body("Payment type not found with ID: " + paymentTypeId);
                }
                existingPayment.setPaymentType(paymentTypeOpt.get());
            }

            // Update status if provided
            if (status != null) {
                existingPayment.setStatus(status);
            }

            // Handle file upload if provided
            if (file != null && !file.isEmpty()) {
                // Validate file size (max 16MB for MEDIUMBLOB)
                if (file.getSize() > 16 * 1024 * 1024) {
                    return ResponseEntity.badRequest().body("File size cannot exceed 16MB");
                }

                try {
                    existingPayment.setFile(file.getBytes());

                    // Set filetype from parameter or detect from file
                    if (filetype != null && !filetype.trim().isEmpty()) {
                        if (filetype.length() > 10) {
                            return ResponseEntity.badRequest().body("File type cannot exceed 10 characters");
                        }
                        existingPayment.setFiletype(filetype.trim());
                    } else {
                        // Try to detect from content type
                        String contentType = file.getContentType();
                        if (contentType != null && contentType.contains("/")) {
                            String detectedType = contentType.substring(contentType.lastIndexOf("/") + 1);
                            existingPayment.setFiletype(detectedType.length() >
                                    10 ? detectedType.substring(0, 10) : detectedType);
                        }
                    }

                    System.out.println("File updated: " + file.getOriginalFilename() +
                            " (" + formatFileSize(file.getSize()) + ")");

                } catch (Exception e) {
                    return ResponseEntity.badRequest().body("Failed to process file: " + e.getMessage());
                }
            } else if (filetype != null) {
                // Update only filetype without file
                if (filetype.length() > 10) {
                    return ResponseEntity.badRequest().body("File type cannot exceed 10 characters");
                }
                existingPayment.setFiletype(filetype.trim().isEmpty() ? null : filetype.trim());
            }

            Payment updatedPayment = paymentDao.save(existingPayment);
            return ResponseEntity.ok(updatedPayment);

        } catch (Exception e) {
            System.err.println("Error updating payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    //http://localhost:8080/payment/1
    @GetMapping("/{id}")
    public ResponseEntity<PaymentInfoDto> getPaymentById(@PathVariable Integer id) {
        try {
            Optional<Payment> paymentOpt = paymentDao.findById(id);
            if (!paymentOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Payment payment = paymentOpt.get();
            
            PaymentInfoDto paymentInfo = new PaymentInfoDto();
            paymentInfo.setId(payment.getId());
            paymentInfo.setAmount(payment.getAmount());
            paymentInfo.setNote(payment.getNote());
            paymentInfo.setStatus(payment.isStatus());
            paymentInfo.setFiletype(payment.getFiletype());
            paymentInfo.setPaymentType(payment.getPaymentType());
            paymentInfo.setHasFile(payment.getFile() != null && payment.getFile().length > 0);
            paymentInfo.setFileSize(payment.getFile() != null ? formatFileSize(payment.getFile().length) : "0 B");
            
            return ResponseEntity.ok(paymentInfo);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // DTO for payment information without file data
    public static class PaymentInfoDto {
        private Integer id;
        private java.math.BigDecimal amount;
        private String note;
        private boolean status;
        private String filetype;
        private PaymentType paymentType;
        private boolean hasFile;
        private String fileSize;
        
        // Getters and setters
        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
        public java.math.BigDecimal getAmount() { return amount; }
        public void setAmount(java.math.BigDecimal amount) { this.amount = amount; }
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
        public boolean isStatus() { return status; }
        public void setStatus(boolean status) { this.status = status; }
        public String getFiletype() { return filetype; }
        public void setFiletype(String filetype) { this.filetype = filetype; }
        public PaymentType getPaymentType() { return paymentType; }
        public void setPaymentType(PaymentType paymentType) { this.paymentType = paymentType; }
        public boolean isHasFile() { return hasFile; }
        public void setHasFile(boolean hasFile) { this.hasFile = hasFile; }
        public String getFileSize() { return fileSize; }
        public void setFileSize(String fileSize) { this.fileSize = fileSize; }
    }

    // Helper method for file size formatting
    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        else return String.format("%.1f MB", bytes / (1024.0 * 1024.0));
    }

    // Helper class for file response information
    public static class FileResponse {
        private String filetype;
        private String fileSize;
        private boolean hasFile;
        private String message;
        
        public FileResponse(String filetype, String fileSize, boolean hasFile, String message) {
            this.filetype = filetype;
            this.fileSize = fileSize;
            this.hasFile = hasFile;
            this.message = message;
        }
        
        // Getters and setters
        public String getFiletype() { return filetype; }
        public void setFiletype(String filetype) { this.filetype = filetype; }
        public String getFileSize() { return fileSize; }
        public void setFileSize(String fileSize) { this.fileSize = fileSize; }
        public boolean isHasFile() { return hasFile; }
        public void setHasFile(boolean hasFile) { this.hasFile = hasFile; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

}
