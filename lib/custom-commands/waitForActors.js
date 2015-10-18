var util = require('util');
var WaitFor = require('./_waitFor');

/**
 * Waits a given time in milliseconds for a the E2E Module Game to be available in the Phaser.Game instance before performing any other commands or assertions.
 *
 * If Game fails to be present in the specified amount of time, the test fails. You can change this by setting `abortOnFailure` to `false`.
 *
 * You can change the polling interval by defining a `waitForConditionPollInterval` property (in milliseconds) in as a global property in your `nightwatch.json` or in your external globals file.
 *
 * Similarly, a default timeout can be specified as a global `waitForConditionTimeout` property (in milliseconds).
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.waitForActors(1000);
 *   // continue if failed
 *   browser.waitForActors(1000, false);
 *   // with callback
 *   browser.waitForActors(1000, function() {
 *     // do something while we're here
 *   });
 *   // many combinations possible - the message is always the last argument
 *   browser.waitForActors(1000, false, function() {}, 'Juego de phaser no era presente en %d ms');
 * };
 * ```
 *
 * @method waitForGame
 * @param {number} time The number of milliseconds to wait. The runner performs repeated checks every 500 ms.
 * @param {boolean} [abortOnFailure] By the default if the element is not found the test will fail. Set this to false if you wish for the test to continue even if the assertion fails. To set this globally you can define a property `abortOnAssertionFailure` in your globals.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @param {string} [message] Optional message to be shown in the output; the message supports a placeholder: %d for the time (e.g. Phaser was not in the page for %d ms).
 * @api commands
 */
function WaitForGame() {
  WaitFor.call(this);
  this.expectedValue = 'found';
}

util.inherits(WaitForGame, WaitFor);

WaitForGame.prototype.phaserComponentFound = function(result, now) {
  var defaultMsg = 'E2E Module was found after %d milliseconds.';
  return this.pass(result, defaultMsg, now - this.startTimer);
};

WaitForGame.prototype.phaserComponentNotFound = function(result, now) {
  if (now - this.startTimer < this.ms) {
    // element wasn't found, schedule another check
    this.reschedule();
    return this;
  }

  var defaultMsg = 'Timed out while waiting for E2E Module for %d milliseconds.';
  return this.fail({value:false}, 'not found', this.expectedValue, defaultMsg, now - this.startTimer);
};

/**
 * Checks that e2e module is available, and calls the callback if it is.
 *
 * @method getProtocolCommand
 * @param callback
 * @returns {*}
 */
WaitForGame.prototype.getProtocolCommand = function (callback) {
  var self = this;
  return this.protocol.execute(
    function () {
      return typeof window.Phaser.GAMES[0].e2e !== 'undefined';
    },
    [],
    function (result) {
      callback.call(self, result);
    });
};


module.exports = WaitForGame;
