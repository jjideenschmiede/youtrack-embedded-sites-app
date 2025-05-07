import {defineConfig} from "vite";
import {viteStaticCopy} from "vite-plugin-static-copy";
import react from "@vitejs/plugin-react";

/*
      See https://vitejs.dev/config/
*/

export default defineConfig({
	plugins: [
		react(),
		viteStaticCopy({
			targets: [
				{
					src: "../manifest.json",
					dest: "."
				},
				{
					src: "../public/*.*",
					dest: "."
				}
			]
		}),
		viteStaticCopy({
			targets: [
				{
					src: "widgets/**/*.{svg,png,jpg,json}",
					dest: "."
				}
			],
			structured: true
		})
	],
	root: "./src",
	base: "",
	publicDir: "public",
	build: {
		outDir: "../dist",
		emptyOutDir: true,
		copyPublicDir: false,
		target: ["es2022"],
		assetsDir: "widgets/assets",
		rollupOptions: {
			input: {
				embeddedSite: "src/widgets/embedded-site/index.html"
      		}
    	}
  	}
});
