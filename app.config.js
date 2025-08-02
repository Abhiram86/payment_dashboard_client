import "dotenv/config";

export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    scheme: "client",
    extra: {
      BASE_URL: process.env.BASE_URL,
    },
  },
});
