// 同一个 class 或 id，出现多次需要手动加索引
const attrs = new Map();

// 获取当前节点的类型
export function type(value) {
  return Object.prototype.toString
    .call(value)
    .match(/\[object\ (.*)\]/)[1]
    .toLowerCase();
}

// 去掉节点里面的脏数据
export function removeWhiteSpace(array) {
  const dirtyData = ['', ' '];
  return array.filter(item => !dirtyData.includes(item));
}

// 匹配小数和整数，带符号
export function getNumbers(str) {
  return str.match(/([+-]?[0-9]{1,}[.][0-9]*)|[+-]?[0-9]{1,}/g);
}

// 获取当前节点基于选择器的唯一标识符
export function getSelector(node) {
  // 非 dom 节点
  if (type(node).indexOf('html') < 0) {
    console.warn(`[techies] error dom type: ${type(node)}, need html element.`);
    return '';
  }

  if (type(node) === 'htmlhtmlelement') {
    return 'html';
  }

  if (type(node) === 'htmlbodyelement') {
    return 'body';
  }

  let selector = [];
  let _node;

  while (type(node) !== 'htmlbodyelement') {
    selector.unshift(getParentSelector(node));
    _node = node;
    node = node.parentElement;
  }

  return `body${selector.join('')}`;
}

// 获取父节点的选择器
function getParentSelector(node) {
  const parent = node.parentElement;
  const siblings = parent.children;
  const tagName = node.tagName.toLowerCase();

  if (siblings && siblings.length === 1) {
    return `>${tagName}${addAttr(node)}`;
  } else {
    return `>${getChildIndex(node)}`;
  }
}

// 获取当前节点在父节点中的索引
export function getChildIndex(node) {
  const parent = node.parentElement;
  const siblings = parent.children;
  const tagName = node.tagName.toLowerCase();

  return `${tagName}${addAttr(node)}:nth-child(${Array.prototype.indexOf.call(siblings, node) + 1})`;
}

// 将当前节点的 class 和 id 都加到选择器中
function addAttr(node) {
  return `${getClassName(node)}${getId(node)}`;
}

function getClassName(node) {
  let className = node.attributes.class ? `.${node.attributes.class.value.replace(' ', '.')}` : '';
  if (className) {
    let index = 0;
    if (attrs.has(className)) {
      index = attrs.get(className) + 1;
    }
    attrs.set(className, index);
    className = `${className}-${index}`;
  }

  return className;
}

function getId(node) {
  let id = node.attributes.id ? `#${node.attributes.id.value}` : '';
  if (id) {
    let index = 0;
    if (attrs.has(id)) {
      index = attrs.get(id) + 1;
    }
    attrs.set(id, index);
    id = `${id}-${index}`;
  }

  return id;
}
