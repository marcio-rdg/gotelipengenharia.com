import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import fs from 'fs';
import path from 'path';

const htmlSvgPlugin = () => {
  return {
    name: 'html-svg-plugin',
    transformIndexHtml(html) {
      return html.replace(
        /<svg-load name="([^"]+)" \/>/g,
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
  plugins: [htmlSvgPlugin(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    minify: 'terser',
  },
});
