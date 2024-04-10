import forms from '@tailwindcss/forms';
import flowbite from 'flowbite/plugin';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config}*/
const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			colors: {
				primary: colors.neutral,
			}
		}
	},
	plugins: [forms, flowbite]
};

export default config;
