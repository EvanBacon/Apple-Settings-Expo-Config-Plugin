import { ConfigPlugin } from "@expo/config-plugins";

import withIosSettingsPersist from "./withIosSettingsPersist";
import { withRootPlist } from "./withRootPlist";
import { withSettingsStrings } from "./withSettingsStrings";

export const withSettingsBundle: ConfigPlugin = (config) => {
  // Make some modifications
  withRootPlist(config, (config) => {
    config.modResults.PreferenceSpecifiers = [];
    config.modResults.PreferenceSpecifiers.push({
      Type: "PSSliderSpecifier",
      Key: "eeee",
      DefaultValue: 0.5,
      MaximumValue: 1,
      MinimumValue: 0,
    });
    config.modResults.PreferenceSpecifiers.push({
      Type: "PSTitleValueSpecifier",
      Key: "title",
      DefaultValue: "title",
      Values: ["title"],
      Titles: ["title"],
    });
    return config;
  });

  // Add some localized title
  withSettingsStrings(config, (config) => {
    config.modResults["title"] = "Hello World";
    return config;
  });

  return withIosSettingsPersist(config);
};

export { withRootPlist, withSettingsStrings };
