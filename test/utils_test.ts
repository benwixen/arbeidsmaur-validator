import * as chai from 'chai';
import {formatDate, formatMoney} from '../src/utils';
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
});
