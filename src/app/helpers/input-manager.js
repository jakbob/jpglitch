export class InputManager {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.lastInputs = [];
  }

  handleInput(keyboardEvent) {
    const keyCode = keyboardEvent.code;
    if (keyboardEvent.shiftKey) {
      this._handleValueChange(keyCode);
      this.lastInputs = [];
    } else if (keyCode.startsWith('Arrow')) {
      this._handleCursorMove(keyCode);
      this.lastInputs = [];
    } else if (keyCode.startsWith('Digit'))  {
      this._handleValueSet(keyCode);
    }
  }

  _handleValueChange(key) {
    switch(key) {
      case 'ArrowUp':
        this._triggerCallback('valueChange', 10);
        break;
      case 'ArrowDown':
        this._triggerCallback('valueChange', -10);
        break;
      case 'ArrowRight': 
        this._triggerCallback('valueChange', 1);
        break;
      case 'ArrowLeft': 
        this._triggerCallback('valueChange', -1);
        break;
    }
  }

  _handleCursorMove(key) {
    switch(key) {
      case 'ArrowRight':
        this._triggerCallback('cursorMove', 1);
        this.activeIndex += 1;
        break;
      case 'ArrowLeft':
        this._triggerCallback('cursorMove', -1);
        break;
      case 'ArrowUp':
        this._triggerCallback('cursorMove', -8);
        break;
      case 'ArrowDown':
        this._triggerCallback('cursorMove', 8);
        break;
    }
  }

  _handleValueSet(key) {
    const digit = key.replace('Digit', '');
    const digitValue = parseInt(digit, 10);
    if (isNaN(digitValue)) {
      return;
    }

    this._triggerCallback('valueSet', digitValue);
  }

  _triggerCallback(cbName, value) {
    const selectedCallback = this.callbacks[cbName];

    if (!selectedCallback) {
      return;
    }

    selectedCallback(value);
  }

}