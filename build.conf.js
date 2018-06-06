/**
 *  This file contains all of the user settings for the gulp build process
 */
module.exports = {
    srcJs: ["src/**/*js"],
    buildFolder: "dist",
    buildJsFilename: "maxotek-bower-package-manager.js",
    banner: "/*!\n" +
        " * See LICENSE in this repository for license information\n" +
        " */\n",
    closureStart: "(function(){\n",
    closureEnd: "\n})();"
};