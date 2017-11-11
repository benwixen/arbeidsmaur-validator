import {AuthedRequest, BaseResponse, LegalEntity} from "../shared";
import {MeetingItemType, MeetingType} from "../enums";

export declare namespace board {
  interface BoardMemberAttributes {
    idNumber: string
    role: string
  }

  export interface MeetingAttributes {
    type: MeetingType,
    meetingPlace: string
    meetingTime: Date // tid for styremøte, dato for generalforsamling
    meetingChairByStatute: boolean // hvorvidt møtelederen var bestemt av vedtektene
    boardChairId: number
    meetingChairId: number
  }

  export interface SharedMeetingItemAttributes {
    itemNumber?: string // only for board meetings
    type: MeetingItemType
    title: string
    suggestion: string
  }

  export interface MeetingItemAttributes extends SharedMeetingItemAttributes{
    votes: MeetingVoteAttributes[]
  }

  export interface MeetingAttendanceAttributes {
    participated: boolean // existence only means person was invited
    doubleVote: boolean // styreleder or møteleder at the time
    connectedEntityId: number
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
  }

  interface GetBoardResponse extends BaseResponse {
    board: BoardMember[]
  }

  interface GetBoardAndMeetingsRequest extends AuthedRequest {
    companyId: number
  }

  interface GetBoardAndMeetingsResponse extends BaseResponse {
    board: BoardMember[]
    meetings: string[]
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
}