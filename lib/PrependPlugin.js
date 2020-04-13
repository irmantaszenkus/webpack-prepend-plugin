/*
    MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

const fs = require("fs");
const validateOptions = require("schema-utils");
const { ConcatSource } = require("webpack-sources");
const ModuleFilenameHelpers = require("webpack/lib/ModuleFilenameHelpers");

const schema = require("../schemas/PrependPlugin.json");

class PrependPlugin {
    /**
     * @param {PrependPluginArgument} options options object
     */
    constructor(options) {
        if (typeof options === "string") {
            options = {
                filePath: options,
                entryOnly: true
            };
        }

        validateOptions(schema, options, {
            name: "Prepend Plugin",
            baseDataPath: "options"
        });

        this.options = options;
    }

    /**
     * @param {Compiler} compiler webpack compiler
     * @returns {void}
     */
    apply(compiler) {
        const options = this.options;
        const prependText = fs.readFileSync(this.options.filePath, 'utf8');
        const matchObject = ModuleFilenameHelpers.matchObject.bind(
            undefined,
            options
        );

        compiler.hooks.compilation.tap("PrependPlugin", compilation => {
            compilation.hooks.optimizeChunkAssets.tap("PrependPlugin", chunks => {
                for (const chunk of chunks) {
                    if (options.entryOnly && !chunk.canBeInitial()) {
                        continue;
                    }

                    for (const file of chunk.files) {
                        if (!matchObject(file)) {
                            continue;
                        }

                        compilation.updateAsset(
                            file,
                            old => new ConcatSource(prependText, "\n", old)
                        );
                    }
                }
            });
        });
    }
}

module.exports = PrependPlugin;
