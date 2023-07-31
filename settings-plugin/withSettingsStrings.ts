import {
  BaseMods,
  ConfigPlugin,
  createRunOncePlugin,
  Mod,
  withMod,
} from "@expo/config-plugins";
import * as fs from "fs";
import path from "path";

import { readStrings, writeStrings } from "./strings";

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

const withSettingsStringsBaseModInternal: ConfigPlugin = (config) => {
  return BaseMods.withGeneratedBaseMods(config, {
    platform: "ios",
    saveToInternal: true,
    skipEmptyMod: false,
    providers: {
      [customModName]: BaseMods.provider<SettingsStrings>({
        isIntrospective: true,
        async getFilePath({ modRequest }) {
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
            return readStrings(filePath, false) as unknown as Record<
              string,
              string
            >;
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
          // Ensure Settings.bundle/en.lproj
          await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
          await writeStrings(filePath, modResults);
        },
      }),
    },
  });
};

export const withSettingsStringsBaseMod = createRunOncePlugin(
  withSettingsStringsBaseModInternal,
  "withSettingsStringsBaseMod"
);
