/*!
* rivet-actions - @version 0.0.1

* Copyright (C) 2019 Rachel O'Connor
* SPDX-License-Identifier: BSD-3-Clause
*/

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Example =
/*#__PURE__*/
function () {
  function Example(options) {
    _classCallCheck(this, Example);

    this._handleClick = this._handleClick.bind(this);
    this.init(options);
  }

  _createClass(Example, [{
    key: "_handleClick",
    value: function _handleClick() {
      alert('Button clicked!');
    }
  }, {
    key: "init",
    value: function init(options) {
      document.getElementById(options.id).addEventListener('click', this._handleClick, false);
    }
  }]);

  return Example;
}();

/**
 * Copyright (C) 2019 Rachel O'Connor
 * SPDX-License-Identifier: BSD-3-Clause
 */
var index = {
  Example: Example
};

export default index;
