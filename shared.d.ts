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

export interface CompanyAttributes {
  id?: number
  status: 'draft' | 'bank_pre' | 'bank_wait' | 'altinn_pre' | 'altinn_wait' | 'registered'
  stripeId?: string
  organizationNumber?: string
  name: string
  contactName: string
  contactEmail: string

  companyMission: string
  companyActivity: string

  businessAddress: Address
  postalAddress: Address
  shares: CompanySharesAttributes

  vingerForm?: VingerFormAttributes
}

export interface VingerFormAttributes {
  companyId?: number
  ultimateBeneficialOwners: string // json-encoded
  ceoIdNumber?: string
  ceoLastName?: string
  boardRightToSign: string
  keyPersonellRightToSign: string
  accountantIdNumber?: string
  accountantLastName?: string
  auditorIdNumber?: string

  autoBanking: boolean

  bankContactName: string
  bankContactIdNumber: string
  bankContactAddress: Address
  bankContactEmail: string
  contactNumber: string
  contactTaxCountry: string
  contactAmericanTaxId?: string
  bankLogonPreference: string

  capitalExpansionDesc?: string

  expectedRevenue?: number
  expectedMaxMonthlyRevenue?: number

  transfersAbroadPerMonth?: number
  transfersAbroadAmountPerMonth?: number
  transfersAbroadMaxTransactionAmount?: number

  moneyTransfersAbroaderDesc?: string
  moneyTransferCountries?: string
  moneyTransferCurrencies?: string
  transfersAbroaderPerMonth?: number
  transfersAbroaderAmountPerMonth?: number
  transfersAbroaderMaxTransactionAmount?: number

  parentCompanyName?: string
  parentCompanyIdNumber?: string
  parentCompanyStockExchange?: string
  parentCompanyISIN?: string

  otherAgreementsExist: boolean
}

interface CompanySharesAttributes {
  totalCapital: number
  numberOfShares: number
  paymentDeadline: Date
  fromDate: Date
}
