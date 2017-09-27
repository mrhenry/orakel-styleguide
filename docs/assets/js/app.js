(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/slideshow');

},{"./modules/slideshow":2}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _customElementsHelpers = require('custom-elements-helpers');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _customElementsHelpers.defineCustomElement)('mr-slideshow', {
	attributes: [{ attribute: 'loop', type: 'bool' }, { attribute: 'auto', type: 'int' }, { attribute: 'current', type: 'int' }],
	controller: function (_BaseController) {
		_inherits(controller, _BaseController);

		function controller() {
			_classCallCheck(this, controller);

			return _possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		_createClass(controller, [{
			key: 'start',
			value: function start() {
				var _this2 = this;

				this.stop();

				if (this.auto && this.auto > 0) {
					this.looper = setInterval(function () {
						_this2.next();
					}, this.auto);
				}
			}
		}, {
			key: 'stop',
			value: function stop() {
				if (this.looper) {
					clearInterval(this.looper);
					this.looper = null;
				}
			}
		}, {
			key: 'next',
			value: function next() {
				this.current = this.current + 1;
			}
		}, {
			key: 'previous',
			value: function previous() {
				this.current = this.current - 1;
			}
		}, {
			key: 'resolve',
			value: function resolve() {
				if (this.el.children.length === 1) {
					// Keep hanging, don't activate if empty
					return new Promise(function () {});
				}

				return _get(controller.prototype.__proto__ || Object.getPrototypeOf(controller.prototype), 'resolve', this).call(this);
			}
		}, {
			key: 'init',
			value: function init() {
				this.elements = {};
				this.elements.items = Array.from(this.el.children);

				if (!this.current) {
					this.current = 0;
				}

				this.start();
			}
		}, {
			key: 'render',
			value: function render() {
				var _this3 = this;

				this.elements.items.forEach(function (item, i) {
					if (item.classList.contains('is-active')) {
						item.classList.remove('is-active');
					}

					if (i === _this3.current) {
						item.classList.add('is-active');
					}
				});
			}
		}, {
			key: 'destroy',
			value: function destroy() {
				this.stop();
				_get(controller.prototype.__proto__ || Object.getPrototypeOf(controller.prototype), 'destroy', this).call(this);
			}
		}, {
			key: 'current',
			set: function set(to) {
				var parsed = parseInt(to, 10);

				if (parsed === this.current) {
					return;
				}

				var max = this.elements.items.length;

				// If we're at the last slide and navigated 'Next'
				if (parsed >= max) {
					// Back to first slide if carousel has loop set to true
					parsed = this.loop ? 0 : max - 1;
				}

				// If we're at the first slide and navigated 'Previous'
				if (parsed < 0) {
					// Jump to last slide if carousel has loop set to true
					parsed = this.loop ? max - 1 : 0;
				}

				this.el.setAttribute('current', parsed);

				this.render();
			}
		}, {
			key: 'auto',
			set: function set(to) {
				var parsed = parseInt(to, 10);

				if (parsed === this.auto) {
					return;
				}

				if (parsed <= 0) {
					this.el.removeAttribute('auto');
				} else {
					this.el.setAttribute('auto', parsed);
				}

				this.start();
			}
		}]);

		return controller;
	}(_customElementsHelpers.BaseController)
});

},{"custom-elements-helpers":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function parse(name) {
	var clean = name.trim();
	var parts = clean.split(' ');

	var event = clean;
	var selector = null;

	if (parts.length > 1) {
		event = parts.shift();
		selector = parts.join(' ');
	}

	return { event: event, selector: selector };
}

function getPath(e) {
	var path = e.path;

	if (!path) {
		path = [e.target];
		var node = e.target;

		while (node.parentNode) {
			node = node.parentNode;
			path.push(node);
		}
	}

	return path;
}

function promisify(method) {
	return new Promise(function (resolve, reject) {
		var wait = method();

		if (wait instanceof Promise) {
			wait.then(function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				resolve(args);
			}, function () {
				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				reject(args);
			});
		} else {
			resolve(wait);
		}
	});
}

function waitForDOMReady() {
	return new Promise(function (resolve) {
		if (document.readyState === 'complete') {
			resolve();
		} else {
			var handler = function handler() {
				if (document.readyState === 'complete') {
					document.removeEventListener('readystatechange', handler, false);
					resolve();
				}
			};

			document.addEventListener('readystatechange', handler, false);
		}
	});
}

