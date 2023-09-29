# Dishzero

## Running tests
As of right now, only the frontend has tests setup. Follow these steps to run the tests:

1. Install dependencies `cd app && npm install`
2. To run all the tests, `npm run test`
3. To run a single test and re-run it as you work, `npm run test TESTNAME -- --watch`

For example, if you are making changes to `AuthContext.tsx`, you can run `npm run test AuthContext -- --watch`. As you make changes to the source code, the tests will rerun.