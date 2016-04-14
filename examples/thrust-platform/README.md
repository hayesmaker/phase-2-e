# Run Tests locally
- Ensure selenium server is running
`selenium-standalone start`

- Go to thrust-engine folder and run tests
`cd examples/thrust-platform/`
`nightwatch`

(Or run `npm test` from phase-2-e root)


# Run Tests in browsertack
- Note you'll need your own browserstack account to integrate your tests with 
browserstack, I've left my browserstack profiles in the nightwatch.json so you can see an example
how to set them up.