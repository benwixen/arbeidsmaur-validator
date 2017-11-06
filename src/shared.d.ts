import {EntityType, FirstRefusalType} from "./enums";
import {vinger} from "./handler_specs/vinger_handlers";
import VingerFormAttributes = vinger.VingerFormAttributes;

export interface ServerError {
  code: string
  message: string
}

export interface BaseResponse {
  error?: ServerError
}

export interface AuthTokens {
  firebaseToken: string
  maurToken: string
}

export interface AuthedRequest {
  authTokens: AuthTokens
}

export interface CurrentCompany {
  id: number
  name: string
  status: CompanyStatus
}

export interface CompanyPaymentDetails {
  status: 'paused' | 'active' | 'cancelled',
  cardType: string,
  last4: string,
  expMonth: number,
  expYear: number,
  nextCharge: string
}

interface LegalEntity {
  type: EntityType
  idNumber: string // populated with birthdate for people in public-facing APIs
  name: string
  email: string
  address?: Address

  contactName?: string // for companies
  contactIdNumber?: string // for companies
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

export type CompanyStatus = 'draft' | 'wait_sig' | 'bank_pre' | 'bank_wait_contract' | 'bank_wait_sig' |
  'bank_wait_acc'| 'bank_wait_money' | 'bank_wait_confirm' | 'altinn_pre' | 'altinn_wait_sig' |
  'altinn_wait_confirm' | 'registered';

export interface CompanyAttributes {
  id?: number
  status: CompanyStatus
  stripeId?: string
  organizationNumber?: string
  name: string
  contactPersonId?: number
  contactPerson?: LegalEntity
  foundationDate: Date
  companyMission: string // formål
  companyActivity: string // aktivitet/virksomhet

  businessAddress: Address
  postalAddress: Address
  shares: CompanySharesAttributes
  sharesId?: number

  vingerForm?: VingerFormAttributes
}

interface CompanySharesAttributes {
  totalCapital: number
  numberOfShares: number
  paymentDeadline: Date
  fromDate: Date

  shareholdersFirstRefusal?: FirstRefusalType
  shareholdersFirstRefusalNote?: string // if custom
  shareTransactionNeedsBoardApproval?: boolean
  shareholdersCanMortgage?: boolean

  aksjebevisUpToDate?: boolean,
  lastAksjebevisTime?: Date,
  altinnUpToDate: boolean
  lastAksjonaerRegTime?: Date
  lastAksjonaerRegYear?: number
  aksjonaerRegId?: number
}
