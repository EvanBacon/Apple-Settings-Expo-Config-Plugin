require("ts-node/register");

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    [
      require("./settings-plugin/static").default,
      {
        Root: {
          page: {
            PreferenceSpecifiers: [
              { Type: "PSGroupSpecifier", Title: "Group" },
              {
                Type: "PSTextFieldSpecifier",
                Title: "Name",
                Key: "name_preference",
                DefaultValue: "",
                IsSecure: false,
                KeyboardType: "Alphabet",
                AutocapitalizationType: "None",
                AutocorrectionType: "No",
              },
              {
                Type: "PSToggleSwitchSpecifier",
                Title: "Enabled",
                Key: "enabled_preference",
                DefaultValue: true,
              },
              {
                Type: "PSSliderSpecifier",
                Key: "slider_preference",
                DefaultValue: 0.5,
                MinimumValue: 0,
                MaximumValue: 1,
                MinimumValueImage: "",
                MaximumValueImage: "",
              },
            ],
          },
        },
      },
    ],
  ],
  // plugins: [require("./settings-plugin").withSettingsBundle],
});
