const presets = [
    [
        "@babel/preset-react"
    ],
    [
        "@babel/env",
        {
            targets: {
                electron: "5"
            }
        },
    ]
];

module.exports = { presets };
