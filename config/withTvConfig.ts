import {
  ConfigPlugin,
  IOSConfig,
  withDangerousMod,
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

function getXCAssetsPath(projectRoot: string) {
  return path.join(
    projectRoot,
    "ios",
    IOSConfig.XcodeUtils.getProjectName(projectRoot),
    "Images.xcassets"
  );
}

const withTvConfig: ConfigPlugin<Props> = (config, props) =>
  withDangerousMod(
    withInfoPlist(config, (conf) => {
      conf.modResults.UIRequiredDeviceCapabilities = ["arm64"];
      return conf;
    }),
    [
      "ios",
      async (conf) => {
        await copyAndroidBanner(
          conf.modRequest.projectRoot,
          props.android.banner
        );
        await copyIosBrandassets(
          conf.modRequest.projectRoot,
          props.ios.brandassets
        );
        await removeIosAppIcon(conf.modRequest.projectRoot);

        return conf;
      },
    ]
  );

async function copyAndroidBanner(projectRoot: string, banner: string) {
  const sourcePath = path.join(projectRoot, banner);
  const destinationDir = path.join(
    projectRoot,
    "android",
    "app",
    "src",
    "main",
    "res",
    "mipmap-xhdpi"
  );
  const destinationPath = path.join(destinationDir, "ic_banner.png");

  await fs.access(sourcePath);
  await fs.mkdir(destinationDir, { recursive: true });
  await fs.copyFile(sourcePath, destinationPath);
}

async function copyIosBrandassets(
  projectRoot: string,
  brandassetsSource: string
) {
  const sourcePath = path.join(projectRoot, brandassetsSource);
  const destinationPath = path.join(
    getXCAssetsPath(projectRoot),
    "AppIcon.brandassets"
  );

  await fs.access(sourcePath);
  await fs.mkdir(destinationPath, { recursive: true });
  await fs.cp(sourcePath, destinationPath, { recursive: true });
}

async function removeIosAppIcon(projectRoot: string) {
  const appIconPath = path.join(
    getXCAssetsPath(projectRoot),
    "AppIcon.appiconset"
  );

  try {
    await fs.rm(appIconPath, { recursive: true });
  } catch {}
}

export default withTvConfig;
