var util = require('util');
var WaitFor = require('./_waitFor');

/**
 * Waits a given time in milliseconds for Phaser to be present in the page before performing any other commands or assertions.
 *
 * If Phaser fails to be present in the specified amount of time, the test fails. You can change this by setting `abortOnFailure` to `false`.
 *
 * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
 *
 * Similarly, a default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.waitForPhaser(1000);
 *   // continue if failed
 *   browser.waitForPhaser(1000, false);
 *   // with callback
 *   browser.waitForPhaser(1000, function() {
 *     // do something while we're here
 *   });
 *   // many combinations possible - the message is always the last argument
 *   browser.waitForPhaser(1000, false, function() {}, 'Phaser no era presente en %d ms');
 * };
 * ```
 *
 * @method waitForPhaser
 * @param {number} time The number of milliseconds to wait. The runner performs repeated checks every 500 ms.
 * @param {boolean} [abortOnFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @param {string} [message] Optional message to be shown in the output; the message supports a placeholder: %d for the time (e.g. Phaser was not in the page for %d ms).
 * @api commands
 */
function WaitForPhaser() {
  WaitFor.call(this);
  this.expectedValue = 'found';
}

util.inherits(WaitForPhaser, WaitFor);

WaitForPhaser.prototype.phaserComponentFound = function(result, now) {
  var defaultMsg = 'Phaser was present after %d milliseconds.';
  return this.pass(result, defaultMsg, now - this.startTimer);
};

WaitForPhaser.prototype.phaserComponentNotFound = function(result, now) {
  if (now - this.startTimer < this.ms) {
    // element wasn't found, schedule another check
    this.reschedule();
    return this;
  }

  var defaultMsg = 'Timed out while waiting for Phaser to be present for %d milliseconds.';
  return this.fail({value:false}, 'not found', this.expectedValue, defaultMsg, now - this.startTimer);
};

/**
 * This method will be called on each interval and provides an interface
 * to nightwatch selenium protocol commands for executing script on the page
 * This particular command will look for Phaser and make sure it's available on window.
 *
 * @method getProtocolCommand
 * @param callback
 * @returns {*}
 */
WaitForPhaser.prototype.getProtocolCommand = function (callback) {
  var self = this;
  return this.protocol.execute(
    function () {
      return window.Phaser && typeof window.Phaser === 'object';
    },
    [],
    function (result) {
      callback.call(self, result);
    });
};

module.exports = WaitForPhaser;
