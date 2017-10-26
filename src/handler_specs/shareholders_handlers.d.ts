import {Address, AuthedRequest, BaseResponse, LegalEntity} from "../shared";
import {vinger} from "./vinger_handlers";

export declare namespace shareholders {

  interface ShareTransaction {
    transactionDate: Date
    numberOfShares: number
    shareNumbers: string
    buyerIdNumber: string
    sellerIdNumber?: string
    buyerName?: string
    sellerName?: string
  }

  interface ShareHolder extends PublicShareHolder, LegalEntity {}

  interface PublicEntity {
    name: string
    address: Address
    idNumber: string // birthdate or org.number
  }

  interface PublicShareHolder extends PublicEntity {
    numberOfShares: number
    listedDate: Date
    lastUpdate: Date
  }

  interface GetShareHoldersRequest extends AuthedRequest {
    companyId: number
  }

  interface GetShareHoldersResponse extends BaseResponse {
    shareHolders: ShareHolder[]
    transactions: ShareTransaction[]
  }


  interface NewShareholderBookRequest extends AuthedRequest {
    companyId: number
    initialNumberOfShares: number
    entities: LegalEntity[]
    founders: vinger.FounderAttributes[]
    transactions: ShareTransaction[]
  }

  interface NewShareholderBookResponse extends BaseResponse {}
}
