const path = require('path');
const base = require('./webpack.base');

const common = {
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js'
    },
    ...base
};

module.exports = [
    {
        target: 'electron-main',
        entry: {
            main: './src/main/main.js'
        },
        ...common
    },
    {
        target: 'electron-renderer',
        entry: {
            renderer: './src/renderer/index.js'
        },
        ...common
    }
];
