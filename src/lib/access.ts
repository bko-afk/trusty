import type { PayloadRequest } from 'payload'

export function isStaff(req: PayloadRequest) {
  return req.user?.collection === 'users'
}

export function isAdmin(req: PayloadRequest) {
  return req.user?.collection === 'users' && req.user.role === 'admin'
}

export function isCustomer(req: PayloadRequest) {
  return req.user?.collection === 'customers'
}

export function isTrustedWrite(req: PayloadRequest) {
  return isStaff(req) || req.context?.trustedInternal === true
}
