import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
	config: {
		initialColorMode: 'dark', // Set the default color mode to "dark"
		useSystemColorMode: false, // Set to true if you want to respect the system's color mode
	},
	colors: {
		dark: '#111717',
		dark_light: '#313e3d',
		dark_lighter: '#98b0ae',

		//brand
		brand_darker: '#003021',
		brand_dark: '#005539',
		brand: '#00bc73',
		brand_light: '#63f2b1',
		brand_lighter: '#cdfee2',

		//accent
		accent_lighter: '#f9fee7',
		accent_light: '#f0fccb',
		accent: '#e4faa8',
		accent_dark: '#93cd15',
		accent_darker: '#3b5314',

		text_color: '#404444',
		text_muted: '#9D9F9F',

		gray: '#6E7272',
		border_color: '#E3E3E3',

		background: '#fafafa',
	},
	components: {
		Button: {
			// Configure hover styles for all buttons
			baseStyle: {
				_hover: {
					backgroundColor: 'none',
				},
			},
		},
	},
})

export const NAV_HEIGHT = '70px'
export const SIDE_NAV_WIDTH = '250px'
export const BODY_WIDTH = '600px'
export const CONTAINER_MAX_WIDTH = '1200px'
export const DEFAULT_PADDING = '15px'
