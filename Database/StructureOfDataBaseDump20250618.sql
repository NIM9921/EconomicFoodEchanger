CREATE DATABASE  IF NOT EXISTS `economicfoodexchanger` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `economicfoodexchanger`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: economicfoodexchanger
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bitdetails`
--

DROP TABLE IF EXISTS `bitdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bitdetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bitrate` decimal(10,2) DEFAULT NULL,
  `needamount` decimal(10,2) DEFAULT NULL,
  `bitdetailscol` varchar(255) DEFAULT NULL,
  `conformedstate` tinyint DEFAULT NULL,
  `sharedpost_id` int NOT NULL,
  `deliverylocation` varchar(45) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bitdetails_sharedpost1_idx` (`sharedpost_id`),
  KEY `fk_bitdetails_user1_idx` (`user_id`),
  CONSTRAINT `fk_bitdetails_sharedpost1` FOREIGN KEY (`sharedpost_id`) REFERENCES `sharedpost` (`id`),
  CONSTRAINT `fk_bitdetails_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categoreystatus`
--

DROP TABLE IF EXISTS `categoreystatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoreystatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cummiunitymember`
--

DROP TABLE IF EXISTS `cummiunitymember`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cummiunitymember` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `shoporfarmname` varchar(45) DEFAULT NULL,
  `nic` varchar(45) DEFAULT NULL,
  `mobileNumber` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `first name_UNIQUE` (`id`),
  UNIQUE KEY `e-mail_UNIQUE` (`email`),
  UNIQUE KEY `NIC_UNIQUE` (`nic`),
  UNIQUE KEY `Cummiunitymembercol_UNIQUE` (`mobileNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery`
--

DROP TABLE IF EXISTS `delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tracking_number` varchar(255) NOT NULL,
  `location` varchar(45) NOT NULL,
  `delivery_staus_id` int NOT NULL,
  `payment_id` int NOT NULL,
  `sharedpost_id` int NOT NULL,
  `current_package_location` varchar(45) DEFAULT NULL,
  `delivery_company` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_delivery_delivery_staus1_idx` (`delivery_staus_id`),
  KEY `fk_delivery_payment1_idx` (`payment_id`),
  KEY `fk_delivery_sharedpost1_idx` (`sharedpost_id`),
  CONSTRAINT `fk_delivery_delivery_staus1` FOREIGN KEY (`delivery_staus_id`) REFERENCES `delivery_staus` (`id`),
  CONSTRAINT `fk_delivery_payment1` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`),
  CONSTRAINT `fk_delivery_sharedpost1` FOREIGN KEY (`sharedpost_id`) REFERENCES `sharedpost` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery_staus`
--

DROP TABLE IF EXISTS `delivery_staus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_staus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `discussion_foram`
--

DROP TABLE IF EXISTS `discussion_foram`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discussion_foram` (
  `id` int NOT NULL AUTO_INCREMENT,
  `foram_name` varchar(45) NOT NULL,
  `topic` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `discussion_message`
--

DROP TABLE IF EXISTS `discussion_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discussion_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(45) NOT NULL,
  `discussion_foram_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_discussion_message_discussion_foram1_idx` (`discussion_foram_id`),
  CONSTRAINT `fk_discussion_message_discussion_foram1` FOREIGN KEY (`discussion_foram_id`) REFERENCES `discussion_foram` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `economiccsvreport`
--

DROP TABLE IF EXISTS `economiccsvreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `economiccsvreport` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uploaddate` datetime DEFAULT NULL,
  `report` mediumblob,
  `file_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mediaagreement`
--

DROP TABLE IF EXISTS `mediaagreement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mediaagreement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` tinyint DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_mediaagreement_user1_idx` (`user_id`),
  CONSTRAINT `fk_mediaagreement_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `note` varchar(45) DEFAULT NULL,
  `payment_type_id` int NOT NULL,
  `status` tinyint DEFAULT NULL,
  `file` mediumblob,
  `filetype` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payment_payment_type1_idx` (`payment_type_id`),
  CONSTRAINT `fk_payment_payment_type1` FOREIGN KEY (`payment_type_id`) REFERENCES `payment_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_type`
--

DROP TABLE IF EXISTS `payment_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `privilage`
--

DROP TABLE IF EXISTS `privilage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `privilage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `insert` tinyint NOT NULL,
  `select` tinyint NOT NULL,
  `module_id` int NOT NULL,
  `role_id` int NOT NULL,
  `update` tinyint NOT NULL,
  `delete` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`,`module_id`,`role_id`),
  KEY `fk_privilage_module1_idx` (`module_id`),
  KEY `fk_privilage_role1_idx` (`role_id`),
  CONSTRAINT `fk_privilage_module1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  CONSTRAINT `fk_privilage_role1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `promotion_items`
--

DROP TABLE IF EXISTS `promotion_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `topic` varchar(45) NOT NULL,
  `image` mediumblob NOT NULL,
  `description` varchar(45) NOT NULL,
  `status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_promotion_items_status1_idx` (`status_id`),
  CONSTRAINT `fk_promotion_items_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment` varchar(45) NOT NULL,
  `rate` varchar(45) NOT NULL,
  `sharedpost_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_review_sharedpost1_idx` (`sharedpost_id`),
  CONSTRAINT `fk_review_sharedpost1` FOREIGN KEY (`sharedpost_id`) REFERENCES `sharedpost` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=armscii8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sharedpost`
--

DROP TABLE IF EXISTS `sharedpost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sharedpost` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `quentity` varchar(45) DEFAULT NULL,
  `photos` mediumblob,
  `sallingcustomer` varchar(45) DEFAULT NULL,
  `discription` text,
  `user_id` int NOT NULL,
  `categoreystatus_id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `createdateandtime` datetime DEFAULT NULL,
  `latitude` varchar(45) DEFAULT NULL,
  `longitude` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sharedpost_user1_idx` (`user_id`),
  KEY `fk_sharedpost_categoreystatus1_idx` (`categoreystatus_id`),
  CONSTRAINT `fk_sharedpost_categoreystatus1` FOREIGN KEY (`categoreystatus_id`) REFERENCES `categoreystatus` (`id`),
  CONSTRAINT `fk_sharedpost_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sharestory`
--

DROP TABLE IF EXISTS `sharestory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sharestory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` mediumblob,
  `title` varchar(45) DEFAULT NULL,
  `discription` varchar(255) DEFAULT NULL,
  `createdateandtime` datetime DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sharestory_user1_idx` (`user_id`),
  CONSTRAINT `fk_sharestory_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `city` varchar(45) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `staus` tinyint NOT NULL,
  `nic` varchar(12) DEFAULT NULL,
  `mobilenumber` int NOT NULL,
  `photo` mediumblob,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `cummiunitymember_id` int DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_user_cummiunitymember1_idx` (`cummiunitymember_id`),
  CONSTRAINT `fk_user_cummiunitymember1` FOREIGN KEY (`cummiunitymember_id`) REFERENCES `cummiunitymember` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_has_role`
--

DROP TABLE IF EXISTS `user_has_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_has_role` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_user_has_role_role1_idx` (`role_id`),
  KEY `fk_user_has_role_user_idx` (`user_id`),
  CONSTRAINT `fk_user_has_role_role1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `fk_user_has_role_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-18  9:59:22
