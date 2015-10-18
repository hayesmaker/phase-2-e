module.exports = {

  before: function(browser){
    browser.resizeWindow(640, 480);
  },

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
      .waitForState('play', 5000)
      .assert.currentState('play');
  },

  'E2E Actors are avaialable to test' : function (client) {
    client
      .waitForActors(5000);
  },

  // These commands are specific to the thrust-engine example, and show
  // how one can control the player from an e2e test.
  // There are currently no assertions, just demoing the capabilities of the tests.
  'Demo Player Control from Tests': function (client) {
    client
      .hijackPlayerControls()
      .pause(2000)
      .playerThrust(10000)
      .pause(1500)
      .playerRotate(100)
      .playerRotate(100)
      .playerRotate(100)
      .playerRotate(100)
      .playerRotate(100)
      .playerZeroRotation()
      .playerThrust(20000)
      .pause(1000)
      .playerThrust(1000)
      .pause(1000)
      .playerThrust(10000)
      .pause(3000)
      .playerThrust(10000)
      .pause(1000)
      .playerRotate(-100)
      .playerRotate(-100)
      .playerRotate(-100)
      .playerRotate(-100)
      .playerRotate(-100)
      .playerRotate(-100)
      .playerRotate(-100)
      .playerRotate(-100)
      .playerRotate(-100)
      .playerRotate(-100)
      .playerZeroRotation()
      .pause(1000)
      .playerThrust(20000)
      .pause(5000)
      .playerThrust(10000)
      .assert.playerIsDead()
      .end();
  }
};
