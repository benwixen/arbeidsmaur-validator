import {Address, AuthedRequest, BaseResponse, CompanyAttributes, VingerFormAttributes} from '../shared';

export declare namespace vinger {

  interface LegalEntityAttributes {
    idNumber: string
    name: string
    email: string
    address: Address
  }

  // for returning data from system
  interface Owner extends LegalEntityAttributes {
    numberOfShares: number
  }

  interface BeneficialOwner extends Owner {
    taxCountry: string
    americanTaxId?: string
  }

  interface BoardMemberAttributes extends LegalEntityAttributes {
    role: string
  }

  interface StartCompanyVingerForm extends VingerFormAttributes {
    beneficialOwners: Array<BeneficialOwner>
  }

  interface StartCompanyRequest extends CompanyAttributes {
    owners: Array<Owner>
    board: Array<BoardMemberAttributes>
    vingerForm: StartCompanyVingerForm
  }

  interface StartCompanyResponse extends BaseResponse {
    documentAid: string
  }

  interface GetCompaniesInProgressRequest {}

  interface GetVingerCompanyRequest extends AuthedRequest {
    companyId: string
  }

  interface GetVingerFormBasicStatusRequest {
    stiftelsesDokAid: string
  }

  interface GetVingerFormBasicStatusResponse {
    remainingSignatures: boolean
    autoBanking: boolean
  }
}