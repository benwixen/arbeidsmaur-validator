import {AuthedRequest, BaseResponse, LegalEntity} from "../shared";

export declare namespace data {

  // If entity with idNumber exists - then update

  interface SaveConnectedEntityRequest extends AuthedRequest {
    companyId: number
    legalEntity: LegalEntity
  }

  interface SaveConnectedEntityResponse extends BaseResponse {}

  // -

  interface GetConnectedEntitiesRequest extends AuthedRequest {
    companyId: number
  }

  interface GetConnectedEntitiesResponse extends BaseResponse {
    entities: LegalEntity[]
  }

  // -

  interface DeleteConnectedEntityRequest extends AuthedRequest {
    companyId: number
    idNumber: string
  }

  interface DeleteConnectedEntityResponse extends BaseResponse {}
}