import { masks, parttens } from './defs-element';

const ns = {
  svg: 'http://www.w3.org/2000/svg',
  xmlns: 'http://www.w3.org/2000/xmlns/',
  xml: 'http://www.w3.org/XML/1998/namespace',
  xlink: 'http://www.w3.org/1999/xlink',
  xhtml: 'http://www.w3.org/1999/xhtml'
};
const svgVersion = '1.1';
/**
 * @description: 解析xml
 * @return {*}
 */
function parseXML(
  data: string,
  options?: {
    async?: boolean;
    mimeType?:
      | 'text/html'
      | 'text/xml'
      | 'application/xml'
      | 'application/xhtml+xml'
      | 'image/svg+xml';
  }
): Document {
  let xml;
  try {
    const parser = new DOMParser();
    xml = parser.parseFromString(data, options.mimeType || 'text/xml');
  } catch {
    xml = undefined;
  }
  if (!xml || xml.querySelectorAll('parsererror').length) {
    throw new Error(`Invalid XML: ${data}`);
  }
  return xml;
}

/**
 * @description: 创建svg元素素
 * @param {string} content
 * @return {*}
 */
function createSvgDocument(content: string) {
  if (content) {
    const xml = `<svg xmlns="${ns.svg}" xmlns:xlink="${ns.xlink}" version="${svgVersion}">${content}</svg>`; // lgtm[js/html-constructed-from-input]
    const { documentElement } = parseXML(xml, { async: false });
    return documentElement;
  }
  const svg = document.createElementNS(ns.svg, 'svg');
  svg.setAttributeNS(ns.xmlns, 'xmlns:xlink', ns.xlink);
  svg.setAttribute('version', svgVersion);
  return svg;
}

/**
 * @description: 添加parttern
 * @return {*}
 */
export function initSvgPattern(): void {
  const defEl = document
    .querySelector('.x6-graph-svg')
    .querySelectorAll('defs')[0];
  const docFrag = document.createDocumentFragment();
  masks.forEach(mask => {
    const doc = createSvgDocument(mask);
    docFrag.appendChild(document.importNode(doc.firstChild, true));
  });
  parttens.forEach(parttern => {
    const doc = createSvgDocument(parttern);
    docFrag.appendChild(document.importNode(doc.firstChild, true));
  });
  defEl.appendChild(docFrag);
}
