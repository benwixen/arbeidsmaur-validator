import {BaseResponse} from "../shared";

export declare namespace documents {

  interface InitSignSessionRequest {
    signJobAids: string[]
    mock: boolean
  }

  interface SignJob {
    documentAid: string
    documentName: string
    signJobAid: string
    signableName: string
  }

  interface InitSignSessionRequest2 {
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

  interface SessionStatusRequest {
    sessionId: string
  }

  interface SessionStatusResponse extends BaseResponse {
    message: string
  }
}