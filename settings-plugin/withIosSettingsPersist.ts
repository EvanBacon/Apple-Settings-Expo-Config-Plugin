import { ConfigPlugin } from "@expo/config-plugins";

import { createModSetForSettingsPage } from "./withRootPlist";
import { withSettingsStringsBaseMod } from "./withSettingsStrings";
import { withLinkedSettingsBundle } from "./withXcodeChanges";
import { withXcodeProjectBetaBaseMod } from "./withXcparse";

export const rootPlist = createModSetForSettingsPage({ name: "Root" });

const withIosSettingsPersistence: ConfigPlugin = (config) => {
  // Link Settings.bundle to the Xcode project.
  withLinkedSettingsBundle(config);

  // These must be last...
  withXcodeProjectBetaBaseMod(config);
  withSettingsStringsBaseMod(config);
  rootPlist.withBaseMod(config);

  return config;
};

export default withIosSettingsPersistence;
