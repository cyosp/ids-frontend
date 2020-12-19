// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  backEndLocation: window["env"]["backEndLocation"] || "http://localhost:8080",

  // When true directories are displayed in reversed order
  // Example: 2020, 2019, 2018...
  directoryReversedOrder: window["env"]["directoryReversedOrder"] || true,
  // When true and a directory doesn't contain an image,
  // directories are explored in reversed order to select preview image
  previewDirectoryReversedOrder: window["env"]["previewDirectoryReversedOrder"] || false,
  // When true, images which are at the same level as directories are displayed
  mixDirectoriesAndImages: window["env"]["mixDirectoriesAndImages"] || false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
