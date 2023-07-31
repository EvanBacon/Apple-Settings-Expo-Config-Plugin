import { ConfigPlugin } from "@expo/config-plugins";

import { createModSetForSettingsPage } from "./withRootPlist";
import { createModSetForSettingsStrings } from "./withSettingsStrings";
import { withLinkedSettingsBundle } from "./withXcodeChanges";
import { withXcodeProjectBetaBaseMod } from "./withXcparse";

export const rootPlist = createModSetForSettingsPage({ name: "Root" });
export const rootEnglishStrings = createModSetForSettingsStrings({
  name: "Root",
  lang: "en",
});

const withIosSettingsPersistence: ConfigPlugin = (config) => {
  // Link Settings.bundle to the Xcode project.
  withLinkedSettingsBundle(config);

  // These must be last...
  withXcodeProjectBetaBaseMod(config);
  rootEnglishStrings.withBaseMod(config);
  rootPlist.withBaseMod(config);

  return config;
};

export default withIosSettingsPersistence;
