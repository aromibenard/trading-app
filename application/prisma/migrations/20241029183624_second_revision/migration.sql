/*
  Warnings:

  - You are about to alter the column `balance` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `profit` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `loss` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `balance` on the `DailySummary` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `profit` on the `DailySummary` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `loss` on the `DailySummary` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `amount` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "balance" SET DATA TYPE INTEGER,
ALTER COLUMN "profit" SET DATA TYPE INTEGER,
ALTER COLUMN "loss" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "DailySummary" ALTER COLUMN "balance" SET DATA TYPE INTEGER,
ALTER COLUMN "profit" SET DATA TYPE INTEGER,
ALTER COLUMN "loss" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Trade" ALTER COLUMN "amount" SET DATA TYPE INTEGER;
