-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 22 nov. 2025 à 10:10
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `blasira_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `app_config`
--

CREATE TABLE `app_config` (
  `id` bigint(20) NOT NULL,
  `base_fare` decimal(38,2) NOT NULL,
  `price_per_km` decimal(38,2) NOT NULL,
  `default_currency` varchar(255) NOT NULL,
  `driver_validation_required` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `app_config`
--

INSERT INTO `app_config` (`id`, `base_fare`, `price_per_km`, `default_currency`, `driver_validation_required`) VALUES
(1, 2.50, 1.75, 'EUR', 1);

-- --------------------------------------------------------

--
-- Structure de la table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) NOT NULL,
  `booked_seats` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `discount_amount` decimal(38,2) DEFAULT NULL,
  `status` enum('CANCELLED_BY_PASSENGER','CONFIRMED_BY_DRIVER','REJECTED_BY_DRIVER','REQUESTED_BY_PASSENGER') NOT NULL,
  `total_price` decimal(38,2) NOT NULL,
  `passenger_id` bigint(20) NOT NULL,
  `promo_code_id` bigint(20) DEFAULT NULL,
  `trip_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `conversation_participants`
--

CREATE TABLE `conversation_participants` (
  `conversation_id` bigint(20) NOT NULL,
  `user_profile_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) NOT NULL,
  `document_type` enum('DRIVING_LICENSE','IDENTITY_CARD','INSURANCE','VEHICLE_REGISTRATION') NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `status` enum('PENDING_REVIEW','REJECTED','VERIFIED') NOT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  `driver_profile_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `driver_profiles`
--

CREATE TABLE `driver_profiles` (
  `id` bigint(20) NOT NULL,
  `average_rating` double DEFAULT NULL,
  `rating_sum` bigint(20) NOT NULL,
  `review_count` int(11) NOT NULL,
  `status` enum('NOT_SUBMITTED','PENDING_REVIEW','REJECTED','SUSPENDED','VERIFIED') NOT NULL,
  `total_trips_driven` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `driver_profiles`
--

INSERT INTO `driver_profiles` (`id`, `average_rating`, `rating_sum`, `review_count`, `status`, `total_trips_driven`) VALUES
(1, 0, 0, 0, 'NOT_SUBMITTED', 0);

-- --------------------------------------------------------

--
-- Structure de la table `flyway_schema_history`
--

CREATE TABLE `flyway_schema_history` (
  `installed_rank` int(11) NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int(11) DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `execution_time` int(11) NOT NULL,
  `success` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `flyway_schema_history`
--

INSERT INTO `flyway_schema_history` (`installed_rank`, `version`, `description`, `type`, `script`, `checksum`, `installed_by`, `installed_on`, `execution_time`, `success`) VALUES
(1, '1', 'Initial Schema', 'SQL', 'V1__Initial_Schema.sql', 661523049, 'root', '2025-10-30 02:14:17', 4259, 1),
(2, '2', 'Add Capacity To Vehicles', 'SQL', 'V2__Add_Capacity_To_Vehicles.sql', 642205262, 'root', '2025-11-01 10:09:09', 23, 1),
(3, '3', 'Create App Config Table', 'SQL', 'V3__Create_App_Config_Table.sql', -1126426994, 'root', '2025-11-01 10:09:09', 19, 1);

-- --------------------------------------------------------

--
-- Structure de la table `incident_reports`
--

CREATE TABLE `incident_reports` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `reason` varchar(255) NOT NULL,
  `status` enum('CLOSED','OPEN','RESOLVED','UNDER_REVIEW') NOT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  `reporter_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) NOT NULL,
  `content` tinytext NOT NULL,
  `is_read` bit(1) NOT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `conversation_id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL,
  `amount` decimal(38,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `payment_method` enum('CASH','CREDIT_CARD','MOBILE_MONEY') NOT NULL,
  `status` enum('CANCELLED','FAILED','PENDING','SUCCESSFUL') NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `booking_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `promo_codes`
--

CREATE TABLE `promo_codes` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount_type` enum('FIXED_AMOUNT','PERCENTAGE') NOT NULL,
  `discount_value` decimal(38,2) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `max_uses` int(11) NOT NULL,
  `use_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) NOT NULL,
  `comment` longtext DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `review_type` enum('DRIVER_TO_PASSENGER','PASSENGER_TO_DRIVER') NOT NULL,
  `author_id` bigint(20) NOT NULL,
  `booking_id` bigint(20) NOT NULL,
  `recipient_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `shared_trip_links`
--

CREATE TABLE `shared_trip_links` (
  `id` bigint(20) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `trip_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `trips`
--

CREATE TABLE `trips` (
  `id` bigint(20) NOT NULL,
  `available_seats` int(11) NOT NULL,
  `departure_address` varchar(255) NOT NULL,
  `departure_coordinates` varchar(255) DEFAULT NULL,
  `departure_time` datetime(6) NOT NULL,
  `destination_address` varchar(255) NOT NULL,
  `destination_coordinates` varchar(255) DEFAULT NULL,
  `price_per_seat` decimal(38,2) NOT NULL,
  `status` enum('CANCELLED','COMPLETED','IN_PROGRESS','PLANNED') NOT NULL,
  `driver_id` bigint(20) NOT NULL,
  `vehicle_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_accounts`
--

CREATE TABLE `user_accounts` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `is_email_verified` bit(1) NOT NULL,
  `is_phone_verified` bit(1) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `trust_charter_accepted_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_accounts`
--

INSERT INTO `user_accounts` (`id`, `created_at`, `email`, `is_email_verified`, `is_phone_verified`, `password`, `phone_number`, `trust_charter_accepted_at`, `updated_at`) VALUES
(1, '2025-11-01 10:09:13.000000', 'admin@example.com', b'1', b'1', '$2a$10$VAfdsACTPA6f/u36I13OFugaDqPUK/gqNWVA3.tWS1zMSJPknhUAa', '+1112223333', '2025-11-01 10:09:13.000000', '2025-11-01 10:09:13.000000');

-- --------------------------------------------------------

--
-- Structure de la table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` bigint(20) NOT NULL,
  `bio` longtext DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `member_since` datetime(6) DEFAULT NULL,
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `student_verified` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_profiles`
--

INSERT INTO `user_profiles` (`id`, `bio`, `first_name`, `last_name`, `member_since`, `profile_picture_url`, `student_verified`) VALUES
(1, NULL, 'Admin', 'User', '2025-11-01 10:09:13.000000', NULL, b'0');

-- --------------------------------------------------------

--
-- Structure de la table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `roles` enum('ROLE_ADMIN','ROLE_USER') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `roles`) VALUES
(1, 'ROLE_USER'),
(1, 'ROLE_ADMIN');

-- --------------------------------------------------------

--
-- Structure de la table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` bigint(20) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `license_plate` varchar(255) NOT NULL,
  `make` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `type` enum('CAR','MOTORCYCLE') NOT NULL,
  `verification_status` enum('PENDING_REVIEW','REJECTED','VERIFIED') NOT NULL,
  `year` int(11) NOT NULL,
  `owner_user_id` bigint(20) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `app_config`
--
ALTER TABLE `app_config`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKae90jixn459854kxkii3e9a09` (`passenger_id`),
  ADD KEY `FK88eyq095hps8dgyrprdmoelge` (`promo_code_id`),
  ADD KEY `FK76g5jpvf8bcqejvp5d2vgrnjb` (`trip_id`);

--
-- Index pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD PRIMARY KEY (`conversation_id`,`user_profile_id`),
  ADD KEY `FK1e7cc420omf1ficfjcbwtavwb` (`user_profile_id`);

--
-- Index pour la table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbliog68rb5d03w5rop75os47d` (`driver_profile_id`);

--
-- Index pour la table `driver_profiles`
--
ALTER TABLE `driver_profiles`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `flyway_schema_history`
--
ALTER TABLE `flyway_schema_history`
  ADD PRIMARY KEY (`installed_rank`),
  ADD KEY `flyway_schema_history_s_idx` (`success`);

--
-- Index pour la table `incident_reports`
--
ALTER TABLE `incident_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK4myd1ljdiq24g0msk9uxtsf39` (`booking_id`),
  ADD KEY `FK6gpqskoujmve74p7x8nlip81n` (`reporter_id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKt492th6wsovh1nush5yl5jj8e` (`conversation_id`),
  ADD KEY `FK9gy4r61d2j8ir772fk9rdibhu` (`sender_id`);

--
-- Index pour la table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKnuscjm6x127hkb15kcb8n56wo` (`booking_id`);

--
-- Index pour la table `promo_codes`
--
ALTER TABLE `promo_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKj9mo0xgfs34t6e3c17anidd83` (`code`);

--
-- Index pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK3p9j9vyr1qofbcxju65es206r` (`booking_id`),
  ADD KEY `FKcjr0hqb9kvap6fxrgrm3a3vtp` (`author_id`),
  ADD KEY `FKjwrr6h52g0b9s77t47ln8tms4` (`recipient_id`);

--
-- Index pour la table `shared_trip_links`
--
ALTER TABLE `shared_trip_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKi2a8s7ylp316p4x70vve5x0d1` (`token`),
  ADD UNIQUE KEY `UKgvnqfc1p61weuryn4dm52sucs` (`trip_id`);

--
-- Index pour la table `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKlys16ik6qq2ja65b23o728c66` (`driver_id`),
  ADD KEY `FKqahsaodjirbk4if91c9bfnlgg` (`vehicle_id`);

--
-- Index pour la table `user_accounts`
--
ALTER TABLE `user_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKf9sl209luxhu4rylls0h1m625` (`email`),
  ADD UNIQUE KEY `UK32118ao3yprt9j4dqlcnwuf5v` (`phone_number`);

--
-- Index pour la table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user_roles`
--
ALTER TABLE `user_roles`
  ADD KEY `FKnb9ceyh529oqh9n3aiw68twme` (`user_id`);

--
-- Index pour la table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK9vovnbiegxevdhqfcwvp2g8pj` (`license_plate`),
  ADD KEY `FKj0uidnbp2qus8oojhrrdu6i2w` (`owner_user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `app_config`
--
ALTER TABLE `app_config`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `incident_reports`
--
ALTER TABLE `incident_reports`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `promo_codes`
--
ALTER TABLE `promo_codes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `shared_trip_links`
--
ALTER TABLE `shared_trip_links`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `trips`
--
ALTER TABLE `trips`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_accounts`
--
ALTER TABLE `user_accounts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `FK76g5jpvf8bcqejvp5d2vgrnjb` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`),
  ADD CONSTRAINT `FK88eyq095hps8dgyrprdmoelge` FOREIGN KEY (`promo_code_id`) REFERENCES `promo_codes` (`id`),
  ADD CONSTRAINT `FKae90jixn459854kxkii3e9a09` FOREIGN KEY (`passenger_id`) REFERENCES `user_profiles` (`id`);

--
-- Contraintes pour la table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD CONSTRAINT `FK1e7cc420omf1ficfjcbwtavwb` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profiles` (`id`),
  ADD CONSTRAINT `FK84npv3fo2vwl7ut63im0p417q` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`);

--
-- Contraintes pour la table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `FKbliog68rb5d03w5rop75os47d` FOREIGN KEY (`driver_profile_id`) REFERENCES `driver_profiles` (`id`);

--
-- Contraintes pour la table `driver_profiles`
--
ALTER TABLE `driver_profiles`
  ADD CONSTRAINT `FKsff8hplj067t5t351uswcb542` FOREIGN KEY (`id`) REFERENCES `user_accounts` (`id`);

--
-- Contraintes pour la table `incident_reports`
--
ALTER TABLE `incident_reports`
  ADD CONSTRAINT `FK4myd1ljdiq24g0msk9uxtsf39` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `FK6gpqskoujmve74p7x8nlip81n` FOREIGN KEY (`reporter_id`) REFERENCES `user_profiles` (`id`);

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `FK9gy4r61d2j8ir772fk9rdibhu` FOREIGN KEY (`sender_id`) REFERENCES `user_profiles` (`id`),
  ADD CONSTRAINT `FKt492th6wsovh1nush5yl5jj8e` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`);

--
-- Contraintes pour la table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `FKc52o2b1jkxttngufqp3t7jr3h` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Contraintes pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `FK28an517hrxtt2bsg93uefugrm` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `FKcjr0hqb9kvap6fxrgrm3a3vtp` FOREIGN KEY (`author_id`) REFERENCES `user_profiles` (`id`),
  ADD CONSTRAINT `FKjwrr6h52g0b9s77t47ln8tms4` FOREIGN KEY (`recipient_id`) REFERENCES `user_profiles` (`id`);

--
-- Contraintes pour la table `shared_trip_links`
--
ALTER TABLE `shared_trip_links`
  ADD CONSTRAINT `FKarbe60jhmpa059qky10anh1s2` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`);

--
-- Contraintes pour la table `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `FKlys16ik6qq2ja65b23o728c66` FOREIGN KEY (`driver_id`) REFERENCES `driver_profiles` (`id`),
  ADD CONSTRAINT `FKqahsaodjirbk4if91c9bfnlgg` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`);

--
-- Contraintes pour la table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `FK96l76pubaegmvwwi5nab736jy` FOREIGN KEY (`id`) REFERENCES `user_accounts` (`id`);

--
-- Contraintes pour la table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `FKnb9ceyh529oqh9n3aiw68twme` FOREIGN KEY (`user_id`) REFERENCES `user_accounts` (`id`);

--
-- Contraintes pour la table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `FKj0uidnbp2qus8oojhrrdu6i2w` FOREIGN KEY (`owner_user_id`) REFERENCES `user_accounts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
