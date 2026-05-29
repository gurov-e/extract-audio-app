import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			react(),
			tailwindcss(),
		],

		// определение алиаса @, который ссылается на папку src. Нужен для упрощения импортов и избегания ../../../../ и так далее
		resolve: {
			alias: {
				'@': resolve(__dirname, './src'),
			},
		},

		// корректное транслирование camelCase в scss стилях
		css: {
			modules: {
				localsConvention: 'camelCase',
			},
		},

		// настройка для запуска в дев моде
		server: {
			host: '0.0.0.0',
			port: 8080,
		},

		// настройка для запуска билда
		preview: {
			port: 8080,

			proxy: {
				'/api': {
					target: env.VITE_API_URL,
					changeOrigin: true,
				},
			},
		},
	};
});
