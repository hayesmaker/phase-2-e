var util = require('util');
var events = require('events');

/**
 * Rotates the player ship at a fixed speed, for duration ms then stop rotating
 * and continue the tests.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.playerRotate(100, 500);
 * };
 * ```
 *
 * @method pause
 * @param {number} speed
 * @param {number} ms The number of milliseconds to wait.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */

function PlayerRotate() {
  events.EventEmitter.call(this);
}

util.inherits(PlayerRotate, events.EventEmitter);


PlayerRotate.prototype.command = function(speed, ms, cb) {
  var self = this;

  console.log('playerRotate(', speed,  ms, ')');

  // If we don't pass the milliseconds, and speed, the client will
  // be suspended indefinitely
  if (!ms || !speed) {
    return this;
  }

  this.api.executeAsync(function(speed, ms, done) {
    var e2e = window.Phaser.GAMES[0].e2e;
    var player = e2e.player;
    player.rotate(speed);

    setTimeout(function() {
      player.body.setZeroRotation();
      done();
    }, ms)

  }, [speed, ms], function() {

    if (cb) {
      cb.call(self);
    }

    self.emit('complete');
  });

  return this;
};

module.exports = PlayerRotate;