import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const htmlSvgPlugin = () => {
  return {
    name: 'html-svg-plugin',
    transformIndexHtml(html) {
      return html.replace(
        /<svg-load\s+name="([^"]+)"\s*\/>/g,
        (match, fileName) => {
          try {
            const filePath = path.resolve(
              __dirname,
              'src/icons',
              `${fileName}.svg`
            );

            let svgContent = fs.readFileSync(filePath, 'utf-8');

            svgContent = svgContent.replace(/<\?xml.*?\?>/, '');

            return svgContent;
          } catch (error) {
            console.error(
              `Erro: Ícone "${fileName}" não encontrado em src/icons/`
            );
            return match;
          }
        }
      );
    },
  };
};

export default defineConfig({
  plugins: [htmlSvgPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        home: path.resolve(__dirname, 'pages/home.html'),
        aboutus: path.resolve(__dirname, 'pages/aboutus.html'),
        services: path.resolve(__dirname, 'pages/services.html'),
      },
    },

    assetsInlineLimit: 4096,
    minify: 'terser',
  },
});
