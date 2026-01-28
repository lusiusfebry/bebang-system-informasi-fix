/*
  Warnings:

  - A unique constraint covering the columns `[namaDivisi]` on the table `divisi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "divisi_namaDivisi_key" ON "divisi"("namaDivisi");
