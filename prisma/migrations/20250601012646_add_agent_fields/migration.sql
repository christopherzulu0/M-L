-- AlterTable
ALTER TABLE "agents" ADD COLUMN     "address" VARCHAR(255),
ADD COLUMN     "languages" JSONB DEFAULT '[]',
ADD COLUMN     "service_areas" JSONB DEFAULT '[]',
ADD COLUMN     "social_media_links" JSONB DEFAULT '{}';
