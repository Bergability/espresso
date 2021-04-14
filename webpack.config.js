const HtmlWebpackPlugin = require('html-webpack-plugin');
// const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = [
    {
        mode: 'development',
        entry: './src/index.tsx',
        target: 'electron-renderer',
        devtool: 'source-map',
        watch: true,
        cache: {
            type: 'memory',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            plugins: [new TsconfigPathsPlugin()],
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    include: /src/,
                    use: [{ loader: 'ts-loader' }],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        'style-loader',
                        // Translates CSS into CommonJS
                        'css-loader',
                        // Compiles Sass to CSS
                        'sass-loader',
                    ],
                },
            ],
        },
        output: {
            path: __dirname + '/dist',
            filename: 'app.js',
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
        ],
    },
];
