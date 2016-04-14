var util = require('util');
var events = require('events');

/**
 * Rotates the player ship at a fixed speed, for duration ms then stop rotating
 * and continue the tests.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.playerThrust(100, 500);
 * };
 * ```
 *
 * @method pause
 * @param {number} force
 * @param {number} ms The number of milliseconds to thrust for.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */

function PlayerThrust() {
  events.EventEmitter.call(this);
}

util.inherits(PlayerThrust, events.EventEmitter);


PlayerThrust.prototype.command = function(speed, ms, cb) {
  var self = this;
  var frameInterval;

  console.log('playerThrust(', speed,  ms, ')');

  // If we don't pass the milliseconds, and speed, the client will
  // be suspended indefinitely
  if (!ms || !speed) {
    return this;
  }

  this.api.executeAsync(function(speed, ms, done) {
    var fps = window.Phaser.GAMES[0].time.fps;
    var e2e = window.Phaser.GAMES[0].e2e;
    var player = e2e.player;

    frameInterval = setInterval(function() {
      player.body.thrust(speed);
    }, 1000 / fps);

    setTimeout(function() {
      //player.body.setZeroRotation();
      clearInterval(frameInterval);
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

module.exports = PlayerThrust;