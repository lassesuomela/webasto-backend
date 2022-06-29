-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema webasto
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema webasto
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `webasto` DEFAULT CHARACTER SET utf8mb4 ;
USE `webasto` ;

-- -----------------------------------------------------
-- Table `webasto`.`gpsData`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webasto`.`gpsData` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `lat` DOUBLE NOT NULL,
  `lng` DOUBLE NOT NULL,
  `alt` FLOAT NOT NULL,
  `speed` FLOAT NOT NULL,
  `sat` INT(2) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 248
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `webasto`.`logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webasto`.`logs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `startTime` TIME NOT NULL,
  `endTime` TIME NOT NULL,
  `onTime` INT(11) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 75
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `webasto`.`statusData`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webasto`.`statusData` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `status` TINYINT(1) NOT NULL,
  `onTime` BIGINT(3) UNSIGNED NOT NULL DEFAULT '15',
  `pulseSent` INT(2) NOT NULL DEFAULT '0',
  `rssi` SMALLINT(2) NULL DEFAULT NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `webasto`.`tempData`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webasto`.`tempData` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `temperature` INT(11) NOT NULL,
  `humidity` INT(11) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `webasto`.`timers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webasto`.`timers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `time` TIME NULL DEFAULT NULL,
  `time2` TIME NULL DEFAULT NULL,
  `enabled` TINYINT(4) NOT NULL,
  `enabled2` TINYINT(4) NOT NULL,
  `onTime` TINYINT(3) UNSIGNED NOT NULL DEFAULT '30',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `webasto`.`voltageData`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webasto`.`voltageData` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `voltage` FLOAT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `webasto`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webasto`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(30) NULL,
  `password` VARCHAR(60) NULL,
  `apikey` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
