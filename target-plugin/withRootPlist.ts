import {
  BaseMods,
  ConfigPlugin,
  createRunOncePlugin,
  Mod,
  withMod,
} from "@expo/config-plugins";
import * as plist from "@expo/plist";
import * as fs from "fs";
import path from "path";

const customModName = "rootPlist";

export type RootPlist = plist.PlistObject;

export const withRootPlist: ConfigPlugin<Mod<RootPlist>> = (config, action) => {
  return withMod(config, {
    platform: "ios",
    mod: customModName,
    action,
  });
};
const withRootPlistBaseModInternal: ConfigPlugin = (config) => {
  return BaseMods.withGeneratedBaseMods(config, {
    platform: "ios",
    saveToInternal: true,
    skipEmptyMod: false,
    providers: {
      [customModName]: BaseMods.provider<RootPlist>({
        isIntrospective: true,

        async getFilePath({ modRequest, _internal }) {
          return path.join(
            modRequest.platformProjectRoot,
            modRequest.projectName!,
            "Settings.bundle/Root.plist"
          );
        },
        async read(filePath) {
          try {
            if (fs.existsSync(filePath) === false) {
              return {};
            }
            return plist.default.parse(
              await fs.promises.readFile(filePath, "utf-8")
            );
          } catch (error) {
            throw new Error(
              `Failed to parse the Root.plist: "${filePath}". ${error.message}}`
            );
          }
        },
        async write(filePath, { modResults, modRequest: { introspect } }) {
          if (introspect) {
            return;
          }
          const contents = plist.default.build(modResults);
          // Ensure Settings.bundle
          await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
          await fs.promises.writeFile(filePath, contents);
        },
      }),
    },
  });
};

export const withRootPlistBaseMod = createRunOncePlugin(
  withRootPlistBaseModInternal,
  "withRootPlistBaseMod"
);
