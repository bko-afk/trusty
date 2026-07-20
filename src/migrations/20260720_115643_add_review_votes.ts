import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // noinspection SqlNoDataSourceInspection
  await db.execute(sql`
   CREATE TYPE "public"."enum_review_votes_direction" AS ENUM('up', 'down');
  CREATE TABLE "review_votes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"review_id" integer NOT NULL,
  	"voter_key" varchar NOT NULL,
  	"direction" "enum_review_votes_direction" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "review_votes_id" integer;
  ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "review_votes_review_idx" ON "review_votes" USING btree ("review_id");
  CREATE UNIQUE INDEX "review_votes_voter_key_idx" ON "review_votes" USING btree ("voter_key");
  CREATE INDEX "review_votes_updated_at_idx" ON "review_votes" USING btree ("updated_at");
  CREATE INDEX "review_votes_created_at_idx" ON "review_votes" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_review_votes_fk" FOREIGN KEY ("review_votes_id") REFERENCES "public"."review_votes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_review_votes_id_idx" ON "payload_locked_documents_rels" USING btree ("review_votes_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // noinspection SqlNoDataSourceInspection
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_review_votes_fk";
  DROP INDEX "payload_locked_documents_rels_review_votes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "review_votes_id";
  DROP TABLE "review_votes";
  DROP TYPE "public"."enum_review_votes_direction";`)
}
