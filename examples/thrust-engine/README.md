# Install:

- You must install the npm dependencies (this will install nightwatch in the project)
- You must install nightwatch and selenium standalone globallly and selenium standalone requires a further install.

`npm install`
`npm install -g nightwatch`
`npm install -g selenium-standalone`

`selenium-standalone install`

# Run Tests locally
- Ensure selenium server is running
`selenium-standalone start`

- Ensure app server is running
`npm start`

- Go to nightwatch folder and run tests
`cd test/e2e/nightwatch`
`nightwatch`

# Run Tests in browsertack
- Coming Soon
