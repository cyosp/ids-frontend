# IDS / front-end

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

To have a French translation reachable from another local computer run: `ng serve --host 0.0.0.0 --configuration=fr`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

To build app for all locales, use `--localize` option.

### Docker image

Once you have build Angular application, run:

`docker build -t cyosp/ids-frontend:0.0.0 .`

## Run

### Docker container

`docker run -p 4200:80 cyosp/ids-frontend:0.0.0`

Optional environment variables:
 - `--env SHARING_TITLE="My custom sharing title"`
 - `--env BACKEND_LOCATION="http://localhost:8080"`
 - `--env DIRECTORY_REVERSED_ORDER="true"`
 - `--env PREVIEW_DIRECTORY_REVERSED_ORDER="false"`
 - `--env MIX_DIRECTORIES_AND_MEDIAS="false"`
 - `--env IS_PUBLIC_SHARING="false"`
 - `--env REMOVE_DIRECTORY_PREFIX="^[0-9]*\s*-\s*([A-Za-z]*\s*-\s*)?"`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
