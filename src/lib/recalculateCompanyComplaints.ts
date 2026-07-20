import type { Payload, PayloadRequest } from 'payload'

export async function recalculateCompanyComplaints(
  payload: Payload,
  company: string | number | { id: string | number },
  req?: Partial<PayloadRequest>,
) {
  const companyId = typeof company === 'object' ? company.id : company
  if (!companyId) return

  const { docs } = await payload.find({
    collection: 'complaints',
    where: {
      and: [{ company: { equals: companyId } }, { status: { equals: 'published' } }],
    },
    pagination: false,
    depth: 0,
    req,
  })

  await payload.update({
    collection: 'companies',
    id: companyId,
    data: {
      complaintCount: docs.length,
      resolvedComplaintCount: docs.filter(
        (complaint) => complaint.workflowStatus === 'resolved' || complaint.resolved === true,
      ).length,
    },
    req,
  })
}
