-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 04, 2024 at 04:45 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_buket`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_katalog`
--

CREATE TABLE `tbl_katalog` (
  `kode_produk` varchar(255) NOT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `deskripsi_produk` varchar(255) NOT NULL,
  `stok_produk` int(255) NOT NULL,
  `harga_produk` int(255) NOT NULL,
  `status_produk` varchar(255) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp(),
  `foto_produk` varchar(255) NOT NULL,
  `id_toko` varchar(255) NOT NULL,
  `deleted_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_katalog`
--

INSERT INTO `tbl_katalog` (`kode_produk`, `nama_produk`, `deskripsi_produk`, `stok_produk`, `harga_produk`, `status_produk`, `created_at`, `foto_produk`, `id_toko`, `deleted_at`) VALUES
('KDB05654403', 'tessss', 'asddddddddddddasddddd', 200, 500000, 'Ready', '2024-06-04', '1717503696329.jpg', 'org_2hPATFGA5rU10nkc2TXme9HkxOh', NULL),
('KDB13671165', 'test po', 'tttttttttttttttttttttttttttttttttttttttttttttttttt', 20000, 50000, 'Pre-Order 3 Hari', '2024-06-04', '1717500039587.jpg', 'org_2hPATFGA5rU10nkc2TXme9HkxOh', '2024-06-04'),
('KDB19267409', 'Bucket Snacks Edit tanpa foto', 'Bucket berisi berbagai macam snacks', 45, 65000, 'Ready', '2024-05-30', '1717083105281.jpg', '19', NULL),
('KDB25615977', 'Bucket Snacks Edit tanpa foto', 'Bucket berisi berbagai macam snacks', 45, 65000, 'Ready', '2024-05-30', '1717082680043-bucket-mawar.jpg', '19', NULL),
('KDB27281959', 'Bucket Snacks', 'Bucket berisi berbagai macam snacks', 19, 50000, 'Ready', '2024-05-31', '1717086766873.jpg', '19', NULL),
('KDB44703683', 'Buket Mawar Merah Deleteed', 'asdddddddddddddddddddddddd', 120, 120, 'Ready', '2024-06-04', '1717489763776.jpg', 'org_2hPATFGA5rU10nkc2TXme9HkxOh', NULL),
('KDB55699598', 'Bucket Snacks Edit tanpa foto', 'Bucket berisi berbagai macam snacks', 45, 65000, 'Ready', '2024-05-31', '1717087618090.jpg', '19', NULL),
('KDB57999140', 'Buket Mawar Merah Rama', 'asdddddddddddddddddddddddd', 100000, 100000, 'Ready', '2024-06-04', '1717500001719.png', 'org_2hPATFGA5rU10nkc2TXme9HkxOh', NULL),
('KDB66095341', 'Bucket Snacks Edit tanpa foto', 'Bucket berisi berbagai macam snacks', 45, 65000, 'Ready', '2024-05-31', '1717087814465.png', '19', NULL),
('KDB80787653', 'Bucket Snacks Edit tanpa foto', 'Bucket berisi berbagai macam snacks', 45, 65000, 'Ready', '2024-05-31', '1717087704465.png', '19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_order`
--

CREATE TABLE `tbl_order` (
  `id` int(255) NOT NULL,
  `kode_pesanan` varchar(255) NOT NULL,
  `jenis_pembayaran` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `total_pesanan` int(11) NOT NULL,
  `total_harga` int(11) NOT NULL,
  `id_pembeli` varchar(255) DEFAULT NULL,
  `kode_produk` varchar(255) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_order`
--

INSERT INTO `tbl_order` (`id`, `kode_pesanan`, `jenis_pembayaran`, `status`, `keterangan`, `total_pesanan`, `total_harga`, `id_pembeli`, `kode_produk`, `created_at`) VALUES
(7, 'KDB0099100700', 'Master Card', 'Completed', 'Bucket hagan lala', 2, 100000, 'aanbbg', 'KDB27281959', '2024-06-03'),
(8, 'KDB0015432195', 'Master Card', 'Pending', 'Bucket hagan gandak', 1, 50000, 'aanbbg', 'KDB27281959', '2024-06-03'),
(9, 'KDB0052483797', 'Master Card', 'Pending', 'Bucket hagan gandak', 1, 50000, 'aanbbg', 'KDB27281959', '2024-06-03'),
(10, 'KDB0088983242', 'Master Card', 'Pending', 'Bucket hagan gandak', 1, 50000, 'aanbbg', 'KDB27281959', '2024-06-03'),
(11, 'KDB0083598661', 'Master Card', 'Pending', 'Bucket hagan gandak', 1, 50000, 'aanbbg', 'KDB27281959', '2024-06-03');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pembeli`
--

CREATE TABLE `tbl_pembeli` (
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `id_pembeli` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_pembeli`
--

INSERT INTO `tbl_pembeli` (`username`, `email`, `id_pembeli`) VALUES
('aanbbg', 'aanbbg@gmail.com', 'aanbbg'),
('aanbbgg', 'aanbbgg@gmail.com', 'aanbbgg'),
('aanbbggg', 'aanbbggg@gmail.com', 'aanbbggg');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_penjual`
--

CREATE TABLE `tbl_penjual` (
  `id_penjual` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(30) DEFAULT NULL,
  `id_toko` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_penjual`
--

INSERT INTO `tbl_penjual` (`id_penjual`, `username`, `email`, `role`, `id_toko`) VALUES
('helloals', 'helloals', 'helloals.official@gmail.com', 'Pemilik', '19'),
('karyawanhelloals', 'karyawanhelloals', 'karyawanhelloals@gmail.com', 'Karyawan', '19'),
('pemiliktest', 'pemiliktest', 'pemiliktest@gmail.com', 'Pemilik', '21'),
('pemiliktest2', 'pemiliktest2', 'pemiliktest2@gmail.com', 'Pemilik', '22'),
('user_2h89Mf3tJj0MTHt3SxTFpifvkAK', 'ramaaaa', 'ramanoorrizki@gmail.com', 'Pemilik', 'org_2hPATFGA5rU10nkc2TXme9HkxOh'),
('user_2h8AeWnYlKxqOjS5YZHkqpLF7lC', 'udinudin', 'ramanoorrizkidicoding@gmail.com', 'Pemilik', 'org_2hP0JzwrPJtsbdcmbsSWrLmZW7c');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_toko`
--

CREATE TABLE `tbl_toko` (
  `id_toko` varchar(255) NOT NULL,
  `nama_toko` varchar(255) NOT NULL,
  `deskripsi_toko` varchar(255) NOT NULL,
  `alamat_toko` varchar(255) NOT NULL,
  `foto_profil` varchar(255) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_toko`
--

INSERT INTO `tbl_toko` (`id_toko`, `nama_toko`, `deskripsi_toko`, `alamat_toko`, `foto_profil`, `created_at`) VALUES
('19', 'HelloAls', 'Menyediakan berbagai macam bucket bunga', 'Jalan Dahlina Raya', '1716926197953-cube.jpg', '2024-05-29'),
('20', 'HelloAls', 'Menyediakan berbagai macam bucket bunga', 'Jalan Dahlina Raya', '1717086264916.jpg', '2024-05-31'),
('21', 'HelloAls', 'Menyediakan berbagai macam bucket bunga', 'Jalan Dahlina Raya', '1717086918046.png', '2024-05-31'),
('22', 'HelloAlsEdited222', 'Menyediakan berbagai macam bucket bunga', 'Jalan Dahlina Raya Edited22', '1717351551842.png', '2024-06-03'),
('23', 'Test TOko', 'tokokooooooooooooojereeee', 'Jl Veteran asdddddddddd', '1717474604630.jpg', '2024-06-04'),
('24', 'Tst ttt', 'asdddddddddasddddddd', 'asdddddddddddddddddd', '1717474820360.png', '2024-06-04'),
('25', 'toko Udin', 'tesssssssssssssssssss', 'tessssssssssssssssssssss', '1717475456980.jpg', '2024-06-04'),
('org_2hP0JzwrPJtsbdcmbsSWrLmZW7c', 'Buket Sakti', 'Buket sakti prikitim', 'Jl Martapura Barat balb', '1717480336169.jpg', '2024-06-04'),
('org_2hP5ys1gawedVq9ck7GcNoHpq1z', 'Udiiiiin', 'asdddddddddddddddddddddd', 'asddddddddddasddddddddd', '1717483128817.png', '2024-06-04'),
('org_2hPATFGA5rU10nkc2TXme9HkxOh', 'Udinnnnn nganga', 'asdddddddddddddddd', 'asddddddddddddd', '1717485344335.png', '2024-06-04'),
('test integrasi', 'test integrasi', 'tessssssssssssssssssss', 'ssssssssssssssssssss', '1717477116925.png', '2024-06-04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_katalog`
--
ALTER TABLE `tbl_katalog`
  ADD PRIMARY KEY (`kode_produk`),
  ADD KEY `fk_id_toko_katalog` (`id_toko`);

--
-- Indexes for table `tbl_order`
--
ALTER TABLE `tbl_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pembeli` (`id_pembeli`),
  ADD KEY `fk_kode_produk` (`kode_produk`);

--
-- Indexes for table `tbl_pembeli`
--
ALTER TABLE `tbl_pembeli`
  ADD PRIMARY KEY (`id_pembeli`),
  ADD UNIQUE KEY `uniqueUsername` (`username`),
  ADD UNIQUE KEY `uniqueEmail` (`email`) USING BTREE;

--
-- Indexes for table `tbl_penjual`
--
ALTER TABLE `tbl_penjual`
  ADD PRIMARY KEY (`id_penjual`),
  ADD UNIQUE KEY `uniqueUsername` (`username`),
  ADD UNIQUE KEY `uniqueEmail` (`email`),
  ADD KEY `fk_penjual_id_toko` (`id_toko`);

--
-- Indexes for table `tbl_toko`
--
ALTER TABLE `tbl_toko`
  ADD PRIMARY KEY (`id_toko`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_order`
--
ALTER TABLE `tbl_order`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_katalog`
--
ALTER TABLE `tbl_katalog`
  ADD CONSTRAINT `fk_id_toko_katalog` FOREIGN KEY (`id_toko`) REFERENCES `tbl_toko` (`id_toko`);

--
-- Constraints for table `tbl_order`
--
ALTER TABLE `tbl_order`
  ADD CONSTRAINT `fk_kode_produk` FOREIGN KEY (`kode_produk`) REFERENCES `tbl_katalog` (`kode_produk`),
  ADD CONSTRAINT `fk_pembeli` FOREIGN KEY (`id_pembeli`) REFERENCES `tbl_pembeli` (`id_pembeli`);

--
-- Constraints for table `tbl_penjual`
--
ALTER TABLE `tbl_penjual`
  ADD CONSTRAINT `fk_id_toko` FOREIGN KEY (`id_toko`) REFERENCES `tbl_toko` (`id_toko`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
