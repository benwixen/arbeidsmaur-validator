import {AuthedRequest, BaseResponse, LegalEntity} from "../shared";
import {CardStatus, PaymentType} from "../enums";

export declare namespace data {

  // If entity with idNumber exists - then update

  interface SaveConnectedEntityRequest extends AuthedRequest {
    companyId: number
    legalEntity: LegalEntity
  }

  interface SaveConnectedEntityResponse extends BaseResponse {}

  // -

  interface GetConnectedEntitiesRequest extends AuthedRequest {
    companyId: number
  }

  interface GetConnectedEntitiesResponse extends BaseResponse {
    entities: LegalEntity[]
  }

  // -

  interface DeleteConnectedEntityRequest extends AuthedRequest {
    companyId: number
    idNumber: string
  }

  interface DeleteConnectedEntityResponse extends BaseResponse {}

  interface CompanyFullDetailsRequest extends AuthedRequest {
    companyId: number
  }

  interface CardDetails {
    status: CardStatus
    cardType?: string
    last4?: string
    expMonth?: number
    expYear: number
    nextCharge: string
  }

  interface UserAccountDescription {
    name: string
    role: string
  }

  interface CompanyFullDetailsResponse extends BaseResponse {
    name: string
    paymentType: PaymentType
    autoRenewal: boolean
    activeUntil: Date
    cardDetails?: CardDetails
    userAccounts: UserAccountDescription[]
  }
}