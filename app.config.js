require("ts-node/register");

module.exports = ({ config }) => ({
  ...config,
  plugins: [require("./settings-plugin").withSettingsBundle],
});
