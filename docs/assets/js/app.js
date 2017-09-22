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
	attributes: [{ attribute: 'loop', type: 'bool' }],
	controller: function (_BaseController) {
		_inherits(controller, _BaseController);

		function controller() {
			_classCallCheck(this, controller);

			return _possibleConstructorReturn(this, (controller.__proto__ || Object.getPrototypeOf(controller)).apply(this, arguments));
		}

		_createClass(controller, [{
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
				this.elements = {
					items: Array.from(this.el.children)
				};

				this.current = 0;

				return this;
			}
		}, {
			key: 'bind',
			value: function bind() {
				var _this2 = this;

				if (this.loop) {
					this.looper = setInterval(function () {
						_this2.current = _this2.current + 1;
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
			}
		}, {
			key: 'current',
			get: function get() {
				return this._current;
			},
			set: function set(to) {
				var parsed = parseInt(to, 10);

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

				this._current = parsed;
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

var BaseController = function () {
	function BaseController(el) {
		var _this = this;

		classCallCheck(this, BaseController);

		this.el = el;

		this.resolve().then(function () {
			_this.el.classList.add('is-resolved');

			var init = function init() {
				return promisify(function () {
					return _this.init();
				});
			};
			var render = function render() {
				return promisify(function () {
					return _this.render();
				});
			};
			var bind = function bind() {
				return promisify(function () {
					return _this.bind();
				});
			};

			return init().then(function () {
				return render().then(function () {
					return bind().then(function () {
						return _this;
					});
				});
			});
		});
	}

	createClass(BaseController, [{
		key: 'destroy',
		value: function destroy() {
			this.el.classList.remove('is-resolved');
			return this.unbind();
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
			if (this._handlers) {
				this._handlers.forEach(function (listener) {
					listener.target.removeEventListener(listener.event, listener.handler, listener.options);
				});
			}

			return this;
		}
	}, {
		key: 'on',
		value: function on(name, handler) {
			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
			var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			this._handlers = this._handlers || [];

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

			this._handlers.push(listener);

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

			var listener = this._handlers.find(function (handler) {
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
				this._handlers.splice(this._handlers.indexOf(listener), 1);

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
				this[CONTROLLER].destroy();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJndWxwL2Fzc2V0cy9qcy9hcHAuanMiLCJndWxwL2Fzc2V0cy9qcy9tb2R1bGVzL3NsaWRlc2hvdy5qcyIsIm5vZGVfbW9kdWxlcy9jdXN0b20tZWxlbWVudHMtaGVscGVycy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7QUFFQSxnREFBb0IsY0FBcEIsRUFBb0M7QUFDbkMsYUFBWSxDQUNYLEVBQUUsV0FBVyxNQUFiLEVBQXFCLE1BQU0sTUFBM0IsRUFEVyxDQUR1QjtBQUluQztBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNkJBbUNXO0FBQ1QsUUFBSSxLQUFLLEVBQUwsQ0FBUSxRQUFSLENBQWlCLE1BQWpCLEtBQTRCLENBQWhDLEVBQW1DO0FBQ2xDO0FBQ0EsWUFBTyxJQUFJLE9BQUosQ0FBWSxZQUFNLENBQUUsQ0FBcEIsQ0FBUDtBQUNBO0FBQ0Q7QUFDQTtBQXpDRjtBQUFBO0FBQUEsMEJBMkNRO0FBQ04sU0FBSyxRQUFMLEdBQWdCO0FBQ2YsWUFBTyxNQUFNLElBQU4sQ0FBVyxLQUFLLEVBQUwsQ0FBUSxRQUFuQjtBQURRLEtBQWhCOztBQUlBLFNBQUssT0FBTCxHQUFlLENBQWY7O0FBRUEsV0FBTyxJQUFQO0FBQ0E7QUFuREY7QUFBQTtBQUFBLDBCQXFEUTtBQUFBOztBQUNOLFFBQUksS0FBSyxJQUFULEVBQWU7QUFDZCxVQUFLLE1BQUwsR0FBYyxZQUFZLFlBQU07QUFDL0IsYUFBSyxPQUFMLEdBQWUsT0FBSyxPQUFMLEdBQWUsQ0FBOUI7QUFDQSxNQUZhLEVBRVgsSUFGVyxDQUFkO0FBR0E7O0FBRUQsV0FBTyxJQUFQO0FBQ0E7QUE3REY7QUFBQTtBQUFBLDZCQStEVztBQUNULFFBQUksS0FBSyxNQUFULEVBQWlCO0FBQ2hCLG1CQUFjLEtBQUssTUFBbkI7QUFDQSxVQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0E7QUFDRDtBQXBFRjtBQUFBO0FBQUEsdUJBQ2U7QUFDYixXQUFPLEtBQUssUUFBWjtBQUNBLElBSEY7QUFBQSxxQkFLYSxFQUxiLEVBS2lCO0FBQ2YsUUFBSSxTQUFTLFNBQVMsRUFBVCxFQUFhLEVBQWIsQ0FBYjs7QUFFQSxRQUFNLE1BQU0sS0FBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixNQUFoQzs7QUFFQTtBQUNBLFFBQUksVUFBVSxHQUFkLEVBQW1CO0FBQ2xCO0FBQ0EsY0FBUyxLQUFLLElBQUwsR0FBWSxDQUFaLEdBQWdCLE1BQU0sQ0FBL0I7QUFDQTs7QUFFRDtBQUNBLFFBQUksU0FBUyxDQUFiLEVBQWdCO0FBQ2Y7QUFDQSxjQUFTLEtBQUssSUFBTCxHQUFZLE1BQU0sQ0FBbEIsR0FBc0IsQ0FBL0I7QUFDQTs7QUFFRCxTQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLE9BQXBCLENBQTRCLFVBQUMsSUFBRCxFQUFPLENBQVAsRUFBYTtBQUN4QyxTQUFJLEtBQUssU0FBTCxDQUFlLFFBQWYsQ0FBd0IsV0FBeEIsQ0FBSixFQUEwQztBQUN6QyxXQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLFdBQXRCO0FBQ0E7O0FBRUQsU0FBSSxNQUFNLE1BQVYsRUFBa0I7QUFDakIsV0FBSyxTQUFMLENBQWUsR0FBZixDQUFtQixXQUFuQjtBQUNBO0FBQ0QsS0FSRDs7QUFVQSxTQUFLLFFBQUwsR0FBZ0IsTUFBaEI7QUFDQTtBQWpDRjs7QUFBQTtBQUFBO0FBSm1DLENBQXBDOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgJy4vbW9kdWxlcy9zbGlkZXNob3cnO1xuIiwiaW1wb3J0IHsgZGVmaW5lQ3VzdG9tRWxlbWVudCwgQmFzZUNvbnRyb2xsZXIgfSBmcm9tICdjdXN0b20tZWxlbWVudHMtaGVscGVycyc7XG5cbmRlZmluZUN1c3RvbUVsZW1lbnQoJ21yLXNsaWRlc2hvdycsIHtcblx0YXR0cmlidXRlczogW1xuXHRcdHsgYXR0cmlidXRlOiAnbG9vcCcsIHR5cGU6ICdib29sJyB9LFxuXHRdLFxuXHRjb250cm9sbGVyOiBjbGFzcyBleHRlbmRzIEJhc2VDb250cm9sbGVyIHtcblx0XHRnZXQgY3VycmVudCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jdXJyZW50O1xuXHRcdH1cblxuXHRcdHNldCBjdXJyZW50KHRvKSB7XG5cdFx0XHRsZXQgcGFyc2VkID0gcGFyc2VJbnQodG8sIDEwKTtcblxuXHRcdFx0Y29uc3QgbWF4ID0gdGhpcy5lbGVtZW50cy5pdGVtcy5sZW5ndGg7XG5cblx0XHRcdC8vIElmIHdlJ3JlIGF0IHRoZSBsYXN0IHNsaWRlIGFuZCBuYXZpZ2F0ZWQgJ05leHQnXG5cdFx0XHRpZiAocGFyc2VkID49IG1heCkge1xuXHRcdFx0XHQvLyBCYWNrIHRvIGZpcnN0IHNsaWRlIGlmIGNhcm91c2VsIGhhcyBsb29wIHNldCB0byB0cnVlXG5cdFx0XHRcdHBhcnNlZCA9IHRoaXMubG9vcCA/IDAgOiBtYXggLSAxO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB3ZSdyZSBhdCB0aGUgZmlyc3Qgc2xpZGUgYW5kIG5hdmlnYXRlZCAnUHJldmlvdXMnXG5cdFx0XHRpZiAocGFyc2VkIDwgMCkge1xuXHRcdFx0XHQvLyBKdW1wIHRvIGxhc3Qgc2xpZGUgaWYgY2Fyb3VzZWwgaGFzIGxvb3Agc2V0IHRvIHRydWVcblx0XHRcdFx0cGFyc2VkID0gdGhpcy5sb29wID8gbWF4IC0gMSA6IDA7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZWxlbWVudHMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0XHRpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWFjdGl2ZScpKSB7XG5cdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpID09PSBwYXJzZWQpIHtcblx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5fY3VycmVudCA9IHBhcnNlZDtcblx0XHR9XG5cblx0XHRyZXNvbHZlKCkge1xuXHRcdFx0aWYgKHRoaXMuZWwuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdC8vIEtlZXAgaGFuZ2luZywgZG9uJ3QgYWN0aXZhdGUgaWYgZW1wdHlcblx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKCgpID0+IHt9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdXBlci5yZXNvbHZlKCk7XG5cdFx0fVxuXG5cdFx0aW5pdCgpIHtcblx0XHRcdHRoaXMuZWxlbWVudHMgPSB7XG5cdFx0XHRcdGl0ZW1zOiBBcnJheS5mcm9tKHRoaXMuZWwuY2hpbGRyZW4pLFxuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5jdXJyZW50ID0gMDtcblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0YmluZCgpIHtcblx0XHRcdGlmICh0aGlzLmxvb3ApIHtcblx0XHRcdFx0dGhpcy5sb29wZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50ICsgMTtcblx0XHRcdFx0fSwgNDAwMCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdGRlc3Ryb3koKSB7XG5cdFx0XHRpZiAodGhpcy5sb29wZXIpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmxvb3Blcik7XG5cdFx0XHRcdHRoaXMubG9vcGVyID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuZnVuY3Rpb24gcGFyc2UobmFtZSkge1xuXHR2YXIgY2xlYW4gPSBuYW1lLnRyaW0oKTtcblx0dmFyIHBhcnRzID0gY2xlYW4uc3BsaXQoJyAnKTtcblxuXHR2YXIgZXZlbnQgPSBjbGVhbjtcblx0dmFyIHNlbGVjdG9yID0gbnVsbDtcblxuXHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdGV2ZW50ID0gcGFydHMuc2hpZnQoKTtcblx0XHRzZWxlY3RvciA9IHBhcnRzLmpvaW4oJyAnKTtcblx0fVxuXG5cdHJldHVybiB7IGV2ZW50OiBldmVudCwgc2VsZWN0b3I6IHNlbGVjdG9yIH07XG59XG5cbmZ1bmN0aW9uIGdldFBhdGgoZSkge1xuXHR2YXIgcGF0aCA9IGUucGF0aDtcblxuXHRpZiAoIXBhdGgpIHtcblx0XHRwYXRoID0gW2UudGFyZ2V0XTtcblx0XHR2YXIgbm9kZSA9IGUudGFyZ2V0O1xuXG5cdFx0d2hpbGUgKG5vZGUucGFyZW50Tm9kZSkge1xuXHRcdFx0bm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcblx0XHRcdHBhdGgucHVzaChub2RlKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcGF0aDtcbn1cblxuZnVuY3Rpb24gcHJvbWlzaWZ5KG1ldGhvZCkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdHZhciB3YWl0ID0gbWV0aG9kKCk7XG5cblx0XHRpZiAod2FpdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcblx0XHRcdHdhaXQudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdFx0XHRcdFx0YXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc29sdmUoYXJncyk7XG5cdFx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG5cdFx0XHRcdFx0YXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVqZWN0KGFyZ3MpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc29sdmUod2FpdCk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gd2FpdEZvckRPTVJlYWR5KCkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0XHRpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgaGFuZGxlciA9IGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG5cdFx0XHRcdGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGhhbmRsZXIsIGZhbHNlKTtcblx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBoYW5kbGVyLCBmYWxzZSk7XG5cdFx0fVxuXHR9KTtcbn1cblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmo7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbn07XG5cblxuXG5cblxudmFyIGFzeW5jR2VuZXJhdG9yID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBBd2FpdFZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gQXN5bmNHZW5lcmF0b3IoZ2VuKSB7XG4gICAgdmFyIGZyb250LCBiYWNrO1xuXG4gICAgZnVuY3Rpb24gc2VuZChrZXksIGFyZykge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgYXJnOiBhcmcsXG4gICAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgICAgICByZWplY3Q6IHJlamVjdCxcbiAgICAgICAgICBuZXh0OiBudWxsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGJhY2spIHtcbiAgICAgICAgICBiYWNrID0gYmFjay5uZXh0ID0gcmVxdWVzdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcm9udCA9IGJhY2sgPSByZXF1ZXN0O1xuICAgICAgICAgIHJlc3VtZShrZXksIGFyZyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc3VtZShrZXksIGFyZykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGdlbltrZXldKGFyZyk7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcblxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBd2FpdFZhbHVlKSB7XG4gICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlLnZhbHVlKS50aGVuKGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgIHJlc3VtZShcIm5leHRcIiwgYXJnKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICByZXN1bWUoXCJ0aHJvd1wiLCBhcmcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldHRsZShyZXN1bHQuZG9uZSA/IFwicmV0dXJuXCIgOiBcIm5vcm1hbFwiLCByZXN1bHQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgc2V0dGxlKFwidGhyb3dcIiwgZXJyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR0bGUodHlwZSwgdmFsdWUpIHtcbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFwicmV0dXJuXCI6XG4gICAgICAgICAgZnJvbnQucmVzb2x2ZSh7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBkb25lOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcInRocm93XCI6XG4gICAgICAgICAgZnJvbnQucmVqZWN0KHZhbHVlKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGZyb250LnJlc29sdmUoe1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZG9uZTogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgZnJvbnQgPSBmcm9udC5uZXh0O1xuXG4gICAgICBpZiAoZnJvbnQpIHtcbiAgICAgICAgcmVzdW1lKGZyb250LmtleSwgZnJvbnQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJhY2sgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2ludm9rZSA9IHNlbmQ7XG5cbiAgICBpZiAodHlwZW9mIGdlbi5yZXR1cm4gIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5yZXR1cm4gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuYXN5bmNJdGVyYXRvcikge1xuICAgIEFzeW5jR2VuZXJhdG9yLnByb3RvdHlwZVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICB9XG5cbiAgQXN5bmNHZW5lcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ludm9rZShcIm5leHRcIiwgYXJnKTtcbiAgfTtcblxuICBBc3luY0dlbmVyYXRvci5wcm90b3R5cGUudGhyb3cgPSBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ludm9rZShcInRocm93XCIsIGFyZyk7XG4gIH07XG5cbiAgQXN5bmNHZW5lcmF0b3IucHJvdG90eXBlLnJldHVybiA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICByZXR1cm4gdGhpcy5faW52b2tlKFwicmV0dXJuXCIsIGFyZyk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB3cmFwOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXN5bmNHZW5lcmF0b3IoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgICB9O1xuICAgIH0sXG4gICAgYXdhaXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIG5ldyBBd2FpdFZhbHVlKHZhbHVlKTtcbiAgICB9XG4gIH07XG59KCk7XG5cblxuXG5cblxudmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbnZhciBjcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfTtcbn0oKTtcblxuXG5cblxuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cblxuXG52YXIgaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59O1xuXG5cblxuXG5cbnZhciBzbGljZWRUb0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkge1xuICAgIHZhciBfYXJyID0gW107XG4gICAgdmFyIF9uID0gdHJ1ZTtcbiAgICB2YXIgX2QgPSBmYWxzZTtcbiAgICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgICBfYXJyLnB1c2goX3MudmFsdWUpO1xuXG4gICAgICAgIGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhaztcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIF9kID0gdHJ1ZTtcbiAgICAgIF9lID0gZXJyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdKSBfaVtcInJldHVyblwiXSgpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKF9kKSB0aHJvdyBfZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gX2FycjtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgcmV0dXJuIGFycjtcbiAgICB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkge1xuICAgICAgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7XG4gICAgfVxuICB9O1xufSgpO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgdG9Db25zdW1hYmxlQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gICAgcmV0dXJuIGFycjI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oYXJyKTtcbiAgfVxufTtcblxudmFyIEJhc2VDb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBCYXNlQ29udHJvbGxlcihlbCkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRjbGFzc0NhbGxDaGVjayh0aGlzLCBCYXNlQ29udHJvbGxlcik7XG5cblx0XHR0aGlzLmVsID0gZWw7XG5cblx0XHR0aGlzLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdF90aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2lzLXJlc29sdmVkJyk7XG5cblx0XHRcdHZhciBpbml0ID0gZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdFx0cmV0dXJuIHByb21pc2lmeShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIF90aGlzLmluaXQoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXHRcdFx0dmFyIHJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRcdFx0cmV0dXJuIHByb21pc2lmeShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIF90aGlzLnJlbmRlcigpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cdFx0XHR2YXIgYmluZCA9IGZ1bmN0aW9uIGJpbmQoKSB7XG5cdFx0XHRcdHJldHVybiBwcm9taXNpZnkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiBfdGhpcy5iaW5kKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIGluaXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHJlbmRlcigpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiBiaW5kKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gX3RoaXM7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRjcmVhdGVDbGFzcyhCYXNlQ29udHJvbGxlciwgW3tcblx0XHRrZXk6ICdkZXN0cm95Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0XHRcdHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtcmVzb2x2ZWQnKTtcblx0XHRcdHJldHVybiB0aGlzLnVuYmluZCgpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ3Jlc29sdmUnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiByZXNvbHZlKCkge1xuXHRcdFx0cmV0dXJuIHdhaXRGb3JET01SZWFkeSgpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2luaXQnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge31cblx0fSwge1xuXHRcdGtleTogJ3JlbmRlcicsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHt9XG5cdH0sIHtcblx0XHRrZXk6ICdiaW5kJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gYmluZCgpIHt9XG5cdH0sIHtcblx0XHRrZXk6ICd1bmJpbmQnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiB1bmJpbmQoKSB7XG5cdFx0XHRpZiAodGhpcy5faGFuZGxlcnMpIHtcblx0XHRcdFx0dGhpcy5faGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcblx0XHRcdFx0XHRsaXN0ZW5lci50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lci5ldmVudCwgbGlzdGVuZXIuaGFuZGxlciwgbGlzdGVuZXIub3B0aW9ucyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdvbicsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIG9uKG5hbWUsIGhhbmRsZXIpIHtcblx0XHRcdHZhciB0YXJnZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IG51bGw7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogZmFsc2U7XG5cblx0XHRcdHRoaXMuX2hhbmRsZXJzID0gdGhpcy5faGFuZGxlcnMgfHwgW107XG5cblx0XHRcdHZhciBfcGFyc2VFdmVudCA9IHBhcnNlKG5hbWUpLFxuXHRcdFx0ICAgIGV2ZW50ID0gX3BhcnNlRXZlbnQuZXZlbnQsXG5cdFx0XHQgICAgc2VsZWN0b3IgPSBfcGFyc2VFdmVudC5zZWxlY3RvcjtcblxuXHRcdFx0dmFyIHBhcnNlZFRhcmdldCA9ICF0YXJnZXQgPyB0aGlzLmVsIDogdGFyZ2V0O1xuXG5cdFx0XHR2YXIgd3JhcHBlZEhhbmRsZXIgPSBmdW5jdGlvbiB3cmFwcGVkSGFuZGxlcihlKSB7XG5cdFx0XHRcdGhhbmRsZXIoZSwgZS50YXJnZXQpO1xuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHNlbGVjdG9yKSB7XG5cdFx0XHRcdHdyYXBwZWRIYW5kbGVyID0gZnVuY3Rpb24gd3JhcHBlZEhhbmRsZXIoZSkge1xuXHRcdFx0XHRcdHZhciBwYXRoID0gZ2V0UGF0aChlKTtcblxuXHRcdFx0XHRcdHZhciBtYXRjaGluZ1RhcmdldCA9IHBhdGguZmluZChmdW5jdGlvbiAodGFnKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGFnLm1hdGNoZXMgJiYgdGFnLm1hdGNoZXMoc2VsZWN0b3IpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0aWYgKG1hdGNoaW5nVGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHRoYW5kbGVyKGUsIG1hdGNoaW5nVGFyZ2V0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHZhciBsaXN0ZW5lciA9IHtcblx0XHRcdFx0dGFyZ2V0OiBwYXJzZWRUYXJnZXQsXG5cdFx0XHRcdHNlbGVjdG9yOiBzZWxlY3Rvcixcblx0XHRcdFx0ZXZlbnQ6IGV2ZW50LFxuXHRcdFx0XHRoYW5kbGVyOiB3cmFwcGVkSGFuZGxlcixcblx0XHRcdFx0b3B0aW9uczogb3B0aW9uc1xuXHRcdFx0fTtcblxuXHRcdFx0bGlzdGVuZXIudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIobGlzdGVuZXIuZXZlbnQsIGxpc3RlbmVyLmhhbmRsZXIsIGxpc3RlbmVyLm9wdGlvbnMpO1xuXG5cdFx0XHR0aGlzLl9oYW5kbGVycy5wdXNoKGxpc3RlbmVyKTtcblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnb25jZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIG9uY2UobmFtZSwgaGFuZGxlcikge1xuXHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdHZhciB0YXJnZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IG51bGw7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogZmFsc2U7XG5cblx0XHRcdHZhciB3cmFwcGVkSGFuZGxlciA9IGZ1bmN0aW9uIHdyYXBwZWRIYW5kbGVyKGUsIG1hdGNoaW5nVGFyZ2V0KSB7XG5cdFx0XHRcdF90aGlzMi5vZmYobmFtZSwgdGFyZ2V0KTtcblx0XHRcdFx0aGFuZGxlcihlLCBtYXRjaGluZ1RhcmdldCk7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLm9uKG5hbWUsIHdyYXBwZWRIYW5kbGVyLCB0YXJnZXQsIG9wdGlvbnMpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ29mZicsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIG9mZihuYW1lKSB7XG5cdFx0XHR2YXIgdGFyZ2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG5cdFx0XHR2YXIgX3BhcnNlRXZlbnQyID0gcGFyc2UobmFtZSksXG5cdFx0XHQgICAgZXZlbnQgPSBfcGFyc2VFdmVudDIuZXZlbnQsXG5cdFx0XHQgICAgc2VsZWN0b3IgPSBfcGFyc2VFdmVudDIuc2VsZWN0b3I7XG5cblx0XHRcdHZhciBwYXJzZWRUYXJnZXQgPSAhdGFyZ2V0ID8gdGhpcy5lbCA6IHRhcmdldDtcblxuXHRcdFx0dmFyIGxpc3RlbmVyID0gdGhpcy5faGFuZGxlcnMuZmluZChmdW5jdGlvbiAoaGFuZGxlcikge1xuXHRcdFx0XHQvLyBTZWxlY3RvcnMgZG9uJ3QgbWF0Y2hcblx0XHRcdFx0aWYgKGhhbmRsZXIuc2VsZWN0b3IgIT09IHNlbGVjdG9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRXZlbnQgdHlwZSBkb24ndCBtYXRjaFxuXHRcdFx0XHRpZiAoaGFuZGxlci5ldmVudCAhPT0gZXZlbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBQYXNzZWQgYSB0YXJnZXQsIGJ1dCB0aGUgdGFyZ2V0cyBkb24ndCBtYXRjaFxuXHRcdFx0XHRpZiAoISFwYXJzZWRUYXJnZXQgJiYgaGFuZGxlci50YXJnZXQgIT09IHBhcnNlZFRhcmdldCkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVsc2UsIHdlIGZvdW5kIGEgbWF0Y2hcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKCEhbGlzdGVuZXIgJiYgISFsaXN0ZW5lci50YXJnZXQpIHtcblx0XHRcdFx0dGhpcy5faGFuZGxlcnMuc3BsaWNlKHRoaXMuX2hhbmRsZXJzLmluZGV4T2YobGlzdGVuZXIpLCAxKTtcblxuXHRcdFx0XHRsaXN0ZW5lci50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lci5ldmVudCwgbGlzdGVuZXIuaGFuZGxlciwgbGlzdGVuZXIub3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZW1pdCcsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGVtaXQobmFtZSkge1xuXHRcdFx0dmFyIGRhdGEgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXHRcdFx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG5cdFx0XHR2YXIgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7XG5cdFx0XHRcdGRldGFpbDogZGF0YSxcblx0XHRcdFx0YnViYmxlczogdHJ1ZSxcblx0XHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZVxuXHRcdFx0fSwgb3B0aW9ucyk7XG5cblx0XHRcdHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChuYW1lLCBwYXJhbXMpO1xuXG5cdFx0XHR0aGlzLmVsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdH1cblx0fV0pO1xuXHRyZXR1cm4gQmFzZUNvbnRyb2xsZXI7XG59KCk7XG5cbnZhciBjb252ZXJ0QXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUgPSBmdW5jdGlvbiBjb252ZXJ0QXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUoYXR0cmlidXRlKSB7XG5cdHJldHVybiBhdHRyaWJ1dGUuc3BsaXQoJy0nKS5yZWR1Y2UoZnVuY3Rpb24gKGNhbWVsY2FzZWQsIHBhcnQsIGluZGV4KSB7XG5cdFx0aWYgKGluZGV4ID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gcGFydDtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2FtZWxjYXNlZCArIHBhcnRbMF0udG9VcHBlckNhc2UoKSArIHBhcnQuc3Vic3RyKDEpO1xuXHR9KTtcbn07XG5cbnZhciBhZGRNZXRob2QgPSBmdW5jdGlvbiBhZGRNZXRob2QoY3VzdG9tRWxlbWVudCwgbmFtZSwgbWV0aG9kKSB7XG5cdGlmICh0eXBlb2YgY3VzdG9tRWxlbWVudC5wcm90b3R5cGVbbmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0Y29uc29sZS53YXJuKGN1c3RvbUVsZW1lbnQubmFtZSArICcgYWxyZWFkeSBoYXMgYSBwcm9wZXJ0eSAnICsgbmFtZSk7XG5cdH1cblxuXHRjdXN0b21FbGVtZW50LnByb3RvdHlwZVtuYW1lXSA9IG1ldGhvZDtcbn07XG5cbnZhciBhZGRHZXR0ZXIgPSBmdW5jdGlvbiBhZGRHZXR0ZXIoY3VzdG9tRWxlbWVudCwgbmFtZSwgbWV0aG9kKSB7XG5cdHZhciBnZXR0ZXJOYW1lID0gY29udmVydEF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuXG5cdGlmICh0eXBlb2YgY3VzdG9tRWxlbWVudC5wcm90b3R5cGVbZ2V0dGVyTmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0Y29uc29sZS53YXJuKGN1c3RvbUVsZW1lbnQubmFtZSArICcgYWxyZWFkeSBoYXMgYSBwcm9wZXJ0eSAnICsgZ2V0dGVyTmFtZSk7XG5cdH1cblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoY3VzdG9tRWxlbWVudC5wcm90b3R5cGUsIGdldHRlck5hbWUsIHtcblx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuXHRcdGdldDogbWV0aG9kXG5cdH0pO1xufTtcblxudmFyIGFkZFByb3BlcnR5ID0gZnVuY3Rpb24gYWRkUHJvcGVydHkoY3VzdG9tRWxlbWVudCwgbmFtZSkge1xuXHR2YXIgZ2V0dGVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuXHR2YXIgc2V0dGVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBudWxsO1xuXG5cdHZhciBwcm9wZXJ0eU5hbWUgPSBjb252ZXJ0QXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUobmFtZSk7XG5cblx0aWYgKHR5cGVvZiBjdXN0b21FbGVtZW50LnByb3RvdHlwZVtwcm9wZXJ0eU5hbWVdICE9PSAndW5kZWZpbmVkJykge1xuXHRcdGNvbnNvbGUud2FybihjdXN0b21FbGVtZW50Lm5hbWUgKyAnIGFscmVhZHkgaGFzIGEgcHJvcGVydHkgJyArIHByb3BlcnR5TmFtZSk7XG5cdH1cblxuXHR2YXIgbm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblxuXHR2YXIgcHJvcGVydHkgPSB7XG5cdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcblx0XHRnZXQ6IHR5cGVvZiBnZXR0ZXIgPT09ICdmdW5jdGlvbicgPyBnZXR0ZXIgOiBub29wLFxuXHRcdHNldDogdHlwZW9mIHNldHRlciA9PT0gJ2Z1bmN0aW9uJyA/IHNldHRlciA6IG5vb3Bcblx0fTtcblxuXHR2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY3VzdG9tRWxlbWVudC5wcm90b3R5cGUsIHByb3BlcnR5TmFtZSk7XG5cblx0aWYgKGRlc2NyaXB0b3IpIHtcblx0XHRpZiAodHlwZW9mIGRlc2NyaXB0b3Iuc2V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR2YXIgZXhpc3RpbmcgPSBkZXNjcmlwdG9yLnNldDtcblxuXHRcdFx0cHJvcGVydHkuc2V0ID0gZnVuY3Rpb24gc2V0KHRvKSB7XG5cdFx0XHRcdGV4aXN0aW5nLmNhbGwodGhpcywgdG8pO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGRlc2NyaXB0b3IuZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR2YXIgZ2VuZXJhdGVkID0gcHJvcGVydHkuZ2V0O1xuXHRcdFx0dmFyIF9leGlzdGluZyA9IGRlc2NyaXB0b3IuZ2V0O1xuXG5cdFx0XHRwcm9wZXJ0eS5nZXQgPSBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRcdHZhciB2YWx1ZSA9IF9leGlzdGluZy5jYWxsKHRoaXMpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlZC5jYWxsKHRoaXMpO1xuXHRcdFx0fTtcblx0XHR9XG5cdH1cblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoY3VzdG9tRWxlbWVudC5wcm90b3R5cGUsIHByb3BlcnR5TmFtZSwgcHJvcGVydHkpO1xufTtcblxudmFyIEF0dHJNZWRpYSA9IGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gQXR0ck1lZGlhKCkge1xuXHRcdGNsYXNzQ2FsbENoZWNrKHRoaXMsIEF0dHJNZWRpYSk7XG5cdH1cblxuXHRjcmVhdGVDbGFzcyhBdHRyTWVkaWEsIG51bGwsIFt7XG5cdFx0a2V5OiAnYXR0YWNoVG8nLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBhdHRhY2hUbyhjdXN0b21FbGVtZW50KSB7XG5cdFx0XHR2YXIgbm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblxuXHRcdFx0dmFyIHdhdGNoZXJzID0ge307XG5cblx0XHRcdC8vIEFkZHMgY3VzdG9tRWxlbWVudC5tZWRpYVxuXHRcdFx0Ly8gQHJldHVybiBzdHJpbmcgXHRcdFZhbHVlIG9mIGBtZWRpYT1cIlwiYCBhdHRyaWJ1dGVcblx0XHRcdGFkZEdldHRlcihjdXN0b21FbGVtZW50LCAnbWVkaWEnLCBmdW5jdGlvbiBnZXRNZWRpYUF0dHJpYnV0ZSgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZWwuaGFzQXR0cmlidXRlKCdtZWRpYScpID8gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ21lZGlhJykgOiBmYWxzZTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBBZGRzIGN1c3RvbUVsZW1lbnQubWF0Y2hlc01lZGlhXG5cdFx0XHQvLyBAcmV0dXJuIGJvb2wgXHRcdElmIHRoZSB2aWV3cG9ydCBjdXJyZW50bHkgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIG1lZGlhIHF1ZXJ5XG5cdFx0XHRhZGRHZXR0ZXIoY3VzdG9tRWxlbWVudCwgJ21hdGNoZXNNZWRpYScsIGZ1bmN0aW9uIG1hdGNoZXNNZWRpYSgpIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1lZGlhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJ21hdGNoTWVkaWEnIGluIHdpbmRvdyAmJiAhIXdpbmRvdy5tYXRjaE1lZGlhKHRoaXMubWVkaWEpLm1hdGNoZXM7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQWRkcyBjdXN0b21FbGVtZW50cy53aGVuTWVkaWFNYXRjaGVzKClcblx0XHRcdC8vIEByZXR1cm4gUHJvbWlzZVxuXHRcdFx0YWRkTWV0aG9kKGN1c3RvbUVsZW1lbnQsICd3aGVuTWVkaWFNYXRjaGVzJywgZnVuY3Rpb24gd2hlbk1lZGlhTWF0Y2hlcygpIHtcblx0XHRcdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdFx0XHR2YXIgZGVmZXIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuXHRcdFx0XHRcdHZhciBoYW5kbGVyID0gZnVuY3Rpb24gaGFuZGxlcihtZWRpYSkge1xuXHRcdFx0XHRcdFx0aWYgKG1lZGlhLm1hdGNoZXMpIHtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRcdFx0XHRtZWRpYS5yZW1vdmVMaXN0ZW5lcihoYW5kbGVyKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0aWYgKCdtYXRjaE1lZGlhJyBpbiB3aW5kb3cpIHtcblx0XHRcdFx0XHRcdHdhdGNoZXJzW190aGlzLm1lZGlhXSA9IHdhdGNoZXJzW190aGlzLm1lZGlhXSB8fCB3aW5kb3cubWF0Y2hNZWRpYShfdGhpcy5tZWRpYSk7XG5cdFx0XHRcdFx0XHR3YXRjaGVyc1tfdGhpcy5tZWRpYV0uYWRkTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaGFuZGxlcih3YXRjaGVyc1tfdGhpcy5tZWRpYV0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRoYW5kbGVyKHdhdGNoZXJzW190aGlzLm1lZGlhXSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiBkZWZlcjtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBBZGRzIGN1c3RvbUVsZW1lbnRzLndoZW5NZWRpYVVubWF0Y2hlcygpXG5cdFx0XHQvLyBAcmV0dXJuIFByb21pc2Vcblx0XHRcdGFkZE1ldGhvZChjdXN0b21FbGVtZW50LCAnd2hlbk1lZGlhVW5tYXRjaGVzJywgZnVuY3Rpb24gd2hlbk1lZGlhVW5tYXRjaGVzKCkge1xuXHRcdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0XHR2YXIgZGVmZXIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuXHRcdFx0XHRcdHZhciBoYW5kbGVyID0gZnVuY3Rpb24gaGFuZGxlcihtZWRpYSkge1xuXHRcdFx0XHRcdFx0aWYgKG1lZGlhLm1hdGNoZXMpIHtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRcdFx0XHRtZWRpYS5yZW1vdmVMaXN0ZW5lcihoYW5kbGVyKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0aWYgKCdtYXRjaE1lZGlhJyBpbiB3aW5kb3cpIHtcblx0XHRcdFx0XHRcdHdhdGNoZXJzW190aGlzMi5tZWRpYV0gPSB3YXRjaGVyc1tfdGhpczIubWVkaWFdIHx8IHdpbmRvdy5tYXRjaE1lZGlhKF90aGlzMi5tZWRpYSk7XG5cdFx0XHRcdFx0XHR3YXRjaGVyc1tfdGhpczIubWVkaWFdLmFkZExpc3RlbmVyKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGhhbmRsZXIod2F0Y2hlcnNbX3RoaXMyLm1lZGlhXSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGhhbmRsZXIod2F0Y2hlcnNbX3RoaXMyLm1lZGlhXSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiBkZWZlcjtcblx0XHRcdH0pO1xuXG5cdFx0XHRhZGRNZXRob2QoY3VzdG9tRWxlbWVudCwgJ3dhdGNoTWVkaWEnLCBmdW5jdGlvbiB3YXRjaE1lZGlhKCkge1xuXHRcdFx0XHR2YXIgX3RoaXMzID0gdGhpcztcblxuXHRcdFx0XHR2YXIgbWF0Y2ggPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG5vb3A7XG5cdFx0XHRcdHZhciB1bm1hdGNoID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBub29wO1xuXG5cdFx0XHRcdHZhciBoYW5kbGVyID0gZnVuY3Rpb24gaGFuZGxlcihtZWRpYSkge1xuXHRcdFx0XHRcdGlmIChtZWRpYS5tYXRjaGVzKSB7XG5cdFx0XHRcdFx0XHRtYXRjaCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR1bm1hdGNoKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmICgnbWF0Y2hNZWRpYScgaW4gd2luZG93KSB7XG5cdFx0XHRcdFx0d2F0Y2hlcnNbdGhpcy5tZWRpYV0gPSB3YXRjaGVyc1t0aGlzLm1lZGlhXSB8fCB3aW5kb3cubWF0Y2hNZWRpYSh0aGlzLm1lZGlhKTtcblx0XHRcdFx0XHR3YXRjaGVyc1t0aGlzLm1lZGlhXS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGFuZGxlcih3YXRjaGVyc1tfdGhpczMubWVkaWFdKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRoYW5kbGVyKHdhdGNoZXJzW3RoaXMubWVkaWFdKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XSk7XG5cdHJldHVybiBBdHRyTWVkaWE7XG59KCk7XG5cbnZhciBBdHRyVG91Y2hIb3ZlciA9IGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gQXR0clRvdWNoSG92ZXIoKSB7XG5cdFx0Y2xhc3NDYWxsQ2hlY2sodGhpcywgQXR0clRvdWNoSG92ZXIpO1xuXHR9XG5cblx0Y3JlYXRlQ2xhc3MoQXR0clRvdWNoSG92ZXIsIG51bGwsIFt7XG5cdFx0a2V5OiAnYXR0YWNoVG8nLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBhdHRhY2hUbyhjdXN0b21FbGVtZW50KSB7XG5cdFx0XHR2YXIgaXNUb3VjaCA9IGZhbHNlO1xuXHRcdFx0dmFyIGlzVG91Y2hlZCA9IGZhbHNlO1xuXG5cdFx0XHR2YXIgdG91Y2hDbGFzcyA9ICdpcy10b3VjaCc7XG5cdFx0XHR2YXIgaG92ZXJDbGFzcyA9ICdpcy10b3VjaC1ob3Zlcic7XG5cblx0XHRcdGFkZEdldHRlcihjdXN0b21FbGVtZW50LCAndG91Y2hIb3ZlcicsIGZ1bmN0aW9uIGdldFRvdWNoSG92ZXJBdHRyaWJ1dGUoKSB7XG5cdFx0XHRcdGlmICh0aGlzLmVsLmhhc0F0dHJpYnV0ZSgndG91Y2gtaG92ZXInKSkge1xuXHRcdFx0XHRcdC8vIEB0b2RvIC0gU3VwcG9ydCBkaWZmZXJlbnQgdmFsdWVzIGZvciB0b3VjaC1ob3ZlclxuXHRcdFx0XHRcdC8vIGBhdXRvYCAgICAgICAgZGV0ZWN0IGJhc2VkIG9uIGVsZW1lbnRcblx0XHRcdFx0XHQvLyBgdG9nZ2xlYCAgICAgIGFsd2F5cyB0b2dnbGUgaG92ZXIgb24vb2ZmICh0aGlzIG1pZ2h0IGJsb2NrIGNsaWNrcylcblx0XHRcdFx0XHQvLyBgcGFzc3Rocm91Z2hgIGlnbm9yZSBob3ZlciwgZGlyZWN0bHkgdHJpZ2dlciBhY3Rpb25cblx0XHRcdFx0XHRyZXR1cm4gJ2F1dG8nO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSk7XG5cblx0XHRcdGFkZE1ldGhvZChjdXN0b21FbGVtZW50LCAnZW5hYmxlVG91Y2hIb3ZlcicsIGZ1bmN0aW9uIGVuYWJsZVRvdWNoSG92ZXIoKSB7XG5cdFx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5vbigndG91Y2hzdGFydCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpc1RvdWNoID0gdHJ1ZTtcblx0XHRcdFx0XHRfdGhpcy5lbC5jbGFzc0xpc3QuYWRkKHRvdWNoQ2xhc3MpO1xuXHRcdFx0XHR9LCB0aGlzLmVsLCB7IHVzZUNhcHR1cmU6IHRydWUgfSk7XG5cblx0XHRcdFx0dGhpcy5vbigndG91Y2hzdGFydCcsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0dmFyIHBhdGggPSBnZXRQYXRoKGUpO1xuXG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIGhvdmVyIHdoZW4gdGFwcGluZyBvdXRzaWRlIHRoZSBET00gbm9kZVxuXHRcdFx0XHRcdGlmIChpc1RvdWNoZWQgJiYgIXBhdGguaW5jbHVkZXMoX3RoaXMuZWwpKSB7XG5cdFx0XHRcdFx0XHRpc1RvdWNoID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRpc1RvdWNoZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdF90aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoaG92ZXJDbGFzcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBkb2N1bWVudC5ib2R5LCB7IHVzZUNhcHR1cmU6IHRydWUgfSk7XG5cblx0XHRcdFx0dGhpcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlmIChfdGhpcy50b3VjaEhvdmVyKSB7XG5cdFx0XHRcdFx0XHR2YXIgaGFzQWN0aW9uID0gX3RoaXMuZWwuZ2V0QXR0cmlidXRlKCdocmVmJykgIT09ICcjJztcblxuXHRcdFx0XHRcdFx0aWYgKCFpc1RvdWNoZWQgJiYgIWhhc0FjdGlvbikge1xuXHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChpc1RvdWNoKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChoYXNBY3Rpb24pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWlzVG91Y2hlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gRmlyc3QgdGFwLCBlbmFibGUgaG92ZXIsIGJsb2NrIHRhcFxuXHRcdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aXNUb3VjaGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gU2Vjb25kIHRhcCwgZG9uJ3QgYmxvY2sgdGFwLCBkaXNhYmxlIGhvdmVyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1RvdWNoZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gQWN0IGFzIGEgc2ltcGxlIG9uL29mZiBzd2l0Y2hcblx0XHRcdFx0XHRcdFx0XHRpc1RvdWNoZWQgPSAhaXNUb3VjaGVkO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0X3RoaXMuZWwuY2xhc3NMaXN0LnRvZ2dsZShob3ZlckNsYXNzLCBpc1RvdWNoZWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgdGhpcy5lbCwgeyB1c2VDYXB0dXJlOiB0cnVlIH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XSk7XG5cdHJldHVybiBBdHRyVG91Y2hIb3Zlcjtcbn0oKTtcblxudmFyIHBhcnNlUmVzcG9uc2UgPSBmdW5jdGlvbiBwYXJzZVJlc3BvbnNlKHJlcykge1xuXHR2YXIgZGF0YSA9IGZ1bmN0aW9uIHBhcnNlUmVzb25zZVRvRGF0YSgpIHtcblx0XHQvLyBGb3JjZSBsb3dlcmNhc2Uga2V5c1xuXHRcdGlmICgodHlwZW9mIHJlcyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocmVzKSkgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmVudHJpZXMocmVzKS5yZWR1Y2UoZnVuY3Rpb24gKG9iamVjdCwgX3JlZikge1xuXHRcdFx0XHR2YXIgX3JlZjIgPSBzbGljZWRUb0FycmF5KF9yZWYsIDIpLFxuXHRcdFx0XHQgICAga2V5ID0gX3JlZjJbMF0sXG5cdFx0XHRcdCAgICB2YWx1ZSA9IF9yZWYyWzFdO1xuXG5cdFx0XHRcdHZhciBsb3dlcmNhc2VLZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcblxuXHRcdFx0XHRPYmplY3QuYXNzaWduKG9iamVjdCwgZGVmaW5lUHJvcGVydHkoe30sIGxvd2VyY2FzZUtleSwgdmFsdWUpKTtcblxuXHRcdFx0XHRyZXR1cm4gb2JqZWN0O1xuXHRcdFx0fSwge30pO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXM7XG5cdH0oKTtcblxuXHR2YXIgc3RhdHVzID0gZnVuY3Rpb24gcGFyc2VSZXNwb25zZVRvU3RhdHVzKCkge1xuXHRcdGlmIChkYXRhLnN0YXR1cykge1xuXHRcdFx0cmV0dXJuIHBhcnNlSW50KGRhdGEuc3RhdHVzLCAxMCk7XG5cdFx0fVxuXG5cdFx0aWYgKHBhcnNlSW50KGRhdGEsIDEwKS50b1N0cmluZygpID09PSBkYXRhLnRvU3RyaW5nKCkpIHtcblx0XHRcdHJldHVybiBwYXJzZUludChkYXRhLCAxMCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDIwMDtcblx0fSgpO1xuXG5cdHJldHVybiB7IHN0YXR1czogc3RhdHVzLCBkYXRhOiBkYXRhIH07XG59O1xuXG52YXIgZmV0Y2hKU09OUCA9IGZ1bmN0aW9uIGZldGNoSlNPTlAodXJsKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0Ly8gUmVnaXN0ZXIgYSBnbG9iYWwgY2FsbGJhY2tcblx0XHQvLyBNYWtlIHN1cmUgd2UgaGF2ZSBhIHVuaXF1ZSBmdW5jdGlvbiBuYW1lXG5cdFx0dmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdHZhciBjYWxsYmFjayA9ICdBSkFYX0ZPUk1fQ0FMTEJBQ0tfJyArIG5vdztcblxuXHRcdHdpbmRvd1tjYWxsYmFja10gPSBmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHQvLyBNYWtlIHRoZSBjYWxsYmFjayBhIG5vb3Bcblx0XHRcdC8vIHNvIGl0IHRyaWdnZXJzIG9ubHkgb25jZSAoanVzdCBpbiBjYXNlKVxuXHRcdFx0d2luZG93W2NhbGxiYWNrXSA9IGZ1bmN0aW9uICgpIHt9O1xuXG5cdFx0XHQvLyBDbGVhbiB1cCBhZnRlciBvdXJzZWx2ZXNcblx0XHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYWxsYmFjayk7XG5cdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuXG5cdFx0XHR2YXIgX3BhcnNlUmVzcG9uc2UgPSBwYXJzZVJlc3BvbnNlKHJlcyksXG5cdFx0XHQgICAgc3RhdHVzID0gX3BhcnNlUmVzcG9uc2Uuc3RhdHVzLFxuXHRcdFx0ICAgIGRhdGEgPSBfcGFyc2VSZXNwb25zZS5kYXRhO1xuXG5cdFx0XHQvLyBJZiByZXMgaXMgb25seSBhIHN0YXR1cyBjb2RlXG5cblxuXHRcdFx0aWYgKHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDw9IDM5OSkge1xuXHRcdFx0XHRyZXR1cm4gcmVzb2x2ZShkYXRhKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlamVjdChkYXRhKTtcblx0XHR9O1xuXG5cdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHNjcmlwdC5pZCA9IGNhbGxiYWNrO1xuXHRcdHNjcmlwdC5zcmMgPSB1cmwgKyAnJmNhbGxiYWNrPScgKyBjYWxsYmFjaztcblx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cdH0pO1xufTtcblxudmFyIGNvbnZlcnRGb3JtRGF0YVRvUXVlcnlzdHJpbmcgPSBmdW5jdGlvbiBjb252ZXJ0Rm9ybURhdGFUb1F1ZXJ5c3RyaW5nKHZhbHVlcykge1xuXHRyZXR1cm4gQXJyYXkuZnJvbSh2YWx1ZXMsIGZ1bmN0aW9uIChfcmVmKSB7XG5cdFx0dmFyIF9yZWYyID0gc2xpY2VkVG9BcnJheShfcmVmLCAyKSxcblx0XHQgICAga2V5ID0gX3JlZjJbMF0sXG5cdFx0ICAgIHJhdyA9IF9yZWYyWzFdO1xuXG5cdFx0aWYgKHJhdykge1xuXHRcdFx0dmFyIHZhbHVlID0gd2luZG93LmVuY29kZVVSSUNvbXBvbmVudChyYXcpO1xuXHRcdFx0cmV0dXJuIGtleSArICc9JyArIHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiAnJztcblx0fSkuam9pbignJicpO1xufTtcblxudmFyIGFqYXhGb3JtID0ge1xuXHRhdHRyaWJ1dGVzOiBbeyBhdHRyaWJ1dGU6ICdqc29ucCcsIHR5cGU6ICdib29sJyB9XSxcblx0Y29udHJvbGxlcjogZnVuY3Rpb24gKF9CYXNlQ29udHJvbGxlcikge1xuXHRcdGluaGVyaXRzKGNvbnRyb2xsZXIsIF9CYXNlQ29udHJvbGxlcik7XG5cblx0XHRmdW5jdGlvbiBjb250cm9sbGVyKCkge1xuXHRcdFx0Y2xhc3NDYWxsQ2hlY2sodGhpcywgY29udHJvbGxlcik7XG5cdFx0XHRyZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoY29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRyb2xsZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcblx0XHR9XG5cblx0XHRjcmVhdGVDbGFzcyhjb250cm9sbGVyLCBbe1xuXHRcdFx0a2V5OiAnaW5pdCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50cyA9IHRoaXMuZWxlbWVudHMgfHwge307XG5cdFx0XHRcdHRoaXMuZWxlbWVudHMuZm9ybSA9IHRoaXMuZWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Zvcm0nKVswXTtcblx0XHRcdFx0dGhpcy5lbGVtZW50cy5zdWNjZXNzTWVzc2FnZSA9IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtYWpheC1mb3JtLXN1Y2Nlc3MnKVswXTtcblx0XHRcdFx0dGhpcy5lbGVtZW50cy5lcnJvck1lc3NhZ2UgPSB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWFqYXgtZm9ybS1lcnJvcicpWzBdO1xuXG5cdFx0XHRcdGlmICghdGhpcy5lbGVtZW50cy5mb3JtKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKCdBY3RpdmF0ZWQgTXJBamF4Rm9ybSB3aXRob3V0IGEgZm9ybScpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudHMuZmllbGRzID0gdGhpcy5lbGVtZW50cy5mb3JtLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAncmVuZGVyJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0XHRcdC8vIFdlIGNhbiBkaXNhYmxlIHRoZSBIVE1MNSBmcm9udC1lbmQgdmFsaWRhdGlvblxuXHRcdFx0XHQvLyBhbmQgaGFuZGxlIGl0IG1vcmUgZ3JhY2VmdWxseSBpbiBKU1xuXHRcdFx0XHQvLyBAdG9kb1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRzLmZvcm0uc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdiaW5kJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBiaW5kKCkge1xuXHRcdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0XHR2YXIgcmVzZXQgPSBmdW5jdGlvbiByZXNldCgpIHtcblx0XHRcdFx0XHRpZiAoX3RoaXMyLmVsZW1lbnRzLnN1Y2Nlc3NNZXNzYWdlKSB7XG5cdFx0XHRcdFx0XHRfdGhpczIuZWxlbWVudHMuc3VjY2Vzc01lc3NhZ2Uuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnaGlkZGVuJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKF90aGlzMi5lbGVtZW50cy5lcnJvck1lc3NhZ2UpIHtcblx0XHRcdFx0XHRcdF90aGlzMi5lbGVtZW50cy5lcnJvck1lc3NhZ2Uuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnaGlkZGVuJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0cmVzZXQoKTtcblxuXHRcdFx0XHRcdHZhciBfcHJlcGFyZSA9IF90aGlzMi5wcmVwYXJlKF90aGlzMi5tZXRob2QpLFxuXHRcdFx0XHRcdCAgICB1cmwgPSBfcHJlcGFyZS51cmwsXG5cdFx0XHRcdFx0ICAgIHBhcmFtcyA9IF9wcmVwYXJlLnBhcmFtcztcblxuXHRcdFx0XHRcdF90aGlzMi5zdWJtaXQodXJsLCBwYXJhbXMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdF90aGlzMi5vblN1Y2Nlc3MoZGF0YSk7XG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdFx0X3RoaXMyLm9uRXJyb3IoZXJyKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSwgdGhpcy5lbGVtZW50cy5mb3JtKTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdwcmVwYXJlJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBwcmVwYXJlKG1ldGhvZCkge1xuXHRcdFx0XHR2YXIgX3RoaXMzID0gdGhpcztcblxuXHRcdFx0XHR2YXIgZ2V0JCQxID0gZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHRcdHZhciBxdWVyeXN0cmluZyA9IGNvbnZlcnRGb3JtRGF0YVRvUXVlcnlzdHJpbmcoX3RoaXMzLnZhbHVlcyk7XG5cdFx0XHRcdFx0dmFyIHVybCA9IF90aGlzMy5hY3Rpb24gKyAnPycgKyBxdWVyeXN0cmluZztcblx0XHRcdFx0XHR2YXIgcGFyYW1zID0ge1xuXHRcdFx0XHRcdFx0bWV0aG9kOiAnR0VUJyxcblx0XHRcdFx0XHRcdGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcblx0XHRcdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0cmV0dXJuIHsgdXJsOiB1cmwsIHBhcmFtczogcGFyYW1zIH07XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIHBvc3QgPSBmdW5jdGlvbiBwb3N0KCkge1xuXHRcdFx0XHRcdHZhciB1cmwgPSBfdGhpczMuYWN0aW9uO1xuXHRcdFx0XHRcdHZhciBwYXJhbXMgPSB7XG5cdFx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0XHRcdGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcblx0XHRcdFx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRyZXR1cm4geyB1cmw6IHVybCwgcGFyYW1zOiBwYXJhbXMgfTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAobWV0aG9kLnRvVXBwZXJDYXNlKCkgPT09ICdHRVQnKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGdldCQkMSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG1ldGhvZC50b1VwcGVyQ2FzZSgpID09PSAnUE9TVCcpIHtcblx0XHRcdFx0XHRyZXR1cm4gcG9zdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHsgdXJsOiAnLycsIHBhcmFtczogeyBtZXRob2Q6ICdHRVQnIH0gfTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdzdWJtaXQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHN1Ym1pdCh1cmwpIHtcblx0XHRcdFx0dmFyIHBhcmFtcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cblx0XHRcdFx0aWYgKHRoaXMuanNvbnApIHtcblx0XHRcdFx0XHRyZXR1cm4gZmV0Y2hKU09OUCh1cmwpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZldGNoKHVybCwgcGFyYW1zKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRpZiAocmVzLnN0YXR1cyAmJiByZXMuc3RhdHVzID09PSAyMDApIHtcblx0XHRcdFx0XHRcdHJldHVybiByZXM7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIGVycm9yID0gbmV3IEVycm9yKHJlcy5zdGF0dXNUZXh0KTtcblx0XHRcdFx0XHR0aHJvdyBlcnJvcjtcblx0XHRcdFx0fSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0dmFyIHR5cGUgPSByZXMuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpO1xuXG5cdFx0XHRcdFx0aWYgKHR5cGUgJiYgdHlwZS5pbmNsdWRlcygnYXBwbGljYXRpb24vanNvbicpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzLmpzb24oKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzLnRleHQoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuXG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnb25TdWNjZXNzJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBvblN1Y2Nlc3MocmVzKSB7XG5cdFx0XHRcdGlmICh0aGlzLmVsZW1lbnRzLnN1Y2Nlc3NNZXNzYWdlKSB7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50cy5zdWNjZXNzTWVzc2FnZS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5lbGVtZW50cy5mb3JtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50cy5mb3JtKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdvbkVycm9yJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBvbkVycm9yKGVycikge1xuXHRcdFx0XHRpZiAodGhpcy5lbGVtZW50cy5lcnJvck1lc3NhZ2UpIHtcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnRzLmVycm9yTWVzc2FnZS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnYWN0aW9uJyxcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5lbGVtZW50cy5mb3JtLmFjdGlvbjtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdtZXRob2QnLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdGlmICh0aGlzLmpzb25wKSB7XG5cdFx0XHRcdFx0cmV0dXJuICdHRVQnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICh0aGlzLmVsZW1lbnRzLmZvcm0ubWV0aG9kIHx8ICdQT1NUJykudG9VcHBlckNhc2UoKTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICd2YWx1ZXMnLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgRm9ybURhdGEodGhpcy5lbGVtZW50cy5mb3JtKTtcblx0XHRcdH1cblx0XHR9XSk7XG5cdFx0cmV0dXJuIGNvbnRyb2xsZXI7XG5cdH0oQmFzZUNvbnRyb2xsZXIpXG59O1xuXG52YXIga2V5VHJpZ2dlciA9IHtcblx0YXR0cmlidXRlczogW3sgYXR0cmlidXRlOiAna2V5JywgdHlwZTogJ2ludCcgfV0sXG5cdGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChfQmFzZUNvbnRyb2xsZXIpIHtcblx0XHRpbmhlcml0cyhjb250cm9sbGVyLCBfQmFzZUNvbnRyb2xsZXIpO1xuXG5cdFx0ZnVuY3Rpb24gY29udHJvbGxlcigpIHtcblx0XHRcdGNsYXNzQ2FsbENoZWNrKHRoaXMsIGNvbnRyb2xsZXIpO1xuXHRcdFx0cmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKGNvbnRyb2xsZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250cm9sbGVyKSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG5cdFx0fVxuXG5cdFx0Y3JlYXRlQ2xhc3MoY29udHJvbGxlciwgW3tcblx0XHRcdGtleTogJ2luaXQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzIHx8IHt9O1xuXG5cdFx0XHRcdGlmICh0aGlzLmVsLmhhc0F0dHJpYnV0ZSgnaHJlZicpKSB7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50cy50YXJnZXQgPSB0aGlzO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudHMudGFyZ2V0ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCdbaHJlZl0nKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2JpbmQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGJpbmQoKSB7XG5cdFx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHRcdGlmICh0aGlzLmVsZW1lbnRzLnRhcmdldCkge1xuXHRcdFx0XHRcdHRoaXMub24oJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmIChlLndoaWNoID09PSBfdGhpczIua2V5KSB7XG5cdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRcdFx0XHRfdGhpczIuZWxlbWVudHMudGFyZ2V0LmNsaWNrKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgZG9jdW1lbnQuYm9keSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9XSk7XG5cdFx0cmV0dXJuIGNvbnRyb2xsZXI7XG5cdH0oQmFzZUNvbnRyb2xsZXIpXG59O1xuXG52YXIgcGFyc2VNZXRhVGFnID0gZnVuY3Rpb24gcGFyc2VNZXRhVGFnKCkge1xuXHR2YXIgYmxhY2tsaXN0ID0gWyd2aWV3cG9ydCddO1xuXG5cdHJldHVybiBmdW5jdGlvbiBwYXJzZSh0YWcpIHtcblx0XHR2YXIgbmFtZSA9IHRhZy5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblx0XHR2YXIgcHJvcGVydHkgPSB0YWcuZ2V0QXR0cmlidXRlKCdwcm9wZXJ0eScpO1xuXHRcdHZhciBjb250ZW50ID0gdGFnLmdldEF0dHJpYnV0ZSgnY29udGVudCcpO1xuXG5cdFx0aWYgKCFuYW1lICYmICFwcm9wZXJ0eSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmIChibGFja2xpc3QuaW5jbHVkZXMobmFtZSkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4geyBuYW1lOiBuYW1lLCBwcm9wZXJ0eTogcHJvcGVydHksIGNvbnRlbnQ6IGNvbnRlbnQgfTtcblx0fTtcbn0oKTtcblxudmFyIHBhcnNlSFRNTCA9IGZ1bmN0aW9uIHBhcnNlSFRNTCgpIHtcblx0dmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gcGFyc2UoaHRtbCkge1xuXHRcdHZhciBzZWxlY3RvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuXHRcdHZhciBwYXJzZWQgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWwsICd0ZXh0L2h0bWwnKTtcblxuXHRcdC8vIEdldCBkb2N1bWVudCB0aXRsZVxuXHRcdHZhciB0aXRsZSA9IHBhcnNlZC50aXRsZTtcblxuXHRcdC8vIEdldCBkb2N1bWVudCBub2Rlc1xuXHRcdHZhciBjb250ZW50ID0gcGFyc2VkLmJvZHk7XG5cblx0XHRpZiAoc2VsZWN0b3IpIHtcblx0XHRcdGNvbnRlbnQgPSBwYXJzZWQuYm9keS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblxuXHRcdFx0aWYgKCFjb250ZW50KSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignbm90LWZvdW5kJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IGRvY3VtZW50IG1ldGFcblx0XHR2YXIgbWV0YSA9IEFycmF5LmZyb20ocGFyc2VkLmhlYWQucXVlcnlTZWxlY3RvckFsbCgnbWV0YScpLCBmdW5jdGlvbiAodGFnKSB7XG5cdFx0XHRyZXR1cm4gcGFyc2VNZXRhVGFnKHRhZyk7XG5cdFx0fSkuZmlsdGVyKGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRyZXR1cm4gISF0O1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHsgdGl0bGU6IHRpdGxlLCBjb250ZW50OiBjb250ZW50LCBtZXRhOiBtZXRhIH07XG5cdH07XG59KCk7XG5cbmZ1bmN0aW9uIHJlbmRlck5vZGVzKGNvbnRlbnQsIGNvbnRhaW5lcikge1xuXHR3aGlsZSAoY29udGFpbmVyLmhhc0NoaWxkTm9kZXMoKSkge1xuXHRcdGNvbnRhaW5lci5yZW1vdmVDaGlsZChjb250YWluZXIuZmlyc3RDaGlsZCk7XG5cdH1cblxuXHRmb3IgKHZhciBpID0gY29udGVudC5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGkgLT0gMSkge1xuXHRcdHZhciBjaGlsZCA9IGNvbnRlbnQuY2hpbGRyZW5baV07XG5cblx0XHRBcnJheS5mcm9tKGNvbnRlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpLCBmdW5jdGlvbiAoaW1nKSB7XG5cdFx0XHR2YXIgY2xvbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblx0XHRcdGNsb25lLnNyYyA9IGltZy5zcmM7XG5cdFx0XHRjbG9uZS5zaXplcyA9IGltZy5zaXplcztcblx0XHRcdGNsb25lLnNyY3NldCA9IGltZy5zcmNzZXQ7XG5cdFx0XHRjbG9uZS5jbGFzc05hbWUgPSBpbWcuY2xhc3NOYW1lO1xuXG5cdFx0XHRpZiAoaW1nLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSkge1xuXHRcdFx0XHRjbG9uZS53aWR0aCA9IGltZy53aWR0aDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGltZy5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKSB7XG5cdFx0XHRcdGNsb25lLmhlaWdodCA9IGltZy5oZWlnaHQ7XG5cdFx0XHR9XG5cblx0XHRcdGltZy5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjbG9uZSwgaW1nKTtcblxuXHRcdFx0cmV0dXJuIGNsb25lO1xuXHRcdH0pO1xuXG5cdFx0aWYgKGNvbnRhaW5lci5maXJzdENoaWxkKSB7XG5cdFx0XHRjb250YWluZXIuaW5zZXJ0QmVmb3JlKGNoaWxkLCBjb250YWluZXIuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZCk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGNsZWFuTm9kZXMobm9kZXMsIHNlbGVjdG9yKSB7XG5cdGlmICghc2VsZWN0b3IgfHwgQXJyYXkuaXNBcnJheShzZWxlY3RvcikgJiYgc2VsZWN0b3IubGVuZ3RoID09PSAwKSB7XG5cdFx0cmV0dXJuIG5vZGVzO1xuXHR9XG5cblx0dmFyIHN0cmluZ1NlbGVjdG9yID0gQXJyYXkuaXNBcnJheShzZWxlY3RvcikgPyBzZWxlY3Rvci5qb2luKCcsICcpIDogc2VsZWN0b3I7XG5cblx0dmFyIGJsb2F0ID0gQXJyYXkuZnJvbShub2Rlcy5xdWVyeVNlbGVjdG9yQWxsKHN0cmluZ1NlbGVjdG9yKSk7XG5cblx0YmxvYXQuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuXHRcdHJldHVybiBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG5cdH0pO1xuXG5cdHJldHVybiBub2Rlcztcbn1cblxudmFyIG92ZXJsYXkgPSB7XG5cdGF0dHJpYnV0ZXM6IFtdLFxuXHRjb250cm9sbGVyOiBmdW5jdGlvbiAoX0Jhc2VDb250cm9sbGVyKSB7XG5cdFx0aW5oZXJpdHMoY29udHJvbGxlciwgX0Jhc2VDb250cm9sbGVyKTtcblxuXHRcdGZ1bmN0aW9uIGNvbnRyb2xsZXIoKSB7XG5cdFx0XHRjbGFzc0NhbGxDaGVjayh0aGlzLCBjb250cm9sbGVyKTtcblx0XHRcdHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChjb250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udHJvbGxlcikpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuXHRcdH1cblxuXHRcdGNyZWF0ZUNsYXNzKGNvbnRyb2xsZXIsIFt7XG5cdFx0XHRrZXk6ICdpbml0Jyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0XHQvLyBTdG9yZSB0aGUgb3JpZ2luYWwgY2xhc3NlcyBzbyB3ZSBjYW4gYWx3YXlzIHJldmVydCBiYWNrIHRvIHRoZSBkZWZhdWx0IHN0YXRlXG5cdFx0XHRcdC8vIHdoaWxlIHJlbmRlcmluZyBpbiBkaWZmZXJlbnQgYXNwZWN0c1xuXHRcdFx0XHR0aGlzLm9yaWdpbmFsQ2xhc3NlcyA9IEFycmF5LmZyb20odGhpcy5lbC5jbGFzc0xpc3QpO1xuXG5cdFx0XHRcdHRoaXMuc3RyaXBGcm9tUmVzcG9uc2UgPSBbJ2xpbmtbcmVsPVwidXBcIl0nLCB0aGlzLmVsLnRhZ05hbWVdO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcbiAgICAqIFRoaXMgbWV0aG9kIGdldHMgcnVuIHdoZW4gYSBgPG1yLW92ZXJsYXk+YFxuICAgICogYXBwZWFycyBpbiB0aGUgRE9NLCBlaXRoZXIgYWZ0ZXIgRE9NIHJlYWR5XG4gICAgKiBvciB3aGVuIEhUTUwgZ2V0cyBhdHRhY2hlZCBsYXRlciBvbiBpbiB0aGUgYnJvd3Npbmcgc2Vzc2lvblxuICAgICovXG5cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdyZW5kZXInLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdFx0Ly8gU3RvcmUgdGhlIG9yaWdpbmFsIGNsYXNzZXMgc28gd2UgY2FuIGFsd2F5cyByZXZlcnQgYmFjayB0byB0aGUgZGVmYXVsdCBzdGF0ZVxuXHRcdFx0XHQvLyB3aGlsZSByZW5kZXJpbmcgaW4gZGlmZmVyZW50IGFzcGVjdHNcblx0XHRcdFx0dGhpcy5vcmlnaW5hbENsYXNzZXMgPSBBcnJheS5mcm9tKHRoaXMuZWwuY2xhc3NMaXN0KTtcblxuXHRcdFx0XHQvLyBBZGQgPGxpbmsgcmVsPVwidXBcIiBocmVmPVwiL1wiPiBpbnNpZGUgYW4gb3ZlcmxheSB0byBmZXRjaCBhIGJhY2tncm91bmQgdmlld1xuXHRcdFx0XHR2YXIgdXBMaW5rID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCdsaW5rW3JlbD1cInVwXCJdJyk7XG5cblx0XHRcdFx0aWYgKHVwTGluaykge1xuXHRcdFx0XHRcdHZhciBocmVmID0gdXBMaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXG5cdFx0XHRcdFx0ZmV0Y2goaHJlZiwgeyBjcmVkZW50aWFsczogJ2luY2x1ZGUnIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlcy50ZXh0KCk7XG5cdFx0XHRcdFx0fSkudGhlbihmdW5jdGlvbiAoaHRtbCkge1xuXHRcdFx0XHRcdFx0dmFyIF9wYXJzZUhUTUwgPSBwYXJzZUhUTUwoaHRtbCksXG5cdFx0XHRcdFx0XHQgICAgdGl0bGUgPSBfcGFyc2VIVE1MLnRpdGxlLFxuXHRcdFx0XHRcdFx0ICAgIGNvbnRlbnQgPSBfcGFyc2VIVE1MLmNvbnRlbnQ7XG5cblx0XHRcdFx0XHRcdGlmIChjb250ZW50KSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjb250ZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKF90aGlzMi5lbC50YWdOYW1lKVswXSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBjbGFzc0xpc3QgPSBjb250ZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKF90aGlzMi5lbC50YWdOYW1lKVswXS5jbGFzc0xpc3Q7XG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMyLm9yaWdpbmFsQ2xhc3NlcyA9IEFycmF5LmZyb20oY2xhc3NMaXN0KTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBDbGVhbiBjZXJ0YWluIHNlbGVjdG9ycyBmcm9tIHRoZSB1cCBzdGF0ZSB0byBhdm9pZCBpbmZpbml0ZSBsb29wc1xuXHRcdFx0XHRcdFx0XHR2YXIgY2xlYW4gPSBjbGVhbk5vZGVzKGNvbnRlbnQsIF90aGlzMi5zdHJpcEZyb21SZXNwb25zZSk7XG5cblx0XHRcdFx0XHRcdFx0cmVuZGVyTm9kZXMoY2xlYW4sIGZyYWdtZW50KTtcblxuXHRcdFx0XHRcdFx0XHRfdGhpczIuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZnJhZ21lbnQsIF90aGlzMi5lbCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gVGhlIHVwU3RhdGUgaXMgbm90IHRoZSBvdmVybGF5IHZpZXcgYnV0IHRoZSBiYWNrZ3JvdW5kIHZpZXdcblx0XHRcdFx0XHRcdFx0X3RoaXMyLnVwU3RhdGUgPSB7XG5cdFx0XHRcdFx0XHRcdFx0aHJlZjogaHJlZixcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogdGl0bGUsXG5cdFx0XHRcdFx0XHRcdFx0cm9vdDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRieTogX3RoaXMyLmVsLnRhZ05hbWVcblx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0XHQvLyBXZSBuZWVkIHRvIHJlcGxhY2UgdGhlIGN1cnJlbnQgc3RhdGUgdG8gaGFuZGxlIGBwb3BzdGF0ZWBcblx0XHRcdFx0XHRcdFx0dmFyIHN0YXRlID0ge1xuXHRcdFx0XHRcdFx0XHRcdGhyZWY6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBkb2N1bWVudC50aXRsZSxcblx0XHRcdFx0XHRcdFx0XHRyb290OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRieTogX3RoaXMyLmVsLnRhZ05hbWVcblx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoc3RhdGUsIHN0YXRlLnRpdGxlLCBzdGF0ZS5ocmVmKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBTZXQgaXNTaG93biBzbyB0aGF0IHRoZSBjbG9zaW5nIGhhbmRsZXIgd29ya3MgY29ycmVjdGx5XG5cdFx0XHRcdFx0XHRcdF90aGlzMi5pc1Nob3duID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBDdXJyZW50bHkgbm90IGluc2lkZSBhbiBvdmVybGF5IHZpZXcsIGJ1dCBhbiBvdmVybGF5IG1pZ2h0IG9wZW5cblx0XHRcdFx0XHQvLyAoYmVjYXVzZSBhbiBlbXB0eSA8bXItb3ZlcmxheT4gaXMgcHJlc2VudClcblx0XHRcdFx0XHQvLyBzbyB3ZSBzdG9yZSB0aGUgY3VycmVudCBzdGF0ZSB0byBzdXBwb3J0IGBwb3BzdGF0ZWAgZXZlbnRzXG5cdFx0XHRcdFx0dmFyIHRpdGxlID0gZG9jdW1lbnQudGl0bGU7XG5cdFx0XHRcdFx0dmFyIF9ocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cblx0XHRcdFx0XHR0aGlzLnVwU3RhdGUgPSB7XG5cdFx0XHRcdFx0XHRocmVmOiBfaHJlZixcblx0XHRcdFx0XHRcdHRpdGxlOiB0aXRsZSxcblx0XHRcdFx0XHRcdHJvb3Q6IHRydWUsXG5cdFx0XHRcdFx0XHRieTogdGhpcy5lbC50YWdOYW1lXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh0aGlzLnVwU3RhdGUsIHRpdGxlLCBfaHJlZik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdiaW5kJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBiaW5kKCkge1xuXHRcdFx0XHR2YXIgX3RoaXMzID0gdGhpcztcblxuXHRcdFx0XHR2YXIgaGlkZUhhbmRsZXIgPSBmdW5jdGlvbiBoaWRlSGFuZGxlcihlKSB7XG5cdFx0XHRcdFx0aWYgKF90aGlzMy5pc1Nob3duKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdF90aGlzMy5oaWRlKCk7XG5cblx0XHRcdFx0XHRcdGlmIChfdGhpczMudXBTdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3VwU3RhdGUgPSBfdGhpczMudXBTdGF0ZSxcblx0XHRcdFx0XHRcdFx0ICAgIHRpdGxlID0gX3VwU3RhdGUudGl0bGUsXG5cdFx0XHRcdFx0XHRcdCAgICBocmVmID0gX3VwU3RhdGUuaHJlZjtcblxuXG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShfdGhpczMudXBTdGF0ZSwgdGl0bGUsIGhyZWYpO1xuXHRcdFx0XHRcdFx0XHRkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aWYgKGUudGFyZ2V0ID09PSBfdGhpczMuZWwpIHtcblx0XHRcdFx0XHRcdGhpZGVIYW5kbGVyKGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgdGhpcy5lbCk7XG5cblx0XHRcdFx0dGhpcy5vbignY2xpY2sgLmpzLW92ZXJsYXktc2hvdycsIGZ1bmN0aW9uIChlLCB0YXJnZXQpIHtcblx0XHRcdFx0XHR2YXIgaHJlZiA9IHRhcmdldC5ocmVmO1xuXG5cdFx0XHRcdFx0aWYgKGhyZWYpIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdF90aGlzMy5zaG93KGhyZWYpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgZG9jdW1lbnQuYm9keSk7XG5cblx0XHRcdFx0dGhpcy5vbignY2xpY2sgLmpzLW92ZXJsYXktaGlkZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aGlkZUhhbmRsZXIoZSk7XG5cdFx0XHRcdH0sIGRvY3VtZW50LmJvZHkpO1xuXG5cdFx0XHRcdHRoaXMub24oJ3BvcHN0YXRlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHQvLyBPbmx5IGhhbmRsZSBzdGF0ZXMgdGhhdCB3ZXJlIHNldCBieSBgbXItb3ZlcmxheWBcblx0XHRcdFx0XHQvLyB0byBhdm9pZCBtZXNzaW5nIHdpdGggb3RoZXIgZWxlbWVudHMgdGhhdCB1c2UgdGhlIEhpc3RvcnkgQVBJXG5cdFx0XHRcdFx0aWYgKGUuc3RhdGUgJiYgZS5zdGF0ZS5ieSA9PT0gX3RoaXMzLmVsLnRhZ05hbWUgJiYgZS5zdGF0ZS5ocmVmKSB7XG5cdFx0XHRcdFx0XHR2YXIgX2Ukc3RhdGUgPSBlLnN0YXRlLFxuXHRcdFx0XHRcdFx0ICAgIGhyZWYgPSBfZSRzdGF0ZS5ocmVmLFxuXHRcdFx0XHRcdFx0ICAgIHRpdGxlID0gX2Ukc3RhdGUudGl0bGU7XG5cdFx0XHRcdFx0XHR2YXIgX3VwU3RhdGUyID0gX3RoaXMzLnVwU3RhdGUsXG5cdFx0XHRcdFx0XHQgICAgdXBIcmVmID0gX3VwU3RhdGUyLmhyZWYsXG5cdFx0XHRcdFx0XHQgICAgdXBUaXRsZSA9IF91cFN0YXRlMi50aXRsZTtcblxuXHRcdFx0XHRcdFx0dmFyIGhhc1JlcXVlc3RlZFVwU3RhdGUgPSBocmVmID09PSB1cEhyZWYgJiYgdGl0bGUgPT09IHVwVGl0bGU7XG5cblx0XHRcdFx0XHRcdGlmIChlLnN0YXRlLnJvb3QgJiYgaGFzUmVxdWVzdGVkVXBTdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHQvLyBUcmlnZ2VyIGhpZGUoKSBpZiB0aGUgcG9wc3RhdGUgcmVxdWVzdHMgdGhlIHJvb3Qgdmlld1xuXHRcdFx0XHRcdFx0XHRfdGhpczMuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRkb2N1bWVudC50aXRsZSA9IF90aGlzMy51cFN0YXRlLnRpdGxlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Ly8gU2hvdyB0aGUgb3ZlcmxheSgpIGlmIHdlIGNsb3NlZCB0aGUgb3ZlcmxheSBiZWZvcmVcblx0XHRcdFx0XHRcdFx0X3RoaXMzLnNob3coZS5zdGF0ZS5ocmVmLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB3aW5kb3cpO1xuXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3Nob3cnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHNob3coaHJlZikge1xuXHRcdFx0XHR2YXIgX3RoaXM0ID0gdGhpcztcblxuXHRcdFx0XHR2YXIgcHVzaFN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0cnVlO1xuXG5cdFx0XHRcdHZhciB1cGRhdGVNZXRhVGFncyA9IGZ1bmN0aW9uIHVwZGF0ZU1ldGFUYWdzKHRhZ3MpIHtcblx0XHRcdFx0XHR0YWdzLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xuXHRcdFx0XHRcdFx0dmFyIHNlbGVjdG9yID0gJ21ldGEnO1xuXG5cdFx0XHRcdFx0XHRpZiAodGFnLnByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3IgKyAnW3Byb3BlcnR5PVwiJyArIHRhZy5wcm9wZXJ0eSArICdcIl0nO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAodGFnLm5hbWUpIHtcblx0XHRcdFx0XHRcdFx0c2VsZWN0b3IgPSBzZWxlY3RvciArICdbbmFtZT1cIicgKyB0YWcubmFtZSArICdcIl0nO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgbWF0Y2ggPSBkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG5cdFx0XHRcdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0XHRcdFx0bWF0Y2guc2V0QXR0cmlidXRlKCdjb250ZW50JywgdGFnLmNvbnRlbnQpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmFyIGFwcGVuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21ldGEnKTtcblx0XHRcdFx0XHRcdFx0YXBwZW5kLnByb3BlcnR5ID0gdGFnLnByb3BlcnR5O1xuXHRcdFx0XHRcdFx0XHRhcHBlbmQuY29udGVudCA9IHRhZy5jb250ZW50O1xuXHRcdFx0XHRcdFx0XHRhcHBlbmQubmFtZSA9IHRhZy5uYW1lO1xuXHRcdFx0XHRcdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGFwcGVuZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmFyIHJlbmRlckNvbnRlbnQgPSBmdW5jdGlvbiByZW5kZXJDb250ZW50KGNvbnRlbnQpIHtcblx0XHRcdFx0XHR2YXIgbmV3Q2xhc3NlcyA9IEFycmF5LmZyb20oY29udGVudC5jbGFzc0xpc3QpO1xuXHRcdFx0XHRcdF90aGlzNC5lbC5jbGFzc05hbWUgPSAnJztcblx0XHRcdFx0XHQvLyBUaGlzIGNyYXNoZXMgaW4gSUUxMVxuXHRcdFx0XHRcdC8vIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi5uZXdDbGFzc2VzKTtcblx0XHRcdFx0XHRuZXdDbGFzc2VzLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBfdGhpczQuZWwuY2xhc3NMaXN0LmFkZChjKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdF90aGlzNC5pc1Nob3duID0gdHJ1ZTtcblxuXHRcdFx0XHRcdC8vIENsZWFuIGNlcnRhaW4gc2VsZWN0b3JzIGZyb20gdGhlIHVwIHN0YXRlIHRvIGF2b2lkIGluZmluaXRlIGxvb3BzXG5cdFx0XHRcdFx0dmFyIGNsZWFuID0gY2xlYW5Ob2Rlcyhjb250ZW50LCBfdGhpczQuc3RyaXBGcm9tUmVzcG9uc2UpO1xuXG5cdFx0XHRcdFx0cmVuZGVyTm9kZXMoY2xlYW4sIF90aGlzNC5lbCk7XG5cblx0XHRcdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdF90aGlzNC5lbC5zY3JvbGxUb3AgPSAwO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciB1cGRhdGVUaXRsZSA9IGZ1bmN0aW9uIHVwZGF0ZVRpdGxlKHRpdGxlKSB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXR1cm4gZmV0Y2goaHJlZiwgeyBjcmVkZW50aWFsczogJ2luY2x1ZGUnIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdHJldHVybiByZXMudGV4dCgpO1xuXHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChodG1sKSB7XG5cdFx0XHRcdFx0dmFyIF9wYXJzZUhUTUwyID0gcGFyc2VIVE1MKGh0bWwsIF90aGlzNC5lbC50YWdOYW1lKSxcblx0XHRcdFx0XHQgICAgdGl0bGUgPSBfcGFyc2VIVE1MMi50aXRsZSxcblx0XHRcdFx0XHQgICAgY29udGVudCA9IF9wYXJzZUhUTUwyLmNvbnRlbnQsXG5cdFx0XHRcdFx0ICAgIG1ldGEgPSBfcGFyc2VIVE1MMi5tZXRhO1xuXG5cdFx0XHRcdFx0dXBkYXRlTWV0YVRhZ3MobWV0YSk7XG5cblx0XHRcdFx0XHRpZiAoY29udGVudCkge1xuXHRcdFx0XHRcdFx0cmVuZGVyQ29udGVudChjb250ZW50KTtcblx0XHRcdFx0XHRcdHVwZGF0ZVRpdGxlKHRpdGxlKTtcblxuXHRcdFx0XHRcdFx0aWYgKHB1c2hTdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgc3RhdGUgPSB7IGhyZWY6IGhyZWYsIHRpdGxlOiB0aXRsZSwgYnk6IF90aGlzNC5lbC50YWdOYW1lIH07XG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZSwgdGl0bGUsIGhyZWYpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnaGlkZScsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaGlkZSgpIHtcblx0XHRcdFx0dmFyIF90aGlzNSA9IHRoaXM7XG5cblx0XHRcdFx0dGhpcy5pc1Nob3duID0gZmFsc2U7XG5cblx0XHRcdFx0d2hpbGUgKHRoaXMuZWwuaGFzQ2hpbGROb2RlcygpKSB7XG5cdFx0XHRcdFx0dGhpcy5lbC5yZW1vdmVDaGlsZCh0aGlzLmVsLmZpcnN0Q2hpbGQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMub3JpZ2luYWxDbGFzc2VzICYmIEFycmF5LmlzQXJyYXkodGhpcy5vcmlnaW5hbENsYXNzZXMpKSB7XG5cdFx0XHRcdFx0dGhpcy5lbC5jbGFzc05hbWUgPSAnJztcblxuXHRcdFx0XHRcdC8vIFRoaXMgY3Jhc2hlcyBpbiBJRTExXG5cdFx0XHRcdFx0Ly8gdGhpcy5lbC5jbGFzc0xpc3QuYWRkKC4uLnRoaXMub3JpZ2luYWxDbGFzc2VzKTtcblx0XHRcdFx0XHR0aGlzLm9yaWdpbmFsQ2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gX3RoaXM1LmVsLmNsYXNzTGlzdC5hZGQoYyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdpc1Nob3duJyxcblxuXHRcdFx0LyoqXG4gICAgKiBgaXNTaG93bmAgaXMgYSBib29sZWFuIHRoYXQgdHJhY2tzXG4gICAgKiBpZiB0aGUgb3ZlcmxheSBpcyBjdXJyZW50bHkgb3BlbiBvciBub3RcbiAgICAqICovXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0cmV0dXJuICEhdGhpcy5faXNTaG93bjtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uIHNldCQkMSh0bykge1xuXHRcdFx0XHR0aGlzLl9pc1Nob3duID0gISF0bztcblx0XHRcdFx0dGhpcy5lbC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1oaWRkZW4nLCAhdGhpcy5faXNTaG93bik7XG5cdFx0XHRcdHRoaXMuZWwuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2hvd24nLCB0aGlzLl9pc1Nob3duKTtcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zaG93aW5nLW92ZXJsYXknLCB0aGlzLl9pc1Nob3duKTtcblx0XHRcdH1cblxuXHRcdFx0LyoqXG4gICAgKiBPcmlnaW5hbCBzdGF0ZSBpcyB0aGUgSGlzdG9yeSBBUEkgc3RhdGUgZm9yIHRoZSBwYXJlbnQgcGFnZVxuICAgICogKHRoZSBwYWdlIGJlbG93IHRoZSBvdmVybGF5KVxuICAgICogKG5vdCBuZWNjZXNhcmlseSB0aGUgZmlyc3QgcGFnZSB0aGF0IHdhcyBsb2FkZWQpXG4gICAgKiAqL1xuXG5cdFx0fSwge1xuXHRcdFx0a2V5OiAndXBTdGF0ZScsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3VwU3RhdGUpO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24gc2V0JCQxKHRvKSB7XG5cdFx0XHRcdHRoaXMuX3VwU3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0byk7XG5cdFx0XHR9XG5cdFx0fV0pO1xuXHRcdHJldHVybiBjb250cm9sbGVyO1xuXHR9KEJhc2VDb250cm9sbGVyKVxufTtcblxudmFyIGdldE1ldGFWYWx1ZXMgPSBmdW5jdGlvbiBnZXRNZXRhVmFsdWVzKCkge1xuXHR2YXIgbm9kZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZG9jdW1lbnQuaGVhZDtcblx0dmFyIHNlbGVjdG9yID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAnJztcblxuXHR2YXIgZXh0cmFjdEtleSA9IGZ1bmN0aW9uIGV4dHJhY3RLZXkodGFnKSB7XG5cdFx0dmFyIHJhdyA9IHRhZy5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblxuXHRcdGlmICghcmF3KSB7XG5cdFx0XHRyYXcgPSB0YWcuZ2V0QXR0cmlidXRlKCdwcm9wZXJ0eScpO1xuXHRcdH1cblxuXHRcdHZhciBzdHJpcHBlZCA9IHJhdy5tYXRjaCgvXig/Oi4qOik/KC4qKSQvaSk7XG5cblx0XHRpZiAoc3RyaXBwZWQpIHtcblx0XHRcdHJldHVybiBzdHJpcHBlZFsxXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fTtcblxuXHR2YXIgdGFncyA9IFtdLmNvbmNhdCh0b0NvbnN1bWFibGVBcnJheShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ21ldGEnICsgc2VsZWN0b3IpKSk7XG5cblx0Ly8gR2V0IDxtZXRhPiB2YWx1ZXNcblx0cmV0dXJuIHRhZ3MucmVkdWNlKGZ1bmN0aW9uIChjYXJyeSwgdGFnKSB7XG5cdFx0dmFyIGtleSA9IGV4dHJhY3RLZXkodGFnKTtcblxuXHRcdGlmIChrZXkpIHtcblx0XHRcdHZhciB2YWx1ZSA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnKTtcblx0XHRcdE9iamVjdC5hc3NpZ24oY2FycnksIGRlZmluZVByb3BlcnR5KHt9LCBrZXksIHZhbHVlKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNhcnJ5O1xuXHR9LCB7fSk7XG59O1xuXG52YXIgZ2VuZXJhdGVRdWVyeXN0cmluZyA9IGZ1bmN0aW9uIGdlbmVyYXRlUXVlcnlzdHJpbmcocGFyYW1zKSB7XG5cdHZhciBxdWVyeXN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHBhcmFtcykubWFwKGZ1bmN0aW9uIChfcmVmKSB7XG5cdFx0dmFyIF9yZWYyID0gc2xpY2VkVG9BcnJheShfcmVmLCAyKSxcblx0XHQgICAga2V5ID0gX3JlZjJbMF0sXG5cdFx0ICAgIHZhbHVlID0gX3JlZjJbMV07XG5cblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHZhciBlbmNvZGVkID0gd2luZG93LmVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4ga2V5ICsgJz0nICsgZW5jb2RlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gJyc7XG5cdH0pLmZpbHRlcihmdW5jdGlvbiAocGFyYW0pIHtcblx0XHRyZXR1cm4gISFwYXJhbTtcblx0fSkuam9pbignJicpO1xuXG5cdGlmIChxdWVyeXN0cmluZy5sZW5ndGggPiAwKSB7XG5cdFx0cmV0dXJuICc/JyArIHF1ZXJ5c3RyaW5nO1xuXHR9XG5cblx0cmV0dXJuICcnO1xufTtcblxudmFyIG9wZW5XaW5kb3cgPSBmdW5jdGlvbiBvcGVuV2luZG93KGhyZWYpIHtcblx0dmFyIHBhcmFtcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuXHR2YXIgcXVlcnlzdHJpbmcgPSBnZW5lcmF0ZVF1ZXJ5c3RyaW5nKHBhcmFtcyk7XG5cdHZhciBuYW1lID0gb3B0aW9ucy5uYW1lLFxuXHQgICAgaW52aXNpYmxlID0gb3B0aW9ucy5pbnZpc2libGU7XG5cblxuXHRpZiAoaW52aXNpYmxlKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uID0gJycgKyBocmVmICsgcXVlcnlzdHJpbmc7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIHdpZHRoID0gb3B0aW9ucy53aWR0aCxcblx0ICAgIGhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xuXG5cblx0d2lkdGggPSB3aWR0aCB8fCA1NjA7XG5cdGhlaWdodCA9IGhlaWdodCB8fCA0MjA7XG5cblx0dmFyIHggPSBNYXRoLnJvdW5kKCh3aW5kb3cuaW5uZXJXaWR0aCAtIHdpZHRoKSAvIDIpO1xuXHR2YXIgeSA9IE1hdGgucm91bmQoKHdpbmRvdy5pbm5lckhlaWdodCAtIGhlaWdodCkgLyAyKTtcblxuXHR2YXIgcG9wdXAgPSB3aW5kb3cub3BlbignJyArIGhyZWYgKyBxdWVyeXN0cmluZywgbmFtZSwgJ3dpZHRoPScgKyB3aWR0aCArICcsIGhlaWdodD0nICsgaGVpZ2h0ICsgJywgbGVmdD0nICsgeCArICcsIHRvcD0nICsgeSk7XG5cblx0aWYgKHR5cGVvZiBwb3B1cC5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHBvcHVwLmZvY3VzKCk7XG5cdH1cbn07XG5cbnZhciBzaGFyZSA9IHtcblx0YXR0cmlidXRlczogW10sXG5cdGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChfQmFzZUNvbnRyb2xsZXIpIHtcblx0XHRpbmhlcml0cyhjb250cm9sbGVyLCBfQmFzZUNvbnRyb2xsZXIpO1xuXG5cdFx0ZnVuY3Rpb24gY29udHJvbGxlcigpIHtcblx0XHRcdGNsYXNzQ2FsbENoZWNrKHRoaXMsIGNvbnRyb2xsZXIpO1xuXHRcdFx0cmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKGNvbnRyb2xsZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250cm9sbGVyKSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG5cdFx0fVxuXG5cdFx0Y3JlYXRlQ2xhc3MoY29udHJvbGxlciwgW3tcblx0XHRcdGtleTogJ2luaXQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudHMgPSB7fTtcblxuXHRcdFx0XHR0aGlzLmVsZW1lbnRzLmZhY2Vib29rID0gdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1zaGFyZS1mYWNlYm9vaycpWzBdO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRzLnR3aXR0ZXIgPSB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXNoYXJlLXR3aXR0ZXInKVswXTtcblx0XHRcdFx0dGhpcy5lbGVtZW50cy5waW50ZXJlc3QgPSB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXNoYXJlLXBpbnRlcmVzdCcpWzBdO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRzLm1haWwgPSB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXNoYXJlLW1haWwnKVswXTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdiaW5kJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBiaW5kKCkge1xuXHRcdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0XHRpZiAodGhpcy5lbGVtZW50cy5mYWNlYm9vaykge1xuXHRcdFx0XHRcdHRoaXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRfdGhpczIuc2hhcmVPbkZhY2Vib29rKCk7XG5cdFx0XHRcdFx0fSwgdGhpcy5lbGVtZW50cy5mYWNlYm9vayk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5lbGVtZW50cy50d2l0dGVyKSB7XG5cdFx0XHRcdFx0dGhpcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdF90aGlzMi5zaGFyZU9uVHdpdHRlcigpO1xuXHRcdFx0XHRcdH0sIHRoaXMuZWxlbWVudHMudHdpdHRlcik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5lbGVtZW50cy5waW50ZXJlc3QpIHtcblx0XHRcdFx0XHR0aGlzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0X3RoaXMyLnNoYXJlT25QaW50ZXJlc3QoKTtcblx0XHRcdFx0XHR9LCB0aGlzLmVsZW1lbnRzLnBpbnRlcmVzdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5lbGVtZW50cy5tYWlsKSB7XG5cdFx0XHRcdFx0dGhpcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdF90aGlzMi5zaGFyZVZpYU1haWwoKTtcblx0XHRcdFx0XHR9LCB0aGlzLmVsZW1lbnRzLm1haWwpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnc2hhcmVPbkZhY2Vib29rJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBzaGFyZU9uRmFjZWJvb2soKSB7XG5cdFx0XHRcdHZhciB2YWx1ZXMgPSBnZXRNZXRhVmFsdWVzKGRvY3VtZW50LmhlYWQsICdbcHJvcGVydHlePVwib2c6XCJdJyk7XG5cblx0XHRcdFx0dmFyIHBhcmFtcyA9IHtcblx0XHRcdFx0XHR1OiB2YWx1ZXMudXJsIHx8IHRoaXMudXJsLFxuXHRcdFx0XHRcdHRpdGxlOiB2YWx1ZXMudGl0bGUgfHwgdGhpcy50aXRsZSxcblx0XHRcdFx0XHRjYXB0aW9uOiB2YWx1ZXMuc2l0ZV9uYW1lLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiB2YWx1ZXMuZGVzY3JpcHRpb24gfHwgdGhpcy5kZXNjcmlwdGlvblxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHZhciBpc0Fic29sdXRlVXJsID0gL14oaHR0cHM/Oik/XFwvXFwvL2k7XG5cblx0XHRcdFx0aWYgKGlzQWJzb2x1dGVVcmwudGVzdCh2YWx1ZXMuaW1hZ2UpKSB7XG5cdFx0XHRcdFx0cGFyYW1zLnBpY3R1cmUgPSB2YWx1ZXMuaW1hZ2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvcGVuV2luZG93KCdodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyLnBocCcsIHBhcmFtcywgeyBuYW1lOiAnU2hhcmUgb24gRmFjZWJvb2snLCB3aWR0aDogNTYwLCBoZWlnaHQ6IDYzMCB9KTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdzaGFyZU9uUGludGVyZXN0Jyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBzaGFyZU9uUGludGVyZXN0KCkge1xuXHRcdFx0XHR2YXIgdmFsdWVzID0gZ2V0TWV0YVZhbHVlcyhkb2N1bWVudC5oZWFkLCAnW3Byb3BlcnR5Xj1cIm9nOlwiXScpO1xuXG5cdFx0XHRcdHZhciBwYXJhbXMgPSB7XG5cdFx0XHRcdFx0dXJsOiB2YWx1ZXMudXJsIHx8IHRoaXMudXJsLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiB2YWx1ZXMuZGVzY3JpcHRpb24gfHwgdGhpcy5kZXNjcmlwdGlvbixcblx0XHRcdFx0XHR0b29sYmFyOiAnbm8nLFxuXHRcdFx0XHRcdG1lZGlhOiB2YWx1ZXMuaW1hZ2Vcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRvcGVuV2luZG93KCdodHRwczovL3d3dy5waW50ZXJlc3QuY29tL3Bpbi9jcmVhdGUvYnV0dG9uJywgcGFyYW1zLCB7IG5hbWU6ICdTaGFyZSBvbiBQaW50ZXJlc3QnLCB3aWR0aDogNzQwLCBoZWlnaHQ6IDcwMCB9KTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdzaGFyZU9uVHdpdHRlcicsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gc2hhcmVPblR3aXR0ZXIoKSB7XG5cdFx0XHRcdHZhciB2YWx1ZXMgPSBnZXRNZXRhVmFsdWVzKGRvY3VtZW50LmhlYWQsICdbbmFtZV49XCJ0d2l0dGVyOlwiXScpO1xuXG5cdFx0XHRcdHZhciBwYXJhbXMgPSB7XG5cdFx0XHRcdFx0dXJsOiB2YWx1ZXMudXJsIHx8IHRoaXMudXJsLFxuXHRcdFx0XHRcdHRleHQ6IHZhbHVlcy50aXRsZSB8fCB0aGlzLnRpdGxlLFxuXHRcdFx0XHRcdHZpYTogdmFsdWVzLnNpdGUgPyB2YWx1ZXMuc2l0ZS5yZXBsYWNlKCdAJywgJycpIDogdW5kZWZpbmVkXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0b3BlbldpbmRvdygnaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQnLCBwYXJhbXMsIHsgbmFtZTogJ1NoYXJlIG9uIFR3aXR0ZXInLCB3aWR0aDogNTgwLCBoZWlnaHQ6IDI1MyB9KTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdzaGFyZVZpYU1haWwnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHNoYXJlVmlhTWFpbCgpIHtcblx0XHRcdFx0dmFyIHBhcmFtcyA9IHtcblx0XHRcdFx0XHRzdWJqZWN0OiB0aGlzLnRpdGxlLFxuXHRcdFx0XHRcdGJvZHk6IHRoaXMudGl0bGUgKyAnICgnICsgdGhpcy51cmwgKyAnKSAtICcgKyB0aGlzLmRlc2NyaXB0aW9uXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0b3BlbldpbmRvdygnbWFpbHRvOicsIHBhcmFtcywgeyBpbnZpc2libGU6IHRydWUgfSk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAndGl0bGUnLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdHZhciBhdHRyaWJ1dGUgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSgnbXItc2hhcmUtdGl0bGUnKTtcblx0XHRcdFx0dmFyIGZhbGxiYWNrID0gZG9jdW1lbnQudGl0bGU7XG5cdFx0XHRcdHJldHVybiBhdHRyaWJ1dGUgfHwgZmFsbGJhY2s7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnZGVzY3JpcHRpb24nLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdHZhciBhdHRyaWJ1dGUgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSgnbXItc2hhcmUtZGVzY3JpcHRpb24nKTtcblx0XHRcdFx0dmFyIGZhbGxiYWNrID0gJyc7XG5cblx0XHRcdFx0dmFyIHRhZyA9IGRvY3VtZW50LmhlYWQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPVwiZGVzY3JpcHRpb25cIicpO1xuXG5cdFx0XHRcdGlmICh0YWcpIHtcblx0XHRcdFx0XHRmYWxsYmFjayA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBhdHRyaWJ1dGUgfHwgZmFsbGJhY2s7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAndXJsJyxcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHR2YXIgYXR0cmlidXRlID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ21yLXNoYXJlLXVybCcpO1xuXHRcdFx0XHR2YXIgZmFsbGJhY2sgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuXHRcdFx0XHR2YXIgdGFnID0gZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKCdsaW5rW3JlbD1cImNhbm9uaWNhbFwiXScpO1xuXG5cdFx0XHRcdGlmICh0YWcpIHtcblx0XHRcdFx0XHRmYWxsYmFjayA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBhdHRyaWJ1dGUgfHwgZmFsbGJhY2s7XG5cdFx0XHR9XG5cdFx0fV0pO1xuXHRcdHJldHVybiBjb250cm9sbGVyO1xuXHR9KEJhc2VDb250cm9sbGVyKVxufTtcblxudmFyIHNtb290aFN0YXRlID0ge1xuXHRhdHRyaWJ1dGVzOiBbXSxcblx0Y29udHJvbGxlcjogZnVuY3Rpb24gKF9CYXNlQ29udHJvbGxlcikge1xuXHRcdGluaGVyaXRzKGNvbnRyb2xsZXIsIF9CYXNlQ29udHJvbGxlcik7XG5cblx0XHRmdW5jdGlvbiBjb250cm9sbGVyKCkge1xuXHRcdFx0Y2xhc3NDYWxsQ2hlY2sodGhpcywgY29udHJvbGxlcik7XG5cdFx0XHRyZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoY29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRyb2xsZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcblx0XHR9XG5cblx0XHRjcmVhdGVDbGFzcyhjb250cm9sbGVyLCBbe1xuXHRcdFx0a2V5OiAnYWRkVG9QYXRoJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBhZGRUb1BhdGgoaHJlZikge1xuXHRcdFx0XHQvLyBNYWtlIHN1cmUgYGhyZWZgIGlzIGFuIGFic29sdXRlIHBhdGggZnJvbSB0aGUgLyByb290IG9mIHRoZSBjdXJyZW50IHNpdGVcblx0XHRcdFx0dmFyIGFic29sdXRlUGF0aCA9IGhyZWYucmVwbGFjZSh3aW5kb3cubG9jYXRpb24ub3JpZ2luLCAnJyk7XG5cdFx0XHRcdGFic29sdXRlUGF0aCA9IGFic29sdXRlUGF0aFswXSAhPT0gJy8nID8gJy8nICsgYWJzb2x1dGVQYXRoIDogYWJzb2x1dGVQYXRoO1xuXG5cdFx0XHRcdHRoaXMuX3BhdGggPSB0aGlzLl9wYXRoIHx8IFtdO1xuXG5cdFx0XHRcdHZhciBmcm9tID0gdm9pZCAwO1xuXG5cdFx0XHRcdGlmICh0aGlzLl9wYXRoLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRmcm9tID0gdGhpcy5fcGF0aFt0aGlzLl9wYXRoLmxlbmd0aCAtIDFdLnRvO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHBhdGhFbnRyeSA9IHtcblx0XHRcdFx0XHRmcm9tOiBmcm9tLFxuXHRcdFx0XHRcdHRvOiBhYnNvbHV0ZVBhdGhcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLl9wYXRoLnB1c2gocGF0aEVudHJ5KTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdyZW1vdmVMYXRlc3RGcm9tUGF0aCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlTGF0ZXN0RnJvbVBhdGgoKSB7XG5cdFx0XHRcdCh0aGlzLl9wYXRoIHx8IFtdKS5wb3AoKTtcblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAncHVzaFN0YXRlJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBwdXNoU3RhdGUoaHJlZikge1xuXHRcdFx0XHR2YXIgdGl0bGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICcnO1xuXHRcdFx0XHR2YXIgYWRkVG9QYXRoID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB0cnVlO1xuXG5cdFx0XHRcdHZhciBzdGF0ZSA9IHsgaHJlZjogaHJlZiwgdGl0bGU6IHRpdGxlIH07XG5cblx0XHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlLCB0aXRsZSwgaHJlZik7XG5cblx0XHRcdFx0aWYgKGFkZFRvUGF0aCkge1xuXHRcdFx0XHRcdHRoaXMuYWRkVG9QYXRoKGhyZWYpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAncmVwbGFjZVN0YXRlJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiByZXBsYWNlU3RhdGUoaHJlZikge1xuXHRcdFx0XHR2YXIgdGl0bGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICcnO1xuXHRcdFx0XHR2YXIgYWRkVG9QYXRoID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB0cnVlO1xuXG5cdFx0XHRcdHZhciBzdGF0ZSA9IHsgaHJlZjogaHJlZiwgdGl0bGU6IHRpdGxlIH07XG5cblx0XHRcdFx0d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHN0YXRlLCB0aXRsZSwgaHJlZik7XG5cblx0XHRcdFx0aWYgKGFkZFRvUGF0aCkge1xuXHRcdFx0XHRcdHRoaXMuYWRkVG9QYXRoKGhyZWYpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnaW5pdCcsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdFx0dmFyIGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdFx0dmFyIHRpdGxlID0gZG9jdW1lbnQudGl0bGU7XG5cblx0XHRcdFx0dGhpcy5yZXBsYWNlU3RhdGUoaHJlZiwgdGl0bGUpO1xuXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2JpbmQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGJpbmQoKSB7XG5cdFx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHRcdHRoaXMub24oJ3BvcHN0YXRlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpZiAoZS5zdGF0ZSAmJiBlLnN0YXRlLmhyZWYpIHtcblx0XHRcdFx0XHRcdF90aGlzMi5nb1RvKGUuc3RhdGUuaHJlZiwgZmFsc2UpLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKCdDb3VsZCBub3QgcnVuIHBvcHN0YXRlIHRvJywgZS5zdGF0ZS5ocmVmKTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKCdFcnJvcjonLCBlcnIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB3aW5kb3cpO1xuXG5cdFx0XHRcdHRoaXMub24oJ2NsaWNrIGEnLCBmdW5jdGlvbiAoZSwgdGFyZ2V0KSB7XG5cdFx0XHRcdFx0aWYgKHRhcmdldC5jbGFzc0xpc3QgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnanMtbXItc21vb3RoLXN0YXRlLWRpc2FibGUnKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEF2b2lkIGNyb3NzLW9yaWdpbiBjYWxsc1xuXHRcdFx0XHRcdGlmICghdGFyZ2V0Lmhvc3RuYW1lIHx8IHRhcmdldC5ob3N0bmFtZSAhPT0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIGhyZWYgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cblx0XHRcdFx0XHRpZiAoIWhyZWYpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybignQ2xpY2sgb24gbGluayB3aXRob3V0IGhyZWYnKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRcdF90aGlzMi5nb1RvKGhyZWYpLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybignQ291bGQgbm90IG5hdmlnYXRlIHRvJywgaHJlZik7XG5cdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ0Vycm9yOicsIGVycik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sIGRvY3VtZW50LmJvZHkpO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2dvVG8nLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGdvVG8oaHJlZikge1xuXHRcdFx0XHR2YXIgX3RoaXMzID0gdGhpcztcblxuXHRcdFx0XHR2YXIgcHVzaFN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0cnVlO1xuXG5cdFx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzbW9vdGhTdGF0ZTpiZWZvcmUnKSk7XG5cblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2lzLWxvYWRpbmcnKTtcblxuXHRcdFx0XHRcdF90aGlzMy5hZGRUb1BhdGgoaHJlZik7XG5cblx0XHRcdFx0XHR2YXIgY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKGVycikge1xuXHRcdFx0XHRcdFx0X3RoaXMzLnJlbW92ZUxhdGVzdEZyb21QYXRoKCk7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0dmFyIHRyYW5zaXRpb24gPSB7fTtcblx0XHRcdFx0XHR0cmFuc2l0aW9uLmNvbnRhaW5lciA9IF90aGlzMy5lbDtcblx0XHRcdFx0XHR0cmFuc2l0aW9uLnBhdGggPSBPYmplY3QuYXNzaWduKF90aGlzMy5sYXRlc3RQYXRoRW50cnkpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIF90aGlzMy5vbkJlZm9yZSh0cmFuc2l0aW9uKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGZldGNoKGhyZWYsIHsgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyB9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlcy50ZXh0KCk7XG5cdFx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChodG1sKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBfcGFyc2VIVE1MID0gcGFyc2VIVE1MKGh0bWwsICdtci1zbW9vdGgtc3RhdGUnKSxcblx0XHRcdFx0XHRcdFx0ICAgIHRpdGxlID0gX3BhcnNlSFRNTC50aXRsZSxcblx0XHRcdFx0XHRcdFx0ICAgIGNvbnRlbnQgPSBfcGFyc2VIVE1MLmNvbnRlbnQ7XG5cblx0XHRcdFx0XHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzbW9vdGhTdGF0ZTpzdGFydCcpKTtcblxuXHRcdFx0XHRcdFx0XHR0cmFuc2l0aW9uLmZldGNoZWQgPSB7IHRpdGxlOiB0aXRsZSwgY29udGVudDogY29udGVudCB9O1xuXG5cdFx0XHRcdFx0XHRcdF90aGlzMy5vblN0YXJ0KHRyYW5zaXRpb24pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc21vb3RoU3RhdGU6cmVhZHknKSk7XG5cblx0XHRcdFx0XHRcdFx0XHRfdGhpczMub25SZWFkeSh0cmFuc2l0aW9uKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBfdHJhbnNpdGlvbiRmZXRjaGVkID0gdHJhbnNpdGlvbi5mZXRjaGVkLFxuXHRcdFx0XHRcdFx0XHRcdFx0ICAgIHZlcmlmaWVkVGl0bGUgPSBfdHJhbnNpdGlvbiRmZXRjaGVkLnRpdGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0ICAgIHZlcmlmaWVkQ29udGVudCA9IF90cmFuc2l0aW9uJGZldGNoZWQuY29udGVudDtcblxuXG5cdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVuZGVyTm9kZXModmVyaWZpZWRDb250ZW50LCBfdGhpczMuZWwpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkb2N1bWVudC50aXRsZSA9IHZlcmlmaWVkVGl0bGU7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHB1c2hTdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIERvbid0IGFkZCB0aGUgc3RhdGUgdG8gdGhlIHBhdGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRfdGhpczMucHVzaFN0YXRlKGhyZWYsIHZlcmlmaWVkVGl0bGUsIGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtbG9hZGluZycpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzbW9vdGhTdGF0ZTphZnRlcicpKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFlvdSBjYW4ndCBjYW5jZWwgdGhlIHRyYW5zaXRpb24gYWZ0ZXIgdGhlIHB1c2hTdGF0ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFNvIHdlIGFsc28gcmVzb2x2ZSBpbnNpZGUgdGhlIGNhdGNoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0X3RoaXMzLm9uQWZ0ZXIodHJhbnNpdGlvbikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzb2x2ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiByZXNvbHZlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhbmNlbChlcnIpO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhbmNlbChlcnIpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhbmNlbChlcnIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNhbmNlbChlcnIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdvbkJlZm9yZScsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gb25CZWZvcmUodHJhbnNpdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRyYW5zaXRpb24pO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ29uU3RhcnQnLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIG9uU3RhcnQodHJhbnNpdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRyYW5zaXRpb24pO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ29uUmVhZHknLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIG9uUmVhZHkodHJhbnNpdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRyYW5zaXRpb24pO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ29uQWZ0ZXInLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIG9uQWZ0ZXIodHJhbnNpdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRyYW5zaXRpb24pO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ3BhdGgnLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9wYXRoIHx8IFtdO1xuXHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdGtleTogJ2xhdGVzdFBhdGhFbnRyeScsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0dmFyIGxlbmd0aCA9IHRoaXMucGF0aC5sZW5ndGg7XG5cblx0XHRcdFx0aWYgKGxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5wYXRoW2xlbmd0aCAtIDFdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHR9XSk7XG5cdFx0cmV0dXJuIGNvbnRyb2xsZXI7XG5cdH0oQmFzZUNvbnRyb2xsZXIpXG59O1xuXG52YXIgdGltZUFnbyA9IHtcblx0YXR0cmlidXRlczogWydkYXRldGltZSddLFxuXHRjb250cm9sbGVyOiBmdW5jdGlvbiAoX0Jhc2VDb250cm9sbGVyKSB7XG5cdFx0aW5oZXJpdHMoY29udHJvbGxlciwgX0Jhc2VDb250cm9sbGVyKTtcblxuXHRcdGZ1bmN0aW9uIGNvbnRyb2xsZXIoKSB7XG5cdFx0XHRjbGFzc0NhbGxDaGVjayh0aGlzLCBjb250cm9sbGVyKTtcblx0XHRcdHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChjb250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udHJvbGxlcikpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuXHRcdH1cblxuXHRcdGNyZWF0ZUNsYXNzKGNvbnRyb2xsZXIsIFt7XG5cdFx0XHRrZXk6ICdyZXNvbHZlJyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiByZXNvbHZlKCkge1xuXHRcdFx0XHQvLyBObyBuZWVkIHRvIHdhaXQgZm9yIHdpbmRvdy5vbmxvYWRcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdpbml0Jyxcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0XHR0aGlzLnRyYW5zbGF0aW9ucyA9IHtcblx0XHRcdFx0XHRhZ286ICdhZ28nLFxuXHRcdFx0XHRcdHllYXI6IFsneWVhcicsICd5ZWFycyddLFxuXHRcdFx0XHRcdG1vbnRoOiBbJ21vbnRoJywgJ21vbnRocyddLFxuXHRcdFx0XHRcdHdlZWs6IFsnd2VlaycsICd3ZWVrcyddLFxuXHRcdFx0XHRcdGRheTogWydkYXknLCAnZGF5cyddLFxuXHRcdFx0XHRcdGhvdXI6IFsnaG91cicsICdob3VycyddLFxuXHRcdFx0XHRcdG1pbnV0ZTogWydtaW51dGUnLCAnbWludXRlcyddLFxuXHRcdFx0XHRcdHNlY29uZDogWydzZWNvbmQnLCAnc2Vjb25kcyddXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0a2V5OiAnZ2V0Q291bnRlZE5vdW4nLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGdldENvdW50ZWROb3VuKGtleSkge1xuXHRcdFx0XHR2YXIgY291bnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDE7XG5cblx0XHRcdFx0aWYgKCF0aGlzLnRyYW5zbGF0aW9uc1trZXldKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnRyYW5zbGF0aW9uc1trZXldID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnRyYW5zbGF0aW9uc1trZXldO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvdW50ID09PSAxKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMudHJhbnNsYXRpb25zW2tleV1bMF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdGhpcy50cmFuc2xhdGlvbnNba2V5XVsxXTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdyZW5kZXInLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdFx0dmFyIG1ha2VSZWFkYWJsZSA9IGZ1bmN0aW9uIG1ha2VSZWFkYWJsZShkYXRldGltZSkge1xuXHRcdFx0XHRcdHZhciBkYXRlID0gbmV3IERhdGUoZGF0ZXRpbWUpO1xuXHRcdFx0XHRcdHZhciB0aW1lID0gZGF0ZS5nZXRUaW1lKCk7XG5cdFx0XHRcdFx0dmFyIG5vdyA9IG5ldyBEYXRlKCk7XG5cdFx0XHRcdFx0dmFyIGNhbGN1bGF0ZWQgPSB2b2lkIDA7XG5cblx0XHRcdFx0XHRpZiAoIWlzTmFOKHRpbWUpKSB7XG5cdFx0XHRcdFx0XHR2YXIgZGlmZiA9IE1hdGguZmxvb3Iobm93LmdldFRpbWUoKSAtIHRpbWUpO1xuXG5cdFx0XHRcdFx0XHRjYWxjdWxhdGVkID0ge307XG5cdFx0XHRcdFx0XHRjYWxjdWxhdGVkLnNlY29uZHMgPSBNYXRoLnJvdW5kKGRpZmYgLyAxMDAwKTtcblx0XHRcdFx0XHRcdGNhbGN1bGF0ZWQubWludXRlcyA9IE1hdGgucm91bmQoY2FsY3VsYXRlZC5zZWNvbmRzIC8gNjApO1xuXHRcdFx0XHRcdFx0Y2FsY3VsYXRlZC5ob3VycyA9IE1hdGgucm91bmQoY2FsY3VsYXRlZC5taW51dGVzIC8gNjApO1xuXHRcdFx0XHRcdFx0Y2FsY3VsYXRlZC5kYXlzID0gTWF0aC5yb3VuZChjYWxjdWxhdGVkLmhvdXJzIC8gMjQpO1xuXHRcdFx0XHRcdFx0Y2FsY3VsYXRlZC53ZWVrcyA9IE1hdGgucm91bmQoY2FsY3VsYXRlZC5kYXlzIC8gNyk7XG5cdFx0XHRcdFx0XHRjYWxjdWxhdGVkLm1vbnRocyA9IE1hdGgucm91bmQoY2FsY3VsYXRlZC53ZWVrcyAvIDQpO1xuXHRcdFx0XHRcdFx0Y2FsY3VsYXRlZC55ZWFycyA9IE1hdGgucm91bmQoY2FsY3VsYXRlZC5tb250aHMgLyAxMik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGNhbGN1bGF0ZWQpIHtcblx0XHRcdFx0XHRcdGlmIChjYWxjdWxhdGVkLm1vbnRocyA+IDEyKSB7XG5cdFx0XHRcdFx0XHRcdHZhciB5ZWFycyA9IF90aGlzMi5nZXRDb3VudGVkTm91bigneWVhcicsIGNhbGN1bGF0ZWQueWVhcnMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsY3VsYXRlZC55ZWFycyArICcgJyArIHllYXJzICsgJyAnICsgX3RoaXMyLnRyYW5zbGF0aW9ucy5hZ287XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGNhbGN1bGF0ZWQud2Vla3MgPiA3KSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtb250aHMgPSBfdGhpczIuZ2V0Q291bnRlZE5vdW4oJ21vbnRoJywgY2FsY3VsYXRlZC5tb250aHMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsY3VsYXRlZC5tb250aHMgKyAnICcgKyBtb250aHMgKyAnICcgKyBfdGhpczIudHJhbnNsYXRpb25zLmFnbztcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoY2FsY3VsYXRlZC5kYXlzID4gMjEpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHdlZWtzID0gX3RoaXMyLmdldENvdW50ZWROb3VuKCd3ZWVrJywgY2FsY3VsYXRlZC53ZWVrcyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBjYWxjdWxhdGVkLndlZWtzICsgJyAnICsgd2Vla3MgKyAnICcgKyBfdGhpczIudHJhbnNsYXRpb25zLmFnbztcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoY2FsY3VsYXRlZC5ob3VycyA+IDI0KSB7XG5cdFx0XHRcdFx0XHRcdHZhciBkYXlzID0gX3RoaXMyLmdldENvdW50ZWROb3VuKCdkYXknLCBjYWxjdWxhdGVkLmRheXMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsY3VsYXRlZC5kYXlzICsgJyAnICsgZGF5cyArICcgJyArIF90aGlzMi50cmFuc2xhdGlvbnMuYWdvO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjYWxjdWxhdGVkLm1pbnV0ZXMgPiA2MCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgaG91cnMgPSBfdGhpczIuZ2V0Q291bnRlZE5vdW4oJ2hvdXInLCBjYWxjdWxhdGVkLmhvdXJzKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhbGN1bGF0ZWQuaG91cnMgKyAnICcgKyBob3VycyArICcgJyArIF90aGlzMi50cmFuc2xhdGlvbnMuYWdvO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjYWxjdWxhdGVkLnNlY29uZHMgPiA2MCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbWludXRlcyA9IF90aGlzMi5nZXRDb3VudGVkTm91bignbWludXRlJywgY2FsY3VsYXRlZC5taW51dGVzKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhbGN1bGF0ZWQubWludXRlcyArICcgJyArIG1pbnV0ZXMgKyAnICcgKyBfdGhpczIudHJhbnNsYXRpb25zLmFnbztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIHNlY29uZHMgPSBfdGhpczIuZ2V0Q291bnRlZE5vdW4oJ3NlY29uZCcsIGNhbGN1bGF0ZWQuc2Vjb25kcyk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsY3VsYXRlZC5zZWNvbmRzICsgJyAnICsgc2Vjb25kcyArICcgJyArIF90aGlzMi50cmFuc2xhdGlvbnMuYWdvO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIERvIG5vdGhpbmcgaWYgd2UgY2FuJ3QgY2FsY3VsYXRlIGEgdGltZSBkaWZmXG5cdFx0XHRcdFx0cmV0dXJuIF90aGlzMi5lbC50ZXh0Q29udGVudDtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHR0aGlzLmVsLnRleHRDb250ZW50ID0gbWFrZVJlYWRhYmxlKHRoaXMuZGF0ZXRpbWUpO1xuXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH1dKTtcblx0XHRyZXR1cm4gY29udHJvbGxlcjtcblx0fShCYXNlQ29udHJvbGxlcilcbn07XG5cbnZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xuXG52YXIgZ2VuZXJhdGVTdHJpbmdBdHRyaWJ1dGVNZXRob2RzID0gZnVuY3Rpb24gZ2VuZXJhdGVTdHJpbmdBdHRyaWJ1dGVNZXRob2RzKGF0dHJpYnV0ZSkge1xuXHR2YXIgZ2V0dGVyID0gZnVuY3Rpb24gZ2V0dGVyKCkge1xuXHRcdHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpIHx8IHVuZGVmaW5lZDtcblx0fTtcblxuXHR2YXIgc2V0dGVyID0gZnVuY3Rpb24gc2V0dGVyKHRvKSB7XG5cdFx0dmFyIHBhcnNlZCA9IHRvICYmIHRvLnRvU3RyaW5nID8gdG8udG9TdHJpbmcoKSA6IHVuZGVmaW5lZDtcblx0XHR2YXIgb2xkVmFsdWUgPSB0aGlzW2F0dHJpYnV0ZV07XG5cblx0XHRpZiAocGFyc2VkID09PSBvbGRWYWx1ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChwYXJzZWQpIHtcblx0XHRcdHRoaXMuZWwuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgcGFyc2VkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHsgZ2V0dGVyOiBnZXR0ZXIsIHNldHRlcjogc2V0dGVyIH07XG59O1xuXG52YXIgZ2VuZXJhdGVCb29sQXR0cmlidXRlTWV0aG9kcyA9IGZ1bmN0aW9uIGdlbmVyYXRlQm9vbEF0dHJpYnV0ZU1ldGhvZHMoYXR0cmlidXRlKSB7XG5cdHZhciBnZXR0ZXIgPSBmdW5jdGlvbiBnZXR0ZXIoKSB7XG5cdFx0cmV0dXJuICEhdGhpcy5lbC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKTtcblx0fTtcblxuXHR2YXIgc2V0dGVyID0gZnVuY3Rpb24gc2V0dGVyKHRvKSB7XG5cdFx0dmFyIHBhcnNlZCA9IHR5cGVvZiB0byA9PT0gJ3N0cmluZycgfHwgISF0bztcblx0XHR2YXIgb2xkVmFsdWUgPSB0aGlzW2F0dHJpYnV0ZV07XG5cblx0XHRpZiAocGFyc2VkID09PSBvbGRWYWx1ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChwYXJzZWQpIHtcblx0XHRcdHRoaXMuZWwuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgJycpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4geyBnZXR0ZXI6IGdldHRlciwgc2V0dGVyOiBzZXR0ZXIgfTtcbn07XG5cbnZhciBnZW5lcmF0ZUludGVnZXJBdHRyaWJ1dGVNZXRob2RzID0gZnVuY3Rpb24gZ2VuZXJhdGVJbnRlZ2VyQXR0cmlidXRlTWV0aG9kcyhhdHRyaWJ1dGUpIHtcblx0dmFyIGdldHRlciA9IGZ1bmN0aW9uIGdldHRlcigpIHtcblx0XHRyZXR1cm4gcGFyc2VJbnQodGhpcy5lbC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSwgMTApO1xuXHR9O1xuXG5cdHZhciBzZXR0ZXIgPSBmdW5jdGlvbiBzZXR0ZXIodG8pIHtcblx0XHR2YXIgcGFyc2VkID0gcGFyc2VJbnQodG8sIDEwKTtcblx0XHR2YXIgb2xkVmFsdWUgPSB0aGlzW2F0dHJpYnV0ZV07XG5cblx0XHRpZiAocGFyc2VkID09PSBvbGRWYWx1ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcblx0XHRcdHRoaXMuZWwuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgcGFyc2VkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS53YXJuKCdDb3VsZCBub3Qgc2V0ICcgKyBhdHRyaWJ1dGUgKyAnIHRvICcgKyB0byk7XG5cdFx0XHR0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4geyBnZXR0ZXI6IGdldHRlciwgc2V0dGVyOiBzZXR0ZXIgfTtcbn07XG5cbnZhciBnZW5lcmF0ZU51bWJlckF0dHJpYnV0ZU1ldGhvZHMgPSBmdW5jdGlvbiBnZW5lcmF0ZU51bWJlckF0dHJpYnV0ZU1ldGhvZHMoYXR0cmlidXRlKSB7XG5cdHZhciBnZXR0ZXIgPSBmdW5jdGlvbiBnZXR0ZXIoKSB7XG5cdFx0cmV0dXJuIHBhcnNlRmxvYXQodGhpcy5lbC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSk7XG5cdH07XG5cblx0dmFyIHNldHRlciA9IGZ1bmN0aW9uIHNldHRlcih0bykge1xuXHRcdHZhciBwYXJzZWQgPSBwYXJzZUZsb2F0KHRvKTtcblx0XHR2YXIgb2xkVmFsdWUgPSB0aGlzW2F0dHJpYnV0ZV07XG5cblx0XHRpZiAocGFyc2VkID09PSBvbGRWYWx1ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcblx0XHRcdHRoaXMuZWwuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgcGFyc2VkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS53YXJuKCdDb3VsZCBub3Qgc2V0ICcgKyBhdHRyaWJ1dGUgKyAnIHRvICcgKyB0byk7XG5cdFx0XHR0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4geyBnZXR0ZXI6IGdldHRlciwgc2V0dGVyOiBzZXR0ZXIgfTtcbn07XG5cbnZhciBnZW5lcmF0ZUF0dHJpYnV0ZU1ldGhvZHMgPSBmdW5jdGlvbiBnZW5lcmF0ZUF0dHJpYnV0ZU1ldGhvZHMoYXR0cmlidXRlKSB7XG5cdHZhciB0eXBlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAnc3RyaW5nJztcblxuXHRpZiAodHlwZSA9PT0gJ2Jvb2wnKSB7XG5cdFx0cmV0dXJuIGdlbmVyYXRlQm9vbEF0dHJpYnV0ZU1ldGhvZHMoYXR0cmlidXRlKTtcblx0fSBlbHNlIGlmICh0eXBlID09PSAnaW50JyB8fCB0eXBlID09PSAnaW50ZWdlcicpIHtcblx0XHRyZXR1cm4gZ2VuZXJhdGVJbnRlZ2VyQXR0cmlidXRlTWV0aG9kcyhhdHRyaWJ1dGUpO1xuXHR9IGVsc2UgaWYgKHR5cGUgPT09ICdmbG9hdCcgfHwgdHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRyZXR1cm4gZ2VuZXJhdGVOdW1iZXJBdHRyaWJ1dGVNZXRob2RzKGF0dHJpYnV0ZSk7XG5cdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gZ2VuZXJhdGVTdHJpbmdBdHRyaWJ1dGVNZXRob2RzKGF0dHJpYnV0ZSk7XG5cdH1cblx0cmV0dXJuIHsgZ2V0dGVyOiBub29wLCBzZXR0ZXI6IG5vb3AgfTtcbn07XG5cbnZhciBDT05UUk9MTEVSID0gU3ltYm9sKCdjb250cm9sbGVyJyk7XG5cbnZhciByZWdpc3RlckVsZW1lbnQgPSBmdW5jdGlvbiByZWdpc3RlckVsZW1lbnQodGFnLCBvcHRpb25zKSB7XG5cdHZhciBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBvcHRpb25zLm9ic2VydmVkQXR0cmlidXRlcyB8fCBbXTtcblxuXHRjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnLCBmdW5jdGlvbiAoX0hUTUxFbGVtZW50KSB7XG5cdFx0aW5oZXJpdHMoX2NsYXNzLCBfSFRNTEVsZW1lbnQpO1xuXHRcdGNyZWF0ZUNsYXNzKF9jbGFzcywgW3tcblx0XHRcdGtleTogJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaycsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG5cdFx0XHRcdGlmIChvbGRWYWx1ZSA9PT0gbmV3VmFsdWUpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIXRoaXNbQ09OVFJPTExFUl0pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgcHJvcGVydHlOYW1lID0gY29udmVydEF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZSk7XG5cblx0XHRcdFx0dmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzW0NPTlRST0xMRVJdKTtcblx0XHRcdFx0dmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgcHJvcGVydHlOYW1lKTtcblxuXHRcdFx0XHRpZiAoZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnNldCkge1xuXHRcdFx0XHRcdHRoaXNbQ09OVFJPTExFUl1bcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgZm9yIGFyZ3VtZW50IGBjdXJyZW50YCB0aGUgbWV0aG9kXG5cdFx0XHRcdC8vIGBjdXJyZW50Q2hhbmdlZENhbGxiYWNrYCBleGlzdHMsIHRyaWdnZXJcblx0XHRcdFx0dmFyIGNhbGxiYWNrID0gdGhpc1tDT05UUk9MTEVSXVtwcm9wZXJ0eU5hbWUgKyAnQ2hhbmdlZENhbGxiYWNrJ107XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpc1tDT05UUk9MTEVSXSwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1dLCBbe1xuXHRcdFx0a2V5OiAnb2JzZXJ2ZWRBdHRyaWJ1dGVzJyxcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXHRcdFx0XHRyZXR1cm4gb2JzZXJ2ZWRBdHRyaWJ1dGVzO1xuXHRcdFx0fVxuXHRcdH1dKTtcblxuXHRcdGZ1bmN0aW9uIF9jbGFzcygpIHtcblx0XHRcdGNsYXNzQ2FsbENoZWNrKHRoaXMsIF9jbGFzcyk7XG5cblx0XHRcdHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKF9jbGFzcy5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKF9jbGFzcykpLmNhbGwodGhpcykpO1xuXG5cdFx0XHRvYnNlcnZlZEF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgX3RoaXNbYXR0cmlidXRlXSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ1JlcXVlc3RlZCBzeW5jaW5nIG9uIGF0dHJpYnV0ZSBcXCcnICsgYXR0cmlidXRlICsgJ1xcJyB0aGF0IGFscmVhZHkgaGFzIGRlZmluZWQgYmVoYXZpb3InKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfdGhpcywgYXR0cmlidXRlLCB7XG5cdFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiBmYWxzZSxcblx0XHRcdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblx0XHRcdFx0XHRcdHJldHVybiBfdGhpc1tDT05UUk9MTEVSXVthdHRyaWJ1dGVdO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2V0OiBmdW5jdGlvbiBzZXQkJDEodG8pIHtcblx0XHRcdFx0XHRcdF90aGlzW0NPTlRST0xMRVJdW2F0dHJpYnV0ZV0gPSB0bztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gX3RoaXM7XG5cdFx0fVxuXG5cdFx0Y3JlYXRlQ2xhc3MoX2NsYXNzLCBbe1xuXHRcdFx0a2V5OiAnY29ubmVjdGVkQ2FsbGJhY2snLFxuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0XHR0aGlzW0NPTlRST0xMRVJdID0gbmV3IG9wdGlvbnMuY29udHJvbGxlcih0aGlzKTtcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRrZXk6ICdkaXNjb25uZWN0ZWRDYWxsYmFjaycsXG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHRcdHRoaXNbQ09OVFJPTExFUl0uZGVzdHJveSgpO1xuXHRcdFx0fVxuXHRcdH1dKTtcblx0XHRyZXR1cm4gX2NsYXNzO1xuXHR9KEhUTUxFbGVtZW50KSk7XG59O1xuXG52YXIgcmVnaXN0ZXJBdHRyaWJ1dGUgPSBmdW5jdGlvbiByZWdpc3RlckF0dHJpYnV0ZSgpIHtcblx0dmFyIGhhbmRsZXJzID0gW107XG5cblx0dmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuXHRcdFxuXHR9KTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gcmVnaXN0ZXIoYXR0cmlidXRlKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG5cdFx0d2FpdEZvckRPTVJlYWR5KCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgZXh0ZW5kID0gb3B0aW9ucy5leHRlbmRzIHx8IEhUTUxFbGVtZW50O1xuXG5cdFx0XHR2YXIgbm9kZUlzU3VwcG9ydGVkID0gZnVuY3Rpb24gbm9kZUlzU3VwcG9ydGVkKG5vZGUpIHtcblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoZXh0ZW5kKSkge1xuXHRcdFx0XHRcdHJldHVybiBleHRlbmQuc29tZShmdW5jdGlvbiAoc3VwcG9ydGVkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbm9kZSBpbnN0YW5jZW9mIHN1cHBvcnRlZDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBub2RlIGluc3RhbmNlb2YgZXh0ZW5kO1xuXHRcdFx0fTtcblxuXHRcdFx0dmFyIGF0dGFjaCA9IGZ1bmN0aW9uIGF0dGFjaChub2RlKSB7XG5cdFx0XHRcdHZhciBlbCA9IG5vZGU7XG5cdFx0XHRcdGVsW0NPTlRST0xMRVJdID0gbmV3IG9wdGlvbnMuY29udHJvbGxlcihlbCk7XG5cdFx0XHRcdHJldHVybiBlbDtcblx0XHRcdH07XG5cblx0XHRcdHZhciBkZXRhY2ggPSBmdW5jdGlvbiBkZXRhY2gobm9kZSkge1xuXHRcdFx0XHR2YXIgZWwgPSBub2RlO1xuXG5cdFx0XHRcdGlmIChlbFtDT05UUk9MTEVSXSkge1xuXHRcdFx0XHRcdGVsW0NPTlRST0xMRVJdLmRlc3Ryb3koKTtcblx0XHRcdFx0XHRlbFtDT05UUk9MTEVSXSA9IG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZWw7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBTZXR1cCBvYnNlcnZlcnNcblx0XHRcdGhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKG11dGF0aW9uKSB7XG5cdFx0XHRcdGlmIChtdXRhdGlvbi50eXBlID09PSAnYXR0cmlidXRlcycgJiYgbm9kZUlzU3VwcG9ydGVkKG11dGF0aW9uLnRhcmdldCkpIHtcblx0XHRcdFx0XHQvLyBBdHRyaWJ1dGUgY2hhbmdlZCBvbiBzdXBwb3J0ZWQgRE9NIG5vZGUgdHlwZVxuXHRcdFx0XHRcdHZhciBub2RlID0gbXV0YXRpb24udGFyZ2V0O1xuXG5cdFx0XHRcdFx0aWYgKG5vZGUuaGFzQXR0cmlidXRlKGF0dHJpYnV0ZSkpIHtcblx0XHRcdFx0XHRcdGF0dGFjaChub2RlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGV0YWNoKG5vZGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0Jykge1xuXHRcdFx0XHRcdC8vIEhhbmRsZSBhZGRlZCBub2Rlc1xuXHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG5cdFx0XHRcdGF0dHJpYnV0ZXM6IHRydWUsXG5cdFx0XHRcdHN1YnRyZWU6IHRydWUsXG5cdFx0XHRcdGNoaWxkTGlzdDogdHJ1ZSxcblx0XHRcdFx0YXR0cmlidXRlRmlsdGVyOiBbYXR0cmlidXRlXVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIExvb2sgZm9yIGN1cnJlbnQgb24gRE9NIHJlYWR5XG5cdFx0XHRBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvckFsbCgnWycgKyBhdHRyaWJ1dGUgKyAnXScpLCBmdW5jdGlvbiAoZWwpIHtcblx0XHRcdFx0aWYgKCFub2RlSXNTdXBwb3J0ZWQoZWwpKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKCdDdXN0b20gYXR0cmlidXRlJywgYXR0cmlidXRlLCAnYWRkZWQgb24gbm9uLXN1cHBvcnRlZCBlbGVtZW50Jyk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGVsW0NPTlRST0xMRVJdKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGF0dGFjaChlbCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fTtcbn0oKTtcblxudmFyIGFkZEF0dHJpYnV0ZXNUb0NvbnRyb2xsZXIgPSBmdW5jdGlvbiBhZGRBdHRyaWJ1dGVzVG9Db250cm9sbGVyKGNvbnRyb2xsZXIpIHtcblx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IFtdO1xuXG5cdHJldHVybiBhdHRyaWJ1dGVzLm1hcChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG5cdFx0Ly8gU3RyaW5nLCBzeW5jIHdpdGggYWN0dWFsIGVsZW1lbnQgYXR0cmlidXRlXG5cdFx0aWYgKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR2YXIgX2dlbmVyYXRlQXR0cmlidXRlTWV0ID0gZ2VuZXJhdGVBdHRyaWJ1dGVNZXRob2RzKGF0dHJpYnV0ZSwgJ3N0cmluZycpLFxuXHRcdFx0ICAgIGdldHRlciA9IF9nZW5lcmF0ZUF0dHJpYnV0ZU1ldC5nZXR0ZXIsXG5cdFx0XHQgICAgc2V0dGVyID0gX2dlbmVyYXRlQXR0cmlidXRlTWV0LnNldHRlcjtcblxuXHRcdFx0YWRkUHJvcGVydHkoY29udHJvbGxlciwgYXR0cmlidXRlLCBnZXR0ZXIsIHNldHRlcik7XG5cdFx0XHRyZXR1cm4gYXR0cmlidXRlO1xuXHRcdH1cblxuXHRcdGlmICgodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoYXR0cmlidXRlKSkgPT09ICdvYmplY3QnKSB7XG5cdFx0XHR2YXIgdHlwZSA9IGF0dHJpYnV0ZS50eXBlIHx8ICdzdHJpbmcnO1xuXHRcdFx0dmFyIG5hbWUgPSBhdHRyaWJ1dGUuYXR0cmlidXRlO1xuXG5cdFx0XHR2YXIgX2dlbmVyYXRlQXR0cmlidXRlTWV0MiA9IGdlbmVyYXRlQXR0cmlidXRlTWV0aG9kcyhuYW1lLCB0eXBlKSxcblx0XHRcdCAgICBfZ2V0dGVyID0gX2dlbmVyYXRlQXR0cmlidXRlTWV0Mi5nZXR0ZXIsXG5cdFx0XHQgICAgX3NldHRlciA9IF9nZW5lcmF0ZUF0dHJpYnV0ZU1ldDIuc2V0dGVyO1xuXG5cdFx0XHRhZGRQcm9wZXJ0eShjb250cm9sbGVyLCBuYW1lLCBfZ2V0dGVyLCBfc2V0dGVyKTtcblx0XHRcdHJldHVybiBuYW1lO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgYXR0cmlidXRlLmF0dGFjaFRvID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRhdHRyaWJ1dGUuYXR0YWNoVG8oY29udHJvbGxlcik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KS5maWx0ZXIoZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuXHRcdHJldHVybiAhIWF0dHJpYnV0ZTtcblx0fSk7XG59O1xuXG5mdW5jdGlvbiBkZWZpbmVDdXN0b21FbGVtZW50KHRhZykge1xuXHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cblx0Ly8gVmFsaWRhdGUgdGFnXG5cdHZhciBpc1ZhbGlkVGFnID0gdGFnLnNwbGl0KCctJykubGVuZ3RoID4gMTtcblxuXHQvLyBWYWxpZGF0ZSB0eXBlXG5cdHZhciB0eXBlID0gWydlbGVtZW50JywgJ2F0dHJpYnV0ZSddLmluY2x1ZGVzKG9wdGlvbnMudHlwZSkgPyBvcHRpb25zLnR5cGUgOiAnZWxlbWVudCc7XG5cblx0aWYgKHR5cGUgPT09ICdlbGVtZW50JyAmJiAhaXNWYWxpZFRhZykge1xuXHRcdGNvbnNvbGUud2Fybih0YWcsICdpcyBub3QgYSB2YWxpZCBDdXN0b20gRWxlbWVudCBuYW1lLiBSZWdpc3RlciBhcyBhbiBhdHRyaWJ1dGUgaW5zdGVhZC4nKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBWYWxpZGF0ZSBhdHRyaWJ1dGVzXG5cdHZhciBhdHRyaWJ1dGVzID0gQXJyYXkuaXNBcnJheShvcHRpb25zLmF0dHJpYnV0ZXMpID8gb3B0aW9ucy5hdHRyaWJ1dGVzIDogW107XG5cblx0Ly8gVmFsaWRhdGUgY29udHJvbGxlclxuXHR2YXIgY29udHJvbGxlciA9IG9wdGlvbnMuY29udHJvbGxlcjtcblxuXHQvLyBWYWxpZGF0ZSBleHRlbmRzXG5cdHZhciBleHRlbmQgPSBvcHRpb25zLmV4dGVuZHM7XG5cblx0aWYgKHR5cGUgPT09ICdlbGVtZW50JyAmJiBleHRlbmQpIHtcblx0XHRjb25zb2xlLndhcm4oJ2BleHRlbmRzYCBpcyBub3Qgc3VwcG9ydGVkIG9uIGVsZW1lbnQtcmVnaXN0ZXJlZCBDdXN0b20gRWxlbWVudHMuIFJlZ2lzdGVyIGFzIGFuIGF0dHJpYnV0ZSBpbnN0ZWFkLicpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHZhciBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBhZGRBdHRyaWJ1dGVzVG9Db250cm9sbGVyKGNvbnRyb2xsZXIsIGF0dHJpYnV0ZXMpO1xuXG5cdHZhciB2YWxpZGF0ZWRPcHRpb25zID0geyB0eXBlOiB0eXBlLCBleHRlbmRzOiBleHRlbmQsIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIG9ic2VydmVkQXR0cmlidXRlczogb2JzZXJ2ZWRBdHRyaWJ1dGVzIH07XG5cblx0aWYgKHR5cGUgPT09ICdhdHRyaWJ1dGUnKSB7XG5cdFx0cmV0dXJuIHJlZ2lzdGVyQXR0cmlidXRlKHRhZywgdmFsaWRhdGVkT3B0aW9ucyk7XG5cdH1cblxuXHRyZXR1cm4gcmVnaXN0ZXJFbGVtZW50KHRhZywgdmFsaWRhdGVkT3B0aW9ucyk7XG59XG5cbi8vIEJhc2UgQ29udHJvbGxlclxuXG5leHBvcnRzLkJhc2VDb250cm9sbGVyID0gQmFzZUNvbnRyb2xsZXI7XG5leHBvcnRzLm1lZGlhID0gQXR0ck1lZGlhO1xuZXhwb3J0cy50b3VjaEhvdmVyID0gQXR0clRvdWNoSG92ZXI7XG5leHBvcnRzLmFqYXhGb3JtID0gYWpheEZvcm07XG5leHBvcnRzLmtleVRyaWdnZXIgPSBrZXlUcmlnZ2VyO1xuZXhwb3J0cy5vdmVybGF5ID0gb3ZlcmxheTtcbmV4cG9ydHMuc2hhcmUgPSBzaGFyZTtcbmV4cG9ydHMuc21vb3RoU3RhdGUgPSBzbW9vdGhTdGF0ZTtcbmV4cG9ydHMudGltZUFnbyA9IHRpbWVBZ287XG5leHBvcnRzLmRlZmluZUN1c3RvbUVsZW1lbnQgPSBkZWZpbmVDdXN0b21FbGVtZW50O1xuZXhwb3J0cy5wYXJzZUV2ZW50ID0gcGFyc2U7XG5leHBvcnRzLmdldEV2ZW50UGF0aCA9IGdldFBhdGg7XG5leHBvcnRzLnBhcnNlSFRNTCA9IHBhcnNlSFRNTDtcbmV4cG9ydHMucmVuZGVyTm9kZXMgPSByZW5kZXJOb2RlcztcbmV4cG9ydHMuY2xlYW5Ob2RlcyA9IGNsZWFuTm9kZXM7XG5leHBvcnRzLnByb21pc2lmeSA9IHByb21pc2lmeTtcbiJdfQ==
