-- CreateTable
CREATE TABLE "BlockMedia" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlockMedia_blockId_idx" ON "BlockMedia"("blockId");

-- CreateIndex
CREATE INDEX "BlockMedia_sort_idx" ON "BlockMedia"("sort");

-- AddForeignKey
ALTER TABLE "BlockMedia" ADD CONSTRAINT "BlockMedia_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;
