# w-type

A simple r-type clone in PIXI.js.

https://play.google.com/store/apps/details?id=com.sydneywebdev.wtype

Sorry, its a bit of a mess atm. Clean up in progress.

## Build

`npm run build-dev`

## Android

### Build Dev

`npm run build-cordova`

`cd cordova`

`npm run build-apk`

### Build Prod

Create `cordova/build.json` file as per https://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-build-command

`cordova build android --release -- --buildConfig=build.json`

Convience method for reinstalling build:

`npm run reinstall-apk`

## Libraries

Pixi.js — A 2D JavaScript Renderer

https://github.com/GoodBoyDigital/pixi.js/

tween.js

https://github.com/sole/tween.js

Misaki

Awesome little bitmap font including kana and kanji.

http://www.geocities.jp/littlimi/misaki.htm
