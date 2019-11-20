var MyComponent = (function (exports) {
  'use strict';

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

  var AddOn =
  /*#__PURE__*/
  function () {
    function AddOn(options) {
      _classCallCheck(this, AddOn);

      this._handleClick = this._handleClick.bind(this);
      this.init(options);
    }

    _createClass(AddOn, [{
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

    return AddOn;
  }();

  exports.AddOn = AddOn;

  return exports;

}({}));
