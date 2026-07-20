import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Keep the currently deployed pre-localization build operational while the new
// build is rolling out. These columns are ignored by the localized schema and
// can be removed in a later migration after every environment is updated.
export async function up({ db }: MigrateUpArgs): Promise<void> {
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
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // noinspection SqlNoDataSourceInspection
  await db.execute(sql`
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
    ALTER TABLE "site_settings" DROP COLUMN "seo_default_description";
  `)
}
