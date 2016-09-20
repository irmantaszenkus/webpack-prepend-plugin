# webpack-prepend-plugin

Prepends file`s contents to each entry chunk. Used for prepending javascript error tracking code so it would be initialized as early as possible.

## Usage

Install via npm:

```shell
npm install prepend-webpack-plugin
```
And then require and provide to webpack:

```javascript
// in webpack.config.js or similar
var PrependPlugin = require('prepend-webpack-plugin');

module.exports = {
  // your config values here
  plugins: [
    new PrependPlugin({
      filePath: require.resolve('trackjs')
    })
  ]
};
```

### Options

#### `filePath`

Path of file to prepend
