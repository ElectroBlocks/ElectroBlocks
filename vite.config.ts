import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import commonjs from "@rollup/plugin-commonjs"; // Import the plugin

export default defineConfig({
  plugins: [commonjs({ sourceMap: true }), sveltekit()],
});
