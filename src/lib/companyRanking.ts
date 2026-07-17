type RelationshipValue = string | number | { id?: string | number } | null | undefined

type RankedCompany = {
  name?: string | null
  overallRating?: number | null
  ranking?: {
    globalPosition?: number | null
    categoryPositions?: Array<{
      insuranceType?: RelationshipValue
      position?: number | null
    }> | null
  } | null
}

function relationshipId(value: RelationshipValue) {
  if (value && typeof value === 'object') return value.id === undefined ? undefined : String(value.id)
  return value === null || value === undefined ? undefined : String(value)
}

export function categoryEditorialPosition(company: RankedCompany, insuranceTypeId: string | number) {
  const targetId = String(insuranceTypeId)
  const placement = company.ranking?.categoryPositions?.find(
    (item) => relationshipId(item.insuranceType) === targetId,
  )
  return typeof placement?.position === 'number' && placement.position > 0
    ? placement.position
    : undefined
}

export function editorialPosition(
  company: RankedCompany,
  insuranceTypeIds: Array<string | number> = [],
) {
  if (insuranceTypeIds.length > 0) {
    const positions = insuranceTypeIds
      .map((id) => categoryEditorialPosition(company, id))
      .filter((position): position is number => typeof position === 'number')
    if (positions.length > 0) return Math.min(...positions)
  }

  const globalPosition = company.ranking?.globalPosition
  return typeof globalPosition === 'number' && globalPosition > 0 ? globalPosition : undefined
}

export function sortCompaniesByRanking<T>(
  companies: T[],
  insuranceTypeIds: Array<string | number> = [],
) {
  return [...companies].sort((left, right) => {
    const leftCompany = left as unknown as RankedCompany
    const rightCompany = right as unknown as RankedCompany
    const leftPosition = editorialPosition(leftCompany, insuranceTypeIds)
    const rightPosition = editorialPosition(rightCompany, insuranceTypeIds)

    if (leftPosition !== undefined && rightPosition !== undefined && leftPosition !== rightPosition) {
      return leftPosition - rightPosition
    }
    if (leftPosition !== undefined) return -1
    if (rightPosition !== undefined) return 1

    const ratingDifference =
      Number(rightCompany.overallRating || 0) - Number(leftCompany.overallRating || 0)
    if (ratingDifference !== 0) return ratingDifference
    return String(leftCompany.name || '').localeCompare(String(rightCompany.name || ''))
  })
}
