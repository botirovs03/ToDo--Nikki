-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: todo
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `CategoryID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `CategoryName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CategoryID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,11,'Benkyou'),(2,14,'Benkyou2'),(3,11,'Benkyou3'),(4,11,'fitness');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `TaskID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `CategoryID` int DEFAULT NULL,
  `TaskName` varchar(255) DEFAULT NULL,
  `Description` text,
  `Priority` varchar(20) DEFAULT NULL,
  `Deadline` date DEFAULT NULL,
  `Completed` tinyint(1) DEFAULT NULL,
  `CompletedDate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`TaskID`),
  KEY `UserID` (`UserID`),
  KEY `CategoryID` (`CategoryID`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (131,11,1,'asdfasdf','asdfasd','普通','2023-09-02',NULL,'2023-09-03 09:36:44'),(132,11,4,'asdfasdf','asdfasd','優先','2023-09-02',NULL,'2023-09-03 09:36:45'),(141,11,1,'asdfasdf','asdfasd','普通','2023-09-03',0,NULL),(142,11,4,'332211','asdf','低い','2023-09-03',1,'2023-09-03 09:56:03'),(143,11,1,'11232','','優先','2023-09-03',1,'2023-09-03 10:10:35'),(144,11,1,'ggggg','','普通','2023-09-03',0,NULL);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `Email_2` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (11,'botirovs032','botirovs03@gmail.com','$2b$10$BjYg.wbbTiStPSb3XYFg7enX0p8SNdBeJLg7.rqQPb4ZIGs1o07oi'),(14,'bss2','botirovs@gmail.com','$2b$10$NbgSu9de8jaFE/wFT7.5T.l0KG63Z40MeLDvMTjSvRcwsHbLlCG7.'),(16,'botirovs03','botirovs04@gmail.com','$2b$10$2r5XKDWQGC5eD40jAflc..UI2FjxFjNcrvSMzLyBejJREwg9vyxoa'),(21,'botirovs0355555555','botirovs045555@gmail.com','$2b$10$00yzCOsPWaJ1cWEA/nYV/.eJCB52RCHNZheh/UPZTYJPeBYKSzFAK'),(27,'qwerasdfqwer','sss@gmail.com','$2b$10$nKYweLSJoBTMMVkKz0ViQOKMVOvQGqfznLNPAjonrxsg1ZkdjGDnG'),(28,'SaydiakhrorSaydiakhror','botirovs031232@gmail.com','$2b$10$VNQ/WLqhzp1/2FKBcQL6fu5e7.PjHc.47Sjpuwl/6aCZEZCGlaBT.'),(29,'Saydiakhror Botirov','botirovs0312322@gmail.com','$2b$10$jQ8tNvFNzIDZhVlnfVvYBOt8yA3hBoQ.8glNQFmvZkur4Tl0./MIW'),(31,'botirovs03','botirovs0444@gmail.com','$2b$10$ViaeKTbNkNjPZIf1deJQou8sFAJGC0zJcOM/2vsTrLbjns6qUHvKi'),(32,'qwer','qwer@gmail.com','$2b$10$m34n9olXN6vMfqkJhmvetOT0Evx4z9QJ2DYw46PKMSbOA50z0WwZq'),(33,'Saydiakhror Botirov','qwe123qwer@gmail.com','$2b$10$dXC0AIEbpxq5XWwGE5ToS.KF6AJ3XcAg7S3D3Z/TBfW0Y5gb5ek8.'),(34,'Saydiakhror Botirov','1234qwer@gmail.com','$2b$10$Oem5Lmf6dzdqYfOoAE4Bt.W8X6DQopSyTrLfftOaMRaqylgFMwDU.'),(37,'Saydiakhror Botirov','botirovs01@gmail.com','$2b$10$pSrtX55oYuaafBTrx9DJw.j1Jrv8ZM7DX4AuitHx7XKczY76slTjW');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-03 18:48:54
