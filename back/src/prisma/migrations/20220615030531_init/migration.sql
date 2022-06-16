-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(60) NOT NULL,
    `lastName` VARCHAR(60) NOT NULL,
    `rfc` VARCHAR(13) NOT NULL,

    UNIQUE INDEX `User_rfc_key`(`rfc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `typeAccount` ENUM('personal', 'business') NOT NULL,
    `numberAccount` VARCHAR(20) NOT NULL,
    `currentBalance` DOUBLE NOT NULL DEFAULT 0,
    `nip` VARCHAR(4) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `BankAccount_numberAccount_key`(`numberAccount`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
