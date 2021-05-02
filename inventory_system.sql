-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 22, 2020 at 07:43 AM
-- Server version: 10.4.10-MariaDB
-- PHP Version: 7.4.0


DROP DATABASE IF EXISTS inventory_system;
CREATE DATABASE inventory_system;
USE inventory_system;

--
-- Database: `inventory_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`Id`, `Description`) VALUES
(1, 'Accessories'),
(2, 'Parts'),
(3, 'Peripherals'),
(4, 'Networking'),
(5, 'Storage Devices'),
(6, 'Printers');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `Phone` int(11) NOT NULL,
  `Email` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE IF NOT EXISTS `inventory` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Product_id` int(11) NOT NULL,
  `Warehouse_id` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `SupplierPrice` double(10,2) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Warehouse_id` (`Warehouse_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`Id`, `Product_id`, `Warehouse_id`, `Quantity`, `SupplierPrice`) VALUES
(1, 1, 2, 10, 50.00),
(2, 2, 2, 7, 70.00),
(3, 3, 1, 35, 100.00),
(4, 4, 1, 23, 125.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Description` varchar(100) NOT NULL,
  `RetailPrice` double(10,2) NOT NULL,
  `Category_id` int(11) NOT NULL,
  `Supplier_id` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Category_id` (`Category_id`),
  KEY `Supplier_id` (`Supplier_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`Id`, `Description`, `RetailPrice`, `Category_id`, `Supplier_id`) VALUES
(1, 'Fab8', 100.00, 6, 2),
(2, 'Whizzbang500', 105.00, 6, 2),
(3, 'chill hardisk 1.5TB', 99.90, 3, 1),
(4, 'complex cable set', 277.95, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `purchaseorders`
--

DROP TABLE IF EXISTS `purchaseorders`;
CREATE TABLE IF NOT EXISTS `purchaseorders` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Quantity` int(11) NOT NULL,
  `TotalRetailPrice` double(10,2) NOT NULL,
  `Status_id` int(11) NOT NULL,
  `Product_id` int(11) NOT NULL,
  `Customer_id` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Status_id` (`Status_id`),
  KEY `Customer_id` (`Customer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS `staff` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Phone` int(11) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Warehouse_id` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`Id`, `Name`, `Phone`, `Email`, `Warehouse_id`) VALUES
(1, 'Hanibal Smith', 299991234, 'hanibal@ateam.com', 1),
(2, 'dirk benedict', 299991332, 'dirk@ateam.com', 1);

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
CREATE TABLE IF NOT EXISTS `status` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`Id`, `Description`) VALUES
(1, 'Ordered'),
(2, 'Cancelled'),
(3, 'Completed'),
(4, 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE IF NOT EXISTS `suppliers` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CompanyName` varchar(100) NOT NULL,
  `ContactName` varchar(100) NOT NULL,
  `Address` varchar(100) NOT NULL,
  `Phone` int(11) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Website` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`Id`, `CompanyName`, `ContactName`, `Address`, `Phone`, `Email`, `Website`) VALUES
(1, 'HC hardware ltd', 'Peggy', '12 fit st', 298734445, 'Pegs@hchardware.com', 'www.hchardware.com'),
(2, 'Manly printers', 'fred', '1 the crescent', 299761555, 'fred@MPTRS.com', 'www.mptrs.com.au'),
(3, 'wires-all-over', 'Jane', 'belgrave rd, kingscross', 220002233, 'jane@wires.com', '');

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

DROP TABLE IF EXISTS `warehouse`;
CREATE TABLE IF NOT EXISTS `warehouse` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WarehouseName` varchar(100) DEFAULT NULL,
  `Phone` int(11) NOT NULL,
  `Address` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `warehouse`
--

INSERT INTO `warehouse` (`Id`, `WarehouseName`, `Phone`, `Address`) VALUES
(1, 'Main warehouse', 299991222, '32 Steve St, Sydney, 2099'),
(2, 'Printer store', 299991445, '12 Mervin Rd, Sydney 2333');