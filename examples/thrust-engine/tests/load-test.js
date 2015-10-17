module.exports = {
  'Phaser Game Boots Test' : function (client) {

    var thrustEngine = client.page.thrustEngine();
    thrustEngine.navigate()
      .waitForElementVisible('body', 1000)
      .assert.title('Thrust Engine')
  },

  'Phaser Game Loads Test': function (client) {
    client
      .waitForPhaser(3000)
      .waitForGame(3000)
      .waitForState('play', 5000);

    client.end();
  }
};
