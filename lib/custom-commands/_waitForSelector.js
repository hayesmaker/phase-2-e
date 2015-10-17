var util = require('util');
var WaitFor = require('./_waitFor');


function WaitForSelector() {
  WaitFor.call(this);
}

util.inherits(WaitForSelector, WaitFor);

/**
 *
 *
 * @method command
 * @param {string} selector
 * @param {number|function|string} milliseconds
 * @param {function|boolean|string|number} callbackOrAbort
 * @returns {WaitFor}
 */
WaitForSelector.prototype.command = function commandFn(selector, milliseconds, callbackOrAbort) {
  this.startTimer = new Date().getTime();
  this.ms = this.setMilliseconds(milliseconds);
  this._stackTrace = commandFn.stackTrace;

  if (typeof arguments[1] === 'function') {
    ////////////////////////////////////////////////
    // The command was called with an implied global timeout:
    //
    // waitForElement('body', function() {});
    // waitForElement('body', function() {}, 'custom message');
    ////////////////////////////////////////////////
    this.cb = arguments[1];
  } else if (typeof arguments[2] === 'boolean') {
    ////////////////////////////////////////////////
    // The command was called with a custom abortOnFailure:
    //
    // waitForElement('body', 500, false);
    ////////////////////////////////////////////////
    this.abortOnFailure = arguments[2];

    // The optional callback is the 4th argument now
    this.cb = arguments[3] || function () {};
  } else if (typeof arguments[2] === 'number') {
    ////////////////////////////////////////////////
    // The command was called with a custom rescheduleInterval:
    //
    // waitForElement('body', 500, 100);
    ////////////////////////////////////////////////
    this.rescheduleInterval = arguments[2];

    if (typeof arguments[3] === 'boolean') {
      ////////////////////////////////////////////////
      // The command was called with a custom rescheduleInterval and custom abortOnFailure:
      //
      // waitForElement('body', 500, 100, false);
      ////////////////////////////////////////////////
      this.abortOnFailure = arguments[3];

      // The optional callback is the 5th argument now
      this.cb = arguments[4] || function () {
        };
    } else {
      // The optional callback is the 4th argument now
      this.cb = arguments[3] || function () {
        };
    }
  } else {
    // The optional callback is the 3th argument now
    this.cb = (typeof callbackOrAbort === 'function' && callbackOrAbort) || function () {
      };
  }

  // support for a custom message
  this.message = null;
  if (arguments.length > 1) {
    var lastArgument = arguments[arguments.length - 1];
    if (typeof lastArgument === 'string') {
      this.message = lastArgument;
    }
  }

  this.selector = selector;
  this.checkComponent();
  return this;
};

module.exports = WaitForSelector;
