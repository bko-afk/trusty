import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

type Translation = {
  title: string
  excerpt: string
  seoTitle: string
  seoDescription: string
  paragraphs: string[]
}

function richText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', text, version: 1 }],
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

const insuranceTypes = {
  medical: {
    en: ['Medical insurance', 'Emergency medical care and treatment coverage while abroad.'],
    es: ['Seguro médico', 'Cobertura de atención y tratamiento médico de urgencia en el extranjero.'],
  },
  travel: {
    en: ['Travel insurance', 'Travel protection that may include medical care, cancellation, baggage, and assistance.'],
    es: ['Seguro de viaje', 'Protección que puede incluir asistencia médica, cancelación, equipaje y ayuda durante el viaje.'],
  },
} as const

const companyDescriptions: Record<string, { en: string; es: string }> = {
  'auras-insurance': { en: 'International travel medical insurance service for travelers of different ages.', es: 'Servicio internacional de seguro médico de viaje para personas de distintas edades.' },
  ekta: { en: 'Online travel insurance provider with multilingual policy purchase and support.', es: 'Proveedor de seguros de viaje en línea con contratación y asistencia multilingüe.' },
  'world-nomads': { en: 'A widely known travel insurance brand focused on independent travelers.', es: 'Una conocida marca de seguros de viaje orientada a viajeros independientes.' },
  'allianz-travel': { en: 'Travel insurance from Allianz Partners, part of the international Allianz group.', es: 'Seguro de viaje de Allianz Partners, parte del grupo internacional Allianz.' },
  'seven-corners': { en: 'International travel and medical insurance provider with round-the-clock traveler assistance.', es: 'Proveedor internacional de seguros médicos y de viaje con asistencia las 24 horas.' },
  heymondo: { en: 'Spanish digital travel insurance service with online policies and mobile assistance.', es: 'Servicio digital español de seguros de viaje con pólizas en línea y asistencia móvil.' },
  safetywing: { en: 'International insurance products for digital nomads, remote workers, and long trips.', es: 'Productos de seguro internacionales para nómadas digitales, trabajadores remotos y viajes largos.' },
  'generali-global-assistance': { en: 'Travel insurance and emergency traveler assistance from the international Generali group.', es: 'Seguro de viaje y asistencia de emergencia del grupo internacional Generali.' },
  'axa-partners': { en: 'AXA travel insurance, medical assistance, and global assistance solutions.', es: 'Soluciones globales de AXA para seguros de viaje, asistencia médica y servicios de ayuda.' },
  'zurich-travel-insurance': { en: 'Travel insurance products and international assistance from Zurich Insurance Group.', es: 'Productos de seguro de viaje y asistencia internacional de Zurich Insurance Group.' },
  'bcbs-global-solutions': { en: 'International medical coverage for travel and extended stays abroad, formerly associated with GeoBlue.', es: 'Cobertura médica internacional para viajes y estancias prolongadas, anteriormente asociada con GeoBlue.' },
}

