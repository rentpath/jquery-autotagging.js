jquery-autotagging
_____________________________
client-side interface for RentPath warehouse

# Install

```
npm install
bower install
bundle install
gulp
````

## Building with [gulp](http://gulpjs.com/)

run `gulp -T` for a list of available tasks

`gulp` by itself, will run the default task
- watches and compiles coffee for specs and src
  - `src` files are built to the `./dist/shared` and `./dist/js` directory by default.
- builds your final rjs package at `dist/jquery-autotagging`

## [RequireJS Build + Config](http://requirejs.org/docs/api.html#config)
`./node_modules/requirejs/bin/r.js -o require.build.js optimize=none` - runs automatically with gulp when changes are detected.

- `./dist/require.config.js`
  - used to configure `examples/index.html` and specs, not for use outside of package
  - external dependencies amended to bower.json can be automatically added to the config by running `grunt`
  - internal dependencies must be added manually
- `require.build.js`
  - similar to require.config, but is instead used to build the final bower component
  - external + internal depencies must be manually added

## Versioning
See [gulp-release-tasks](https://www.npmjs.org/package/gulp-release-tasks) for additional release tasks.

## Testing
```
bundle exec rake jasmine
```

# API
| param | name | usage - description |
| ------------- |:-------------:| -----:|
| cg | Content group | Taken from a meta tag in the page, e.g SearchResults, HomePage, etc |
| sg  | Subgroup | Describes a group/widget/area on the page, e.g refinements, frontpageproperty |
| item  | Group | Used for grouping links such as distance links |
| value | Distinct value | Usually the text the user sees such as "10 miles from center" |
| type  | type | Indicates whether the event was a pageview beacon or a click event This can either be "pageview" or "click" |
| cb  | cache buster | cache busting value that will increment once per event |
| sess | session | A unique user identifier for a given session This is joined on a dot with the visit identifier (timestamp) |
| fpc | First party cookie | Just the user identifier from above This is a separate value so as to eliminate back-end string splitting/parsing |
| site  | Domain |  e.g www.apartmentguide.com |
| path  | path | The path of the current page, plus any possible query string parameters |
| title | title | HTML Title of the current page |
| bs  | Browser Size | dimensions of the user's window, e.g 1024x768 |
| sr  | Screen Resolution|  dimensions of the user's entire screen |
| os | Operating System |  The operating system of the user (experimental) |
| browser | browser | The web browser name (experimental) |
| ver | Browser Version | The browser version string (experimental) |
| ref | Referral |The referrer |
| firstVisit | First Visit|A timestamp that will be fired as part of the page-view event when a new session is initiated |
| tu  | truncated | unknown |
| tlc | Total Listing Count | count returned from search |
| spg | All Listing ids| Lisiting ids shown on search result page separated by semicolons |
| lfpos | Total Results | @results.records_per_page * (@results.page_number - 1) |
| lpp | Total Results |@results.records_per_page |
| dpg | Listing id | Listing id shown on detail page |
| hw  | Hardware | (mobile only) the hardware make and model |
| flashValue  | Adobe Flash Version |(mobile only) (Android only) the version of flash on the device |
| city  | city | the city from the search term |
| state | state | the state from the search term |
| zip | zip | the zip from the search term |
| registration| registration | unknown |
| ft  |fired time| unknown |
| site_version | site_version | the version of the site displayed to the user, used when the site dynamically scaled for the device (eg #{domain}_(nano|deca|kilo) |

# Example of a tag (pixel) firing

These requests are logged by BI and used to gather metrics on our users:

[demo - click me](http://wh.consumersource.com/wtd.gif?site=www.qa.apartmentguide.com&site_version=www.qa.apartmentguide.com_kilo&cg=home&path=%2F&ft=4040.750000043772&type=pageview&cb=0&sess=1401052257136.1408034329918&fpc=1401052257136&title=Apartments%20for%20Rent%20-%20Your%20Trusted%20Apartment%20Finder%20Tool%20at%20ApartmentGuide.com&bs=960x679&sr=1101x1713&os=Mac&browser=Chrome&ver=36&ref=&registration=0&person_id=JWDykWnpFFPs4HDP7JPY36w9Xip&ad_sense_channel=1747283222&zutron=%5Bobject%20Object%5D&refinements=%5Bobject%20Object%5D&search_criteria=%5Bobject%20Object%5D&site_optimization=%5Bobject%20Object%5D&listingMediaCache=%5Bobject%20Object%5D&user_id=JWDykWnpFFPs4HDP7JPY36w9Xip)

Some of these keys (like site_version) can be passed in on initialization to override a params default value.

# Warning
`site_version` for ag_sites should always have domain set to microsites.com as requested by BI