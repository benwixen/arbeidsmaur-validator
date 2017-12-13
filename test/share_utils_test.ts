import ShareTransaction = shareholders.ShareTransaction;
import {test} from '../src/data/testdata';
import {shareholders} from '../src/handler_specs/shareholders_handlers';
import {
  parseShareNumbersString, shareHoldersFromTransactions, shareNumbersToString,
  sortTransactions,
} from '../src/share_utils';
import {newDate} from '../src/utils';
const makeRuben = test.makeRuben;
const makePreben = test.makePreben;
import * as chai from 'chai';
const assert = chai.assert;

describe('share utils', () => {

  it('should process share transactions correctly', () => {
    const preben = makePreben();
    const ruben = makeRuben();
    const transactions: ShareTransaction[] = [];
    transactions.push({
      transactionTime: newDate(1, 1, 2017),
      numberOfShares: 90,
      shareNumbers: '1-90',
      buyerIdNumber: preben.idNumber,
    });
    transactions.push({
      transactionTime: newDate(1, 1, 2017),
      numberOfShares: 10,
      shareNumbers: '91-100',
      buyerIdNumber: ruben.idNumber,
    });
    transactions.push({
      transactionTime: newDate(15, 2, 2017),
      numberOfShares: 5,
      shareNumbers: '91-95',
      buyerIdNumber: preben.idNumber,
      sellerIdNumber: ruben.idNumber,
    });
    const owners = [preben, ruben];
    let shareHolders = shareHoldersFromTransactions(transactions, owners);

    assert.equal(shareHolders.length, 2);
    assert.equal(shareHolders[0].idNumber, preben.idNumber);
    assert.equal(shareHolders[0].numberOfShares, 95);
    assert.equal(shareHolders[1].numberOfShares, 5);

    // should return empty shareNumbers for outsold shareholders
    transactions.push({
      transactionTime: newDate(15, 2, 2017),
      numberOfShares: 5,
      shareNumbers: '96-100',
      buyerIdNumber: preben.idNumber,
      sellerIdNumber: ruben.idNumber,
    });
    shareHolders = shareHoldersFromTransactions(transactions, owners);

    assert.equal(shareHolders.length, 2);
    assert.equal(shareHolders[0].idNumber, preben.idNumber);
    assert.equal(shareHolders[0].shareNumbers, '1-100');
    assert.equal(shareHolders[1].shareNumbers, undefined);
  });

  it('should sort transactions by date', () => {
    const transactions: ShareTransaction[] = [];
    transactions.push({
      transactionTime: newDate(15, 1, 2017),
      numberOfShares: 90,
      shareNumbers: '1-90',
      buyerIdNumber: 'fake1',
    });
    transactions.push({
      transactionTime: newDate(1, 1, 2017),
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
