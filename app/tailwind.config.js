/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
		colors: {
			background: "hsl(340, 100, 97)",
			label: "hsl(210, 75, 85)",
			header: "hsl(320, 70, 70)",
		},
	},
	plugins: [],
}
