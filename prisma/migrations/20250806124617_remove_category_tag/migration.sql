/*
  Warnings:

  - You are about to drop the `ArticleTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Article" DROP CONSTRAINT "Article_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArticleTag" DROP CONSTRAINT "ArticleTag_articleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArticleTag" DROP CONSTRAINT "ArticleTag_tagId_fkey";

-- DropTable
DROP TABLE "public"."ArticleTag";

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."Tag";
