# Apple Settings plugin

An Expo Config Plugin that generates additional UI for the Settings page of your app in iOS Settings.

> This is highly experimental and not part of any official Expo workflow.

## 🚀 How to use

- Modify the `Settings.bundle/Root.plist` via the plugin in the `settings-plugin/index.ts` file.
- Run `yarn nprebuild` to generate the Xcode project (this doesn't use React Native for speed purposes).

## Xcode parsing

This plugin makes use of my proprietary Xcode parsing library, [`@bacons/xcode`](https://github.com/evanbacon/xcparse). It's mostly typed, very untested, and possibly full of bugs––however, it's still 10x nicer than the alternative.
