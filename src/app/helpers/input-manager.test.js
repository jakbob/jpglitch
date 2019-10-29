import { expect } from 'chai';
import sinon from 'sinon';
import { InputManager } from './input-manager';

describe('InputManager', () => {
  it('should trigger valueChange when arrow and shift is pressed', () => {
    const onValueChange = sinon.spy();
    const sut = new InputManager({
      valueChange: onValueChange
    });

    const testCases = [
      { keyCode: 'ArrowUp', value: 10 },
      { keyCode: 'ArrowDown', value: -10 },
      { keyCode: 'ArrowRight', value: 1 },
      { keyCode: 'ArrowLeft', value: -1 },
    ];

    testCases.map(testData => {
      onValueChange.resetHistory();
      const fakeEvent = {
        shiftKey: true,
        code: testData.keyCode
      };

      sut.handleInput(fakeEvent);

      expect(onValueChange).to.have.been.calledWith(testData.value);
    });
  });
  
  it('should trigger cursorMove when arrow is pressed without shift', () => {
    const onCursorMove = sinon.spy();
    const sut = new InputManager({
      cursorMove: onCursorMove
    });

    const testCases = [
      { keyCode: 'ArrowUp', value: -8 },
      { keyCode: 'ArrowDown', value: 8 },
      { keyCode: 'ArrowRight', value: 1 },
      { keyCode: 'ArrowLeft', value: -1 },
    ];

    testCases.map(testData => {
      onCursorMove.resetHistory();
      const fakeEvent = {
        shiftKey: false,
        code: testData.keyCode
      };

      sut.handleInput(fakeEvent);

      expect(onCursorMove).to.have.been.calledWith(testData.value);
    });
  });

  it('should trigger valueSet when digit is pressed', () => {
    const onDigitSet = sinon.spy();
    const sut = new InputManager({
      valueSet: onDigitSet
    });

    const testCases = [
      { keyCode: 'Digit1', value: 1 },
      { keyCode: 'Digit2', value: 2 },
      { keyCode: 'Digit3', value: 3 },
      { keyCode: 'Digit4', value: 4 },
      { keyCode: 'Digit5', value: 5 },
      { keyCode: 'Digit6', value: 6 },
      { keyCode: 'Digit7', value: 7 },
      { keyCode: 'Digit8', value: 8 },
      { keyCode: 'Digit9', value: 9 },
      { keyCode: 'Digit0', value: 0 },
    ];

    testCases.map(testData => {
      onDigitSet.resetHistory();
      const fakeEvent = {
        shiftKey: false,
        code: testData.keyCode
      };

      sut.handleInput(fakeEvent);

      expect(onDigitSet).to.have.been.calledWith(testData.value);
    });
  });
});