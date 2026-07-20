import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // noinspection SqlNoDataSourceInspection
  await db.execute(sql`
   ALTER TYPE "public"."enum_review_replies_author_type" ADD VALUE 'customer';
  ALTER TYPE "public"."enum_review_replies_status" ADD VALUE 'pending' BEFORE 'published';
  ALTER TYPE "public"."enum_review_replies_status" ADD VALUE 'rejected';
  ALTER TABLE "site_settings_locales" ALTER COLUMN "seo_default_title" DROP DEFAULT;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "seo_default_description" DROP DEFAULT;
  ALTER TABLE "companies" ADD COLUMN "criteria_averages_coverage" numeric DEFAULT 0;
  ALTER TABLE "companies" ADD COLUMN "criteria_averages_price" numeric DEFAULT 0;
  ALTER TABLE "companies" ADD COLUMN "criteria_averages_claims_service" numeric DEFAULT 0;
  ALTER TABLE "companies" ADD COLUMN "criteria_averages_support" numeric DEFAULT 0;
  UPDATE "reviews" SET "include_in_rating" = ("status" = 'published');
  UPDATE "companies" AS company
  SET
    "overall_rating" = COALESCE((
      SELECT ROUND(AVG(review."rating"), 1)
      FROM "reviews" AS review
      WHERE review."company_id" = company."id" AND review."status" = 'published'
    ), 0),
    "review_count" = (
      SELECT COUNT(*)
      FROM "reviews" AS review
      WHERE review."company_id" = company."id" AND review."status" = 'published'
    ),
    "positive_review_count" = (
      SELECT COUNT(*)
      FROM "reviews" AS review
      WHERE review."company_id" = company."id" AND review."status" = 'published' AND review."rating" >= 4
    ),
    "negative_review_count" = (
      SELECT COUNT(*)
      FROM "reviews" AS review
      WHERE review."company_id" = company."id" AND review."status" = 'published' AND review."rating" <= 2
    ),
    "complaint_count" = (
      SELECT COUNT(*)
      FROM "complaints" AS complaint
      WHERE complaint."company_id" = company."id" AND complaint."status" = 'published'
    ),
    "resolved_complaint_count" = (
      SELECT COUNT(*)
      FROM "complaints" AS complaint
      WHERE complaint."company_id" = company."id"
        AND complaint."status" = 'published'
        AND (complaint."resolved" = true OR complaint."workflow_status" = 'resolved')
    ),
    "criteria_averages_coverage" = COALESCE((
      SELECT ROUND(AVG(review."criteria_coverage"), 1)
      FROM "reviews" AS review
      WHERE review."company_id" = company."id" AND review."status" = 'published'
    ), 0),
    "criteria_averages_price" = COALESCE((
      SELECT ROUND(AVG(review."criteria_price"), 1)
      FROM "reviews" AS review
      WHERE review."company_id" = company."id" AND review."status" = 'published'
    ), 0),
    "criteria_averages_claims_service" = COALESCE((
      SELECT ROUND(AVG(review."criteria_claims_service"), 1)
      FROM "reviews" AS review
      WHERE review."company_id" = company."id" AND review."status" = 'published'
    ), 0),
    "criteria_averages_support" = COALESCE((
      SELECT ROUND(AVG(review."criteria_support"), 1)
      FROM "reviews" AS review
      WHERE review."company_id" = company."id" AND review."status" = 'published'
    ), 0);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // noinspection SqlNoDataSourceInspection
  await db.execute(sql`
   UPDATE "review_replies" SET "author_type" = 'admin' WHERE "author_type" = 'customer';
  UPDATE "review_replies" SET "status" = 'hidden' WHERE "status" IN ('pending', 'rejected');
   ALTER TABLE "review_replies" ALTER COLUMN "author_type" SET DATA TYPE text;
  ALTER TABLE "review_replies" ALTER COLUMN "author_type" SET DEFAULT 'admin'::text;
  DROP TYPE "public"."enum_review_replies_author_type";
  CREATE TYPE "public"."enum_review_replies_author_type" AS ENUM('admin', 'company');
  ALTER TABLE "review_replies" ALTER COLUMN "author_type" SET DEFAULT 'admin'::"public"."enum_review_replies_author_type";
  ALTER TABLE "review_replies" ALTER COLUMN "author_type" SET DATA TYPE "public"."enum_review_replies_author_type" USING "author_type"::"public"."enum_review_replies_author_type";
  ALTER TABLE "review_replies" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "review_replies" ALTER COLUMN "status" SET DEFAULT 'published'::text;
  DROP TYPE "public"."enum_review_replies_status";
  CREATE TYPE "public"."enum_review_replies_status" AS ENUM('published', 'hidden');
  ALTER TABLE "review_replies" ALTER COLUMN "status" SET DEFAULT 'published'::"public"."enum_review_replies_status";
  ALTER TABLE "review_replies" ALTER COLUMN "status" SET DATA TYPE "public"."enum_review_replies_status" USING "status"::"public"."enum_review_replies_status";
  ALTER TABLE "site_settings_locales" ALTER COLUMN "seo_default_title" SET DEFAULT null;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "seo_default_description" SET DEFAULT null;
  ALTER TABLE "companies" DROP COLUMN "criteria_averages_coverage";
  ALTER TABLE "companies" DROP COLUMN "criteria_averages_price";
  ALTER TABLE "companies" DROP COLUMN "criteria_averages_claims_service";
  ALTER TABLE "companies" DROP COLUMN "criteria_averages_support";`)
}
