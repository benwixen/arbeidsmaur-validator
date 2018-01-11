import BoardMemberAttributes = board.BoardMemberAttributes;
import {test} from '../src/data/testdata';
import StartCompanyVingerForm = vinger.StartCompanyVingerForm;
import Owner = vinger.FounderAttributes;
import {BoardRole} from '../src/enums';
import FounderAttributes = vinger.FounderAttributes;
import {board} from '../src/handler_specs/board_handlers';
import {vinger} from '../src/handler_specs/vinger_handlers';
import StartCompanyRequest = vinger.StartCompanyRequest;
import {Address, LegalEntity} from '../src/shared';
import {CompanyValidator} from '../src/validation/company_validator';
const makeRuben = test.makeRuben;
const makePreben = test.makePreben;
import chai = require('chai');
const assert = chai.assert;

const address: Address = {
  addressLine1: 'Overgårdveien 17',
  country: 'Norge',
  zipCode: '7900',
  city: 'Rørvik',
};
const preben: LegalEntity = {
  ...makePreben(),
  phoneNumber: '90032017',
};
const ruben = makeRuben();
const founder: FounderAttributes = {
  idNumber: preben.idNumber,
  numberOfShares: 100,
};
const beneficialOwner: FounderAttributes = {
  idNumber: founder.idNumber,
  taxCountry: 'Norge',
  numberOfShares: 0,
};
const chair: BoardMemberAttributes = {
  idNumber: founder.idNumber,
  role: BoardRole.Chairman,
};
const vingerForm: StartCompanyVingerForm = {
  autoBanking: true,
  contactTaxCountry: 'Norge',
  bankLogonPreference: 'bankid',
  expectedRevenue: 100000,
  transfersAbroadPerMonth: 0,
  transfersAbroaderPerMonth: 0,
  transfersAbroadAmountPerMonth: 0,
  transfersAbroadMaxTransactionAmount: 0,
  transfersAbroaderAmountPerMonth: 0,
  transfersAbroaderMaxTransactionAmount: 0,
  beneficialOwners: [beneficialOwner],
  ultimateBeneficialOwners: '',
  boardRightToSign: 'no',
  keyPersonellRightToSign: 'boardHead',
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
    altinnUpToDate: false,
  },
  foundationDate: new Date(),
  entities: [preben, ruben],
  founders: [founder],
  board: [chair],
  vingerForm,
  companyMission: 'Lage programmer.',
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
    assert.throws(() => {
      CompanyValidator.validateCompanyName('JokkmokkAS');
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
    let compReq = { ...companyReq, founders: [founder, founder] };
    // 100% of stock should be accounted for
    assert.throws(() => {
      CompanyValidator.validateFounders(compReq);
    });
    const halfOwner: Owner = { ...founder, numberOfShares: 50 };
    compReq = { ...companyReq, founders: [halfOwner] };
    assert.throws(() => {
      CompanyValidator.validateFounders(compReq);
    });

    CompanyValidator.validateFounders(companyReq);
  });

  it('should have a chairman on the board', () => {
    const boardMembers: BoardMemberAttributes[] = [];
    assert.throws(() => {
      CompanyValidator.validateBoard(boardMembers, []);
    });
    boardMembers.push({
      idNumber: preben.idNumber,
      role: BoardRole.Chairman,
    });
    assert.throws(() => {
      CompanyValidator.validateBoard(boardMembers, []);
    });

    CompanyValidator.validateBoard(companyReq.board, companyReq.entities);
  });
});
