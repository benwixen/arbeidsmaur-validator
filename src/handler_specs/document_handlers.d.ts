import {AuthedRequest, BaseResponse} from "../shared";
import {DocumentType} from "../enums";
import {vinger} from "./vinger_handlers";

export declare namespace documents {


  interface InitSignSessionRequest {
    signJobAids: string[]
    mock: boolean
  }

  interface SignJobRequest {
    documentAid: string
    documentName: string
    signJobAid: string

    // if PAdES
    signeeName: string
    companyName?: string
    s3DocumentToSign: string // to download: original, or last signed
    s3DocumentUploadName: string // name to upload
  }

  interface InitSignSessionRequest2 {
    companyId: number
    idNumber: string
    signJobs: SignJobRequest[]
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

  interface DocumentToSign {
    documentAid: string
    signatures: Signature[]
  }

  interface Signature {
    companyName?: string // if signed on behalf of company
    signTime?: Date

    // if PAdES
    signJobAid: string
    s3DocumentName: string

    // if SDO
    b64signature?: string
    b64ocsp?: string
  }

  interface GetSignaturesRequest {
    documentAids: string[]
  }

  interface GetSignaturesResponse extends BaseResponse {
    documents: DocumentToSign[]
  }

  interface NewDocumentSignature {
    signTime: Date // utc sign time
    documentAid: string
    signJobAid: string

    // if PAdES (for optimistic locking)
    lastSignJobAid?: string

    // if SDO
    b64signature?: string
    b64ocsp?: string
  }

  interface AddSignaturesRequest {
    companyId: number
    signeeName: string
    documents: NewDocumentSignature[]
  }

  interface AddSignaturesResponse extends BaseResponse {
    documentType: DocumentType
    isSignerUser: boolean
  }

  interface SessionStatusRequest {
    sessionId: string
  }

  interface SessionStatusResponse extends BaseResponse {
    message: string
    documentType: DocumentType
    isSignerUser: boolean
  }

  interface EntitySignStatus {
    signeeName: string
    companyName?: string
    signed: boolean
    signUrl: string
  }
}