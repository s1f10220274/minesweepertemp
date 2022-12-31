module.exports = {
  // 本番にデプロイするときはモード値を production に設定
  // development に設定すると元のファイルとの関連性がわかるソースマップと一緒に出力される
  mode: 'development',

  // 環境によってはsrc/index.ts
  entry: 'pages/index.tsx',

  module: {
    rules: [
      {
        test: /\.tsx$/, // 環境によっては/\.ts$/
        use: 'ts-loader', // TypeScript用のloader
      },
    ],
  },
  resolve: {
    // React × TypeScriptで使う可能性のある拡張子を全て記述
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
}
