import {
  PBXFileReference,
  PBXResourcesBuildPhase,
  XcodeProject,
} from "@bacons/xcode";
import { ConfigPlugin } from "@expo/config-plugins";
import path from "path";

import { getMainAppTarget } from "./base-mods/target";
import { withXcodeProjectBeta } from "./base-mods/withXcparse";

export const withLinkedSettingsBundle: ConfigPlugin = (config) => {
  return withXcodeProjectBeta(config, (config) => {
    applyXcodeChanges(config.modResults, {
      projectName: config.modRequest.projectName!,
    });
    return config;
  });
};

async function applyXcodeChanges(
  project: XcodeProject,
  props: { projectName: string }
) {
  const mainAppTarget = getMainAppTarget(project);

  const mainResourceBuildPhase = mainAppTarget.getBuildPhase(
    PBXResourcesBuildPhase
  );

  // Prevent duplicate.
  if (
    mainResourceBuildPhase.props.files.find(
      (file) => file.props.fileRef.props.name === "Settings.bundle"
    )
  ) {
    return project;
  }

  const ref = PBXFileReference.create(project, {
    lastKnownFileType: "wrapper.plug-in",
    name: "Settings.bundle",
    path: path.join(props.projectName, "Settings.bundle"),
    sourceTree: "<group>",
  });

  mainResourceBuildPhase.createFile({
    fileRef: ref,
  });

  // Add Setting.bundle to the project display.
  project.rootObject.props.mainGroup.props.children.push(ref);

  return project;
}
