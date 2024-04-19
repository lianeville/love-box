/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				background: "hsl(340, 100, 97)",
				label: "hsl(210, 75, 85)",
				labelText: "hsl(208, 66, 40)",
				header: "hsl(320, 70, 70)",
				headerText: "hsl(296 68% 32%)",
			},
		},
	},
	plugins: [],
}
