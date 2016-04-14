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
    browser.resizeWindow(800, 600);
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
    var thrustEngine = client.page.thrustPlatform();
    thrustEngine.navigate()
      .waitForElementVisible('body', 1000)
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
      .waitForPhaser(5000)
      .waitForGame(5000)
      .waitForState('boot', 5000)
      .assert.currentState('boot');
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
      .waitForActors(10000)
      .beginDemo()
      .waitForState('play', 10000)
      .assert.currentState('play')
      .waitForPlayerSpawn(20000)
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
      .pause(600)
      .playerThrust(400, 500)
      .pause(1200)
      .playerThrust(400, 750)
      .pause(1500)
      .playerThrust(300, 500)
      .pause(500)
      .playerRotate(100, 200)
      .pause(500)
      .playerThrust(500, 400)
      .pause(3000)
      .end();
  }
};
