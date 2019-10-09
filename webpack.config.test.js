const path = require('path');
const glob = require('glob');
const base = require('./webpack.base');

const files = glob.sync('./test/**/*.js');

module.exports = files.map(file => {
    const testsPath = path.resolve(__dirname, 'test');
    const relativeFilePath = path.relative(testsPath, file);
    const filePath = path.resolve(__dirname, 'build-test', relativeFilePath);
    
    return {
        mode: 'none',
        entry: file,
        output: {
            path: path.dirname(filePath),
            filename: path.basename(filePath)
        },
        ...base
    }
});
