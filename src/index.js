"use strict";

var fs = require("fs");
var program = require("commander");
var logger = require("mx-color-logger");
var pkg = require("../package.json");
var path = require("path");

logger.init();

var version = pkg.version;

console.log(JSON.stringify(process.argv, null, "\t"));

program
    .version(version)
    .option("-c, --child <value>", "The root directory where all child modules exist.")
    .option("-p, --parent <value>", "The parent project into which the bower packages must be merged")
    .parse(process.argv);

console.info("Maxotek Bower Package Merger v " + version);

var rootChildDir = program.child;
var parentDir = program.parent;

if (!rootChildDir) {
    console.error("No root directory was specified for the child module");
    program.outputHelp();
    process.exit(-1);
}

if (!parentDir) {
    console.error("No directory was specified for the parent module");
    program.outputHelp();
    process.exit(-1);
}

var rootBowerFile = path.join(parentDir, "bower.json");

var rootBowerObj = JSON.parse(fs.readFileSync(rootBowerFile));
var rootBowerPackages = rootBowerObj.dependencies;
var newPackages = [];

var pluginProjDirectories = fs.readdirSync(rootChildDir);
pluginProjDirectories.forEach(pluginName => {
    console.debug(`Processing plugin: ${pluginName}`);

    var projDir = path.join(rootChildDir, pluginName);

    if (!fs.lstatSync(projDir).isDirectory()) {
        return;
    }

    var bowerFile = path.join(projDir, "bower.json");
    var pluginPackages = JSON.parse(fs.readFileSync(bowerFile)).dependencies;

    Object.keys(pluginPackages).forEach(function (pluginPackage) {
        var childVersion = pluginPackages[pluginPackage];
        var rootVersion = rootBowerPackages[pluginPackage];

        if (!rootVersion) {
            console.info(`New package: ${pluginPackage} -> ${childVersion}`);

            rootBowerPackages[pluginPackage] = childVersion;
            newPackages.push({ name: pluginPackage, childVersion });
        } else {
            if (rootVersion != childVersion)
                throw `Mismatch in Version of Package: ${pluginPackage} of Plugin: ${pluginName}. Old: ${rootVersion}, New: ${childVersion}`;
        }
    });
});

if (newPackages.length) {
    console.info(`Saving ${rootBowerFile}`);
    fs.writeFileSync(rootBowerFile, JSON.stringify(rootBowerObj, null, "\t"));
} else {
    console.info(`Found no changes to save in ${rootBowerFile}`);
}

process.exit(0);