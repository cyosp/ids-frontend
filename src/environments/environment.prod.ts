export const environment = {
  production: true,
  backEndLocation: window["env"]["backEndLocation"] || "http://localhost:8080",
  directoryReversedOrder: window["env"]["directoryReversedOrder"] || true,
  previewDirectoryReversedOrder: window["env"]["previewDirectoryReversedOrder"] || false,
  mixDirectoriesAndImages: window["env"]["mixDirectoriesAndImages"] || false
};
