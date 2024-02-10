import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import jsconfigPaths from "vite-jsconfig-paths";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { plugin as mdPlugin, Mode } from 'vite-plugin-markdown';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		{
			name: "treat-js-files-as-jsx",
			async transform(code, id) {
				if (!id.match(/src\/.*\.js$/)) return null; // include ts or tsx for TypeScript support

				// Use the exposed transform from vite, instead of directly
				// transforming with esbuild
				return transformWithEsbuild(code, id, {
					loader: "jsx",
					jsx: "automatic",
				});
			},
		},
		react(),
		jsconfigPaths(),
		ViteEjsPlugin(),
        mdPlugin({ mode: [Mode.HTML, Mode.MARKDOWN, Mode.TOC, Mode.REACT] }),
	],
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				".js": "jsx",
			},
		},
	},
	server: {
		port: 3000,
	},
	build: {
		outDir: "build",
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/setupTests.js",
	},
});
