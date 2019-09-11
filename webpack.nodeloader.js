const path = require('path');

module.exports = function(content) {
    this.addDependency(this.resourcePath);

    const relativePath = path.relative(__dirname, this.resourcePath);

    return (`
        const path = require('path');
        const { app } = require('electron');
        const filePath = path.resolve(app.getAppPath(), '${relativePath}');
        try {
            global.process.dlopen(module, filePath);
        } catch (e) {
            throw new Error('Cannot open ' + filePath + ': ' + e);
        }
    `);
};

module.exports.raw = true;
