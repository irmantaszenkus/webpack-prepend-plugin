"use strict";
var ConcatSource = require('webpack-sources/lib/ConcatSource');
var fs = require('fs');

class PrependPlugin {
    constructor(args) {
        if (typeof args !== 'object') {
            throw new TypeError('Argument "args" must be an object.');
        }

        this.filePath = args.hasOwnProperty('filePath') ? args.filePath : null;
    }

    apply(compiler) {
        const prependFile = (compilation, fileName) =>
            compilation.assets[fileName] = new ConcatSource(
                fs.readFileSync(this.filePath, 'utf8'),
                compilation.assets[fileName]
            );

        const wrapChunks = (compilation, chunks) =>
            chunks.forEach(chunk => {
                if (chunk.entry) {
                    chunk.files.forEach(fileName => prependFile(compilation, fileName))
                }
            });

        if (this.filePath) {
            compiler.plugin('compilation', compilation =>
                compilation.plugin('optimize-chunk-assets', (chunks, done) => {
                    wrapChunks(compilation, chunks);
                    done();
                })
            );
        }
    }
}

module.exports = PrependPlugin;
