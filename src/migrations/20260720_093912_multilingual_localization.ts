import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // noinspection SqlNoDataSourceInspection
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ru', 'en', 'es');
  CREATE TABLE "insurance_types_locales" (
  	"title" varchar NOT NULL,
  	"short_description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "companies_locales" (
  	"unique_feature" varchar,
  	"insurance_profile_supported_languages" varchar,
  	"insurance_profile_claim_channels" varchar,
  	"short_description" varchar,
  	"description" jsonb,
  	"contacts_address" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_locales" (
	  "seo_default_title" varchar,
	  "seo_default_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "companies_pros" ADD COLUMN "_locale" "_locales" DEFAULT 'ru' NOT NULL;
  ALTER TABLE "companies_cons" ADD COLUMN "_locale" "_locales" DEFAULT 'ru' NOT NULL;
  ALTER TABLE "insurance_types_locales" ADD CONSTRAINT "insurance_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insurance_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_locales" ADD CONSTRAINT "companies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "insurance_types_locales_locale_parent_id_unique" ON "insurance_types_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "companies_locales_locale_parent_id_unique" ON "companies_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "companies_pros_locale_idx" ON "companies_pros" USING btree ("_locale");
  CREATE INDEX "companies_cons_locale_idx" ON "companies_cons" USING btree ("_locale");
  INSERT INTO "insurance_types_locales" (
    "title", "short_description", "seo_title", "seo_description", "_locale", "_parent_id"
  )
  SELECT "title", "short_description", "seo_title", "seo_description", 'ru', "id"
  FROM "insurance_types";
  INSERT INTO "companies_locales" (
    "unique_feature", "insurance_profile_supported_languages", "insurance_profile_claim_channels",
    "short_description", "description", "contacts_address", "seo_title", "seo_description",
    "_locale", "_parent_id"
  )
  SELECT
    "unique_feature", "insurance_profile_supported_languages", "insurance_profile_claim_channels",
    "short_description", "description", "contacts_address", "seo_title", "seo_description",
    'ru', "id"
  FROM "companies";
  INSERT INTO "articles_locales" (
    "title", "excerpt", "body", "seo_title", "seo_description", "_locale", "_parent_id"
  )
  SELECT "title", "excerpt", "body", "seo_title", "seo_description", 'ru', "id"
  FROM "articles";
  INSERT INTO "site_settings_locales" (
    "seo_default_title", "seo_default_description", "_locale", "_parent_id"
  )
  SELECT "seo_default_title", "seo_default_description", 'ru', "id"
  FROM "site_settings";
  ALTER TABLE "companies_pros" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "companies_cons" ALTER COLUMN "_locale" DROP DEFAULT;
  ALTER TABLE "insurance_types" DROP COLUMN "title";
  ALTER TABLE "insurance_types" DROP COLUMN "short_description";
  ALTER TABLE "insurance_types" DROP COLUMN "seo_title";
  ALTER TABLE "insurance_types" DROP COLUMN "seo_description";
  ALTER TABLE "companies" DROP COLUMN "unique_feature";
  ALTER TABLE "companies" DROP COLUMN "insurance_profile_supported_languages";
  ALTER TABLE "companies" DROP COLUMN "insurance_profile_claim_channels";
  ALTER TABLE "companies" DROP COLUMN "short_description";
  ALTER TABLE "companies" DROP COLUMN "description";
  ALTER TABLE "companies" DROP COLUMN "contacts_address";
  ALTER TABLE "companies" DROP COLUMN "seo_title";
  ALTER TABLE "companies" DROP COLUMN "seo_description";
  ALTER TABLE "articles" DROP COLUMN "title";
  ALTER TABLE "articles" DROP COLUMN "excerpt";
  ALTER TABLE "articles" DROP COLUMN "body";
  ALTER TABLE "articles" DROP COLUMN "seo_title";
  ALTER TABLE "articles" DROP COLUMN "seo_description";
  ALTER TABLE "site_settings" DROP COLUMN "seo_default_title";
  ALTER TABLE "site_settings" DROP COLUMN "seo_default_description";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // noinspection SqlNoDataSourceInspection
  await db.execute(sql`
   ALTER TABLE "insurance_types" ADD COLUMN "title" varchar;
  ALTER TABLE "insurance_types" ADD COLUMN "short_description" varchar;
  ALTER TABLE "insurance_types" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "insurance_types" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "companies" ADD COLUMN "unique_feature" varchar;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_supported_languages" varchar;
  ALTER TABLE "companies" ADD COLUMN "insurance_profile_claim_channels" varchar;
  ALTER TABLE "companies" ADD COLUMN "short_description" varchar;
  ALTER TABLE "companies" ADD COLUMN "description" jsonb;
  ALTER TABLE "companies" ADD COLUMN "contacts_address" varchar;
  ALTER TABLE "companies" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "companies" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "articles" ADD COLUMN "title" varchar;
  ALTER TABLE "articles" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "articles" ADD COLUMN "body" jsonb;
  ALTER TABLE "articles" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "articles" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "seo_default_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "seo_default_description" varchar;
  UPDATE "insurance_types" AS base
  SET
    "title" = localized."title",
    "short_description" = localized."short_description",
    "seo_title" = localized."seo_title",
    "seo_description" = localized."seo_description"
  FROM "insurance_types_locales" AS localized
  WHERE localized."_parent_id" = base."id" AND localized."_locale" = 'ru';
  UPDATE "companies" AS base
  SET
    "unique_feature" = localized."unique_feature",
    "insurance_profile_supported_languages" = localized."insurance_profile_supported_languages",
    "insurance_profile_claim_channels" = localized."insurance_profile_claim_channels",
    "short_description" = localized."short_description",
    "description" = localized."description",
    "contacts_address" = localized."contacts_address",
    "seo_title" = localized."seo_title",
    "seo_description" = localized."seo_description"
  FROM "companies_locales" AS localized
  WHERE localized."_parent_id" = base."id" AND localized."_locale" = 'ru';
  UPDATE "articles" AS base
  SET
    "title" = localized."title",
    "excerpt" = localized."excerpt",
    "body" = localized."body",
    "seo_title" = localized."seo_title",
    "seo_description" = localized."seo_description"
  FROM "articles_locales" AS localized
  WHERE localized."_parent_id" = base."id" AND localized."_locale" = 'ru';
  UPDATE "site_settings" AS base
  SET
    "seo_default_title" = localized."seo_default_title",
    "seo_default_description" = localized."seo_default_description"
  FROM "site_settings_locales" AS localized
  WHERE localized."_parent_id" = base."id" AND localized."_locale" = 'ru';
  ALTER TABLE "insurance_types" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "insurance_types_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "companies_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "insurance_types_locales" CASCADE;
  DROP TABLE "companies_locales" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP INDEX "companies_pros_locale_idx";
  DROP INDEX "companies_cons_locale_idx";
  ALTER TABLE "companies_pros" DROP COLUMN "_locale";
  ALTER TABLE "companies_cons" DROP COLUMN "_locale";
  DROP TYPE "public"."_locales";`)
}
