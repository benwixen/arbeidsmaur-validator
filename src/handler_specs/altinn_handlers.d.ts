import {AuthedRequest, BaseResponse} from '../shared';

export namespace altinn {

  interface GetAltinnSettingsRequest extends AuthedRequest {}

  interface GetAltinnSettingsResponse extends BaseResponse {
    userName?: string
    systemId?: string
    systemPassword: string
    verified: boolean
  }

  interface SubmitSystemCredentialsRequest extends AuthedRequest {
    systemId: string
  }

  interface SubmitSystemCredentialsResponse extends BaseResponse {}

  interface SubmitAllCredentialsRequest extends AuthedRequest {
    systemId: string
    userName: string
    userPassword: string
  }

  interface SendSMSPinRequest extends AuthedRequest {
    userPassword: string
  }

  interface SendSMSPinResponse extends BaseResponse {
    message: string
  }

  interface VerifySMSPinRequest extends AuthedRequest {
    companyId: number
    userPassword: string
    pin: string
  }

  interface VerifySMSPinResponse extends BaseResponse {
    altinnToken: string
  }

  interface AltinnAuthedRequest extends AuthedRequest {
    altinnToken: string
  }

  interface SubmitAksjonaerRegOppgaveRequest extends AltinnAuthedRequest {
    companyId: number
    reportYear: number
  }

  interface SubmitAksjonaerRegOppgaveResponse extends BaseResponse {
    receiptId: number
  }

  interface CheckAksjonaerRegStatusRequest extends AltinnAuthedRequest {
    companyId: number
    receiptId: number
  }

  interface CheckAksjonaerRegStatusResponse extends BaseResponse {
    workflowId: number
  }

  interface SignFormTaskRequest extends AltinnAuthedRequest {
    companyId: number
    workflowId: number
  }

  interface SignFormTaskRespone extends BaseResponse {}
}
