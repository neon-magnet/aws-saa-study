// app.json の設定に、Web 公開先のパスを追加する。
// GitHub Pages では https://<ユーザー>.github.io/aws-saa-study/ に置かれるため、
// ビルド時に EXPO_BASE_URL=/aws-saa-study を渡す（ローカル開発では不要）。
module.exports = ({ config }) => {
  const baseUrl = process.env.EXPO_BASE_URL;
  if (!baseUrl) return config;
  return {
    ...config,
    experiments: { ...config.experiments, baseUrl },
  };
};
