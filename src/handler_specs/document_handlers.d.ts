import {AuthedRequest, BaseResponse} from "../shared";
import {vinger} from "./vinger_handlers";

export declare namespace documents {


  interface InitSignSessionRequest {
    signJobAids: string[]
    mock: boolean
  }

  interface SignJob {
    documentAid: string
    documentName: string
    signJobAid: string
  }

  interface InitSignSessionRequest2 {
    companyId: number
    idNumber: string
    signJobs: SignJob[]
    mock: boolean
    userAgent: string
  }

  interface InitSignSessionResponse extends BaseResponse {
    helperUri: string
    cid: string
    sid: string
  }

  interface MockSignRequest {
    signName: string
    sessionId: string
  }

  interface SignedDocument {
    documentAid: string
    signatures: Signature[]
  }

  interface Signature {
    companyName?: string
    b64signature: string
    b64ocsp: string
  }

  interface GetSignaturesRequest {
    documentAids: string[]
  }

  interface GetSignaturesResponse extends BaseResponse {
    documents: SignedDocument[]
  }

  interface AddSignaturesRequest {
    companyId: number
    signeeName: string
    documents: [{
      signTime: Date // utc sign time
      documentAid: string
      signJobAid: string
      b64signature: string
      b64ocsp: string
    }]
  }

  interface AddSignaturesResponse extends BaseResponse {}

  interface SessionStatusRequest {
    sessionId: string
  }

  interface SessionStatusResponse extends BaseResponse {
    message: string
  }

  interface EntitySignStatus {
    signeeName: string
    companyName?: string
    signed: boolean
    signUrl: string
  }
}