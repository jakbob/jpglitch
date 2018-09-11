
import { toZigzag, fromZigzag } from './sort-helper';
import { expect } from 'chai';

describe('SortHelper', () => {
  describe('toZigzag', () => {
    it('sorts a 3 x 3 array', () => {
      const testArray = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ];
      expect(toZigzag(testArray, 3)).to.deep.equal([
        1, 2, 6,
        3, 5, 7,
        4, 8, 9
      ]);
    });

    it('sorts a 4 x 4 array', () => {
      const testArray = [
        1,   2,  3,  4, 
        5,   6,  7,  8, 
        9,  10, 11, 12,
        13, 14, 15, 16
      ];
      expect(toZigzag(testArray, 4)).to.deep.equal([
        1,  2,   6,  7,
        3,  5,   8, 13,
        4,  9,  12, 14,
        10, 11, 15, 16
      ]);
    });
  });

  describe('fromZigzag', () => {
    it('restores a 3 x 3 array', () => {
      const testArray = [
        1, 2, 6,
        3, 5, 7,
        4, 8, 9
      ];
      expect(fromZigzag(testArray, 3)).to.deep.equal([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ]);
    });

    it('restores a 4 x 4 array', () => {
      const testArray = [
        1,  2,   6,  7,
        3,  5,   8, 13,
        4,  9,  12, 14,
        10, 11, 15, 16
      ];
      expect(fromZigzag(testArray, 4)).to.deep.equal([
        1,   2,  3,  4, 
        5,   6,  7,  8, 
        9,  10, 11, 12,
        13, 14, 15, 16
      ]);
    });
  });
});