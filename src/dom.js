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
} from './util';


const reportData = {
  page: '',
  status: '',
  numbers: [],
};

export default function techies(dom) {
  if (type(dom) !== 'htmlbodyelement') {
    console.warn(`[techies] error dom type: ${type(dom)}, need body element, techies will exit doing nothing.`);
    return;
  }

  traverse(dom);

  reportData.numbers = removeWhiteSpace(reportData.numbers);
  let newArr = [];
  reportData.numbers.forEach((item, index) => {
    const arr = getNumbers(item);
    if (arr) {
      newArr = newArr.concat(arr);
    }
  });
  reportData.numbers = newArr;
  console.info('reportData: ', reportData);
}

function traverse(parent) {
  // get node textContent
  getNodeTextContent(parent);
  const children = parent.children;
  let l = children.length;

  let child;
  while (l > 0) {
    child = children[l - 1];
    traverse(child);
    l--;
  }
}

// get current node `textContent`
function getNodeTextContent(node) {
  const innerHTML = node.innerHTML.trim().replace(/\s/g, '');
  if (node.children.length) {
    const children = Array.from(node.children);
    const reg = new RegExp(children.map(child => child.outerHTML.trim().replace(/\s/g, '')).join('|'));

    const textContent = innerHTML.split(reg);
    reportData.numbers = reportData.numbers.concat(textContent);
  } else {
    reportData.numbers.push(node.textContent);
  }
}
