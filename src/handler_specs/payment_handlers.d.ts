import {OrganizationForm} from '../enums';
import {Address, BaseResponse} from '../shared';

export declare namespace payment {

  interface OrderDronningRequest {
    email: string
    contactName: string
    contactIdNumber: string
    companyName: string
    organizationNumber: string
    foundationDate: Date
    businessAddress: Address
    postalAddress?: Address
    organizationForm: OrganizationForm,
    numberOfEmployees: number
    isVatRegistered: boolean
  }

  interface OrderDronningResponse extends BaseResponse {}

  interface ReplaceCardRequest {
    firebaseToken: string
    stripeToken: string
  }

  interface ReplaceCardResponse extends BaseResponse {}

  interface CancelSubscriptionRequest {
    firebaseToken: string
    companyId: number
  }

  interface CancelSubscriptionResponse extends BaseResponse {}

  interface ResumeSubscriptionRequest {
    firebaseToken: string
    companyId: number
  }

  interface ResumeSubscriptionResponse extends BaseResponse {}

  interface RestartSubscriptionRequest {
    stripeToken: string
    firebaseToken: string
    companyId: number
  }

  interface RestartSubscriptionResponse extends BaseResponse {}
}
