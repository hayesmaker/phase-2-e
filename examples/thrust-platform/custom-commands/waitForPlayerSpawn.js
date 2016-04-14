var util = require('util');
var WaitFor = require('../../../lib/custom-commands/_waitFor');

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
 * @method WaitForPlayerSpawn
 * @api commands
 */
function WaitForPlayerSpawn() {
  WaitFor.call(this);
  this.expectedValue = 'found';
}

util.inherits(WaitForPlayerSpawn, WaitFor);

WaitForPlayerSpawn.prototype.phaserComponentFound = function(result, now) {
  var defaultMsg = 'Player spawned OK after %d milliseconds.';
  return this.pass(result, defaultMsg, now - this.startTimer);
};

WaitForPlayerSpawn.prototype.phaserComponentNotFound = function(result, now) {
  if (now - this.startTimer < this.ms) {
    // element wasn't found, schedule another check
    this.reschedule();
    return this;
  }

  var defaultMsg = 'Timed out while waiting for Player to spawn for %d milliseconds.';
  return this.fail({value:false}, 'not found', this.expectedValue, defaultMsg, now - this.startTimer);
};

/**
 * Checks that e2e module is available, and calls the callback if it is.
 *
 * @method getProtocolCommand
 * @param callback
 * @returns {*}
 */
WaitForPlayerSpawn.prototype.getProtocolCommand = function (callback) {
  var self = this;
  return this.protocol.execute(
    function () {
      var currentState = window.Phaser.GAMES[0].state.current;
      var playState = window.Phaser.GAMES[0].state.states[currentState];
      return playState.inPlay === true;
    },
    [],
    function (result) {
      callback.call(self, result);
    });
};


module.exports = WaitForPlayerSpawn;
