export function type(value) {
  return Object.prototype.toString
    .call(value)
    .match(/\[object\ (.*)\]/)[1]
    .toLowerCase();
}

export function removeWhiteSpace(array) {
  const dirtyData = ['', ' '];
  return array.filter(item => !dirtyData.includes(item));
}

export function getNumbers(str) {
  return str.match(/\d+/g);
}

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

  return `body ${selector.join('')}`;
}

function getParentSelector(node) {
  const parent = node.parentElement;
  const siblings = parent.children;
  const tagName = node.tagName.toLowerCase();

  if (siblings && siblings.length === 1) {
    return `> ${tagName}`;
  } else {
    return `> ${getChildIndex(node)}`;
  }
}

export function getChildIndex(node) {
  const parent = node.parentElement;
  const tagName = node.tagName.toLowerCase();
  const siblings = parent.children;

  return `:nth-child(${Array.prototype.indexOf.call(siblings, node) + 1})`;
}