const articles: Record<string, { en: Translation; es: Translation }> = {
  'kak-vybrat-turisticheskuyu-strahovku': {
    en: {
      title: 'How to choose travel insurance: what to compare',
      excerpt: 'A practical guide to coverage limits, deductibles, exclusions, assistance, and claim payments.',
      seoTitle: 'How to choose travel insurance',
      seoDescription: 'Compare travel insurance by medical limits, deductibles, exclusions, direct billing, assistance, and real claim reviews.',
      paragraphs: [
        'Travel insurance is financial protection, not just a visa formality. Start with a medical limit appropriate for the destination, trip length, planned activities, and the local cost of treatment. Remote regions and adventure travel may require higher limits and separate rescue coverage.',
        'Read the deductible and exclusions before paying. Chronic conditions, alcohol, pregnancy, scooters, skiing, diving, and other activities can be restricted or excluded. A low premium is not useful when the event you are most likely to face is outside the policy.',
        'Check how assistance and claims work. Direct billing means the insurer or assistance company pays an approved clinic; reimbursement means you may need to pay first and submit documents later. Compare real claim experiences, response times, required documents, and appeal procedures as carefully as the price.',
      ],
    },
    es: {
      title: 'Cómo elegir un seguro de viaje: qué comparar',
      excerpt: 'Guía práctica sobre límites, franquicias, exclusiones, asistencia y pagos de siniestros.',
      seoTitle: 'Cómo elegir un seguro de viaje',
      seoDescription: 'Compara límites médicos, franquicias, exclusiones, pago directo, asistencia y reseñas reales de siniestros.',
      paragraphs: [
        'El seguro de viaje es una protección financiera, no un simple requisito para el visado. Elige un límite médico adecuado al destino, la duración, las actividades previstas y el coste local de la atención. Las zonas remotas y los deportes pueden exigir límites más altos y rescate adicional.',
        'Lee la franquicia y las exclusiones antes de pagar. Las enfermedades crónicas, el alcohol, el embarazo, los ciclomotores, el esquí o el buceo pueden estar limitados. Una prima barata sirve de poco si el riesgo principal queda fuera del contrato.',
        'Comprueba cómo funcionan la asistencia y los reembolsos. Con pago directo la aseguradora paga a una clínica autorizada; con reembolso quizá debas adelantar el dinero. Compara experiencias reales, tiempos de respuesta, documentos exigidos y vías de reclamación, no solo el precio.',
      ],
    },
  },
  'strahovoy-sluchay-za-granitsey': {
    en: {
      title: 'An insurance emergency abroad: what to do first',
      excerpt: 'A step-by-step plan for medical treatment, theft, delays, and other insured events abroad.',
      seoTitle: 'What to do after an insured event abroad',
      seoDescription: 'Contact assistance, obtain approval, preserve evidence, and file a travel insurance claim correctly.',
      paragraphs: [
        'Contact the insurer or assistance line as soon as it is safe. Keep the policy number and international phone number offline. Unless the situation is life-threatening, ask where to go and whether treatment or transport needs prior approval.',
        'Preserve every piece of evidence: medical reports, invoices, prescriptions, payment receipts, airline reports, baggage tags, and police records. Photograph documents immediately and write down call times, operator names, case numbers, and instructions.',
        'Confirm whether the insurer pays the provider directly or reimburses you later, then submit the claim within the contractual deadline. If the company does not respond or rejects the claim, request a written decision that cites the exact policy clause and use the formal complaint process.',
      ],
    },
    es: {
      title: 'Un siniestro en el extranjero: qué hacer primero',
      excerpt: 'Plan paso a paso para atención médica, robos, retrasos y otros incidentes cubiertos.',
      seoTitle: 'Qué hacer tras un siniestro en el extranjero',
      seoDescription: 'Contacta con la asistencia, consigue autorización, guarda pruebas y presenta correctamente la reclamación.',
      paragraphs: [
        'Contacta con la aseguradora o la central de asistencia en cuanto sea seguro. Guarda sin conexión el número de póliza y el teléfono internacional. Salvo peligro vital, pregunta a qué centro acudir y si el tratamiento o transporte requiere autorización previa.',
        'Conserva todas las pruebas: informes médicos, facturas, recetas, justificantes de pago, partes de la aerolínea, etiquetas de equipaje y denuncias policiales. Fotografía los documentos y anota horas de llamadas, nombres, números de expediente e instrucciones.',
        'Confirma si la aseguradora paga directamente o reembolsa después y presenta la solicitud dentro del plazo. Si no responde o rechaza el caso, pide una decisión escrita con la cláusula exacta y utiliza el procedimiento formal de reclamación.',
      ],
    },
  },
  'oshibki-pri-pokupke-strahovki': {
    en: {
      title: '7 common travel insurance buying mistakes',
      excerpt: 'Avoid weak coverage, overlooked deductibles, date gaps, and exclusions for planned activities.',
      seoTitle: 'Common travel insurance mistakes',
      seoDescription: 'Seven common travel insurance mistakes and a checklist for avoiding them before departure.',
      paragraphs: [
        'Buying the minimum policy only for a visa, ignoring the deductible, and failing to read exclusions are the most common mistakes. The policy should match the destination, trip length, medical costs, and every activity you actually plan to do.',
        'Check that the insured dates include possible delays and buy time-sensitive options, such as trip cancellation, early enough. Declare relevant medical conditions and confirm in writing whether skiing, diving, scooters, trekking, and rented equipment are covered.',
        'Do not choose on price alone. Compare claim handling, direct billing, assistance availability, document requirements, and customer reviews about real insured events. A slightly more expensive policy can be far cheaper than an uncovered emergency.',
      ],
    },
    es: {
      title: '7 errores comunes al comprar un seguro de viaje',
      excerpt: 'Evita coberturas débiles, franquicias ignoradas, fechas incompletas y exclusiones de actividades.',
      seoTitle: 'Errores comunes del seguro de viaje',
      seoDescription: 'Siete errores frecuentes y una lista para evitarlos antes de viajar.',
      paragraphs: [
        'Comprar la póliza mínima solo para el visado, ignorar la franquicia y no leer las exclusiones son errores habituales. La cobertura debe corresponder al destino, la duración, el coste médico y las actividades previstas.',
        'Comprueba que las fechas incluyan posibles retrasos y contrata a tiempo opciones como la cancelación. Declara las condiciones médicas relevantes y confirma por escrito si están cubiertos el esquí, buceo, ciclomotores, senderismo y equipos alquilados.',
        'No elijas solo por precio. Compara la gestión de siniestros, el pago directo, la disponibilidad de asistencia, los documentos requeridos y las reseñas de casos reales. Una póliza algo más cara puede evitar un gasto enorme.',
      ],
    },
  },
  'medicinskaya-evakuaciya-za-granicey': {
    en: {
      title: 'Medical evacuation abroad: what to check',
      excerpt: 'Understand evacuation, repatriation, rescue limits, and authorization before traveling.',
      seoTitle: 'Medical evacuation coverage abroad',
      seoDescription: 'Check medical evacuation, repatriation, rescue, transport limits, exclusions, and assistance rules.',
      paragraphs: [
        'Medical treatment and medical evacuation are different benefits. Evacuation may be needed to move a patient from a remote area to an appropriate hospital, while repatriation may cover medically necessary transport home. The policy should state who decides the destination and medical necessity.',
        'Check separate limits for ambulances, air transport, escorts, search and rescue, and transport from mountains or islands. Trekking, skiing, and diving often require an activity extension and may have height, depth, route, or guide restrictions.',
        'Save the assistance number and seek approval whenever the situation allows. Review exclusions for known conditions, pregnancy, alcohol, travel warnings, and unlisted activities. Ask whether you must pay first and exactly which documents the insurer needs.',
      ],
    },
    es: {
      title: 'Evacuación médica en el extranjero: qué revisar',
      excerpt: 'Entiende la evacuación, repatriación, límites de rescate y autorizaciones antes de viajar.',
      seoTitle: 'Cobertura de evacuación médica',
      seoDescription: 'Revisa evacuación, repatriación, rescate, transporte, límites, exclusiones y reglas de asistencia.',
      paragraphs: [
        'El tratamiento médico y la evacuación son coberturas distintas. La evacuación puede trasladar al paciente desde una zona remota a un hospital adecuado, mientras la repatriación puede cubrir el regreso por necesidad médica. El contrato debe indicar quién decide el destino.',
        'Comprueba límites separados para ambulancias, avión sanitario, acompañamiento, búsqueda y rescate y transporte desde montañas o islas. Senderismo, esquí y buceo suelen requerir una ampliación y pueden tener restricciones de altura, profundidad o guía.',
        'Guarda el número de asistencia y pide autorización cuando la situación lo permita. Revisa exclusiones por enfermedades, embarazo, alcohol, alertas de viaje y actividades no declaradas, y pregunta si debes adelantar el pago.',
      ],
    },
  },
  'ehic-ghic-i-turisticheskaya-strahovka': {
    en: {
      title: 'EHIC and GHIC: why the card is not travel insurance',
      excerpt: 'The cards support public healthcare but leave important medical and travel risks uncovered.',
      seoTitle: 'EHIC, GHIC, and travel insurance compared',
      seoDescription: 'Compare EHIC and GHIC with travel insurance for private care, repatriation, baggage, and cancellation.',
      paragraphs: [
        'EHIC and GHIC can give eligible travelers access to medically necessary public healthcare under the same conditions as local residents. They are valuable, but they are not comprehensive travel insurance and do not guarantee that all care is free.',
        'Private treatment, patient contributions, medical repatriation, baggage, cancellation, extra accommodation, and document replacement are generally outside the cards’ purpose. Rules and charges differ by country, and a nearby tourist clinic may be private.',
        'Carry a valid card and a suitable policy together. Check eligible countries, expiry, pre-existing condition rules, and whether the insurer expects you to use the card first. Always verify current official guidance before travel.',
      ],
    },
    es: {
      title: 'EHIC y GHIC: por qué la tarjeta no es un seguro de viaje',
      excerpt: 'Las tarjetas facilitan la sanidad pública, pero dejan riesgos médicos y de viaje sin cubrir.',
      seoTitle: 'Comparación de EHIC, GHIC y seguro de viaje',
      seoDescription: 'Compara EHIC y GHIC con el seguro para atención privada, repatriación, equipaje y cancelación.',
      paragraphs: [
        'EHIC y GHIC permiten a viajeros elegibles acceder a atención pública médicamente necesaria en condiciones similares a los residentes. Son útiles, pero no constituyen un seguro completo ni garantizan que toda la atención sea gratuita.',
        'El tratamiento privado, copagos, repatriación, equipaje, cancelación, alojamiento adicional y sustitución de documentos suelen quedar fuera. Las reglas cambian por país y la clínica más cercana en una zona turística puede ser privada.',
        'Lleva una tarjeta válida y una póliza adecuada. Comprueba países, caducidad, condiciones preexistentes y si la aseguradora exige utilizar primero la tarjeta. Revisa siempre la información oficial actualizada.',
      ],
    },
  },
  'strahovka-dlya-aktivnogo-otdyha': {
    en: {
      title: 'Insurance for skiing, diving, and trekking',
      excerpt: 'Check activity definitions, altitude, depth, rescue, equipment, and licensing requirements.',
      seoTitle: 'Travel insurance for adventure activities',
      seoDescription: 'Check coverage for skiing, diving, trekking, rescue, evacuation, equipment, and licenses.',
      paragraphs: [
        'A standard travel policy may exclude sport and adventure activities. List everything you plan to do and find each activity in the policy wording. Marketing labels such as “active travel” are less important than the contractual definition.',
        'Check altitude, depth, route, off-piste, competition, guide, and certification limits. Medical transport and search and rescue may be separate benefits. Local licensing, helmets, safety equipment, and operator rules can be conditions of cover.',
        'Review limits for owned and rented equipment and liability to other people. If plans change during the trip, ask the insurer to extend the policy before the activity and keep written confirmation.',
      ],
    },
    es: {
      title: 'Seguro para esquí, buceo y senderismo',
      excerpt: 'Revisa definiciones, altura, profundidad, rescate, equipos y requisitos de licencia.',
      seoTitle: 'Seguro de viaje para actividades de aventura',
      seoDescription: 'Comprueba cobertura de esquí, buceo, senderismo, rescate, evacuación, equipos y licencias.',
      paragraphs: [
        'Una póliza estándar puede excluir deportes y aventura. Enumera todo lo que piensas hacer y localiza cada actividad en el contrato. Una etiqueta comercial como “viaje activo” importa menos que la definición jurídica.',
        'Revisa límites de altura, profundidad, ruta, fuera de pista, competición, guía y certificación. El transporte médico y el rescate pueden ser coberturas separadas. Licencias, casco y normas del operador pueden ser obligatorios.',
        'Comprueba límites para equipo propio o alquilado y responsabilidad frente a terceros. Si cambian los planes, solicita ampliar la póliza antes de la actividad y conserva la confirmación escrita.',
      ],
    },
  },
  'otmena-poezdki-i-cancel-for-any-reason': {
    en: {
      title: 'Trip cancellation and Cancel For Any Reason explained',
      excerpt: 'Standard cancellation covers listed reasons; CFAR may provide partial reimbursement under stricter rules.',
      seoTitle: 'Trip cancellation insurance vs CFAR',
      seoDescription: 'Understand covered reasons, CFAR deadlines, partial reimbursement, and non-refundable trip costs.',
      paragraphs: [
        'Standard trip cancellation normally reimburses prepaid, non-refundable costs only when cancellation results from a reason listed in the policy. A change of mind or ordinary change of plans is usually not covered.',
        'Cancel For Any Reason can broaden the reasons, but often returns only part of the insured cost. It may need to be purchased shortly after the first trip payment, require the full trip cost to be insured, and require cancellation before a specified deadline.',
        'Insure only non-refundable costs and request refunds from airlines and hotels first. Compare covered reasons, exclusions, percentage reimbursed, deadlines, and evidence requirements. Availability and legal terms differ between countries and products.',
      ],
    },
    es: {
      title: 'Cancelación de viaje y Cancel For Any Reason',
      excerpt: 'La cancelación estándar cubre causas listadas; CFAR puede reembolsar parcialmente con reglas más estrictas.',
      seoTitle: 'Seguro de cancelación frente a CFAR',
      seoDescription: 'Entiende causas cubiertas, plazos de CFAR, reembolso parcial y gastos no reembolsables.',
      paragraphs: [
        'La cancelación estándar suele reembolsar gastos pagados y no recuperables solo cuando la causa figura en la póliza. Cambiar de opinión o modificar los planes normalmente no está cubierto.',
        'Cancel For Any Reason amplía las causas, pero a menudo devuelve solo parte del coste. Puede exigir compra poco después del primer pago, asegurar todo el viaje y cancelar antes de un plazo concreto.',
        'Asegura únicamente gastos no reembolsables y solicita primero devoluciones a aerolíneas y hoteles. Compara causas, exclusiones, porcentaje, plazos y pruebas. La disponibilidad cambia según país y producto.',
      ],
    },
  },
  'dokumenty-dlya-strahovoy-vyplaty': {
    en: {
      title: 'Travel insurance claim documents: what to keep',
      excerpt: 'A practical evidence checklist for medical care, flight disruption, baggage problems, and theft.',
      seoTitle: 'Documents needed for a travel insurance claim',
      seoDescription: 'Keep medical records, receipts, carrier reports, police records, and proof of every claimed expense.',
      paragraphs: [
        'Every claim needs evidence. Notify the insurer within the policy deadline and keep the policy number, assistance contact, and claim instructions offline. Obtain approval before non-emergency treatment when the contract requires it.',
        'For medical claims keep reports, diagnoses, prescriptions, invoices, and proof of payment. For delays keep carrier confirmation, tickets, bookings, and permitted expense receipts. For baggage obtain a report before leaving the airport; for theft obtain a police record promptly.',
        'Photograph documents and keep copies separately. Maintain a timeline of calls, names, case numbers, and instructions. Before submission, check the deductible, deadline, required originals, translation rules, and proof of delivery. Ask for a written clause-based explanation if a claim is denied.',
      ],
    },
    es: {
      title: 'Documentos para reclamar al seguro de viaje',
      excerpt: 'Lista práctica de pruebas para atención médica, vuelos, equipaje y robos.',
      seoTitle: 'Documentos necesarios para una reclamación de viaje',
      seoDescription: 'Conserva informes médicos, recibos, partes del transportista, denuncias y prueba de cada gasto.',
      paragraphs: [
        'Toda reclamación necesita pruebas. Avisa dentro del plazo y guarda sin conexión la póliza, el contacto de asistencia y las instrucciones. Obtén autorización antes de un tratamiento no urgente cuando lo exija el contrato.',
        'Para gastos médicos conserva informes, diagnósticos, recetas, facturas y pagos. Para retrasos guarda confirmación, billetes, reservas y recibos permitidos. Para equipaje presenta el parte antes de salir del aeropuerto y para robos consigue una denuncia rápidamente.',
        'Fotografía los documentos y guarda copias separadas. Registra llamadas, nombres, expedientes e instrucciones. Revisa franquicia, plazo, originales, traducciones y prueba de envío. Si rechazan el caso, pide una explicación escrita basada en una cláusula.',
      ],
    },
  },
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [slug, translations] of Object.entries(insuranceTypes)) {
    for (const locale of ['en', 'es'] as const) {
      const [title, shortDescription] = translations[locale]
      await db.execute(sql`
        INSERT INTO "insurance_types_locales" (
          "title", "short_description", "_locale", "_parent_id"
        )
        SELECT ${title}, ${shortDescription}, ${locale}::"public"."_locales", "id"
        FROM "insurance_types"
        WHERE "slug" = ${slug}
        ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET
          "title" = EXCLUDED."title",
          "short_description" = EXCLUDED."short_description";
      `)
    }
  }

  for (const [slug, translations] of Object.entries(companyDescriptions)) {
    for (const locale of ['en', 'es'] as const) {
      await db.execute(sql`
        INSERT INTO "companies_locales" ("short_description", "_locale", "_parent_id")
        SELECT ${translations[locale]}, ${locale}::"public"."_locales", "id"
        FROM "companies"
        WHERE "slug" = ${slug}
        ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET
          "short_description" = EXCLUDED."short_description";
      `)
    }
  }

  for (const [slug, translations] of Object.entries(articles)) {
    for (const locale of ['en', 'es'] as const) {
      const translation = translations[locale]
      const body = JSON.stringify(richText(translation.paragraphs))
      await db.execute(sql`
        INSERT INTO "articles_locales" (
          "title", "excerpt", "body", "seo_title", "seo_description", "_locale", "_parent_id"
        )
        SELECT
          ${translation.title},
          ${translation.excerpt},
          ${body}::jsonb,
          ${translation.seoTitle},
          ${translation.seoDescription},
          ${locale}::"public"."_locales",
          "id"
        FROM "articles"
        WHERE "slug" = ${slug}
        ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET
          "title" = EXCLUDED."title",
          "excerpt" = EXCLUDED."excerpt",
          "body" = EXCLUDED."body",
          "seo_title" = EXCLUDED."seo_title",
          "seo_description" = EXCLUDED."seo_description";
      `)
    }
  }
}

// Editorial translations are preserved if the schema is rolled back.
export async function down(_args: MigrateDownArgs): Promise<void> {}
