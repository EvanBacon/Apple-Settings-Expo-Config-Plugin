import { ConfigPlugin } from "@expo/config-plugins";

import { withLinkedSettingsBundle } from "./withXcodeChanges";
import { withXcodeProjectBetaBaseMod } from "./withXcparse";

const withIosSettingsPersistence: ConfigPlugin = (config) => {
  // Link Settings.bundle to the Xcode project.
  withLinkedSettingsBundle(config);

  // These must be last...
  withXcodeProjectBetaBaseMod(config);

  return config;
};

export default withIosSettingsPersistence;
