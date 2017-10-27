import {formatDate, formatMoney, newDate, shareHoldersFromTransactions} from "../src/utils";

import * as chai from 'chai';
import {shareholders} from "../src/handler_specs/shareholders_handlers";
import ShareTransaction = shareholders.ShareTransaction;
import {test} from "../src/data/testdata";
import makePreben = test.makePreben;
import makeRuben = test.makeRuben;
const assert = chai.assert;

describe('utils', () => {
  it('should format money correctly', () => {
    let formatted = formatMoney(0);
    assert.equal(formatted, '0 kr');
    formatted = formatMoney(10);
    assert.equal(formatted, '10 kr');
    formatted = formatMoney(1000);
    assert.equal(formatted, '1 000 kr');
    formatted = formatMoney(52000);
    assert.equal(formatted, '52 000 kr');
    formatted = formatMoney(1600000);
    assert.equal(formatted, '1 600 000 kr');
    formatted = formatMoney(23800000);
    assert.equal(formatted, '23 800 000 kr');
    formatted = formatMoney(4523800000);
    assert.equal(formatted, '4523 800 000 kr');
  });

  it('should format a date properly', () => {
    const date = new Date(Date.UTC(2017, 7, 30));
    const dateString = formatDate(date);
    assert.equal(dateString, '30.08.2017');
  });

  it('should process share transactions correctly', () => {
    const preben = makePreben();
    const ruben = makeRuben();
    const transactions: ShareTransaction[] = [];
    transactions.push({
      transactionDate: newDate(1, 1, 2017),
      numberOfShares: 90,
      shareNumbers: '1-90',
      buyerIdNumber: preben.idNumber,
    });
    transactions.push({
      transactionDate: newDate(1, 1, 2017),
      numberOfShares: 10,
      shareNumbers: '91-100',
      buyerIdNumber: ruben.idNumber,
    });
    transactions.push({
      transactionDate: newDate(15, 2, 2017),
      numberOfShares: 5,
      shareNumbers: '1-5',
      buyerIdNumber: preben.idNumber,
      sellerIdNumber: ruben.idNumber,
    });
    const owners = [preben, ruben];
    const shareHolders = shareHoldersFromTransactions(transactions, owners);

    assert.equal(shareHolders.length, 2);
    assert.equal(shareHolders[0].idNumber, preben.idNumber);
    assert.equal(shareHolders[0].numberOfShares, 95);
    assert.equal(shareHolders[1].numberOfShares, 5);
  });
});