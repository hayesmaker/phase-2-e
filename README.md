## phase-2-e
Custom Nightwatch extenstion for end to end testing CANVAS based HTML5 games written with Phaser.  
Backed by Nightwatch and Selenium.
- http://phaser.io/ 
- http://nightwatchjs.org/ 
- http://www.seleniumhq.org/

Add automation with TravisCI and Browserstack
- https://travis-ci.org/hayesmaker/thrust-platform
- http://browserstack.com/automate

Until now, e2e tests have mostly been the domain of RIA developers, websites and enterprise level applications, 
Absolutely no one is e2e testing Canvas based HTML5 games, beyond some rudimentary screenshot checking. Phase-2-e aims to 
change this state of affairs.

Nightwatch is probably the simplest, most flexible and powerful HTML e2e framework currently available... And it's
pre-packed with many DOM specific commands and assertions which you can use in your HTML websites and applications. 
But how do you use a DOM specific API to test in CANVAS components and game scenarios?  Well the answer is you can't, so
 these Phaser specific custom commands and assertions for Nightwatch have been written to help you join the cutting edge
 of Phaser game developers who are starting to realise the potential of e2e testing in games.

If you're currently using Phaser to write your HTML5 games, then you're in luck, you can use this set of 
Nightwatch custom assertion and commands, designed specifically for use with testing Phaser E2E!.

#### Getting the most out of E2E

You'll currently get the most benefit from these e2e tests IF:

- Your game menus or gameplay is UI heavy - these are perfect areas for e2e testing. 
- Your UI elements (buttons etc) follow a common interface to be used by our custom commands. 
(If they don't you may create your own commands which can work with your UI components)
- Your game is using Phaser.StateManager to manage the various states of your game.
- Your game has complicated booting consisting of loading configs, externalised assets, and/or connections to servers or databases
- Your game has well written loosley coupled modules
- You're building your game with modules. (see Drawbacks).
- You merely want to smoke test that your app starts, and want the ability to automate this on many platforms and browsers.
        
#### Drawbacks and how to overcome them.

Some things e2e tests frameworks cannot test easily.

- Fully testing gameplay.  Whilst this could be achieved with some well exposed API of game actors, and some
 very complicated tests... it's probably expecting too much to expect your e2e framework to test all gameplay in an arcade game. However it is possible, and in the 
 `examples/thrust-engine` test suite, you can see how these kind of tests could be achieved.
- Oher types of games, turn based games, card games, strategy games, Casino Games aren't so problematic.  And lend themselves
very well to this type of testing.
- Globals: Any part of your game which needs to be used by your e2e tests must be avaiable globally (available on `window`) This 
 is because the tests use the Selenium Protocol API to interact with objects in your game.  If you don't want your game
 objects to be global in your production version, you'll need a specific build of your game for your tests to use.  
 (see *E2E / Production Builds*)
- You must use modules. If you aren't already writing your JS as modules, please start doing so, or give up JS :troll-face: You can 
 read about it here: http://addyosmani.com/writing-modular-js/
- Your UI elements should follow a common interface to facilitate nightwatch commands execute your UI in a generic way. More about this later.

### E2E / Production Builds
- If you don't want global access to ingame modules in your production build, then you  can use a NODE_ENV flag in your code to let the 
compiler know you want an E2E or PRODUCTION build of your game.
- If you're using browserify it will allow you to take advantage of an e2e module, this module will expose to the tests the modules of 
your game which you need exposed to the website's `window` object for manipulation by the tests.  
- If you're not using browserify, an alternative method of gaining access to your game's modules will need to be 
found.  One way could be to append any modules your tests need access to to your Phaser.Game instance:
```
//myPlayer is a reference to one of your game's modules.
game.e2e = {
    player: myPlayer
}
```

### Installation

#### If you don't have Nightwatch.js installed.

- Install Nightwatch: - http://nightwatchjs.org/guide#installation

cd to your phaser project and
`npm install -g nightwatch`

- Follow the steps below

#### If you have already installed Nightwatch.js

cd to your phaser project and
`npm install phase-2-e --save-dev`
 
- Add the `lib/custom-commands` and `lib/custom-assertions` folders to your own nightwatch config, in our example it's the `nightwatch.json` file.


### Ensure selenium standalone is installed and running.

##### Using npm selenium-standalone

- `npm install selenium-standalone@latest -g`
- `selenium-standalone install`
- `selenium-standalone start`

##### Using java -jar
- Download `selenium-server-standalone-{VERSION}.jar`
- `java -jar path/to/selenium-server-standalone-{VERSION}.jar`


### Running

- If you haven't already, create a `nightwatch.json` config file inside your nightwatch folder (you may create 
multiple configs for testing in different environments), eg. In Browserstack.

- ensure custom-assertions, and custom-commands folder's are set in each config file

- create a test folder and run tests via command:

- Run `nightwatch` from folder with `nightwatch.json` or `nightwatch -c path/to/config.json`


### Extending
- Nightwatch has a flexible api for extending, which is how it was possible to write Phase-2-e.

- Browse the custom-assertions and custom-commands folders for examples of command and assertions if you'd like to create
your own.

- If you think they'd be useful in other phaser projects, feel free to submit them here. (as Pull Request)

- Please test assertions or commands that you want to submit.

- For more info on extending nightwatch, see: http://nightwatchjs.org/guide#extending


### Run the examples:
- There is a fully functioning load phaser game test suite which can demo, which you can run by following the steps
in the examples README. https://github.com/hayesmaker/phase-2-e/tree/master/examples/thrust-platform


### Writing Tests
- And now the fun part.. This is how you can write your e2e tests:
- See the thrust-platform example tests to see how custom-commands can be created specifically for a game.

```
module.exports = {
    'Phaser Game Boots Test' : function (client) {
        var thrust = client.page.thrustPlatform();
        thrust.navigate()
          .waitForElementVisible('body', 1000)
      },
  
    'E2E Actors are avaialable to test' : function (client) {
      client
        .waitForActors(10000)
        .beginDemo()
        .waitForState('play', 10000)
        .assert.currentState('play')
        .waitForPlayerSpawn(20000)
    },

    'Tests can even take control of your Player': function (client) {
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
```
> This is an example only, to show how test hooks can be used. 
> Write nightwatch custom-commands using phase-2-e's as a template to test your own game code.

- Watch some fully automated tests in action courtesy of TravisCI & Browserstack:
- https://www.youtube.com/watch?v=foTPMehH_a4
- Passing Build: https://travis-ci.org/hayesmaker/thrust-platform/builds/103173713

> Future:
- More custom-commands to make plugging phase-2-e to ease adding tests to your own phaser project
- Browserstack and Travis integration out of the box. (Currently you can already see a working integration at
https://github.com/hayesmaker/thrust-platform)


