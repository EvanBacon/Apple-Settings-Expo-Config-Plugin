import { PBXNativeTarget, XcodeProject } from "@bacons/xcode";
import plist from "@expo/plist";
import fs from "fs";
import path from "path";

export type ExtensionType =
  | "widget"
  | "notification-content"
  | "notification-service"
  | "share"
  | "intent"
  | "bg-download"
  | "intent-ui"
  | "spotlight"
  | "matter"
  | "quicklook-thumbnail"
  | "imessage"
  | "clip"
  | "watch"
  | "location-push"
  | "credentials-provider"
  | "account-auth"
  | "safari";

export const KNOWN_EXTENSION_POINT_IDENTIFIERS: Record<string, ExtensionType> =
  {
    "com.apple.message-payload-provider": "imessage",
    "com.apple.widgetkit-extension": "widget",
    "com.apple.usernotifications.content-extension": "notification-content",
    "com.apple.share-services": "share",
    "com.apple.usernotifications.service": "notification-service",
    "com.apple.spotlight.import": "spotlight",
    "com.apple.intents-service": "intent",
    "com.apple.intents-ui-service": "intent-ui",
    "com.apple.Safari.web-extension": "safari",
    "com.apple.background-asset-downloader-extension": "bg-download",
    "com.apple.matter.support.extension.device-setup": "matter",
    "com.apple.quicklook.thumbnail": "quicklook-thumbnail",
    "com.apple.location.push.service": "location-push",
    "com.apple.authentication-services-credential-provider-ui":
      "credentials-provider",
    "com.apple.authentication-services-account-authentication-modification-ui":
      "account-auth",
    // "com.apple.intents-service": "intents",
  };

export function isNativeTargetOfType(
  target: PBXNativeTarget,
  type: ExtensionType
): boolean {
  if (
    type === "watch" &&
    target.props.productType === "com.apple.product-type.application"
  ) {
    return (
      "WATCHOS_DEPLOYMENT_TARGET" in
      getDefaultBuildConfigurationForTarget(target).props.buildSettings
    );
  }
  if (
    type === "clip" &&
    target.props.productType ===
      "com.apple.product-type.application.on-demand-install-capable"
  ) {
    return true;
  }
  if (target.props.productType !== "com.apple.product-type.app-extension") {
    return false;
  }
  // Could be a Today Extension, Share Extension, etc.

  const defConfig =
    target.props.buildConfigurationList.props.buildConfigurations.find(
      (config) =>
        config.props.name ===
        target.props.buildConfigurationList.props.defaultConfigurationName
    );
  const infoPlistPath = path.join(
    // TODO: Resolve root better
    path.dirname(path.dirname(target.project.getXcodeProject().filePath)),
    defConfig.props.buildSettings.INFOPLIST_FILE
  );

  const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, "utf8"));

  if (!infoPlist.NSExtension?.NSExtensionPointIdentifier) {
    console.error(
      "No NSExtensionPointIdentifier found in extension Info.plist for target: " +
        target.getDisplayName()
    );
    return false;
  }

  return (
    KNOWN_EXTENSION_POINT_IDENTIFIERS[
      infoPlist.NSExtension?.NSExtensionPointIdentifier
    ] === type
  );
}

export function getMainAppTarget(project: XcodeProject): PBXNativeTarget {
  const mainAppTarget = project.rootObject.props.targets.filter((target) => {
    if (
      PBXNativeTarget.is(target) &&
      target.props.productType === "com.apple.product-type.application"
    ) {
      return !isNativeTargetOfType(target, "watch");
    }
    return false;
  }) as PBXNativeTarget[];

  if (mainAppTarget.length > 1) {
    console.warn(
      `Multiple main app targets found, using first one: ${mainAppTarget
        .map((t) => t.getDisplayName())
        .join(", ")}}`
    );
  }

  return mainAppTarget[0];
}

export function getDefaultBuildConfigurationForTarget(target: PBXNativeTarget) {
  return target.props.buildConfigurationList.props.buildConfigurations.find(
    (config) =>
      config.props.name ===
      target.props.buildConfigurationList.props.defaultConfigurationName
  );
}
