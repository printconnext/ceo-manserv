-- DropIndex
DROP INDEX "Organization_slug_key";

-- CreateIndex
CREATE INDEX "Organization_slug_idx" ON "Organization"("slug");
