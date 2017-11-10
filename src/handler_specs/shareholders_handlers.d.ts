import {Address, AuthedRequest, BaseResponse, CompanySharesAttributes, LegalEntity} from "../shared";
import {vinger} from "./vinger_handlers";

export declare namespace shareholders {

  interface ShareTransaction {
    transactionTime: Date
    numberOfShares: number
    shareNumbers: string
    buyerIdNumber: string
    sellerIdNumber?: string
    buyerName?: string
    sellerName?: string
  }

  interface ShareHolder extends PublicShareHolder, LegalEntity {
    address: Address
  }

  interface PublicEntity {
    id?: number
    name: string
    address: Address
    idNumber: string // birthdate or org.number
  }

  interface PublicShareHolder extends PublicEntity {
    numberOfShares: number
    shareNumbers: string
    listedDate: Date
    lastUpdate: Date
  }

  interface GetShareHoldersRequest extends AuthedRequest {
    companyId: number
  }

  interface GetShareHoldersResponse extends BaseResponse {
    currentReportingYear: number
    aksjonaerRegReceiptId?: number
    aksjonaerRegWorkflowId?: number
    companyAttributes: CompanySharesAttributes
    entities: LegalEntity[]
    transactions: ShareTransaction[]
  }

  interface NewShareholderBookRequest extends AuthedRequest {
    companyId: number
    initialNumberOfShares: number
    initialCapital: number
    initialSharePrice: number
    shareholdersFirstRefusalNote?: string // if undefined, type is standard
    shareTransactionNeedsBoardApproval: boolean
    shareholdersCanMortgage: boolean
    generateAksjebevis: boolean

    entities: LegalEntity[]
    founders: vinger.FounderAttributes[]
    transactions: ShareTransaction[]
  }

  interface NewShareholderBookResponse extends BaseResponse {}

  interface CreateShareTransactionRequest extends AuthedRequest {
    companyId: number
    transaction: ShareTransaction
  }

  interface CreateShareTransactionResponse extends BaseResponse {
    transaction: ShareTransaction
  }

  interface RenewAksjebevisRequest extends AuthedRequest {
    companyId: number
  }

  interface RenewAksjebevisResponse extends BaseResponse {}
}
