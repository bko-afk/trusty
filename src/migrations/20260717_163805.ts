import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "seo_site_name" varchar DEFAULT 'Trusty';
  ALTER TABLE "site_settings" ADD COLUMN "seo_default_title" varchar DEFAULT 'Trusty — отзывы и рейтинги туристических страховых компаний';
  ALTER TABLE "site_settings" ADD COLUMN "seo_default_description" varchar DEFAULT 'Каталог туристических страховых компаний, рейтинги, реальные отзывы клиентов и статьи о страховании путешественников.';
  ALTER TABLE "site_settings" ADD COLUMN "seo_social_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "seo_google_verification" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "seo_yandex_verification" varchar;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_seo_seo_social_image_idx" ON "site_settings" USING btree ("seo_social_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_seo_social_image_id_media_id_fk";
  
  DROP INDEX "site_settings_seo_seo_social_image_idx";
  ALTER TABLE "site_settings" DROP COLUMN "seo_site_name";
  ALTER TABLE "site_settings" DROP COLUMN "seo_default_title";
  ALTER TABLE "site_settings" DROP COLUMN "seo_default_description";
  ALTER TABLE "site_settings" DROP COLUMN "seo_social_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "seo_google_verification";
  ALTER TABLE "site_settings" DROP COLUMN "seo_yandex_verification";`)
}
