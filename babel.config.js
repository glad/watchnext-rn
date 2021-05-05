module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',

    ['module:react-native-dotenv', {
      'moduleName': '@env',
      'path': '.env',
      'blacklist': null,
      'whitelist': null,
      'safe': false,
      'allowUndefined': true
    }],

    ['module-resolver', {
      root: ['.'],
      extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
      alias: {
        '@watchnext-app': './src/app',
        '@watchnext-data': './src/data',
        '@watchnext-domain': './src/domain',
      },
    }],
  ],
}
