import react from "@vitejs/plugin-react";
import path from 'path';
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve:{
		alias:{
			'@routes': path.resolve(__dirname,'src/routes'),
			'@components': path.resolve(__dirname,'src/components'),
			'@styles': path.resolve(__dirname,'src/styles'),
            '@utils': path.resolve(__dirname,'src/utils')
		}
	}
});
