# Apple Settings plugin

> This proof-of-concept has been published as [`@config-plugins/apple-settings`](https://github.com/expo/config-plugins/tree/main/packages/apple-settings)

An Expo Config Plugin that generates additional UI for the Settings page of your app in iOS Settings.

> This is highly experimental and not part of any official Expo workflow.

<img width="499" alt="Screenshot 2023-07-31 at 6 38 21 PM" src="https://github.com/EvanBacon/Apple-Settings-Expo-Config-Plugin/assets/9664363/3bd15c5b-8444-4067-884c-2904a2c8ade1">

## 🚀 How to use

- Modify the `Settings.bundle/Root.plist` via the plugin in the `settings-plugin/index.ts` file.
- Run `yarn nprebuild` to generate the Xcode project (this doesn't use React Native for speed purposes).

## Xcode parsing

This plugin makes use of my proprietary Xcode parsing library, [`@bacons/xcode`](https://github.com/evanbacon/xcparse). It's mostly typed, very untested, and possibly full of bugs––however, it's still 10x nicer than the alternative.
