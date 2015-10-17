# phase-2-e
End to End testing framework for Phaser.  Backed by Nightwatch.

Until now, e2e tests have mostly been the domain of RIA developers, websites and enterprise level applications.
Absolutely no one is e2e testing Canvas based HTML5 games, beyond some rudimentary screenshot checking.

Nightwatch is probably the simplest, most flexible and powerful HTML e2e framework currently available... And it's
pre-packed with many DOM specific commands and assertions which you can use in your HTML websites and applications. 

But if you're currently using Phaser to write your HTML5 games, then congratulations, you can now use this set of 
Nightwatch custom assertion and commands, designed specifically for use with Phaser.

#### Things you should know:

- You'll currently get the most benefit from these e2e tests:
    - Your game menus or gameplay is UI heavy - these are perfect areas for e2e testing. 
    - if your game is using Phaser.StateManager to manage the various states of your game.
    - Your game has complicated booting consisting of loading configs, externalised assets, and/or connections to 
    servers or databases.
    - If your game has well written loosley coupled modules
    - If you're building your game with browserify.  
    
    
#### Drawbacks

    - Some things this framework cannot test easily.
    - Eg: Fully testing gameply.  Whilst this could be achieved with some well exposed API of your game actors, and some
     very complicated tests... it's probably too much to expect a e2e framework to test all gameplay in a game.
    - Any part of your game which needs to be used by thests must be avaiable globally. 
        - If you're using browserify it will allow you to take advantage of an 
        e2e module, this module will expose to the tests the modules of 
        your game which you need exposed to the website's `window` object for manipulation by the tests.
        - If you're not using browserify, an alternative method of gaining access to your game's modules will need to be 
        found.  One way could be to append any modules your tests need access to to your Phaser.Game instance:

        ```
        game.e2e = {
        player: player
        }
        ```
   


### Installation

#### If you don't have Nightwatch.js installed.

cd to your phaser project and
`npm install -g nightwatch`



#### If you already installed Nightwatch.js

cd to your phaser project and
`npm install phase-2-e --save-dev`

- Copy ```nightwatch``` to your e2e test folder
 * ```test/e2e/nightwatch```
 
- Update `nightwatch.json` or whatever nightwatch config you have


### Ensure selenium standalone is installed and running.

- Using npm selenium-standalone

`npm install selenium-standalone@latest -g`
`selenium-standalone install`
`selenium-standalone start`

- Using java -jar

### Running

- If you haven't already, create a ```nightwatch.json``` config file inside your nightwatch folder (you may create 
multiple configs for testing in different environments), eg. In Browserstack.

- ensure custom-assertions, and custom-commands folder's are set in each config file

- create a test folder and run tests via command:

- Run `nighwatch` from folder with nightwatch.json or `nightwach -c path/to/config.json`


### Extending

- Browse the custom-assertions and custom-commands folders for examples of command and assertions if you'd like to create
your own.

- If you think they'd be useful in other phaser projects, feel free to submit them here. (as Pull Request)

- Please test assertions or commands that you want to submit.

- For more info on extending nightwatch, see: http://nightwatchjs.org/guide#extending




