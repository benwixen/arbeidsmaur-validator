import {AuthedRequest, BaseResponse, LegalEntity} from "../shared";

export declare namespace data {

  // -

  interface CreateConnectedEntityRequest extends AuthedRequest {
    companyId: number
    legalEntity: LegalEntity
  }

  interface CreateConnectedEntityResponse extends BaseResponse {}

  // -

  interface UpdateConnectedEntityRequest extends AuthedRequest {
    companyId: number
    legalEntity: LegalEntity
  }

  interface UpdateConnectedEntityResponse extends BaseResponse {}

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