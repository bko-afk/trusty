import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "companies_ranking_category_positions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"insurance_type_id" integer NOT NULL,
  	"position" numeric NOT NULL
  );
  
  CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"homepage_show_services" boolean DEFAULT true,
  	"homepage_show_complaint_c_t_a" boolean DEFAULT true,
  	"homepage_show_company_ranking" boolean DEFAULT true,
  	"homepage_show_latest_reviews" boolean DEFAULT true,
  	"homepage_show_methodology" boolean DEFAULT true,
  	"homepage_show_new_companies" boolean DEFAULT true,
  	"homepage_ranking_limit" numeric DEFAULT 12,
  	"homepage_latest_reviews_limit" numeric DEFAULT 6,
  	"homepage_new_companies_limit" numeric DEFAULT 9,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"companies_id" integer
  );
  
  ALTER TABLE "companies" ADD COLUMN "ranking_global_position" numeric;
  ALTER TABLE "reviews" ADD COLUMN "include_in_rating" boolean DEFAULT true;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_ranking_category_positions" ADD CONSTRAINT "companies_ranking_category_positions_insurance_type_id_insurance_types_id_fk" FOREIGN KEY ("insurance_type_id") REFERENCES "public"."insurance_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "companies_ranking_category_positions" ADD CONSTRAINT "companies_ranking_category_positions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "companies_ranking_category_positions_order_idx" ON "companies_ranking_category_positions" USING btree ("_order");
  CREATE INDEX "companies_ranking_category_positions_parent_id_idx" ON "companies_ranking_category_positions" USING btree ("_parent_id");
  CREATE INDEX "companies_ranking_category_positions_insurance_type_idx" ON "companies_ranking_category_positions" USING btree ("insurance_type_id");
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_companies_id_idx" ON "site_settings_rels" USING btree ("companies_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "companies_ranking_category_positions" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  ALTER TABLE "companies" DROP COLUMN "ranking_global_position";
  ALTER TABLE "reviews" DROP COLUMN "include_in_rating";`)
}
