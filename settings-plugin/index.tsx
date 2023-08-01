import { ConfigPlugin } from "@expo/config-plugins";
import { withStaticSettings } from "./static-settings";

export const withSettingsBundle: ConfigPlugin = (config) => {
  return withStaticSettings(config, {
    Root: {
      locales: {
        en: {
          Name: "Bacon",
        },
        es: {
          Name: "El Baco",
        },
      },
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
  });
};
