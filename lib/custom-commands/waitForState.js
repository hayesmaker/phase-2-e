var util = require('util');
var WaitForSelector = require('./_waitForSelector');

/**
 * Waits a given time in milliseconds for a the Phaser State to be reached before performing any other commands or assertions.
 *
 * If State fails to be present in the specified amount of time, the test fails. You can change this by setting `abortOnFailure` to `false`.
 *
 * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
 *
 * Similarly, a default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.waitForState('preloader', 1000);
 *   // continue if failed
 *   browser.waitForState('preloader', 1000, false);
 *   // with callback
 *   browser.waitForState('preloader', 1000, function() {
 *     // do something while we're here
 *   });
 *   // many combinations possible - the message is always the last argument
 *   browser.waitForState('preloader', 1000, false, function() {}, 'State "%s" de phaser no era presente en %d ms');
 * };
 * ```
 *
 * @method waitForState
 * @param {string} selector - the state id you want to wait for
 * @param {number} time The number of milliseconds to wait. The runner performs repeated checks every 500 ms.
 * @param {boolean} [abortOnFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @param {string} [message] Optional message to be shown in the output; the message supports a placeholder: %d for the time (e.g. Phaser was not in the page for %d ms).
 * @api commands
 */
function WaitForState() {
  WaitForSelector.call(this);
  this.expectedValue = 'reached';
}

util.inherits(WaitForState, WaitForSelector);

WaitForState.prototype.phaserComponentFound = function(result, now) {
  var defaultMsg = 'Phaser StateManager reached state: "%s" after %d milliseconds.';
  return this.pass(result, defaultMsg, now - this.startTimer);
};

WaitForState.prototype.phaserComponentNotFound = function(result, now) {
  if (now - this.startTimer < this.ms) {
    // element wasn't found, schedule another check
    this.reschedule();
    return this;
  }

  var defaultMsg = 'Timed out while waiting for state: "%s" after %d milliseconds.';
  return this.fail({value:false}, 'Not reached', this.expectedValue, defaultMsg, now - this.startTimer);
};

WaitForState.prototype.getProtocolCommand = function (callback) {
  var self = this;
  var desiredState = this.selector;
  return this.protocol.execute(
    function (desiredState) {
      return typeof window.Phaser.GAMES[0].state.current === 'string' && window.Phaser.GAMES[0].state.current.toString() === desiredState;
    },
    [desiredState],
    function (result) {
      callback.call(self, result);
    });
};


module.exports = WaitForState;
