// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://api.themoviedb.org/3/',
  searchMoviesEndpoint: 'search/multi',
  apiKey: '1c5abaaeaa13c66b570ad3042a0d51f4',
  apiLanguage: 'en-US',
  imgAbsolutePath: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
