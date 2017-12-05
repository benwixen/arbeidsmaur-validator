import {AuthedRequest, BaseResponse, LegalEntity} from "../shared";
import {BoardRole, MeetingItemType, MeetingRole, MeetingType} from "../enums";

export declare namespace board {
  interface BoardMemberAttributes {
    idNumber: string
    role: BoardRole
    isCeo?: boolean
  }

  export interface MeetingAttributes {
    alphaId?: string
    type: MeetingType
    meetingPlace: string
    meetingTime: Date // tid for styremøte, dato for generalforsamling
    meetingChairByStatute: boolean // hvorvidt møtelederen var bestemt av vedtektene
    boardChairId: number
    meetingChairId: number
    signedDocumentAid?: string
  }

  export interface SharedMeetingItemAttributes {
    itemNumber?: string // only for board meetings
    type: MeetingItemType
    title: string
    suggestion: string
  }

  export interface MeetingItemAttributes extends SharedMeetingItemAttributes{
    meetingVotes: MeetingVoteAttributes[]
  }

  export interface MeetingAttendanceAttributes {
    sharesAtTime?: number // only for annual meetings
    roleInMeeting: MeetingRole
    participated: boolean
    connectedEntityId: number
  }

  export interface Attendant extends LegalEntity, MeetingAttendanceAttributes {
    signJobAid?: string // only present if meeting is not ocmpletely signed
  }

  export interface MeetingVoteAttributes {
    vote?: boolean
    objection?: string
    connectedEntityId: number
  }

  interface BoardMember extends BoardMemberAttributes, LegalEntity {}

  interface GetChairmanRequest extends AuthedRequest {
    companyId: number
  }

  interface GetChairmanResponse extends BaseResponse {
    chairman: LegalEntity
  }

  interface GetBoardRequest extends AuthedRequest {
    companyId: number
    includeCeo?: boolean
  }

  interface GetBoardResponse extends BaseResponse {
    board: BoardMember[]
  }

  interface GetMeetingRequest extends AuthedRequest {
    companyId: number
    meetingAid: string
  }

  interface GetMeetingResponse extends BaseResponse {
    meeting: MeetingAttributes
    attendance: Attendant[]
    items: MeetingItemAttributes[]
  }

  interface GetBoardAndMeetingsRequest extends AuthedRequest {
    companyId: number
  }

  interface GetBoardAndMeetingsResponse extends BaseResponse {
    board: BoardMember[]
    meetings: MeetingAttributes[]
  }

  interface InitBoardRequest extends AuthedRequest {
    companyId: number
    board: BoardMemberAttributes[]
    entities: LegalEntity[]
  }

  interface InitBoardResponse extends BaseResponse {}

  interface SubmitMeetingRequest extends AuthedRequest {
    companyId: number
    meeting: MeetingAttributes
    attendance: MeetingAttendanceAttributes[]
    items: MeetingItemAttributes[]
  }

  interface SubmitMeetingResponse extends BaseResponse {
    signJobAid?: string // if current user should sign
  }

  interface GetAnnualMeetingsHeldRequest extends AuthedRequest {
    companyId: number
  }

  interface GetAnnualMeetingsHeldResponse extends BaseResponse {
    years: number[]
  }
}