var util = require('util');
var events = require('events');
var Logger = require('../../node_modules/nightwatch/lib/util/logger');
var Utils = require('../../node_modules/nightwatch/lib/util/utils');

function WaitFor() {
  events.EventEmitter.call(this);
  this.startTimer = null;
  this.cb = null;
  this.ms = null;
  this.rescheduleInterval = this.client.api.globals.waitForConditionPollInterval || this.client.options.waitForConditionPollInterval || 500; //ms
  this.protocol = require('../../node_modules/nightwatch/lib/api/protocol.js')(this.client);
}

util.inherits(WaitFor, events.EventEmitter);

/**
 * @param {number|function|string} milliseconds
 * @param {function|boolean|string|number} callbackOrAbort
 * @returns {WaitFor}
 */
WaitFor.prototype.command = function commandFn(milliseconds, callbackOrAbort) {
  this.startTimer = new Date().getTime();
  this.ms = this.setMilliseconds(milliseconds);
  this._stackTrace = commandFn.stackTrace;

  if (typeof arguments[0] === 'function') {
    ////////////////////////////////////////////////
    // The command was called with an implied global timeout:
    //
    // waitFor(function() {});
    // waitFor(function() {}, 'custom message');
    ////////////////////////////////////////////////
    this.cb = arguments[0];
  } else if (typeof arguments[1] === 'boolean') {
    ////////////////////////////////////////////////
    // The command was called with a custom abortOnFailure:
    //
    // waitFor(500, false);
    ////////////////////////////////////////////////
    this.abortOnFailure = arguments[1];

    // The optional callback is the 3rd argument now
    this.cb = arguments[2] || function () {};
  } else if (typeof arguments[1] === 'number') {
    ////////////////////////////////////////////////
    // The command was called with a custom rescheduleInterval:
    //
    // waitForElement(500, 100);
    ////////////////////////////////////////////////
    this.rescheduleInterval = arguments[1];

    if (typeof arguments[2] === 'boolean') {
      ////////////////////////////////////////////////
      // The command was called with a custom rescheduleInterval and custom abortOnFailure:
      //
      // waitForElement(500, 100, false);
      ////////////////////////////////////////////////
      this.abortOnFailure = arguments[2];

      // The optional callback is the 4th argument now
      this.cb = arguments[3] || function () {};
    } else {
      // The optional callback is the 3rd argument now
      this.cb = arguments[2] || function () {};
    }
  } else {
    // The optional callback is the 3rd argument now
    this.cb = (typeof callbackOrAbort === 'function' && callbackOrAbort) || function () {};
  }

  // support for a custom message
  this.message = null;
  if (arguments.length > 1) {
    var lastArgument = arguments[arguments.length - 1];
    if (typeof lastArgument === 'string') {
      this.message = lastArgument;
    }
  }

  this.checkComponent();
  return this;
};


/*!
 * @override
 */
WaitFor.prototype.phaserComponentFound = function (result, now) {
};

/*!
 * @override
 */
WaitFor.prototype.phaserComponentNotFound = function (result, now) {
};

/*!
 * @override
 */
WaitFor.prototype.getProtocolCommand = function (callback) { };

/*!
 * Reschedule the checkPhaser
 */
WaitFor.prototype.reschedule = function (method) {
  var self = this;
  method = method || 'checkComponent';

  setTimeout(function () {
    self[method]();
  }, this.rescheduleInterval);
};

WaitFor.prototype.complete = function () {
  var args = Array.prototype.slice.call(arguments, 0);
  args.push(this);
  this.cb.apply(this.client.api, args);
  this.emit('complete');
  return this;
};

WaitFor.prototype.pass = function (result, defaultMsg, timeMs) {
  this.message = this.formatMessage(defaultMsg, timeMs);
  this.client.assertion(true, null, null, this.message, this.abortOnFailure);
  return this.complete(result);
};

WaitFor.prototype.fail = function (result, actual, expected, defaultMsg, timeMs) {
  this.message = this.formatMessage(defaultMsg, timeMs);
  this.client.assertion(false, actual, expected, this.message, this.abortOnFailure, this._stackTrace);
  return this.complete(result);
};

WaitFor.prototype.checkComponent = function () {
  var self = this;
  this.getProtocolCommand(function (result) {
    var now = new Date().getTime();
    if (result.value) {
      return self.phaserComponentFound(result, now);
    }
    return self.phaserComponentNotFound(result, now);
  });
};

/**
 * @param {string} defaultMsg
 * @param {number} [timeMs]
 * @returns {string}
 */
WaitFor.prototype.formatMessage = function (defaultMsg, timeMs) {
  if (this.selector) {
    return Utils.format(this.message || defaultMsg, this.selector, timeMs || this.ms);
  } else {
    return Utils.format(this.message || defaultMsg, timeMs || this.ms);
  }
};

/**
 * Set the time in milliseconds to wait for the condition, accepting a given value or a globally defined default
 *
 * @param {number} [timeoutMs]
 * @throws Will throw an error if the global default is undefined or a non-number
 * @returns {number}
 */
WaitFor.prototype.setMilliseconds = function (timeoutMs) {
  if (timeoutMs && typeof timeoutMs === 'number') {
    return timeoutMs;
  }

  console.log('globals :: ', this.client.api.globals);
  var globalTimeout = this.client.api.globals.waitForConditionTimeout;
  if (typeof globalTimeout !== 'number') {
    throw new Error('waitFor expects second parameter to have a global default ' +
      '(waitForConditionTimeout) to be specified if not passed as the second parameter ');
  }

  return globalTimeout;
};

module.exports = WaitFor;



