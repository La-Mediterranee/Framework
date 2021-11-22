// @index('./*.ts', (f) => f.name === "reset" ? `export { default as ${f.name}Caches } from '${f.path}';` : `export { default as ${f.name}Cache } from '${f.path}';`)
export { default as fontsCache } from './fonts';
export { default as imagesCache } from './images';
export { default as resetCaches } from './reset';
export { default as scriptsCache } from './scripts';
export { default as stylesCache } from './styles';
//@endindex
