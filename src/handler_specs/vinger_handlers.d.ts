import {AuthedRequest, BaseResponse, CompanyAttributes, LegalEntity} from '../shared';
import {altinn} from './altinn_handlers';
import {board} from './board_handlers';
import {documents} from './document_handlers';

export declare namespace vinger {

  import EntitySignStatus = documents.EntitySignStatus;
  import BoardMemberAttributes = board.BoardMemberAttributes;
  import BoardMember = board.BoardMember;

  interface FounderAttributes {
    idNumber: string
    numberOfShares: number

    // fields for beneficial owners
    ownerShare?: number
    taxCountry?: string
    foreignTaxId?: string
    americanTaxId?: string
  }

  interface Founder extends FounderAttributes, LegalEntity {}

  interface StartCompanyVingerForm extends VingerFormAttributes {
    beneficialOwners: FounderAttributes[]
  }

  interface BankingAttributes {
    contactTaxCountry: string
    contactForeignTaxId?: string
    contactAmericanTaxId?: string
    bankLogonPreference: string

    expectedRevenue?: number

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
  }

  // db-compliant
  export interface VingerFormAttributes extends BankingAttributes {
    companyId?: number

    ultimateBeneficialOwners: string // json-encoded
    boardRightToSign: string
    keyPersonellRightToSign: string
    accountantIdNumber?: string
    accountantLastName?: string
    auditorIdNumber?: string

    autoBanking: boolean
    extraComments?: string
  }

  /* Request and response specs */

  interface JoinStartupSchoolRequest {
    email: string
    noRedirect?: boolean
  }

  interface JoinStartupSchoolResponse extends BaseResponse {}

  interface NextLessonRequest {
    draftAid: string
    nextStep: string
  }

  interface NextLessonResponse extends BaseResponse {}

  interface CreateVingerDraftRequest {
    email: string
    json?: any
  }

  interface CreateVingerDraftResponse extends BaseResponse {
    alphaId: string
  }

  interface GetVingerDraftRequest {
    alphaId: string
  }

  // definition is on frontend
  // interface GetVingerDraftResponse extends BaseResponse {}

  interface SaveVingerDraftRequest {
    alphaId: string
    draftVersion: number
    json: string
  }

  interface SaveVingerDraftResponse extends BaseResponse {}

  interface StartCompanyRequest extends CompanyAttributes {
    draftAid: string
    electronic: boolean
    ceoIdNumber?: string
    contactPersonIdNumber: string
    entities: LegalEntity[]
    founders: FounderAttributes[]
    board: BoardMemberAttributes[]
    vingerForm: StartCompanyVingerForm
  }

  interface StartCompanyResponse extends BaseResponse {
    signJobAids: string[]
  }

  interface UpgradeVingerToEsignRequest {
    draftAid: string
  }

  interface UpgradeVingerToEsignResponse extends BaseResponse {
    signJobAid?: string
  }

  interface GetCompaniesInProgressRequest {}

  interface GetVingerCompanyRequest extends AuthedRequest {
    companyId: number
  }

  interface VingerCompanyResponseForm extends vinger.StartCompanyVingerForm {
    beneficialOwners: Founder[]
    forwardEmail: string
  }

  interface VingerCompanyResponseBoardMember extends BoardMember {
    entityId: number
    signedRegMeld?: Date
  }

  interface GetVingerCompanyResponse extends vinger.StartCompanyRequest, BaseResponse {
    founders: Founder[]
    vingerForm: VingerCompanyResponseForm
    board: VingerCompanyResponseBoardMember[]
    ceo?: LegalEntity
    stiftDokAid?: string
  }

  interface GetVingerSignStatusRequest extends AuthedRequest {
    companyId: number
  }

  interface GetVingerSignStatusResponse extends BaseResponse {
    owners: EntitySignStatus[]
  }

  interface GetVingerBankSignUrlRequest extends AuthedRequest {
    companyId: number
  }

  interface GetVingerBankSignUrlResponse extends BaseResponse {
    signUrl: string
  }

  interface GetReportSharesNameRequest {
    shareTransactionAid: string
  }

  interface GetReportSharesNameResponse extends BaseResponse {
    name: string
  }

  interface ReportSharesPaidRequest {
    shareTransactionAid: string
  }

  interface ReportSharesPaidResponse extends BaseResponse {}

  interface GetVingerPaymentStatusRequest extends AuthedRequest {
    companyId: number
  }

  interface BankPaymentStatus {
    name: string
    paidDate?: Date
    confirmPayUrl: string
  }

  interface GetVingerPaymentStatusResponse extends BaseResponse {
    founders: BankPaymentStatus[]
  }

  interface ReportRegMeldCreated extends AuthedRequest {
    companyId: number
  }

  interface MarkRegMeldSignedRequest extends AuthedRequest {
    companyId: number
    signeeId: number
  }

  interface GetRegMeldSignStatusRequest extends AuthedRequest {
    companyId: number
  }

  interface GetRegMeldSignStatusResponse extends BaseResponse {
    board: EntitySignStatus[]
    needsSignatureFromUser: boolean
  }

  interface SamRegReadyToSignRequest extends altinn.AltinnAuthedRequest {
    companyId: number
  }

  interface SamRegReadyToSignResponse extends BaseResponse {
    workflowId?: number // undefined if not yet ready
    previewUrl?: string
  }

  interface SignRegMeldRequest extends altinn.AltinnAuthedRequest {
    companyId: number
    workflowId: number
  }

  interface SignRegMeldResponse extends BaseResponse {}
}
