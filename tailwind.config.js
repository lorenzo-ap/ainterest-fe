/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: ['selector', '[data-mantine-color-scheme="dark"]'],
	theme: {
		extend: {
			screens: {
				xxs: '380px',
				xs: '480px',
				'3xl': '1800px'
			},
			fontFamily: {
				sans: ['Inter var', 'Inter', 'sans-serif'],
				display: ['Instrument Serif', 'Times New Roman', 'serif'],
				mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
			},
			colors: {
				bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
				'bg-deep': 'rgb(var(--bg-deep-rgb) / <alpha-value>)',
				surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
				'surface-2': 'rgb(var(--surface-2-rgb) / <alpha-value>)',
				ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
				brand: 'rgb(var(--brand-rgb) / <alpha-value>)',
				'brand-hi': 'rgb(var(--brand-hi-rgb) / <alpha-value>)',
				'brand-lo': 'rgb(var(--brand-lo-rgb) / <alpha-value>)',
				danger: 'rgb(var(--danger-rgb) / <alpha-value>)',
				// pre-mixed translucent tokens — used as-is, never with a modifier
				inset: 'var(--surface-inset)',
				hover: 'var(--surface-hover)',
				line: 'var(--line)',
				'line-strong': 'var(--line-strong)',
				'ink-2': 'var(--ink-2)',
				'ink-3': 'var(--ink-3)',
				'brand-tint': 'var(--brand-tint)',
				'brand-tint-strong': 'var(--brand-tint-strong)',
				'danger-tint': 'var(--danger-tint)'
			},
			borderRadius: {
				xs: 'var(--r-xs)',
				sm: 'var(--r-sm)',
				md: 'var(--r-md)',
				lg: 'var(--r-lg)',
				xl: 'var(--r-xl)'
			},
			boxShadow: {
				pop: 'var(--shadow-pop)',
				float: 'var(--shadow-float)'
			},
			transitionTimingFunction: {
				out: 'var(--ease)'
			},
			maxWidth: {
				gallery: '1760px',
				page: '1200px',
				prose: '680px'
			},
			spacing: {
				header: 'var(--header-h)',
				tabbar: 'var(--tabbar-h)'
			},
			fontSize: {
				'display-sm': ['clamp(2.25rem, 1.6rem + 2.6vw, 3.25rem)', { lineHeight: '1.04' }],
				'display-md': ['clamp(2.75rem, 1.7rem + 4.4vw, 5rem)', { lineHeight: '1.02' }],
				'display-lg': ['clamp(3.25rem, 1.9rem + 6vw, 6.5rem)', { lineHeight: '0.98' }]
			},
			keyframes: {
				shimmer: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				shimmer: 'shimmer 1.8s infinite'
			}
		}
	}
};
