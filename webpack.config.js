const path = require('path');

module.exports = {
    mode: 'development',
    target: 'node', // VS Code extensions run in a Node.js-context 
    entry: {
        extension: './src/extension.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs',
        devtoolModuleFilenameTemplate: '../../[resource-path]'
    },
    devtool: 'nosources-source-map',
    externals: {
        'vscode': 'commonjs vscode' // Ignored because it's provided by the VS Code host
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    }
};
