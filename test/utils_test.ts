import {
  formatDate, formatMoney, newDate, parseShareNumbersString, shareHoldersFromTransactions, shareNumbersToString,
  sortTransactions
} from "../src/utils";

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

  it('should sort transactions by date', () => {
    const transactions: ShareTransaction[] = [];
    transactions.push({
      transactionDate: newDate(15, 1, 2017),
      numberOfShares: 90,
      shareNumbers: '1-90',
      buyerIdNumber: 'fake1',
    });
    transactions.push({
      transactionDate: newDate(1, 1, 2017),
      numberOfShares: 10,
      shareNumbers: '91-100',
      buyerIdNumber: 'fake2',
    });
    sortTransactions(transactions);
    assert.equal(transactions[0].buyerIdNumber, 'fake2');
  });

  it('should convert a list of share numbers to a string', () => {
    let shareNumbers = [1];
    let shareString = shareNumbersToString(shareNumbers);
    assert.equal(shareString, '1');

    shareNumbers = [1, 2, 3];
    shareString = shareNumbersToString(shareNumbers);
    assert.equal(shareString, '1-3');

    shareNumbers = [2, 3, 1];
    shareString = shareNumbersToString(shareNumbers);
    assert.equal(shareString, '1-3');

    shareNumbers = [6, 7, 2, 3, 1];
    shareString = shareNumbersToString(shareNumbers);
    assert.equal(shareString, '1-3,6-7');

    shareNumbers = [7, 8, 2, 5, 3, 1];
    shareString = shareNumbersToString(shareNumbers);
    assert.equal(shareString, '1-3,5,7-8');

  });

  it('should convert a share number string to a list', () => {
    let sharesString = '1';
    let shareNumbers = parseShareNumbersString(sharesString);
    assert.deepEqual(shareNumbers, [1]);

    sharesString = '1-3';
    shareNumbers = parseShareNumbersString(sharesString);
    assert.deepEqual(shareNumbers, [1, 2, 3]);

    sharesString = '1-3,6-7';
    shareNumbers = parseShareNumbersString(sharesString);
    assert.deepEqual(shareNumbers, [1, 2, 3, 6, 7]);

    sharesString = '1-3,5,7-8';
    shareNumbers = parseShareNumbersString(sharesString);
    assert.deepEqual(shareNumbers, [1, 2, 3, 5, 7, 8]);
  });

});