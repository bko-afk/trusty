const articleCovers: Record<string, string> = {
  'kak-vybrat-turisticheskuyu-strahovku': '/images/articles/kak-vybrat-turisticheskuyu-strahovku.webp',
  'strahovoy-sluchay-za-granitsey': '/images/articles/strahovoy-sluchay-za-granitsey.webp',
  'oshibki-pri-pokupke-strahovki': '/images/articles/oshibki-pri-pokupke-strahovki.webp',
  'medicinskaya-evakuaciya-za-granicey': '/images/articles/medicinskaya-evakuaciya-za-granicey.webp',
  'ehic-ghic-i-turisticheskaya-strahovka': '/images/articles/ehic-ghic-i-turisticheskaya-strahovka.webp',
  'strahovka-dlya-aktivnogo-otdyha': '/images/articles/strahovka-dlya-aktivnogo-otdyha.webp',
  'otmena-poezdki-i-cancel-for-any-reason': '/images/articles/otmena-poezdki-i-cancel-for-any-reason.webp',
  'dokumenty-dlya-strahovoy-vyplaty': '/images/articles/dokumenty-dlya-strahovoy-vyplaty.webp',
}

export function articleCoverUrl(slug: string) {
  return articleCovers[slug]
}
