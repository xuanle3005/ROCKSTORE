const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/App.js",
    output: {
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: { // React 17 needed the "runtime": "automatic"
                    presets: ["@babel/preset-env", ["@babel/preset-react", {"runtime": "automatic"}]]
                }
            }
        }, {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.(png|jpe?g|gif)$/i,
            type: "asset/resource"
        }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Rock SCS",
            template: "./src/index.html",
            favicon: "./src/favicon.ico",
            hash: true
        })],
    mode: "development",
    devServer: {
        watchFiles: ["src/**/*.js", "src/**/*.jsx", "src/**/*.css"],
        port: 9000,
        liveReload: true,
        client: {
            progress: true,
            overlay: {errors: true, warnings: false}
        },
        historyApiFallback: true,
        proxy: {
            "/api": "http://localhost:8080",
            "/imgs": "http://localhost:8080"
        }
    },
    optimization: {
        splitChunks: {
          chunks: 'all',
        },
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};