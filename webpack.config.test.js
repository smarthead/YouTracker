const path = require('path');
const glob = require('glob');
const base = require('./webpack.base');

const srcPath = path.resolve(__dirname, 'src');
const testPath = path.resolve(__dirname, 'test');

const files = glob.sync('./test/**/*.js');

module.exports = files.map(file => {
    const relativeFilePath = path.relative(testPath, file);
    const filePath = path.resolve(__dirname, 'build-test', relativeFilePath);
    
    return {
        mode: 'none',
        entry: file,
        output: {
            path: path.dirname(filePath),
            filename: path.basename(filePath)
        },
        resolve: {
            alias: {
                '~': srcPath
            }
        },
        ...base
    }
});
