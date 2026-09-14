import { createTheme, type MantineThemeOverride } from '@mantine/core';

/**
 * AInterest theme.
 *
 * The visual language lives in `src/index.css` (design tokens + the Mantine
 * bridge). This file only aligns Mantine's own scales and component defaults
 * with it, so library components never look like library components.
 */
export const theme: MantineThemeOverride = createTheme({
	primaryColor: 'violet',
	primaryShade: { light: 7, dark: 5 },
	autoContrast: true,
	luminanceThreshold: 0.35,

	defaultRadius: 'md',
	focusRing: 'never',

	fontFamily: "'Inter var', 'Inter', sans-serif",
	fontFamilyMonospace: "'JetBrains Mono', ui-monospace, monospace",

	headings: {
		fontFamily: "'Inter var', 'Inter', sans-serif",
		fontWeight: '600',
		sizes: {
			h1: { fontSize: '2rem', lineHeight: '1.15' },
			h2: { fontSize: '1.5rem', lineHeight: '1.2' },
			h3: { fontSize: '1.175rem', lineHeight: '1.3' },
			h4: { fontSize: '1rem', lineHeight: '1.4' }
		}
	},

	components: {
		Button: {
			defaultProps: { radius: 'md' }
		},
		ActionIcon: {
			defaultProps: { radius: 'sm' }
		},
		Modal: {
			defaultProps: {
				centered: true,
				radius: 'lg',
				padding: 28,
				overlayProps: { backgroundOpacity: 0.6, blur: 6 },
				transitionProps: { transition: 'pop', duration: 200 }
			}
		},
		Popover: {
			defaultProps: {
				radius: 'lg',
				shadow: 'lg',
				transitionProps: { transition: 'pop', duration: 160 }
			}
		},
		Menu: {
			defaultProps: {
				radius: 'lg',
				shadow: 'lg',
				transitionProps: { transition: 'pop', duration: 160 }
			}
		},
		Tooltip: {
			defaultProps: { radius: 'xs', openDelay: 260, withArrow: false, offset: 8 }
		},
		TextInput: {
			defaultProps: { radius: 'md', size: 'md' }
		},
		PasswordInput: {
			defaultProps: { radius: 'md', size: 'md' }
		},
		Textarea: {
			defaultProps: { radius: 'md', size: 'md' }
		},
		Select: {
			defaultProps: { radius: 'md', size: 'md' }
		},
		Avatar: {
			defaultProps: { radius: 'xl' }
		},
		Skeleton: {
			defaultProps: { radius: 'md' }
		},
		Loader: {
			defaultProps: { type: 'oval' }
		}
	}
});
