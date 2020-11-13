# liberty-chart-expo-demo
A cross-platform infinite 2D scrollable view with efficient cell recycling using Animated framework, without using a scroll view. See [Liberty Chart](https://github.com/diatche/liberty-chart).

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

If you clone `liberty-chart` into the same parent folder as `liberty-chart-expo-demo`, then you can run the following command to automatically apply local changes made to `liberty-chart` on the fly:

```bash
yarn run watch:liberty-chart
```


If you clone `evergrid` into the same parent folder as `liberty-chart-expo-demo`, then you can run the following command to automatically apply local changes made to `evergrid` on the fly:

```bash
yarn run watch:evergrid
```

The above is only necessary if you want to test native builds. For web builds, using `yarn link liberty-chart` and `yarn link evergrid` is preferrable.
