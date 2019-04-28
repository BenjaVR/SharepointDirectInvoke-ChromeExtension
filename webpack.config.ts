import webpack from "webpack";
import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

class ClearConsolePlugin {
    public apply(compiler: webpack.Compiler): void {
        compiler.hooks.watchRun.tap("ClearConsole", () => {
            console.clear();
        });
    }
}

const config: webpack.Configuration = {
    mode: "development",
    entry: {
        background: "./src/background.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin(
            [
                {
                    from: "./src/manifest.json",
                    to: "manifest.json",
                },
            ],
            {
                copyUnmodified: true,
            }
        ),
        new ClearConsolePlugin(),
    ],
    watchOptions: {
        ignored: /node_modules/,
    },
    stats: "verbose",
    devtool: "cheap-module-source-map"
};

export default config;
