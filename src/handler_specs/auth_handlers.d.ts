import {AuthedRequest, BaseResponse, CurrentCompany, PostalAddress} from '../shared';

export declare namespace auth {
  interface ActivationCodeToEmailRequest {
    oneTimeCode: string
  }

  interface ActivationCodeToEmailResponse extends BaseResponse {
    email: string
  }

  interface LinkAuthProviderRequest {
    email: string
    firebaseToken: string
  }

  interface LinkAuthProviderResponse extends BaseResponse {}

  interface LinkAuthProviderAuthedRequest {
    firebaseToken: string
  }

  interface LinkAuthProviderAuthedResponse extends BaseResponse {
    oneTimeCode: string
  }

  interface ResetPasswordRequest {
    email: string
  }

  interface ResetPasswordResponse extends BaseResponse {}

  interface ConfirmLinkAuthProviderRequest {
    oneTimeCode: string
  }

  interface ConfirmLinkAuthProviderResponse extends BaseResponse {
    activatedAuth: string
  }

  interface RemoveAuthProviderWithOneTimeCodeRequest {
    oneTimeCode: string
  }

  interface RemoveAuthProviderWithOneTimeCodeResponse extends BaseResponse {}

  interface RemoveAuthProviderWithTokenRequest {
    firebaseToken: string
    provider: string
  }

  interface RemoveAuthProviderWithTokenResponse extends BaseResponse {}

  interface AuthenticateRequest {
    firebaseToken: string
    oneTimeCode?: string
    providerEmail?: string
  }

  interface AuthenticateResponse extends BaseResponse {
    currentCompany?: CurrentCompany
    mainEmail: string
    maurToken: string // JSON Web Token with permsissions, to improve authorization performance
  }

  interface GetAccountDetailsRequest extends AuthedRequest {}

  interface AuthAccountDetails {
    provider: string
    email: string
  }

  interface GetAccountDetailsResponse extends BaseResponse {
    name: string
    email: string
    authAccounts: AuthAccountDetails[]
  }

  interface UpdateEmailRequest {
    firebaseToken: string
    email: string
  }

  interface UpdateEmailResponse extends BaseResponse {}

  interface GetPostalAddressRequest {
    query: string
  }

  interface GetPostalAddressResponse extends BaseResponse, Array<PostalAddress> {}
}
