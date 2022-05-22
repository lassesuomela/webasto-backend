-- MySQL dump 10.13  Distrib 8.0.29, for Linux (x86_64)
--
-- Host: localhost    Database: webasto
-- ------------------------------------------------------
-- Server version	8.0.29-0ubuntu0.20.04.3

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
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `onTime` int NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statusData`
--

DROP TABLE IF EXISTS `statusData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statusData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) NOT NULL,
  `onTime` bigint unsigned NOT NULL DEFAULT '15',
  `pulseSent` int NOT NULL DEFAULT '0',
  `rssi` smallint DEFAULT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statusData`
--

LOCK TABLES `statusData` WRITE;
/*!40000 ALTER TABLE `statusData` DISABLE KEYS */;
INSERT INTO `statusData` VALUES (1,0,0,0,0,'2022-01-23 00:38:18'),(2,0,0,0,0,'2022-01-23 00:30:39');
/*!40000 ALTER TABLE `statusData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tempData`
--

DROP TABLE IF EXISTS `tempData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tempData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `currentTemp` int NOT NULL,
  `humidity` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12848 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tempData`
--

LOCK TABLES `tempData` WRITE;
/*!40000 ALTER TABLE `tempData` DISABLE KEYS */;
INSERT INTO `tempData` VALUES (1,20,20);
/*!40000 ALTER TABLE `tempData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timers`
--

DROP TABLE IF EXISTS `timers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `time` time DEFAULT NULL,
  `time2` time DEFAULT NULL,
  `enabled` tinyint NOT NULL,
  `enabled2` tinyint NOT NULL,
  `onTime` tinyint unsigned NOT NULL DEFAULT '30',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timers`
--

LOCK TABLES `timers` WRITE;
/*!40000 ALTER TABLE `timers` DISABLE KEYS */;
INSERT INTO `timers` VALUES (1,'06:59:00','13:25:00',1,1,10),(2,'10:40:00','07:11:00',1,1,10),(3,'18:10:00','11:47:00',1,1,10),(4,'04:50:00','03:56:00',1,1,10),(5,'16:40:00','20:30:00',1,1,10);
/*!40000 ALTER TABLE `timers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voltageData`
--

DROP TABLE IF EXISTS `voltageData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voltageData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `voltage` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voltageData`
--

LOCK TABLES `voltageData` WRITE;
/*!40000 ALTER TABLE `voltageData` DISABLE KEYS */;
INSERT INTO `voltageData` VALUES (1,0);
/*!40000 ALTER TABLE `voltageData` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-22 23:10:25
