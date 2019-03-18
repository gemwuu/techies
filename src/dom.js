import {
  type,
  removeWhiteSpace,
  getNumbers,
  getSelector,
} from './util';

// 数据集合
let numbers = [];

// 选择器集合，一个节点有多个 TEXT_NODE 需要手动加索引
const selectors = new Map();

export default function techies(dom) {
  if (type(dom) !== 'htmlbodyelement') {
    console.warn(`[techies] error dom type: ${type(dom)}, need body element, techies will exit doing nothing.`);
    return;
  }

  recursive(dom);
  console.info(`[reportData]${JSON.stringify(removeWhiteSpace(numbers.slice(0, 15)))}`);
  numbers = [];
}

// 递归遍历特定节点
function recursive(node) {
  let el = node.firstChild;

  while (el) {
    // ELEMENT_NODE
    if (el.nodeType === 1) {
      recursive(el);
    // TEXT_NODE
    } else if (el.nodeType === 3) {
      const number = getNumbers(el.data);
      // 此处根据是否是数字判断是否继续进行后续处理
      if (number) {
        const selector = getSelector(el.parentNode);
        // 如果 selector 不重复
        if (!selectors.has(selector)) {
          number.forEach((item, index) => {
            numbers.push({
              selector: `${selector}-${index}`,
              number: item,
            });
          });
          selectors.set(selector, number.length);
        // 如果 selector 重复，手动增加索引
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
    const nextSibling = el.nextSibling;
    el = nextSibling;
  }
}
