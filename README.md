# project-sfcc-playwright
Project with QA Automation in Salesforce Commerce

## Steps to create project with QA Automation:
1. Create a project to use typescript and execution tests in salesforce cloud project, on github
2. Clone this project in PC
3. Install the playwright dependencies with command ~ `npm init playwright@latest`
   - Select `typescript`
   - Select `tests` location tests
   - Select `no` to use GitHub Actions
   - Select `yes` Playwright browsers: chromium, firefox and webkit

## Tools used:
- Project Salesforce Commerce Cloud: https://production.sitegenesis.dw.demandware.net/s/RefArch/home?lang=en_US
- Typescript
- Playwright
- Visual Studio Code

## Execute tests in different browsers
- Chromium
- Firefox
- Webkit

## How to execute tests
1. Create your tests in the folder `tests`
2. Execute your tests with the command ~ `npx playwright test` or execute in tool Visual Studio Code with Playwright Test Runner.

## How to execute tests in a specific browser
- Execute your tests with the command ~ `npx playwright test --project=firefox`

## How to execute tests in headed mode
- Execute your tests with the command ~ `npx playwright test --headed`

## How to execute tests in debug mode
- Execute your tests with the command ~ `npx playwright test --debug`

## How to execute a specific test file
- Execute your tests with the command ~ `npx playwright test tests/example.spec.ts`