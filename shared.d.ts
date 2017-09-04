export interface ServerError {
  code: string
  message: string
}

export interface BaseResponse {
  error?: ServerError
}

export interface AuthedRequest {
  firebaseToken: string
}

export interface CurrentCompany {
  id: string
  name: string
}

export interface CompanyPaymentDetails {
  status: 'paused' | 'active' | 'cancelled',
  cardType: string,
  last4: string,
  expMonth: number,
  expYear: number,
  nextCharge: string
}

export interface PostalAddress {
  zipCode: string
  city: string
  commune?: string
}

export interface Address extends PostalAddress{
  addressLine1: string
  country: string
}