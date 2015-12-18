# v2.1.1
* [deps] Use `browser-detect` rather than `browserdetect`.

[Compare v2.1.0..v2.1.1](https://github.com/RentPath/jquery-autotagging/compare/v2.1.0...v2.1.1)


# v2.1.0
* [breaking change] Remove calls to event.stopPropagation() and
  event.preventDefault(). [#26]
* [feature] Callbacks no longer waiting until the tag is loaded. Reduces
  page load times by at least 100ms. [#26]
* [feature] Fire multiple tags at once. Internally it no longer re-uses
  the same <img> element. [#26]

[Compare v2.0.4..v2.1.0](https://github.com/RentPath/jquery-autotagging/compare/v2.0.4...v2.1.0)
