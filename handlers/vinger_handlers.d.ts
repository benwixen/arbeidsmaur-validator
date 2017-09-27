import {Address, AuthedRequest, BaseResponse} from '../shared';

export declare namespace vinger {

  interface LegalEntityAttributes {
    id: string
    name: string
  }

  interface CompanyOwner extends LegalEntityAttributes {
    type: 'company'
    email: string
    idNumber: string
    address: Address
    numberOfShares: number
  }

  interface PrivateOwner extends LegalEntityAttributes {
    type: 'person'
    email: string
    idNumber: string
    address: Address
    numberOfShares: number
    taxCountry: string
    americanCitizen: boolean
  }

  interface OwnedBoardMemberData {
    type: 'owned'
    owner: string
    role: string
  }

  interface BoardMemberAttributes extends LegalEntityAttributes {
    email: string
    idNumber: string
    address: Address
    role: string
  }

  interface BoardMemberData extends BoardMemberAttributes {
    type: 'standalone'
  }

  interface BankingData {
    autoBanking: boolean
    contactId: string // owner, ceo or board member id
    contactNumber: string
    contactTaxCountry: string
    contactAmericanTaxId?: string
    bankLogonPreference: 'bankid' | 'kodebrikke'

    capitalExpansionDesc?: string

    expectedRevenue: number
    expectedMaxMonthlyRevenue: number

    transfersAbroadPerMonth: number
    transfersAbroudAmountPerMonth: number
    transfersAbroadMaxTransactionAmount: number

    moneyTransfersAbroaderDesc?: string
    moneyTransferCountries?: string
    moneyTransferCurrencies?: string
    transfersAbroaderPerMonth: number
    transfersAbrouderAmountPerMonth: number
    transfersAbroaderMaxTransactionAmount: number

    parentCompanyName?: string
    parentCompanyIdNumber?: string
    parentCompanyStockExchange?: string
    parentCompanyISIN?: string

    otherAgreementsExist: boolean
  }

  interface StartCompanyRequest {
    id?: number
    companyName: string
    contactEmail: string
    contactName: string
    address: Address
    mission: string
    activity: string
    totalCapital: number
    numberOfShares: number
    paymentDeadline: Date
    owners: Array<PrivateOwner | CompanyOwner>
    board: Array<BoardMemberData | OwnedBoardMemberData>
    ultimateBeneficialOwners: Array<PrivateOwner | CompanyOwner>
    ceoId?: string,
    ceoIdNumber?: string
    ceoLastName?: string
    boardRightToSign: string
    keyPersonellRightToSign: string
    accountant?: string
    accountantLastName?: string
    auditor?: string
    banking: BankingData
  }

  interface StartCompanyResponse extends BaseResponse {
    documentAid: string
  }

  interface GetCompaniesInProgressRequest {}

  interface GetVingerCompanyRequest extends AuthedRequest {
    companyId: string
  }

  interface GetVingerFormBasicStatusRequest {
    stiftelsesDokAid: string
  }

  interface GetVingerFormBasicStatusResponse {
    remainingSignatures: boolean
    autoBanking: boolean
  }
}