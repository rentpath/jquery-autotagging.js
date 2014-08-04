Rentpath Autotagging Plugin
___________________________
#jquery-autotagging
Client-side interface for Rentpath warehouse

# Setup

1. `bundle install`
2. `bower install`
3. `coffee -cwo . src`

# Tests
`rake jasmine`

We used to use `foreman start` to run the test suite and handle CoffeeScript compilation, but all the tests fail when we use foreman.

# Upgrading
`WH#bindBodyClicked()` was removed. I don't think any client code used that method, but I'm mentioning it here, just in case.

When you upgrade to version 2 of this library, remove it from the `paths` section of your RequireJS configuration file and add it to the `packages` section.
