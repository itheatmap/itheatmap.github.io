module.exports = {
    context: __dirname,
    entry: {
        app: "./src/app",
    },

    output: {
        path: __dirname + "/docs/js",
        filename: "[name].js"
    },

    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },

    resolve: {
        extensions: [".ts"]
    },

    plugins: []
};