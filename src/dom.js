'use strict';
/**
 * @author: tianding.wk
 * @createdTime: 2019-02-11 20:57:18
 * @fileName: dom.js
 * @description: process dom to get all number values
 **/

import {
  type,
  removeWhiteSpace,
  getNumbers,
  getSelector,
} from './util';

const numbers = [];
const selectors = new Map();

export default function techies(dom) {
  if (type(dom) !== 'htmlbodyelement') {
    console.warn(`[techies] error dom type: ${type(dom)}, need body element, techies will exit doing nothing.`);
    return;
  }

  traverse(dom);
  console.info('reportData: ', removeWhiteSpace(numbers));
}

function traverse(node) {
  const firstChild = node.firstChild;

  let s = firstChild;
  while (s) {
    if (s.nodeType === 1) {
      traverse(s);
    } else if (s.nodeType === 3) {
      const number = getNumbers(s.data);
      if (number) {
        const selector = getSelector(s.parentNode);
        if (!selectors.has(selector)) {
          number.forEach((item, index) => {
            numbers.push({
              selector: `${selector}-${index}`,
              number: item,
            });
          });
          selectors.set(selector, number.length);
        } else {
          const index = selectors.get(selector);
          number.forEach((item, i) => {
            numbers.push({
              selector: `${selector}-${i + index}`,
              number: item,
            });
          });
          selectors.set(selector, index + number.length);
        }
      }
    }
    const nextSibling = s.nextSibling;
    s = nextSibling;
  }
}
