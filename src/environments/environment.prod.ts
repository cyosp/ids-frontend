function valueOrDefault(value, defaultValue): any {
  return value === undefined ? defaultValue : value;
}

export const environment = {
  production: true,
  sharingTitle: valueOrDefault(window["env"]["sharingTitle"], "Ids"),
  backEndLocation: valueOrDefault(window["env"]["backEndLocation"], "http://localhost:8080"),
  directoryReversedOrder: valueOrDefault(window["env"]["directoryReversedOrder"], true),
  previewDirectoryReversedOrder: valueOrDefault(window["env"]["previewDirectoryReversedOrder"], false),
  mixDirectoriesAndImages: valueOrDefault(window["env"]["mixDirectoriesAndImages"], false),
  isPublicSharing: valueOrDefault(window["env"]["isPublicSharing"], false),
  removeDirectoryPrefix: valueOrDefault(window["env"]["removeDirectoryPrefix"], undefined),
  addTakenDateOnThumbnails: valueOrDefault(window["env"]["addTakenDateOnThumbnails"], false)
};
