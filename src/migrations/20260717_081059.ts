import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_complaints_status" AS ENUM('pending', 'published', 'rejected', 'spam');
  CREATE TABLE IF NOT EXISTS "complaints" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_id" integer NOT NULL,
  	"customer_id" integer,
  	"author_name" varchar NOT NULL,
  	"author_email" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"status" "enum_complaints_status" DEFAULT 'pending' NOT NULL,
  	"resolved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "companies" ADD COLUMN "popular" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "complaints_id" integer;
  DO $$ BEGIN
   ALTER TABLE "complaints" ADD CONSTRAINT "complaints_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "complaints" ADD CONSTRAINT "complaints_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "complaints_company_idx" ON "complaints" USING btree ("company_id");
  CREATE INDEX IF NOT EXISTS "complaints_customer_idx" ON "complaints" USING btree ("customer_id");
  CREATE INDEX IF NOT EXISTS "complaints_updated_at_idx" ON "complaints" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "complaints_created_at_idx" ON "complaints" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_complaints_fk" FOREIGN KEY ("complaints_id") REFERENCES "public"."complaints"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_complaints_id_idx" ON "payload_locked_documents_rels" USING btree ("complaints_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "complaints" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "complaints" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_complaints_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_complaints_id_idx";
  ALTER TABLE "companies" DROP COLUMN IF EXISTS "popular";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "complaints_id";
  DROP TYPE "public"."enum_complaints_status";`)
}
