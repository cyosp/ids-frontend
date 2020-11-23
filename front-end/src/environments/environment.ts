// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  backEndLocation: 'http://localhost:8080',

  // When true directories are displayed in reversed order
  // Example: 2020, 2019, 2018...
  directoryReversedOrder: true,
  // When true and a directory doesn't contain an image,
  // directories are explored in reversed order to select preview image
  previewDirectoryReversedOrder: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
