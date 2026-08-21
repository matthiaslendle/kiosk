import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDMG } from '@electron-forge/maker-dmg';
import fs from 'fs'

// or some other way of detecting if you're running on RHEL
const isRHEL = fs.existsSync('/etc/redhat-release');
const makers = [
    new MakerSquirrel({
        "name": "kiosk"
    }, ['win32']),
    new MakerDMG({}, ['darwin']),
    new MakerZIP({}, ['darwin']),
    new MakerDeb({}, ['linux']),
];

if (isRHEL) makers.push(new MakerRpm({}, ['linux']));

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
    },
    makers: makers
}

export default config;