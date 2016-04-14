exports.command = function(callback) {
  var self = this;

  this.execute(
    function() { // execute application specific code
      var e2e = window.Phaser.GAMES[0].e2e;
      var player = e2e.player;
      player.explosion();
    },

    [], // arguments array to be passed

    function() {
      if (callback) {
        callback.call(self);
      }
    }
  );

  return this; // allows the command to be chained.
};
