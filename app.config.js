require("ts-node/register");

module.exports = ({ config }) => ({
  ...config,
  plugins: [require("./target-plugin").withSettingsBundle],
});
