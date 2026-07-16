// Логотипы компаний хранятся не в Payload Media (которое требует S3 на
// Vercel), а как обычные статические файлы в public/images/companies/ —
// это бесплатно и не зависит от сторонних сервисов. В админке поле
// `logoFile` хранит только имя файла (например "auras.svg").
export function companyLogoUrl(logoFile?: string | null): string | undefined {
  return logoFile ? `/images/companies/${logoFile}` : undefined
}
