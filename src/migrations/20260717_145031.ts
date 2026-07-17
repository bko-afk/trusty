import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_companies_insurance_profile_mobile_apps" AS ENUM('none', 'ios', 'android', 'both');
  CREATE TYPE "public"."enum_reviews_experience_type" AS ENUM('purchase', 'claim');
  CREATE TYPE "public"."enum_reviews_trip_country" AS ENUM('RU', 'UA', 'BY', 'KZ', 'UZ', 'AM', 'GE', 'AZ', 'US', 'GB', 'DE', 'FR', 'ES', 'IT', 'PT', 'NL', 'PL', 'CZ', 'TR', 'AE', 'EG', 'TH', 'VN', 'ID', 'IN', 'CN', 'JP', 'KR', 'CA', 'MX', 'BR', 'AR', 'AU', 'GR', 'CY', 'RS', 'MC', 'CH', 'AT', 'MV', 'LK');
  CREATE TYPE "public"."enum_reviews_claim_outcome" AS ENUM('not_applicable', 'paid', 'partially_paid', 'denied', 'pending');
  CREATE TYPE "public"."enum_reviews_response_time" AS ENUM('same_day', '1_3_days', '4_7_days', '8_30_days', 'more_30_days', 'no_response');
  CREATE TYPE "public"."enum_complaints_workflow_status" AS ENUM('submitted', 'company_replied', 'resolved', 'unresolved');
  CREATE TABLE IF NOT EXISTS "customers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"companies_id" integer
  );
  
  ALTER TABLE "companies" ADD COLUMN "verification_legal_name" varchar;
  ALTER TABLE "companies" ADD COLUMN "verification_regulator" varchar;
  ALTER TABLE "companies" ADD COLUMN "verification_license_number" varchar;
  ALTER TABLE "companies" ADD COLUMN "verification_license_url" varchar;
  ALTER TABLE "companies" ADD COLUMN "verification_verified_at" timestamp(3) with time zone;
  ALTER TABLE "companies" ADD COLUMN "data_updated_at" timestamp(3) with time zone;
  ALTER TABLE "companies" ADD COLUMN "unique_feature" varchar;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_coverage_limit" varchar;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_deductible" varchar;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_assistance24h" boolean DEFAULT false;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_direct_billing" boolean DEFAULT false;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_online_purchase" boolean DEFAULT false;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_mobile_apps" "enum_companies_insurance_profile_mobile_apps" DEFAULT 'none';
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_supported_languages" varchar;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_claim_channels" varchar;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_coverage_features_covid" boolean DEFAULT false;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_coverage_features_sports" boolean DEFAULT false;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_coverage_features_baggage" boolean DEFAULT false;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_coverage_features_trip_cancellation" boolean DEFAULT false;
  ALTER TABLE "companies" ADD COLUMN "positive_review_count" numeric DEFAULT 0;
  ALTER TABLE "companies" ADD COLUMN "negative_review_count" numeric DEFAULT 0;
  ALTER TABLE "companies" ADD COLUMN "complaint_count" numeric DEFAULT 0;
  ALTER TABLE "companies" ADD COLUMN "resolved_complaint_count" numeric DEFAULT 0;
  ALTER TABLE "reviews" ADD COLUMN "experience_type" "enum_reviews_experience_type" DEFAULT 'purchase' NOT NULL;
  ALTER TABLE "reviews" ADD COLUMN "policy_type_id" integer;
  ALTER TABLE "reviews" ADD COLUMN "trip_country" "enum_reviews_trip_country";
  ALTER TABLE "reviews" ADD COLUMN "claim_outcome" "enum_reviews_claim_outcome" DEFAULT 'not_applicable';
  ALTER TABLE "reviews" ADD COLUMN "claim_amount" varchar;
  ALTER TABLE "reviews" ADD COLUMN "response_time" "enum_reviews_response_time";
  ALTER TABLE "reviews" ADD COLUMN "verified_experience" boolean DEFAULT false;
  ALTER TABLE "complaints" ADD COLUMN "workflow_status" "enum_complaints_workflow_status" DEFAULT 'submitted' NOT NULL;
  ALTER TABLE "complaints" ADD COLUMN "company_response_author_name" varchar;
  ALTER TABLE "complaints" ADD COLUMN "company_response_body" varchar;
  ALTER TABLE "complaints" ADD COLUMN "company_response_responded_at" timestamp(3) with time zone;
  UPDATE "companies" SET "data_updated_at" = "updated_at" WHERE "data_updated_at" IS NULL;
  UPDATE "companies" SET
    "positive_review_count" = (SELECT COUNT(*) FROM "reviews" WHERE "reviews"."company_id" = "companies"."id" AND "reviews"."status" = 'published' AND "reviews"."rating" >= 4),
    "negative_review_count" = (SELECT COUNT(*) FROM "reviews" WHERE "reviews"."company_id" = "companies"."id" AND "reviews"."status" = 'published' AND "reviews"."rating" <= 2),
    "complaint_count" = (SELECT COUNT(*) FROM "complaints" WHERE "complaints"."company_id" = "companies"."id" AND "complaints"."status" = 'published'),
    "resolved_complaint_count" = (SELECT COUNT(*) FROM "complaints" WHERE "complaints"."company_id" = "companies"."id" AND "complaints"."status" = 'published' AND "complaints"."resolved" = true);
  DO $$ BEGIN
   ALTER TABLE "customers_rels" ADD CONSTRAINT "customers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "customers_rels" ADD CONSTRAINT "customers_rels_companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "customers_rels_order_idx" ON "customers_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "customers_rels_parent_idx" ON "customers_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "customers_rels_path_idx" ON "customers_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "customers_rels_companies_id_idx" ON "customers_rels" USING btree ("companies_id");
  DO $$ BEGIN
   ALTER TABLE "reviews" ADD CONSTRAINT "reviews_policy_type_id_insurance_types_id_fk" FOREIGN KEY ("policy_type_id") REFERENCES "public"."insurance_types"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "reviews_policy_type_idx" ON "reviews" USING btree ("policy_type_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "customers_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "customers_rels" CASCADE;
  ALTER TABLE "reviews" DROP CONSTRAINT "reviews_policy_type_id_insurance_types_id_fk";
  
  DROP INDEX IF EXISTS "reviews_policy_type_idx";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "verification_legal_name";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "verification_regulator";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "verification_license_number";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "verification_license_url";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "verification_verified_at";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "data_updated_at";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "unique_feature";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_coverage_limit";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_deductible";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_assistance24h";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_direct_billing";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_online_purchase";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_mobile_apps";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_supported_languages";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_claim_channels";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_coverage_features_covid";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_coverage_features_sports";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_coverage_features_baggage";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "insurance_profile_coverage_features_trip_cancellation";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "positive_review_count";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "negative_review_count";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "complaint_count";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "resolved_complaint_count";
  ALTER TABLE "reviews" DROP COLUMN IF EXISTS "experience_type";
  ALTER TABLE "reviews" DROP COLUMN IF EXISTS "policy_type_id";
  ALTER TABLE "reviews" DROP COLUMN IF EXISTS "trip_country";
  ALTER TABLE "reviews" DROP COLUMN IF EXISTS "claim_outcome";
  ALTER TABLE "reviews" DROP COLUMN IF EXISTS "claim_amount";
  ALTER TABLE "reviews" DROP COLUMN IF EXISTS "response_time";
  ALTER TABLE "reviews" DROP COLUMN IF EXISTS "verified_experience";
  ALTER TABLE "complaints" DROP COLUMN IF EXISTS "workflow_status";
  ALTER TABLE "complaints" DROP COLUMN IF EXISTS "company_response_author_name";
  ALTER TABLE "complaints" DROP COLUMN IF EXISTS "company_response_body";
  ALTER TABLE "complaints" DROP COLUMN IF EXISTS "company_response_responded_at";
  DROP TYPE "public"."enum_companies_insurance_profile_mobile_apps";
  DROP TYPE "public"."enum_reviews_experience_type";
  DROP TYPE "public"."enum_reviews_trip_country";
  DROP TYPE "public"."enum_reviews_claim_outcome";
  DROP TYPE "public"."enum_reviews_response_time";
  DROP TYPE "public"."enum_complaints_workflow_status";`)
}
