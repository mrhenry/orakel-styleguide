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
	attributes: [{ attribute: 'loop', type: 'bool' }, { attribute: 'auto', type: 'bool' }, { attribute: 'current', type: 'int' }],
	controller: function (_BaseController) {
		_inherits(controller, _BaseController);

		function controller() {
			_classCallCheck(this, controller);

			return _possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		_createClass(controller, [{
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

				this.current = 0;
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this2 = this;

				if (this.auto) {
					this.looper = setInterval(function () {
						_this2.next();
					}, 4000);
				}

				return this;
			}
		}, {
			key: 'destroy',
			value: function destroy() {
				if (this.looper) {
					clearInterval(this.looper);
					this.looper = null;
				}

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

				this.elements.items.forEach(function (item, i) {
					if (item.classList.contains('is-active')) {
						item.classList.remove('is-active');
					}

					if (i === parsed) {
						item.classList.add('is-active');
					}
				});

				this.el.setAttribute('current', parsed);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJndWxwL2Fzc2V0cy9qcy9hcHAuanMiLCJndWxwL2Fzc2V0cy9qcy9tb2R1bGVzL3NsaWRlc2hvdy5qcyIsIm5vZGVfbW9kdWxlcy9jdXN0b20tZWxlbWVudHMtaGVscGVycy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7QUFFQSxnREFBb0IsY0FBcEIsRUFBb0M7QUFDbkMsYUFBWSxDQUNYLEVBQUUsV0FBVyxNQUFiLEVBQXFCLE1BQU0sTUFBM0IsRUFEVyxFQUVYLEVBQUUsV0FBVyxNQUFiLEVBQXFCLE1BQU0sTUFBM0IsRUFGVyxFQUdYLEVBQUUsV0FBVyxTQUFiLEVBQXdCLE1BQU0sS0FBOUIsRUFIVyxDQUR1QjtBQU1uQztBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMEJBbUNRO0FBQ04sU0FBSyxPQUFMLEdBQWUsS0FBSyxPQUFMLEdBQWUsQ0FBOUI7QUFDQTtBQXJDRjtBQUFBO0FBQUEsOEJBdUNZO0FBQ1YsU0FBSyxPQUFMLEdBQWUsS0FBSyxPQUFMLEdBQWUsQ0FBOUI7QUFDQTtBQXpDRjtBQUFBO0FBQUEsNkJBMkNXO0FBQ1QsUUFBSSxLQUFLLEVBQUwsQ0FBUSxRQUFSLENBQWlCLE1BQWpCLEtBQTRCLENBQWhDLEVBQW1DO0FBQ2xDO0FBQ0EsWUFBTyxJQUFJLE9BQUosQ0FBWSxZQUFNLENBQUUsQ0FBcEIsQ0FBUDtBQUNBOztBQUVEO0FBQ0E7QUFsREY7QUFBQTtBQUFBLDBCQW9EUTtBQUNOLFNBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUssUUFBTCxDQUFjLEtBQWQsR0FBc0IsTUFBTSxJQUFOLENBQVcsS0FBSyxFQUFMLENBQVEsUUFBbkIsQ0FBdEI7O0FBRUEsU0FBSyxPQUFMLEdBQWUsQ0FBZjtBQUNBO0FBekRGO0FBQUE7QUFBQSwwQkEyRFE7QUFBQTs7QUFDTixRQUFJLEtBQUssSUFBVCxFQUFlO0FBQ2QsVUFBSyxNQUFMLEdBQWMsWUFBWSxZQUFNO0FBQy9CLGFBQUssSUFBTDtBQUNBLE1BRmEsRUFFWCxJQUZXLENBQWQ7QUFHQTs7QUFFRCxXQUFPLElBQVA7QUFDQTtBQW5FRjtBQUFBO0FBQUEsNkJBcUVXO0FBQ1QsUUFBSSxLQUFLLE1BQVQsRUFBaUI7QUFDaEIsbUJBQWMsS0FBSyxNQUFuQjtBQUNBLFVBQUssTUFBTCxHQUFjLElBQWQ7QUFDQTs7QUFFRDtBQUNBO0FBNUVGO0FBQUE7QUFBQSxxQkFDYSxFQURiLEVBQ2lCO0FBQ2YsUUFBSSxTQUFTLFNBQVMsRUFBVCxFQUFhLEVBQWIsQ0FBYjs7QUFFQSxRQUFJLFdBQVcsS0FBSyxPQUFwQixFQUE2QjtBQUM1QjtBQUNBOztBQUVELFFBQU0sTUFBTSxLQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLE1BQWhDOztBQUVBO0FBQ0EsUUFBSSxVQUFVLEdBQWQsRUFBbUI7QUFDbEI7QUFDQSxjQUFTLEtBQUssSUFBTCxHQUFZLENBQVosR0FBZ0IsTUFBTSxDQUEvQjtBQUNBOztBQUVEO0FBQ0EsUUFBSSxTQUFTLENBQWIsRUFBZ0I7QUFDZjtBQUNBLGNBQVMsS0FBSyxJQUFMLEdBQVksTUFBTSxDQUFsQixHQUFzQixDQUEvQjtBQUNBOztBQUVELFNBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsT0FBcEIsQ0FBNEIsVUFBQyxJQUFELEVBQU8sQ0FBUCxFQUFhO0FBQ3hDLFNBQUksS0FBSyxTQUFMLENBQWUsUUFBZixDQUF3QixXQUF4QixDQUFKLEVBQTBDO0FBQ3pDLFdBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsV0FBdEI7QUFDQTs7QUFFRCxTQUFJLE1BQU0sTUFBVixFQUFrQjtBQUNqQixXQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLFdBQW5CO0FBQ0E7QUFDRCxLQVJEOztBQVVBLFNBQUssRUFBTCxDQUFRLFlBQVIsQ0FBcUIsU0FBckIsRUFBZ0MsTUFBaEM7QUFDQTtBQWpDRjs7QUFBQTtBQUFBO0FBTm1DLENBQXBDOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAnLi9tb2R1bGVzL3NsaWRlc2hvdyc7XG4iLCJpbXBvcnQgeyBkZWZpbmVDdXN0b21FbGVtZW50LCBCYXNlQ29udHJvbGxlciB9IGZyb20gJ2N1c3RvbS1lbGVtZW50cy1oZWxwZXJzJztcblxuZGVmaW5lQ3VzdG9tRWxlbWVudCgnbXItc2xpZGVzaG93Jywge1xuXHRhdHRyaWJ1dGVzOiBbXG5cdFx0eyBhdHRyaWJ1dGU6ICdsb29wJywgdHlwZTogJ2Jvb2wnIH0sXG5cdFx0eyBhdHRyaWJ1dGU6ICdhdXRvJywgdHlwZTogJ2Jvb2wnIH0sXG5cdFx0eyBhdHRyaWJ1dGU6ICdjdXJyZW50JywgdHlwZTogJ2ludCcgfSxcblx0XSxcblx0Y29udHJvbGxlcjogY2xhc3MgZXh0ZW5kcyBCYXNlQ29udHJvbGxlciB7XG5cdFx0c2V0IGN1cnJlbnQodG8pIHtcblx0XHRcdGxldCBwYXJzZWQgPSBwYXJzZUludCh0bywgMTApO1xuXG5cdFx0XHRpZiAocGFyc2VkID09PSB0aGlzLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBtYXggPSB0aGlzLmVsZW1lbnRzLml0ZW1zLmxlbmd0aDtcblxuXHRcdFx0Ly8gSWYgd2UncmUgYXQgdGhlIGxhc3Qgc2xpZGUgYW5kIG5hdmlnYXRlZCAnTmV4dCdcblx0XHRcdGlmIChwYXJzZWQgPj0gbWF4KSB7XG5cdFx0XHRcdC8vIEJhY2sgdG8gZmlyc3Qgc2xpZGUgaWYgY2Fyb3VzZWwgaGFzIGxvb3Agc2V0IHRvIHRydWVcblx0XHRcdFx0cGFyc2VkID0gdGhpcy5sb29wID8gMCA6IG1heCAtIDE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHdlJ3JlIGF0IHRoZSBmaXJzdCBzbGlkZSBhbmQgbmF2aWdhdGVkICdQcmV2aW91cydcblx0XHRcdGlmIChwYXJzZWQgPCAwKSB7XG5cdFx0XHRcdC8vIEp1bXAgdG8gbGFzdCBzbGlkZSBpZiBjYXJvdXNlbCBoYXMgbG9vcCBzZXQgdG8gdHJ1ZVxuXHRcdFx0XHRwYXJzZWQgPSB0aGlzLmxvb3AgPyBtYXggLSAxIDogMDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5lbGVtZW50cy5pdGVtcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG5cdFx0XHRcdGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnaXMtYWN0aXZlJykpIHtcblx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGkgPT09IHBhcnNlZCkge1xuXHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLmVsLnNldEF0dHJpYnV0ZSgnY3VycmVudCcsIHBhcnNlZCk7XG5cdFx0fVxuXG5cdFx0bmV4dCgpIHtcblx0XHRcdHRoaXMuY3VycmVudCA9IHRoaXMuY3VycmVudCArIDE7XG5cdFx0fVxuXG5cdFx0cHJldmlvdXMoKSB7XG5cdFx0XHR0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnQgLSAxO1xuXHRcdH1cblxuXHRcdHJlc29sdmUoKSB7XG5cdFx0XHRpZiAodGhpcy5lbC5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0Ly8gS2VlcCBoYW5naW5nLCBkb24ndCBhY3RpdmF0ZSBpZiBlbXB0eVxuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc3VwZXIucmVzb2x2ZSgpO1xuXHRcdH1cblxuXHRcdGluaXQoKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnRzID0ge307XG5cdFx0XHR0aGlzLmVsZW1lbnRzLml0ZW1zID0gQXJyYXkuZnJvbSh0aGlzLmVsLmNoaWxkcmVuKTtcblxuXHRcdFx0dGhpcy5jdXJyZW50ID0gMDtcblx0XHR9XG5cblx0XHRiaW5kKCkge1xuXHRcdFx0aWYgKHRoaXMuYXV0bykge1xuXHRcdFx0XHR0aGlzLmxvb3BlciA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLm5leHQoKTtcblx0XHRcdFx0fSwgNDAwMCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdGRlc3Ryb3koKSB7XG5cdFx0XHRpZiAodGhpcy5sb29wZXIpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmxvb3Blcik7XG5cdFx0XHRcdHRoaXMubG9vcGVyID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0c3VwZXIuZGVzdHJveSgpO1xuXHRcdH1cblx0fSxcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG5mdW5jdGlvbiBwYXJzZShuYW1lKSB7XG5cdHZhciBjbGVhbiA9IG5hbWUudHJpbSgpO1xuXHR2YXIgcGFydHMgPSBjbGVhbi5zcGxpdCgnICcpO1xuXG5cdHZhciBldmVudCA9IGNsZWFuO1xuXHR2YXIgc2VsZWN0b3IgPSBudWxsO1xuXG5cdGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG5cdFx0ZXZlbnQgPSBwYXJ0cy5zaGlmdCgpO1xuXHRcdHNlbGVjdG9yID0gcGFydHMuam9pbignICcpO1xuXHR9XG5cblx0cmV0dXJuIHsgZXZlbnQ6IGV2ZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UGF0aChlKSB7XG5cdHZhciBwYXRoID0gZS5wYXRoO1xuXG5cdGlmICghcGF0aCkge1xuXHRcdHBhdGggPSBbZS50YXJnZXRdO1xuXHRcdHZhciBub2RlID0gZS50YXJnZXQ7XG5cblx0XHR3aGlsZSAobm9kZS5wYXJlbnROb2RlKSB7XG5cdFx0XHRub2RlID0gbm9kZS5wYXJlbnROb2RlO1xuXHRcdFx0cGF0aC5wdXNoKG5vZGUpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBwYXRoO1xufVxuXG5mdW5jdGlvbiBwcm9taXNpZnkobWV0aG9kKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0dmFyIHdhaXQgPSBtZXRob2QoKTtcblxuXHRcdGlmICh3YWl0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuXHRcdFx0d2FpdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Zm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0XHRcdFx0XHRhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzb2x2ZShhcmdzKTtcblx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Zm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcblx0XHRcdFx0XHRhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZWplY3QoYXJncyk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzb2x2ZSh3YWl0KTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiB3YWl0Rm9yRE9NUmVhZHkoKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuXHRcdGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBoYW5kbGVyID0gZnVuY3Rpb24gaGFuZGxlcigpIHtcblx0XHRcdFx0aWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcblx0XHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgaGFuZGxlciwgZmFsc2UpO1xuXHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGhhbmRsZXIsIGZhbHNlKTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBlbGVtZW50SXNJbkRPTShlbGVtZW50KSB7XG5cdHZhciByb290ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBkb2N1bWVudC5ib2R5O1xuXG5cdGlmICghZWxlbWVudCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGlmIChlbGVtZW50ID09PSByb290KSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIHJvb3QuY29udGFpbnMoZWxlbWVudCk7XG59XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuXG5cblxuXG5cbnZhciBhc3luY0dlbmVyYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQXdhaXRWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEFzeW5jR2VuZXJhdG9yKGdlbikge1xuICAgIHZhciBmcm9udCwgYmFjaztcblxuICAgIGZ1bmN0aW9uIHNlbmQoa2V5LCBhcmcpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIGFyZzogYXJnLFxuICAgICAgICAgIHJlc29sdmU6IHJlc29sdmUsXG4gICAgICAgICAgcmVqZWN0OiByZWplY3QsXG4gICAgICAgICAgbmV4dDogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChiYWNrKSB7XG4gICAgICAgICAgYmFjayA9IGJhY2submV4dCA9IHJlcXVlc3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnJvbnQgPSBiYWNrID0gcmVxdWVzdDtcbiAgICAgICAgICByZXN1bWUoa2V5LCBhcmcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXN1bWUoa2V5LCBhcmcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBnZW5ba2V5XShhcmcpO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXdhaXRWYWx1ZSkge1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZS52YWx1ZSkudGhlbihmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICByZXN1bWUoXCJuZXh0XCIsIGFyZyk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgICAgcmVzdW1lKFwidGhyb3dcIiwgYXJnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXR0bGUocmVzdWx0LmRvbmUgPyBcInJldHVyblwiIDogXCJub3JtYWxcIiwgcmVzdWx0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHNldHRsZShcInRocm93XCIsIGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dGxlKHR5cGUsIHZhbHVlKSB7XG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBcInJldHVyblwiOlxuICAgICAgICAgIGZyb250LnJlc29sdmUoe1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZG9uZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJ0aHJvd1wiOlxuICAgICAgICAgIGZyb250LnJlamVjdCh2YWx1ZSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBmcm9udC5yZXNvbHZlKHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGRvbmU6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGZyb250ID0gZnJvbnQubmV4dDtcblxuICAgICAgaWYgKGZyb250KSB7XG4gICAgICAgIHJlc3VtZShmcm9udC5rZXksIGZyb250LmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiYWNrID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9pbnZva2UgPSBzZW5kO1xuXG4gICAgaWYgKHR5cGVvZiBnZW4ucmV0dXJuICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMucmV0dXJuID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHtcbiAgICBBc3luY0dlbmVyYXRvci5wcm90b3R5cGVbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgfVxuXG4gIEFzeW5jR2VuZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiB0aGlzLl9pbnZva2UoXCJuZXh0XCIsIGFyZyk7XG4gIH07XG5cbiAgQXN5bmNHZW5lcmF0b3IucHJvdG90eXBlLnRocm93ID0gZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiB0aGlzLl9pbnZva2UoXCJ0aHJvd1wiLCBhcmcpO1xuICB9O1xuXG4gIEFzeW5jR2VuZXJhdG9yLnByb3RvdHlwZS5yZXR1cm4gPSBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ludm9rZShcInJldHVyblwiLCBhcmcpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgd3JhcDogZnVuY3Rpb24gKGZuKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEFzeW5jR2VuZXJhdG9yKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgfTtcbiAgICB9LFxuICAgIGF3YWl0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBuZXcgQXdhaXRWYWx1ZSh2YWx1ZSk7XG4gICAgfVxuICB9O1xufSgpO1xuXG5cblxuXG5cbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59O1xuXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KCk7XG5cblxuXG5cblxudmFyIGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gKG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG5cblxudmFyIGluaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiA9IGZ1bmN0aW9uIChzZWxmLCBjYWxsKSB7XG4gIGlmICghc2VsZikge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmO1xufTtcblxuXG5cblxuXG52YXIgc2xpY2VkVG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gc2xpY2VJdGVyYXRvcihhcnIsIGkpIHtcbiAgICB2YXIgX2FyciA9IFtdO1xuICAgIHZhciBfbiA9IHRydWU7XG4gICAgdmFyIF9kID0gZmFsc2U7XG4gICAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHtcbiAgICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBfZCA9IHRydWU7XG4gICAgICBfZSA9IGVycjtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSkgX2lbXCJyZXR1cm5cIl0oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF9hcnI7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGFyciwgaSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpIHtcbiAgICAgIHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xuICAgIH1cbiAgfTtcbn0oKTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIHRvQ29uc3VtYWJsZUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFycik7XG4gIH1cbn07XG5cbnZhciBCQVNFX0NPTlRST0xMRVJfSEFORExFUlMgPSBTeW1ib2woJ0JBU0VfQ09OVFJPTExFUl9IQU5ETEVSUycpO1xuXG52YXIgQmFzZUNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIEJhc2VDb250cm9sbGVyKGVsKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdGNsYXNzQ2FsbENoZWNrKHRoaXMsIEJhc2VDb250cm9sbGVyKTtcblxuXHRcdHZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xuXG5cdFx0dGhpcy5lbCA9IGVsO1xuXG5cdFx0dGhpcy5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoIWVsZW1lbnRJc0luRE9NKF90aGlzLmVsKSkge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoJ1RoZSBlbGVtZW50IGhhcyBkaXNhcHBlYXJlZCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRfdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdpcy1yZXNvbHZlZCcpO1xuXG5cdFx0XHR2YXIgaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHRcdHJldHVybiBwcm9taXNpZnkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmICghZWxlbWVudElzSW5ET00oX3RoaXMuZWwpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoJ1RoZSBlbGVtZW50IGhhcyBkaXNhcHBlYXJlZCcpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBfdGhpcy5pbml0KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0dmFyIHJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRcdFx0cmV0dXJuIHByb21pc2lmeShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKCFlbGVtZW50SXNJbkRPTShfdGhpcy5lbCkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgnVGhlIGVsZW1lbnQgaGFzIGRpc2FwcGVhcmVkJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIF90aGlzLnJlbmRlcigpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdHZhciBiaW5kID0gZnVuY3Rpb24gYmluZCgpIHtcblx0XHRcdFx0cmV0dXJuIHByb21pc2lmeShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKCFlbGVtZW50SXNJbkRPTShfdGhpcy5lbCkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgnVGhlIGVsZW1lbnQgaGFzIGRpc2FwcGVhcmVkJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIF90aGlzLmJpbmQoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gaW5pdCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gcmVuZGVyKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGJpbmQoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHJldHVybiBfdGhpcztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KS5jYXRjaChub29wKTtcblx0XHR9KS5jYXRjaChub29wKTtcblx0fVxuXG5cdGNyZWF0ZUNsYXNzKEJhc2VDb250cm9sbGVyLCBbe1xuXHRcdGtleTogJ2Rlc3Ryb3knLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHRcdFx0dGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1yZXNvbHZlZCcpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ3Jlc29sdmUnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiByZXNvbHZlKCkge1xuXHRcdFx0cmV0dXJuIHdhaXRGb3JET01SZWFkeSgpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2luaXQnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge31cblx0fSwge1xuXHRcdGtleTogJ3JlbmRlcicsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHt9XG5cdH0sIHtcblx0XHRrZXk6ICdiaW5kJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gYmluZCgpIHt9XG5cdH0sIHtcblx0XHRrZXk6ICd1bmJpbmQnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiB1bmJpbmQoKSB7XG5cdFx0XHRpZiAodGhpc1tCQVNFX0NPTlRST0xMRVJfSEFORExFUlNdKSB7XG5cdFx0XHRcdHRoaXNbQkFTRV9DT05UUk9MTEVSX0hBTkRMRVJTXS5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuXHRcdFx0XHRcdGxpc3RlbmVyLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGxpc3RlbmVyLmV2ZW50LCBsaXN0ZW5lci5oYW5kbGVyLCBsaXN0ZW5lci5vcHRpb25zKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dGhpc1tCQVNFX0NPTlRST0xMRVJfSEFORExFUlNdID0gW107XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnb24nLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBvbihuYW1lLCBoYW5kbGVyKSB7XG5cdFx0XHR2YXIgdGFyZ2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuXHRcdFx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IGZhbHNlO1xuXG5cdFx0XHR0aGlzW0JBU0VfQ09OVFJPTExFUl9IQU5ETEVSU10gPSB0aGlzW0JBU0VfQ09OVFJPTExFUl9IQU5ETEVSU10gfHwgW107XG5cblx0XHRcdHZhciBfcGFyc2VFdmVudCA9IHBhcnNlKG5hbWUpLFxuXHRcdFx0ICAgIGV2ZW50ID0gX3BhcnNlRXZlbnQuZXZlbnQsXG5cdFx0XHQgICAgc2VsZWN0b3IgPSBfcGFyc2VFdmVudC5zZWxlY3RvcjtcblxuXHRcdFx0dmFyIHBhcnNlZFRhcmdldCA9ICF0YXJnZXQgPyB0aGlzLmVsIDogdGFyZ2V0O1xuXG5cdFx0XHR2YXIgd3JhcHBlZEhhbmRsZXIgPSBmdW5jdGlvbiB3cmFwcGVkSGFuZGxlcihlKSB7XG5cdFx0XHRcdGhhbmRsZXIoZSwgZS50YXJnZXQpO1xuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHNlbGVjdG9yKSB7XG5cdFx0XHRcdHdyYXBwZWRIYW5kbGVyID0gZnVuY3Rpb24gd3JhcHBlZEhhbmRsZXIoZSkge1xuXHRcdFx0XHRcdHZhciBwYXRoID0gZ2V0UGF0aChlKTtcblxuXHRcdFx0XHRcdHZhciBtYXRjaGluZ1RhcmdldCA9IHBhdGguZmluZChmdW5jdGlvbiAodGFnKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGFnLm1hdGNoZXMgJiYgdGFnLm1hdGNoZXMoc2VsZWN0b3IpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0aWYgKG1hdGNoaW5nVGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHRoYW5kbGVyKGUsIG1hdGNoaW5nVGFyZ2V0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHZhciBsaXN0ZW5lciA9IHtcblx0XHRcdFx0dGFyZ2V0OiBwYXJzZWRUYXJnZXQsXG5cdFx0XHRcdHNlbGVjdG9yOiBzZWxlY3Rvcixcblx0XHRcdFx0ZXZlbnQ6IGV2ZW50LFxuXHRcdFx0XHRoYW5kbGVyOiB3cmFwcGVkSGFuZGxlcixcblx0XHRcdFx0b3B0aW9uczogb3B0aW9uc1xuXHRcdFx0fTtcblxuXHRcdFx0bGlzdGVuZXIudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIobGlzdGVuZXIuZXZlbnQsIGxpc3RlbmVyLmhhbmRsZXIsIGxpc3RlbmVyLm9wdGlvbnMpO1xuXG5cdFx0XHR0aGlzW0JBU0VfQ09OVFJPTExFUl9IQU5ETEVSU10ucHVzaChsaXN0ZW5lcik7XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ29uY2UnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBvbmNlKG5hbWUsIGhhbmRsZXIpIHtcblx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHR2YXIgdGFyZ2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuXHRcdFx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IGZhbHNlO1xuXG5cdFx0XHR2YXIgd3JhcHBlZEhhbmRsZXIgPSBmdW5jdGlvbiB3cmFwcGVkSGFuZGxlcihlLCBtYXRjaGluZ1RhcmdldCkge1xuXHRcdFx0XHRfdGhpczIub2ZmKG5hbWUsIHRhcmdldCk7XG5cdFx0XHRcdGhhbmRsZXIoZSwgbWF0Y2hpbmdUYXJnZXQpO1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5vbihuYW1lLCB3cmFwcGVkSGFuZGxlciwgdGFyZ2V0LCBvcHRpb25zKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdvZmYnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBvZmYobmFtZSkge1xuXHRcdFx0dmFyIHRhcmdldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuXHRcdFx0dmFyIF9wYXJzZUV2ZW50MiA9IHBhcnNlKG5hbWUpLFxuXHRcdFx0ICAgIGV2ZW50ID0gX3BhcnNlRXZlbnQyLmV2ZW50LFxuXHRcdFx0ICAgIHNlbGVjdG9yID0gX3BhcnNlRXZlbnQyLnNlbGVjdG9yO1xuXG5cdFx0XHR2YXIgcGFyc2VkVGFyZ2V0ID0gIXRhcmdldCA/IHRoaXMuZWwgOiB0YXJnZXQ7XG5cblx0XHRcdHZhciBsaXN0ZW5lciA9IHRoaXNbQkFTRV9DT05UUk9MTEVSX0hBTkRMRVJTXS5maW5kKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG5cdFx0XHRcdC8vIFNlbGVjdG9ycyBkb24ndCBtYXRjaFxuXHRcdFx0XHRpZiAoaGFuZGxlci5zZWxlY3RvciAhPT0gc2VsZWN0b3IpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBFdmVudCB0eXBlIGRvbid0IG1hdGNoXG5cdFx0XHRcdGlmIChoYW5kbGVyLmV2ZW50ICE9PSBldmVudCkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFBhc3NlZCBhIHRhcmdldCwgYnV0IHRoZSB0YXJnZXRzIGRvbid0IG1hdGNoXG5cdFx0XHRcdGlmICghIXBhcnNlZFRhcmdldCAmJiBoYW5kbGVyLnRhcmdldCAhPT0gcGFyc2VkVGFyZ2V0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRWxzZSwgd2UgZm91bmQgYSBtYXRjaFxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoISFsaXN0ZW5lciAmJiAhIWxpc3RlbmVyLnRhcmdldCkge1xuXHRcdFx0XHR0aGlzW0JBU0VfQ09OVFJPTExFUl9IQU5ETEVSU10uc3BsaWNlKHRoaXNbQkFTRV9DT05UUk9MTEVSX0hBTkRMRVJTXS5pbmRleE9mKGxpc3RlbmVyKSwgMSk7XG5cblx0XHRcdFx0bGlzdGVuZXIudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIobGlzdGVuZXIuZXZlbnQsIGxpc3RlbmVyLmhhbmRsZXIsIGxpc3RlbmVyLm9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2VtaXQnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBlbWl0KG5hbWUpIHtcblx0XHRcdHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblx0XHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuXHRcdFx0dmFyIHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe1xuXHRcdFx0XHRkZXRhaWw6IGRhdGEsXG5cdFx0XHRcdGJ1YmJsZXM6IHRydWUsXG5cdFx0XHRcdGNhbmNlbGFibGU6IHRydWVcblx0XHRcdH0sIG9wdGlvbnMpO1xuXG5cdFx0XHR2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQobmFtZSwgcGFyYW1zKTtcblxuXHRcdFx0dGhpcy5lbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHR9XG5cdH1dKTtcblx0cmV0dXJuIEJhc2VDb250cm9sbGVyO1xufSgpO1xuXG52YXIgY29udmVydEF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lID0gZnVuY3Rpb24gY29udmVydEF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZSkge1xuXHRyZXR1cm4gYXR0cmlidXRlLnNwbGl0KCctJykucmVkdWNlKGZ1bmN0aW9uIChjYW1lbGNhc2VkLCBwYXJ0LCBpbmRleCkge1xuXHRcdGlmIChpbmRleCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIHBhcnQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNhbWVsY2FzZWQgKyBwYXJ0WzBdLnRvVXBwZXJDYXNlKCkgKyBwYXJ0LnN1YnN0cigxKTtcblx0fSk7XG59O1xuXG52YXIgYWRkTWV0aG9kID0gZnVuY3Rpb24gYWRkTWV0aG9kKGN1c3RvbUVsZW1lbnQsIG5hbWUsIG1ldGhvZCkge1xuXHRpZiAodHlwZW9mIGN1c3RvbUVsZW1lbnQucHJvdG90eXBlW25hbWVdICE9PSAndW5kZWZpbmVkJykge1xuXHRcdGNvbnNvbGUud2FybihjdXN0b21FbGVtZW50Lm5hbWUgKyAnIGFscmVhZHkgaGFzIGEgcHJvcGVydHkgJyArIG5hbWUpO1xuXHR9XG5cblx0Y3VzdG9tRWxlbWVudC5wcm90b3R5cGVbbmFtZV0gPSBtZXRob2Q7XG59O1xuXG52YXIgYWRkR2V0dGVyID0gZnVuY3Rpb24gYWRkR2V0dGVyKGN1c3RvbUVsZW1lbnQsIG5hbWUsIG1ldGhvZCkge1xuXHR2YXIgZ2V0dGVyTmFtZSA9IGNvbnZlcnRBdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShuYW1lKTtcblxuXHRpZiAodHlwZW9mIGN1c3RvbUVsZW1lbnQucHJvdG90eXBlW2dldHRlck5hbWVdICE9PSAndW5kZWZpbmVkJykge1xuXHRcdGNvbnNvbGUud2FybihjdXN0b21FbGVtZW50Lm5hbWUgKyAnIGFscmVhZHkgaGFzIGEgcHJvcGVydHkgJyArIGdldHRlck5hbWUpO1xuXHR9XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLCBnZXR0ZXJOYW1lLCB7XG5cdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcblx0XHRnZXQ6IG1ldGhvZFxuXHR9KTtcbn07XG5cbnZhciBhZGRQcm9wZXJ0eSA9IGZ1bmN0aW9uIGFkZFByb3BlcnR5KGN1c3RvbUVsZW1lbnQsIG5hbWUpIHtcblx0dmFyIGdldHRlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogbnVsbDtcblx0dmFyIHNldHRlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogbnVsbDtcblxuXHR2YXIgcHJvcGVydHlOYW1lID0gY29udmVydEF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuXG5cdGlmICh0eXBlb2YgY3VzdG9tRWxlbWVudC5wcm90b3R5cGVbcHJvcGVydHlOYW1lXSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRjb25zb2xlLndhcm4oY3VzdG9tRWxlbWVudC5uYW1lICsgJyBhbHJlYWR5IGhhcyBhIHByb3BlcnR5ICcgKyBwcm9wZXJ0eU5hbWUpO1xuXHR9XG5cblx0dmFyIG5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG5cblx0dmFyIHByb3BlcnR5ID0ge1xuXHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0Z2V0OiB0eXBlb2YgZ2V0dGVyID09PSAnZnVuY3Rpb24nID8gZ2V0dGVyIDogbm9vcCxcblx0XHRzZXQ6IHR5cGVvZiBzZXR0ZXIgPT09ICdmdW5jdGlvbicgPyBzZXR0ZXIgOiBub29wXG5cdH07XG5cblx0dmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUpO1xuXG5cdGlmIChkZXNjcmlwdG9yKSB7XG5cdFx0aWYgKHR5cGVvZiBkZXNjcmlwdG9yLnNldCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dmFyIGV4aXN0aW5nID0gZGVzY3JpcHRvci5zZXQ7XG5cblx0XHRcdHByb3BlcnR5LnNldCA9IGZ1bmN0aW9uIHNldCh0bykge1xuXHRcdFx0XHRleGlzdGluZy5jYWxsKHRoaXMsIHRvKTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBkZXNjcmlwdG9yLmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dmFyIGdlbmVyYXRlZCA9IHByb3BlcnR5LmdldDtcblx0XHRcdHZhciBfZXhpc3RpbmcgPSBkZXNjcmlwdG9yLmdldDtcblxuXHRcdFx0cHJvcGVydHkuZ2V0ID0gZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0XHR2YXIgdmFsdWUgPSBfZXhpc3RpbmcuY2FsbCh0aGlzKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBnZW5lcmF0ZWQuY2FsbCh0aGlzKTtcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGN1c3RvbUVsZW1lbnQucHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5KTtcbn07XG5cbnZhciBBdHRyTWVkaWEgPSBmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIEF0dHJNZWRpYSgpIHtcblx0XHRjbGFzc0NhbGxDaGVjayh0aGlzLCBBdHRyTWVkaWEpO1xuXHR9XG5cblx0Y3JlYXRlQ2xhc3MoQXR0ck1lZGlhLCBudWxsLCBbe1xuXHRcdGtleTogJ2F0dGFjaFRvJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gYXR0YWNoVG8oY3VzdG9tRWxlbWVudCkge1xuXHRcdFx0dmFyIG5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG5cblx0XHRcdHZhciB3YXRjaGVycyA9IHt9O1xuXG5cdFx0XHQvLyBBZGRzIGN1c3RvbUVsZW1lbnQubWVkaWFcblx0XHRcdC8vIEByZXR1cm4gc3RyaW5nIFx0XHRWYWx1ZSBvZiBgbWVkaWE9XCJcImAgYXR0cmlidXRlXG5cdFx0XHRhZGRHZXR0ZXIoY3VzdG9tRWxlbWVudCwgJ21lZGlhJywgZnVuY3Rpb24gZ2V0TWVkaWFBdHRyaWJ1dGUoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmVsLmhhc0F0dHJpYnV0ZSgnbWVkaWEnKSA/IHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdtZWRpYScpIDogZmFsc2U7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQWRkcyBjdXN0b21FbGVtZW50Lm1hdGNoZXNNZWRpYVxuXHRcdFx0Ly8gQHJldHVybiBib29sIFx0XHRJZiB0aGUgdmlld3BvcnQgY3VycmVudGx5IG1hdGNoZXMgdGhlIHNwZWNpZmllZCBtZWRpYSBxdWVyeVxuXHRcdFx0YWRkR2V0dGVyKGN1c3RvbUVsZW1lbnQsICdtYXRjaGVzTWVkaWEnLCBmdW5jdGlvbiBtYXRjaGVzTWVkaWEoKSB7XG5cdFx0XHRcdGlmICghdGhpcy5tZWRpYSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICdtYXRjaE1lZGlhJyBpbiB3aW5kb3cgJiYgISF3aW5kb3cubWF0Y2hNZWRpYSh0aGlzLm1lZGlhKS5tYXRjaGVzO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEFkZHMgY3VzdG9tRWxlbWVudHMud2hlbk1lZGlhTWF0Y2hlcygpXG5cdFx0XHQvLyBAcmV0dXJuIFByb21pc2Vcblx0XHRcdGFkZE1ldGhvZChjdXN0b21FbGVtZW50LCAnd2hlbk1lZGlhTWF0Y2hlcycsIGZ1bmN0aW9uIHdoZW5NZWRpYU1hdGNoZXMoKSB7XG5cdFx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRcdFx0dmFyIGRlZmVyID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0XHRcdFx0XHR2YXIgaGFuZGxlciA9IGZ1bmN0aW9uIGhhbmRsZXIobWVkaWEpIHtcblx0XHRcdFx0XHRcdGlmIChtZWRpYS5tYXRjaGVzKSB7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHRcdFx0bWVkaWEucmVtb3ZlTGlzdGVuZXIoaGFuZGxlcik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGlmICgnbWF0Y2hNZWRpYScgaW4gd2luZG93KSB7XG5cdFx0XHRcdFx0XHR3YXRjaGVyc1tfdGhpcy5tZWRpYV0gPSB3YXRjaGVyc1tfdGhpcy5tZWRpYV0gfHwgd2luZG93Lm1hdGNoTWVkaWEoX3RoaXMubWVkaWEpO1xuXHRcdFx0XHRcdFx0d2F0Y2hlcnNbX3RoaXMubWVkaWFdLmFkZExpc3RlbmVyKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGhhbmRsZXIod2F0Y2hlcnNbX3RoaXMubWVkaWFdKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0aGFuZGxlcih3YXRjaGVyc1tfdGhpcy5tZWRpYV0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmZXI7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQWRkcyBjdXN0b21FbGVtZW50cy53aGVuTWVkaWFVbm1hdGNoZXMoKVxuXHRcdFx0Ly8gQHJldHVybiBQcm9taXNlXG5cdFx0XHRhZGRNZXRob2QoY3VzdG9tRWxlbWVudCwgJ3doZW5NZWRpYVVubWF0Y2hlcycsIGZ1bmN0aW9uIHdoZW5NZWRpYVVubWF0Y2hlcygpIHtcblx0XHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdFx0dmFyIGRlZmVyID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0XHRcdFx0XHR2YXIgaGFuZGxlciA9IGZ1bmN0aW9uIGhhbmRsZXIobWVkaWEpIHtcblx0XHRcdFx0XHRcdGlmIChtZWRpYS5tYXRjaGVzKSB7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHRcdFx0bWVkaWEucmVtb3ZlTGlzdGVuZXIoaGFuZGxlcik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGlmICgnbWF0Y2hNZWRpYScgaW4gd2luZG93KSB7XG5cdFx0XHRcdFx0XHR3YXRjaGVyc1tfdGhpczIubWVkaWFdID0gd2F0Y2hlcnNbX3RoaXMyLm1lZGlhXSB8fCB3aW5kb3cubWF0Y2hNZWRpYShfdGhpczIubWVkaWEpO1xuXHRcdFx0XHRcdFx0d2F0Y2hlcnNbX3RoaXMyLm1lZGlhXS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBoYW5kbGVyKHdhdGNoZXJzW190aGlzMi5tZWRpYV0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRoYW5kbGVyKHdhdGNoZXJzW190aGlzMi5tZWRpYV0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmZXI7XG5cdFx0XHR9KTtcblxuXHRcdFx0YWRkTWV0aG9kKGN1c3RvbUVsZW1lbnQsICd3YXRjaE1lZGlhJywgZnVuY3Rpb24gd2F0Y2hNZWRpYSgpIHtcblx0XHRcdFx0dmFyIF90aGlzMyA9IHRoaXM7XG5cblx0XHRcdFx0dmFyIG1hdGNoID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBub29wO1xuXHRcdFx0XHR2YXIgdW5tYXRjaCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbm9vcDtcblxuXHRcdFx0XHR2YXIgaGFuZGxlciA9IGZ1bmN0aW9uIGhhbmRsZXIobWVkaWEpIHtcblx0XHRcdFx0XHRpZiAobWVkaWEubWF0Y2hlcykge1xuXHRcdFx0XHRcdFx0bWF0Y2goKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dW5tYXRjaCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoJ21hdGNoTWVkaWEnIGluIHdpbmRvdykge1xuXHRcdFx0XHRcdHdhdGNoZXJzW3RoaXMubWVkaWFdID0gd2F0Y2hlcnNbdGhpcy5tZWRpYV0gfHwgd2luZG93Lm1hdGNoTWVkaWEodGhpcy5tZWRpYSk7XG5cdFx0XHRcdFx0d2F0Y2hlcnNbdGhpcy5tZWRpYV0uYWRkTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGhhbmRsZXIod2F0Y2hlcnNbX3RoaXMzLm1lZGlhXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aGFuZGxlcih3YXRjaGVyc1t0aGlzLm1lZGlhXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fV0pO1xuXHRyZXR1cm4gQXR0ck1lZGlhO1xufSgpO1xuXG52YXIgQXR0clRvdWNoSG92ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIEF0dHJUb3VjaEhvdmVyKCkge1xuXHRcdGNsYXNzQ2FsbENoZWNrKHRoaXMsIEF0dHJUb3VjaEhvdmVyKTtcblx0fVxuXG5cdGNyZWF0ZUNsYXNzKEF0dHJUb3VjaEhvdmVyLCBudWxsLCBbe1xuXHRcdGtleTogJ2F0dGFjaFRvJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gYXR0YWNoVG8oY3VzdG9tRWxlbWVudCkge1xuXHRcdFx0dmFyIGlzVG91Y2ggPSBmYWxzZTtcblx0XHRcdHZhciBpc1RvdWNoZWQgPSBmYWxzZTtcblxuXHRcdFx0dmFyIHRvdWNoQ2xhc3MgPSAnaXMtdG91Y2gnO1xuXHRcdFx0dmFyIGhvdmVyQ2xhc3MgPSAnaXMtdG91Y2gtaG92ZXInO1xuXG5cdFx0XHRhZGRHZXR0ZXIoY3VzdG9tRWxlbWVudCwgJ3RvdWNoSG92ZXInLCBmdW5jdGlvbiBnZXRUb3VjaEhvdmVyQXR0cmlidXRlKCkge1xuXHRcdFx0XHRpZiAodGhpcy5lbC5oYXNBdHRyaWJ1dGUoJ3RvdWNoLWhvdmVyJykpIHtcblx0XHRcdFx0XHQvLyBAdG9kbyAtIFN1cHBvcnQgZGlmZmVyZW50IHZhbHVlcyBmb3IgdG91Y2gtaG92ZXJcblx0XHRcdFx0XHQvLyBgYXV0b2AgICAgICAgIGRldGVjdCBiYXNlZCBvbiBlbGVtZW50XG5cdFx0XHRcdFx0Ly8gYHRvZ2dsZWAgICAgICBhbHdheXMgdG9nZ2xlIGhvdmVyIG9uL29mZiAodGhpcyBtaWdodCBibG9jayBjbGlja3MpXG5cdFx0XHRcdFx0Ly8gYHBhc3N0aHJvdWdoYCBpZ25vcmUgaG92ZXIsIGRpcmVjdGx5IHRyaWdnZXIgYWN0aW9uXG5cdFx0XHRcdFx0cmV0dXJuICdhdXRvJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0pO1xuXG5cdFx0XHRhZGRNZXRob2QoY3VzdG9tRWxlbWVudCwgJ2VuYWJsZVRvdWNoSG92ZXInLCBmdW5jdGlvbiBlbmFibGVUb3VjaEhvdmVyKCkge1xuXHRcdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aXNUb3VjaCA9IHRydWU7XG5cdFx0XHRcdFx0X3RoaXMuZWwuY2xhc3NMaXN0LmFkZCh0b3VjaENsYXNzKTtcblx0XHRcdFx0fSwgdGhpcy5lbCwgeyB1c2VDYXB0dXJlOiB0cnVlIH0pO1xuXG5cdFx0XHRcdHRoaXMub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdHZhciBwYXRoID0gZ2V0UGF0aChlKTtcblxuXHRcdFx0XHRcdC8vIFJlbW92ZSBob3ZlciB3aGVuIHRhcHBpbmcgb3V0c2lkZSB0aGUgRE9NIG5vZGVcblx0XHRcdFx0XHRpZiAoaXNUb3VjaGVkICYmICFwYXRoLmluY2x1ZGVzKF90aGlzLmVsKSkge1xuXHRcdFx0XHRcdFx0aXNUb3VjaCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0aXNUb3VjaGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRfdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKGhvdmVyQ2xhc3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgZG9jdW1lbnQuYm9keSwgeyB1c2VDYXB0dXJlOiB0cnVlIH0pO1xuXG5cdFx0XHRcdHRoaXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpZiAoX3RoaXMudG91Y2hIb3Zlcikge1xuXHRcdFx0XHRcdFx0dmFyIGhhc0FjdGlvbiA9IF90aGlzLmVsLmdldEF0dHJpYnV0ZSgnaHJlZicpICE9PSAnIyc7XG5cblx0XHRcdFx0XHRcdGlmICghaXNUb3VjaGVkICYmICFoYXNBY3Rpb24pIHtcblx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoaXNUb3VjaCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoaGFzQWN0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFpc1RvdWNoZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdC8vIEZpcnN0IHRhcCwgZW5hYmxlIGhvdmVyLCBibG9jayB0YXBcblx0XHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlzVG91Y2hlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdC8vIFNlY29uZCB0YXAsIGRvbid0IGJsb2NrIHRhcCwgZGlzYWJsZSBob3ZlclxuXHRcdFx0XHRcdFx0XHRcdFx0aXNUb3VjaGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdC8vIEFjdCBhcyBhIHNpbXBsZSBvbi9vZmYgc3dpdGNoXG5cdFx0XHRcdFx0XHRcdFx0aXNUb3VjaGVkID0gIWlzVG91Y2hlZDtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdF90aGlzLmVsLmNsYXNzTGlzdC50b2dnbGUoaG92ZXJDbGFzcywgaXNUb3VjaGVkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHRoaXMuZWwsIHsgdXNlQ2FwdHVyZTogdHJ1ZSB9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fV0pO1xuXHRyZXR1cm4gQXR0clRvdWNoSG92ZXI7XG59KCk7XG5cbnZhciBwYXJzZVJlc3BvbnNlID0gZnVuY3Rpb24gcGFyc2VSZXNwb25zZShyZXMpIHtcblx0dmFyIGRhdGEgPSBmdW5jdGlvbiBwYXJzZVJlc29uc2VUb0RhdGEoKSB7XG5cdFx0Ly8gRm9yY2UgbG93ZXJjYXNlIGtleXNcblx0XHRpZiAoKHR5cGVvZiByZXMgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHJlcykpID09PSAnb2JqZWN0Jykge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5lbnRyaWVzKHJlcykucmVkdWNlKGZ1bmN0aW9uIChvYmplY3QsIF9yZWYpIHtcblx0XHRcdFx0dmFyIF9yZWYyID0gc2xpY2VkVG9BcnJheShfcmVmLCAyKSxcblx0XHRcdFx0ICAgIGtleSA9IF9yZWYyWzBdLFxuXHRcdFx0XHQgICAgdmFsdWUgPSBfcmVmMlsxXTtcblxuXHRcdFx0XHR2YXIgbG93ZXJjYXNlS2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdFx0T2JqZWN0LmFzc2lnbihvYmplY3QsIGRlZmluZVByb3BlcnR5KHt9LCBsb3dlcmNhc2VLZXksIHZhbHVlKSk7XG5cblx0XHRcdFx0cmV0dXJuIG9iamVjdDtcblx0XHRcdH0sIHt9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzO1xuXHR9KCk7XG5cblx0dmFyIHN0YXR1cyA9IGZ1bmN0aW9uIHBhcnNlUmVzcG9uc2VUb1N0YXR1cygpIHtcblx0XHRpZiAoZGF0YS5zdGF0dXMpIHtcblx0XHRcdHJldHVybiBwYXJzZUludChkYXRhLnN0YXR1cywgMTApO1xuXHRcdH1cblxuXHRcdGlmIChwYXJzZUludChkYXRhLCAxMCkudG9TdHJpbmcoKSA9PT0gZGF0YS50b1N0cmluZygpKSB7XG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQoZGF0YSwgMTApO1xuXHRcdH1cblxuXHRcdHJldHVybiAyMDA7XG5cdH0oKTtcblxuXHRyZXR1cm4geyBzdGF0dXM6IHN0YXR1cywgZGF0YTogZGF0YSB9O1xufTtcblxudmFyIGZldGNoSlNPTlAgPSBmdW5jdGlvbiBmZXRjaEpTT05QKHVybCkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdC8vIFJlZ2lzdGVyIGEgZ2xvYmFsIGNhbGxiYWNrXG5cdFx0Ly8gTWFrZSBzdXJlIHdlIGhhdmUgYSB1bmlxdWUgZnVuY3Rpb24gbmFtZVxuXHRcdHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHR2YXIgY2FsbGJhY2sgPSAnQUpBWF9GT1JNX0NBTExCQUNLXycgKyBub3c7XG5cblx0XHR3aW5kb3dbY2FsbGJhY2tdID0gZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0Ly8gTWFrZSB0aGUgY2FsbGJhY2sgYSBub29wXG5cdFx0XHQvLyBzbyBpdCB0cmlnZ2VycyBvbmx5IG9uY2UgKGp1c3QgaW4gY2FzZSlcblx0XHRcdHdpbmRvd1tjYWxsYmFja10gPSBmdW5jdGlvbiAoKSB7fTtcblxuXHRcdFx0Ly8gQ2xlYW4gdXAgYWZ0ZXIgb3Vyc2VsdmVzXG5cdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FsbGJhY2spO1xuXHRcdFx0c2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcblxuXHRcdFx0dmFyIF9wYXJzZVJlc3BvbnNlID0gcGFyc2VSZXNwb25zZShyZXMpLFxuXHRcdFx0ICAgIHN0YXR1cyA9IF9wYXJzZVJlc3BvbnNlLnN0YXR1cyxcblx0XHRcdCAgICBkYXRhID0gX3BhcnNlUmVzcG9uc2UuZGF0YTtcblxuXHRcdFx0Ly8gSWYgcmVzIGlzIG9ubHkgYSBzdGF0dXMgY29kZVxuXG5cblx0XHRcdGlmIChzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8PSAzOTkpIHtcblx0XHRcdFx0cmV0dXJuIHJlc29sdmUoZGF0YSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZWplY3QoZGF0YSk7XG5cdFx0fTtcblxuXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRzY3JpcHQuaWQgPSBjYWxsYmFjaztcblx0XHRzY3JpcHQuc3JjID0gdXJsICsgJyZjYWxsYmFjaz0nICsgY2FsbGJhY2s7XG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXHR9KTtcbn07XG5cbnZhciBjb252ZXJ0Rm9ybURhdGFUb1F1ZXJ5c3RyaW5nID0gZnVuY3Rpb24gY29udmVydEZvcm1EYXRhVG9RdWVyeXN0cmluZyh2YWx1ZXMpIHtcblx0cmV0dXJuIEFycmF5LmZyb20odmFsdWVzLCBmdW5jdGlvbiAoX3JlZikge1xuXHRcdHZhciBfcmVmMiA9IHNsaWNlZFRvQXJyYXkoX3JlZiwgMiksXG5cdFx0ICAgIGtleSA9IF9yZWYyWzBdLFxuXHRcdCAgICByYXcgPSBfcmVmMlsxXTtcblxuXHRcdGlmIChyYXcpIHtcblx0XHRcdHZhciB2YWx1ZSA9IHdpbmRvdy5lbmNvZGVVUklDb21wb25lbnQocmF3KTtcblx0XHRcdHJldHVybiBrZXkgKyAnPScgKyB2YWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gJyc7XG5cdH0pLmpvaW4oJyYnKTtcbn07XG5cbnZhciBhamF4Rm9ybSA9IHtcblx0YXR0cmlidXRlczogW3sgYXR0cmlidXRlOiAnanNvbnAnLCB0eXBlOiAnYm9vbCcgfV0sXG5cdGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChfQmFzZUNvbnRyb2xsZXIpIHtcblx0XHRpbmhlcml0cyhjb250cm9sbGVyLCBfQmFzZUNvbnRyb2xsZXIpO1xuXG5cdFx0ZnVuY3Rpb24gY29udHJvbGxlcigpIHtcblx0XHRcdGNsYXNzQ2FsbENoZWNrKHRoaXMsIGNvbnRyb2xsZXIpO1xuXHRcdFx0cmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKGNvbnRyb2xsZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250cm9sbGVyKSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG5cdFx0fVxuXG5cdFx0Y3JlYXRlQ2xhc3MoY29udHJvbGxlciwgW3tcblx0XHRcdGtleTogJ2luaXQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzIHx8IHt9O1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRzLmZvcm0gPSB0aGlzLmVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmb3JtJylbMF07XG5cdFx0XHRcdHRoaXMuZWxlbWVudHMuc3VjY2Vzc01lc3NhZ2UgPSB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWFqYXgtZm9ybS1zdWNjZXNzJylbMF07XG5cdFx0XHRcdHRoaXMuZWxlbWVudHMuZXJyb3JNZXNzYWdlID0gdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1hamF4LWZvcm0tZXJyb3InKVswXTtcblxuXHRcdFx0XHRpZiAoIXRoaXMuZWxlbWVudHMuZm9ybSkge1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybignQWN0aXZhdGVkIE1yQWpheEZvcm0gd2l0aG91dCBhIGZvcm0nKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnRzLmZpZWxkcyA9IHRoaXMuZWxlbWVudHMuZm9ybS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3JlbmRlcicsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdFx0XHQvLyBXZSBjYW4gZGlzYWJsZSB0aGUgSFRNTDUgZnJvbnQtZW5kIHZhbGlkYXRpb25cblx0XHRcdFx0Ly8gYW5kIGhhbmRsZSBpdCBtb3JlIGdyYWNlZnVsbHkgaW4gSlNcblx0XHRcdFx0Ly8gQHRvZG9cblx0XHRcdFx0dGhpcy5lbGVtZW50cy5mb3JtLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnYmluZCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gYmluZCgpIHtcblx0XHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdFx0dmFyIHJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG5cdFx0XHRcdFx0aWYgKF90aGlzMi5lbGVtZW50cy5zdWNjZXNzTWVzc2FnZSkge1xuXHRcdFx0XHRcdFx0X3RoaXMyLmVsZW1lbnRzLnN1Y2Nlc3NNZXNzYWdlLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJ2hpZGRlbicpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChfdGhpczIuZWxlbWVudHMuZXJyb3JNZXNzYWdlKSB7XG5cdFx0XHRcdFx0XHRfdGhpczIuZWxlbWVudHMuZXJyb3JNZXNzYWdlLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJ2hpZGRlbicpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdHJlc2V0KCk7XG5cblx0XHRcdFx0XHR2YXIgX3ByZXBhcmUgPSBfdGhpczIucHJlcGFyZShfdGhpczIubWV0aG9kKSxcblx0XHRcdFx0XHQgICAgdXJsID0gX3ByZXBhcmUudXJsLFxuXHRcdFx0XHRcdCAgICBwYXJhbXMgPSBfcHJlcGFyZS5wYXJhbXM7XG5cblx0XHRcdFx0XHRfdGhpczIuc3VibWl0KHVybCwgcGFyYW1zKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRfdGhpczIub25TdWNjZXNzKGRhdGEpO1xuXHRcdFx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRcdF90aGlzMi5vbkVycm9yKGVycik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sIHRoaXMuZWxlbWVudHMuZm9ybSk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAncHJlcGFyZScsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gcHJlcGFyZShtZXRob2QpIHtcblx0XHRcdFx0dmFyIF90aGlzMyA9IHRoaXM7XG5cblx0XHRcdFx0dmFyIGdldCQkMSA9IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBjb252ZXJ0Rm9ybURhdGFUb1F1ZXJ5c3RyaW5nKF90aGlzMy52YWx1ZXMpO1xuXHRcdFx0XHRcdHZhciB1cmwgPSBfdGhpczMuYWN0aW9uICsgJz8nICsgcXVlcnlzdHJpbmc7XG5cdFx0XHRcdFx0dmFyIHBhcmFtcyA9IHtcblx0XHRcdFx0XHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0XHRcdFx0XHRoZWFkZXJzOiBuZXcgSGVhZGVycyh7XG5cdFx0XHRcdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHJldHVybiB7IHVybDogdXJsLCBwYXJhbXM6IHBhcmFtcyB9O1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciBwb3N0ID0gZnVuY3Rpb24gcG9zdCgpIHtcblx0XHRcdFx0XHR2YXIgdXJsID0gX3RoaXMzLmFjdGlvbjtcblx0XHRcdFx0XHR2YXIgcGFyYW1zID0ge1xuXHRcdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdFx0XHRoZWFkZXJzOiBuZXcgSGVhZGVycyh7XG5cdFx0XHRcdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0cmV0dXJuIHsgdXJsOiB1cmwsIHBhcmFtczogcGFyYW1zIH07XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYgKG1ldGhvZC50b1VwcGVyQ2FzZSgpID09PSAnR0VUJykge1xuXHRcdFx0XHRcdHJldHVybiBnZXQkJDEoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChtZXRob2QudG9VcHBlckNhc2UoKSA9PT0gJ1BPU1QnKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBvc3QoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB7IHVybDogJy8nLCBwYXJhbXM6IHsgbWV0aG9kOiAnR0VUJyB9IH07XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnc3VibWl0Jyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBzdWJtaXQodXJsKSB7XG5cdFx0XHRcdHZhciBwYXJhbXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG5cdFx0XHRcdGlmICh0aGlzLmpzb25wKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZldGNoSlNPTlAodXJsKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBmZXRjaCh1cmwsIHBhcmFtcykudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0aWYgKHJlcy5zdGF0dXMgJiYgcmVzLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciBlcnJvciA9IG5ldyBFcnJvcihyZXMuc3RhdHVzVGV4dCk7XG5cdFx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdHZhciB0eXBlID0gcmVzLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKTtcblxuXHRcdFx0XHRcdGlmICh0eXBlICYmIHR5cGUuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlcy5qc29uKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHJlcy50ZXh0KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcblxuXHRcdH0sIHtcblx0XHRcdGtleTogJ29uU3VjY2VzcycsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gb25TdWNjZXNzKHJlcykge1xuXHRcdFx0XHRpZiAodGhpcy5lbGVtZW50cy5zdWNjZXNzTWVzc2FnZSkge1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudHMuc3VjY2Vzc01lc3NhZ2UucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuZWxlbWVudHMuZm9ybS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudHMuZm9ybSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuXG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnb25FcnJvcicsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gb25FcnJvcihlcnIpIHtcblx0XHRcdFx0aWYgKHRoaXMuZWxlbWVudHMuZXJyb3JNZXNzYWdlKSB7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50cy5lcnJvck1lc3NhZ2UucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2FjdGlvbicsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZWxlbWVudHMuZm9ybS5hY3Rpb247XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnbWV0aG9kJyxcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHRpZiAodGhpcy5qc29ucCkge1xuXHRcdFx0XHRcdHJldHVybiAnR0VUJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAodGhpcy5lbGVtZW50cy5mb3JtLm1ldGhvZCB8fCAnUE9TVCcpLnRvVXBwZXJDYXNlKCk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAndmFsdWVzJyxcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHRyZXR1cm4gbmV3IEZvcm1EYXRhKHRoaXMuZWxlbWVudHMuZm9ybSk7XG5cdFx0XHR9XG5cdFx0fV0pO1xuXHRcdHJldHVybiBjb250cm9sbGVyO1xuXHR9KEJhc2VDb250cm9sbGVyKVxufTtcblxudmFyIGtleVRyaWdnZXIgPSB7XG5cdGF0dHJpYnV0ZXM6IFt7IGF0dHJpYnV0ZTogJ2tleScsIHR5cGU6ICdpbnQnIH1dLFxuXHRjb250cm9sbGVyOiBmdW5jdGlvbiAoX0Jhc2VDb250cm9sbGVyKSB7XG5cdFx0aW5oZXJpdHMoY29udHJvbGxlciwgX0Jhc2VDb250cm9sbGVyKTtcblxuXHRcdGZ1bmN0aW9uIGNvbnRyb2xsZXIoKSB7XG5cdFx0XHRjbGFzc0NhbGxDaGVjayh0aGlzLCBjb250cm9sbGVyKTtcblx0XHRcdHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChjb250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udHJvbGxlcikpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuXHRcdH1cblxuXHRcdGNyZWF0ZUNsYXNzKGNvbnRyb2xsZXIsIFt7XG5cdFx0XHRrZXk6ICdpbml0Jyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRzID0gdGhpcy5lbGVtZW50cyB8fCB7fTtcblxuXHRcdFx0XHRpZiAodGhpcy5lbC5oYXNBdHRyaWJ1dGUoJ2hyZWYnKSkge1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudHMudGFyZ2V0ID0gdGhpcztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnRzLnRhcmdldCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignW2hyZWZdJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdiaW5kJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBiaW5kKCkge1xuXHRcdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0XHRpZiAodGhpcy5lbGVtZW50cy50YXJnZXQpIHtcblx0XHRcdFx0XHR0aGlzLm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZiAoZS53aGljaCA9PT0gX3RoaXMyLmtleSkge1xuXHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0XHRcdFx0X3RoaXMyLmVsZW1lbnRzLnRhcmdldC5jbGljaygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIGRvY3VtZW50LmJvZHkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fV0pO1xuXHRcdHJldHVybiBjb250cm9sbGVyO1xuXHR9KEJhc2VDb250cm9sbGVyKVxufTtcblxudmFyIHBhcnNlTWV0YVRhZyA9IGZ1bmN0aW9uIHBhcnNlTWV0YVRhZygpIHtcblx0dmFyIGJsYWNrbGlzdCA9IFsndmlld3BvcnQnXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gcGFyc2UodGFnKSB7XG5cdFx0dmFyIG5hbWUgPSB0YWcuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0dmFyIHByb3BlcnR5ID0gdGFnLmdldEF0dHJpYnV0ZSgncHJvcGVydHknKTtcblx0XHR2YXIgY29udGVudCA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnKTtcblxuXHRcdGlmICghbmFtZSAmJiAhcHJvcGVydHkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAoYmxhY2tsaXN0LmluY2x1ZGVzKG5hbWUpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHsgbmFtZTogbmFtZSwgcHJvcGVydHk6IHByb3BlcnR5LCBjb250ZW50OiBjb250ZW50IH07XG5cdH07XG59KCk7XG5cbnZhciBwYXJzZUhUTUwgPSBmdW5jdGlvbiBwYXJzZUhUTUwoKSB7XG5cdHZhciBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHBhcnNlKGh0bWwpIHtcblx0XHR2YXIgc2VsZWN0b3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG5cblx0XHR2YXIgcGFyc2VkID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sLCAndGV4dC9odG1sJyk7XG5cblx0XHQvLyBHZXQgZG9jdW1lbnQgdGl0bGVcblx0XHR2YXIgdGl0bGUgPSBwYXJzZWQudGl0bGU7XG5cblx0XHQvLyBHZXQgZG9jdW1lbnQgbm9kZXNcblx0XHR2YXIgY29udGVudCA9IHBhcnNlZC5ib2R5O1xuXG5cdFx0aWYgKHNlbGVjdG9yKSB7XG5cdFx0XHRjb250ZW50ID0gcGFyc2VkLmJvZHkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cblx0XHRcdGlmICghY29udGVudCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vdC1mb3VuZCcpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEdldCBkb2N1bWVudCBtZXRhXG5cdFx0dmFyIG1ldGEgPSBBcnJheS5mcm9tKHBhcnNlZC5oZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoJ21ldGEnKSwgZnVuY3Rpb24gKHRhZykge1xuXHRcdFx0cmV0dXJuIHBhcnNlTWV0YVRhZyh0YWcpO1xuXHRcdH0pLmZpbHRlcihmdW5jdGlvbiAodCkge1xuXHRcdFx0cmV0dXJuICEhdDtcblx0XHR9KTtcblxuXHRcdHJldHVybiB7IHRpdGxlOiB0aXRsZSwgY29udGVudDogY29udGVudCwgbWV0YTogbWV0YSB9O1xuXHR9O1xufSgpO1xuXG5mdW5jdGlvbiByZW5kZXJOb2Rlcyhjb250ZW50LCBjb250YWluZXIpIHtcblx0d2hpbGUgKGNvbnRhaW5lci5oYXNDaGlsZE5vZGVzKCkpIHtcblx0XHRjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuXHR9XG5cblx0Zm9yICh2YXIgaSA9IGNvbnRlbnQuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcblx0XHR2YXIgY2hpbGQgPSBjb250ZW50LmNoaWxkcmVuW2ldO1xuXG5cdFx0QXJyYXkuZnJvbShjb250ZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWcnKSwgZnVuY3Rpb24gKGltZykge1xuXHRcdFx0dmFyIGNsb25lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cdFx0XHRjbG9uZS5zcmMgPSBpbWcuc3JjO1xuXHRcdFx0Y2xvbmUuc2l6ZXMgPSBpbWcuc2l6ZXM7XG5cdFx0XHRjbG9uZS5zcmNzZXQgPSBpbWcuc3Jjc2V0O1xuXHRcdFx0Y2xvbmUuY2xhc3NOYW1lID0gaW1nLmNsYXNzTmFtZTtcblxuXHRcdFx0aWYgKGltZy5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpIHtcblx0XHRcdFx0Y2xvbmUud2lkdGggPSBpbWcud2lkdGg7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpbWcuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSkge1xuXHRcdFx0XHRjbG9uZS5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xuXHRcdFx0fVxuXG5cdFx0XHRpbWcucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY2xvbmUsIGltZyk7XG5cblx0XHRcdHJldHVybiBjbG9uZTtcblx0XHR9KTtcblxuXHRcdGlmIChjb250YWluZXIuZmlyc3RDaGlsZCkge1xuXHRcdFx0Y29udGFpbmVyLmluc2VydEJlZm9yZShjaGlsZCwgY29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBjbGVhbk5vZGVzKG5vZGVzLCBzZWxlY3Rvcikge1xuXHRpZiAoIXNlbGVjdG9yIHx8IEFycmF5LmlzQXJyYXkoc2VsZWN0b3IpICYmIHNlbGVjdG9yLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybiBub2Rlcztcblx0fVxuXG5cdHZhciBzdHJpbmdTZWxlY3RvciA9IEFycmF5LmlzQXJyYXkoc2VsZWN0b3IpID8gc2VsZWN0b3Iuam9pbignLCAnKSA6IHNlbGVjdG9yO1xuXG5cdHZhciBibG9hdCA9IEFycmF5LmZyb20obm9kZXMucXVlcnlTZWxlY3RvckFsbChzdHJpbmdTZWxlY3RvcikpO1xuXG5cdGJsb2F0LmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRyZXR1cm4gbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuXHR9KTtcblxuXHRyZXR1cm4gbm9kZXM7XG59XG5cbnZhciBvdmVybGF5ID0ge1xuXHRhdHRyaWJ1dGVzOiBbXSxcblx0Y29udHJvbGxlcjogZnVuY3Rpb24gKF9CYXNlQ29udHJvbGxlcikge1xuXHRcdGluaGVyaXRzKGNvbnRyb2xsZXIsIF9CYXNlQ29udHJvbGxlcik7XG5cblx0XHRmdW5jdGlvbiBjb250cm9sbGVyKCkge1xuXHRcdFx0Y2xhc3NDYWxsQ2hlY2sodGhpcywgY29udHJvbGxlcik7XG5cdFx0XHRyZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoY29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRyb2xsZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcblx0XHR9XG5cblx0XHRjcmVhdGVDbGFzcyhjb250cm9sbGVyLCBbe1xuXHRcdFx0a2V5OiAnaW5pdCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdFx0Ly8gU3RvcmUgdGhlIG9yaWdpbmFsIGNsYXNzZXMgc28gd2UgY2FuIGFsd2F5cyByZXZlcnQgYmFjayB0byB0aGUgZGVmYXVsdCBzdGF0ZVxuXHRcdFx0XHQvLyB3aGlsZSByZW5kZXJpbmcgaW4gZGlmZmVyZW50IGFzcGVjdHNcblx0XHRcdFx0dGhpcy5vcmlnaW5hbENsYXNzZXMgPSBBcnJheS5mcm9tKHRoaXMuZWwuY2xhc3NMaXN0KTtcblxuXHRcdFx0XHR0aGlzLnN0cmlwRnJvbVJlc3BvbnNlID0gWydsaW5rW3JlbD1cInVwXCJdJywgdGhpcy5lbC50YWdOYW1lXTtcblx0XHRcdH1cblxuXHRcdFx0LyoqXG4gICAgKiBUaGlzIG1ldGhvZCBnZXRzIHJ1biB3aGVuIGEgYDxtci1vdmVybGF5PmBcbiAgICAqIGFwcGVhcnMgaW4gdGhlIERPTSwgZWl0aGVyIGFmdGVyIERPTSByZWFkeVxuICAgICogb3Igd2hlbiBIVE1MIGdldHMgYXR0YWNoZWQgbGF0ZXIgb24gaW4gdGhlIGJyb3dzaW5nIHNlc3Npb25cbiAgICAqL1xuXG5cdFx0fSwge1xuXHRcdFx0a2V5OiAncmVuZGVyJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHRcdC8vIFN0b3JlIHRoZSBvcmlnaW5hbCBjbGFzc2VzIHNvIHdlIGNhbiBhbHdheXMgcmV2ZXJ0IGJhY2sgdG8gdGhlIGRlZmF1bHQgc3RhdGVcblx0XHRcdFx0Ly8gd2hpbGUgcmVuZGVyaW5nIGluIGRpZmZlcmVudCBhc3BlY3RzXG5cdFx0XHRcdHRoaXMub3JpZ2luYWxDbGFzc2VzID0gQXJyYXkuZnJvbSh0aGlzLmVsLmNsYXNzTGlzdCk7XG5cblx0XHRcdFx0Ly8gQWRkIDxsaW5rIHJlbD1cInVwXCIgaHJlZj1cIi9cIj4gaW5zaWRlIGFuIG92ZXJsYXkgdG8gZmV0Y2ggYSBiYWNrZ3JvdW5kIHZpZXdcblx0XHRcdFx0dmFyIHVwTGluayA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignbGlua1tyZWw9XCJ1cFwiXScpO1xuXG5cdFx0XHRcdGlmICh1cExpbmspIHtcblx0XHRcdFx0XHR2YXIgaHJlZiA9IHVwTGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblxuXHRcdFx0XHRcdGZldGNoKGhyZWYsIHsgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyB9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiByZXMudGV4dCgpO1xuXHRcdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcblx0XHRcdFx0XHRcdHZhciBfcGFyc2VIVE1MID0gcGFyc2VIVE1MKGh0bWwpLFxuXHRcdFx0XHRcdFx0ICAgIHRpdGxlID0gX3BhcnNlSFRNTC50aXRsZSxcblx0XHRcdFx0XHRcdCAgICBjb250ZW50ID0gX3BhcnNlSFRNTC5jb250ZW50O1xuXG5cdFx0XHRcdFx0XHRpZiAoY29udGVudCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoY29udGVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShfdGhpczIuZWwudGFnTmFtZSlbMF0pIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgY2xhc3NMaXN0ID0gY29udGVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShfdGhpczIuZWwudGFnTmFtZSlbMF0uY2xhc3NMaXN0O1xuXHRcdFx0XHRcdFx0XHRcdF90aGlzMi5vcmlnaW5hbENsYXNzZXMgPSBBcnJheS5mcm9tKGNsYXNzTGlzdCk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQ2xlYW4gY2VydGFpbiBzZWxlY3RvcnMgZnJvbSB0aGUgdXAgc3RhdGUgdG8gYXZvaWQgaW5maW5pdGUgbG9vcHNcblx0XHRcdFx0XHRcdFx0dmFyIGNsZWFuID0gY2xlYW5Ob2Rlcyhjb250ZW50LCBfdGhpczIuc3RyaXBGcm9tUmVzcG9uc2UpO1xuXG5cdFx0XHRcdFx0XHRcdHJlbmRlck5vZGVzKGNsZWFuLCBmcmFnbWVudCk7XG5cblx0XHRcdFx0XHRcdFx0X3RoaXMyLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZyYWdtZW50LCBfdGhpczIuZWwpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFRoZSB1cFN0YXRlIGlzIG5vdCB0aGUgb3ZlcmxheSB2aWV3IGJ1dCB0aGUgYmFja2dyb3VuZCB2aWV3XG5cdFx0XHRcdFx0XHRcdF90aGlzMi51cFN0YXRlID0ge1xuXHRcdFx0XHRcdFx0XHRcdGhyZWY6IGhyZWYsXG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU6IHRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdHJvb3Q6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0Ynk6IF90aGlzMi5lbC50YWdOYW1lXG5cdFx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdFx0Ly8gV2UgbmVlZCB0byByZXBsYWNlIHRoZSBjdXJyZW50IHN0YXRlIHRvIGhhbmRsZSBgcG9wc3RhdGVgXG5cdFx0XHRcdFx0XHRcdHZhciBzdGF0ZSA9IHtcblx0XHRcdFx0XHRcdFx0XHRocmVmOiB3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogZG9jdW1lbnQudGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0cm9vdDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0Ynk6IF90aGlzMi5lbC50YWdOYW1lXG5cdFx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdFx0d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHN0YXRlLCBzdGF0ZS50aXRsZSwgc3RhdGUuaHJlZik7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU2V0IGlzU2hvd24gc28gdGhhdCB0aGUgY2xvc2luZyBoYW5kbGVyIHdvcmtzIGNvcnJlY3RseVxuXHRcdFx0XHRcdFx0XHRfdGhpczIuaXNTaG93biA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQ3VycmVudGx5IG5vdCBpbnNpZGUgYW4gb3ZlcmxheSB2aWV3LCBidXQgYW4gb3ZlcmxheSBtaWdodCBvcGVuXG5cdFx0XHRcdFx0Ly8gKGJlY2F1c2UgYW4gZW1wdHkgPG1yLW92ZXJsYXk+IGlzIHByZXNlbnQpXG5cdFx0XHRcdFx0Ly8gc28gd2Ugc3RvcmUgdGhlIGN1cnJlbnQgc3RhdGUgdG8gc3VwcG9ydCBgcG9wc3RhdGVgIGV2ZW50c1xuXHRcdFx0XHRcdHZhciB0aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xuXHRcdFx0XHRcdHZhciBfaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXG5cdFx0XHRcdFx0dGhpcy51cFN0YXRlID0ge1xuXHRcdFx0XHRcdFx0aHJlZjogX2hyZWYsXG5cdFx0XHRcdFx0XHR0aXRsZTogdGl0bGUsXG5cdFx0XHRcdFx0XHRyb290OiB0cnVlLFxuXHRcdFx0XHRcdFx0Ynk6IHRoaXMuZWwudGFnTmFtZVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUodGhpcy51cFN0YXRlLCB0aXRsZSwgX2hyZWYpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnYmluZCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gYmluZCgpIHtcblx0XHRcdFx0dmFyIF90aGlzMyA9IHRoaXM7XG5cblx0XHRcdFx0dmFyIGhpZGVIYW5kbGVyID0gZnVuY3Rpb24gaGlkZUhhbmRsZXIoZSkge1xuXHRcdFx0XHRcdGlmIChfdGhpczMuaXNTaG93bikge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHRfdGhpczMuaGlkZSgpO1xuXG5cdFx0XHRcdFx0XHRpZiAoX3RoaXMzLnVwU3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0dmFyIF91cFN0YXRlID0gX3RoaXMzLnVwU3RhdGUsXG5cdFx0XHRcdFx0XHRcdCAgICB0aXRsZSA9IF91cFN0YXRlLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHQgICAgaHJlZiA9IF91cFN0YXRlLmhyZWY7XG5cblxuXHRcdFx0XHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoX3RoaXMzLnVwU3RhdGUsIHRpdGxlLCBocmVmKTtcblx0XHRcdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlmIChlLnRhcmdldCA9PT0gX3RoaXMzLmVsKSB7XG5cdFx0XHRcdFx0XHRoaWRlSGFuZGxlcihlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHRoaXMuZWwpO1xuXG5cdFx0XHRcdHRoaXMub24oJ2NsaWNrIC5qcy1vdmVybGF5LXNob3cnLCBmdW5jdGlvbiAoZSwgdGFyZ2V0KSB7XG5cdFx0XHRcdFx0dmFyIGhyZWYgPSB0YXJnZXQuaHJlZjtcblxuXHRcdFx0XHRcdGlmIChocmVmKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRfdGhpczMuc2hvdyhocmVmKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGRvY3VtZW50LmJvZHkpO1xuXG5cdFx0XHRcdHRoaXMub24oJ2NsaWNrIC5qcy1vdmVybGF5LWhpZGUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGhpZGVIYW5kbGVyKGUpO1xuXHRcdFx0XHR9LCBkb2N1bWVudC5ib2R5KTtcblxuXHRcdFx0XHR0aGlzLm9uKCdwb3BzdGF0ZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0Ly8gT25seSBoYW5kbGUgc3RhdGVzIHRoYXQgd2VyZSBzZXQgYnkgYG1yLW92ZXJsYXlgXG5cdFx0XHRcdFx0Ly8gdG8gYXZvaWQgbWVzc2luZyB3aXRoIG90aGVyIGVsZW1lbnRzIHRoYXQgdXNlIHRoZSBIaXN0b3J5IEFQSVxuXHRcdFx0XHRcdGlmIChlLnN0YXRlICYmIGUuc3RhdGUuYnkgPT09IF90aGlzMy5lbC50YWdOYW1lICYmIGUuc3RhdGUuaHJlZikge1xuXHRcdFx0XHRcdFx0dmFyIF9lJHN0YXRlID0gZS5zdGF0ZSxcblx0XHRcdFx0XHRcdCAgICBocmVmID0gX2Ukc3RhdGUuaHJlZixcblx0XHRcdFx0XHRcdCAgICB0aXRsZSA9IF9lJHN0YXRlLnRpdGxlO1xuXHRcdFx0XHRcdFx0dmFyIF91cFN0YXRlMiA9IF90aGlzMy51cFN0YXRlLFxuXHRcdFx0XHRcdFx0ICAgIHVwSHJlZiA9IF91cFN0YXRlMi5ocmVmLFxuXHRcdFx0XHRcdFx0ICAgIHVwVGl0bGUgPSBfdXBTdGF0ZTIudGl0bGU7XG5cblx0XHRcdFx0XHRcdHZhciBoYXNSZXF1ZXN0ZWRVcFN0YXRlID0gaHJlZiA9PT0gdXBIcmVmICYmIHRpdGxlID09PSB1cFRpdGxlO1xuXG5cdFx0XHRcdFx0XHRpZiAoZS5zdGF0ZS5yb290ICYmIGhhc1JlcXVlc3RlZFVwU3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0Ly8gVHJpZ2dlciBoaWRlKCkgaWYgdGhlIHBvcHN0YXRlIHJlcXVlc3RzIHRoZSByb290IHZpZXdcblx0XHRcdFx0XHRcdFx0X3RoaXMzLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSBfdGhpczMudXBTdGF0ZS50aXRsZTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdC8vIFNob3cgdGhlIG92ZXJsYXkoKSBpZiB3ZSBjbG9zZWQgdGhlIG92ZXJsYXkgYmVmb3JlXG5cdFx0XHRcdFx0XHRcdF90aGlzMy5zaG93KGUuc3RhdGUuaHJlZiwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgd2luZG93KTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdzaG93Jyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBzaG93KGhyZWYpIHtcblx0XHRcdFx0dmFyIF90aGlzNCA9IHRoaXM7XG5cblx0XHRcdFx0dmFyIHB1c2hTdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdHJ1ZTtcblxuXHRcdFx0XHR2YXIgdXBkYXRlTWV0YVRhZ3MgPSBmdW5jdGlvbiB1cGRhdGVNZXRhVGFncyh0YWdzKSB7XG5cdFx0XHRcdFx0dGFncy5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcblx0XHRcdFx0XHRcdHZhciBzZWxlY3RvciA9ICdtZXRhJztcblxuXHRcdFx0XHRcdFx0aWYgKHRhZy5wcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IHNlbGVjdG9yICsgJ1twcm9wZXJ0eT1cIicgKyB0YWcucHJvcGVydHkgKyAnXCJdJztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHRhZy5uYW1lKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3IgKyAnW25hbWU9XCInICsgdGFnLm5hbWUgKyAnXCJdJztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIG1hdGNoID0gZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblxuXHRcdFx0XHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdFx0XHRcdG1hdGNoLnNldEF0dHJpYnV0ZSgnY29udGVudCcsIHRhZy5jb250ZW50KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHZhciBhcHBlbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJyk7XG5cdFx0XHRcdFx0XHRcdGFwcGVuZC5wcm9wZXJ0eSA9IHRhZy5wcm9wZXJ0eTtcblx0XHRcdFx0XHRcdFx0YXBwZW5kLmNvbnRlbnQgPSB0YWcuY29udGVudDtcblx0XHRcdFx0XHRcdFx0YXBwZW5kLm5hbWUgPSB0YWcubmFtZTtcblx0XHRcdFx0XHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChhcHBlbmQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciByZW5kZXJDb250ZW50ID0gZnVuY3Rpb24gcmVuZGVyQ29udGVudChjb250ZW50KSB7XG5cdFx0XHRcdFx0dmFyIG5ld0NsYXNzZXMgPSBBcnJheS5mcm9tKGNvbnRlbnQuY2xhc3NMaXN0KTtcblx0XHRcdFx0XHRfdGhpczQuZWwuY2xhc3NOYW1lID0gJyc7XG5cdFx0XHRcdFx0Ly8gVGhpcyBjcmFzaGVzIGluIElFMTFcblx0XHRcdFx0XHQvLyB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoLi4ubmV3Q2xhc3Nlcyk7XG5cdFx0XHRcdFx0bmV3Q2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gX3RoaXM0LmVsLmNsYXNzTGlzdC5hZGQoYyk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRfdGhpczQuaXNTaG93biA9IHRydWU7XG5cblx0XHRcdFx0XHQvLyBDbGVhbiBjZXJ0YWluIHNlbGVjdG9ycyBmcm9tIHRoZSB1cCBzdGF0ZSB0byBhdm9pZCBpbmZpbml0ZSBsb29wc1xuXHRcdFx0XHRcdHZhciBjbGVhbiA9IGNsZWFuTm9kZXMoY29udGVudCwgX3RoaXM0LnN0cmlwRnJvbVJlc3BvbnNlKTtcblxuXHRcdFx0XHRcdHJlbmRlck5vZGVzKGNsZWFuLCBfdGhpczQuZWwpO1xuXG5cdFx0XHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRfdGhpczQuZWwuc2Nyb2xsVG9wID0gMDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgdXBkYXRlVGl0bGUgPSBmdW5jdGlvbiB1cGRhdGVUaXRsZSh0aXRsZSkge1xuXHRcdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmV0dXJuIGZldGNoKGhyZWYsIHsgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyB9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzLnRleHQoKTtcblx0XHRcdFx0fSkudGhlbihmdW5jdGlvbiAoaHRtbCkge1xuXHRcdFx0XHRcdHZhciBfcGFyc2VIVE1MMiA9IHBhcnNlSFRNTChodG1sLCBfdGhpczQuZWwudGFnTmFtZSksXG5cdFx0XHRcdFx0ICAgIHRpdGxlID0gX3BhcnNlSFRNTDIudGl0bGUsXG5cdFx0XHRcdFx0ICAgIGNvbnRlbnQgPSBfcGFyc2VIVE1MMi5jb250ZW50LFxuXHRcdFx0XHRcdCAgICBtZXRhID0gX3BhcnNlSFRNTDIubWV0YTtcblxuXHRcdFx0XHRcdHVwZGF0ZU1ldGFUYWdzKG1ldGEpO1xuXG5cdFx0XHRcdFx0aWYgKGNvbnRlbnQpIHtcblx0XHRcdFx0XHRcdHJlbmRlckNvbnRlbnQoY29udGVudCk7XG5cdFx0XHRcdFx0XHR1cGRhdGVUaXRsZSh0aXRsZSk7XG5cblx0XHRcdFx0XHRcdGlmIChwdXNoU3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHN0YXRlID0geyBocmVmOiBocmVmLCB0aXRsZTogdGl0bGUsIGJ5OiBfdGhpczQuZWwudGFnTmFtZSB9O1xuXHRcdFx0XHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUsIHRpdGxlLCBocmVmKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2hpZGUnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGhpZGUoKSB7XG5cdFx0XHRcdHZhciBfdGhpczUgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMuaXNTaG93biA9IGZhbHNlO1xuXG5cdFx0XHRcdHdoaWxlICh0aGlzLmVsLmhhc0NoaWxkTm9kZXMoKSkge1xuXHRcdFx0XHRcdHRoaXMuZWwucmVtb3ZlQ2hpbGQodGhpcy5lbC5maXJzdENoaWxkKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGlzLm9yaWdpbmFsQ2xhc3NlcyAmJiBBcnJheS5pc0FycmF5KHRoaXMub3JpZ2luYWxDbGFzc2VzKSkge1xuXHRcdFx0XHRcdHRoaXMuZWwuY2xhc3NOYW1lID0gJyc7XG5cblx0XHRcdFx0XHQvLyBUaGlzIGNyYXNoZXMgaW4gSUUxMVxuXHRcdFx0XHRcdC8vIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi50aGlzLm9yaWdpbmFsQ2xhc3Nlcyk7XG5cdFx0XHRcdFx0dGhpcy5vcmlnaW5hbENsYXNzZXMuZm9yRWFjaChmdW5jdGlvbiAoYykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIF90aGlzNS5lbC5jbGFzc0xpc3QuYWRkKGMpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnaXNTaG93bicsXG5cblx0XHRcdC8qKlxuICAgICogYGlzU2hvd25gIGlzIGEgYm9vbGVhbiB0aGF0IHRyYWNrc1xuICAgICogaWYgdGhlIG92ZXJsYXkgaXMgY3VycmVudGx5IG9wZW4gb3Igbm90XG4gICAgKiAqL1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdHJldHVybiAhIXRoaXMuX2lzU2hvd247XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiBmdW5jdGlvbiBzZXQkJDEodG8pIHtcblx0XHRcdFx0dGhpcy5faXNTaG93biA9ICEhdG87XG5cdFx0XHRcdHRoaXMuZWwuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtaGlkZGVuJywgIXRoaXMuX2lzU2hvd24pO1xuXHRcdFx0XHR0aGlzLmVsLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNob3duJywgdGhpcy5faXNTaG93bik7XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2hvd2luZy1vdmVybGF5JywgdGhpcy5faXNTaG93bik7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuICAgICogT3JpZ2luYWwgc3RhdGUgaXMgdGhlIEhpc3RvcnkgQVBJIHN0YXRlIGZvciB0aGUgcGFyZW50IHBhZ2VcbiAgICAqICh0aGUgcGFnZSBiZWxvdyB0aGUgb3ZlcmxheSlcbiAgICAqIChub3QgbmVjY2VzYXJpbHkgdGhlIGZpcnN0IHBhZ2UgdGhhdCB3YXMgbG9hZGVkKVxuICAgICogKi9cblxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3VwU3RhdGUnLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl91cFN0YXRlKTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uIHNldCQkMSh0bykge1xuXHRcdFx0XHR0aGlzLl91cFN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdG8pO1xuXHRcdFx0fVxuXHRcdH1dKTtcblx0XHRyZXR1cm4gY29udHJvbGxlcjtcblx0fShCYXNlQ29udHJvbGxlcilcbn07XG5cbnZhciBnZXRNZXRhVmFsdWVzID0gZnVuY3Rpb24gZ2V0TWV0YVZhbHVlcygpIHtcblx0dmFyIG5vZGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGRvY3VtZW50LmhlYWQ7XG5cdHZhciBzZWxlY3RvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJyc7XG5cblx0dmFyIGV4dHJhY3RLZXkgPSBmdW5jdGlvbiBleHRyYWN0S2V5KHRhZykge1xuXHRcdHZhciByYXcgPSB0YWcuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cblx0XHRpZiAoIXJhdykge1xuXHRcdFx0cmF3ID0gdGFnLmdldEF0dHJpYnV0ZSgncHJvcGVydHknKTtcblx0XHR9XG5cblx0XHR2YXIgc3RyaXBwZWQgPSByYXcubWF0Y2goL14oPzouKjopPyguKikkL2kpO1xuXG5cdFx0aWYgKHN0cmlwcGVkKSB7XG5cdFx0XHRyZXR1cm4gc3RyaXBwZWRbMV07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH07XG5cblx0dmFyIHRhZ3MgPSBbXS5jb25jYXQodG9Db25zdW1hYmxlQXJyYXkobm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdtZXRhJyArIHNlbGVjdG9yKSkpO1xuXG5cdC8vIEdldCA8bWV0YT4gdmFsdWVzXG5cdHJldHVybiB0YWdzLnJlZHVjZShmdW5jdGlvbiAoY2FycnksIHRhZykge1xuXHRcdHZhciBrZXkgPSBleHRyYWN0S2V5KHRhZyk7XG5cblx0XHRpZiAoa2V5KSB7XG5cdFx0XHR2YXIgdmFsdWUgPSB0YWcuZ2V0QXR0cmlidXRlKCdjb250ZW50Jyk7XG5cdFx0XHRPYmplY3QuYXNzaWduKGNhcnJ5LCBkZWZpbmVQcm9wZXJ0eSh7fSwga2V5LCB2YWx1ZSkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjYXJyeTtcblx0fSwge30pO1xufTtcblxudmFyIGdlbmVyYXRlUXVlcnlzdHJpbmcgPSBmdW5jdGlvbiBnZW5lcmF0ZVF1ZXJ5c3RyaW5nKHBhcmFtcykge1xuXHR2YXIgcXVlcnlzdHJpbmcgPSBPYmplY3QuZW50cmllcyhwYXJhbXMpLm1hcChmdW5jdGlvbiAoX3JlZikge1xuXHRcdHZhciBfcmVmMiA9IHNsaWNlZFRvQXJyYXkoX3JlZiwgMiksXG5cdFx0ICAgIGtleSA9IF9yZWYyWzBdLFxuXHRcdCAgICB2YWx1ZSA9IF9yZWYyWzFdO1xuXG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHR2YXIgZW5jb2RlZCA9IHdpbmRvdy5lbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuXHRcdFx0cmV0dXJuIGtleSArICc9JyArIGVuY29kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICcnO1xuXHR9KS5maWx0ZXIoZnVuY3Rpb24gKHBhcmFtKSB7XG5cdFx0cmV0dXJuICEhcGFyYW07XG5cdH0pLmpvaW4oJyYnKTtcblxuXHRpZiAocXVlcnlzdHJpbmcubGVuZ3RoID4gMCkge1xuXHRcdHJldHVybiAnPycgKyBxdWVyeXN0cmluZztcblx0fVxuXG5cdHJldHVybiAnJztcbn07XG5cbnZhciBvcGVuV2luZG93ID0gZnVuY3Rpb24gb3BlbldpbmRvdyhocmVmKSB7XG5cdHZhciBwYXJhbXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cblx0dmFyIHF1ZXJ5c3RyaW5nID0gZ2VuZXJhdGVRdWVyeXN0cmluZyhwYXJhbXMpO1xuXHR2YXIgbmFtZSA9IG9wdGlvbnMubmFtZSxcblx0ICAgIGludmlzaWJsZSA9IG9wdGlvbnMuaW52aXNpYmxlO1xuXG5cblx0aWYgKGludmlzaWJsZSkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbiA9ICcnICsgaHJlZiArIHF1ZXJ5c3RyaW5nO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciB3aWR0aCA9IG9wdGlvbnMud2lkdGgsXG5cdCAgICBoZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcblxuXG5cdHdpZHRoID0gd2lkdGggfHwgNTYwO1xuXHRoZWlnaHQgPSBoZWlnaHQgfHwgNDIwO1xuXG5cdHZhciB4ID0gTWF0aC5yb3VuZCgod2luZG93LmlubmVyV2lkdGggLSB3aWR0aCkgLyAyKTtcblx0dmFyIHkgPSBNYXRoLnJvdW5kKCh3aW5kb3cuaW5uZXJIZWlnaHQgLSBoZWlnaHQpIC8gMik7XG5cblx0dmFyIHBvcHVwID0gd2luZG93Lm9wZW4oJycgKyBocmVmICsgcXVlcnlzdHJpbmcsIG5hbWUsICd3aWR0aD0nICsgd2lkdGggKyAnLCBoZWlnaHQ9JyArIGhlaWdodCArICcsIGxlZnQ9JyArIHggKyAnLCB0b3A9JyArIHkpO1xuXG5cdGlmICh0eXBlb2YgcG9wdXAuZm9jdXMgPT09ICdmdW5jdGlvbicpIHtcblx0XHRwb3B1cC5mb2N1cygpO1xuXHR9XG59O1xuXG52YXIgc2hhcmUgPSB7XG5cdGF0dHJpYnV0ZXM6IFtdLFxuXHRjb250cm9sbGVyOiBmdW5jdGlvbiAoX0Jhc2VDb250cm9sbGVyKSB7XG5cdFx0aW5oZXJpdHMoY29udHJvbGxlciwgX0Jhc2VDb250cm9sbGVyKTtcblxuXHRcdGZ1bmN0aW9uIGNvbnRyb2xsZXIoKSB7XG5cdFx0XHRjbGFzc0NhbGxDaGVjayh0aGlzLCBjb250cm9sbGVyKTtcblx0XHRcdHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChjb250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udHJvbGxlcikpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuXHRcdH1cblxuXHRcdGNyZWF0ZUNsYXNzKGNvbnRyb2xsZXIsIFt7XG5cdFx0XHRrZXk6ICdpbml0Jyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRzID0ge307XG5cblx0XHRcdFx0dGhpcy5lbGVtZW50cy5mYWNlYm9vayA9IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtc2hhcmUtZmFjZWJvb2snKVswXTtcblx0XHRcdFx0dGhpcy5lbGVtZW50cy50d2l0dGVyID0gdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1zaGFyZS10d2l0dGVyJylbMF07XG5cdFx0XHRcdHRoaXMuZWxlbWVudHMucGludGVyZXN0ID0gdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1zaGFyZS1waW50ZXJlc3QnKVswXTtcblx0XHRcdFx0dGhpcy5lbGVtZW50cy5tYWlsID0gdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1zaGFyZS1tYWlsJylbMF07XG5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnYmluZCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gYmluZCgpIHtcblx0XHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdFx0aWYgKHRoaXMuZWxlbWVudHMuZmFjZWJvb2spIHtcblx0XHRcdFx0XHR0aGlzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0X3RoaXMyLnNoYXJlT25GYWNlYm9vaygpO1xuXHRcdFx0XHRcdH0sIHRoaXMuZWxlbWVudHMuZmFjZWJvb2spO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuZWxlbWVudHMudHdpdHRlcikge1xuXHRcdFx0XHRcdHRoaXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRfdGhpczIuc2hhcmVPblR3aXR0ZXIoKTtcblx0XHRcdFx0XHR9LCB0aGlzLmVsZW1lbnRzLnR3aXR0ZXIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuZWxlbWVudHMucGludGVyZXN0KSB7XG5cdFx0XHRcdFx0dGhpcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdF90aGlzMi5zaGFyZU9uUGludGVyZXN0KCk7XG5cdFx0XHRcdFx0fSwgdGhpcy5lbGVtZW50cy5waW50ZXJlc3QpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuZWxlbWVudHMubWFpbCkge1xuXHRcdFx0XHRcdHRoaXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRfdGhpczIuc2hhcmVWaWFNYWlsKCk7XG5cdFx0XHRcdFx0fSwgdGhpcy5lbGVtZW50cy5tYWlsKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3NoYXJlT25GYWNlYm9vaycsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gc2hhcmVPbkZhY2Vib29rKCkge1xuXHRcdFx0XHR2YXIgdmFsdWVzID0gZ2V0TWV0YVZhbHVlcyhkb2N1bWVudC5oZWFkLCAnW3Byb3BlcnR5Xj1cIm9nOlwiXScpO1xuXG5cdFx0XHRcdHZhciBwYXJhbXMgPSB7XG5cdFx0XHRcdFx0dTogdmFsdWVzLnVybCB8fCB0aGlzLnVybCxcblx0XHRcdFx0XHR0aXRsZTogdmFsdWVzLnRpdGxlIHx8IHRoaXMudGl0bGUsXG5cdFx0XHRcdFx0Y2FwdGlvbjogdmFsdWVzLnNpdGVfbmFtZSxcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogdmFsdWVzLmRlc2NyaXB0aW9uIHx8IHRoaXMuZGVzY3JpcHRpb25cblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2YXIgaXNBYnNvbHV0ZVVybCA9IC9eKGh0dHBzPzopP1xcL1xcLy9pO1xuXG5cdFx0XHRcdGlmIChpc0Fic29sdXRlVXJsLnRlc3QodmFsdWVzLmltYWdlKSkge1xuXHRcdFx0XHRcdHBhcmFtcy5waWN0dXJlID0gdmFsdWVzLmltYWdlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0b3BlbldpbmRvdygnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci5waHAnLCBwYXJhbXMsIHsgbmFtZTogJ1NoYXJlIG9uIEZhY2Vib29rJywgd2lkdGg6IDU2MCwgaGVpZ2h0OiA2MzAgfSk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnc2hhcmVPblBpbnRlcmVzdCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gc2hhcmVPblBpbnRlcmVzdCgpIHtcblx0XHRcdFx0dmFyIHZhbHVlcyA9IGdldE1ldGFWYWx1ZXMoZG9jdW1lbnQuaGVhZCwgJ1twcm9wZXJ0eV49XCJvZzpcIl0nKTtcblxuXHRcdFx0XHR2YXIgcGFyYW1zID0ge1xuXHRcdFx0XHRcdHVybDogdmFsdWVzLnVybCB8fCB0aGlzLnVybCxcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogdmFsdWVzLmRlc2NyaXB0aW9uIHx8IHRoaXMuZGVzY3JpcHRpb24sXG5cdFx0XHRcdFx0dG9vbGJhcjogJ25vJyxcblx0XHRcdFx0XHRtZWRpYTogdmFsdWVzLmltYWdlXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0b3BlbldpbmRvdygnaHR0cHM6Ly93d3cucGludGVyZXN0LmNvbS9waW4vY3JlYXRlL2J1dHRvbicsIHBhcmFtcywgeyBuYW1lOiAnU2hhcmUgb24gUGludGVyZXN0Jywgd2lkdGg6IDc0MCwgaGVpZ2h0OiA3MDAgfSk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnc2hhcmVPblR3aXR0ZXInLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHNoYXJlT25Ud2l0dGVyKCkge1xuXHRcdFx0XHR2YXIgdmFsdWVzID0gZ2V0TWV0YVZhbHVlcyhkb2N1bWVudC5oZWFkLCAnW25hbWVePVwidHdpdHRlcjpcIl0nKTtcblxuXHRcdFx0XHR2YXIgcGFyYW1zID0ge1xuXHRcdFx0XHRcdHVybDogdmFsdWVzLnVybCB8fCB0aGlzLnVybCxcblx0XHRcdFx0XHR0ZXh0OiB2YWx1ZXMudGl0bGUgfHwgdGhpcy50aXRsZSxcblx0XHRcdFx0XHR2aWE6IHZhbHVlcy5zaXRlID8gdmFsdWVzLnNpdGUucmVwbGFjZSgnQCcsICcnKSA6IHVuZGVmaW5lZFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdG9wZW5XaW5kb3coJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0JywgcGFyYW1zLCB7IG5hbWU6ICdTaGFyZSBvbiBUd2l0dGVyJywgd2lkdGg6IDU4MCwgaGVpZ2h0OiAyNTMgfSk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnc2hhcmVWaWFNYWlsJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBzaGFyZVZpYU1haWwoKSB7XG5cdFx0XHRcdHZhciBwYXJhbXMgPSB7XG5cdFx0XHRcdFx0c3ViamVjdDogdGhpcy50aXRsZSxcblx0XHRcdFx0XHRib2R5OiB0aGlzLnRpdGxlICsgJyAoJyArIHRoaXMudXJsICsgJykgLSAnICsgdGhpcy5kZXNjcmlwdGlvblxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdG9wZW5XaW5kb3coJ21haWx0bzonLCBwYXJhbXMsIHsgaW52aXNpYmxlOiB0cnVlIH0pO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3RpdGxlJyxcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHR2YXIgYXR0cmlidXRlID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ21yLXNoYXJlLXRpdGxlJyk7XG5cdFx0XHRcdHZhciBmYWxsYmFjayA9IGRvY3VtZW50LnRpdGxlO1xuXHRcdFx0XHRyZXR1cm4gYXR0cmlidXRlIHx8IGZhbGxiYWNrO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2Rlc2NyaXB0aW9uJyxcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHR2YXIgYXR0cmlidXRlID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ21yLXNoYXJlLWRlc2NyaXB0aW9uJyk7XG5cdFx0XHRcdHZhciBmYWxsYmFjayA9ICcnO1xuXG5cdFx0XHRcdHZhciB0YWcgPSBkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cImRlc2NyaXB0aW9uXCInKTtcblxuXHRcdFx0XHRpZiAodGFnKSB7XG5cdFx0XHRcdFx0ZmFsbGJhY2sgPSB0YWcuZ2V0QXR0cmlidXRlKCdjb250ZW50Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gYXR0cmlidXRlIHx8IGZhbGxiYWNrO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3VybCcsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0dmFyIGF0dHJpYnV0ZSA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdtci1zaGFyZS11cmwnKTtcblx0XHRcdFx0dmFyIGZhbGxiYWNrID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cblx0XHRcdFx0dmFyIHRhZyA9IGRvY3VtZW50LmhlYWQucXVlcnlTZWxlY3RvcignbGlua1tyZWw9XCJjYW5vbmljYWxcIl0nKTtcblxuXHRcdFx0XHRpZiAodGFnKSB7XG5cdFx0XHRcdFx0ZmFsbGJhY2sgPSB0YWcuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gYXR0cmlidXRlIHx8IGZhbGxiYWNrO1xuXHRcdFx0fVxuXHRcdH1dKTtcblx0XHRyZXR1cm4gY29udHJvbGxlcjtcblx0fShCYXNlQ29udHJvbGxlcilcbn07XG5cbnZhciBzbW9vdGhTdGF0ZSA9IHtcblx0YXR0cmlidXRlczogW10sXG5cdGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChfQmFzZUNvbnRyb2xsZXIpIHtcblx0XHRpbmhlcml0cyhjb250cm9sbGVyLCBfQmFzZUNvbnRyb2xsZXIpO1xuXG5cdFx0ZnVuY3Rpb24gY29udHJvbGxlcigpIHtcblx0XHRcdGNsYXNzQ2FsbENoZWNrKHRoaXMsIGNvbnRyb2xsZXIpO1xuXHRcdFx0cmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKGNvbnRyb2xsZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250cm9sbGVyKSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG5cdFx0fVxuXG5cdFx0Y3JlYXRlQ2xhc3MoY29udHJvbGxlciwgW3tcblx0XHRcdGtleTogJ2FkZFRvUGF0aCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gYWRkVG9QYXRoKGhyZWYpIHtcblx0XHRcdFx0Ly8gTWFrZSBzdXJlIGBocmVmYCBpcyBhbiBhYnNvbHV0ZSBwYXRoIGZyb20gdGhlIC8gcm9vdCBvZiB0aGUgY3VycmVudCBzaXRlXG5cdFx0XHRcdHZhciBhYnNvbHV0ZVBhdGggPSBocmVmLnJlcGxhY2Uod2luZG93LmxvY2F0aW9uLm9yaWdpbiwgJycpO1xuXHRcdFx0XHRhYnNvbHV0ZVBhdGggPSBhYnNvbHV0ZVBhdGhbMF0gIT09ICcvJyA/ICcvJyArIGFic29sdXRlUGF0aCA6IGFic29sdXRlUGF0aDtcblxuXHRcdFx0XHR0aGlzLl9wYXRoID0gdGhpcy5fcGF0aCB8fCBbXTtcblxuXHRcdFx0XHR2YXIgZnJvbSA9IHZvaWQgMDtcblxuXHRcdFx0XHRpZiAodGhpcy5fcGF0aC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0ZnJvbSA9IHRoaXMuX3BhdGhbdGhpcy5fcGF0aC5sZW5ndGggLSAxXS50bztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBwYXRoRW50cnkgPSB7XG5cdFx0XHRcdFx0ZnJvbTogZnJvbSxcblx0XHRcdFx0XHR0bzogYWJzb2x1dGVQYXRoXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5fcGF0aC5wdXNoKHBhdGhFbnRyeSk7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAncmVtb3ZlTGF0ZXN0RnJvbVBhdGgnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUxhdGVzdEZyb21QYXRoKCkge1xuXHRcdFx0XHQodGhpcy5fcGF0aCB8fCBbXSkucG9wKCk7XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3B1c2hTdGF0ZScsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gcHVzaFN0YXRlKGhyZWYpIHtcblx0XHRcdFx0dmFyIHRpdGxlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAnJztcblx0XHRcdFx0dmFyIGFkZFRvUGF0aCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogdHJ1ZTtcblxuXHRcdFx0XHR2YXIgc3RhdGUgPSB7IGhyZWY6IGhyZWYsIHRpdGxlOiB0aXRsZSB9O1xuXG5cdFx0XHRcdHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZSwgdGl0bGUsIGhyZWYpO1xuXG5cdFx0XHRcdGlmIChhZGRUb1BhdGgpIHtcblx0XHRcdFx0XHR0aGlzLmFkZFRvUGF0aChocmVmKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3JlcGxhY2VTdGF0ZScsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gcmVwbGFjZVN0YXRlKGhyZWYpIHtcblx0XHRcdFx0dmFyIHRpdGxlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAnJztcblx0XHRcdFx0dmFyIGFkZFRvUGF0aCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogdHJ1ZTtcblxuXHRcdFx0XHR2YXIgc3RhdGUgPSB7IGhyZWY6IGhyZWYsIHRpdGxlOiB0aXRsZSB9O1xuXG5cdFx0XHRcdHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShzdGF0ZSwgdGl0bGUsIGhyZWYpO1xuXG5cdFx0XHRcdGlmIChhZGRUb1BhdGgpIHtcblx0XHRcdFx0XHR0aGlzLmFkZFRvUGF0aChocmVmKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2luaXQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHRcdHZhciBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRcdHZhciB0aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xuXG5cdFx0XHRcdHRoaXMucmVwbGFjZVN0YXRlKGhyZWYsIHRpdGxlKTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdiaW5kJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBiaW5kKCkge1xuXHRcdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0XHR0aGlzLm9uKCdwb3BzdGF0ZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aWYgKGUuc3RhdGUgJiYgZS5zdGF0ZS5ocmVmKSB7XG5cdFx0XHRcdFx0XHRfdGhpczIuZ29UbyhlLnN0YXRlLmhyZWYsIGZhbHNlKS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybignQ291bGQgbm90IHJ1biBwb3BzdGF0ZSB0bycsIGUuc3RhdGUuaHJlZik7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybignRXJyb3I6JywgZXJyKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgd2luZG93KTtcblxuXHRcdFx0XHR0aGlzLm9uKCdjbGljayBhJywgZnVuY3Rpb24gKGUsIHRhcmdldCkge1xuXHRcdFx0XHRcdGlmICh0YXJnZXQuY2xhc3NMaXN0ICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLW1yLXNtb290aC1zdGF0ZS1kaXNhYmxlJykpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBBdm9pZCBjcm9zcy1vcmlnaW4gY2FsbHNcblx0XHRcdFx0XHRpZiAoIXRhcmdldC5ob3N0bmFtZSB8fCB0YXJnZXQuaG9zdG5hbWUgIT09IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciBocmVmID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXG5cdFx0XHRcdFx0aWYgKCFocmVmKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ0NsaWNrIG9uIGxpbmsgd2l0aG91dCBocmVmJyk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0XHRfdGhpczIuZ29UbyhocmVmKS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ0NvdWxkIG5vdCBuYXZpZ2F0ZSB0bycsIGhyZWYpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKCdFcnJvcjonLCBlcnIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LCBkb2N1bWVudC5ib2R5KTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdnb1RvJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBnb1RvKGhyZWYpIHtcblx0XHRcdFx0dmFyIF90aGlzMyA9IHRoaXM7XG5cblx0XHRcdFx0dmFyIHB1c2hTdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdHJ1ZTtcblxuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc21vb3RoU3RhdGU6YmVmb3JlJykpO1xuXG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdpcy1sb2FkaW5nJyk7XG5cblx0XHRcdFx0XHRfdGhpczMuYWRkVG9QYXRoKGhyZWYpO1xuXG5cdFx0XHRcdFx0dmFyIGNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbChlcnIpIHtcblx0XHRcdFx0XHRcdF90aGlzMy5yZW1vdmVMYXRlc3RGcm9tUGF0aCgpO1xuXHRcdFx0XHRcdFx0cmVqZWN0KGVycik7XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHZhciB0cmFuc2l0aW9uID0ge307XG5cdFx0XHRcdFx0dHJhbnNpdGlvbi5jb250YWluZXIgPSBfdGhpczMuZWw7XG5cdFx0XHRcdFx0dHJhbnNpdGlvbi5wYXRoID0gT2JqZWN0LmFzc2lnbihfdGhpczMubGF0ZXN0UGF0aEVudHJ5KTtcblxuXHRcdFx0XHRcdHJldHVybiBfdGhpczMub25CZWZvcmUodHJhbnNpdGlvbikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRmZXRjaChocmVmLCB7IGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgfSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXMudGV4dCgpO1xuXHRcdFx0XHRcdFx0fSkudGhlbihmdW5jdGlvbiAoaHRtbCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3BhcnNlSFRNTCA9IHBhcnNlSFRNTChodG1sLCAnbXItc21vb3RoLXN0YXRlJyksXG5cdFx0XHRcdFx0XHRcdCAgICB0aXRsZSA9IF9wYXJzZUhUTUwudGl0bGUsXG5cdFx0XHRcdFx0XHRcdCAgICBjb250ZW50ID0gX3BhcnNlSFRNTC5jb250ZW50O1xuXG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc21vb3RoU3RhdGU6c3RhcnQnKSk7XG5cblx0XHRcdFx0XHRcdFx0dHJhbnNpdGlvbi5mZXRjaGVkID0geyB0aXRsZTogdGl0bGUsIGNvbnRlbnQ6IGNvbnRlbnQgfTtcblxuXHRcdFx0XHRcdFx0XHRfdGhpczMub25TdGFydCh0cmFuc2l0aW9uKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3Ntb290aFN0YXRlOnJlYWR5JykpO1xuXG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMzLm9uUmVhZHkodHJhbnNpdGlvbikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgX3RyYW5zaXRpb24kZmV0Y2hlZCA9IHRyYW5zaXRpb24uZmV0Y2hlZCxcblx0XHRcdFx0XHRcdFx0XHRcdCAgICB2ZXJpZmllZFRpdGxlID0gX3RyYW5zaXRpb24kZmV0Y2hlZC50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdCAgICB2ZXJpZmllZENvbnRlbnQgPSBfdHJhbnNpdGlvbiRmZXRjaGVkLmNvbnRlbnQ7XG5cblxuXHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlbmRlck5vZGVzKHZlcmlmaWVkQ29udGVudCwgX3RoaXMzLmVsKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB2ZXJpZmllZFRpdGxlO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChwdXNoU3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBEb24ndCBhZGQgdGhlIHN0YXRlIHRvIHRoZSBwYXRoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0X3RoaXMzLnB1c2hTdGF0ZShocmVmLCB2ZXJpZmllZFRpdGxlLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWxvYWRpbmcnKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc21vb3RoU3RhdGU6YWZ0ZXInKSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBZb3UgY2FuJ3QgY2FuY2VsIHRoZSB0cmFuc2l0aW9uIGFmdGVyIHRoZSBwdXNoU3RhdGVcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBTbyB3ZSBhbHNvIHJlc29sdmUgaW5zaWRlIHRoZSBjYXRjaFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdF90aGlzMy5vbkFmdGVyKHRyYW5zaXRpb24pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc29sdmUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzb2x2ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBjYW5jZWwoZXJyKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBjYW5jZWwoZXJyKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBjYW5jZWwoZXJyKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRcdHJldHVybiBjYW5jZWwoZXJyKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnb25CZWZvcmUnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIG9uQmVmb3JlKHRyYW5zaXRpb24pIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cmFuc2l0aW9uKTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdvblN0YXJ0Jyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBvblN0YXJ0KHRyYW5zaXRpb24pIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cmFuc2l0aW9uKTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdvblJlYWR5Jyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBvblJlYWR5KHRyYW5zaXRpb24pIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cmFuc2l0aW9uKTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdvbkFmdGVyJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBvbkFmdGVyKHRyYW5zaXRpb24pIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cmFuc2l0aW9uKTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdwYXRoJyxcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcGF0aCB8fCBbXTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdsYXRlc3RQYXRoRW50cnknLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdHZhciBsZW5ndGggPSB0aGlzLnBhdGgubGVuZ3RoO1xuXG5cdFx0XHRcdGlmIChsZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMucGF0aFtsZW5ndGggLSAxXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fV0pO1xuXHRcdHJldHVybiBjb250cm9sbGVyO1xuXHR9KEJhc2VDb250cm9sbGVyKVxufTtcblxudmFyIHRpbWVBZ28gPSB7XG5cdGF0dHJpYnV0ZXM6IFsnZGF0ZXRpbWUnXSxcblx0Y29udHJvbGxlcjogZnVuY3Rpb24gKF9CYXNlQ29udHJvbGxlcikge1xuXHRcdGluaGVyaXRzKGNvbnRyb2xsZXIsIF9CYXNlQ29udHJvbGxlcik7XG5cblx0XHRmdW5jdGlvbiBjb250cm9sbGVyKCkge1xuXHRcdFx0Y2xhc3NDYWxsQ2hlY2sodGhpcywgY29udHJvbGxlcik7XG5cdFx0XHRyZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoY29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRyb2xsZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcblx0XHR9XG5cblx0XHRjcmVhdGVDbGFzcyhjb250cm9sbGVyLCBbe1xuXHRcdFx0a2V5OiAncmVzb2x2ZScsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gcmVzb2x2ZSgpIHtcblx0XHRcdFx0Ly8gTm8gbmVlZCB0byB3YWl0IGZvciB3aW5kb3cub25sb2FkXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnaW5pdCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdFx0dGhpcy50cmFuc2xhdGlvbnMgPSB7XG5cdFx0XHRcdFx0YWdvOiAnYWdvJyxcblx0XHRcdFx0XHR5ZWFyOiBbJ3llYXInLCAneWVhcnMnXSxcblx0XHRcdFx0XHRtb250aDogWydtb250aCcsICdtb250aHMnXSxcblx0XHRcdFx0XHR3ZWVrOiBbJ3dlZWsnLCAnd2Vla3MnXSxcblx0XHRcdFx0XHRkYXk6IFsnZGF5JywgJ2RheXMnXSxcblx0XHRcdFx0XHRob3VyOiBbJ2hvdXInLCAnaG91cnMnXSxcblx0XHRcdFx0XHRtaW51dGU6IFsnbWludXRlJywgJ21pbnV0ZXMnXSxcblx0XHRcdFx0XHRzZWNvbmQ6IFsnc2Vjb25kJywgJ3NlY29uZHMnXVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2dldENvdW50ZWROb3VuJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBnZXRDb3VudGVkTm91bihrZXkpIHtcblx0XHRcdFx0dmFyIGNvdW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAxO1xuXG5cdFx0XHRcdGlmICghdGhpcy50cmFuc2xhdGlvbnNba2V5XSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpcy50cmFuc2xhdGlvbnNba2V5XSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy50cmFuc2xhdGlvbnNba2V5XTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb3VudCA9PT0gMSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnRyYW5zbGF0aW9uc1trZXldWzBdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMudHJhbnNsYXRpb25zW2tleV1bMV07XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAncmVuZGVyJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHRcdHZhciBtYWtlUmVhZGFibGUgPSBmdW5jdGlvbiBtYWtlUmVhZGFibGUoZGF0ZXRpbWUpIHtcblx0XHRcdFx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGV0aW1lKTtcblx0XHRcdFx0XHR2YXIgdGltZSA9IGRhdGUuZ2V0VGltZSgpO1xuXHRcdFx0XHRcdHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRcdHZhciBjYWxjdWxhdGVkID0gdm9pZCAwO1xuXG5cdFx0XHRcdFx0aWYgKCFpc05hTih0aW1lKSkge1xuXHRcdFx0XHRcdFx0dmFyIGRpZmYgPSBNYXRoLmZsb29yKG5vdy5nZXRUaW1lKCkgLSB0aW1lKTtcblxuXHRcdFx0XHRcdFx0Y2FsY3VsYXRlZCA9IHt9O1xuXHRcdFx0XHRcdFx0Y2FsY3VsYXRlZC5zZWNvbmRzID0gTWF0aC5yb3VuZChkaWZmIC8gMTAwMCk7XG5cdFx0XHRcdFx0XHRjYWxjdWxhdGVkLm1pbnV0ZXMgPSBNYXRoLnJvdW5kKGNhbGN1bGF0ZWQuc2Vjb25kcyAvIDYwKTtcblx0XHRcdFx0XHRcdGNhbGN1bGF0ZWQuaG91cnMgPSBNYXRoLnJvdW5kKGNhbGN1bGF0ZWQubWludXRlcyAvIDYwKTtcblx0XHRcdFx0XHRcdGNhbGN1bGF0ZWQuZGF5cyA9IE1hdGgucm91bmQoY2FsY3VsYXRlZC5ob3VycyAvIDI0KTtcblx0XHRcdFx0XHRcdGNhbGN1bGF0ZWQud2Vla3MgPSBNYXRoLnJvdW5kKGNhbGN1bGF0ZWQuZGF5cyAvIDcpO1xuXHRcdFx0XHRcdFx0Y2FsY3VsYXRlZC5tb250aHMgPSBNYXRoLnJvdW5kKGNhbGN1bGF0ZWQud2Vla3MgLyA0KTtcblx0XHRcdFx0XHRcdGNhbGN1bGF0ZWQueWVhcnMgPSBNYXRoLnJvdW5kKGNhbGN1bGF0ZWQubW9udGhzIC8gMTIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChjYWxjdWxhdGVkKSB7XG5cdFx0XHRcdFx0XHRpZiAoY2FsY3VsYXRlZC5tb250aHMgPiAxMikge1xuXHRcdFx0XHRcdFx0XHR2YXIgeWVhcnMgPSBfdGhpczIuZ2V0Q291bnRlZE5vdW4oJ3llYXInLCBjYWxjdWxhdGVkLnllYXJzKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhbGN1bGF0ZWQueWVhcnMgKyAnICcgKyB5ZWFycyArICcgJyArIF90aGlzMi50cmFuc2xhdGlvbnMuYWdvO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjYWxjdWxhdGVkLndlZWtzID4gNykge1xuXHRcdFx0XHRcdFx0XHR2YXIgbW9udGhzID0gX3RoaXMyLmdldENvdW50ZWROb3VuKCdtb250aCcsIGNhbGN1bGF0ZWQubW9udGhzKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhbGN1bGF0ZWQubW9udGhzICsgJyAnICsgbW9udGhzICsgJyAnICsgX3RoaXMyLnRyYW5zbGF0aW9ucy5hZ287XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGNhbGN1bGF0ZWQuZGF5cyA+IDIxKSB7XG5cdFx0XHRcdFx0XHRcdHZhciB3ZWVrcyA9IF90aGlzMi5nZXRDb3VudGVkTm91bignd2VlaycsIGNhbGN1bGF0ZWQud2Vla3MpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsY3VsYXRlZC53ZWVrcyArICcgJyArIHdlZWtzICsgJyAnICsgX3RoaXMyLnRyYW5zbGF0aW9ucy5hZ287XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGNhbGN1bGF0ZWQuaG91cnMgPiAyNCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZGF5cyA9IF90aGlzMi5nZXRDb3VudGVkTm91bignZGF5JywgY2FsY3VsYXRlZC5kYXlzKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhbGN1bGF0ZWQuZGF5cyArICcgJyArIGRheXMgKyAnICcgKyBfdGhpczIudHJhbnNsYXRpb25zLmFnbztcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoY2FsY3VsYXRlZC5taW51dGVzID4gNjApIHtcblx0XHRcdFx0XHRcdFx0dmFyIGhvdXJzID0gX3RoaXMyLmdldENvdW50ZWROb3VuKCdob3VyJywgY2FsY3VsYXRlZC5ob3Vycyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBjYWxjdWxhdGVkLmhvdXJzICsgJyAnICsgaG91cnMgKyAnICcgKyBfdGhpczIudHJhbnNsYXRpb25zLmFnbztcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoY2FsY3VsYXRlZC5zZWNvbmRzID4gNjApIHtcblx0XHRcdFx0XHRcdFx0dmFyIG1pbnV0ZXMgPSBfdGhpczIuZ2V0Q291bnRlZE5vdW4oJ21pbnV0ZScsIGNhbGN1bGF0ZWQubWludXRlcyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBjYWxjdWxhdGVkLm1pbnV0ZXMgKyAnICcgKyBtaW51dGVzICsgJyAnICsgX3RoaXMyLnRyYW5zbGF0aW9ucy5hZ287XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHZhciBzZWNvbmRzID0gX3RoaXMyLmdldENvdW50ZWROb3VuKCdzZWNvbmQnLCBjYWxjdWxhdGVkLnNlY29uZHMpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNhbGN1bGF0ZWQuc2Vjb25kcyArICcgJyArIHNlY29uZHMgKyAnICcgKyBfdGhpczIudHJhbnNsYXRpb25zLmFnbztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBEbyBub3RoaW5nIGlmIHdlIGNhbid0IGNhbGN1bGF0ZSBhIHRpbWUgZGlmZlxuXHRcdFx0XHRcdHJldHVybiBfdGhpczIuZWwudGV4dENvbnRlbnQ7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5lbC50ZXh0Q29udGVudCA9IG1ha2VSZWFkYWJsZSh0aGlzLmRhdGV0aW1lKTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9XSk7XG5cdFx0cmV0dXJuIGNvbnRyb2xsZXI7XG5cdH0oQmFzZUNvbnRyb2xsZXIpXG59O1xuXG52YXIgbm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblxudmFyIGdlbmVyYXRlU3RyaW5nQXR0cmlidXRlTWV0aG9kcyA9IGZ1bmN0aW9uIGdlbmVyYXRlU3RyaW5nQXR0cmlidXRlTWV0aG9kcyhhdHRyaWJ1dGUpIHtcblx0dmFyIGdldHRlciA9IGZ1bmN0aW9uIGdldHRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSB8fCB1bmRlZmluZWQ7XG5cdH07XG5cblx0dmFyIHNldHRlciA9IGZ1bmN0aW9uIHNldHRlcih0bykge1xuXHRcdHZhciBwYXJzZWQgPSB0byAmJiB0by50b1N0cmluZyA/IHRvLnRvU3RyaW5nKCkgOiB1bmRlZmluZWQ7XG5cdFx0dmFyIG9sZFZhbHVlID0gdGhpc1thdHRyaWJ1dGVdO1xuXG5cdFx0aWYgKHBhcnNlZCA9PT0gb2xkVmFsdWUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAocGFyc2VkKSB7XG5cdFx0XHR0aGlzLmVsLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHBhcnNlZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB7IGdldHRlcjogZ2V0dGVyLCBzZXR0ZXI6IHNldHRlciB9O1xufTtcblxudmFyIGdlbmVyYXRlQm9vbEF0dHJpYnV0ZU1ldGhvZHMgPSBmdW5jdGlvbiBnZW5lcmF0ZUJvb2xBdHRyaWJ1dGVNZXRob2RzKGF0dHJpYnV0ZSkge1xuXHR2YXIgZ2V0dGVyID0gZnVuY3Rpb24gZ2V0dGVyKCkge1xuXHRcdHJldHVybiAhIXRoaXMuZWwuaGFzQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdH07XG5cblx0dmFyIHNldHRlciA9IGZ1bmN0aW9uIHNldHRlcih0bykge1xuXHRcdHZhciBwYXJzZWQgPSB0eXBlb2YgdG8gPT09ICdzdHJpbmcnIHx8ICEhdG87XG5cdFx0dmFyIG9sZFZhbHVlID0gdGhpc1thdHRyaWJ1dGVdO1xuXG5cdFx0aWYgKHBhcnNlZCA9PT0gb2xkVmFsdWUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAocGFyc2VkKSB7XG5cdFx0XHR0aGlzLmVsLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsICcnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHsgZ2V0dGVyOiBnZXR0ZXIsIHNldHRlcjogc2V0dGVyIH07XG59O1xuXG52YXIgZ2VuZXJhdGVJbnRlZ2VyQXR0cmlidXRlTWV0aG9kcyA9IGZ1bmN0aW9uIGdlbmVyYXRlSW50ZWdlckF0dHJpYnV0ZU1ldGhvZHMoYXR0cmlidXRlKSB7XG5cdHZhciBnZXR0ZXIgPSBmdW5jdGlvbiBnZXR0ZXIoKSB7XG5cdFx0cmV0dXJuIHBhcnNlSW50KHRoaXMuZWwuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSksIDEwKTtcblx0fTtcblxuXHR2YXIgc2V0dGVyID0gZnVuY3Rpb24gc2V0dGVyKHRvKSB7XG5cdFx0dmFyIHBhcnNlZCA9IHBhcnNlSW50KHRvLCAxMCk7XG5cdFx0dmFyIG9sZFZhbHVlID0gdGhpc1thdHRyaWJ1dGVdO1xuXG5cdFx0aWYgKHBhcnNlZCA9PT0gb2xkVmFsdWUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XG5cdFx0XHR0aGlzLmVsLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHBhcnNlZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUud2FybignQ291bGQgbm90IHNldCAnICsgYXR0cmlidXRlICsgJyB0byAnICsgdG8pO1xuXHRcdFx0dGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHsgZ2V0dGVyOiBnZXR0ZXIsIHNldHRlcjogc2V0dGVyIH07XG59O1xuXG52YXIgZ2VuZXJhdGVOdW1iZXJBdHRyaWJ1dGVNZXRob2RzID0gZnVuY3Rpb24gZ2VuZXJhdGVOdW1iZXJBdHRyaWJ1dGVNZXRob2RzKGF0dHJpYnV0ZSkge1xuXHR2YXIgZ2V0dGVyID0gZnVuY3Rpb24gZ2V0dGVyKCkge1xuXHRcdHJldHVybiBwYXJzZUZsb2F0KHRoaXMuZWwuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkpO1xuXHR9O1xuXG5cdHZhciBzZXR0ZXIgPSBmdW5jdGlvbiBzZXR0ZXIodG8pIHtcblx0XHR2YXIgcGFyc2VkID0gcGFyc2VGbG9hdCh0byk7XG5cdFx0dmFyIG9sZFZhbHVlID0gdGhpc1thdHRyaWJ1dGVdO1xuXG5cdFx0aWYgKHBhcnNlZCA9PT0gb2xkVmFsdWUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XG5cdFx0XHR0aGlzLmVsLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHBhcnNlZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUud2FybignQ291bGQgbm90IHNldCAnICsgYXR0cmlidXRlICsgJyB0byAnICsgdG8pO1xuXHRcdFx0dGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHsgZ2V0dGVyOiBnZXR0ZXIsIHNldHRlcjogc2V0dGVyIH07XG59O1xuXG52YXIgZ2VuZXJhdGVBdHRyaWJ1dGVNZXRob2RzID0gZnVuY3Rpb24gZ2VuZXJhdGVBdHRyaWJ1dGVNZXRob2RzKGF0dHJpYnV0ZSkge1xuXHR2YXIgdHlwZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJ3N0cmluZyc7XG5cblx0aWYgKHR5cGUgPT09ICdib29sJykge1xuXHRcdHJldHVybiBnZW5lcmF0ZUJvb2xBdHRyaWJ1dGVNZXRob2RzKGF0dHJpYnV0ZSk7XG5cdH0gZWxzZSBpZiAodHlwZSA9PT0gJ2ludCcgfHwgdHlwZSA9PT0gJ2ludGVnZXInKSB7XG5cdFx0cmV0dXJuIGdlbmVyYXRlSW50ZWdlckF0dHJpYnV0ZU1ldGhvZHMoYXR0cmlidXRlKTtcblx0fSBlbHNlIGlmICh0eXBlID09PSAnZmxvYXQnIHx8IHR5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0cmV0dXJuIGdlbmVyYXRlTnVtYmVyQXR0cmlidXRlTWV0aG9kcyhhdHRyaWJ1dGUpO1xuXHR9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIGdlbmVyYXRlU3RyaW5nQXR0cmlidXRlTWV0aG9kcyhhdHRyaWJ1dGUpO1xuXHR9XG5cdHJldHVybiB7IGdldHRlcjogbm9vcCwgc2V0dGVyOiBub29wIH07XG59O1xuXG52YXIgQ09OVFJPTExFUiA9IFN5bWJvbCgnY29udHJvbGxlcicpO1xuXG52YXIgcmVnaXN0ZXJFbGVtZW50ID0gZnVuY3Rpb24gcmVnaXN0ZXJFbGVtZW50KHRhZywgb3B0aW9ucykge1xuXHR2YXIgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gb3B0aW9ucy5vYnNlcnZlZEF0dHJpYnV0ZXMgfHwgW107XG5cblx0Y3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZywgZnVuY3Rpb24gKF9IVE1MRWxlbWVudCkge1xuXHRcdGluaGVyaXRzKF9jbGFzcywgX0hUTUxFbGVtZW50KTtcblx0XHRjcmVhdGVDbGFzcyhfY2xhc3MsIFt7XG5cdFx0XHRrZXk6ICdhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2snLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuXHRcdFx0XHRpZiAob2xkVmFsdWUgPT09IG5ld1ZhbHVlKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCF0aGlzW0NPTlRST0xMRVJdKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHByb3BlcnR5TmFtZSA9IGNvbnZlcnRBdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGUpO1xuXG5cdFx0XHRcdHZhciBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpc1tDT05UUk9MTEVSXSk7XG5cdFx0XHRcdHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIHByb3BlcnR5TmFtZSk7XG5cblx0XHRcdFx0aWYgKGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci5zZXQpIHtcblx0XHRcdFx0XHR0aGlzW0NPTlRST0xMRVJdW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIGZvciBhcmd1bWVudCBgY3VycmVudGAgdGhlIG1ldGhvZFxuXHRcdFx0XHQvLyBgY3VycmVudENoYW5nZWRDYWxsYmFja2AgZXhpc3RzLCB0cmlnZ2VyXG5cdFx0XHRcdHZhciBjYWxsYmFjayA9IHRoaXNbQ09OVFJPTExFUl1bcHJvcGVydHlOYW1lICsgJ0NoYW5nZWRDYWxsYmFjayddO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXNbQ09OVFJPTExFUl0sIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XSwgW3tcblx0XHRcdGtleTogJ29ic2VydmVkQXR0cmlidXRlcycsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0cmV0dXJuIG9ic2VydmVkQXR0cmlidXRlcztcblx0XHRcdH1cblx0XHR9XSk7XG5cblx0XHRmdW5jdGlvbiBfY2xhc3MoKSB7XG5cdFx0XHRjbGFzc0NhbGxDaGVjayh0aGlzLCBfY2xhc3MpO1xuXG5cdFx0XHR2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChfY2xhc3MuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihfY2xhc3MpKS5jYWxsKHRoaXMpKTtcblxuXHRcdFx0b2JzZXJ2ZWRBdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuXHRcdFx0XHRpZiAodHlwZW9mIF90aGlzW2F0dHJpYnV0ZV0gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKCdSZXF1ZXN0ZWQgc3luY2luZyBvbiBhdHRyaWJ1dGUgXFwnJyArIGF0dHJpYnV0ZSArICdcXCcgdGhhdCBhbHJlYWR5IGhhcyBkZWZpbmVkIGJlaGF2aW9yJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoX3RoaXMsIGF0dHJpYnV0ZSwge1xuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdFx0XHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gX3RoaXNbQ09OVFJPTExFUl1bYXR0cmlidXRlXTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNldDogZnVuY3Rpb24gc2V0JCQxKHRvKSB7XG5cdFx0XHRcdFx0XHRfdGhpc1tDT05UUk9MTEVSXVthdHRyaWJ1dGVdID0gdG87XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIF90aGlzO1xuXHRcdH1cblxuXHRcdGNyZWF0ZUNsYXNzKF9jbGFzcywgW3tcblx0XHRcdGtleTogJ2Nvbm5lY3RlZENhbGxiYWNrJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdFx0dGhpc1tDT05UUk9MTEVSXSA9IG5ldyBvcHRpb25zLmNvbnRyb2xsZXIodGhpcyk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnZGlzY29ubmVjdGVkQ2FsbGJhY2snLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0XHRpZiAodHlwZW9mIHRoaXNbQ09OVFJPTExFUl0udW5iaW5kID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0dGhpc1tDT05UUk9MTEVSXS51bmJpbmQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpc1tDT05UUk9MTEVSXS5kZXN0cm95ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0dGhpc1tDT05UUk9MTEVSXS5kZXN0cm95KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzW0NPTlRST0xMRVJdID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XSk7XG5cdFx0cmV0dXJuIF9jbGFzcztcblx0fShIVE1MRWxlbWVudCkpO1xufTtcblxudmFyIHJlZ2lzdGVyQXR0cmlidXRlID0gZnVuY3Rpb24gcmVnaXN0ZXJBdHRyaWJ1dGUoKSB7XG5cdHZhciBoYW5kbGVycyA9IFtdO1xuXG5cdHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcblx0XHRcblx0fSk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHJlZ2lzdGVyKGF0dHJpYnV0ZSkge1xuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuXHRcdHdhaXRGb3JET01SZWFkeSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGV4dGVuZCA9IG9wdGlvbnMuZXh0ZW5kcyB8fCBIVE1MRWxlbWVudDtcblxuXHRcdFx0dmFyIG5vZGVJc1N1cHBvcnRlZCA9IGZ1bmN0aW9uIG5vZGVJc1N1cHBvcnRlZChub2RlKSB7XG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KGV4dGVuZCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gZXh0ZW5kLnNvbWUoZnVuY3Rpb24gKHN1cHBvcnRlZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBzdXBwb3J0ZWQ7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gbm9kZSBpbnN0YW5jZW9mIGV4dGVuZDtcblx0XHRcdH07XG5cblx0XHRcdHZhciBhdHRhY2ggPSBmdW5jdGlvbiBhdHRhY2gobm9kZSkge1xuXHRcdFx0XHR2YXIgZWwgPSBub2RlO1xuXHRcdFx0XHRlbFtDT05UUk9MTEVSXSA9IG5ldyBvcHRpb25zLmNvbnRyb2xsZXIoZWwpO1xuXHRcdFx0XHRyZXR1cm4gZWw7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgZGV0YWNoID0gZnVuY3Rpb24gZGV0YWNoKG5vZGUpIHtcblx0XHRcdFx0dmFyIGVsID0gbm9kZTtcblxuXHRcdFx0XHRpZiAoZWxbQ09OVFJPTExFUl0pIHtcblx0XHRcdFx0XHRlbFtDT05UUk9MTEVSXS5kZXN0cm95KCk7XG5cdFx0XHRcdFx0ZWxbQ09OVFJPTExFUl0gPSBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGVsO1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gU2V0dXAgb2JzZXJ2ZXJzXG5cdFx0XHRoYW5kbGVycy5wdXNoKGZ1bmN0aW9uIChtdXRhdGlvbikge1xuXHRcdFx0XHRpZiAobXV0YXRpb24udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnICYmIG5vZGVJc1N1cHBvcnRlZChtdXRhdGlvbi50YXJnZXQpKSB7XG5cdFx0XHRcdFx0Ly8gQXR0cmlidXRlIGNoYW5nZWQgb24gc3VwcG9ydGVkIERPTSBub2RlIHR5cGVcblx0XHRcdFx0XHR2YXIgbm9kZSA9IG11dGF0aW9uLnRhcmdldDtcblxuXHRcdFx0XHRcdGlmIChub2RlLmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpKSB7XG5cdFx0XHRcdFx0XHRhdHRhY2gobm9kZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRldGFjaChub2RlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcblx0XHRcdFx0XHQvLyBIYW5kbGUgYWRkZWQgbm9kZXNcblx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuXHRcdFx0XHRhdHRyaWJ1dGVzOiB0cnVlLFxuXHRcdFx0XHRzdWJ0cmVlOiB0cnVlLFxuXHRcdFx0XHRjaGlsZExpc3Q6IHRydWUsXG5cdFx0XHRcdGF0dHJpYnV0ZUZpbHRlcjogW2F0dHJpYnV0ZV1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBMb29rIGZvciBjdXJyZW50IG9uIERPTSByZWFkeVxuXHRcdFx0QXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJ1snICsgYXR0cmlidXRlICsgJ10nKSwgZnVuY3Rpb24gKGVsKSB7XG5cdFx0XHRcdGlmICghbm9kZUlzU3VwcG9ydGVkKGVsKSkge1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybignQ3VzdG9tIGF0dHJpYnV0ZScsIGF0dHJpYnV0ZSwgJ2FkZGVkIG9uIG5vbi1zdXBwb3J0ZWQgZWxlbWVudCcpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChlbFtDT05UUk9MTEVSXSkge1xuXHRcdFx0XHRcdHJldHVybiBlbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBhdHRhY2goZWwpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH07XG59KCk7XG5cbnZhciBhZGRBdHRyaWJ1dGVzVG9Db250cm9sbGVyID0gZnVuY3Rpb24gYWRkQXR0cmlidXRlc1RvQ29udHJvbGxlcihjb250cm9sbGVyKSB7XG5cdHZhciBhdHRyaWJ1dGVzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBbXTtcblxuXHRyZXR1cm4gYXR0cmlidXRlcy5tYXAoZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuXHRcdC8vIFN0cmluZywgc3luYyB3aXRoIGFjdHVhbCBlbGVtZW50IGF0dHJpYnV0ZVxuXHRcdGlmICh0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuXHRcdFx0dmFyIF9nZW5lcmF0ZUF0dHJpYnV0ZU1ldCA9IGdlbmVyYXRlQXR0cmlidXRlTWV0aG9kcyhhdHRyaWJ1dGUsICdzdHJpbmcnKSxcblx0XHRcdCAgICBnZXR0ZXIgPSBfZ2VuZXJhdGVBdHRyaWJ1dGVNZXQuZ2V0dGVyLFxuXHRcdFx0ICAgIHNldHRlciA9IF9nZW5lcmF0ZUF0dHJpYnV0ZU1ldC5zZXR0ZXI7XG5cblx0XHRcdGFkZFByb3BlcnR5KGNvbnRyb2xsZXIsIGF0dHJpYnV0ZSwgZ2V0dGVyLCBzZXR0ZXIpO1xuXHRcdFx0cmV0dXJuIGF0dHJpYnV0ZTtcblx0XHR9XG5cblx0XHRpZiAoKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGF0dHJpYnV0ZSkpID09PSAnb2JqZWN0Jykge1xuXHRcdFx0dmFyIHR5cGUgPSBhdHRyaWJ1dGUudHlwZSB8fCAnc3RyaW5nJztcblx0XHRcdHZhciBuYW1lID0gYXR0cmlidXRlLmF0dHJpYnV0ZTtcblxuXHRcdFx0dmFyIF9nZW5lcmF0ZUF0dHJpYnV0ZU1ldDIgPSBnZW5lcmF0ZUF0dHJpYnV0ZU1ldGhvZHMobmFtZSwgdHlwZSksXG5cdFx0XHQgICAgX2dldHRlciA9IF9nZW5lcmF0ZUF0dHJpYnV0ZU1ldDIuZ2V0dGVyLFxuXHRcdFx0ICAgIF9zZXR0ZXIgPSBfZ2VuZXJhdGVBdHRyaWJ1dGVNZXQyLnNldHRlcjtcblxuXHRcdFx0YWRkUHJvcGVydHkoY29udHJvbGxlciwgbmFtZSwgX2dldHRlciwgX3NldHRlcik7XG5cdFx0XHRyZXR1cm4gbmFtZTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZS5hdHRhY2hUbyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0YXR0cmlidXRlLmF0dGFjaFRvKGNvbnRyb2xsZXIpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fSkuZmlsdGVyKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcblx0XHRyZXR1cm4gISFhdHRyaWJ1dGU7XG5cdH0pO1xufTtcblxuZnVuY3Rpb24gZGVmaW5lQ3VzdG9tRWxlbWVudCh0YWcpIHtcblx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG5cdC8vIFZhbGlkYXRlIHRhZ1xuXHR2YXIgaXNWYWxpZFRhZyA9IHRhZy5zcGxpdCgnLScpLmxlbmd0aCA+IDE7XG5cblx0Ly8gVmFsaWRhdGUgdHlwZVxuXHR2YXIgdHlwZSA9IFsnZWxlbWVudCcsICdhdHRyaWJ1dGUnXS5pbmNsdWRlcyhvcHRpb25zLnR5cGUpID8gb3B0aW9ucy50eXBlIDogJ2VsZW1lbnQnO1xuXG5cdGlmICh0eXBlID09PSAnZWxlbWVudCcgJiYgIWlzVmFsaWRUYWcpIHtcblx0XHRjb25zb2xlLndhcm4odGFnLCAnaXMgbm90IGEgdmFsaWQgQ3VzdG9tIEVsZW1lbnQgbmFtZS4gUmVnaXN0ZXIgYXMgYW4gYXR0cmlidXRlIGluc3RlYWQuJyk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gVmFsaWRhdGUgYXR0cmlidXRlc1xuXHR2YXIgYXR0cmlidXRlcyA9IEFycmF5LmlzQXJyYXkob3B0aW9ucy5hdHRyaWJ1dGVzKSA/IG9wdGlvbnMuYXR0cmlidXRlcyA6IFtdO1xuXG5cdC8vIFZhbGlkYXRlIGNvbnRyb2xsZXJcblx0dmFyIGNvbnRyb2xsZXIgPSBvcHRpb25zLmNvbnRyb2xsZXI7XG5cblx0Ly8gVmFsaWRhdGUgZXh0ZW5kc1xuXHR2YXIgZXh0ZW5kID0gb3B0aW9ucy5leHRlbmRzO1xuXG5cdGlmICh0eXBlID09PSAnZWxlbWVudCcgJiYgZXh0ZW5kKSB7XG5cdFx0Y29uc29sZS53YXJuKCdgZXh0ZW5kc2AgaXMgbm90IHN1cHBvcnRlZCBvbiBlbGVtZW50LXJlZ2lzdGVyZWQgQ3VzdG9tIEVsZW1lbnRzLiBSZWdpc3RlciBhcyBhbiBhdHRyaWJ1dGUgaW5zdGVhZC4nKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR2YXIgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gYWRkQXR0cmlidXRlc1RvQ29udHJvbGxlcihjb250cm9sbGVyLCBhdHRyaWJ1dGVzKTtcblxuXHR2YXIgdmFsaWRhdGVkT3B0aW9ucyA9IHsgdHlwZTogdHlwZSwgZXh0ZW5kczogZXh0ZW5kLCBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLCBjb250cm9sbGVyOiBjb250cm9sbGVyLCBvYnNlcnZlZEF0dHJpYnV0ZXM6IG9ic2VydmVkQXR0cmlidXRlcyB9O1xuXG5cdGlmICh0eXBlID09PSAnYXR0cmlidXRlJykge1xuXHRcdHJldHVybiByZWdpc3RlckF0dHJpYnV0ZSh0YWcsIHZhbGlkYXRlZE9wdGlvbnMpO1xuXHR9XG5cblx0cmV0dXJuIHJlZ2lzdGVyRWxlbWVudCh0YWcsIHZhbGlkYXRlZE9wdGlvbnMpO1xufVxuXG4vLyBCYXNlIENvbnRyb2xsZXJcblxuZXhwb3J0cy5CYXNlQ29udHJvbGxlciA9IEJhc2VDb250cm9sbGVyO1xuZXhwb3J0cy5tZWRpYSA9IEF0dHJNZWRpYTtcbmV4cG9ydHMudG91Y2hIb3ZlciA9IEF0dHJUb3VjaEhvdmVyO1xuZXhwb3J0cy5hamF4Rm9ybSA9IGFqYXhGb3JtO1xuZXhwb3J0cy5rZXlUcmlnZ2VyID0ga2V5VHJpZ2dlcjtcbmV4cG9ydHMub3ZlcmxheSA9IG92ZXJsYXk7XG5leHBvcnRzLnNoYXJlID0gc2hhcmU7XG5leHBvcnRzLnNtb290aFN0YXRlID0gc21vb3RoU3RhdGU7XG5leHBvcnRzLnRpbWVBZ28gPSB0aW1lQWdvO1xuZXhwb3J0cy5kZWZpbmVDdXN0b21FbGVtZW50ID0gZGVmaW5lQ3VzdG9tRWxlbWVudDtcbmV4cG9ydHMucGFyc2VFdmVudCA9IHBhcnNlO1xuZXhwb3J0cy5nZXRFdmVudFBhdGggPSBnZXRQYXRoO1xuZXhwb3J0cy5wYXJzZUhUTUwgPSBwYXJzZUhUTUw7XG5leHBvcnRzLnJlbmRlck5vZGVzID0gcmVuZGVyTm9kZXM7XG5leHBvcnRzLmNsZWFuTm9kZXMgPSBjbGVhbk5vZGVzO1xuZXhwb3J0cy5wcm9taXNpZnkgPSBwcm9taXNpZnk7XG4iXX0=
