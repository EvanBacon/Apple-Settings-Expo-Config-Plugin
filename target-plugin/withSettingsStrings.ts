import {
  BaseMods,
  ConfigPlugin,
  createRunOncePlugin,
  Mod,
  withMod,
} from "@expo/config-plugins";
import * as fs from "fs";
import path from "path";

const customModName = "settingsStrings";

export type SettingsStrings = Record<string, string>;

export const withSettingsStrings: ConfigPlugin<Mod<SettingsStrings>> = (
  config,
  action
) => {
  return withMod(config, {
    platform: "ios",
    mod: customModName,
    action,
  });
};

function parseStringsFile(src: string): SettingsStrings {
  // TODO: ...
  return {};
}
function buildStringsFile(src: SettingsStrings): string {
  // TODO: ...
  return "";
}

const withSettingsStringsBaseModInternal: ConfigPlugin = (config) => {
  return BaseMods.withGeneratedBaseMods(config, {
    platform: "ios",
    saveToInternal: true,
    skipEmptyMod: false,
    providers: {
      [customModName]: BaseMods.provider<SettingsStrings>({
        isIntrospective: true,
        async getFilePath({ modRequest, _internal }) {
          return path.join(
            modRequest.platformProjectRoot,
            modRequest.projectName!,
            "Settings.bundle/en.lproj/Root.strings"
          );
        },
        async read(filePath) {
          try {
            if (fs.existsSync(filePath) === false) {
              return {};
            }
            return parseStringsFile(
              await fs.promises.readFile(filePath, "utf-8")
            );
          } catch (error) {
            throw new Error(
              `Failed to parse the Settings.bundle/en.lproj/Root.strings: "${filePath}". ${error.message}}`
            );
          }
        },
        async write(filePath, { modResults, modRequest: { introspect } }) {
          if (introspect) {
            return;
          }
          const contents = buildStringsFile(modResults);
          // Ensure Settings.bundle/en.lproj
          await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
          await fs.promises.writeFile(filePath, contents);
        },
      }),
    },
  });
};

export const withSettingsStringsBaseMod = createRunOncePlugin(
  withSettingsStringsBaseModInternal,
  "withSettingsStringsBaseMod"
);
