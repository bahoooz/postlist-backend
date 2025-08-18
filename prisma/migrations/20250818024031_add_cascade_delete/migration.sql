-- DropForeignKey
ALTER TABLE "public"."PostIt" DROP CONSTRAINT "PostIt_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."PostIt" ADD CONSTRAINT "PostIt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
