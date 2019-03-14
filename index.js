'use strict';
/**
 * @author: tianding.wk
 * @createdTime: 2019-02-11 20:56:19
 * @fileName: index.js
 * @description: entry file
 **/

// module.exports = exports = require('./src/dom.js');
import traverse from './src/dom';

window.Traverse = traverse;
// traverse(document.body);
export default traverse;
