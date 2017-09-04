import {CompanyValidator} from "../company_validator";
import {vinger} from "../handlers/vinger_handlers";
import PrivateOwner = vinger.PrivateOwner;
import StartCompanyRequest = vinger.StartCompanyRequest;
import {Address} from "../shared";
import OwnedBoardMemberData = vinger.OwnedBoardMemberData;
import BankingData = vinger.BankingData;
import BoardMemberData = vinger.BoardMemberData;
const chai = require('chai');
const assert = chai.assert;

const address: Address = {
  addressLine1: 'Overgårdveien 17',
  country: 'Norge',
  zipCode: '7900',
  city: 'Rørvik',
};
const owner: PrivateOwner = {
  id: 'abc123',
  type: 'person',
  name: 'Preben Ludviksen',
  email: 'prebenl@gmail.com',
  idNumber: '05118639709',
  address,
  numberOfShares: 100,
  taxCountry: 'Norge',
  americanCitizen: false,
};
const chair: OwnedBoardMemberData = {
  type: 'owned',
  owner: 'abc123',
  role: 'Styreleder'
};
const banking: BankingData = {
  autoBanking: true,
  contactId: 'abc123',
  contactNumber: '90032017',
  contactTaxCountry: 'Norge',
  bankLogonPreference: 'bankid',
  expectedRevenue: 100000,
  expectedMaxMonthlyRevenue: 10000,
  transfersAbroadPerMonth: 0,
  transfersAbroaderPerMonth: 0,
  transfersAbroudAmountPerMonth: 0,
  transfersAbroadMaxTransactionAmount: 0,
  transfersAbrouderAmountPerMonth: 0,
  transfersAbroaderMaxTransactionAmount: 0,
  otherAgreementsExist: false,
};
const companyReq: StartCompanyRequest = {
  companyName: 'Utvikler Ludviksen AS',
  contactEmail: 'prebenl@gmail.com',
  contactName: 'Preben Ludviksen',
  address,
  totalCapital: 30000,
  numberOfShares: 100,
  paymentDeadline: new Date(),
  owners: [owner],
  board: [chair],
  ultimateBeneficialOwners: [owner],
  boardRightToSign: 'no',
  keyPersonellRightToSign: 'boardHead',
  banking,
  mission: 'Lage programmer.',
  activity: 'Koding'
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
    let compReq = { ...companyReq, owners: [owner, owner] };
    // 100% of stock should be accounted for
    assert.throws(() => {
      CompanyValidator.validateOwners(compReq);
    });
    const halfOwner: PrivateOwner = { ...owner, numberOfShares: 50 };
    compReq = { ...companyReq, owners: [halfOwner] };
    assert.throws(() => {
      CompanyValidator.validateOwners(compReq);
    });

    CompanyValidator.validateOwners(companyReq);
  });

  it('should have a chairman on the board', () => {
    const board: Array<BoardMemberData | OwnedBoardMemberData> = [];
    assert.throws(() => {
      CompanyValidator.validateBoard(board);
    });
    board.push({
      type: 'owned',
      owner: 'abc123',
      role: 'Styremedlem'
    });
    assert.throws(() => {
      CompanyValidator.validateBoard(board);
    });

    CompanyValidator.validateBoard(companyReq.board);
  });
});