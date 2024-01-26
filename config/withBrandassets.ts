import {ConfigPlugin, IOSConfig, withDangerousMod} from '@expo/config-plugins';
import fs from 'node:fs/promises';
import path from 'node:path';

interface Props {
  brandassets: string;
}

function getXCAssetsPath(projectRoot: string) {
  return path.join(
    projectRoot,
    'ios',
    IOSConfig.XcodeUtils.getProjectName(projectRoot),
    'Images.xcassets',
  );
}

export const withBrandassets: ConfigPlugin<Props> = (config, props) => {
  return withDangerousMod(config, [
    'ios',
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async config => {
      await copyBrandassets(config.modRequest.projectRoot, props.brandassets);
      await removeAppIcon(config.modRequest.projectRoot);

      return config;
    },
  ]);
};

async function copyBrandassets(projectRoot: string, brandassetsSource: string) {
  const sourcePath = path.join(projectRoot, brandassetsSource);
  const destinationPath = path.join(
    getXCAssetsPath(projectRoot),
    'AppIcon.brandassets',
  );

  await fs.access(sourcePath);
  await fs.mkdir(destinationPath, {recursive: true});
  await fs.cp(sourcePath, destinationPath, {recursive: true});
}

async function removeAppIcon(projectRoot: string) {
  const appIconPath = path.join(
    getXCAssetsPath(projectRoot),
    'AppIcon.appiconset',
  );

  await fs.rm(appIconPath, {recursive: true});
}
