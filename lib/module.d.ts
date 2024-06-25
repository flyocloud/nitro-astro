/* eslint-disable  @typescript-eslint/no-explicit-any */
name: Lint Code

on: [push, pull_request]

jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
    - name: Install Dependencies
      run: npm install
    - name: Run ESLint
      run: npx eslint .
declare module "virtual:*" {
  const component: any;
  export default component;
}
