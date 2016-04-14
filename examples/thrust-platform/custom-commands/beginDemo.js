exports.command = function(callback) {
  var self = this;

  this.execute(
    function() {
    // execute application specific code
      var game = window.Phaser.GAMES[0];
      console.log('game', game);
      game.e2e.controlOverride = true;
      console.log('controlOverride', game.e2e);
      game.e2e.boot.startLoad();
      console.log('boot :: starLoad');
      return true;
    },
    // arguments array to be passed
    [],

    function(result) {
      if (callback) {
        callback.call(self, result.value);
      }
    }
  );

  return this; // allows the command to be chained.
};
