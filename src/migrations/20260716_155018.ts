import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_companies_country" AS ENUM('RU', 'UA', 'BY', 'KZ', 'UZ', 'AM', 'GE', 'AZ', 'US', 'GB', 'DE', 'FR', 'ES', 'IT', 'PT', 'NL', 'PL', 'CZ', 'TR', 'AE', 'EG', 'TH', 'VN', 'ID', 'IN', 'CN', 'JP', 'KR', 'CA', 'MX', 'BR', 'AR', 'AU', 'GR', 'CY', 'RS', 'MC', 'CH', 'AT', 'MV', 'LK');
  CREATE TABLE IF NOT EXISTS "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  ALTER TABLE "companies" ADD COLUMN "country" "enum_companies_country";
  ALTER TABLE "reviews" ADD COLUMN "customer_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "customers_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "customers_id" integer;
  CREATE INDEX IF NOT EXISTS "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "customers_email_idx" ON "customers" USING btree ("email");
  DO $$ BEGIN
   ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "reviews_customer_idx" ON "reviews" USING btree ("customer_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "customers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "customers" CASCADE;
  ALTER TABLE "reviews" DROP CONSTRAINT "reviews_customer_id_customers_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_customers_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_customers_fk";
  
  DROP INDEX IF EXISTS "reviews_customer_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_customers_id_idx";
  DROP INDEX IF EXISTS "payload_preferences_rels_customers_id_idx";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "country";
  ALTER TABLE "reviews" DROP COLUMN IF EXISTS "customer_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "customers_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "customers_id";
  DROP TYPE "public"."enum_companies_country";`)
}
