module.exports = {
  /**
   * things to do before your tests start.
   * In this case, I'm resizing the browser window, so I can see the test output
   * and the game running on the same tiny laptop screen.
   *
   * method before
   * @param browser
   */
  before: function(browser){
    browser.resizeWindow(640, 480);
  },

  /**
   * Tests your game's webpage can be served
   * When this fails, it usually means your webserver's not up.
   * Or you forgot to `npm start`
   *
   * @test
   * @param client
   */
  'Phaser Game Boots Test' : function (client) {

    var thrustEngine = client.page.thrustEngine();
    thrustEngine.navigate()
      .waitForElementVisible('body', 1000)
      .assert.title('Thrust Engine')
  },

  /**
   * Tests that Phaser, and your Phaser.Game instance can be loaded ok,
   * and that the expected state is reached by Phaser.StateManager
   *
   * @test
   * @param client
   */
  'Phaser Game Loads Test': function (client) {
    client
      .waitForPhaser(3000)
      .waitForGame(3000)
      .waitForState('play', 5000)
      .assert.currentState('play');
  },

  /**
   * Waits for the game's actors to be available on the Phaser.Game.Instance
   * You may need to customize the waitForActors custom command depending on how you're giving access
   * to your own game's actors.
   *
   * @test
   * @param client
   */
  'E2E Actors are avaialable to test' : function (client) {
    client
      .waitForActors(5000);
  },


  /**
   *  Most of these commands are specific to the thrust-engine example, and show
   // how one can control the player from an e2e test.
   // There are currently no assertions, just demoing the capabilities of the tests.
   // The commands called here must interface with your game's components.
   // hijackPlayerControls prevents the player.body.setZeroRotation from being called in the game
   // allowing rotation when there's no user input.
   * @test
   * @param client
   */
  'Demo Player Control from Tests': function (client) {
    client
      .beginDemo()
      .pause(2300)
      .playerThrust(400, 1100)
      .pause(1000)
      .playerRotate(100, 150)
      .pause(500)
      .playerThrust(400, 600)
      .pause(1000)
      .playerThrust(400, 600)
      .pause(2000)
      .playerRotate(-100, 250)
      .pause(500)
      .playerThrust(400, 1000)
      .pause(10000)
      //.playerThrust(400, 1000)
      .assert.playerIsDead()
      .end();
  }
};
