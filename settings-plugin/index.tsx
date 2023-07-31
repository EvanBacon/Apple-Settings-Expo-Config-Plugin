import { ConfigPlugin } from "@expo/config-plugins";

import withIosSettingsPersist, { rootPlist } from "./withIosSettingsPersist";
import { withSettingsStrings } from "./withSettingsStrings";

export const withSettingsBundle: ConfigPlugin = (config) => {
  // Make some modifications
  rootPlist.withSettingsPlist(config, (config) => {
    config.modResults.PreferenceSpecifiers = [
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
    ];

    return config;
  });

  // Add some localized title
  withSettingsStrings(config, (config) => {
    config.modResults["title"] = "Hello World";
    return config;
  });

  return withIosSettingsPersist(config);
};

export { withSettingsStrings };
