exports.command = function(callback) {
  var self = this;

  this.execute(
    function() { // execute application specific code
      var game = window.Phaser.GAMES[0];
      game.e2e.controlOverride = true;
      return true;
    },

    [], // arguments array to be passed

    function(result) {
      if (callback) {
        callback.call(self, result.value);
      }
    }
  );

  return this; // allows the command to be chained.
};
