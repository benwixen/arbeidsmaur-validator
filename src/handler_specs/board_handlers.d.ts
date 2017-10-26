import {LegalEntity} from "../shared";

export declare namespace board {
  interface BoardMemberAttributes {
    idNumber: string
    role: string
  }

  interface BoardMember extends BoardMemberAttributes, LegalEntity {}

}