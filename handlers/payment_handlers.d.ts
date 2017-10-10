import {BaseResponse} from '../shared';

export declare namespace payment {

  interface PayRequest {
    stripeToken: string
    email: string
    customerName: string
    companyName: string
    organizationNumber: string
  }

  interface PayResponse extends BaseResponse {}  
  
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

