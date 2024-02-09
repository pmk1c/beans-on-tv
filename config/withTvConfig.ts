import {
  ConfigPlugin,
  IOSConfig,
  withAndroidManifest,
  withInfoPlist,
} from "@expo/config-plugins";
import fs from "node:fs/promises";
import path from "node:path";

interface Props {
  android: {
    banner: string;
  };
  ios: {
    brandassets: string;
  };
}

const withTvConfig: ConfigPlugin<Props> = (config, props) =>
  withAndroidBanner(withIosBrandassets(config, props), props);

const withAndroidBanner: ConfigPlugin<Props> = (config, props) =>
  withAndroidManifest(config, async (config) => {
    await copyAndroidBanner(
      config.modRequest.projectRoot,
      props.android.banner,
    );

    config.modResults.manifest.application =
      config.modResults.manifest.application?.reduce(
        (applications, application) => {
          if (application.$["android:name"] === ".MainApplication") {
            application.$["android:banner"] = "@mipmap/ic_banner";
          }

          return [...applications, application];
        },
        [] as typeof config.modResults.manifest.application,
      );

    return config;
  });

const withIosBrandassets: ConfigPlugin<Props> = (config, props) =>
  withInfoPlist(config, async (config) => {
    await copyIosBrandassets(
      config.modRequest.projectRoot,
      props.ios.brandassets,
    );
    await removeIosAppIcon(config.modRequest.projectRoot);

    config.modResults.UIRequiredDeviceCapabilities = ["arm64"];
    return config;
  });

async function copyAndroidBanner(projectRoot: string, bannerSource: string) {
  const sourcePath = path.join(projectRoot, bannerSource);
  const destinationDir = path.join(
    projectRoot,
    "android",
    "app",
    "src",
    "main",
    "res",
    "mipmap-xhdpi",
  );
  const destinationPath = path.join(destinationDir, "ic_banner.png");

  await fs.access(sourcePath);
  await fs.mkdir(destinationDir, { recursive: true });
  await fs.copyFile(sourcePath, destinationPath);
}

async function copyIosBrandassets(
  projectRoot: string,
  brandassetsSource: string,
) {
  const sourcePath = path.join(projectRoot, brandassetsSource);
  const destinationPath = path.join(
    getXCAssetsPath(projectRoot),
    "AppIcon.brandassets",
  );

  await fs.access(sourcePath);
  await fs.mkdir(destinationPath, { recursive: true });
  await fs.cp(sourcePath, destinationPath, { recursive: true });
}

function getXCAssetsPath(projectRoot: string) {
  return path.join(
    projectRoot,
    "ios",
    IOSConfig.XcodeUtils.getProjectName(projectRoot),
    "Images.xcassets",
  );
}

async function removeIosAppIcon(projectRoot: string) {
  const appIconPath = path.join(
    getXCAssetsPath(projectRoot),
    "AppIcon.appiconset",
  );

  try {
    await fs.rm(appIconPath, { recursive: true });
  } catch {}
}

export default withTvConfig;
