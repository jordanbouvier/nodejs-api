/**
 * Npm import
 */
import { expect } from 'chai';
import { isDifferent } from '../../src/utils/diffCheck';

describe('Check if the values passed are different in an object', () => {
  it('Same values', () => {
    const dummyObject = {
      title: 'test',
    }
    const values = {
      title: 'test',
    }
    const result = isDifferent(dummyObject, values);
    expect(result).to.be.false;
  })
  it('Different values', () => {
    const dummyObject = {
      title: 'test',
      content: 'some content',
      otherContent: 'other content'
    };

    const values = {
      content: 'some new contnt',
      otherContent: 'some other content'
    }

    const result = isDifferent(dummyObject, values);
    expect(result).to.include({
      title: 'test',
      content: 'some new contnt',
      otherContent: 'some other content'
    });
  })
  it('Undefined values in object', () => {
    
    const dummyObject = {
      title: 'test',
      content: 'some content',
      otherContent: 'other content'
    };

    const values = {
      content: 'some new contnt',
      someUndefinedValues: 'doesnt exists',
      someOtherUndefinedValues: 'other one',
      otherContent: 'some other content'
    }
    
    const result = isDifferent(dummyObject, values);    

    expect(result).not.to.include({
      someUndefinedValues: 'doesnt exists',
      someOtherUndefinedValues: 'other one',
    })
    expect(result).to.include({
      title: 'test',
      content: 'some new contnt',
      otherContent: 'some other content'
    })
  })
})


