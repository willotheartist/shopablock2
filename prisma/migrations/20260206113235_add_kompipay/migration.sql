-- CreateEnum
CREATE TYPE "PayoutsStatus" AS ENUM ('not_started', 'pending', 'active', 'restricted');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "kompipayPaymentId" TEXT,
ADD COLUMN     "stripeCheckoutSessionId" TEXT,
ADD COLUMN     "stripePaymentIntentId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kompipayAccountId" TEXT,
ADD COLUMN     "payoutsEnabledAt" TIMESTAMP(3),
ADD COLUMN     "payoutsStatus" "PayoutsStatus" NOT NULL DEFAULT 'not_started',
ADD COLUMN     "stripeConnectedAccountId" TEXT;

-- CreateIndex
CREATE INDEX "Order_kompipayPaymentId_idx" ON "Order"("kompipayPaymentId");

-- CreateIndex
CREATE INDEX "Order_stripePaymentIntentId_idx" ON "Order"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "User_payoutsStatus_idx" ON "User"("payoutsStatus");

-- CreateIndex
CREATE INDEX "User_kompipayAccountId_idx" ON "User"("kompipayAccountId");
