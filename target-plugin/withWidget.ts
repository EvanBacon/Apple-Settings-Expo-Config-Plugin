import { ConfigPlugin } from "@expo/config-plugins";

import { withRootPlistBaseMod } from "./withRootPlist";
import { withSettingsStringsBaseMod } from "./withSettingsStrings";
import { withLinkedSettingsBundle } from "./withXcodeChanges";
import { withXcodeProjectBetaBaseMod } from "./withXcparse";

type Props = {};

const withIosSettingsPersistence: ConfigPlugin = (config) => {
  // Link Settings.bundle to the Xcode project.
  withLinkedSettingsBundle(config);

  // These must be last...
  withXcodeProjectBetaBaseMod(config);
  withSettingsStringsBaseMod(config);
  withRootPlistBaseMod(config);

  return config;
};

const withIosSettings: ConfigPlugin<Props> = (config, props) => {
  // Must be last
  return withIosSettingsPersistence(config);
};

export default withIosSettings;
