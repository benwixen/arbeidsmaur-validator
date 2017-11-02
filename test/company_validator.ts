import {CompanyValidator} from "../src/validation/company_validator";
import {vinger} from "../src/handler_specs/vinger_handlers";
import StartCompanyRequest = vinger.StartCompanyRequest;
import {Address, LegalEntity} from "../src/shared";
import StartCompanyVingerForm = vinger.StartCompanyVingerForm;
import Owner = vinger.FounderAttributes;
import {EntityType} from "../src/enums";
import FounderAttributes = vinger.FounderAttributes;
import BeneficialOwnerAttributes = vinger.BeneficialOwnerAttributes;
import {board} from "../src/handler_specs/board_handlers";
import BoardMemberAttributes = board.BoardMemberAttributes;
const chai = require('chai');
const assert = chai.assert;

const address: Address = {
  addressLine1: 'Overgårdveien 17',
  country: 'Norge',
  zipCode: '7900',
  city: 'Rørvik',
};
const preben: LegalEntity = {
  type: EntityType.Person,
  name: 'Preben Ludviksen',
  email: 'prebenl@gmail.com',
  idNumber: '05118639709',
  address,
};
const founder: FounderAttributes = {
  idNumber: preben.idNumber,
  numberOfShares: 100,
};
const beneficialOwner: BeneficialOwnerAttributes = {
  idNumber: founder.idNumber,
  taxCountry: 'Norge',
};
const chair: BoardMemberAttributes = {
  idNumber: founder.idNumber,
  role: 'Styreleder'
};
const vingerForm: StartCompanyVingerForm = {
  autoBanking: true,
  bankContactName: 'Preben Ludviksen',
  bankContactIdNumber: '05118639709',
  bankContactAddress: address,
  bankContactEmail: 'prebenl@gmail.com',
  contactNumber: '90032017',
  contactTaxCountry: 'Norge',
  bankLogonPreference: 'bankid',
  expectedRevenue: 100000,
  expectedMaxMonthlyRevenue: 10000,
  transfersAbroadPerMonth: 0,
  transfersAbroaderPerMonth: 0,
  transfersAbroadAmountPerMonth: 0,
  transfersAbroadMaxTransactionAmount: 0,
  transfersAbroaderAmountPerMonth: 0,
  transfersAbroaderMaxTransactionAmount: 0,
  otherAgreementsExist: false,
  beneficialOwners: [beneficialOwner],
  ultimateBeneficialOwners: '',
  boardRightToSign: 'no',
  keyPersonellRightToSign: 'boardHead',
  foundationPlace: 'internett',
};
const companyReq: StartCompanyRequest = {
  status: 'draft',
  name: 'Utvikler Ludviksen AS',
  contactPersonIdNumber: preben.idNumber,
  businessAddress: address,
  postalAddress: address,
  shares: {
    totalCapital: 30000,
    numberOfShares: 100,
    paymentDeadline: new Date(),
    fromDate: new Date(),
    altinnUpToDate: false,
  },
  foundationDate: new Date(),
  entities: [preben],
  founders: [founder],
  board: [chair],
  vingerForm,
  companyMission: 'Lage programmer.',
  companyActivity: 'Koding'
};

describe('Company validator', () => {

  it('should not be possible to use invalid company names', () => {

    // bokstavene AS må være først eller sist i navnet
    assert.throws(() => {
      CompanyValidator.validateCompanyName('Compagniet');
    });
    assert.throws(() => {
      CompanyValidator.validateCompanyName('En AS To');
    });

    // firmanavnet må ha tre tegn fra det norske alfabetet
    assert.throws(() => {
      CompanyValidator.validateCompanyName('AB');
    });
    assert.throws(() => {
      CompanyValidator.validateCompanyName('AB AS');
    });

    // navn på land og fylker er ikke lov
    assert.throws(() => {
      CompanyValidator.validateCompanyName('Oslo AS');
    });
    assert.throws(() => {
      CompanyValidator.validateCompanyName('oslo AS');
    });
    assert.throws(() => {
      CompanyValidator.validateCompanyName('AS danmark');
    });

    CompanyValidator.validateCompanyName('ABC AS');
    CompanyValidator.validateCompanyName('AS Compagniet');
    CompanyValidator.validateCompanyName('Oslo Møbler AS');
  });


  it('capital needs to be 30.000 or more', () => {
    assert.throws(() => {
      CompanyValidator.validateCompanyCapital(0);
    });
    assert.throws(() => {
      CompanyValidator.validateCompanyCapital(10000);
    });
    CompanyValidator.validateCompanyCapital(30000);
    CompanyValidator.validateCompanyCapital(1000000);
  });


  it('should validate company form', () => {
    CompanyValidator.validateCompanyForm(companyReq);
  });

  it ('should validate company owners', () => {
    let compReq = { ...companyReq, owners: [founder, founder] };
    // 100% of stock should be accounted for
    assert.throws(() => {
      CompanyValidator.validateFounders(compReq);
    });
    const halfOwner: Owner = { ...founder, numberOfShares: 50 };
    compReq = { ...companyReq, owners: [halfOwner] };
    assert.throws(() => {
      CompanyValidator.validateFounders(compReq);
    });

    CompanyValidator.validateFounders(companyReq);
  });

  it('should have a chairman on the board', () => {
    const board: BoardMemberAttributes[] = [];
    assert.throws(() => {
      CompanyValidator.validateBoard(board, []);
    });
    board.push({
      idNumber: preben.idNumber,
      role: 'Styremedlem'
    });
    assert.throws(() => {
      CompanyValidator.validateBoard(board, []);
    });

    CompanyValidator.validateBoard(companyReq.board, companyReq.entities);
  });
});