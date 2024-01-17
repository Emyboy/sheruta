import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
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

		text_color: '#404444',
		text_muted: '#9D9F9F',
		gray: '#6E7272',

		background: '#fafafa',
	},
})

export const NAV_HEIGHT = '60PX'
export const SIDE_NAV_WIDTH = '250px'
export const CONTAINER_MAX_WIDTH = '1100px'
