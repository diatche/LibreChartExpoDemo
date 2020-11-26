# librechart-expo-demo
A cross-platform infinite 2D scrollable view with efficient cell recycling using Animated framework, without using a scroll view. See [LibreChart](https://github.com/diatche/librechart).

## Installation

Clone and open a terminal in the root directory. Then:

```bash
yarn
expo start
```

You may need to install Expo CLI:

```bash
npm i -g expo-cli
```

## Development

If you clone `librechart` into the same parent folder as `librechart-expo-demo`, then you can run the following command to automatically apply local changes made to `librechart` on the fly:

```bash
yarn run watch:librechart
```


If you clone `evergrid` into the same parent folder as `librechart-expo-demo`, then you can run the following command to automatically apply local changes made to `evergrid` on the fly:

```bash
yarn run watch:evergrid
```

The above is only necessary if you want to test native builds. For web builds, using `yarn link librechart` and `yarn link evergrid` is preferrable.