function elementIsInDOM(element) {
	var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;

	if (!element) {
		return false;
	}

	if (element === root) {
		return false;
	}

	return root.contains(element);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var BASE_CONTROLLER_HANDLERS = Symbol('BASE_CONTROLLER_HANDLERS');

var BaseController = function () {
	function BaseController(el) {
		var _this = this;

		classCallCheck(this, BaseController);

		var noop = function noop() {};

		this.el = el;

		this.resolve().then(function () {
			if (!elementIsInDOM(_this.el)) {
				return Promise.reject('The element has disappeared');
			}

			_this.el.classList.add('is-resolved');

			var init = function init() {
				return promisify(function () {
					if (!elementIsInDOM(_this.el)) {
						return Promise.reject('The element has disappeared');
					}

					return _this.init();
				});
			};

			var render = function render() {
				return promisify(function () {
					if (!elementIsInDOM(_this.el)) {
						return Promise.reject('The element has disappeared');
					}

					return _this.render();
				});
			};

			var bind = function bind() {
				return promisify(function () {
					if (!elementIsInDOM(_this.el)) {
						return Promise.reject('The element has disappeared');
					}

					return _this.bind();
				});
			};

			return init().then(function () {
				return render().then(function () {
					return bind().then(function () {
						return _this;
					});
				});
			}).catch(noop);
		}).catch(noop);
	}

	createClass(BaseController, [{
		key: 'destroy',
		value: function destroy() {
			this.el.classList.remove('is-resolved');
		}
	}, {
		key: 'resolve',
		value: function resolve() {
			return waitForDOMReady();
		}
	}, {
		key: 'init',
		value: function init() {}
	}, {
		key: 'render',
		value: function render() {}
	}, {
		key: 'bind',
		value: function bind() {}
	}, {
		key: 'unbind',
		value: function unbind() {
			if (this[BASE_CONTROLLER_HANDLERS]) {
				this[BASE_CONTROLLER_HANDLERS].forEach(function (listener) {
					listener.target.removeEventListener(listener.event, listener.handler, listener.options);
				});

				this[BASE_CONTROLLER_HANDLERS] = [];
			}
		}
	}, {
		key: 'on',
		value: function on(name, handler) {
			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
			var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			this[BASE_CONTROLLER_HANDLERS] = this[BASE_CONTROLLER_HANDLERS] || [];

			var _parseEvent = parse(name),
			    event = _parseEvent.event,
			    selector = _parseEvent.selector;

			var parsedTarget = !target ? this.el : target;

			var wrappedHandler = function wrappedHandler(e) {
				handler(e, e.target);
			};

			if (selector) {
				wrappedHandler = function wrappedHandler(e) {
					var path = getPath(e);

					var matchingTarget = path.find(function (tag) {
						return tag.matches && tag.matches(selector);
					});

					if (matchingTarget) {
						handler(e, matchingTarget);
					}
				};
			}

			var listener = {
				target: parsedTarget,
				selector: selector,
				event: event,
				handler: wrappedHandler,
				options: options
			};

			listener.target.addEventListener(listener.event, listener.handler, listener.options);

			this[BASE_CONTROLLER_HANDLERS].push(listener);

			return this;
		}
	}, {
		key: 'once',
		value: function once(name, handler) {
			var _this2 = this;

			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
			var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			var wrappedHandler = function wrappedHandler(e, matchingTarget) {
				_this2.off(name, target);
				handler(e, matchingTarget);
			};

			this.on(name, wrappedHandler, target, options);
		}
	}, {
		key: 'off',
		value: function off(name) {
			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var _parseEvent2 = parse(name),
			    event = _parseEvent2.event,
			    selector = _parseEvent2.selector;

			var parsedTarget = !target ? this.el : target;

			var listener = this[BASE_CONTROLLER_HANDLERS].find(function (handler) {
				// Selectors don't match
				if (handler.selector !== selector) {
					return false;
				}

				// Event type don't match
				if (handler.event !== event) {
					return false;
				}

				// Passed a target, but the targets don't match
				if (!!parsedTarget && handler.target !== parsedTarget) {
					return false;
				}

				// Else, we found a match
				return true;
			});

			if (!!listener && !!listener.target) {
				this[BASE_CONTROLLER_HANDLERS].splice(this[BASE_CONTROLLER_HANDLERS].indexOf(listener), 1);

				listener.target.removeEventListener(listener.event, listener.handler, listener.options);
			}
		}
	}, {
		key: 'emit',
		value: function emit(name) {
			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var params = Object.assign({
				detail: data,
				bubbles: true,
				cancelable: true
			}, options);

			var event = new CustomEvent(name, params);

			this.el.dispatchEvent(event);
		}
	}]);
	return BaseController;
}();

var convertAttributeToPropertyName = function convertAttributeToPropertyName(attribute) {
	return attribute.split('-').reduce(function (camelcased, part, index) {
		if (index === 0) {
			return part;
		}

		return camelcased + part[0].toUpperCase() + part.substr(1);
	});
};

var addMethod = function addMethod(customElement, name, method) {
	if (typeof customElement.prototype[name] !== 'undefined') {
		console.warn(customElement.name + ' already has a property ' + name);
	}

	customElement.prototype[name] = method;
};

var addGetter = function addGetter(customElement, name, method) {
	var getterName = convertAttributeToPropertyName(name);

	if (typeof customElement.prototype[getterName] !== 'undefined') {
		console.warn(customElement.name + ' already has a property ' + getterName);
	}

	Object.defineProperty(customElement.prototype, getterName, {
		configurable: false,
		get: method
	});
};

var addProperty = function addProperty(customElement, name) {
	var getter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	var setter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

	var propertyName = convertAttributeToPropertyName(name);

	if (typeof customElement.prototype[propertyName] !== 'undefined') {
		console.warn(customElement.name + ' already has a property ' + propertyName);
	}

	var noop = function noop() {};

	var property = {
		configurable: false,
		get: typeof getter === 'function' ? getter : noop,
		set: typeof setter === 'function' ? setter : noop
	};

	var descriptor = Object.getOwnPropertyDescriptor(customElement.prototype, propertyName);

	if (descriptor) {
		if (typeof descriptor.set === 'function') {
			var existing = descriptor.set;

			property.set = function set(to) {
				existing.call(this, to);
			};
		}

		if (typeof descriptor.get === 'function') {
			var generated = property.get;
			var _existing = descriptor.get;

			property.get = function get() {
				var value = _existing.call(this);

				if (typeof value !== 'undefined') {
					return value;
				}

				return generated.call(this);
			};
		}
	}

	Object.defineProperty(customElement.prototype, propertyName, property);
};

var AttrMedia = function () {
	function AttrMedia() {
		classCallCheck(this, AttrMedia);
	}

	createClass(AttrMedia, null, [{
		key: 'attachTo',
		value: function attachTo(customElement) {
			var noop = function noop() {};

			var watchers = {};

			// Adds customElement.media
			// @return string 		Value of `media=""` attribute
			addGetter(customElement, 'media', function getMediaAttribute() {
				return this.el.hasAttribute('media') ? this.el.getAttribute('media') : false;
			});

			// Adds customElement.matchesMedia
			// @return bool 		If the viewport currently matches the specified media query
			addGetter(customElement, 'matchesMedia', function matchesMedia() {
				if (!this.media) {
					return true;
				}

				return 'matchMedia' in window && !!window.matchMedia(this.media).matches;
			});

			// Adds customElements.whenMediaMatches()
			// @return Promise
			addMethod(customElement, 'whenMediaMatches', function whenMediaMatches() {
				var _this = this;

				var defer = new Promise(function (resolve) {
					var handler = function handler(media) {
						if (media.matches) {
							resolve();
							media.removeListener(handler);
						}
					};

					if ('matchMedia' in window) {
						watchers[_this.media] = watchers[_this.media] || window.matchMedia(_this.media);
						watchers[_this.media].addListener(function () {
							return handler(watchers[_this.media]);
						});
						handler(watchers[_this.media]);
					} else {
						resolve();
					}
				});

				return defer;
			});

			// Adds customElements.whenMediaUnmatches()
			// @return Promise
			addMethod(customElement, 'whenMediaUnmatches', function whenMediaUnmatches() {
				var _this2 = this;

				var defer = new Promise(function (resolve) {
					var handler = function handler(media) {
						if (media.matches) {
							resolve();
							media.removeListener(handler);
						}
					};

					if ('matchMedia' in window) {
						watchers[_this2.media] = watchers[_this2.media] || window.matchMedia(_this2.media);
						watchers[_this2.media].addListener(function () {
							return handler(watchers[_this2.media]);
						});
						handler(watchers[_this2.media]);
					} else {
						resolve();
					}
				});

				return defer;
			});

			addMethod(customElement, 'watchMedia', function watchMedia() {
				var _this3 = this;

				var match = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;
				var unmatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

				var handler = function handler(media) {
					if (media.matches) {
						match();
					} else {
						unmatch();
					}
				};

				if ('matchMedia' in window) {
					watchers[this.media] = watchers[this.media] || window.matchMedia(this.media);
					watchers[this.media].addListener(function () {
						return handler(watchers[_this3.media]);
					});
					handler(watchers[this.media]);
				}
			});
		}
	}]);
	return AttrMedia;
}();

var AttrTouchHover = function () {
	function AttrTouchHover() {
		classCallCheck(this, AttrTouchHover);
	}

	createClass(AttrTouchHover, null, [{
		key: 'attachTo',
		value: function attachTo(customElement) {
			var isTouch = false;
			var isTouched = false;

			var touchClass = 'is-touch';
			var hoverClass = 'is-touch-hover';

			addGetter(customElement, 'touchHover', function getTouchHoverAttribute() {
				if (this.el.hasAttribute('touch-hover')) {
					// @todo - Support different values for touch-hover
					// `auto`        detect based on element
					// `toggle`      always toggle hover on/off (this might block clicks)
					// `passthrough` ignore hover, directly trigger action
					return 'auto';
				}

				return false;
			});

			addMethod(customElement, 'enableTouchHover', function enableTouchHover() {
				var _this = this;

				this.on('touchstart', function () {
					isTouch = true;
					_this.el.classList.add(touchClass);
				}, this.el, { useCapture: true });

				this.on('touchstart', function (e) {
					var path = getPath(e);

					// Remove hover when tapping outside the DOM node
					if (isTouched && !path.includes(_this.el)) {
						isTouch = false;
						isTouched = false;
						_this.el.classList.remove(hoverClass);
					}
				}, document.body, { useCapture: true });

				this.on('click', function (e) {
					if (_this.touchHover) {
						var hasAction = _this.el.getAttribute('href') !== '#';

						if (!isTouched && !hasAction) {
							e.preventDefault();
						}

						if (isTouch) {
							if (hasAction) {
								if (!isTouched) {
									// First tap, enable hover, block tap
									e.preventDefault();
									isTouched = true;
								} else {
									// Second tap, don't block tap, disable hover
									isTouched = false;
								}
							} else {
								// Act as a simple on/off switch
								isTouched = !isTouched;
							}

							_this.el.classList.toggle(hoverClass, isTouched);
						}
					}
				}, this.el, { useCapture: true });
			});
		}
	}]);
	return AttrTouchHover;
}();

var parseResponse = function parseResponse(res) {
	var data = function parseResonseToData() {
		// Force lowercase keys
		if ((typeof res === 'undefined' ? 'undefined' : _typeof(res)) === 'object') {
			return Object.entries(res).reduce(function (object, _ref) {
				var _ref2 = slicedToArray(_ref, 2),
				    key = _ref2[0],
				    value = _ref2[1];

				var lowercaseKey = key.toLowerCase();

				Object.assign(object, defineProperty({}, lowercaseKey, value));

				return object;
			}, {});
		}

		return res;
	}();

	var status = function parseResponseToStatus() {
		if (data.status) {
			return parseInt(data.status, 10);
		}

		if (parseInt(data, 10).toString() === data.toString()) {
			return parseInt(data, 10);
		}

		return 200;
	}();

	return { status: status, data: data };
};

var fetchJSONP = function fetchJSONP(url) {
	return new Promise(function (resolve, reject) {
		// Register a global callback
		// Make sure we have a unique function name
		var now = new Date().getTime();
		var callback = 'AJAX_FORM_CALLBACK_' + now;

		window[callback] = function (res) {
			// Make the callback a noop
			// so it triggers only once (just in case)
			window[callback] = function () {};

			// Clean up after ourselves
			var script = document.getElementById(callback);
			script.parentNode.removeChild(script);

			var _parseResponse = parseResponse(res),
			    status = _parseResponse.status,
			    data = _parseResponse.data;

			// If res is only a status code


			if (status >= 200 && status <= 399) {
				return resolve(data);
			}

			return reject(data);
		};

		var script = document.createElement('script');
		script.id = callback;
		script.src = url + '&callback=' + callback;
		document.head.appendChild(script);
	});
};

var convertFormDataToQuerystring = function convertFormDataToQuerystring(values) {
	return Array.from(values, function (_ref) {
		var _ref2 = slicedToArray(_ref, 2),
		    key = _ref2[0],
		    raw = _ref2[1];

		if (raw) {
			var value = window.encodeURIComponent(raw);
			return key + '=' + value;
		}

		return '';
	}).join('&');
};

var ajaxForm = {
	attributes: [{ attribute: 'jsonp', type: 'bool' }],
	controller: function (_BaseController) {
		inherits(controller, _BaseController);

		function controller() {
			classCallCheck(this, controller);
			return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		createClass(controller, [{
			key: 'init',
			value: function init() {
				this.elements = this.elements || {};
				this.elements.form = this.el.getElementsByTagName('form')[0];
				this.elements.successMessage = this.el.getElementsByClassName('js-ajax-form-success')[0];
				this.elements.errorMessage = this.el.getElementsByClassName('js-ajax-form-error')[0];

				if (!this.elements.form) {
					console.warn('Activated MrAjaxForm without a form');
				} else {
					this.elements.fields = this.elements.form.getElementsByTagName('input');
				}
			}
		}, {
			key: 'render',
			value: function render() {
				// We can disable the HTML5 front-end validation
				// and handle it more gracefully in JS
				// @todo
				this.elements.form.setAttribute('novalidate', 'novalidate');
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this2 = this;

				var reset = function reset() {
					if (_this2.elements.successMessage) {
						_this2.elements.successMessage.setAttribute('hidden', 'hidden');
					}

					if (_this2.elements.errorMessage) {
						_this2.elements.errorMessage.setAttribute('hidden', 'hidden');
					}
				};

				this.on('submit', function (e) {
					e.preventDefault();

					reset();

					var _prepare = _this2.prepare(_this2.method),
					    url = _prepare.url,
					    params = _prepare.params;

					_this2.submit(url, params).then(function (data) {
						_this2.onSuccess(data);
					}, function (err) {
						_this2.onError(err);
					});
				}, this.elements.form);
			}
		}, {
			key: 'prepare',
			value: function prepare(method) {
				var _this3 = this;

				var get$$1 = function get$$1() {
					var querystring = convertFormDataToQuerystring(_this3.values);
					var url = _this3.action + '?' + querystring;
					var params = {
						method: 'GET',
						headers: new Headers({
							'Content-Type': 'application/json'
						})
					};

					return { url: url, params: params };
				};

				var post = function post() {
					var url = _this3.action;
					var params = {
						method: 'POST',
						headers: new Headers({
							'Content-Type': 'application/x-www-form-urlencoded'
						})
					};

					return { url: url, params: params };
				};

				if (method.toUpperCase() === 'GET') {
					return get$$1();
				}

				if (method.toUpperCase() === 'POST') {
					return post();
				}

				return { url: '/', params: { method: 'GET' } };
			}
		}, {
			key: 'submit',
			value: function submit(url) {
				var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

				if (this.jsonp) {
					return fetchJSONP(url);
				}

				return fetch(url, params).then(function (res) {
					if (res.status && res.status === 200) {
						return res;
					}

					var error = new Error(res.statusText);
					throw error;
				}).then(function (res) {
					var type = res.headers.get('Content-Type');

					if (type && type.includes('application/json')) {
						return res.json();
					}

					return res.text();
				});
			}

			// eslint-disable-next-line no-unused-vars

		}, {
			key: 'onSuccess',
			value: function onSuccess(res) {
				if (this.elements.successMessage) {
					this.elements.successMessage.removeAttribute('hidden');
				}

				this.elements.form.parentNode.removeChild(this.elements.form);
			}

			// eslint-disable-next-line no-unused-vars

		}, {
			key: 'onError',
			value: function onError(err) {
				if (this.elements.errorMessage) {
					this.elements.errorMessage.removeAttribute('hidden');
				}
			}
		}, {
			key: 'action',
			get: function get$$1() {
				return this.elements.form.action;
			}
		}, {
			key: 'method',
			get: function get$$1() {
				if (this.jsonp) {
					return 'GET';
				}

				return (this.elements.form.method || 'POST').toUpperCase();
			}
		}, {
			key: 'values',
			get: function get$$1() {
				return new FormData(this.elements.form);
			}
		}]);
		return controller;
	}(BaseController)
};

var keyTrigger = {
	attributes: [{ attribute: 'key', type: 'int' }],
	controller: function (_BaseController) {
		inherits(controller, _BaseController);

		function controller() {
			classCallCheck(this, controller);
			return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		createClass(controller, [{
			key: 'init',
			value: function init() {
				this.elements = this.elements || {};

				if (this.el.hasAttribute('href')) {
					this.elements.target = this;
				} else {
					this.elements.target = this.el.querySelector('[href]');
				}

				return this;
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this2 = this;

				if (this.elements.target) {
					this.on('keyup', function (e) {
						if (e.which === _this2.key) {
							e.preventDefault();
							e.stopPropagation();

							_this2.elements.target.click();
						}
					}, document.body);
				}

				return this;
			}
		}]);
		return controller;
	}(BaseController)
};

var parseMetaTag = function parseMetaTag() {
	var blacklist = ['viewport'];

	return function parse(tag) {
		var name = tag.getAttribute('name');
		var property = tag.getAttribute('property');
		var content = tag.getAttribute('content');

		if (!name && !property) {
			return false;
		}

		if (blacklist.includes(name)) {
			return false;
		}

		return { name: name, property: property, content: content };
	};
}();

var parseHTML = function parseHTML() {
	var parser = new DOMParser();

	return function parse(html) {
		var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		var parsed = parser.parseFromString(html, 'text/html');

		// Get document title
		var title = parsed.title;

		// Get document nodes
		var content = parsed.body;

		if (selector) {
			content = parsed.body.querySelector(selector);

			if (!content) {
				throw new Error('not-found');
			}
		}

		// Get document meta
		var meta = Array.from(parsed.head.querySelectorAll('meta'), function (tag) {
			return parseMetaTag(tag);
		}).filter(function (t) {
			return !!t;
		});

		return { title: title, content: content, meta: meta };
	};
}();

function renderNodes(content, container) {
	while (container.hasChildNodes()) {
		container.removeChild(container.firstChild);
	}

	for (var i = content.children.length - 1; i >= 0; i -= 1) {
		var child = content.children[i];

		Array.from(content.getElementsByTagName('img'), function (img) {
			var clone = document.createElement('img');
			clone.src = img.src;
			clone.sizes = img.sizes;
			clone.srcset = img.srcset;
			clone.className = img.className;

			if (img.getAttribute('width')) {
				clone.width = img.width;
			}

			if (img.getAttribute('height')) {
				clone.height = img.height;
			}

			img.parentNode.replaceChild(clone, img);

			return clone;
		});

		if (container.firstChild) {
			container.insertBefore(child, container.firstChild);
		} else {
			container.appendChild(child);
		}
	}
}

function cleanNodes(nodes, selector) {
	if (!selector || Array.isArray(selector) && selector.length === 0) {
		return nodes;
	}

	var stringSelector = Array.isArray(selector) ? selector.join(', ') : selector;

	var bloat = Array.from(nodes.querySelectorAll(stringSelector));

	bloat.forEach(function (node) {
		return node.parentNode.removeChild(node);
	});

	return nodes;
}

var overlay = {
	attributes: [],
	controller: function (_BaseController) {
		inherits(controller, _BaseController);

		function controller() {
			classCallCheck(this, controller);
			return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		createClass(controller, [{
			key: 'init',
			value: function init() {
				// Store the original classes so we can always revert back to the default state
				// while rendering in different aspects
				this.originalClasses = Array.from(this.el.classList);

				this.stripFromResponse = ['link[rel="up"]', this.el.tagName];
			}

			/**
    * This method gets run when a `<mr-overlay>`
    * appears in the DOM, either after DOM ready
    * or when HTML gets attached later on in the browsing session
    */

		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;

				// Store the original classes so we can always revert back to the default state
				// while rendering in different aspects
				this.originalClasses = Array.from(this.el.classList);

				// Add <link rel="up" href="/"> inside an overlay to fetch a background view
				var upLink = this.el.querySelector('link[rel="up"]');

				if (upLink) {
					var href = upLink.getAttribute('href');

					fetch(href, { credentials: 'include' }).then(function (res) {
						return res.text();
					}).then(function (html) {
						var _parseHTML = parseHTML(html),
						    title = _parseHTML.title,
						    content = _parseHTML.content;

						if (content) {
							if (content.getElementsByTagName(_this2.el.tagName)[0]) {
								var classList = content.getElementsByTagName(_this2.el.tagName)[0].classList;
								_this2.originalClasses = Array.from(classList);
							}

							var fragment = document.createDocumentFragment();

							// Clean certain selectors from the up state to avoid infinite loops
							var clean = cleanNodes(content, _this2.stripFromResponse);

							renderNodes(clean, fragment);

							_this2.el.parentNode.insertBefore(fragment, _this2.el);

							// The upState is not the overlay view but the background view
							_this2.upState = {
								href: href,
								title: title,
								root: true,
								by: _this2.el.tagName
							};

							// We need to replace the current state to handle `popstate`
							var state = {
								href: window.location.href,
								title: document.title,
								root: false,
								by: _this2.el.tagName
							};

							window.history.replaceState(state, state.title, state.href);

							// Set isShown so that the closing handler works correctly
							_this2.isShown = true;
						}
					});
				} else {
					// Currently not inside an overlay view, but an overlay might open
					// (because an empty <mr-overlay> is present)
					// so we store the current state to support `popstate` events
					var title = document.title;
					var _href = window.location.href;

					this.upState = {
						href: _href,
						title: title,
						root: true,
						by: this.el.tagName
					};

					window.history.replaceState(this.upState, title, _href);
				}

				return this;
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this3 = this;

				var hideHandler = function hideHandler(e) {
					if (_this3.isShown) {
						e.preventDefault();

						_this3.hide();

						if (_this3.upState) {
							var _upState = _this3.upState,
							    title = _upState.title,
							    href = _upState.href;


							window.history.pushState(_this3.upState, title, href);
							document.title = title;
						}
					}
				};

				this.on('click', function (e) {
					if (e.target === _this3.el) {
						hideHandler(e);
					}
				}, this.el);

				this.on('click .js-overlay-show', function (e, target) {
					var href = target.href;

					if (href) {
						e.preventDefault();
						_this3.show(href);
					}
				}, document.body);

				this.on('click .js-overlay-hide', function (e) {
					hideHandler(e);
				}, document.body);

				this.on('popstate', function (e) {
					// Only handle states that were set by `mr-overlay`
					// to avoid messing with other elements that use the History API
					if (e.state && e.state.by === _this3.el.tagName && e.state.href) {
						var _e$state = e.state,
						    href = _e$state.href,
						    title = _e$state.title;
						var _upState2 = _this3.upState,
						    upHref = _upState2.href,
						    upTitle = _upState2.title;

						var hasRequestedUpState = href === upHref && title === upTitle;

						if (e.state.root && hasRequestedUpState) {
							// Trigger hide() if the popstate requests the root view
							_this3.hide();
							document.title = _this3.upState.title;
						} else {
							// Show the overlay() if we closed the overlay before
							_this3.show(e.state.href, false);
						}
					}
				}, window);

				return this;
			}
		}, {
			key: 'show',
			value: function show(href) {
				var _this4 = this;

				var pushState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

				var updateMetaTags = function updateMetaTags(tags) {
					tags.forEach(function (tag) {
						var selector = 'meta';

						if (tag.property) {
							selector = selector + '[property="' + tag.property + '"]';
						}

						if (tag.name) {
							selector = selector + '[name="' + tag.name + '"]';
						}

						var match = document.head.querySelector(selector);

						if (match) {
							match.setAttribute('content', tag.content);
						} else {
							var append = document.createElement('meta');
							append.property = tag.property;
							append.content = tag.content;
							append.name = tag.name;
							document.head.appendChild(append);
						}
					});
				};

				var renderContent = function renderContent(content) {
					var newClasses = Array.from(content.classList);
					_this4.el.className = '';
					// This crashes in IE11
					// this.el.classList.add(...newClasses);
					newClasses.forEach(function (c) {
						return _this4.el.classList.add(c);
					});

					_this4.isShown = true;

					// Clean certain selectors from the up state to avoid infinite loops
					var clean = cleanNodes(content, _this4.stripFromResponse);

					renderNodes(clean, _this4.el);

					window.requestAnimationFrame(function () {
						_this4.el.scrollTop = 0;
					});
				};

				var updateTitle = function updateTitle(title) {
					document.title = title;
				};

				return fetch(href, { credentials: 'include' }).then(function (res) {
					return res.text();
				}).then(function (html) {
					var _parseHTML2 = parseHTML(html, _this4.el.tagName),
					    title = _parseHTML2.title,
					    content = _parseHTML2.content,
					    meta = _parseHTML2.meta;

					updateMetaTags(meta);

					if (content) {
						renderContent(content);
						updateTitle(title);

						if (pushState) {
							var state = { href: href, title: title, by: _this4.el.tagName };
							window.history.pushState(state, title, href);
						}
					}
				});
			}
		}, {
			key: 'hide',
			value: function hide() {
				var _this5 = this;

				this.isShown = false;

				while (this.el.hasChildNodes()) {
					this.el.removeChild(this.el.firstChild);
				}

				if (this.originalClasses && Array.isArray(this.originalClasses)) {
					this.el.className = '';

					// This crashes in IE11
					// this.el.classList.add(...this.originalClasses);
					this.originalClasses.forEach(function (c) {
						return _this5.el.classList.add(c);
					});
				}
			}
		}, {
			key: 'isShown',

			/**
    * `isShown` is a boolean that tracks
    * if the overlay is currently open or not
    * */
			get: function get$$1() {
				return !!this._isShown;
			},
			set: function set$$1(to) {
				this._isShown = !!to;
				this.el.classList.toggle('is-hidden', !this._isShown);
				this.el.classList.toggle('is-shown', this._isShown);
				document.body.classList.toggle('is-showing-overlay', this._isShown);
			}

			/**
    * Original state is the History API state for the parent page
    * (the page below the overlay)
    * (not neccesarily the first page that was loaded)
    * */

		}, {
			key: 'upState',
			get: function get$$1() {
				return Object.assign({}, this._upState);
			},
			set: function set$$1(to) {
				this._upState = Object.assign({}, to);
			}
		}]);
		return controller;
	}(BaseController)
};

var getMetaValues = function getMetaValues() {
	var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.head;
	var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	var extractKey = function extractKey(tag) {
		var raw = tag.getAttribute('name');

		if (!raw) {
			raw = tag.getAttribute('property');
		}

		var stripped = raw.match(/^(?:.*:)?(.*)$/i);

		if (stripped) {
			return stripped[1];
		}

		return null;
	};

	var tags = [].concat(toConsumableArray(node.querySelectorAll('meta' + selector)));

	// Get <meta> values
	return tags.reduce(function (carry, tag) {
		var key = extractKey(tag);

		if (key) {
			var value = tag.getAttribute('content');
			Object.assign(carry, defineProperty({}, key, value));
		}

		return carry;
	}, {});
};

var generateQuerystring = function generateQuerystring(params) {
	var querystring = Object.entries(params).map(function (_ref) {
		var _ref2 = slicedToArray(_ref, 2),
		    key = _ref2[0],
		    value = _ref2[1];

		if (value) {
			var encoded = window.encodeURIComponent(value);
			return key + '=' + encoded;
		}

		return '';
	}).filter(function (param) {
		return !!param;
	}).join('&');

	if (querystring.length > 0) {
		return '?' + querystring;
	}

	return '';
};

var openWindow = function openWindow(href) {
	var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var querystring = generateQuerystring(params);
	var name = options.name,
	    invisible = options.invisible;


	if (invisible) {
		window.location = '' + href + querystring;
		return;
	}

	var width = options.width,
	    height = options.height;


	width = width || 560;
	height = height || 420;

	var x = Math.round((window.innerWidth - width) / 2);
	var y = Math.round((window.innerHeight - height) / 2);

	var popup = window.open('' + href + querystring, name, 'width=' + width + ', height=' + height + ', left=' + x + ', top=' + y);

	if (typeof popup.focus === 'function') {
		popup.focus();
	}
};

var share = {
	attributes: [],
	controller: function (_BaseController) {
		inherits(controller, _BaseController);

		function controller() {
			classCallCheck(this, controller);
			return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		createClass(controller, [{
			key: 'init',
			value: function init() {
				this.elements = {};

				this.elements.facebook = this.el.getElementsByClassName('js-share-facebook')[0];
				this.elements.twitter = this.el.getElementsByClassName('js-share-twitter')[0];
				this.elements.pinterest = this.el.getElementsByClassName('js-share-pinterest')[0];
				this.elements.mail = this.el.getElementsByClassName('js-share-mail')[0];

				return this;
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this2 = this;

				if (this.elements.facebook) {
					this.on('click', function (e) {
						e.stopPropagation();
						_this2.shareOnFacebook();
					}, this.elements.facebook);
				}

				if (this.elements.twitter) {
					this.on('click', function (e) {
						e.stopPropagation();
						_this2.shareOnTwitter();
					}, this.elements.twitter);
				}

				if (this.elements.pinterest) {
					this.on('click', function (e) {
						e.stopPropagation();
						_this2.shareOnPinterest();
					}, this.elements.pinterest);
				}

				if (this.elements.mail) {
					this.on('click', function (e) {
						e.stopPropagation();
						_this2.shareViaMail();
					}, this.elements.mail);
				}

				return this;
			}
		}, {
			key: 'shareOnFacebook',
			value: function shareOnFacebook() {
				var values = getMetaValues(document.head, '[property^="og:"]');

				var params = {
					u: values.url || this.url,
					title: values.title || this.title,
					caption: values.site_name,
					description: values.description || this.description
				};

				var isAbsoluteUrl = /^(https?:)?\/\//i;

				if (isAbsoluteUrl.test(values.image)) {
					params.picture = values.image;
				}

				openWindow('https://www.facebook.com/sharer.php', params, { name: 'Share on Facebook', width: 560, height: 630 });
			}
		}, {
			key: 'shareOnPinterest',
			value: function shareOnPinterest() {
				var values = getMetaValues(document.head, '[property^="og:"]');

				var params = {
					url: values.url || this.url,
					description: values.description || this.description,
					toolbar: 'no',
					media: values.image
				};

				openWindow('https://www.pinterest.com/pin/create/button', params, { name: 'Share on Pinterest', width: 740, height: 700 });
			}
		}, {
			key: 'shareOnTwitter',
			value: function shareOnTwitter() {
				var values = getMetaValues(document.head, '[name^="twitter:"]');

				var params = {
					url: values.url || this.url,
					text: values.title || this.title,
					via: values.site ? values.site.replace('@', '') : undefined
				};

				openWindow('https://twitter.com/intent/tweet', params, { name: 'Share on Twitter', width: 580, height: 253 });
			}
		}, {
			key: 'shareViaMail',
			value: function shareViaMail() {
				var params = {
					subject: this.title,
					body: this.title + ' (' + this.url + ') - ' + this.description
				};

				openWindow('mailto:', params, { invisible: true });
			}
		}, {
			key: 'title',
			get: function get$$1() {
				var attribute = this.el.getAttribute('mr-share-title');
				var fallback = document.title;
				return attribute || fallback;
			}
		}, {
			key: 'description',
			get: function get$$1() {
				var attribute = this.el.getAttribute('mr-share-description');
				var fallback = '';

				var tag = document.head.querySelector('meta[name="description"');

				if (tag) {
					fallback = tag.getAttribute('content');
				}

				return attribute || fallback;
			}
		}, {
			key: 'url',
			get: function get$$1() {
				var attribute = this.el.getAttribute('mr-share-url');
				var fallback = window.location.href;

				var tag = document.head.querySelector('link[rel="canonical"]');

				if (tag) {
					fallback = tag.getAttribute('href');
				}

				return attribute || fallback;
			}
		}]);
		return controller;
	}(BaseController)
};

var smoothState = {
	attributes: [],
	controller: function (_BaseController) {
		inherits(controller, _BaseController);

		function controller() {
			classCallCheck(this, controller);
			return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		createClass(controller, [{
			key: 'addToPath',
			value: function addToPath(href) {
				// Make sure `href` is an absolute path from the / root of the current site
				var absolutePath = href.replace(window.location.origin, '');
				absolutePath = absolutePath[0] !== '/' ? '/' + absolutePath : absolutePath;

				this._path = this._path || [];

				var from = void 0;

				if (this._path.length > 0) {
					from = this._path[this._path.length - 1].to;
				}

				var pathEntry = {
					from: from,
					to: absolutePath
				};

				this._path.push(pathEntry);

				return this;
			}
		}, {
			key: 'removeLatestFromPath',
			value: function removeLatestFromPath() {
				(this._path || []).pop();
				return this;
			}
		}, {
			key: 'pushState',
			value: function pushState(href) {
				var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
				var addToPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

				var state = { href: href, title: title };

				window.history.pushState(state, title, href);

				if (addToPath) {
					this.addToPath(href);
				}

				return this;
			}
		}, {
			key: 'replaceState',
			value: function replaceState(href) {
				var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
				var addToPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

				var state = { href: href, title: title };

				window.history.replaceState(state, title, href);

				if (addToPath) {
					this.addToPath(href);
				}

				return this;
			}
		}, {
			key: 'init',
			value: function init() {
				var href = window.location.href;
				var title = document.title;

				this.replaceState(href, title);

				return this;
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this2 = this;

				this.on('popstate', function (e) {
					if (e.state && e.state.href) {
						_this2.goTo(e.state.href, false).catch(function (err) {
							console.warn('Could not run popstate to', e.state.href);
							console.warn('Error:', err);
						});
					}
				}, window);

				this.on('click a', function (e, target) {
					if (target.classList && target.classList.contains('js-mr-smooth-state-disable')) {
						return;
					}

					// Avoid cross-origin calls
					if (!target.hostname || target.hostname !== window.location.hostname) {
						return;
					}

					var href = target.getAttribute('href');

					if (!href) {
						console.warn('Click on link without href');
						return;
					}

					e.preventDefault();
					e.stopPropagation();

					_this2.goTo(href).catch(function (err) {
						console.warn('Could not navigate to', href);
						console.warn('Error:', err);
					});
				}, document.body);
			}
		}, {
			key: 'goTo',
			value: function goTo(href) {
				var _this3 = this;

				var pushState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

				return new Promise(function (resolve, reject) {
					window.dispatchEvent(new CustomEvent('smoothState:before'));

					document.body.classList.add('is-loading');

					_this3.addToPath(href);

					var cancel = function cancel(err) {
						_this3.removeLatestFromPath();
						reject(err);
					};

					var transition = {};
					transition.container = _this3.el;
					transition.path = Object.assign(_this3.latestPathEntry);

					return _this3.onBefore(transition).then(function () {
						fetch(href, { credentials: 'include' }).then(function (res) {
							return res.text();
						}).then(function (html) {
							var _parseHTML = parseHTML(html, 'mr-smooth-state'),
							    title = _parseHTML.title,
							    content = _parseHTML.content;

							window.dispatchEvent(new CustomEvent('smoothState:start'));

							transition.fetched = { title: title, content: content };

							_this3.onStart(transition).then(function () {
								window.dispatchEvent(new CustomEvent('smoothState:ready'));

								_this3.onReady(transition).then(function () {
									var _transition$fetched = transition.fetched,
									    verifiedTitle = _transition$fetched.title,
									    verifiedContent = _transition$fetched.content;


									window.requestAnimationFrame(function () {
										renderNodes(verifiedContent, _this3.el);
										document.title = verifiedTitle;

										if (pushState) {
											// Don't add the state to the path
											_this3.pushState(href, verifiedTitle, false);
										}

										window.requestAnimationFrame(function () {
											document.body.classList.remove('is-loading');

											window.dispatchEvent(new CustomEvent('smoothState:after'));

											// You can't cancel the transition after the pushState
											// So we also resolve inside the catch
											_this3.onAfter(transition).then(function () {
												return resolve();
											}).catch(function () {
												return resolve();
											});
										});
									});
								}).catch(function (err) {
									return cancel(err);
								});
							}).catch(function (err) {
								return cancel(err);
							});
						}).catch(function (err) {
							return cancel(err);
						});
					}).catch(function (err) {
						return cancel(err);
					});
				});
			}
		}, {
			key: 'onBefore',
			value: function onBefore(transition) {
				return Promise.resolve(transition);
			}
		}, {
			key: 'onStart',
			value: function onStart(transition) {
				return Promise.resolve(transition);
			}
		}, {
			key: 'onReady',
			value: function onReady(transition) {
				return Promise.resolve(transition);
			}
		}, {
			key: 'onAfter',
			value: function onAfter(transition) {
				return Promise.resolve(transition);
			}
		}, {
			key: 'path',
			get: function get$$1() {
				return this._path || [];
			}
		}, {
			key: 'latestPathEntry',
			get: function get$$1() {
				var length = this.path.length;

				if (length > 0) {
					return this.path[length - 1];
				}

				return undefined;
			}
		}]);
		return controller;
	}(BaseController)
};

var timeAgo = {
	attributes: ['datetime'],
	controller: function (_BaseController) {
		inherits(controller, _BaseController);

		function controller() {
			classCallCheck(this, controller);
			return possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		createClass(controller, [{
			key: 'resolve',
			value: function resolve() {
				// No need to wait for window.onload
				return Promise.resolve(true);
			}
		}, {
			key: 'init',
			value: function init() {
				this.translations = {
					ago: 'ago',
					year: ['year', 'years'],
					month: ['month', 'months'],
					week: ['week', 'weeks'],
					day: ['day', 'days'],
					hour: ['hour', 'hours'],
					minute: ['minute', 'minutes'],
					second: ['second', 'seconds']
				};
			}
		}, {
			key: 'getCountedNoun',
			value: function getCountedNoun(key) {
				var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

				if (!this.translations[key]) {
					return false;
				}

				if (typeof this.translations[key] === 'string') {
					return this.translations[key];
				}

				if (count === 1) {
					return this.translations[key][0];
				}

				return this.translations[key][1];
			}
		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;

				var makeReadable = function makeReadable(datetime) {
					var date = new Date(datetime);
					var time = date.getTime();
					var now = new Date();
					var calculated = void 0;

					if (!isNaN(time)) {
						var diff = Math.floor(now.getTime() - time);

						calculated = {};
						calculated.seconds = Math.round(diff / 1000);
						calculated.minutes = Math.round(calculated.seconds / 60);
						calculated.hours = Math.round(calculated.minutes / 60);
						calculated.days = Math.round(calculated.hours / 24);
						calculated.weeks = Math.round(calculated.days / 7);
						calculated.months = Math.round(calculated.weeks / 4);
						calculated.years = Math.round(calculated.months / 12);
					}

					if (calculated) {
						if (calculated.months > 12) {
							var years = _this2.getCountedNoun('year', calculated.years);
							return calculated.years + ' ' + years + ' ' + _this2.translations.ago;
						} else if (calculated.weeks > 7) {
							var months = _this2.getCountedNoun('month', calculated.months);
							return calculated.months + ' ' + months + ' ' + _this2.translations.ago;
						} else if (calculated.days > 21) {
							var weeks = _this2.getCountedNoun('week', calculated.weeks);
							return calculated.weeks + ' ' + weeks + ' ' + _this2.translations.ago;
						} else if (calculated.hours > 24) {
							var days = _this2.getCountedNoun('day', calculated.days);
							return calculated.days + ' ' + days + ' ' + _this2.translations.ago;
						} else if (calculated.minutes > 60) {
							var hours = _this2.getCountedNoun('hour', calculated.hours);
							return calculated.hours + ' ' + hours + ' ' + _this2.translations.ago;
						} else if (calculated.seconds > 60) {
							var minutes = _this2.getCountedNoun('minute', calculated.minutes);
							return calculated.minutes + ' ' + minutes + ' ' + _this2.translations.ago;
						}

						var seconds = _this2.getCountedNoun('second', calculated.seconds);
						return calculated.seconds + ' ' + seconds + ' ' + _this2.translations.ago;
					}

					// Do nothing if we can't calculate a time diff
					return _this2.el.textContent;
				};

				this.el.textContent = makeReadable(this.datetime);

				return this;
			}
		}]);
		return controller;
	}(BaseController)
};

var noop = function noop() {};

var generateStringAttributeMethods = function generateStringAttributeMethods(attribute) {
	var getter = function getter() {
		return this.el.getAttribute(attribute) || undefined;
	};

	var setter = function setter(to) {
		var parsed = to && to.toString ? to.toString() : undefined;
		var oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (parsed) {
			this.el.setAttribute(attribute, parsed);
		} else {
			this.el.removeAttribute(attribute);
		}
	};

	return { getter: getter, setter: setter };
};

var generateBoolAttributeMethods = function generateBoolAttributeMethods(attribute) {
	var getter = function getter() {
		return !!this.el.hasAttribute(attribute);
	};

	var setter = function setter(to) {
		var parsed = typeof to === 'string' || !!to;
		var oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (parsed) {
			this.el.setAttribute(attribute, '');
		} else {
			this.el.removeAttribute(attribute);
		}
	};

	return { getter: getter, setter: setter };
};

var generateIntegerAttributeMethods = function generateIntegerAttributeMethods(attribute) {
	var getter = function getter() {
		return parseInt(this.el.getAttribute(attribute), 10);
	};

	var setter = function setter(to) {
		var parsed = parseInt(to, 10);
		var oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (!Number.isNaN(parsed)) {
			this.el.setAttribute(attribute, parsed);
		} else {
			console.warn('Could not set ' + attribute + ' to ' + to);
			this.el.removeAttribute(attribute);
		}
	};

	return { getter: getter, setter: setter };
};

var generateNumberAttributeMethods = function generateNumberAttributeMethods(attribute) {
	var getter = function getter() {
		return parseFloat(this.el.getAttribute(attribute));
	};

	var setter = function setter(to) {
		var parsed = parseFloat(to);
		var oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (!Number.isNaN(parsed)) {
			this.el.setAttribute(attribute, parsed);
		} else {
			console.warn('Could not set ' + attribute + ' to ' + to);
			this.el.removeAttribute(attribute);
		}
	};

	return { getter: getter, setter: setter };
};

var generateAttributeMethods = function generateAttributeMethods(attribute) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'string';

	if (type === 'bool') {
		return generateBoolAttributeMethods(attribute);
	} else if (type === 'int' || type === 'integer') {
		return generateIntegerAttributeMethods(attribute);
	} else if (type === 'float' || type === 'number') {
		return generateNumberAttributeMethods(attribute);
	} else if (type === 'string') {
		return generateStringAttributeMethods(attribute);
	}
	return { getter: noop, setter: noop };
};

var CONTROLLER = Symbol('controller');

var registerElement = function registerElement(tag, options) {
	var observedAttributes = options.observedAttributes || [];

	customElements.define(tag, function (_HTMLElement) {
		inherits(_class, _HTMLElement);
		createClass(_class, [{
			key: 'attributeChangedCallback',
			value: function attributeChangedCallback(attribute, oldValue, newValue) {
				if (oldValue === newValue) {
					return;
				}

				if (!this[CONTROLLER]) {
					return;
				}

				var propertyName = convertAttributeToPropertyName(attribute);

				var prototype = Object.getPrototypeOf(this[CONTROLLER]);
				var descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);

				if (descriptor && descriptor.set) {
					this[CONTROLLER][propertyName] = newValue;
				}

				// If for argument `current` the method
				// `currentChangedCallback` exists, trigger
				var callback = this[CONTROLLER][propertyName + 'ChangedCallback'];

				if (typeof callback === 'function') {
					callback.call(this[CONTROLLER], oldValue, newValue);
				}
			}
		}], [{
			key: 'observedAttributes',
			get: function get$$1() {
				return observedAttributes;
			}
		}]);

		function _class() {
			classCallCheck(this, _class);

			var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

			observedAttributes.forEach(function (attribute) {
				if (typeof _this[attribute] !== 'undefined') {
					console.warn('Requested syncing on attribute \'' + attribute + '\' that already has defined behavior');
				}

				Object.defineProperty(_this, attribute, {
					configurable: false,
					enumerable: false,
					get: function get$$1() {
						return _this[CONTROLLER][attribute];
					},
					set: function set$$1(to) {
						_this[CONTROLLER][attribute] = to;
					}
				});
			});
			return _this;
		}

		createClass(_class, [{
			key: 'connectedCallback',
			value: function connectedCallback() {
				this[CONTROLLER] = new options.controller(this);
			}
		}, {
			key: 'disconnectedCallback',
			value: function disconnectedCallback() {
				if (typeof this[CONTROLLER].unbind === 'function') {
					this[CONTROLLER].unbind();
				}

				if (typeof this[CONTROLLER].destroy === 'function') {
					this[CONTROLLER].destroy();
				}

				this[CONTROLLER] = null;
			}
		}]);
		return _class;
	}(HTMLElement));
};

var registerAttribute = function registerAttribute() {
	var handlers = [];

	var observer = new MutationObserver(function (mutations) {
		
	});

	return function register(attribute) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		waitForDOMReady().then(function () {
			var extend = options.extends || HTMLElement;

			var nodeIsSupported = function nodeIsSupported(node) {
				if (Array.isArray(extend)) {
					return extend.some(function (supported) {
						return node instanceof supported;
					});
				}

				return node instanceof extend;
			};

			var attach = function attach(node) {
				var el = node;
				el[CONTROLLER] = new options.controller(el);
				return el;
			};

			var detach = function detach(node) {
				var el = node;

				if (el[CONTROLLER]) {
					el[CONTROLLER].destroy();
					el[CONTROLLER] = null;
				}

				return el;
			};

			// Setup observers
			handlers.push(function (mutation) {
				if (mutation.type === 'attributes' && nodeIsSupported(mutation.target)) {
					// Attribute changed on supported DOM node type
					var node = mutation.target;

					if (node.hasAttribute(attribute)) {
						attach(node);
					} else {
						detach(node);
					}
				} else if (mutation.type === 'childList') {
					// Handle added nodes
					
				}
			});

			observer.observe(document.body, {
				attributes: true,
				subtree: true,
				childList: true,
				attributeFilter: [attribute]
			});

			// Look for current on DOM ready
			Array.from(document.body.querySelectorAll('[' + attribute + ']'), function (el) {
				if (!nodeIsSupported(el)) {
					console.warn('Custom attribute', attribute, 'added on non-supported element');
					return false;
				}

				if (el[CONTROLLER]) {
					return el;
				}

				return attach(el);
			});
		});
	};
}();

var addAttributesToController = function addAttributesToController(controller) {
	var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	return attributes.map(function (attribute) {
		// String, sync with actual element attribute
		if (typeof attribute === 'string') {
			var _generateAttributeMet = generateAttributeMethods(attribute, 'string'),
			    getter = _generateAttributeMet.getter,
			    setter = _generateAttributeMet.setter;

			addProperty(controller, attribute, getter, setter);
			return attribute;
		}

		if ((typeof attribute === 'undefined' ? 'undefined' : _typeof(attribute)) === 'object') {
			var type = attribute.type || 'string';
			var name = attribute.attribute;

			var _generateAttributeMet2 = generateAttributeMethods(name, type),
			    _getter = _generateAttributeMet2.getter,
			    _setter = _generateAttributeMet2.setter;

			addProperty(controller, name, _getter, _setter);
			return name;
		}

		if (typeof attribute.attachTo === 'function') {
			attribute.attachTo(controller);
			return false;
		}

		return false;
	}).filter(function (attribute) {
		return !!attribute;
	});
};

function defineCustomElement(tag) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	// Validate tag
	var isValidTag = tag.split('-').length > 1;

	// Validate type
	var type = ['element', 'attribute'].includes(options.type) ? options.type : 'element';

	if (type === 'element' && !isValidTag) {
		console.warn(tag, 'is not a valid Custom Element name. Register as an attribute instead.');
		return false;
	}

	// Validate attributes
	var attributes = Array.isArray(options.attributes) ? options.attributes : [];

	// Validate controller
	var controller = options.controller;

	// Validate extends
	var extend = options.extends;

	if (type === 'element' && extend) {
		console.warn('`extends` is not supported on element-registered Custom Elements. Register as an attribute instead.');
		return false;
	}

	var observedAttributes = addAttributesToController(controller, attributes);

	var validatedOptions = { type: type, extends: extend, attributes: attributes, controller: controller, observedAttributes: observedAttributes };

	if (type === 'attribute') {
		return registerAttribute(tag, validatedOptions);
	}

	return registerElement(tag, validatedOptions);
}

// Base Controller

exports.BaseController = BaseController;
exports.media = AttrMedia;
exports.touchHover = AttrTouchHover;
exports.ajaxForm = ajaxForm;
exports.keyTrigger = keyTrigger;
exports.overlay = overlay;
exports.share = share;
exports.smoothState = smoothState;
exports.timeAgo = timeAgo;
exports.defineCustomElement = defineCustomElement;
exports.parseEvent = parse;
exports.getEventPath = getPath;
exports.parseHTML = parseHTML;
exports.renderNodes = renderNodes;
exports.cleanNodes = cleanNodes;
exports.promisify = promisify;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJndWxwL2Fzc2V0cy9qcy9hcHAuanMiLCJndWxwL2Fzc2V0cy9qcy9tb2R1bGVzL3NsaWRlc2hvdy5qcyIsIm5vZGVfbW9kdWxlcy9jdXN0b20tZWxlbWVudHMtaGVscGVycy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7QUFFQSxnREFBb0IsY0FBcEIsRUFBb0M7QUFDbkMsYUFBWSxDQUNYLEVBQUUsV0FBVyxNQUFiLEVBQXFCLE1BQU0sTUFBM0IsRUFEVyxFQUVYLEVBQUUsV0FBVyxNQUFiLEVBQXFCLE1BQU0sS0FBM0IsRUFGVyxFQUdYLEVBQUUsV0FBVyxTQUFiLEVBQXdCLE1BQU0sS0FBOUIsRUFIVyxDQUR1QjtBQU1uQztBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMkJBMkNTO0FBQUE7O0FBQ1AsU0FBSyxJQUFMOztBQUVBLFFBQUksS0FBSyxJQUFMLElBQWEsS0FBSyxJQUFMLEdBQVksQ0FBN0IsRUFBZ0M7QUFDL0IsVUFBSyxNQUFMLEdBQWMsWUFBWSxZQUFNO0FBQy9CLGFBQUssSUFBTDtBQUNBLE1BRmEsRUFFWCxLQUFLLElBRk0sQ0FBZDtBQUdBO0FBQ0Q7QUFuREY7QUFBQTtBQUFBLDBCQXFEUTtBQUNOLFFBQUksS0FBSyxNQUFULEVBQWlCO0FBQ2hCLG1CQUFjLEtBQUssTUFBbkI7QUFDQSxVQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0E7QUFDRDtBQTFERjtBQUFBO0FBQUEsMEJBNERRO0FBQ04sU0FBSyxPQUFMLEdBQWUsS0FBSyxPQUFMLEdBQWUsQ0FBOUI7QUFDQTtBQTlERjtBQUFBO0FBQUEsOEJBZ0VZO0FBQ1YsU0FBSyxPQUFMLEdBQWUsS0FBSyxPQUFMLEdBQWUsQ0FBOUI7QUFDQTtBQWxFRjtBQUFBO0FBQUEsNkJBb0VXO0FBQ1QsUUFBSSxLQUFLLEVBQUwsQ0FBUSxRQUFSLENBQWlCLE1BQWpCLEtBQTRCLENBQWhDLEVBQW1DO0FBQ2xDO0FBQ0EsWUFBTyxJQUFJLE9BQUosQ0FBWSxZQUFNLENBQUUsQ0FBcEIsQ0FBUDtBQUNBOztBQUVEO0FBQ0E7QUEzRUY7QUFBQTtBQUFBLDBCQTZFUTtBQUNOLFNBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUssUUFBTCxDQUFjLEtBQWQsR0FBc0IsTUFBTSxJQUFOLENBQVcsS0FBSyxFQUFMLENBQVEsUUFBbkIsQ0FBdEI7O0FBRUEsUUFBSSxDQUFDLEtBQUssT0FBVixFQUFtQjtBQUNsQixVQUFLLE9BQUwsR0FBZSxDQUFmO0FBQ0E7O0FBRUQsU0FBSyxLQUFMO0FBQ0E7QUF0RkY7QUFBQTtBQUFBLDRCQXdGVTtBQUFBOztBQUNSLFNBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsT0FBcEIsQ0FBNEIsVUFBQyxJQUFELEVBQU8sQ0FBUCxFQUFhO0FBQ3hDLFNBQUksS0FBSyxTQUFMLENBQWUsUUFBZixDQUF3QixXQUF4QixDQUFKLEVBQTBDO0FBQ3pDLFdBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsV0FBdEI7QUFDQTs7QUFFRCxTQUFJLE1BQU0sT0FBSyxPQUFmLEVBQXdCO0FBQ3ZCLFdBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsV0FBbkI7QUFDQTtBQUNELEtBUkQ7QUFTQTtBQWxHRjtBQUFBO0FBQUEsNkJBb0dXO0FBQ1QsU0FBSyxJQUFMO0FBQ0E7QUFDQTtBQXZHRjtBQUFBO0FBQUEscUJBQ2EsRUFEYixFQUNpQjtBQUNmLFFBQUksU0FBUyxTQUFTLEVBQVQsRUFBYSxFQUFiLENBQWI7O0FBRUEsUUFBSSxXQUFXLEtBQUssT0FBcEIsRUFBNkI7QUFDNUI7QUFDQTs7QUFFRCxRQUFNLE1BQU0sS0FBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixNQUFoQzs7QUFFQTtBQUNBLFFBQUksVUFBVSxHQUFkLEVBQW1CO0FBQ2xCO0FBQ0EsY0FBUyxLQUFLLElBQUwsR0FBWSxDQUFaLEdBQWdCLE1BQU0sQ0FBL0I7QUFDQTs7QUFFRDtBQUNBLFFBQUksU0FBUyxDQUFiLEVBQWdCO0FBQ2Y7QUFDQSxjQUFTLEtBQUssSUFBTCxHQUFZLE1BQU0sQ0FBbEIsR0FBc0IsQ0FBL0I7QUFDQTs7QUFFRCxTQUFLLEVBQUwsQ0FBUSxZQUFSLENBQXFCLFNBQXJCLEVBQWdDLE1BQWhDOztBQUVBLFNBQUssTUFBTDtBQUNBO0FBekJGO0FBQUE7QUFBQSxxQkEyQlUsRUEzQlYsRUEyQmM7QUFDWixRQUFNLFNBQVMsU0FBUyxFQUFULEVBQWEsRUFBYixDQUFmOztBQUVBLFFBQUksV0FBVyxLQUFLLElBQXBCLEVBQTBCO0FBQ3pCO0FBQ0E7O0FBRUQsUUFBSSxVQUFVLENBQWQsRUFBaUI7QUFDaEIsVUFBSyxFQUFMLENBQVEsZUFBUixDQUF3QixNQUF4QjtBQUNBLEtBRkQsTUFFTztBQUNOLFVBQUssRUFBTCxDQUFRLFlBQVIsQ0FBcUIsTUFBckIsRUFBNkIsTUFBN0I7QUFDQTs7QUFFRCxTQUFLLEtBQUw7QUFDQTtBQXpDRjs7QUFBQTtBQUFBO0FBTm1DLENBQXBDOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAnLi9tb2R1bGVzL3NsaWRlc2hvdyc7XG4iLCJpbXBvcnQgeyBkZWZpbmVDdXN0b21FbGVtZW50LCBCYXNlQ29udHJvbGxlciB9IGZyb20gJ2N1c3RvbS1lbGVtZW50cy1oZWxwZXJzJztcblxuZGVmaW5lQ3VzdG9tRWxlbWVudCgnbXItc2xpZGVzaG93Jywge1xuXHRhdHRyaWJ1dGVzOiBbXG5cdFx0eyBhdHRyaWJ1dGU6ICdsb29wJywgdHlwZTogJ2Jvb2wnIH0sXG5cdFx0eyBhdHRyaWJ1dGU6ICdhdXRvJywgdHlwZTogJ2ludCcgfSxcblx0XHR7IGF0dHJpYnV0ZTogJ2N1cnJlbnQnLCB0eXBlOiAnaW50JyB9LFxuXHRdLFxuXHRjb250cm9sbGVyOiBjbGFzcyBleHRlbmRzIEJhc2VDb250cm9sbGVyIHtcblx0XHRzZXQgY3VycmVudCh0bykge1xuXHRcdFx0bGV0IHBhcnNlZCA9IHBhcnNlSW50KHRvLCAxMCk7XG5cblx0XHRcdGlmIChwYXJzZWQgPT09IHRoaXMuY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG1heCA9IHRoaXMuZWxlbWVudHMuaXRlbXMubGVuZ3RoO1xuXG5cdFx0XHQvLyBJZiB3ZSdyZSBhdCB0aGUgbGFzdCBzbGlkZSBhbmQgbmF2aWdhdGVkICdOZXh0J1xuXHRcdFx0aWYgKHBhcnNlZCA+PSBtYXgpIHtcblx0XHRcdFx0Ly8gQmFjayB0byBmaXJzdCBzbGlkZSBpZiBjYXJvdXNlbCBoYXMgbG9vcCBzZXQgdG8gdHJ1ZVxuXHRcdFx0XHRwYXJzZWQgPSB0aGlzLmxvb3AgPyAwIDogbWF4IC0gMTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgd2UncmUgYXQgdGhlIGZpcnN0IHNsaWRlIGFuZCBuYXZpZ2F0ZWQgJ1ByZXZpb3VzJ1xuXHRcdFx0aWYgKHBhcnNlZCA8IDApIHtcblx0XHRcdFx0Ly8gSnVtcCB0byBsYXN0IHNsaWRlIGlmIGNhcm91c2VsIGhhcyBsb29wIHNldCB0byB0cnVlXG5cdFx0XHRcdHBhcnNlZCA9IHRoaXMubG9vcCA/IG1heCAtIDEgOiAwO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmVsLnNldEF0dHJpYnV0ZSgnY3VycmVudCcsIHBhcnNlZCk7XG5cblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fVxuXG5cdFx0c2V0IGF1dG8odG8pIHtcblx0XHRcdGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHRvLCAxMCk7XG5cblx0XHRcdGlmIChwYXJzZWQgPT09IHRoaXMuYXV0bykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwYXJzZWQgPD0gMCkge1xuXHRcdFx0XHR0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSgnYXV0bycpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2F1dG8nLCBwYXJzZWQpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnN0YXJ0KCk7XG5cdFx0fVxuXG5cdFx0c3RhcnQoKSB7XG5cdFx0XHR0aGlzLnN0b3AoKTtcblxuXHRcdFx0aWYgKHRoaXMuYXV0byAmJiB0aGlzLmF1dG8gPiAwKSB7XG5cdFx0XHRcdHRoaXMubG9vcGVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMubmV4dCgpO1xuXHRcdFx0XHR9LCB0aGlzLmF1dG8pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHN0b3AoKSB7XG5cdFx0XHRpZiAodGhpcy5sb29wZXIpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmxvb3Blcik7XG5cdFx0XHRcdHRoaXMubG9vcGVyID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRuZXh0KCkge1xuXHRcdFx0dGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50ICsgMTtcblx0XHR9XG5cblx0XHRwcmV2aW91cygpIHtcblx0XHRcdHRoaXMuY3VycmVudCA9IHRoaXMuY3VycmVudCAtIDE7XG5cdFx0fVxuXG5cdFx0cmVzb2x2ZSgpIHtcblx0XHRcdGlmICh0aGlzLmVsLmNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHQvLyBLZWVwIGhhbmdpbmcsIGRvbid0IGFjdGl2YXRlIGlmIGVtcHR5XG5cdFx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgoKSA9PiB7fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzdXBlci5yZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0aW5pdCgpIHtcblx0XHRcdHRoaXMuZWxlbWVudHMgPSB7fTtcblx0XHRcdHRoaXMuZWxlbWVudHMuaXRlbXMgPSBBcnJheS5mcm9tKHRoaXMuZWwuY2hpbGRyZW4pO1xuXG5cdFx0XHRpZiAoIXRoaXMuY3VycmVudCkge1xuXHRcdFx0XHR0aGlzLmN1cnJlbnQgPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnN0YXJ0KCk7XG5cdFx0fVxuXG5cdFx0cmVuZGVyKCkge1xuXHRcdFx0dGhpcy5lbGVtZW50cy5pdGVtcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG5cdFx0XHRcdGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnaXMtYWN0aXZlJykpIHtcblx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGkgPT09IHRoaXMuY3VycmVudCkge1xuXHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGRlc3Ryb3koKSB7XG5cdFx0XHR0aGlzLnN0b3AoKTtcblx0XHRcdHN1cGVyLmRlc3Ryb3koKTtcblx0XHR9XG5cdH0sXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuZnVuY3Rpb24gcGFyc2UobmFtZSkge1xuXHR2YXIgY2xlYW4gPSBuYW1lLnRyaW0oKTtcblx0dmFyIHBhcnRzID0gY2xlYW4uc3BsaXQoJyAnKTtcblxuXHR2YXIgZXZlbnQgPSBjbGVhbjtcblx0dmFyIHNlbGVjdG9yID0gbnVsbDtcblxuXHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdGV2ZW50ID0gcGFydHMuc2hpZnQoKTtcblx0XHRzZWxlY3RvciA9IHBhcnRzLmpvaW4oJyAnKTtcblx0fVxuXG5cdHJldHVybiB7IGV2ZW50OiBldmVudCwgc2VsZWN0b3I6IHNlbGVjdG9yIH07XG59XG5cbmZ1bmN0aW9uIGdldFBhdGgoZSkge1xuXHR2YXIgcGF0aCA9IGUucGF0aDtcblxuXHRpZiAoIXBhdGgpIHtcblx0XHRwYXRoID0gW2UudGFyZ2V0XTtcblx0XHR2YXIgbm9kZSA9IGUudGFyZ2V0O1xuXG5cdFx0d2hpbGUgKG5vZGUucGFyZW50Tm9kZSkge1xuXHRcdFx0bm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcblx0XHRcdHBhdGgucHVzaChub2RlKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcGF0aDtcbn1cblxuZnVuY3Rpb24gcHJvbWlzaWZ5KG1ldGhvZCkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdHZhciB3YWl0ID0gbWV0aG9kKCk7XG5cblx0XHRpZiAod2FpdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcblx0XHRcdHdhaXQudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdFx0XHRcdFx0YXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc29sdmUoYXJncyk7XG5cdFx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG5cdFx0XHRcdFx0YXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVqZWN0KGFyZ3MpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc29sdmUod2FpdCk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gd2FpdEZvckRPTVJlYWR5KCkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0XHRpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgaGFuZGxlciA9IGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG5cdFx0XHRcdGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGhhbmRsZXIsIGZhbHNlKTtcblx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBoYW5kbGVyLCBmYWxzZSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gZWxlbWVudElzSW5ET00oZWxlbWVudCkge1xuXHR2YXIgcm9vdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZG9jdW1lbnQuYm9keTtcblxuXHRpZiAoIWVsZW1lbnQpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRpZiAoZWxlbWVudCA9PT0gcm9vdCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHJldHVybiByb290LmNvbnRhaW5zKGVsZW1lbnQpO1xufVxuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iajtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xufTtcblxuXG5cblxuXG52YXIgYXN5bmNHZW5lcmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEF3YWl0VmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBBc3luY0dlbmVyYXRvcihnZW4pIHtcbiAgICB2YXIgZnJvbnQsIGJhY2s7XG5cbiAgICBmdW5jdGlvbiBzZW5kKGtleSwgYXJnKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICBhcmc6IGFyZyxcbiAgICAgICAgICByZXNvbHZlOiByZXNvbHZlLFxuICAgICAgICAgIHJlamVjdDogcmVqZWN0LFxuICAgICAgICAgIG5leHQ6IG51bGxcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoYmFjaykge1xuICAgICAgICAgIGJhY2sgPSBiYWNrLm5leHQgPSByZXF1ZXN0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZyb250ID0gYmFjayA9IHJlcXVlc3Q7XG4gICAgICAgICAgcmVzdW1lKGtleSwgYXJnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzdW1lKGtleSwgYXJnKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZ2VuW2tleV0oYXJnKTtcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEF3YWl0VmFsdWUpIHtcbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUodmFsdWUudmFsdWUpLnRoZW4oZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgICAgcmVzdW1lKFwibmV4dFwiLCBhcmcpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgIHJlc3VtZShcInRocm93XCIsIGFyZyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0dGxlKHJlc3VsdC5kb25lID8gXCJyZXR1cm5cIiA6IFwibm9ybWFsXCIsIHJlc3VsdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBzZXR0bGUoXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHRsZSh0eXBlLCB2YWx1ZSkge1xuICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgXCJyZXR1cm5cIjpcbiAgICAgICAgICBmcm9udC5yZXNvbHZlKHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGRvbmU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwidGhyb3dcIjpcbiAgICAgICAgICBmcm9udC5yZWplY3QodmFsdWUpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgZnJvbnQucmVzb2x2ZSh7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBkb25lOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBmcm9udCA9IGZyb250Lm5leHQ7XG5cbiAgICAgIGlmIChmcm9udCkge1xuICAgICAgICByZXN1bWUoZnJvbnQua2V5LCBmcm9udC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFjayA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5faW52b2tlID0gc2VuZDtcblxuICAgIGlmICh0eXBlb2YgZ2VuLnJldHVybiAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLnJldHVybiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5hc3luY0l0ZXJhdG9yKSB7XG4gICAgQXN5bmNHZW5lcmF0b3IucHJvdG90eXBlW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gIH1cblxuICBBc3luY0dlbmVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICByZXR1cm4gdGhpcy5faW52b2tlKFwibmV4dFwiLCBhcmcpO1xuICB9O1xuXG4gIEFzeW5jR2VuZXJhdG9yLnByb3RvdHlwZS50aHJvdyA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICByZXR1cm4gdGhpcy5faW52b2tlKFwidGhyb3dcIiwgYXJnKTtcbiAgfTtcblxuICBBc3luY0dlbmVyYXRvci5wcm90b3R5cGUucmV0dXJuID0gZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiB0aGlzLl9pbnZva2UoXCJyZXR1cm5cIiwgYXJnKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHdyYXA6IGZ1bmN0aW9uIChmbikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3luY0dlbmVyYXRvcihmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgIH07XG4gICAgfSxcbiAgICBhd2FpdDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gbmV3IEF3YWl0VmFsdWUodmFsdWUpO1xuICAgIH1cbiAgfTtcbn0oKTtcblxuXG5cblxuXG52YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxudmFyIGNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpO1xuXG5cblxuXG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxuXG5cbnZhciBpbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbn07XG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4gPSBmdW5jdGlvbiAoc2VsZiwgY2FsbCkge1xuICBpZiAoIXNlbGYpIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjtcbn07XG5cblxuXG5cblxudmFyIHNsaWNlZFRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIHNsaWNlSXRlcmF0b3IoYXJyLCBpKSB7XG4gICAgdmFyIF9hcnIgPSBbXTtcbiAgICB2YXIgX24gPSB0cnVlO1xuICAgIHZhciBfZCA9IGZhbHNlO1xuICAgIHZhciBfZSA9IHVuZGVmaW5lZDtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7XG4gICAgICAgIF9hcnIucHVzaChfcy52YWx1ZSk7XG5cbiAgICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgX2QgPSB0cnVlO1xuICAgICAgX2UgPSBlcnI7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0pIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoX2QpIHRocm93IF9lO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfYXJyO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSB7XG4gICAgICByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTtcbiAgICB9XG4gIH07XG59KCk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciB0b0NvbnN1bWFibGVBcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgICByZXR1cm4gYXJyMjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhcnIpO1xuICB9XG59O1xuXG52YXIgQkFTRV9DT05UUk9MTEVSX0hBTkRMRVJTID0gU3ltYm9sKCdCQVNFX0NPTlRST0xMRVJfSEFORExFUlMnKTtcblxudmFyIEJhc2VDb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBCYXNlQ29udHJvbGxlcihlbCkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRjbGFzc0NhbGxDaGVjayh0aGlzLCBCYXNlQ29udHJvbGxlcik7XG5cblx0XHR2YXIgbm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblxuXHRcdHRoaXMuZWwgPSBlbDtcblxuXHRcdHRoaXMucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCFlbGVtZW50SXNJbkRPTShfdGhpcy5lbCkpIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KCdUaGUgZWxlbWVudCBoYXMgZGlzYXBwZWFyZWQnKTtcblx0XHRcdH1cblxuXHRcdFx0X3RoaXMuZWwuY2xhc3NMaXN0LmFkZCgnaXMtcmVzb2x2ZWQnKTtcblxuXHRcdFx0dmFyIGluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0XHRyZXR1cm4gcHJvbWlzaWZ5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoIWVsZW1lbnRJc0luRE9NKF90aGlzLmVsKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KCdUaGUgZWxlbWVudCBoYXMgZGlzYXBwZWFyZWQnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gX3RoaXMuaW5pdCgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdHZhciByZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0XHRcdHJldHVybiBwcm9taXNpZnkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmICghZWxlbWVudElzSW5ET00oX3RoaXMuZWwpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoJ1RoZSBlbGVtZW50IGhhcyBkaXNhcHBlYXJlZCcpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBfdGhpcy5yZW5kZXIoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgYmluZCA9IGZ1bmN0aW9uIGJpbmQoKSB7XG5cdFx0XHRcdHJldHVybiBwcm9taXNpZnkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmICghZWxlbWVudElzSW5ET00oX3RoaXMuZWwpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoJ1RoZSBlbGVtZW50IGhhcyBkaXNhcHBlYXJlZCcpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBfdGhpcy5iaW5kKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIGluaXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHJlbmRlcigpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiBiaW5kKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gX3RoaXM7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSkuY2F0Y2gobm9vcCk7XG5cdFx0fSkuY2F0Y2gobm9vcCk7XG5cdH1cblxuXHRjcmVhdGVDbGFzcyhCYXNlQ29udHJvbGxlciwgW3tcblx0XHRrZXk6ICdkZXN0cm95Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0XHRcdHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtcmVzb2x2ZWQnKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdyZXNvbHZlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gcmVzb2x2ZSgpIHtcblx0XHRcdHJldHVybiB3YWl0Rm9yRE9NUmVhZHkoKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdpbml0Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHt9XG5cdH0sIHtcblx0XHRrZXk6ICdyZW5kZXInLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7fVxuXHR9LCB7XG5cdFx0a2V5OiAnYmluZCcsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGJpbmQoKSB7fVxuXHR9LCB7XG5cdFx0a2V5OiAndW5iaW5kJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gdW5iaW5kKCkge1xuXHRcdFx0aWYgKHRoaXNbQkFTRV9DT05UUk9MTEVSX0hBTkRMRVJTXSkge1xuXHRcdFx0XHR0aGlzW0JBU0VfQ09OVFJPTExFUl9IQU5ETEVSU10uZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcblx0XHRcdFx0XHRsaXN0ZW5lci50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lci5ldmVudCwgbGlzdGVuZXIuaGFuZGxlciwgbGlzdGVuZXIub3B0aW9ucyk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHRoaXNbQkFTRV9DT05UUk9MTEVSX0hBTkRMRVJTXSA9IFtdO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ29uJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gb24obmFtZSwgaGFuZGxlcikge1xuXHRcdFx0dmFyIHRhcmdldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogbnVsbDtcblx0XHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBmYWxzZTtcblxuXHRcdFx0dGhpc1tCQVNFX0NPTlRST0xMRVJfSEFORExFUlNdID0gdGhpc1tCQVNFX0NPTlRST0xMRVJfSEFORExFUlNdIHx8IFtdO1xuXG5cdFx0XHR2YXIgX3BhcnNlRXZlbnQgPSBwYXJzZShuYW1lKSxcblx0XHRcdCAgICBldmVudCA9IF9wYXJzZUV2ZW50LmV2ZW50LFxuXHRcdFx0ICAgIHNlbGVjdG9yID0gX3BhcnNlRXZlbnQuc2VsZWN0b3I7XG5cblx0XHRcdHZhciBwYXJzZWRUYXJnZXQgPSAhdGFyZ2V0ID8gdGhpcy5lbCA6IHRhcmdldDtcblxuXHRcdFx0dmFyIHdyYXBwZWRIYW5kbGVyID0gZnVuY3Rpb24gd3JhcHBlZEhhbmRsZXIoZSkge1xuXHRcdFx0XHRoYW5kbGVyKGUsIGUudGFyZ2V0KTtcblx0XHRcdH07XG5cblx0XHRcdGlmIChzZWxlY3Rvcikge1xuXHRcdFx0XHR3cmFwcGVkSGFuZGxlciA9IGZ1bmN0aW9uIHdyYXBwZWRIYW5kbGVyKGUpIHtcblx0XHRcdFx0XHR2YXIgcGF0aCA9IGdldFBhdGgoZSk7XG5cblx0XHRcdFx0XHR2YXIgbWF0Y2hpbmdUYXJnZXQgPSBwYXRoLmZpbmQoZnVuY3Rpb24gKHRhZykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRhZy5tYXRjaGVzICYmIHRhZy5tYXRjaGVzKHNlbGVjdG9yKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGlmIChtYXRjaGluZ1RhcmdldCkge1xuXHRcdFx0XHRcdFx0aGFuZGxlcihlLCBtYXRjaGluZ1RhcmdldCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgbGlzdGVuZXIgPSB7XG5cdFx0XHRcdHRhcmdldDogcGFyc2VkVGFyZ2V0LFxuXHRcdFx0XHRzZWxlY3Rvcjogc2VsZWN0b3IsXG5cdFx0XHRcdGV2ZW50OiBldmVudCxcblx0XHRcdFx0aGFuZGxlcjogd3JhcHBlZEhhbmRsZXIsXG5cdFx0XHRcdG9wdGlvbnM6IG9wdGlvbnNcblx0XHRcdH07XG5cblx0XHRcdGxpc3RlbmVyLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKGxpc3RlbmVyLmV2ZW50LCBsaXN0ZW5lci5oYW5kbGVyLCBsaXN0ZW5lci5vcHRpb25zKTtcblxuXHRcdFx0dGhpc1tCQVNFX0NPTlRST0xMRVJfSEFORExFUlNdLnB1c2gobGlzdGVuZXIpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdvbmNlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gb25jZShuYW1lLCBoYW5kbGVyKSB7XG5cdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0dmFyIHRhcmdldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogbnVsbDtcblx0XHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBmYWxzZTtcblxuXHRcdFx0dmFyIHdyYXBwZWRIYW5kbGVyID0gZnVuY3Rpb24gd3JhcHBlZEhhbmRsZXIoZSwgbWF0Y2hpbmdUYXJnZXQpIHtcblx0XHRcdFx0X3RoaXMyLm9mZihuYW1lLCB0YXJnZXQpO1xuXHRcdFx0XHRoYW5kbGVyKGUsIG1hdGNoaW5nVGFyZ2V0KTtcblx0XHRcdH07XG5cblx0XHRcdHRoaXMub24obmFtZSwgd3JhcHBlZEhhbmRsZXIsIHRhcmdldCwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnb2ZmJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gb2ZmKG5hbWUpIHtcblx0XHRcdHZhciB0YXJnZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG5cblx0XHRcdHZhciBfcGFyc2VFdmVudDIgPSBwYXJzZShuYW1lKSxcblx0XHRcdCAgICBldmVudCA9IF9wYXJzZUV2ZW50Mi5ldmVudCxcblx0XHRcdCAgICBzZWxlY3RvciA9IF9wYXJzZUV2ZW50Mi5zZWxlY3RvcjtcblxuXHRcdFx0dmFyIHBhcnNlZFRhcmdldCA9ICF0YXJnZXQgPyB0aGlzLmVsIDogdGFyZ2V0O1xuXG5cdFx0XHR2YXIgbGlzdGVuZXIgPSB0aGlzW0JBU0VfQ09OVFJPTExFUl9IQU5ETEVSU10uZmluZChmdW5jdGlvbiAoaGFuZGxlcikge1xuXHRcdFx0XHQvLyBTZWxlY3RvcnMgZG9uJ3QgbWF0Y2hcblx0XHRcdFx0aWYgKGhhbmRsZXIuc2VsZWN0b3IgIT09IHNlbGVjdG9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRXZlbnQgdHlwZSBkb24ndCBtYXRjaFxuXHRcdFx0XHRpZiAoaGFuZGxlci5ldmVudCAhPT0gZXZlbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBQYXNzZWQgYSB0YXJnZXQsIGJ1dCB0aGUgdGFyZ2V0cyBkb24ndCBtYXRjaFxuXHRcdFx0XHRpZiAoISFwYXJzZWRUYXJnZXQgJiYgaGFuZGxlci50YXJnZXQgIT09IHBhcnNlZFRhcmdldCkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVsc2UsIHdlIGZvdW5kIGEgbWF0Y2hcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKCEhbGlzdGVuZXIgJiYgISFsaXN0ZW5lci50YXJnZXQpIHtcblx0XHRcdFx0dGhpc1tCQVNFX0NPTlRST0xMRVJfSEFORExFUlNdLnNwbGljZSh0aGlzW0JBU0VfQ09OVFJPTExFUl9IQU5ETEVSU10uaW5kZXhPZihsaXN0ZW5lciksIDEpO1xuXG5cdFx0XHRcdGxpc3RlbmVyLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGxpc3RlbmVyLmV2ZW50LCBsaXN0ZW5lci5oYW5kbGVyLCBsaXN0ZW5lci5vcHRpb25zKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdlbWl0Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZW1pdChuYW1lKSB7XG5cdFx0XHR2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cdFx0XHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cblx0XHRcdHZhciBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHtcblx0XHRcdFx0ZGV0YWlsOiBkYXRhLFxuXHRcdFx0XHRidWJibGVzOiB0cnVlLFxuXHRcdFx0XHRjYW5jZWxhYmxlOiB0cnVlXG5cdFx0XHR9LCBvcHRpb25zKTtcblxuXHRcdFx0dmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KG5hbWUsIHBhcmFtcyk7XG5cblx0XHRcdHRoaXMuZWwuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0fVxuXHR9XSk7XG5cdHJldHVybiBCYXNlQ29udHJvbGxlcjtcbn0oKTtcblxudmFyIGNvbnZlcnRBdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZSA9IGZ1bmN0aW9uIGNvbnZlcnRBdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGUpIHtcblx0cmV0dXJuIGF0dHJpYnV0ZS5zcGxpdCgnLScpLnJlZHVjZShmdW5jdGlvbiAoY2FtZWxjYXNlZCwgcGFydCwgaW5kZXgpIHtcblx0XHRpZiAoaW5kZXggPT09IDApIHtcblx0XHRcdHJldHVybiBwYXJ0O1xuXHRcdH1cblxuXHRcdHJldHVybiBjYW1lbGNhc2VkICsgcGFydFswXS50b1VwcGVyQ2FzZSgpICsgcGFydC5zdWJzdHIoMSk7XG5cdH0pO1xufTtcblxudmFyIGFkZE1ldGhvZCA9IGZ1bmN0aW9uIGFkZE1ldGhvZChjdXN0b21FbGVtZW50LCBuYW1lLCBtZXRob2QpIHtcblx0aWYgKHR5cGVvZiBjdXN0b21FbGVtZW50LnByb3RvdHlwZVtuYW1lXSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRjb25zb2xlLndhcm4oY3VzdG9tRWxlbWVudC5uYW1lICsgJyBhbHJlYWR5IGhhcyBhIHByb3BlcnR5ICcgKyBuYW1lKTtcblx0fVxuXG5cdGN1c3RvbUVsZW1lbnQucHJvdG90eXBlW25hbWVdID0gbWV0aG9kO1xufTtcblxudmFyIGFkZEdldHRlciA9IGZ1bmN0aW9uIGFkZEdldHRlcihjdXN0b21FbGVtZW50LCBuYW1lLCBtZXRob2QpIHtcblx0dmFyIGdldHRlck5hbWUgPSBjb252ZXJ0QXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUobmFtZSk7XG5cblx0aWYgKHR5cGVvZiBjdXN0b21FbGVtZW50LnByb3RvdHlwZVtnZXR0ZXJOYW1lXSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRjb25zb2xlLndhcm4oY3VzdG9tRWxlbWVudC5uYW1lICsgJyBhbHJlYWR5IGhhcyBhIHByb3BlcnR5ICcgKyBnZXR0ZXJOYW1lKTtcblx0fVxuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdXN0b21FbGVtZW50LnByb3RvdHlwZSwgZ2V0dGVyTmFtZSwge1xuXHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0Z2V0OiBtZXRob2Rcblx0fSk7XG59O1xuXG52YXIgYWRkUHJvcGVydHkgPSBmdW5jdGlvbiBhZGRQcm9wZXJ0eShjdXN0b21FbGVtZW50LCBuYW1lKSB7XG5cdHZhciBnZXR0ZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IG51bGw7XG5cdHZhciBzZXR0ZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IG51bGw7XG5cblx0dmFyIHByb3BlcnR5TmFtZSA9IGNvbnZlcnRBdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShuYW1lKTtcblxuXHRpZiAodHlwZW9mIGN1c3RvbUVsZW1lbnQucHJvdG90eXBlW3Byb3BlcnR5TmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0Y29uc29sZS53YXJuKGN1c3RvbUVsZW1lbnQubmFtZSArICcgYWxyZWFkeSBoYXMgYSBwcm9wZXJ0eSAnICsgcHJvcGVydHlOYW1lKTtcblx0fVxuXG5cdHZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xuXG5cdHZhciBwcm9wZXJ0eSA9IHtcblx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuXHRcdGdldDogdHlwZW9mIGdldHRlciA9PT0gJ2Z1bmN0aW9uJyA/IGdldHRlciA6IG5vb3AsXG5cdFx0c2V0OiB0eXBlb2Ygc2V0dGVyID09PSAnZnVuY3Rpb24nID8gc2V0dGVyIDogbm9vcFxuXHR9O1xuXG5cdHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjdXN0b21FbGVtZW50LnByb3RvdHlwZSwgcHJvcGVydHlOYW1lKTtcblxuXHRpZiAoZGVzY3JpcHRvcikge1xuXHRcdGlmICh0eXBlb2YgZGVzY3JpcHRvci5zZXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHZhciBleGlzdGluZyA9IGRlc2NyaXB0b3Iuc2V0O1xuXG5cdFx0XHRwcm9wZXJ0eS5zZXQgPSBmdW5jdGlvbiBzZXQodG8pIHtcblx0XHRcdFx0ZXhpc3RpbmcuY2FsbCh0aGlzLCB0byk7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgZGVzY3JpcHRvci5nZXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHZhciBnZW5lcmF0ZWQgPSBwcm9wZXJ0eS5nZXQ7XG5cdFx0XHR2YXIgX2V4aXN0aW5nID0gZGVzY3JpcHRvci5nZXQ7XG5cblx0XHRcdHByb3BlcnR5LmdldCA9IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gX2V4aXN0aW5nLmNhbGwodGhpcyk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVkLmNhbGwodGhpcyk7XG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdXN0b21FbGVtZW50LnByb3RvdHlwZSwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eSk7XG59O1xuXG52YXIgQXR0ck1lZGlhID0gZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBBdHRyTWVkaWEoKSB7XG5cdFx0Y2xhc3NDYWxsQ2hlY2sodGhpcywgQXR0ck1lZGlhKTtcblx0fVxuXG5cdGNyZWF0ZUNsYXNzKEF0dHJNZWRpYSwgbnVsbCwgW3tcblx0XHRrZXk6ICdhdHRhY2hUbycsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGF0dGFjaFRvKGN1c3RvbUVsZW1lbnQpIHtcblx0XHRcdHZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xuXG5cdFx0XHR2YXIgd2F0Y2hlcnMgPSB7fTtcblxuXHRcdFx0Ly8gQWRkcyBjdXN0b21FbGVtZW50Lm1lZGlhXG5cdFx0XHQvLyBAcmV0dXJuIHN0cmluZyBcdFx0VmFsdWUgb2YgYG1lZGlhPVwiXCJgIGF0dHJpYnV0ZVxuXHRcdFx0YWRkR2V0dGVyKGN1c3RvbUVsZW1lbnQsICdtZWRpYScsIGZ1bmN0aW9uIGdldE1lZGlhQXR0cmlidXRlKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5lbC5oYXNBdHRyaWJ1dGUoJ21lZGlhJykgPyB0aGlzLmVsLmdldEF0dHJpYnV0ZSgnbWVkaWEnKSA6IGZhbHNlO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEFkZHMgY3VzdG9tRWxlbWVudC5tYXRjaGVzTWVkaWFcblx0XHRcdC8vIEByZXR1cm4gYm9vbCBcdFx0SWYgdGhlIHZpZXdwb3J0IGN1cnJlbnRseSBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgbWVkaWEgcXVlcnlcblx0XHRcdGFkZEdldHRlcihjdXN0b21FbGVtZW50LCAnbWF0Y2hlc01lZGlhJywgZnVuY3Rpb24gbWF0Y2hlc01lZGlhKCkge1xuXHRcdFx0XHRpZiAoIXRoaXMubWVkaWEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAnbWF0Y2hNZWRpYScgaW4gd2luZG93ICYmICEhd2luZG93Lm1hdGNoTWVkaWEodGhpcy5tZWRpYSkubWF0Y2hlcztcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBBZGRzIGN1c3RvbUVsZW1lbnRzLndoZW5NZWRpYU1hdGNoZXMoKVxuXHRcdFx0Ly8gQHJldHVybiBQcm9taXNlXG5cdFx0XHRhZGRNZXRob2QoY3VzdG9tRWxlbWVudCwgJ3doZW5NZWRpYU1hdGNoZXMnLCBmdW5jdGlvbiB3aGVuTWVkaWFNYXRjaGVzKCkge1xuXHRcdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0XHRcdHZhciBkZWZlciA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cdFx0XHRcdFx0dmFyIGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKG1lZGlhKSB7XG5cdFx0XHRcdFx0XHRpZiAobWVkaWEubWF0Y2hlcykge1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdFx0XHRcdG1lZGlhLnJlbW92ZUxpc3RlbmVyKGhhbmRsZXIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRpZiAoJ21hdGNoTWVkaWEnIGluIHdpbmRvdykge1xuXHRcdFx0XHRcdFx0d2F0Y2hlcnNbX3RoaXMubWVkaWFdID0gd2F0Y2hlcnNbX3RoaXMubWVkaWFdIHx8IHdpbmRvdy5tYXRjaE1lZGlhKF90aGlzLm1lZGlhKTtcblx0XHRcdFx0XHRcdHdhdGNoZXJzW190aGlzLm1lZGlhXS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBoYW5kbGVyKHdhdGNoZXJzW190aGlzLm1lZGlhXSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGhhbmRsZXIod2F0Y2hlcnNbX3RoaXMubWVkaWFdKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmVyO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEFkZHMgY3VzdG9tRWxlbWVudHMud2hlbk1lZGlhVW5tYXRjaGVzKClcblx0XHRcdC8vIEByZXR1cm4gUHJvbWlzZVxuXHRcdFx0YWRkTWV0aG9kKGN1c3RvbUVsZW1lbnQsICd3aGVuTWVkaWFVbm1hdGNoZXMnLCBmdW5jdGlvbiB3aGVuTWVkaWFVbm1hdGNoZXMoKSB7XG5cdFx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHRcdHZhciBkZWZlciA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cdFx0XHRcdFx0dmFyIGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKG1lZGlhKSB7XG5cdFx0XHRcdFx0XHRpZiAobWVkaWEubWF0Y2hlcykge1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdFx0XHRcdG1lZGlhLnJlbW92ZUxpc3RlbmVyKGhhbmRsZXIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRpZiAoJ21hdGNoTWVkaWEnIGluIHdpbmRvdykge1xuXHRcdFx0XHRcdFx0d2F0Y2hlcnNbX3RoaXMyLm1lZGlhXSA9IHdhdGNoZXJzW190aGlzMi5tZWRpYV0gfHwgd2luZG93Lm1hdGNoTWVkaWEoX3RoaXMyLm1lZGlhKTtcblx0XHRcdFx0XHRcdHdhdGNoZXJzW190aGlzMi5tZWRpYV0uYWRkTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaGFuZGxlcih3YXRjaGVyc1tfdGhpczIubWVkaWFdKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0aGFuZGxlcih3YXRjaGVyc1tfdGhpczIubWVkaWFdKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmVyO1xuXHRcdFx0fSk7XG5cblx0XHRcdGFkZE1ldGhvZChjdXN0b21FbGVtZW50LCAnd2F0Y2hNZWRpYScsIGZ1bmN0aW9uIHdhdGNoTWVkaWEoKSB7XG5cdFx0XHRcdHZhciBfdGhpczMgPSB0aGlzO1xuXG5cdFx0XHRcdHZhciBtYXRjaCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbm9vcDtcblx0XHRcdFx0dmFyIHVubWF0Y2ggPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG5vb3A7XG5cblx0XHRcdFx0dmFyIGhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGVyKG1lZGlhKSB7XG5cdFx0XHRcdFx0aWYgKG1lZGlhLm1hdGNoZXMpIHtcblx0XHRcdFx0XHRcdG1hdGNoKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHVubWF0Y2goKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKCdtYXRjaE1lZGlhJyBpbiB3aW5kb3cpIHtcblx0XHRcdFx0XHR3YXRjaGVyc1t0aGlzLm1lZGlhXSA9IHdhdGNoZXJzW3RoaXMubWVkaWFdIHx8IHdpbmRvdy5tYXRjaE1lZGlhKHRoaXMubWVkaWEpO1xuXHRcdFx0XHRcdHdhdGNoZXJzW3RoaXMubWVkaWFdLmFkZExpc3RlbmVyKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHJldHVybiBoYW5kbGVyKHdhdGNoZXJzW190aGlzMy5tZWRpYV0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGhhbmRsZXIod2F0Y2hlcnNbdGhpcy5tZWRpYV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1dKTtcblx0cmV0dXJuIEF0dHJNZWRpYTtcbn0oKTtcblxudmFyIEF0dHJUb3VjaEhvdmVyID0gZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBBdHRyVG91Y2hIb3ZlcigpIHtcblx0XHRjbGFzc0NhbGxDaGVjayh0aGlzLCBBdHRyVG91Y2hIb3Zlcik7XG5cdH1cblxuXHRjcmVhdGVDbGFzcyhBdHRyVG91Y2hIb3ZlciwgbnVsbCwgW3tcblx0XHRrZXk6ICdhdHRhY2hUbycsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGF0dGFjaFRvKGN1c3RvbUVsZW1lbnQpIHtcblx0XHRcdHZhciBpc1RvdWNoID0gZmFsc2U7XG5cdFx0XHR2YXIgaXNUb3VjaGVkID0gZmFsc2U7XG5cblx0XHRcdHZhciB0b3VjaENsYXNzID0gJ2lzLXRvdWNoJztcblx0XHRcdHZhciBob3ZlckNsYXNzID0gJ2lzLXRvdWNoLWhvdmVyJztcblxuXHRcdFx0YWRkR2V0dGVyKGN1c3RvbUVsZW1lbnQsICd0b3VjaEhvdmVyJywgZnVuY3Rpb24gZ2V0VG91Y2hIb3ZlckF0dHJpYnV0ZSgpIHtcblx0XHRcdFx0aWYgKHRoaXMuZWwuaGFzQXR0cmlidXRlKCd0b3VjaC1ob3ZlcicpKSB7XG5cdFx0XHRcdFx0Ly8gQHRvZG8gLSBTdXBwb3J0IGRpZmZlcmVudCB2YWx1ZXMgZm9yIHRvdWNoLWhvdmVyXG5cdFx0XHRcdFx0Ly8gYGF1dG9gICAgICAgICBkZXRlY3QgYmFzZWQgb24gZWxlbWVudFxuXHRcdFx0XHRcdC8vIGB0b2dnbGVgICAgICAgYWx3YXlzIHRvZ2dsZSBob3ZlciBvbi9vZmYgKHRoaXMgbWlnaHQgYmxvY2sgY2xpY2tzKVxuXHRcdFx0XHRcdC8vIGBwYXNzdGhyb3VnaGAgaWdub3JlIGhvdmVyLCBkaXJlY3RseSB0cmlnZ2VyIGFjdGlvblxuXHRcdFx0XHRcdHJldHVybiAnYXV0byc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KTtcblxuXHRcdFx0YWRkTWV0aG9kKGN1c3RvbUVsZW1lbnQsICdlbmFibGVUb3VjaEhvdmVyJywgZnVuY3Rpb24gZW5hYmxlVG91Y2hIb3ZlcigpIHtcblx0XHRcdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlzVG91Y2ggPSB0cnVlO1xuXHRcdFx0XHRcdF90aGlzLmVsLmNsYXNzTGlzdC5hZGQodG91Y2hDbGFzcyk7XG5cdFx0XHRcdH0sIHRoaXMuZWwsIHsgdXNlQ2FwdHVyZTogdHJ1ZSB9KTtcblxuXHRcdFx0XHR0aGlzLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHR2YXIgcGF0aCA9IGdldFBhdGgoZSk7XG5cblx0XHRcdFx0XHQvLyBSZW1vdmUgaG92ZXIgd2hlbiB0YXBwaW5nIG91dHNpZGUgdGhlIERPTSBub2RlXG5cdFx0XHRcdFx0aWYgKGlzVG91Y2hlZCAmJiAhcGF0aC5pbmNsdWRlcyhfdGhpcy5lbCkpIHtcblx0XHRcdFx0XHRcdGlzVG91Y2ggPSBmYWxzZTtcblx0XHRcdFx0XHRcdGlzVG91Y2hlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0X3RoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShob3ZlckNsYXNzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGRvY3VtZW50LmJvZHksIHsgdXNlQ2FwdHVyZTogdHJ1ZSB9KTtcblxuXHRcdFx0XHR0aGlzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aWYgKF90aGlzLnRvdWNoSG92ZXIpIHtcblx0XHRcdFx0XHRcdHZhciBoYXNBY3Rpb24gPSBfdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSAhPT0gJyMnO1xuXG5cdFx0XHRcdFx0XHRpZiAoIWlzVG91Y2hlZCAmJiAhaGFzQWN0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGlzVG91Y2gpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGhhc0FjdGlvbikge1xuXHRcdFx0XHRcdFx0XHRcdGlmICghaXNUb3VjaGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBGaXJzdCB0YXAsIGVuYWJsZSBob3ZlciwgYmxvY2sgdGFwXG5cdFx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpc1RvdWNoZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBTZWNvbmQgdGFwLCBkb24ndCBibG9jayB0YXAsIGRpc2FibGUgaG92ZXJcblx0XHRcdFx0XHRcdFx0XHRcdGlzVG91Y2hlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBBY3QgYXMgYSBzaW1wbGUgb24vb2ZmIHN3aXRjaFxuXHRcdFx0XHRcdFx0XHRcdGlzVG91Y2hlZCA9ICFpc1RvdWNoZWQ7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRfdGhpcy5lbC5jbGFzc0xpc3QudG9nZ2xlKGhvdmVyQ2xhc3MsIGlzVG91Y2hlZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB0aGlzLmVsLCB7IHVzZUNhcHR1cmU6IHRydWUgfSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1dKTtcblx0cmV0dXJuIEF0dHJUb3VjaEhvdmVyO1xufSgpO1xuXG52YXIgcGFyc2VSZXNwb25zZSA9IGZ1bmN0aW9uIHBhcnNlUmVzcG9uc2UocmVzKSB7XG5cdHZhciBkYXRhID0gZnVuY3Rpb24gcGFyc2VSZXNvbnNlVG9EYXRhKCkge1xuXHRcdC8vIEZvcmNlIGxvd2VyY2FzZSBrZXlzXG5cdFx0aWYgKCh0eXBlb2YgcmVzID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihyZXMpKSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdHJldHVybiBPYmplY3QuZW50cmllcyhyZXMpLnJlZHVjZShmdW5jdGlvbiAob2JqZWN0LCBfcmVmKSB7XG5cdFx0XHRcdHZhciBfcmVmMiA9IHNsaWNlZFRvQXJyYXkoX3JlZiwgMiksXG5cdFx0XHRcdCAgICBrZXkgPSBfcmVmMlswXSxcblx0XHRcdFx0ICAgIHZhbHVlID0gX3JlZjJbMV07XG5cblx0XHRcdFx0dmFyIGxvd2VyY2FzZUtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRcdE9iamVjdC5hc3NpZ24ob2JqZWN0LCBkZWZpbmVQcm9wZXJ0eSh7fSwgbG93ZXJjYXNlS2V5LCB2YWx1ZSkpO1xuXG5cdFx0XHRcdHJldHVybiBvYmplY3Q7XG5cdFx0XHR9LCB7fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlcztcblx0fSgpO1xuXG5cdHZhciBzdGF0dXMgPSBmdW5jdGlvbiBwYXJzZVJlc3BvbnNlVG9TdGF0dXMoKSB7XG5cdFx0aWYgKGRhdGEuc3RhdHVzKSB7XG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQoZGF0YS5zdGF0dXMsIDEwKTtcblx0XHR9XG5cblx0XHRpZiAocGFyc2VJbnQoZGF0YSwgMTApLnRvU3RyaW5nKCkgPT09IGRhdGEudG9TdHJpbmcoKSkge1xuXHRcdFx0cmV0dXJuIHBhcnNlSW50KGRhdGEsIDEwKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gMjAwO1xuXHR9KCk7XG5cblx0cmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMsIGRhdGE6IGRhdGEgfTtcbn07XG5cbnZhciBmZXRjaEpTT05QID0gZnVuY3Rpb24gZmV0Y2hKU09OUCh1cmwpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHQvLyBSZWdpc3RlciBhIGdsb2JhbCBjYWxsYmFja1xuXHRcdC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGEgdW5pcXVlIGZ1bmN0aW9uIG5hbWVcblx0XHR2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0dmFyIGNhbGxiYWNrID0gJ0FKQVhfRk9STV9DQUxMQkFDS18nICsgbm93O1xuXG5cdFx0d2luZG93W2NhbGxiYWNrXSA9IGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdC8vIE1ha2UgdGhlIGNhbGxiYWNrIGEgbm9vcFxuXHRcdFx0Ly8gc28gaXQgdHJpZ2dlcnMgb25seSBvbmNlIChqdXN0IGluIGNhc2UpXG5cdFx0XHR3aW5kb3dbY2FsbGJhY2tdID0gZnVuY3Rpb24gKCkge307XG5cblx0XHRcdC8vIENsZWFuIHVwIGFmdGVyIG91cnNlbHZlc1xuXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbGxiYWNrKTtcblx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG5cblx0XHRcdHZhciBfcGFyc2VSZXNwb25zZSA9IHBhcnNlUmVzcG9uc2UocmVzKSxcblx0XHRcdCAgICBzdGF0dXMgPSBfcGFyc2VSZXNwb25zZS5zdGF0dXMsXG5cdFx0XHQgICAgZGF0YSA9IF9wYXJzZVJlc3BvbnNlLmRhdGE7XG5cblx0XHRcdC8vIElmIHJlcyBpcyBvbmx5IGEgc3RhdHVzIGNvZGVcblxuXG5cdFx0XHRpZiAoc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPD0gMzk5KSB7XG5cdFx0XHRcdHJldHVybiByZXNvbHZlKGRhdGEpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVqZWN0KGRhdGEpO1xuXHRcdH07XG5cblx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdFx0c2NyaXB0LmlkID0gY2FsbGJhY2s7XG5cdFx0c2NyaXB0LnNyYyA9IHVybCArICcmY2FsbGJhY2s9JyArIGNhbGxiYWNrO1xuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblx0fSk7XG59O1xuXG52YXIgY29udmVydEZvcm1EYXRhVG9RdWVyeXN0cmluZyA9IGZ1bmN0aW9uIGNvbnZlcnRGb3JtRGF0YVRvUXVlcnlzdHJpbmcodmFsdWVzKSB7XG5cdHJldHVybiBBcnJheS5mcm9tKHZhbHVlcywgZnVuY3Rpb24gKF9yZWYpIHtcblx0XHR2YXIgX3JlZjIgPSBzbGljZWRUb0FycmF5KF9yZWYsIDIpLFxuXHRcdCAgICBrZXkgPSBfcmVmMlswXSxcblx0XHQgICAgcmF3ID0gX3JlZjJbMV07XG5cblx0XHRpZiAocmF3KSB7XG5cdFx0XHR2YXIgdmFsdWUgPSB3aW5kb3cuZW5jb2RlVVJJQ29tcG9uZW50KHJhdyk7XG5cdFx0XHRyZXR1cm4ga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICcnO1xuXHR9KS5qb2luKCcmJyk7XG59O1xuXG52YXIgYWpheEZvcm0gPSB7XG5cdGF0dHJpYnV0ZXM6IFt7IGF0dHJpYnV0ZTogJ2pzb25wJywgdHlwZTogJ2Jvb2wnIH1dLFxuXHRjb250cm9sbGVyOiBmdW5jdGlvbiAoX0Jhc2VDb250cm9sbGVyKSB7XG5cdFx0aW5oZXJpdHMoY29udHJvbGxlciwgX0Jhc2VDb250cm9sbGVyKTtcblxuXHRcdGZ1bmN0aW9uIGNvbnRyb2xsZXIoKSB7XG5cdFx0XHRjbGFzc0NhbGxDaGVjayh0aGlzLCBjb250cm9sbGVyKTtcblx0XHRcdHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChjb250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udHJvbGxlcikpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuXHRcdH1cblxuXHRcdGNyZWF0ZUNsYXNzKGNvbnRyb2xsZXIsIFt7XG5cdFx0XHRrZXk6ICdpbml0Jyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRzID0gdGhpcy5lbGVtZW50cyB8fCB7fTtcblx0XHRcdFx0dGhpcy5lbGVtZW50cy5mb3JtID0gdGhpcy5lbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZm9ybScpWzBdO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRzLnN1Y2Nlc3NNZXNzYWdlID0gdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1hamF4LWZvcm0tc3VjY2VzcycpWzBdO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRzLmVycm9yTWVzc2FnZSA9IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtYWpheC1mb3JtLWVycm9yJylbMF07XG5cblx0XHRcdFx0aWYgKCF0aGlzLmVsZW1lbnRzLmZvcm0pIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ0FjdGl2YXRlZCBNckFqYXhGb3JtIHdpdGhvdXQgYSBmb3JtJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50cy5maWVsZHMgPSB0aGlzLmVsZW1lbnRzLmZvcm0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdyZW5kZXInLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRcdFx0Ly8gV2UgY2FuIGRpc2FibGUgdGhlIEhUTUw1IGZyb250LWVuZCB2YWxpZGF0aW9uXG5cdFx0XHRcdC8vIGFuZCBoYW5kbGUgaXQgbW9yZSBncmFjZWZ1bGx5IGluIEpTXG5cdFx0XHRcdC8vIEB0b2RvXG5cdFx0XHRcdHRoaXMuZWxlbWVudHMuZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2JpbmQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGJpbmQoKSB7XG5cdFx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHRcdHZhciByZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCkge1xuXHRcdFx0XHRcdGlmIChfdGhpczIuZWxlbWVudHMuc3VjY2Vzc01lc3NhZ2UpIHtcblx0XHRcdFx0XHRcdF90aGlzMi5lbGVtZW50cy5zdWNjZXNzTWVzc2FnZS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoX3RoaXMyLmVsZW1lbnRzLmVycm9yTWVzc2FnZSkge1xuXHRcdFx0XHRcdFx0X3RoaXMyLmVsZW1lbnRzLmVycm9yTWVzc2FnZS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRyZXNldCgpO1xuXG5cdFx0XHRcdFx0dmFyIF9wcmVwYXJlID0gX3RoaXMyLnByZXBhcmUoX3RoaXMyLm1ldGhvZCksXG5cdFx0XHRcdFx0ICAgIHVybCA9IF9wcmVwYXJlLnVybCxcblx0XHRcdFx0XHQgICAgcGFyYW1zID0gX3ByZXBhcmUucGFyYW1zO1xuXG5cdFx0XHRcdFx0X3RoaXMyLnN1Ym1pdCh1cmwsIHBhcmFtcykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0X3RoaXMyLm9uU3VjY2VzcyhkYXRhKTtcblx0XHRcdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0XHRfdGhpczIub25FcnJvcihlcnIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LCB0aGlzLmVsZW1lbnRzLmZvcm0pO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3ByZXBhcmUnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHByZXBhcmUobWV0aG9kKSB7XG5cdFx0XHRcdHZhciBfdGhpczMgPSB0aGlzO1xuXG5cdFx0XHRcdHZhciBnZXQkJDEgPSBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdFx0dmFyIHF1ZXJ5c3RyaW5nID0gY29udmVydEZvcm1EYXRhVG9RdWVyeXN0cmluZyhfdGhpczMudmFsdWVzKTtcblx0XHRcdFx0XHR2YXIgdXJsID0gX3RoaXMzLmFjdGlvbiArICc/JyArIHF1ZXJ5c3RyaW5nO1xuXHRcdFx0XHRcdHZhciBwYXJhbXMgPSB7XG5cdFx0XHRcdFx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdFx0XHRcdFx0aGVhZGVyczogbmV3IEhlYWRlcnMoe1xuXHRcdFx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRyZXR1cm4geyB1cmw6IHVybCwgcGFyYW1zOiBwYXJhbXMgfTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgcG9zdCA9IGZ1bmN0aW9uIHBvc3QoKSB7XG5cdFx0XHRcdFx0dmFyIHVybCA9IF90aGlzMy5hY3Rpb247XG5cdFx0XHRcdFx0dmFyIHBhcmFtcyA9IHtcblx0XHRcdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRcdFx0aGVhZGVyczogbmV3IEhlYWRlcnMoe1xuXHRcdFx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHJldHVybiB7IHVybDogdXJsLCBwYXJhbXM6IHBhcmFtcyB9O1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmIChtZXRob2QudG9VcHBlckNhc2UoKSA9PT0gJ0dFVCcpIHtcblx0XHRcdFx0XHRyZXR1cm4gZ2V0JCQxKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAobWV0aG9kLnRvVXBwZXJDYXNlKCkgPT09ICdQT1NUJykge1xuXHRcdFx0XHRcdHJldHVybiBwb3N0KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4geyB1cmw6ICcvJywgcGFyYW1zOiB7IG1ldGhvZDogJ0dFVCcgfSB9O1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3N1Ym1pdCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gc3VibWl0KHVybCkge1xuXHRcdFx0XHR2YXIgcGFyYW1zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuXHRcdFx0XHRpZiAodGhpcy5qc29ucCkge1xuXHRcdFx0XHRcdHJldHVybiBmZXRjaEpTT05QKHVybCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZmV0Y2godXJsLCBwYXJhbXMpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdGlmIChyZXMuc3RhdHVzICYmIHJlcy5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlcztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgZXJyb3IgPSBuZXcgRXJyb3IocmVzLnN0YXR1c1RleHQpO1xuXHRcdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHR2YXIgdHlwZSA9IHJlcy5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJyk7XG5cblx0XHRcdFx0XHRpZiAodHlwZSAmJiB0eXBlLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi9qc29uJykpIHtcblx0XHRcdFx0XHRcdHJldHVybiByZXMuanNvbigpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiByZXMudGV4dCgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdvblN1Y2Nlc3MnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIG9uU3VjY2VzcyhyZXMpIHtcblx0XHRcdFx0aWYgKHRoaXMuZWxlbWVudHMuc3VjY2Vzc01lc3NhZ2UpIHtcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnRzLnN1Y2Nlc3NNZXNzYWdlLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLmVsZW1lbnRzLmZvcm0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnRzLmZvcm0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcblxuXHRcdH0sIHtcblx0XHRcdGtleTogJ29uRXJyb3InLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIG9uRXJyb3IoZXJyKSB7XG5cdFx0XHRcdGlmICh0aGlzLmVsZW1lbnRzLmVycm9yTWVzc2FnZSkge1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudHMuZXJyb3JNZXNzYWdlLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdhY3Rpb24nLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmVsZW1lbnRzLmZvcm0uYWN0aW9uO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ21ldGhvZCcsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0aWYgKHRoaXMuanNvbnApIHtcblx0XHRcdFx0XHRyZXR1cm4gJ0dFVCc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gKHRoaXMuZWxlbWVudHMuZm9ybS5tZXRob2QgfHwgJ1BPU1QnKS50b1VwcGVyQ2FzZSgpO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3ZhbHVlcycsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBGb3JtRGF0YSh0aGlzLmVsZW1lbnRzLmZvcm0pO1xuXHRcdFx0fVxuXHRcdH1dKTtcblx0XHRyZXR1cm4gY29udHJvbGxlcjtcblx0fShCYXNlQ29udHJvbGxlcilcbn07XG5cbnZhciBrZXlUcmlnZ2VyID0ge1xuXHRhdHRyaWJ1dGVzOiBbeyBhdHRyaWJ1dGU6ICdrZXknLCB0eXBlOiAnaW50JyB9XSxcblx0Y29udHJvbGxlcjogZnVuY3Rpb24gKF9CYXNlQ29udHJvbGxlcikge1xuXHRcdGluaGVyaXRzKGNvbnRyb2xsZXIsIF9CYXNlQ29udHJvbGxlcik7XG5cblx0XHRmdW5jdGlvbiBjb250cm9sbGVyKCkge1xuXHRcdFx0Y2xhc3NDYWxsQ2hlY2sodGhpcywgY29udHJvbGxlcik7XG5cdFx0XHRyZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoY29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRyb2xsZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcblx0XHR9XG5cblx0XHRjcmVhdGVDbGFzcyhjb250cm9sbGVyLCBbe1xuXHRcdFx0a2V5OiAnaW5pdCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50cyA9IHRoaXMuZWxlbWVudHMgfHwge307XG5cblx0XHRcdFx0aWYgKHRoaXMuZWwuaGFzQXR0cmlidXRlKCdocmVmJykpIHtcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnRzLnRhcmdldCA9IHRoaXM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50cy50YXJnZXQgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJ1tocmVmXScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnYmluZCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gYmluZCgpIHtcblx0XHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdFx0aWYgKHRoaXMuZWxlbWVudHMudGFyZ2V0KSB7XG5cdFx0XHRcdFx0dGhpcy5vbigna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYgKGUud2hpY2ggPT09IF90aGlzMi5rZXkpIHtcblx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFx0XHRcdF90aGlzMi5lbGVtZW50cy50YXJnZXQuY2xpY2soKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCBkb2N1bWVudC5ib2R5KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH1dKTtcblx0XHRyZXR1cm4gY29udHJvbGxlcjtcblx0fShCYXNlQ29udHJvbGxlcilcbn07XG5cbnZhciBwYXJzZU1ldGFUYWcgPSBmdW5jdGlvbiBwYXJzZU1ldGFUYWcoKSB7XG5cdHZhciBibGFja2xpc3QgPSBbJ3ZpZXdwb3J0J107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHBhcnNlKHRhZykge1xuXHRcdHZhciBuYW1lID0gdGFnLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRcdHZhciBwcm9wZXJ0eSA9IHRhZy5nZXRBdHRyaWJ1dGUoJ3Byb3BlcnR5Jyk7XG5cdFx0dmFyIGNvbnRlbnQgPSB0YWcuZ2V0QXR0cmlidXRlKCdjb250ZW50Jyk7XG5cblx0XHRpZiAoIW5hbWUgJiYgIXByb3BlcnR5KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKGJsYWNrbGlzdC5pbmNsdWRlcyhuYW1lKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB7IG5hbWU6IG5hbWUsIHByb3BlcnR5OiBwcm9wZXJ0eSwgY29udGVudDogY29udGVudCB9O1xuXHR9O1xufSgpO1xuXG52YXIgcGFyc2VIVE1MID0gZnVuY3Rpb24gcGFyc2VIVE1MKCkge1xuXHR2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXG5cdHJldHVybiBmdW5jdGlvbiBwYXJzZShodG1sKSB7XG5cdFx0dmFyIHNlbGVjdG9yID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG5cdFx0dmFyIHBhcnNlZCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCwgJ3RleHQvaHRtbCcpO1xuXG5cdFx0Ly8gR2V0IGRvY3VtZW50IHRpdGxlXG5cdFx0dmFyIHRpdGxlID0gcGFyc2VkLnRpdGxlO1xuXG5cdFx0Ly8gR2V0IGRvY3VtZW50IG5vZGVzXG5cdFx0dmFyIGNvbnRlbnQgPSBwYXJzZWQuYm9keTtcblxuXHRcdGlmIChzZWxlY3Rvcikge1xuXHRcdFx0Y29udGVudCA9IHBhcnNlZC5ib2R5LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG5cdFx0XHRpZiAoIWNvbnRlbnQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdub3QtZm91bmQnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBHZXQgZG9jdW1lbnQgbWV0YVxuXHRcdHZhciBtZXRhID0gQXJyYXkuZnJvbShwYXJzZWQuaGVhZC5xdWVyeVNlbGVjdG9yQWxsKCdtZXRhJyksIGZ1bmN0aW9uICh0YWcpIHtcblx0XHRcdHJldHVybiBwYXJzZU1ldGFUYWcodGFnKTtcblx0XHR9KS5maWx0ZXIoZnVuY3Rpb24gKHQpIHtcblx0XHRcdHJldHVybiAhIXQ7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4geyB0aXRsZTogdGl0bGUsIGNvbnRlbnQ6IGNvbnRlbnQsIG1ldGE6IG1ldGEgfTtcblx0fTtcbn0oKTtcblxuZnVuY3Rpb24gcmVuZGVyTm9kZXMoY29udGVudCwgY29udGFpbmVyKSB7XG5cdHdoaWxlIChjb250YWluZXIuaGFzQ2hpbGROb2RlcygpKSB7XG5cdFx0Y29udGFpbmVyLnJlbW92ZUNoaWxkKGNvbnRhaW5lci5maXJzdENoaWxkKTtcblx0fVxuXG5cdGZvciAodmFyIGkgPSBjb250ZW50LmNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG5cdFx0dmFyIGNoaWxkID0gY29udGVudC5jaGlsZHJlbltpXTtcblxuXHRcdEFycmF5LmZyb20oY29udGVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1nJyksIGZ1bmN0aW9uIChpbWcpIHtcblx0XHRcdHZhciBjbG9uZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXHRcdFx0Y2xvbmUuc3JjID0gaW1nLnNyYztcblx0XHRcdGNsb25lLnNpemVzID0gaW1nLnNpemVzO1xuXHRcdFx0Y2xvbmUuc3Jjc2V0ID0gaW1nLnNyY3NldDtcblx0XHRcdGNsb25lLmNsYXNzTmFtZSA9IGltZy5jbGFzc05hbWU7XG5cblx0XHRcdGlmIChpbWcuZ2V0QXR0cmlidXRlKCd3aWR0aCcpKSB7XG5cdFx0XHRcdGNsb25lLndpZHRoID0gaW1nLndpZHRoO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaW1nLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykpIHtcblx0XHRcdFx0Y2xvbmUuaGVpZ2h0ID0gaW1nLmhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0aW1nLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNsb25lLCBpbWcpO1xuXG5cdFx0XHRyZXR1cm4gY2xvbmU7XG5cdFx0fSk7XG5cblx0XHRpZiAoY29udGFpbmVyLmZpcnN0Q2hpbGQpIHtcblx0XHRcdGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoY2hpbGQsIGNvbnRhaW5lci5maXJzdENoaWxkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gY2xlYW5Ob2Rlcyhub2Rlcywgc2VsZWN0b3IpIHtcblx0aWYgKCFzZWxlY3RvciB8fCBBcnJheS5pc0FycmF5KHNlbGVjdG9yKSAmJiBzZWxlY3Rvci5sZW5ndGggPT09IDApIHtcblx0XHRyZXR1cm4gbm9kZXM7XG5cdH1cblxuXHR2YXIgc3RyaW5nU2VsZWN0b3IgPSBBcnJheS5pc0FycmF5KHNlbGVjdG9yKSA/IHNlbGVjdG9yLmpvaW4oJywgJykgOiBzZWxlY3RvcjtcblxuXHR2YXIgYmxvYXQgPSBBcnJheS5mcm9tKG5vZGVzLnF1ZXJ5U2VsZWN0b3JBbGwoc3RyaW5nU2VsZWN0b3IpKTtcblxuXHRibG9hdC5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0cmV0dXJuIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcblx0fSk7XG5cblx0cmV0dXJuIG5vZGVzO1xufVxuXG52YXIgb3ZlcmxheSA9IHtcblx0YXR0cmlidXRlczogW10sXG5cdGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChfQmFzZUNvbnRyb2xsZXIpIHtcblx0XHRpbmhlcml0cyhjb250cm9sbGVyLCBfQmFzZUNvbnRyb2xsZXIpO1xuXG5cdFx0ZnVuY3Rpb24gY29udHJvbGxlcigpIHtcblx0XHRcdGNsYXNzQ2FsbENoZWNrKHRoaXMsIGNvbnRyb2xsZXIpO1xuXHRcdFx0cmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKGNvbnRyb2xsZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250cm9sbGVyKSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG5cdFx0fVxuXG5cdFx0Y3JlYXRlQ2xhc3MoY29udHJvbGxlciwgW3tcblx0XHRcdGtleTogJ2luaXQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHRcdC8vIFN0b3JlIHRoZSBvcmlnaW5hbCBjbGFzc2VzIHNvIHdlIGNhbiBhbHdheXMgcmV2ZXJ0IGJhY2sgdG8gdGhlIGRlZmF1bHQgc3RhdGVcblx0XHRcdFx0Ly8gd2hpbGUgcmVuZGVyaW5nIGluIGRpZmZlcmVudCBhc3BlY3RzXG5cdFx0XHRcdHRoaXMub3JpZ2luYWxDbGFzc2VzID0gQXJyYXkuZnJvbSh0aGlzLmVsLmNsYXNzTGlzdCk7XG5cblx0XHRcdFx0dGhpcy5zdHJpcEZyb21SZXNwb25zZSA9IFsnbGlua1tyZWw9XCJ1cFwiXScsIHRoaXMuZWwudGFnTmFtZV07XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuICAgICogVGhpcyBtZXRob2QgZ2V0cyBydW4gd2hlbiBhIGA8bXItb3ZlcmxheT5gXG4gICAgKiBhcHBlYXJzIGluIHRoZSBET00sIGVpdGhlciBhZnRlciBET00gcmVhZHlcbiAgICAqIG9yIHdoZW4gSFRNTCBnZXRzIGF0dGFjaGVkIGxhdGVyIG9uIGluIHRoZSBicm93c2luZyBzZXNzaW9uXG4gICAgKi9cblxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3JlbmRlcicsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0XHQvLyBTdG9yZSB0aGUgb3JpZ2luYWwgY2xhc3NlcyBzbyB3ZSBjYW4gYWx3YXlzIHJldmVydCBiYWNrIHRvIHRoZSBkZWZhdWx0IHN0YXRlXG5cdFx0XHRcdC8vIHdoaWxlIHJlbmRlcmluZyBpbiBkaWZmZXJlbnQgYXNwZWN0c1xuXHRcdFx0XHR0aGlzLm9yaWdpbmFsQ2xhc3NlcyA9IEFycmF5LmZyb20odGhpcy5lbC5jbGFzc0xpc3QpO1xuXG5cdFx0XHRcdC8vIEFkZCA8bGluayByZWw9XCJ1cFwiIGhyZWY9XCIvXCI+IGluc2lkZSBhbiBvdmVybGF5IHRvIGZldGNoIGEgYmFja2dyb3VuZCB2aWV3XG5cdFx0XHRcdHZhciB1cExpbmsgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbcmVsPVwidXBcIl0nKTtcblxuXHRcdFx0XHRpZiAodXBMaW5rKSB7XG5cdFx0XHRcdFx0dmFyIGhyZWYgPSB1cExpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cblx0XHRcdFx0XHRmZXRjaChocmVmLCB7IGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgfSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzLnRleHQoKTtcblx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChodG1sKSB7XG5cdFx0XHRcdFx0XHR2YXIgX3BhcnNlSFRNTCA9IHBhcnNlSFRNTChodG1sKSxcblx0XHRcdFx0XHRcdCAgICB0aXRsZSA9IF9wYXJzZUhUTUwudGl0bGUsXG5cdFx0XHRcdFx0XHQgICAgY29udGVudCA9IF9wYXJzZUhUTUwuY29udGVudDtcblxuXHRcdFx0XHRcdFx0aWYgKGNvbnRlbnQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGNvbnRlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoX3RoaXMyLmVsLnRhZ05hbWUpWzBdKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGNsYXNzTGlzdCA9IGNvbnRlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoX3RoaXMyLmVsLnRhZ05hbWUpWzBdLmNsYXNzTGlzdDtcblx0XHRcdFx0XHRcdFx0XHRfdGhpczIub3JpZ2luYWxDbGFzc2VzID0gQXJyYXkuZnJvbShjbGFzc0xpc3QpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0dmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIENsZWFuIGNlcnRhaW4gc2VsZWN0b3JzIGZyb20gdGhlIHVwIHN0YXRlIHRvIGF2b2lkIGluZmluaXRlIGxvb3BzXG5cdFx0XHRcdFx0XHRcdHZhciBjbGVhbiA9IGNsZWFuTm9kZXMoY29udGVudCwgX3RoaXMyLnN0cmlwRnJvbVJlc3BvbnNlKTtcblxuXHRcdFx0XHRcdFx0XHRyZW5kZXJOb2RlcyhjbGVhbiwgZnJhZ21lbnQpO1xuXG5cdFx0XHRcdFx0XHRcdF90aGlzMi5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShmcmFnbWVudCwgX3RoaXMyLmVsKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBUaGUgdXBTdGF0ZSBpcyBub3QgdGhlIG92ZXJsYXkgdmlldyBidXQgdGhlIGJhY2tncm91bmQgdmlld1xuXHRcdFx0XHRcdFx0XHRfdGhpczIudXBTdGF0ZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRocmVmOiBocmVmLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiB0aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRyb290OiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdGJ5OiBfdGhpczIuZWwudGFnTmFtZVxuXHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHRcdC8vIFdlIG5lZWQgdG8gcmVwbGFjZSB0aGUgY3VycmVudCBzdGF0ZSB0byBoYW5kbGUgYHBvcHN0YXRlYFxuXHRcdFx0XHRcdFx0XHR2YXIgc3RhdGUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0aHJlZjogd2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdHJvb3Q6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdGJ5OiBfdGhpczIuZWwudGFnTmFtZVxuXHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShzdGF0ZSwgc3RhdGUudGl0bGUsIHN0YXRlLmhyZWYpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFNldCBpc1Nob3duIHNvIHRoYXQgdGhlIGNsb3NpbmcgaGFuZGxlciB3b3JrcyBjb3JyZWN0bHlcblx0XHRcdFx0XHRcdFx0X3RoaXMyLmlzU2hvd24gPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEN1cnJlbnRseSBub3QgaW5zaWRlIGFuIG92ZXJsYXkgdmlldywgYnV0IGFuIG92ZXJsYXkgbWlnaHQgb3BlblxuXHRcdFx0XHRcdC8vIChiZWNhdXNlIGFuIGVtcHR5IDxtci1vdmVybGF5PiBpcyBwcmVzZW50KVxuXHRcdFx0XHRcdC8vIHNvIHdlIHN0b3JlIHRoZSBjdXJyZW50IHN0YXRlIHRvIHN1cHBvcnQgYHBvcHN0YXRlYCBldmVudHNcblx0XHRcdFx0XHR2YXIgdGl0bGUgPSBkb2N1bWVudC50aXRsZTtcblx0XHRcdFx0XHR2YXIgX2hyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuXHRcdFx0XHRcdHRoaXMudXBTdGF0ZSA9IHtcblx0XHRcdFx0XHRcdGhyZWY6IF9ocmVmLFxuXHRcdFx0XHRcdFx0dGl0bGU6IHRpdGxlLFxuXHRcdFx0XHRcdFx0cm9vdDogdHJ1ZSxcblx0XHRcdFx0XHRcdGJ5OiB0aGlzLmVsLnRhZ05hbWVcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHRoaXMudXBTdGF0ZSwgdGl0bGUsIF9ocmVmKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2JpbmQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGJpbmQoKSB7XG5cdFx0XHRcdHZhciBfdGhpczMgPSB0aGlzO1xuXG5cdFx0XHRcdHZhciBoaWRlSGFuZGxlciA9IGZ1bmN0aW9uIGhpZGVIYW5kbGVyKGUpIHtcblx0XHRcdFx0XHRpZiAoX3RoaXMzLmlzU2hvd24pIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0X3RoaXMzLmhpZGUoKTtcblxuXHRcdFx0XHRcdFx0aWYgKF90aGlzMy51cFN0YXRlKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBfdXBTdGF0ZSA9IF90aGlzMy51cFN0YXRlLFxuXHRcdFx0XHRcdFx0XHQgICAgdGl0bGUgPSBfdXBTdGF0ZS50aXRsZSxcblx0XHRcdFx0XHRcdFx0ICAgIGhyZWYgPSBfdXBTdGF0ZS5ocmVmO1xuXG5cblx0XHRcdFx0XHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKF90aGlzMy51cFN0YXRlLCB0aXRsZSwgaHJlZik7XG5cdFx0XHRcdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpZiAoZS50YXJnZXQgPT09IF90aGlzMy5lbCkge1xuXHRcdFx0XHRcdFx0aGlkZUhhbmRsZXIoZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB0aGlzLmVsKTtcblxuXHRcdFx0XHR0aGlzLm9uKCdjbGljayAuanMtb3ZlcmxheS1zaG93JywgZnVuY3Rpb24gKGUsIHRhcmdldCkge1xuXHRcdFx0XHRcdHZhciBocmVmID0gdGFyZ2V0LmhyZWY7XG5cblx0XHRcdFx0XHRpZiAoaHJlZikge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0X3RoaXMzLnNob3coaHJlZik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBkb2N1bWVudC5ib2R5KTtcblxuXHRcdFx0XHR0aGlzLm9uKCdjbGljayAuanMtb3ZlcmxheS1oaWRlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRoaWRlSGFuZGxlcihlKTtcblx0XHRcdFx0fSwgZG9jdW1lbnQuYm9keSk7XG5cblx0XHRcdFx0dGhpcy5vbigncG9wc3RhdGUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdC8vIE9ubHkgaGFuZGxlIHN0YXRlcyB0aGF0IHdlcmUgc2V0IGJ5IGBtci1vdmVybGF5YFxuXHRcdFx0XHRcdC8vIHRvIGF2b2lkIG1lc3Npbmcgd2l0aCBvdGhlciBlbGVtZW50cyB0aGF0IHVzZSB0aGUgSGlzdG9yeSBBUElcblx0XHRcdFx0XHRpZiAoZS5zdGF0ZSAmJiBlLnN0YXRlLmJ5ID09PSBfdGhpczMuZWwudGFnTmFtZSAmJiBlLnN0YXRlLmhyZWYpIHtcblx0XHRcdFx0XHRcdHZhciBfZSRzdGF0ZSA9IGUuc3RhdGUsXG5cdFx0XHRcdFx0XHQgICAgaHJlZiA9IF9lJHN0YXRlLmhyZWYsXG5cdFx0XHRcdFx0XHQgICAgdGl0bGUgPSBfZSRzdGF0ZS50aXRsZTtcblx0XHRcdFx0XHRcdHZhciBfdXBTdGF0ZTIgPSBfdGhpczMudXBTdGF0ZSxcblx0XHRcdFx0XHRcdCAgICB1cEhyZWYgPSBfdXBTdGF0ZTIuaHJlZixcblx0XHRcdFx0XHRcdCAgICB1cFRpdGxlID0gX3VwU3RhdGUyLnRpdGxlO1xuXG5cdFx0XHRcdFx0XHR2YXIgaGFzUmVxdWVzdGVkVXBTdGF0ZSA9IGhyZWYgPT09IHVwSHJlZiAmJiB0aXRsZSA9PT0gdXBUaXRsZTtcblxuXHRcdFx0XHRcdFx0aWYgKGUuc3RhdGUucm9vdCAmJiBoYXNSZXF1ZXN0ZWRVcFN0YXRlKSB7XG5cdFx0XHRcdFx0XHRcdC8vIFRyaWdnZXIgaGlkZSgpIGlmIHRoZSBwb3BzdGF0ZSByZXF1ZXN0cyB0aGUgcm9vdCB2aWV3XG5cdFx0XHRcdFx0XHRcdF90aGlzMy5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gX3RoaXMzLnVwU3RhdGUudGl0bGU7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyBTaG93IHRoZSBvdmVybGF5KCkgaWYgd2UgY2xvc2VkIHRoZSBvdmVybGF5IGJlZm9yZVxuXHRcdFx0XHRcdFx0XHRfdGhpczMuc2hvdyhlLnN0YXRlLmhyZWYsIGZhbHNlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHdpbmRvdyk7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnc2hvdycsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gc2hvdyhocmVmKSB7XG5cdFx0XHRcdHZhciBfdGhpczQgPSB0aGlzO1xuXG5cdFx0XHRcdHZhciBwdXNoU3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRydWU7XG5cblx0XHRcdFx0dmFyIHVwZGF0ZU1ldGFUYWdzID0gZnVuY3Rpb24gdXBkYXRlTWV0YVRhZ3ModGFncykge1xuXHRcdFx0XHRcdHRhZ3MuZm9yRWFjaChmdW5jdGlvbiAodGFnKSB7XG5cdFx0XHRcdFx0XHR2YXIgc2VsZWN0b3IgPSAnbWV0YSc7XG5cblx0XHRcdFx0XHRcdGlmICh0YWcucHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdFx0c2VsZWN0b3IgPSBzZWxlY3RvciArICdbcHJvcGVydHk9XCInICsgdGFnLnByb3BlcnR5ICsgJ1wiXSc7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICh0YWcubmFtZSkge1xuXHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IHNlbGVjdG9yICsgJ1tuYW1lPVwiJyArIHRhZy5uYW1lICsgJ1wiXSc7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHZhciBtYXRjaCA9IGRvY3VtZW50LmhlYWQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cblx0XHRcdFx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRcdFx0XHRtYXRjaC5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCB0YWcuY29udGVudCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR2YXIgYXBwZW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWV0YScpO1xuXHRcdFx0XHRcdFx0XHRhcHBlbmQucHJvcGVydHkgPSB0YWcucHJvcGVydHk7XG5cdFx0XHRcdFx0XHRcdGFwcGVuZC5jb250ZW50ID0gdGFnLmNvbnRlbnQ7XG5cdFx0XHRcdFx0XHRcdGFwcGVuZC5uYW1lID0gdGFnLm5hbWU7XG5cdFx0XHRcdFx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoYXBwZW5kKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgcmVuZGVyQ29udGVudCA9IGZ1bmN0aW9uIHJlbmRlckNvbnRlbnQoY29udGVudCkge1xuXHRcdFx0XHRcdHZhciBuZXdDbGFzc2VzID0gQXJyYXkuZnJvbShjb250ZW50LmNsYXNzTGlzdCk7XG5cdFx0XHRcdFx0X3RoaXM0LmVsLmNsYXNzTmFtZSA9ICcnO1xuXHRcdFx0XHRcdC8vIFRoaXMgY3Jhc2hlcyBpbiBJRTExXG5cdFx0XHRcdFx0Ly8gdGhpcy5lbC5jbGFzc0xpc3QuYWRkKC4uLm5ld0NsYXNzZXMpO1xuXHRcdFx0XHRcdG5ld0NsYXNzZXMuZm9yRWFjaChmdW5jdGlvbiAoYykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIF90aGlzNC5lbC5jbGFzc0xpc3QuYWRkKGMpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0X3RoaXM0LmlzU2hvd24gPSB0cnVlO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYW4gY2VydGFpbiBzZWxlY3RvcnMgZnJvbSB0aGUgdXAgc3RhdGUgdG8gYXZvaWQgaW5maW5pdGUgbG9vcHNcblx0XHRcdFx0XHR2YXIgY2xlYW4gPSBjbGVhbk5vZGVzKGNvbnRlbnQsIF90aGlzNC5zdHJpcEZyb21SZXNwb25zZSk7XG5cblx0XHRcdFx0XHRyZW5kZXJOb2RlcyhjbGVhbiwgX3RoaXM0LmVsKTtcblxuXHRcdFx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0X3RoaXM0LmVsLnNjcm9sbFRvcCA9IDA7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIHVwZGF0ZVRpdGxlID0gZnVuY3Rpb24gdXBkYXRlVGl0bGUodGl0bGUpIHtcblx0XHRcdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHJldHVybiBmZXRjaChocmVmLCB7IGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgfSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlcy50ZXh0KCk7XG5cdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcblx0XHRcdFx0XHR2YXIgX3BhcnNlSFRNTDIgPSBwYXJzZUhUTUwoaHRtbCwgX3RoaXM0LmVsLnRhZ05hbWUpLFxuXHRcdFx0XHRcdCAgICB0aXRsZSA9IF9wYXJzZUhUTUwyLnRpdGxlLFxuXHRcdFx0XHRcdCAgICBjb250ZW50ID0gX3BhcnNlSFRNTDIuY29udGVudCxcblx0XHRcdFx0XHQgICAgbWV0YSA9IF9wYXJzZUhUTUwyLm1ldGE7XG5cblx0XHRcdFx0XHR1cGRhdGVNZXRhVGFncyhtZXRhKTtcblxuXHRcdFx0XHRcdGlmIChjb250ZW50KSB7XG5cdFx0XHRcdFx0XHRyZW5kZXJDb250ZW50KGNvbnRlbnQpO1xuXHRcdFx0XHRcdFx0dXBkYXRlVGl0bGUodGl0bGUpO1xuXG5cdFx0XHRcdFx0XHRpZiAocHVzaFN0YXRlKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBzdGF0ZSA9IHsgaHJlZjogaHJlZiwgdGl0bGU6IHRpdGxlLCBieTogX3RoaXM0LmVsLnRhZ05hbWUgfTtcblx0XHRcdFx0XHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlLCB0aXRsZSwgaHJlZik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdoaWRlJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBoaWRlKCkge1xuXHRcdFx0XHR2YXIgX3RoaXM1ID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLmlzU2hvd24gPSBmYWxzZTtcblxuXHRcdFx0XHR3aGlsZSAodGhpcy5lbC5oYXNDaGlsZE5vZGVzKCkpIHtcblx0XHRcdFx0XHR0aGlzLmVsLnJlbW92ZUNoaWxkKHRoaXMuZWwuZmlyc3RDaGlsZCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5vcmlnaW5hbENsYXNzZXMgJiYgQXJyYXkuaXNBcnJheSh0aGlzLm9yaWdpbmFsQ2xhc3NlcykpIHtcblx0XHRcdFx0XHR0aGlzLmVsLmNsYXNzTmFtZSA9ICcnO1xuXG5cdFx0XHRcdFx0Ly8gVGhpcyBjcmFzaGVzIGluIElFMTFcblx0XHRcdFx0XHQvLyB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoLi4udGhpcy5vcmlnaW5hbENsYXNzZXMpO1xuXHRcdFx0XHRcdHRoaXMub3JpZ2luYWxDbGFzc2VzLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBfdGhpczUuZWwuY2xhc3NMaXN0LmFkZChjKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2lzU2hvd24nLFxuXG5cdFx0XHQvKipcbiAgICAqIGBpc1Nob3duYCBpcyBhIGJvb2xlYW4gdGhhdCB0cmFja3NcbiAgICAqIGlmIHRoZSBvdmVybGF5IGlzIGN1cnJlbnRseSBvcGVuIG9yIG5vdFxuICAgICogKi9cblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHRyZXR1cm4gISF0aGlzLl9pc1Nob3duO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24gc2V0JCQxKHRvKSB7XG5cdFx0XHRcdHRoaXMuX2lzU2hvd24gPSAhIXRvO1xuXHRcdFx0XHR0aGlzLmVsLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWhpZGRlbicsICF0aGlzLl9pc1Nob3duKTtcblx0XHRcdFx0dGhpcy5lbC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zaG93bicsIHRoaXMuX2lzU2hvd24pO1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNob3dpbmctb3ZlcmxheScsIHRoaXMuX2lzU2hvd24pO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcbiAgICAqIE9yaWdpbmFsIHN0YXRlIGlzIHRoZSBIaXN0b3J5IEFQSSBzdGF0ZSBmb3IgdGhlIHBhcmVudCBwYWdlXG4gICAgKiAodGhlIHBhZ2UgYmVsb3cgdGhlIG92ZXJsYXkpXG4gICAgKiAobm90IG5lY2Nlc2FyaWx5IHRoZSBmaXJzdCBwYWdlIHRoYXQgd2FzIGxvYWRlZClcbiAgICAqICovXG5cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICd1cFN0YXRlJyxcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fdXBTdGF0ZSk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiBmdW5jdGlvbiBzZXQkJDEodG8pIHtcblx0XHRcdFx0dGhpcy5fdXBTdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRvKTtcblx0XHRcdH1cblx0XHR9XSk7XG5cdFx0cmV0dXJuIGNvbnRyb2xsZXI7XG5cdH0oQmFzZUNvbnRyb2xsZXIpXG59O1xuXG52YXIgZ2V0TWV0YVZhbHVlcyA9IGZ1bmN0aW9uIGdldE1ldGFWYWx1ZXMoKSB7XG5cdHZhciBub2RlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBkb2N1bWVudC5oZWFkO1xuXHR2YXIgc2VsZWN0b3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICcnO1xuXG5cdHZhciBleHRyYWN0S2V5ID0gZnVuY3Rpb24gZXh0cmFjdEtleSh0YWcpIHtcblx0XHR2YXIgcmF3ID0gdGFnLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXG5cdFx0aWYgKCFyYXcpIHtcblx0XHRcdHJhdyA9IHRhZy5nZXRBdHRyaWJ1dGUoJ3Byb3BlcnR5Jyk7XG5cdFx0fVxuXG5cdFx0dmFyIHN0cmlwcGVkID0gcmF3Lm1hdGNoKC9eKD86Lio6KT8oLiopJC9pKTtcblxuXHRcdGlmIChzdHJpcHBlZCkge1xuXHRcdFx0cmV0dXJuIHN0cmlwcGVkWzFdO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9O1xuXG5cdHZhciB0YWdzID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KG5vZGUucXVlcnlTZWxlY3RvckFsbCgnbWV0YScgKyBzZWxlY3RvcikpKTtcblxuXHQvLyBHZXQgPG1ldGE+IHZhbHVlc1xuXHRyZXR1cm4gdGFncy5yZWR1Y2UoZnVuY3Rpb24gKGNhcnJ5LCB0YWcpIHtcblx0XHR2YXIga2V5ID0gZXh0cmFjdEtleSh0YWcpO1xuXG5cdFx0aWYgKGtleSkge1xuXHRcdFx0dmFyIHZhbHVlID0gdGFnLmdldEF0dHJpYnV0ZSgnY29udGVudCcpO1xuXHRcdFx0T2JqZWN0LmFzc2lnbihjYXJyeSwgZGVmaW5lUHJvcGVydHkoe30sIGtleSwgdmFsdWUpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2Fycnk7XG5cdH0sIHt9KTtcbn07XG5cbnZhciBnZW5lcmF0ZVF1ZXJ5c3RyaW5nID0gZnVuY3Rpb24gZ2VuZXJhdGVRdWVyeXN0cmluZyhwYXJhbXMpIHtcblx0dmFyIHF1ZXJ5c3RyaW5nID0gT2JqZWN0LmVudHJpZXMocGFyYW1zKS5tYXAoZnVuY3Rpb24gKF9yZWYpIHtcblx0XHR2YXIgX3JlZjIgPSBzbGljZWRUb0FycmF5KF9yZWYsIDIpLFxuXHRcdCAgICBrZXkgPSBfcmVmMlswXSxcblx0XHQgICAgdmFsdWUgPSBfcmVmMlsxXTtcblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dmFyIGVuY29kZWQgPSB3aW5kb3cuZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcblx0XHRcdHJldHVybiBrZXkgKyAnPScgKyBlbmNvZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiAnJztcblx0fSkuZmlsdGVyKGZ1bmN0aW9uIChwYXJhbSkge1xuXHRcdHJldHVybiAhIXBhcmFtO1xuXHR9KS5qb2luKCcmJyk7XG5cblx0aWYgKHF1ZXJ5c3RyaW5nLmxlbmd0aCA+IDApIHtcblx0XHRyZXR1cm4gJz8nICsgcXVlcnlzdHJpbmc7XG5cdH1cblxuXHRyZXR1cm4gJyc7XG59O1xuXG52YXIgb3BlbldpbmRvdyA9IGZ1bmN0aW9uIG9wZW5XaW5kb3coaHJlZikge1xuXHR2YXIgcGFyYW1zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG5cdHZhciBxdWVyeXN0cmluZyA9IGdlbmVyYXRlUXVlcnlzdHJpbmcocGFyYW1zKTtcblx0dmFyIG5hbWUgPSBvcHRpb25zLm5hbWUsXG5cdCAgICBpbnZpc2libGUgPSBvcHRpb25zLmludmlzaWJsZTtcblxuXG5cdGlmIChpbnZpc2libGUpIHtcblx0XHR3aW5kb3cubG9jYXRpb24gPSAnJyArIGhyZWYgKyBxdWVyeXN0cmluZztcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgd2lkdGggPSBvcHRpb25zLndpZHRoLFxuXHQgICAgaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG5cblxuXHR3aWR0aCA9IHdpZHRoIHx8IDU2MDtcblx0aGVpZ2h0ID0gaGVpZ2h0IHx8IDQyMDtcblxuXHR2YXIgeCA9IE1hdGgucm91bmQoKHdpbmRvdy5pbm5lcldpZHRoIC0gd2lkdGgpIC8gMik7XG5cdHZhciB5ID0gTWF0aC5yb3VuZCgod2luZG93LmlubmVySGVpZ2h0IC0gaGVpZ2h0KSAvIDIpO1xuXG5cdHZhciBwb3B1cCA9IHdpbmRvdy5vcGVuKCcnICsgaHJlZiArIHF1ZXJ5c3RyaW5nLCBuYW1lLCAnd2lkdGg9JyArIHdpZHRoICsgJywgaGVpZ2h0PScgKyBoZWlnaHQgKyAnLCBsZWZ0PScgKyB4ICsgJywgdG9wPScgKyB5KTtcblxuXHRpZiAodHlwZW9mIHBvcHVwLmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cG9wdXAuZm9jdXMoKTtcblx0fVxufTtcblxudmFyIHNoYXJlID0ge1xuXHRhdHRyaWJ1dGVzOiBbXSxcblx0Y29udHJvbGxlcjogZnVuY3Rpb24gKF9CYXNlQ29udHJvbGxlcikge1xuXHRcdGluaGVyaXRzKGNvbnRyb2xsZXIsIF9CYXNlQ29udHJvbGxlcik7XG5cblx0XHRmdW5jdGlvbiBjb250cm9sbGVyKCkge1xuXHRcdFx0Y2xhc3NDYWxsQ2hlY2sodGhpcywgY29udHJvbGxlcik7XG5cdFx0XHRyZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoY29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRyb2xsZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcblx0XHR9XG5cblx0XHRjcmVhdGVDbGFzcyhjb250cm9sbGVyLCBbe1xuXHRcdFx0a2V5OiAnaW5pdCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50cyA9IHt9O1xuXG5cdFx0XHRcdHRoaXMuZWxlbWVudHMuZmFjZWJvb2sgPSB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXNoYXJlLWZhY2Vib29rJylbMF07XG5cdFx0XHRcdHRoaXMuZWxlbWVudHMudHdpdHRlciA9IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtc2hhcmUtdHdpdHRlcicpWzBdO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRzLnBpbnRlcmVzdCA9IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtc2hhcmUtcGludGVyZXN0JylbMF07XG5cdFx0XHRcdHRoaXMuZWxlbWVudHMubWFpbCA9IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtc2hhcmUtbWFpbCcpWzBdO1xuXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2JpbmQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGJpbmQoKSB7XG5cdFx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHRcdGlmICh0aGlzLmVsZW1lbnRzLmZhY2Vib29rKSB7XG5cdFx0XHRcdFx0dGhpcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdF90aGlzMi5zaGFyZU9uRmFjZWJvb2soKTtcblx0XHRcdFx0XHR9LCB0aGlzLmVsZW1lbnRzLmZhY2Vib29rKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGlzLmVsZW1lbnRzLnR3aXR0ZXIpIHtcblx0XHRcdFx0XHR0aGlzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0X3RoaXMyLnNoYXJlT25Ud2l0dGVyKCk7XG5cdFx0XHRcdFx0fSwgdGhpcy5lbGVtZW50cy50d2l0dGVyKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGlzLmVsZW1lbnRzLnBpbnRlcmVzdCkge1xuXHRcdFx0XHRcdHRoaXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRfdGhpczIuc2hhcmVPblBpbnRlcmVzdCgpO1xuXHRcdFx0XHRcdH0sIHRoaXMuZWxlbWVudHMucGludGVyZXN0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGlzLmVsZW1lbnRzLm1haWwpIHtcblx0XHRcdFx0XHR0aGlzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0X3RoaXMyLnNoYXJlVmlhTWFpbCgpO1xuXHRcdFx0XHRcdH0sIHRoaXMuZWxlbWVudHMubWFpbCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdzaGFyZU9uRmFjZWJvb2snLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHNoYXJlT25GYWNlYm9vaygpIHtcblx0XHRcdFx0dmFyIHZhbHVlcyA9IGdldE1ldGFWYWx1ZXMoZG9jdW1lbnQuaGVhZCwgJ1twcm9wZXJ0eV49XCJvZzpcIl0nKTtcblxuXHRcdFx0XHR2YXIgcGFyYW1zID0ge1xuXHRcdFx0XHRcdHU6IHZhbHVlcy51cmwgfHwgdGhpcy51cmwsXG5cdFx0XHRcdFx0dGl0bGU6IHZhbHVlcy50aXRsZSB8fCB0aGlzLnRpdGxlLFxuXHRcdFx0XHRcdGNhcHRpb246IHZhbHVlcy5zaXRlX25hbWUsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246IHZhbHVlcy5kZXNjcmlwdGlvbiB8fCB0aGlzLmRlc2NyaXB0aW9uXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIGlzQWJzb2x1dGVVcmwgPSAvXihodHRwcz86KT9cXC9cXC8vaTtcblxuXHRcdFx0XHRpZiAoaXNBYnNvbHV0ZVVybC50ZXN0KHZhbHVlcy5pbWFnZSkpIHtcblx0XHRcdFx0XHRwYXJhbXMucGljdHVyZSA9IHZhbHVlcy5pbWFnZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG9wZW5XaW5kb3coJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIucGhwJywgcGFyYW1zLCB7IG5hbWU6ICdTaGFyZSBvbiBGYWNlYm9vaycsIHdpZHRoOiA1NjAsIGhlaWdodDogNjMwIH0pO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3NoYXJlT25QaW50ZXJlc3QnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHNoYXJlT25QaW50ZXJlc3QoKSB7XG5cdFx0XHRcdHZhciB2YWx1ZXMgPSBnZXRNZXRhVmFsdWVzKGRvY3VtZW50LmhlYWQsICdbcHJvcGVydHlePVwib2c6XCJdJyk7XG5cblx0XHRcdFx0dmFyIHBhcmFtcyA9IHtcblx0XHRcdFx0XHR1cmw6IHZhbHVlcy51cmwgfHwgdGhpcy51cmwsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246IHZhbHVlcy5kZXNjcmlwdGlvbiB8fCB0aGlzLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHRcdHRvb2xiYXI6ICdubycsXG5cdFx0XHRcdFx0bWVkaWE6IHZhbHVlcy5pbWFnZVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdG9wZW5XaW5kb3coJ2h0dHBzOi8vd3d3LnBpbnRlcmVzdC5jb20vcGluL2NyZWF0ZS9idXR0b24nLCBwYXJhbXMsIHsgbmFtZTogJ1NoYXJlIG9uIFBpbnRlcmVzdCcsIHdpZHRoOiA3NDAsIGhlaWdodDogNzAwIH0pO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3NoYXJlT25Ud2l0dGVyJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBzaGFyZU9uVHdpdHRlcigpIHtcblx0XHRcdFx0dmFyIHZhbHVlcyA9IGdldE1ldGFWYWx1ZXMoZG9jdW1lbnQuaGVhZCwgJ1tuYW1lXj1cInR3aXR0ZXI6XCJdJyk7XG5cblx0XHRcdFx0dmFyIHBhcmFtcyA9IHtcblx0XHRcdFx0XHR1cmw6IHZhbHVlcy51cmwgfHwgdGhpcy51cmwsXG5cdFx0XHRcdFx0dGV4dDogdmFsdWVzLnRpdGxlIHx8IHRoaXMudGl0bGUsXG5cdFx0XHRcdFx0dmlhOiB2YWx1ZXMuc2l0ZSA/IHZhbHVlcy5zaXRlLnJlcGxhY2UoJ0AnLCAnJykgOiB1bmRlZmluZWRcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRvcGVuV2luZG93KCdodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldCcsIHBhcmFtcywgeyBuYW1lOiAnU2hhcmUgb24gVHdpdHRlcicsIHdpZHRoOiA1ODAsIGhlaWdodDogMjUzIH0pO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3NoYXJlVmlhTWFpbCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gc2hhcmVWaWFNYWlsKCkge1xuXHRcdFx0XHR2YXIgcGFyYW1zID0ge1xuXHRcdFx0XHRcdHN1YmplY3Q6IHRoaXMudGl0bGUsXG5cdFx0XHRcdFx0Ym9keTogdGhpcy50aXRsZSArICcgKCcgKyB0aGlzLnVybCArICcpIC0gJyArIHRoaXMuZGVzY3JpcHRpb25cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRvcGVuV2luZG93KCdtYWlsdG86JywgcGFyYW1zLCB7IGludmlzaWJsZTogdHJ1ZSB9KTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICd0aXRsZScsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0dmFyIGF0dHJpYnV0ZSA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdtci1zaGFyZS10aXRsZScpO1xuXHRcdFx0XHR2YXIgZmFsbGJhY2sgPSBkb2N1bWVudC50aXRsZTtcblx0XHRcdFx0cmV0dXJuIGF0dHJpYnV0ZSB8fCBmYWxsYmFjaztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdkZXNjcmlwdGlvbicsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0dmFyIGF0dHJpYnV0ZSA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdtci1zaGFyZS1kZXNjcmlwdGlvbicpO1xuXHRcdFx0XHR2YXIgZmFsbGJhY2sgPSAnJztcblxuXHRcdFx0XHR2YXIgdGFnID0gZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJkZXNjcmlwdGlvblwiJyk7XG5cblx0XHRcdFx0aWYgKHRhZykge1xuXHRcdFx0XHRcdGZhbGxiYWNrID0gdGFnLmdldEF0dHJpYnV0ZSgnY29udGVudCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGF0dHJpYnV0ZSB8fCBmYWxsYmFjaztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICd1cmwnLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdHZhciBhdHRyaWJ1dGUgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSgnbXItc2hhcmUtdXJsJyk7XG5cdFx0XHRcdHZhciBmYWxsYmFjayA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXG5cdFx0XHRcdHZhciB0YWcgPSBkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbcmVsPVwiY2Fub25pY2FsXCJdJyk7XG5cblx0XHRcdFx0aWYgKHRhZykge1xuXHRcdFx0XHRcdGZhbGxiYWNrID0gdGFnLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGF0dHJpYnV0ZSB8fCBmYWxsYmFjaztcblx0XHRcdH1cblx0XHR9XSk7XG5cdFx0cmV0dXJuIGNvbnRyb2xsZXI7XG5cdH0oQmFzZUNvbnRyb2xsZXIpXG59O1xuXG52YXIgc21vb3RoU3RhdGUgPSB7XG5cdGF0dHJpYnV0ZXM6IFtdLFxuXHRjb250cm9sbGVyOiBmdW5jdGlvbiAoX0Jhc2VDb250cm9sbGVyKSB7XG5cdFx0aW5oZXJpdHMoY29udHJvbGxlciwgX0Jhc2VDb250cm9sbGVyKTtcblxuXHRcdGZ1bmN0aW9uIGNvbnRyb2xsZXIoKSB7XG5cdFx0XHRjbGFzc0NhbGxDaGVjayh0aGlzLCBjb250cm9sbGVyKTtcblx0XHRcdHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChjb250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udHJvbGxlcikpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuXHRcdH1cblxuXHRcdGNyZWF0ZUNsYXNzKGNvbnRyb2xsZXIsIFt7XG5cdFx0XHRrZXk6ICdhZGRUb1BhdGgnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGFkZFRvUGF0aChocmVmKSB7XG5cdFx0XHRcdC8vIE1ha2Ugc3VyZSBgaHJlZmAgaXMgYW4gYWJzb2x1dGUgcGF0aCBmcm9tIHRoZSAvIHJvb3Qgb2YgdGhlIGN1cnJlbnQgc2l0ZVxuXHRcdFx0XHR2YXIgYWJzb2x1dGVQYXRoID0gaHJlZi5yZXBsYWNlKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sICcnKTtcblx0XHRcdFx0YWJzb2x1dGVQYXRoID0gYWJzb2x1dGVQYXRoWzBdICE9PSAnLycgPyAnLycgKyBhYnNvbHV0ZVBhdGggOiBhYnNvbHV0ZVBhdGg7XG5cblx0XHRcdFx0dGhpcy5fcGF0aCA9IHRoaXMuX3BhdGggfHwgW107XG5cblx0XHRcdFx0dmFyIGZyb20gPSB2b2lkIDA7XG5cblx0XHRcdFx0aWYgKHRoaXMuX3BhdGgubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGZyb20gPSB0aGlzLl9wYXRoW3RoaXMuX3BhdGgubGVuZ3RoIC0gMV0udG87XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgcGF0aEVudHJ5ID0ge1xuXHRcdFx0XHRcdGZyb206IGZyb20sXG5cdFx0XHRcdFx0dG86IGFic29sdXRlUGF0aFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMuX3BhdGgucHVzaChwYXRoRW50cnkpO1xuXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3JlbW92ZUxhdGVzdEZyb21QYXRoJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiByZW1vdmVMYXRlc3RGcm9tUGF0aCgpIHtcblx0XHRcdFx0KHRoaXMuX3BhdGggfHwgW10pLnBvcCgpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdwdXNoU3RhdGUnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHB1c2hTdGF0ZShocmVmKSB7XG5cdFx0XHRcdHZhciB0aXRsZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJyc7XG5cdFx0XHRcdHZhciBhZGRUb1BhdGggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHRydWU7XG5cblx0XHRcdFx0dmFyIHN0YXRlID0geyBocmVmOiBocmVmLCB0aXRsZTogdGl0bGUgfTtcblxuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUsIHRpdGxlLCBocmVmKTtcblxuXHRcdFx0XHRpZiAoYWRkVG9QYXRoKSB7XG5cdFx0XHRcdFx0dGhpcy5hZGRUb1BhdGgoaHJlZik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdyZXBsYWNlU3RhdGUnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHJlcGxhY2VTdGF0ZShocmVmKSB7XG5cdFx0XHRcdHZhciB0aXRsZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJyc7XG5cdFx0XHRcdHZhciBhZGRUb1BhdGggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHRydWU7XG5cblx0XHRcdFx0dmFyIHN0YXRlID0geyBocmVmOiBocmVmLCB0aXRsZTogdGl0bGUgfTtcblxuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoc3RhdGUsIHRpdGxlLCBocmVmKTtcblxuXHRcdFx0XHRpZiAoYWRkVG9QYXRoKSB7XG5cdFx0XHRcdFx0dGhpcy5hZGRUb1BhdGgoaHJlZik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdpbml0Jyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0XHR2YXIgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0XHR2YXIgdGl0bGUgPSBkb2N1bWVudC50aXRsZTtcblxuXHRcdFx0XHR0aGlzLnJlcGxhY2VTdGF0ZShocmVmLCB0aXRsZSk7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnYmluZCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gYmluZCgpIHtcblx0XHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5vbigncG9wc3RhdGUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlmIChlLnN0YXRlICYmIGUuc3RhdGUuaHJlZikge1xuXHRcdFx0XHRcdFx0X3RoaXMyLmdvVG8oZS5zdGF0ZS5ocmVmLCBmYWxzZSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ0NvdWxkIG5vdCBydW4gcG9wc3RhdGUgdG8nLCBlLnN0YXRlLmhyZWYpO1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ0Vycm9yOicsIGVycik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHdpbmRvdyk7XG5cblx0XHRcdFx0dGhpcy5vbignY2xpY2sgYScsIGZ1bmN0aW9uIChlLCB0YXJnZXQpIHtcblx0XHRcdFx0XHRpZiAodGFyZ2V0LmNsYXNzTGlzdCAmJiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1tci1zbW9vdGgtc3RhdGUtZGlzYWJsZScpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gQXZvaWQgY3Jvc3Mtb3JpZ2luIGNhbGxzXG5cdFx0XHRcdFx0aWYgKCF0YXJnZXQuaG9zdG5hbWUgfHwgdGFyZ2V0Lmhvc3RuYW1lICE9PSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgaHJlZiA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblxuXHRcdFx0XHRcdGlmICghaHJlZikge1xuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKCdDbGljayBvbiBsaW5rIHdpdGhvdXQgaHJlZicpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFx0X3RoaXMyLmdvVG8oaHJlZikuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKCdDb3VsZCBub3QgbmF2aWdhdGUgdG8nLCBocmVmKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybignRXJyb3I6JywgZXJyKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSwgZG9jdW1lbnQuYm9keSk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnZ29UbycsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gZ29UbyhocmVmKSB7XG5cdFx0XHRcdHZhciBfdGhpczMgPSB0aGlzO1xuXG5cdFx0XHRcdHZhciBwdXNoU3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRydWU7XG5cblx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdFx0XHR3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3Ntb290aFN0YXRlOmJlZm9yZScpKTtcblxuXHRcdFx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnaXMtbG9hZGluZycpO1xuXG5cdFx0XHRcdFx0X3RoaXMzLmFkZFRvUGF0aChocmVmKTtcblxuXHRcdFx0XHRcdHZhciBjYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoZXJyKSB7XG5cdFx0XHRcdFx0XHRfdGhpczMucmVtb3ZlTGF0ZXN0RnJvbVBhdGgoKTtcblx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR2YXIgdHJhbnNpdGlvbiA9IHt9O1xuXHRcdFx0XHRcdHRyYW5zaXRpb24uY29udGFpbmVyID0gX3RoaXMzLmVsO1xuXHRcdFx0XHRcdHRyYW5zaXRpb24ucGF0aCA9IE9iamVjdC5hc3NpZ24oX3RoaXMzLmxhdGVzdFBhdGhFbnRyeSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gX3RoaXMzLm9uQmVmb3JlKHRyYW5zaXRpb24pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0ZmV0Y2goaHJlZiwgeyBjcmVkZW50aWFsczogJ2luY2x1ZGUnIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzLnRleHQoKTtcblx0XHRcdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcblx0XHRcdFx0XHRcdFx0dmFyIF9wYXJzZUhUTUwgPSBwYXJzZUhUTUwoaHRtbCwgJ21yLXNtb290aC1zdGF0ZScpLFxuXHRcdFx0XHRcdFx0XHQgICAgdGl0bGUgPSBfcGFyc2VIVE1MLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHQgICAgY29udGVudCA9IF9wYXJzZUhUTUwuY29udGVudDtcblxuXHRcdFx0XHRcdFx0XHR3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3Ntb290aFN0YXRlOnN0YXJ0JykpO1xuXG5cdFx0XHRcdFx0XHRcdHRyYW5zaXRpb24uZmV0Y2hlZCA9IHsgdGl0bGU6IHRpdGxlLCBjb250ZW50OiBjb250ZW50IH07XG5cblx0XHRcdFx0XHRcdFx0X3RoaXMzLm9uU3RhcnQodHJhbnNpdGlvbikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzbW9vdGhTdGF0ZTpyZWFkeScpKTtcblxuXHRcdFx0XHRcdFx0XHRcdF90aGlzMy5vblJlYWR5KHRyYW5zaXRpb24pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIF90cmFuc2l0aW9uJGZldGNoZWQgPSB0cmFuc2l0aW9uLmZldGNoZWQsXG5cdFx0XHRcdFx0XHRcdFx0XHQgICAgdmVyaWZpZWRUaXRsZSA9IF90cmFuc2l0aW9uJGZldGNoZWQudGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0XHQgICAgdmVyaWZpZWRDb250ZW50ID0gX3RyYW5zaXRpb24kZmV0Y2hlZC5jb250ZW50O1xuXG5cblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZW5kZXJOb2Rlcyh2ZXJpZmllZENvbnRlbnQsIF90aGlzMy5lbCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gdmVyaWZpZWRUaXRsZTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAocHVzaFN0YXRlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRG9uJ3QgYWRkIHRoZSBzdGF0ZSB0byB0aGUgcGF0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdF90aGlzMy5wdXNoU3RhdGUoaHJlZiwgdmVyaWZpZWRUaXRsZSwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1sb2FkaW5nJyk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3Ntb290aFN0YXRlOmFmdGVyJykpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gWW91IGNhbid0IGNhbmNlbCB0aGUgdHJhbnNpdGlvbiBhZnRlciB0aGUgcHVzaFN0YXRlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gU28gd2UgYWxzbyByZXNvbHZlIGluc2lkZSB0aGUgY2F0Y2hcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRfdGhpczMub25BZnRlcih0cmFuc2l0aW9uKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiByZXNvbHZlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc29sdmUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FuY2VsKGVycik7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FuY2VsKGVycik7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FuY2VsKGVycik7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FuY2VsKGVycik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ29uQmVmb3JlJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBvbkJlZm9yZSh0cmFuc2l0aW9uKSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodHJhbnNpdGlvbik7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnb25TdGFydCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gb25TdGFydCh0cmFuc2l0aW9uKSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodHJhbnNpdGlvbik7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnb25SZWFkeScsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gb25SZWFkeSh0cmFuc2l0aW9uKSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodHJhbnNpdGlvbik7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnb25BZnRlcicsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gb25BZnRlcih0cmFuc2l0aW9uKSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodHJhbnNpdGlvbik7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAncGF0aCcsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3BhdGggfHwgW107XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnbGF0ZXN0UGF0aEVudHJ5Jyxcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHR2YXIgbGVuZ3RoID0gdGhpcy5wYXRoLmxlbmd0aDtcblxuXHRcdFx0XHRpZiAobGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnBhdGhbbGVuZ3RoIC0gMV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdH1dKTtcblx0XHRyZXR1cm4gY29udHJvbGxlcjtcblx0fShCYXNlQ29udHJvbGxlcilcbn07XG5cbnZhciB0aW1lQWdvID0ge1xuXHRhdHRyaWJ1dGVzOiBbJ2RhdGV0aW1lJ10sXG5cdGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChfQmFzZUNvbnRyb2xsZXIpIHtcblx0XHRpbmhlcml0cyhjb250cm9sbGVyLCBfQmFzZUNvbnRyb2xsZXIpO1xuXG5cdFx0ZnVuY3Rpb24gY29udHJvbGxlcigpIHtcblx0XHRcdGNsYXNzQ2FsbENoZWNrKHRoaXMsIGNvbnRyb2xsZXIpO1xuXHRcdFx0cmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKGNvbnRyb2xsZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250cm9sbGVyKSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG5cdFx0fVxuXG5cdFx0Y3JlYXRlQ2xhc3MoY29udHJvbGxlciwgW3tcblx0XHRcdGtleTogJ3Jlc29sdmUnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHJlc29sdmUoKSB7XG5cdFx0XHRcdC8vIE5vIG5lZWQgdG8gd2FpdCBmb3Igd2luZG93Lm9ubG9hZFxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2luaXQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHRcdHRoaXMudHJhbnNsYXRpb25zID0ge1xuXHRcdFx0XHRcdGFnbzogJ2FnbycsXG5cdFx0XHRcdFx0eWVhcjogWyd5ZWFyJywgJ3llYXJzJ10sXG5cdFx0XHRcdFx0bW9udGg6IFsnbW9udGgnLCAnbW9udGhzJ10sXG5cdFx0XHRcdFx0d2VlazogWyd3ZWVrJywgJ3dlZWtzJ10sXG5cdFx0XHRcdFx0ZGF5OiBbJ2RheScsICdkYXlzJ10sXG5cdFx0XHRcdFx0aG91cjogWydob3VyJywgJ2hvdXJzJ10sXG5cdFx0XHRcdFx0bWludXRlOiBbJ21pbnV0ZScsICdtaW51dGVzJ10sXG5cdFx0XHRcdFx0c2Vjb25kOiBbJ3NlY29uZCcsICdzZWNvbmRzJ11cblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdnZXRDb3VudGVkTm91bicsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gZ2V0Q291bnRlZE5vdW4oa2V5KSB7XG5cdFx0XHRcdHZhciBjb3VudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMTtcblxuXHRcdFx0XHRpZiAoIXRoaXMudHJhbnNsYXRpb25zW2tleV0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodHlwZW9mIHRoaXMudHJhbnNsYXRpb25zW2tleV0gPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMudHJhbnNsYXRpb25zW2tleV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY291bnQgPT09IDEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy50cmFuc2xhdGlvbnNba2V5XVswXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0aGlzLnRyYW5zbGF0aW9uc1trZXldWzFdO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3JlbmRlcicsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0XHR2YXIgbWFrZVJlYWRhYmxlID0gZnVuY3Rpb24gbWFrZVJlYWRhYmxlKGRhdGV0aW1lKSB7XG5cdFx0XHRcdFx0dmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRldGltZSk7XG5cdFx0XHRcdFx0dmFyIHRpbWUgPSBkYXRlLmdldFRpbWUoKTtcblx0XHRcdFx0XHR2YXIgbm93ID0gbmV3IERhdGUoKTtcblx0XHRcdFx0XHR2YXIgY2FsY3VsYXRlZCA9IHZvaWQgMDtcblxuXHRcdFx0XHRcdGlmICghaXNOYU4odGltZSkpIHtcblx0XHRcdFx0XHRcdHZhciBkaWZmID0gTWF0aC5mbG9vcihub3cuZ2V0VGltZSgpIC0gdGltZSk7XG5cblx0XHRcdFx0XHRcdGNhbGN1bGF0ZWQgPSB7fTtcblx0XHRcdFx0XHRcdGNhbGN1bGF0ZWQuc2Vjb25kcyA9IE1hdGgucm91bmQoZGlmZiAvIDEwMDApO1xuXHRcdFx0XHRcdFx0Y2FsY3VsYXRlZC5taW51dGVzID0gTWF0aC5yb3VuZChjYWxjdWxhdGVkLnNlY29uZHMgLyA2MCk7XG5cdFx0XHRcdFx0XHRjYWxjdWxhdGVkLmhvdXJzID0gTWF0aC5yb3VuZChjYWxjdWxhdGVkLm1pbnV0ZXMgLyA2MCk7XG5cdFx0XHRcdFx0XHRjYWxjdWxhdGVkLmRheXMgPSBNYXRoLnJvdW5kKGNhbGN1bGF0ZWQuaG91cnMgLyAyNCk7XG5cdFx0XHRcdFx0XHRjYWxjdWxhdGVkLndlZWtzID0gTWF0aC5yb3VuZChjYWxjdWxhdGVkLmRheXMgLyA3KTtcblx0XHRcdFx0XHRcdGNhbGN1bGF0ZWQubW9udGhzID0gTWF0aC5yb3VuZChjYWxjdWxhdGVkLndlZWtzIC8gNCk7XG5cdFx0XHRcdFx0XHRjYWxjdWxhdGVkLnllYXJzID0gTWF0aC5yb3VuZChjYWxjdWxhdGVkLm1vbnRocyAvIDEyKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoY2FsY3VsYXRlZCkge1xuXHRcdFx0XHRcdFx0aWYgKGNhbGN1bGF0ZWQubW9udGhzID4gMTIpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHllYXJzID0gX3RoaXMyLmdldENvdW50ZWROb3VuKCd5ZWFyJywgY2FsY3VsYXRlZC55ZWFycyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBjYWxjdWxhdGVkLnllYXJzICsgJyAnICsgeWVhcnMgKyAnICcgKyBfdGhpczIudHJhbnNsYXRpb25zLmFnbztcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoY2FsY3VsYXRlZC53ZWVrcyA+IDcpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG1vbnRocyA9IF90aGlzMi5nZXRDb3VudGVkTm91bignbW9udGgnLCBjYWxjdWxhdGVkLm1vbnRocyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBjYWxjdWxhdGVkLm1vbnRocyArICcgJyArIG1vbnRocyArICcgJyArIF90aGlzMi50cmFuc2xhdGlvbnMuYWdvO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjYWxjdWxhdGVkLmRheXMgPiAyMSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgd2Vla3MgPSBfdGhpczIuZ2V0Q291bnRlZE5vdW4oJ3dlZWsnLCBjYWxjdWxhdGVkLndlZWtzKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhbGN1bGF0ZWQud2Vla3MgKyAnICcgKyB3ZWVrcyArICcgJyArIF90aGlzMi50cmFuc2xhdGlvbnMuYWdvO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjYWxjdWxhdGVkLmhvdXJzID4gMjQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGRheXMgPSBfdGhpczIuZ2V0Q291bnRlZE5vdW4oJ2RheScsIGNhbGN1bGF0ZWQuZGF5cyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBjYWxjdWxhdGVkLmRheXMgKyAnICcgKyBkYXlzICsgJyAnICsgX3RoaXMyLnRyYW5zbGF0aW9ucy5hZ287XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGNhbGN1bGF0ZWQubWludXRlcyA+IDYwKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBob3VycyA9IF90aGlzMi5nZXRDb3VudGVkTm91bignaG91cicsIGNhbGN1bGF0ZWQuaG91cnMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsY3VsYXRlZC5ob3VycyArICcgJyArIGhvdXJzICsgJyAnICsgX3RoaXMyLnRyYW5zbGF0aW9ucy5hZ287XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGNhbGN1bGF0ZWQuc2Vjb25kcyA+IDYwKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtaW51dGVzID0gX3RoaXMyLmdldENvdW50ZWROb3VuKCdtaW51dGUnLCBjYWxjdWxhdGVkLm1pbnV0ZXMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsY3VsYXRlZC5taW51dGVzICsgJyAnICsgbWludXRlcyArICcgJyArIF90aGlzMi50cmFuc2xhdGlvbnMuYWdvO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgc2Vjb25kcyA9IF90aGlzMi5nZXRDb3VudGVkTm91bignc2Vjb25kJywgY2FsY3VsYXRlZC5zZWNvbmRzKTtcblx0XHRcdFx0XHRcdHJldHVybiBjYWxjdWxhdGVkLnNlY29uZHMgKyAnICcgKyBzZWNvbmRzICsgJyAnICsgX3RoaXMyLnRyYW5zbGF0aW9ucy5hZ287XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRG8gbm90aGluZyBpZiB3ZSBjYW4ndCBjYWxjdWxhdGUgYSB0aW1lIGRpZmZcblx0XHRcdFx0XHRyZXR1cm4gX3RoaXMyLmVsLnRleHRDb250ZW50O1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMuZWwudGV4dENvbnRlbnQgPSBtYWtlUmVhZGFibGUodGhpcy5kYXRldGltZSk7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fV0pO1xuXHRcdHJldHVybiBjb250cm9sbGVyO1xuXHR9KEJhc2VDb250cm9sbGVyKVxufTtcblxudmFyIG5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG5cbnZhciBnZW5lcmF0ZVN0cmluZ0F0dHJpYnV0ZU1ldGhvZHMgPSBmdW5jdGlvbiBnZW5lcmF0ZVN0cmluZ0F0dHJpYnV0ZU1ldGhvZHMoYXR0cmlidXRlKSB7XG5cdHZhciBnZXR0ZXIgPSBmdW5jdGlvbiBnZXR0ZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkgfHwgdW5kZWZpbmVkO1xuXHR9O1xuXG5cdHZhciBzZXR0ZXIgPSBmdW5jdGlvbiBzZXR0ZXIodG8pIHtcblx0XHR2YXIgcGFyc2VkID0gdG8gJiYgdG8udG9TdHJpbmcgPyB0by50b1N0cmluZygpIDogdW5kZWZpbmVkO1xuXHRcdHZhciBvbGRWYWx1ZSA9IHRoaXNbYXR0cmlidXRlXTtcblxuXHRcdGlmIChwYXJzZWQgPT09IG9sZFZhbHVlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHBhcnNlZCkge1xuXHRcdFx0dGhpcy5lbC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCBwYXJzZWQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4geyBnZXR0ZXI6IGdldHRlciwgc2V0dGVyOiBzZXR0ZXIgfTtcbn07XG5cbnZhciBnZW5lcmF0ZUJvb2xBdHRyaWJ1dGVNZXRob2RzID0gZnVuY3Rpb24gZ2VuZXJhdGVCb29sQXR0cmlidXRlTWV0aG9kcyhhdHRyaWJ1dGUpIHtcblx0dmFyIGdldHRlciA9IGZ1bmN0aW9uIGdldHRlcigpIHtcblx0XHRyZXR1cm4gISF0aGlzLmVsLmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHR9O1xuXG5cdHZhciBzZXR0ZXIgPSBmdW5jdGlvbiBzZXR0ZXIodG8pIHtcblx0XHR2YXIgcGFyc2VkID0gdHlwZW9mIHRvID09PSAnc3RyaW5nJyB8fCAhIXRvO1xuXHRcdHZhciBvbGRWYWx1ZSA9IHRoaXNbYXR0cmlidXRlXTtcblxuXHRcdGlmIChwYXJzZWQgPT09IG9sZFZhbHVlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHBhcnNlZCkge1xuXHRcdFx0dGhpcy5lbC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCAnJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB7IGdldHRlcjogZ2V0dGVyLCBzZXR0ZXI6IHNldHRlciB9O1xufTtcblxudmFyIGdlbmVyYXRlSW50ZWdlckF0dHJpYnV0ZU1ldGhvZHMgPSBmdW5jdGlvbiBnZW5lcmF0ZUludGVnZXJBdHRyaWJ1dGVNZXRob2RzKGF0dHJpYnV0ZSkge1xuXHR2YXIgZ2V0dGVyID0gZnVuY3Rpb24gZ2V0dGVyKCkge1xuXHRcdHJldHVybiBwYXJzZUludCh0aGlzLmVsLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpLCAxMCk7XG5cdH07XG5cblx0dmFyIHNldHRlciA9IGZ1bmN0aW9uIHNldHRlcih0bykge1xuXHRcdHZhciBwYXJzZWQgPSBwYXJzZUludCh0bywgMTApO1xuXHRcdHZhciBvbGRWYWx1ZSA9IHRoaXNbYXR0cmlidXRlXTtcblxuXHRcdGlmIChwYXJzZWQgPT09IG9sZFZhbHVlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xuXHRcdFx0dGhpcy5lbC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCBwYXJzZWQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ0NvdWxkIG5vdCBzZXQgJyArIGF0dHJpYnV0ZSArICcgdG8gJyArIHRvKTtcblx0XHRcdHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB7IGdldHRlcjogZ2V0dGVyLCBzZXR0ZXI6IHNldHRlciB9O1xufTtcblxudmFyIGdlbmVyYXRlTnVtYmVyQXR0cmlidXRlTWV0aG9kcyA9IGZ1bmN0aW9uIGdlbmVyYXRlTnVtYmVyQXR0cmlidXRlTWV0aG9kcyhhdHRyaWJ1dGUpIHtcblx0dmFyIGdldHRlciA9IGZ1bmN0aW9uIGdldHRlcigpIHtcblx0XHRyZXR1cm4gcGFyc2VGbG9hdCh0aGlzLmVsLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpKTtcblx0fTtcblxuXHR2YXIgc2V0dGVyID0gZnVuY3Rpb24gc2V0dGVyKHRvKSB7XG5cdFx0dmFyIHBhcnNlZCA9IHBhcnNlRmxvYXQodG8pO1xuXHRcdHZhciBvbGRWYWx1ZSA9IHRoaXNbYXR0cmlidXRlXTtcblxuXHRcdGlmIChwYXJzZWQgPT09IG9sZFZhbHVlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xuXHRcdFx0dGhpcy5lbC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCBwYXJzZWQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ0NvdWxkIG5vdCBzZXQgJyArIGF0dHJpYnV0ZSArICcgdG8gJyArIHRvKTtcblx0XHRcdHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB7IGdldHRlcjogZ2V0dGVyLCBzZXR0ZXI6IHNldHRlciB9O1xufTtcblxudmFyIGdlbmVyYXRlQXR0cmlidXRlTWV0aG9kcyA9IGZ1bmN0aW9uIGdlbmVyYXRlQXR0cmlidXRlTWV0aG9kcyhhdHRyaWJ1dGUpIHtcblx0dmFyIHR5cGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICdzdHJpbmcnO1xuXG5cdGlmICh0eXBlID09PSAnYm9vbCcpIHtcblx0XHRyZXR1cm4gZ2VuZXJhdGVCb29sQXR0cmlidXRlTWV0aG9kcyhhdHRyaWJ1dGUpO1xuXHR9IGVsc2UgaWYgKHR5cGUgPT09ICdpbnQnIHx8IHR5cGUgPT09ICdpbnRlZ2VyJykge1xuXHRcdHJldHVybiBnZW5lcmF0ZUludGVnZXJBdHRyaWJ1dGVNZXRob2RzKGF0dHJpYnV0ZSk7XG5cdH0gZWxzZSBpZiAodHlwZSA9PT0gJ2Zsb2F0JyB8fCB0eXBlID09PSAnbnVtYmVyJykge1xuXHRcdHJldHVybiBnZW5lcmF0ZU51bWJlckF0dHJpYnV0ZU1ldGhvZHMoYXR0cmlidXRlKTtcblx0fSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiBnZW5lcmF0ZVN0cmluZ0F0dHJpYnV0ZU1ldGhvZHMoYXR0cmlidXRlKTtcblx0fVxuXHRyZXR1cm4geyBnZXR0ZXI6IG5vb3AsIHNldHRlcjogbm9vcCB9O1xufTtcblxudmFyIENPTlRST0xMRVIgPSBTeW1ib2woJ2NvbnRyb2xsZXInKTtcblxudmFyIHJlZ2lzdGVyRWxlbWVudCA9IGZ1bmN0aW9uIHJlZ2lzdGVyRWxlbWVudCh0YWcsIG9wdGlvbnMpIHtcblx0dmFyIG9ic2VydmVkQXR0cmlidXRlcyA9IG9wdGlvbnMub2JzZXJ2ZWRBdHRyaWJ1dGVzIHx8IFtdO1xuXG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWcsIGZ1bmN0aW9uIChfSFRNTEVsZW1lbnQpIHtcblx0XHRpbmhlcml0cyhfY2xhc3MsIF9IVE1MRWxlbWVudCk7XG5cdFx0Y3JlYXRlQ2xhc3MoX2NsYXNzLCBbe1xuXHRcdFx0a2V5OiAnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcblx0XHRcdFx0aWYgKG9sZFZhbHVlID09PSBuZXdWYWx1ZSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghdGhpc1tDT05UUk9MTEVSXSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBwcm9wZXJ0eU5hbWUgPSBjb252ZXJ0QXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUoYXR0cmlidXRlKTtcblxuXHRcdFx0XHR2YXIgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXNbQ09OVFJPTExFUl0pO1xuXHRcdFx0XHR2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUpO1xuXG5cdFx0XHRcdGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3Iuc2V0KSB7XG5cdFx0XHRcdFx0dGhpc1tDT05UUk9MTEVSXVtwcm9wZXJ0eU5hbWVdID0gbmV3VmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJZiBmb3IgYXJndW1lbnQgYGN1cnJlbnRgIHRoZSBtZXRob2Rcblx0XHRcdFx0Ly8gYGN1cnJlbnRDaGFuZ2VkQ2FsbGJhY2tgIGV4aXN0cywgdHJpZ2dlclxuXHRcdFx0XHR2YXIgY2FsbGJhY2sgPSB0aGlzW0NPTlRST0xMRVJdW3Byb3BlcnR5TmFtZSArICdDaGFuZ2VkQ2FsbGJhY2snXTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzW0NPTlRST0xMRVJdLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fV0sIFt7XG5cdFx0XHRrZXk6ICdvYnNlcnZlZEF0dHJpYnV0ZXMnLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdHJldHVybiBvYnNlcnZlZEF0dHJpYnV0ZXM7XG5cdFx0XHR9XG5cdFx0fV0pO1xuXG5cdFx0ZnVuY3Rpb24gX2NsYXNzKCkge1xuXHRcdFx0Y2xhc3NDYWxsQ2hlY2sodGhpcywgX2NsYXNzKTtcblxuXHRcdFx0dmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoX2NsYXNzLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoX2NsYXNzKSkuY2FsbCh0aGlzKSk7XG5cblx0XHRcdG9ic2VydmVkQXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBfdGhpc1thdHRyaWJ1dGVdICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybignUmVxdWVzdGVkIHN5bmNpbmcgb24gYXR0cmlidXRlIFxcJycgKyBhdHRyaWJ1dGUgKyAnXFwnIHRoYXQgYWxyZWFkeSBoYXMgZGVmaW5lZCBiZWhhdmlvcicpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KF90aGlzLCBhdHRyaWJ1dGUsIHtcblx0XHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuXHRcdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIF90aGlzW0NPTlRST0xMRVJdW2F0dHJpYnV0ZV07XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzZXQ6IGZ1bmN0aW9uIHNldCQkMSh0bykge1xuXHRcdFx0XHRcdFx0X3RoaXNbQ09OVFJPTExFUl1bYXR0cmlidXRlXSA9IHRvO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBfdGhpcztcblx0XHR9XG5cblx0XHRjcmVhdGVDbGFzcyhfY2xhc3MsIFt7XG5cdFx0XHRrZXk6ICdjb25uZWN0ZWRDYWxsYmFjaycsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHRcdHRoaXNbQ09OVFJPTExFUl0gPSBuZXcgb3B0aW9ucy5jb250cm9sbGVyKHRoaXMpO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2Rpc2Nvbm5lY3RlZENhbGxiYWNrJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzW0NPTlRST0xMRVJdLnVuYmluZCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHRoaXNbQ09OVFJPTExFUl0udW5iaW5kKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodHlwZW9mIHRoaXNbQ09OVFJPTExFUl0uZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHRoaXNbQ09OVFJPTExFUl0uZGVzdHJveSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpc1tDT05UUk9MTEVSXSA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fV0pO1xuXHRcdHJldHVybiBfY2xhc3M7XG5cdH0oSFRNTEVsZW1lbnQpKTtcbn07XG5cbnZhciByZWdpc3RlckF0dHJpYnV0ZSA9IGZ1bmN0aW9uIHJlZ2lzdGVyQXR0cmlidXRlKCkge1xuXHR2YXIgaGFuZGxlcnMgPSBbXTtcblxuXHR2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG5cdFx0XG5cdH0pO1xuXG5cdHJldHVybiBmdW5jdGlvbiByZWdpc3RlcihhdHRyaWJ1dGUpIHtcblx0XHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cblx0XHR3YWl0Rm9yRE9NUmVhZHkoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBleHRlbmQgPSBvcHRpb25zLmV4dGVuZHMgfHwgSFRNTEVsZW1lbnQ7XG5cblx0XHRcdHZhciBub2RlSXNTdXBwb3J0ZWQgPSBmdW5jdGlvbiBub2RlSXNTdXBwb3J0ZWQobm9kZSkge1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShleHRlbmQpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGV4dGVuZC5zb21lKGZ1bmN0aW9uIChzdXBwb3J0ZWQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBub2RlIGluc3RhbmNlb2Ygc3VwcG9ydGVkO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBleHRlbmQ7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgYXR0YWNoID0gZnVuY3Rpb24gYXR0YWNoKG5vZGUpIHtcblx0XHRcdFx0dmFyIGVsID0gbm9kZTtcblx0XHRcdFx0ZWxbQ09OVFJPTExFUl0gPSBuZXcgb3B0aW9ucy5jb250cm9sbGVyKGVsKTtcblx0XHRcdFx0cmV0dXJuIGVsO1xuXHRcdFx0fTtcblxuXHRcdFx0dmFyIGRldGFjaCA9IGZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG5cdFx0XHRcdHZhciBlbCA9IG5vZGU7XG5cblx0XHRcdFx0aWYgKGVsW0NPTlRST0xMRVJdKSB7XG5cdFx0XHRcdFx0ZWxbQ09OVFJPTExFUl0uZGVzdHJveSgpO1xuXHRcdFx0XHRcdGVsW0NPTlRST0xMRVJdID0gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBlbDtcblx0XHRcdH07XG5cblx0XHRcdC8vIFNldHVwIG9ic2VydmVyc1xuXHRcdFx0aGFuZGxlcnMucHVzaChmdW5jdGlvbiAobXV0YXRpb24pIHtcblx0XHRcdFx0aWYgKG11dGF0aW9uLnR5cGUgPT09ICdhdHRyaWJ1dGVzJyAmJiBub2RlSXNTdXBwb3J0ZWQobXV0YXRpb24udGFyZ2V0KSkge1xuXHRcdFx0XHRcdC8vIEF0dHJpYnV0ZSBjaGFuZ2VkIG9uIHN1cHBvcnRlZCBET00gbm9kZSB0eXBlXG5cdFx0XHRcdFx0dmFyIG5vZGUgPSBtdXRhdGlvbi50YXJnZXQ7XG5cblx0XHRcdFx0XHRpZiAobm9kZS5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuXHRcdFx0XHRcdFx0YXR0YWNoKG5vZGUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkZXRhY2gobm9kZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG5cdFx0XHRcdFx0Ly8gSGFuZGxlIGFkZGVkIG5vZGVzXG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcblx0XHRcdFx0YXR0cmlidXRlczogdHJ1ZSxcblx0XHRcdFx0c3VidHJlZTogdHJ1ZSxcblx0XHRcdFx0Y2hpbGRMaXN0OiB0cnVlLFxuXHRcdFx0XHRhdHRyaWJ1dGVGaWx0ZXI6IFthdHRyaWJ1dGVdXG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gTG9vayBmb3IgY3VycmVudCBvbiBET00gcmVhZHlcblx0XHRcdEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yQWxsKCdbJyArIGF0dHJpYnV0ZSArICddJyksIGZ1bmN0aW9uIChlbCkge1xuXHRcdFx0XHRpZiAoIW5vZGVJc1N1cHBvcnRlZChlbCkpIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ0N1c3RvbSBhdHRyaWJ1dGUnLCBhdHRyaWJ1dGUsICdhZGRlZCBvbiBub24tc3VwcG9ydGVkIGVsZW1lbnQnKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZWxbQ09OVFJPTExFUl0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZWw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gYXR0YWNoKGVsKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xufSgpO1xuXG52YXIgYWRkQXR0cmlidXRlc1RvQ29udHJvbGxlciA9IGZ1bmN0aW9uIGFkZEF0dHJpYnV0ZXNUb0NvbnRyb2xsZXIoY29udHJvbGxlcikge1xuXHR2YXIgYXR0cmlidXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogW107XG5cblx0cmV0dXJuIGF0dHJpYnV0ZXMubWFwKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcblx0XHQvLyBTdHJpbmcsIHN5bmMgd2l0aCBhY3R1YWwgZWxlbWVudCBhdHRyaWJ1dGVcblx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHZhciBfZ2VuZXJhdGVBdHRyaWJ1dGVNZXQgPSBnZW5lcmF0ZUF0dHJpYnV0ZU1ldGhvZHMoYXR0cmlidXRlLCAnc3RyaW5nJyksXG5cdFx0XHQgICAgZ2V0dGVyID0gX2dlbmVyYXRlQXR0cmlidXRlTWV0LmdldHRlcixcblx0XHRcdCAgICBzZXR0ZXIgPSBfZ2VuZXJhdGVBdHRyaWJ1dGVNZXQuc2V0dGVyO1xuXG5cdFx0XHRhZGRQcm9wZXJ0eShjb250cm9sbGVyLCBhdHRyaWJ1dGUsIGdldHRlciwgc2V0dGVyKTtcblx0XHRcdHJldHVybiBhdHRyaWJ1dGU7XG5cdFx0fVxuXG5cdFx0aWYgKCh0eXBlb2YgYXR0cmlidXRlID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihhdHRyaWJ1dGUpKSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdHZhciB0eXBlID0gYXR0cmlidXRlLnR5cGUgfHwgJ3N0cmluZyc7XG5cdFx0XHR2YXIgbmFtZSA9IGF0dHJpYnV0ZS5hdHRyaWJ1dGU7XG5cblx0XHRcdHZhciBfZ2VuZXJhdGVBdHRyaWJ1dGVNZXQyID0gZ2VuZXJhdGVBdHRyaWJ1dGVNZXRob2RzKG5hbWUsIHR5cGUpLFxuXHRcdFx0ICAgIF9nZXR0ZXIgPSBfZ2VuZXJhdGVBdHRyaWJ1dGVNZXQyLmdldHRlcixcblx0XHRcdCAgICBfc2V0dGVyID0gX2dlbmVyYXRlQXR0cmlidXRlTWV0Mi5zZXR0ZXI7XG5cblx0XHRcdGFkZFByb3BlcnR5KGNvbnRyb2xsZXIsIG5hbWUsIF9nZXR0ZXIsIF9zZXR0ZXIpO1xuXHRcdFx0cmV0dXJuIG5hbWU7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBhdHRyaWJ1dGUuYXR0YWNoVG8gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGF0dHJpYnV0ZS5hdHRhY2hUbyhjb250cm9sbGVyKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0pLmZpbHRlcihmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG5cdFx0cmV0dXJuICEhYXR0cmlidXRlO1xuXHR9KTtcbn07XG5cbmZ1bmN0aW9uIGRlZmluZUN1c3RvbUVsZW1lbnQodGFnKSB7XG5cdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuXHQvLyBWYWxpZGF0ZSB0YWdcblx0dmFyIGlzVmFsaWRUYWcgPSB0YWcuc3BsaXQoJy0nKS5sZW5ndGggPiAxO1xuXG5cdC8vIFZhbGlkYXRlIHR5cGVcblx0dmFyIHR5cGUgPSBbJ2VsZW1lbnQnLCAnYXR0cmlidXRlJ10uaW5jbHVkZXMob3B0aW9ucy50eXBlKSA/IG9wdGlvbnMudHlwZSA6ICdlbGVtZW50JztcblxuXHRpZiAodHlwZSA9PT0gJ2VsZW1lbnQnICYmICFpc1ZhbGlkVGFnKSB7XG5cdFx0Y29uc29sZS53YXJuKHRhZywgJ2lzIG5vdCBhIHZhbGlkIEN1c3RvbSBFbGVtZW50IG5hbWUuIFJlZ2lzdGVyIGFzIGFuIGF0dHJpYnV0ZSBpbnN0ZWFkLicpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIFZhbGlkYXRlIGF0dHJpYnV0ZXNcblx0dmFyIGF0dHJpYnV0ZXMgPSBBcnJheS5pc0FycmF5KG9wdGlvbnMuYXR0cmlidXRlcykgPyBvcHRpb25zLmF0dHJpYnV0ZXMgOiBbXTtcblxuXHQvLyBWYWxpZGF0ZSBjb250cm9sbGVyXG5cdHZhciBjb250cm9sbGVyID0gb3B0aW9ucy5jb250cm9sbGVyO1xuXG5cdC8vIFZhbGlkYXRlIGV4dGVuZHNcblx0dmFyIGV4dGVuZCA9IG9wdGlvbnMuZXh0ZW5kcztcblxuXHRpZiAodHlwZSA9PT0gJ2VsZW1lbnQnICYmIGV4dGVuZCkge1xuXHRcdGNvbnNvbGUud2FybignYGV4dGVuZHNgIGlzIG5vdCBzdXBwb3J0ZWQgb24gZWxlbWVudC1yZWdpc3RlcmVkIEN1c3RvbSBFbGVtZW50cy4gUmVnaXN0ZXIgYXMgYW4gYXR0cmlidXRlIGluc3RlYWQuJyk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIG9ic2VydmVkQXR0cmlidXRlcyA9IGFkZEF0dHJpYnV0ZXNUb0NvbnRyb2xsZXIoY29udHJvbGxlciwgYXR0cmlidXRlcyk7XG5cblx0dmFyIHZhbGlkYXRlZE9wdGlvbnMgPSB7IHR5cGU6IHR5cGUsIGV4dGVuZHM6IGV4dGVuZCwgYXR0cmlidXRlczogYXR0cmlidXRlcywgY29udHJvbGxlcjogY29udHJvbGxlciwgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBvYnNlcnZlZEF0dHJpYnV0ZXMgfTtcblxuXHRpZiAodHlwZSA9PT0gJ2F0dHJpYnV0ZScpIHtcblx0XHRyZXR1cm4gcmVnaXN0ZXJBdHRyaWJ1dGUodGFnLCB2YWxpZGF0ZWRPcHRpb25zKTtcblx0fVxuXG5cdHJldHVybiByZWdpc3RlckVsZW1lbnQodGFnLCB2YWxpZGF0ZWRPcHRpb25zKTtcbn1cblxuLy8gQmFzZSBDb250cm9sbGVyXG5cbmV4cG9ydHMuQmFzZUNvbnRyb2xsZXIgPSBCYXNlQ29udHJvbGxlcjtcbmV4cG9ydHMubWVkaWEgPSBBdHRyTWVkaWE7XG5leHBvcnRzLnRvdWNoSG92ZXIgPSBBdHRyVG91Y2hIb3ZlcjtcbmV4cG9ydHMuYWpheEZvcm0gPSBhamF4Rm9ybTtcbmV4cG9ydHMua2V5VHJpZ2dlciA9IGtleVRyaWdnZXI7XG5leHBvcnRzLm92ZXJsYXkgPSBvdmVybGF5O1xuZXhwb3J0cy5zaGFyZSA9IHNoYXJlO1xuZXhwb3J0cy5zbW9vdGhTdGF0ZSA9IHNtb290aFN0YXRlO1xuZXhwb3J0cy50aW1lQWdvID0gdGltZUFnbztcbmV4cG9ydHMuZGVmaW5lQ3VzdG9tRWxlbWVudCA9IGRlZmluZUN1c3RvbUVsZW1lbnQ7XG5leHBvcnRzLnBhcnNlRXZlbnQgPSBwYXJzZTtcbmV4cG9ydHMuZ2V0RXZlbnRQYXRoID0gZ2V0UGF0aDtcbmV4cG9ydHMucGFyc2VIVE1MID0gcGFyc2VIVE1MO1xuZXhwb3J0cy5yZW5kZXJOb2RlcyA9IHJlbmRlck5vZGVzO1xuZXhwb3J0cy5jbGVhbk5vZGVzID0gY2xlYW5Ob2RlcztcbmV4cG9ydHMucHJvbWlzaWZ5ID0gcHJvbWlzaWZ5O1xuIl19
