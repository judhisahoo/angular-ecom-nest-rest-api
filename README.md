# AngularEcomNest

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

```sh
npm install -g @angular/cli

ng new my-app --style=scss

ng new my-app --style=scss

ng g c layouts/public-layout

ng g c layouts/authenticated-layout

ng g c shared/header

ng g c shared/footer
```

#### to Styling with Tailwind CSS follow bellow link

[Link for Tailwind Setup for Angular](https://tailwindcss.com/docs/installation/framework-guides/angular)

##### setup routing

```sh
ng g module app-routing --flat --module=app
```

### Create the Guard and Components

4. Create the Guard and Components
   The code above references several components and a guard that don't exist yet. You need to create them using the Angular CLI.

### Generate the AuthGuard:

```sh
ng g guard auth

ng g s auth
```

When prompted, select "CanActivate" as the interface to implement. This will create a file at src/app/auth/auth.guard.ts.

#### Generate the Layout Components:

```sh
ng g c layouts/public-layout

ng g c layouts/authenticated-layout
```

#### Generate your Page Components:

```sh
ng g c pages/home-page

ng g c auth/login

ng g c pages/contact

ng g c user/profile

ng g c products/add-product

ng g c user/my-account
```

### install axios

```sh
 npm install axios
 npm install zod
```

#### install NgRx

```sh
npm install @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools
```

#### now time for install jest

```sh
npm install --save-dev jest jest-preset-angular @types/jest @angular-builders/jest --legacy-peer-deps

npm install @angular/ssr

npm install --save-dev @angular/platform-browser-dynamic @angular/testing --legacy-peer-deps
npm install --save-dev @angular/core @angular/common @angular/platform-browser --legacy-peer-deps

Remove or rename your setup-jest.ts file if exisats and update your Jest configuration:
jest.config.js:

module.exports = {
  preset: 'jest-preset-angular',
  // Remove or comment out the setupFilesAfterEnv line
  // setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text-summary', 'lcov'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular',
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};

update the tsconfig.json file as bllow

{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    // ... your other options
  }
}

update tsconfig.spec.json:

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "jest",
      "node"
    ],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```
