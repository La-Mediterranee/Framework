// @index('./*.ts', (f) => f.name === "reset" ? `import ${f.name}Caches from '${f.path}';` : `import ${f.name}Route from '${f.path}';`)
import documentsRoute from './documents';
import fontsRoute from './fonts';
import imagesRoute from './images';
import resetCaches from './reset';
import scriptsRoute from './scripts';
import stylesRoute from './styles';
import translationsRoute from './translations';
//@endindex

export function registerRoutes() {
	documentsRoute();
	stylesRoute();
	translationsRoute();
	scriptsRoute();
	fontsRoute();
	imagesRoute();
}

// @index('./*.ts', (f) => f.name === "reset" ? `export { default as ${f.name}Caches } from '${f.path}';` : `export { default as ${f.name}Route } from '${f.path}';`)
export { default as documentsRoute } from './documents';
export { default as fontsRoute } from './fonts';
export { default as imagesRoute } from './images';
export { default as resetCaches } from './reset';
export { default as scriptsRoute } from './scripts';
export { default as stylesRoute } from './styles';
export { default as translationsRoute } from './translations';
//@endindex
