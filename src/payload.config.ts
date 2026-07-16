import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { InsuranceTypes } from './collections/InsuranceTypes'
import { Companies } from './collections/Companies'
import { Reviews } from './collections/Reviews'
import { ReviewReplies } from './collections/ReviewReplies'
import { Articles } from './collections/Articles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// На Vercel (и вообще на любом serverless-хостинге) файловая система
// доступна только на чтение — загруженные логотипы/картинки нельзя
// сохранять на диск, они пропадут. Поэтому если заданы переменные
// S3_* (например, бесплатный бакет Cloudflare R2), подключаем
// S3-совместимое хранилище. Если их нет — Payload использует
// локальный диск (public/media), это подходит только для запуска
// на своей машине или на VPS.
const hasS3Config = Boolean(
  process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Админка «Страхование.Отзывы»',
    },
  },
  editor: lexicalEditor({}),
  collections: [Users, Media, InsuranceTypes, Companies, Reviews, ReviewReplies, Articles],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  sharp,
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(Boolean),
  plugins: hasS3Config
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET as string,
          config: {
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
            },
            region: process.env.S3_REGION || 'auto',
            endpoint: process.env.S3_ENDPOINT,
            forcePathStyle: true,
          },
        }),
      ]
    : [],
})
