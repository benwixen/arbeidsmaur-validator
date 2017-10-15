import {formatMoney} from "../src/utils";

import * as chai from 'chai';
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
  });
});