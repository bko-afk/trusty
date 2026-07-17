import type { Payload, PayloadRequest } from 'payload'

export async function recalculateCompanyComplaints(
  payload: Payload,
  company: string | number | { id: string | number },
  req?: Partial<PayloadRequest>,
) {
  const companyId = typeof company === 'object' ? company.id : company
  if (!companyId) return

  const { docs, totalDocs } = await payload.find({
    collection: 'complaints',
    where: {
      and: [{ company: { equals: companyId } }, { status: { equals: 'published' } }],
    },
    limit: 10000,
    depth: 0,
    req,
  })

  await payload.update({
    collection: 'companies',
    id: companyId,
    data: {
      complaintCount: totalDocs,
      resolvedComplaintCount: docs.filter(
        (complaint) => complaint.workflowStatus === 'resolved' || complaint.resolved === true,
      ).length,
    },
    req,
  })
}
