import { ComponentProps } from 'react';
import { z } from 'zod';

import { browserSchema, osSchema, platformSchema } from '~/schemas/events';

import AndroidIcon from '../../assets/android.svg';
import AppleIcon from '../../assets/apple.svg';
import BraveIcon from '../../assets/brave.svg';
import ChromeIcon from '../../assets/chrome.svg';
import DesktopIcon from '../../assets/desktop.svg';
import FirefoxIcon from '../../assets/firefox.svg';
import LinuxIcon from '../../assets/linux.svg';
import MobileIcon from '../../assets/mobile.svg';
import OperaIcon from '../../assets/opera.svg';
import SafariIcon from '../../assets/safari.svg';
import UnknownIcon from '../../assets/unknown.svg';
import WindowsIcon from '../../assets/windows.svg';

interface IconProps extends ComponentProps<'svg'> {
	name: z.infer<typeof osSchema | typeof browserSchema | typeof platformSchema>;
}

export const Icon = ({ name, ...rest }: IconProps) => {
	switch (name) {
		case 'android':
			return <AndroidIcon {...rest} />;
		case 'brave':
			return <BraveIcon {...rest} />;
		case 'chrome':
			return <ChromeIcon {...rest} />;
		case 'desktop':
			return <DesktopIcon {...rest} />;
		case 'firefox':
			return <FirefoxIcon {...rest} />;
		case 'ios':
			return <AppleIcon {...rest} />;
		case 'linux':
			return <LinuxIcon {...rest} />;
		case 'macos':
			return <AppleIcon {...rest} />;
		case 'mobile':
			return <MobileIcon {...rest} />;
		case 'opera':
			return <OperaIcon {...rest} />;
		case 'safari':
			return <SafariIcon {...rest} />;
		case 'windows':
			return <WindowsIcon {...rest} />;
		default:
			return <UnknownIcon {...rest} />;
	}
};
