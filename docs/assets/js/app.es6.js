function parse(name) {
	const clean = name.trim();
	const parts = clean.split(' ');

	let event = clean;
	let selector = null;

	if (parts.length > 1) {
		event = parts.shift();
		selector = parts.join(' ');
	}

	return { event, selector };
}

function getPath(e) {
	let path = e.path;

	if (!path) {
		path = [e.target];
		let node = e.target;

		while (node.parentNode) {
			node = node.parentNode;
			path.push(node);
		}
	}

	return path;
}

function promisify(method) {
	return new Promise((resolve, reject) => {
		const wait = method();

		if (wait instanceof Promise) {
			wait.then((...args) => {
				resolve(args);
			}, (...args) => {
				reject(args);
			});
		} else {
			resolve(wait);
		}
	});
}

function waitForDOMReady() {
	return new Promise((resolve) => {
		if (document.readyState === 'complete') {
			resolve();
		} else {
			const handler = function () {
				if (document.readyState === 'complete') {
					document.removeEventListener('readystatechange', handler, false);
					resolve();
				}
			};

			document.addEventListener('readystatechange', handler, false);
		}
	});
}

function elementIsInDOM(element, root = document.body) {
	if (!element) {
		return false;
	}

	if (element === root) {
		return false;
	}

	return root.contains(element);
}

const BASE_CONTROLLER_HANDLERS = Symbol('BASE_CONTROLLER_HANDLERS');

class BaseController {
	constructor(el) {
		const noop = () => {};

		this.el = el;

		this.resolve().then(() => {
			if (!elementIsInDOM(this.el)) {
				return Promise.reject('The element has disappeared');
			}

			this.el.classList.add('is-resolved');

			const init = () => promisify(() => {
				if (!elementIsInDOM(this.el)) {
					return Promise.reject('The element has disappeared');
				}

				return this.init();
			});

			const render = () => promisify(() => {
				if (!elementIsInDOM(this.el)) {
					return Promise.reject('The element has disappeared');
				}

				return this.render();
			});

			const bind = () => promisify(() => {
				if (!elementIsInDOM(this.el)) {
					return Promise.reject('The element has disappeared');
				}

				return this.bind();
			});

			return init().then(() => render().then(() => bind().then(() => this))).catch(noop);
		}).catch(noop);
	}

	destroy() {
		this.el.classList.remove('is-resolved');
	}

	resolve() {
		return waitForDOMReady();
	}

	init() { }

	render() { }

	bind() { }

	unbind() {
		if (this[BASE_CONTROLLER_HANDLERS]) {
			this[BASE_CONTROLLER_HANDLERS].forEach((listener) => {
				listener.target.removeEventListener(listener.event, listener.handler, listener.options);
			});

			this[BASE_CONTROLLER_HANDLERS] = [];
		}
	}

	on(name, handler, target = null, options = false) {
		this[BASE_CONTROLLER_HANDLERS] = this[BASE_CONTROLLER_HANDLERS] || [];

		const { event, selector } = parse(name);
		const parsedTarget = !target ? this.el : target;

		let wrappedHandler = function (e) {
			handler(e, e.target);
		};

		if (selector) {
			wrappedHandler = function (e) {
				const path = getPath(e);

				const matchingTarget = path.find((tag) => tag.matches && tag.matches(selector));

				if (matchingTarget) {
					handler(e, matchingTarget);
				}
			};
		}

		const listener = {
			target: parsedTarget,
			selector,
			event,
			handler: wrappedHandler,
			options,
		};

		listener.target.addEventListener(listener.event, listener.handler, listener.options);

		this[BASE_CONTROLLER_HANDLERS].push(listener);

		return this;
	}

	once(name, handler, target = null, options = false) {
		const wrappedHandler = (e, matchingTarget) => {
			this.off(name, target);
			handler(e, matchingTarget);
		};

		this.on(name, wrappedHandler, target, options);
	}

	off(name, target = null) {
		const { event, selector } = parse(name);
		const parsedTarget = !target ? this.el : target;

		const listener = this[BASE_CONTROLLER_HANDLERS].find((handler) => {
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

	emit(name, data = {}, options = {}) {
		const params = Object.assign({
			detail: data,
			bubbles: true,
			cancelable: true,
		}, options);

		const event = new CustomEvent(name, params);

		this.el.dispatchEvent(event);
	}
}

const convertAttributeToPropertyName = function (attribute) {
	return attribute.split('-').reduce((camelcased, part, index) => {
		if (index === 0) {
			return part;
		}

		return camelcased + part[0].toUpperCase() + part.substr(1);
	});
};

const addProperty = function (customElement, name, getter = null, setter = null) {
	const propertyName = convertAttributeToPropertyName(name);

	if (typeof customElement.prototype[propertyName] !== 'undefined') {
		console.warn(`${customElement.name} already has a property ${propertyName}`);
	}

	const noop = function () {};

	const property = {
		configurable: false,
		get: typeof getter === 'function' ? getter : noop,
		set: typeof setter === 'function' ? setter : noop,
	};

	const descriptor = Object.getOwnPropertyDescriptor(customElement.prototype, propertyName);

	if (descriptor) {
		if (typeof descriptor.set === 'function') {
			const existing = descriptor.set;

			property.set = function set(to) {
				existing.call(this, to);
			};
		}

		if (typeof descriptor.get === 'function') {
			const generated = property.get;
			const existing = descriptor.get;

			property.get = function get() {
				const value = existing.call(this);

				if (typeof value !== 'undefined') {
					return value;
				}

				return generated.call(this);
			};
		}
	}

	Object.defineProperty(customElement.prototype, propertyName, property);
};

const parseResponse = function (res) {
	const data = (function parseResonseToData() {
		// Force lowercase keys
		if (typeof res === 'object') {
			return Object.entries(res).reduce((object, [key, value]) => {
				const lowercaseKey = key.toLowerCase();

				Object.assign(object, {
					[lowercaseKey]: value,
				});

				return object;
			}, {});
		}

		return res;
	}());

	const status = (function parseResponseToStatus() {
		if (data.status) {
			return parseInt(data.status, 10);
		}

		if (parseInt(data, 10).toString() === data.toString()) {
			return parseInt(data, 10);
		}

		return 200;
	}());

	return { status, data };
};

const fetchJSONP = function (url) {
	return new Promise((resolve, reject) => {
		// Register a global callback
		// Make sure we have a unique function name
		const now = (new Date()).getTime();
		const callback = `AJAX_FORM_CALLBACK_${now}`;

		window[callback] = (res) => {
			// Make the callback a noop
			// so it triggers only once (just in case)
			window[callback] = () => {};

			// Clean up after ourselves
			const script = document.getElementById(callback);
			script.parentNode.removeChild(script);

			const { status, data } = parseResponse(res);

			// If res is only a status code
			if (status >= 200 && status <= 399) {
				return resolve(data);
			}

			return reject(data);
		};

		const script = document.createElement('script');
		script.id = callback;
		script.src = `${url}&callback=${callback}`;
		document.head.appendChild(script);
	});
};

const convertFormDataToQuerystring = function (values) {
	return Array.from(values, ([key, raw]) => {
		if (raw) {
			const value = window.encodeURIComponent(raw);
			return `${key}=${value}`;
		}

		return '';
	}).join('&');
};

const ajaxForm = {
	attributes: [
		{ attribute: 'jsonp', type: 'bool' },
	],
	controller: class extends BaseController {
		get action() {
			return this.elements.form.action;
		}

		get method() {
			if (this.jsonp) {
				return 'GET';
			}

			return (this.elements.form.method || 'POST').toUpperCase();
		}

		get values() {
			return new FormData(this.elements.form);
		}

		init() {
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

		render() {
			// We can disable the HTML5 front-end validation
			// and handle it more gracefully in JS
			// @todo
			this.elements.form.setAttribute('novalidate', 'novalidate');
		}

		bind() {
			const reset = () => {
				if (this.elements.successMessage) {
					this.elements.successMessage.setAttribute('hidden', 'hidden');
				}

				if (this.elements.errorMessage) {
					this.elements.errorMessage.setAttribute('hidden', 'hidden');
				}
			};

			this.on('submit', (e) => {
				e.preventDefault();

				reset();

				const { url, params } = this.prepare(this.method);

				this.submit(url, params)
					.then((data) => {
						this.onSuccess(data);
					}, (err) => {
						this.onError(err);
					});
			}, this.elements.form);
		}

		prepare(method) {
			const get = () => {
				const querystring = convertFormDataToQuerystring(this.values);
				const url = `${this.action}?${querystring}`;
				const params = {
					method: 'GET',
					headers: new Headers({
						'Content-Type': 'application/json',
					}),
				};

				return { url, params };
			};

			const post = () => {
				const url = this.action;
				const params = {
					method: 'POST',
					headers: new Headers({
						'Content-Type': 'application/x-www-form-urlencoded',
					}),
				};

				return { url, params };
			};

			if (method.toUpperCase() === 'GET') {
				return get();
			}

			if (method.toUpperCase() === 'POST') {
				return post();
			}

			return { url: '/', params: { method: 'GET' } };
		}

		submit(url, params = {}) {
			if (this.jsonp) {
				return fetchJSONP(url);
			}

			return fetch(url, params).then((res) => {
				if (res.status && res.status === 200) {
					return res;
				}

				const error = new Error(res.statusText);
				throw error;
			}).then((res) => {
				const type = res.headers.get('Content-Type');

				if (type && type.includes('application/json')) {
					return res.json();
				}

				return res.text();
			});
		}

		// eslint-disable-next-line no-unused-vars
		onSuccess(res) {
			if (this.elements.successMessage) {
				this.elements.successMessage.removeAttribute('hidden');
			}

			this.elements.form.parentNode.removeChild(this.elements.form);
		}

		// eslint-disable-next-line no-unused-vars
		onError(err) {
			if (this.elements.errorMessage) {
				this.elements.errorMessage.removeAttribute('hidden');
			}
		}
	},
};

const keyTrigger = {
	attributes: [
		{ attribute: 'key', type: 'int' },
	],
	controller: class extends BaseController {
		init() {
			this.elements = this.elements || {};

			if (this.el.hasAttribute('href')) {
				this.elements.target = this;
			} else {
				this.elements.target = this.el.querySelector('[href]');
			}

			return this;
		}

		bind() {
			if (this.elements.target) {
				this.on('keyup', (e) => {
					if (e.which === this.key) {
						e.preventDefault();
						e.stopPropagation();

						this.elements.target.click();
					}
				}, document.body);
			}

			return this;
		}
	},
};

const parseMetaTag = (function parseMetaTag() {
	const blacklist = ['viewport'];

	return function parse(tag) {
		const name = tag.getAttribute('name');
		const property = tag.getAttribute('property');
		const content = tag.getAttribute('content');

		if (!name && !property) {
			return false;
		}

		if (blacklist.includes(name)) {
			return false;
		}

		return { name, property, content };
	};
}());

const parseHTML = (function parseHTML() {
	const parser = new DOMParser();

	return function parse(html, selector = null) {
		const parsed = parser.parseFromString(html, 'text/html');

		// Get document title
		const title = parsed.title;

		// Get document nodes
		let content = parsed.body;

		if (selector) {
			content = parsed.body.querySelector(selector);

			if (!content) {
				throw new Error('not-found');
			}
		}

		// Get document meta
		const meta = Array.from(parsed.head.querySelectorAll('meta'), (tag) => parseMetaTag(tag)).filter((t) => !!t);

		return { title, content, meta };
	};
}());

function renderNodes(content, container) {
	while (container.hasChildNodes()) {
		container.removeChild(container.firstChild);
	}

	for (let i = content.children.length - 1; i >= 0; i -= 1) {
		const child = content.children[i];

		Array.from(content.getElementsByTagName('img'), (img) => {
			const clone = document.createElement('img');
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
	if (!selector || (Array.isArray(selector) && selector.length === 0)) {
		return nodes;
	}

	const stringSelector = Array.isArray(selector) ? selector.join(', ') : selector;

	const bloat = Array.from(nodes.querySelectorAll(stringSelector));

	bloat.forEach((node) => node.parentNode.removeChild(node));

	return nodes;
}

const overlay = {
	attributes: [],
	controller: class extends BaseController {
		/**
		 * `isShown` is a boolean that tracks
		 * if the overlay is currently open or not
		 * */
		get isShown() {
			return !!this._isShown;
		}

		set isShown(to) {
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
		get upState() {
			return Object.assign({}, this._upState);
		}

		set upState(to) {
			this._upState = Object.assign({}, to);
		}

		init() {
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
		render() {
			// Store the original classes so we can always revert back to the default state
			// while rendering in different aspects
			this.originalClasses = Array.from(this.el.classList);

			// Add <link rel="up" href="/"> inside an overlay to fetch a background view
			const upLink = this.el.querySelector('link[rel="up"]');

			if (upLink) {
				const href = upLink.getAttribute('href');

				fetch(href, { credentials: 'include' }).then((res) => res.text()).then((html) => {
					const { title, content } = parseHTML(html);

					if (content) {
						if (content.getElementsByTagName(this.el.tagName)[0]) {
							const classList = content.getElementsByTagName(this.el.tagName)[0].classList;
							this.originalClasses = Array.from(classList);
						}

						const fragment = document.createDocumentFragment();

						// Clean certain selectors from the up state to avoid infinite loops
						const clean = cleanNodes(content, this.stripFromResponse);

						renderNodes(clean, fragment);

						this.el.parentNode.insertBefore(fragment, this.el);

						// The upState is not the overlay view but the background view
						this.upState = {
							href,
							title,
							root: true,
							by: this.el.tagName,
						};

						// We need to replace the current state to handle `popstate`
						const state = {
							href: window.location.href,
							title: document.title,
							root: false,
							by: this.el.tagName,
						};

						window.history.replaceState(state, state.title, state.href);

						// Set isShown so that the closing handler works correctly
						this.isShown = true;
					}
				});
			} else {
				// Currently not inside an overlay view, but an overlay might open
				// (because an empty <mr-overlay> is present)
				// so we store the current state to support `popstate` events
				const title = document.title;
				const href = window.location.href;

				this.upState = {
					href,
					title,
					root: true,
					by: this.el.tagName,
				};

				window.history.replaceState(this.upState, title, href);
			}

			return this;
		}

		bind() {
			const hideHandler = (e) => {
				if (this.isShown) {
					e.preventDefault();

					this.hide();

					if (this.upState) {
						const { title, href } = this.upState;

						window.history.pushState(this.upState, title, href);
						document.title = title;
					}
				}
			};

			this.on('click', (e) => {
				if (e.target === this.el) {
					hideHandler(e);
				}
			}, this.el);

			this.on('click .js-overlay-show', (e, target) => {
				const href = target.href;

				if (href) {
					e.preventDefault();
					this.show(href);
				}
			}, document.body);

			this.on('click .js-overlay-hide', (e) => {
				hideHandler(e);
			}, document.body);

			this.on('popstate', (e) => {
				// Only handle states that were set by `mr-overlay`
				// to avoid messing with other elements that use the History API
				if (e.state && e.state.by === this.el.tagName && e.state.href) {
					const { href, title } = e.state;
					const { href: upHref, title: upTitle } = this.upState;
					const hasRequestedUpState = href === upHref && title === upTitle;

					if (e.state.root && hasRequestedUpState) {
						// Trigger hide() if the popstate requests the root view
						this.hide();
						document.title = this.upState.title;
					} else {
						// Show the overlay() if we closed the overlay before
						this.show(e.state.href, false);
					}
				}
			}, window);

			return this;
		}

		show(href, pushState = true) {
			const updateMetaTags = (tags) => {
				tags.forEach((tag) => {
					let selector = 'meta';

					if (tag.property) {
						selector = `${selector}[property="${tag.property}"]`;
					}

					if (tag.name) {
						selector = `${selector}[name="${tag.name}"]`;
					}

					const match = document.head.querySelector(selector);

					if (match) {
						match.setAttribute('content', tag.content);
					} else {
						const append = document.createElement('meta');
						append.property = tag.property;
						append.content = tag.content;
						append.name = tag.name;
						document.head.appendChild(append);
					}
				});
			};

			const renderContent = (content) => {
				const newClasses = Array.from(content.classList);
				this.el.className = '';
				// This crashes in IE11
				// this.el.classList.add(...newClasses);
				newClasses.forEach((c) => this.el.classList.add(c));

				this.isShown = true;

				// Clean certain selectors from the up state to avoid infinite loops
				const clean = cleanNodes(content, this.stripFromResponse);

				renderNodes(clean, this.el);

				window.requestAnimationFrame(() => {
					this.el.scrollTop = 0;
				});
			};

			const updateTitle = (title) => {
				document.title = title;
			};

			return fetch(href, { credentials: 'include' }).then((res) => res.text()).then((html) => {
				const { title, content, meta } = parseHTML(html, this.el.tagName);

				updateMetaTags(meta);

				if (content) {
					renderContent(content);
					updateTitle(title);

					if (pushState) {
						const state = { href, title, by: this.el.tagName };
						window.history.pushState(state, title, href);
					}
				}
			});
		}

		hide() {
			this.isShown = false;

			while (this.el.hasChildNodes()) {
				this.el.removeChild(this.el.firstChild);
			}

			if (this.originalClasses && Array.isArray(this.originalClasses)) {
				this.el.className = '';

				// This crashes in IE11
				// this.el.classList.add(...this.originalClasses);
				this.originalClasses.forEach((c) => this.el.classList.add(c));
			}
		}
	},
};

const getMetaValues = function (node = document.head, selector = '') {
	const extractKey = function (tag) {
		let raw = tag.getAttribute('name');

		if (!raw) {
			raw = tag.getAttribute('property');
		}

		const stripped = raw.match(/^(?:.*:)?(.*)$/i);

		if (stripped) {
			return stripped[1];
		}

		return null;
	};

	const tags = [...node.querySelectorAll(`meta${selector}`)];

	// Get <meta> values
	return tags.reduce((carry, tag) => {
		const key = extractKey(tag);

		if (key) {
			const value = tag.getAttribute('content');
			Object.assign(carry, { [key]: value });
		}

		return carry;
	}, {});
};

const generateQuerystring = function (params) {
	const querystring = Object.entries(params).map(([key, value]) => {
		if (value) {
			const encoded = window.encodeURIComponent(value);
			return `${key}=${encoded}`;
		}

		return '';
	}).filter((param) => !!param).join('&');

	if (querystring.length > 0) {
		return `?${querystring}`;
	}

	return '';
};

const openWindow = function (href, params = {}, options = {}) {
	const querystring = generateQuerystring(params);
	const { name, invisible } = options;

	if (invisible) {
		window.location = `${href}${querystring}`;
		return;
	}

	let { width, height } = options;

	width = width || 560;
	height = height || 420;

	const x = Math.round((window.innerWidth - width) / 2);
	const y = Math.round((window.innerHeight - height) / 2);

	const popup = window.open(`${href}${querystring}`, name, `width=${width}, height=${height}, left=${x}, top=${y}`);

	if (typeof popup.focus === 'function') {
		popup.focus();
	}
};

const share = {
	attributes: [],
	controller: class extends BaseController {
		get title() {
			const attribute = this.el.getAttribute('mr-share-title');
			const fallback = document.title;
			return attribute || fallback;
		}

		get description() {
			const attribute = this.el.getAttribute('mr-share-description');
			let fallback = '';

			const tag = document.head.querySelector('meta[name="description"');

			if (tag) {
				fallback = tag.getAttribute('content');
			}

			return attribute || fallback;
		}

		get url() {
			const attribute = this.el.getAttribute('mr-share-url');
			let fallback = window.location.href;

			const tag = document.head.querySelector('link[rel="canonical"]');

			if (tag) {
				fallback = tag.getAttribute('href');
			}

			return attribute || fallback;
		}

		init() {
			this.elements = {};

			this.elements.facebook = this.el.getElementsByClassName('js-share-facebook')[0];
			this.elements.twitter = this.el.getElementsByClassName('js-share-twitter')[0];
			this.elements.pinterest = this.el.getElementsByClassName('js-share-pinterest')[0];
			this.elements.mail = this.el.getElementsByClassName('js-share-mail')[0];

			return this;
		}

		bind() {
			if (this.elements.facebook) {
				this.on('click', (e) => {
					e.stopPropagation();
					this.shareOnFacebook();
				}, this.elements.facebook);
			}

			if (this.elements.twitter) {
				this.on('click', (e) => {
					e.stopPropagation();
					this.shareOnTwitter();
				}, this.elements.twitter);
			}

			if (this.elements.pinterest) {
				this.on('click', (e) => {
					e.stopPropagation();
					this.shareOnPinterest();
				}, this.elements.pinterest);
			}

			if (this.elements.mail) {
				this.on('click', (e) => {
					e.stopPropagation();
					this.shareViaMail();
				}, this.elements.mail);
			}

			return this;
		}

		shareOnFacebook() {
			const values = getMetaValues(document.head, '[property^="og:"]');

			const params = {
				u: values.url || this.url,
				title: values.title || this.title,
				caption: values.site_name,
				description: values.description || this.description,
			};

			const isAbsoluteUrl = /^(https?:)?\/\//i;

			if (isAbsoluteUrl.test(values.image)) {
				params.picture = values.image;
			}

			openWindow('https://www.facebook.com/sharer.php', params, { name: 'Share on Facebook', width: 560, height: 630 });
		}

		shareOnPinterest() {
			const values = getMetaValues(document.head, '[property^="og:"]');

			const params = {
				url: values.url || this.url,
				description: values.description || this.description,
				toolbar: 'no',
				media: values.image,
			};

			openWindow('https://www.pinterest.com/pin/create/button', params, { name: 'Share on Pinterest', width: 740, height: 700 });
		}

		shareOnTwitter() {
			const values = getMetaValues(document.head, '[name^="twitter:"]');

			const params = {
				url: values.url || this.url,
				text: values.title || this.title,
				via: values.site ? values.site.replace('@', '') : undefined,
			};

			openWindow('https://twitter.com/intent/tweet', params, { name: 'Share on Twitter', width: 580, height: 253 });
		}

		shareViaMail() {
			const params = {
				subject: this.title,
				body: `${this.title} (${this.url}) - ${this.description}`,
			};

			openWindow('mailto:', params, { invisible: true });
		}
	},
};

const smoothState = {
	attributes: [],
	controller: class extends BaseController {
		get path() {
			return this._path || [];
		}

		get latestPathEntry() {
			const length = this.path.length;

			if (length > 0) {
				return this.path[length - 1];
			}

			return undefined;
		}

		addToPath(href) {
			// Make sure `href` is an absolute path from the / root of the current site
			let absolutePath = href.replace(window.location.origin, '');
			absolutePath = absolutePath[0] !== '/' ? `/${absolutePath}` : absolutePath;

			this._path = this._path || [];

			let from;

			if (this._path.length > 0) {
				from = this._path[this._path.length - 1].to;
			}

			const pathEntry = {
				from,
				to: absolutePath,
			};

			this._path.push(pathEntry);

			return this;
		}

		removeLatestFromPath() {
			(this._path || []).pop();
			return this;
		}

		pushState(href, title = '', addToPath = true) {
			const state = { href, title };

			window.history.pushState(state, title, href);

			if (addToPath) {
				this.addToPath(href);
			}

			return this;
		}

		replaceState(href, title = '', addToPath = true) {
			const state = { href, title };

			window.history.replaceState(state, title, href);

			if (addToPath) {
				this.addToPath(href);
			}

			return this;
		}

		init() {
			const href = window.location.href;
			const title = document.title;

			this.replaceState(href, title);

			return this;
		}

		bind() {
			this.on('popstate', (e) => {
				if (e.state && e.state.href) {
					this.goTo(e.state.href, false).catch((err) => {
						console.warn('Could not run popstate to', e.state.href);
						console.warn('Error:', err);
					});
				}
			}, window);

			this.on('click a', (e, target) => {
				if (target.classList && target.classList.contains('js-mr-smooth-state-disable')) {
					return;
				}

				// Avoid cross-origin calls
				if (!target.hostname || target.hostname !== window.location.hostname) {
					return;
				}

				const href = target.getAttribute('href');

				if (!href) {
					console.warn('Click on link without href');
					return;
				}

				e.preventDefault();
				e.stopPropagation();

				this.goTo(href).catch((err) => {
					console.warn('Could not navigate to', href);
					console.warn('Error:', err);
				});
			}, document.body);
		}

		goTo(href, pushState = true) {
			return new Promise((resolve, reject) => {
				window.dispatchEvent(new CustomEvent('smoothState:before'));

				document.body.classList.add('is-loading');

				this.addToPath(href);

				const cancel = (err) => {
					this.removeLatestFromPath();
					reject(err);
				};

				const transition = {};
				transition.container = this.el;
				transition.path = Object.assign(this.latestPathEntry);

				return this.onBefore(transition).then(() => {
					fetch(href, { credentials: 'include' }).then((res) => res.text()).then((html) => {
						const { title, content } = parseHTML(html, 'mr-smooth-state');

						window.dispatchEvent(new CustomEvent('smoothState:start'));

						transition.fetched = { title, content };

						this.onStart(transition).then(() => {
							window.dispatchEvent(new CustomEvent('smoothState:ready'));

							this.onReady(transition).then(() => {
								const { title: verifiedTitle, content: verifiedContent } = transition.fetched;

								window.requestAnimationFrame(() => {
									renderNodes(verifiedContent, this.el);
									document.title = verifiedTitle;

									if (pushState) {
										// Don't add the state to the path
										this.pushState(href, verifiedTitle, false);
									}

									window.requestAnimationFrame(() => {
										document.body.classList.remove('is-loading');

										window.dispatchEvent(new CustomEvent('smoothState:after'));

										// You can't cancel the transition after the pushState
										// So we also resolve inside the catch
										this.onAfter(transition).then(() => resolve()).catch(() => resolve());
									});
								});
							}).catch((err) => cancel(err));
						}).catch((err) => cancel(err));
					}).catch((err) => cancel(err));
				}).catch((err) => cancel(err));
			});
		}

		onBefore(transition) {
			return Promise.resolve(transition);
		}

		onStart(transition) {
			return Promise.resolve(transition);
		}

		onReady(transition) {
			return Promise.resolve(transition);
		}

		onAfter(transition) {
			return Promise.resolve(transition);
		}
	},
};

const timeAgo = {
	attributes: [
		'datetime',
	],
	controller: class extends BaseController {
		resolve() {
			// No need to wait for window.onload
			return Promise.resolve(true);
		}

		init() {
			this.translations = {
				ago: 'ago',
				year: ['year', 'years'],
				month: ['month', 'months'],
				week: ['week', 'weeks'],
				day: ['day', 'days'],
				hour: ['hour', 'hours'],
				minute: ['minute', 'minutes'],
				second: ['second', 'seconds'],
			};
		}

		getCountedNoun(key, count = 1) {
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

		render() {
			const makeReadable = (datetime) => {
				const date = new Date(datetime);
				const time = date.getTime();
				const now = new Date();
				let calculated;

				if (!isNaN(time)) {
					const diff = Math.floor((now.getTime() - time));

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
						const years = this.getCountedNoun('year', calculated.years);
						return `${calculated.years} ${years} ${this.translations.ago}`;
					} else if (calculated.weeks > 7) {
						const months = this.getCountedNoun('month', calculated.months);
						return `${calculated.months} ${months} ${this.translations.ago}`;
					} else if (calculated.days > 21) {
						const weeks = this.getCountedNoun('week', calculated.weeks);
						return `${calculated.weeks} ${weeks} ${this.translations.ago}`;
					} else if (calculated.hours > 24) {
						const days = this.getCountedNoun('day', calculated.days);
						return `${calculated.days} ${days} ${this.translations.ago}`;
					} else if (calculated.minutes > 60) {
						const hours = this.getCountedNoun('hour', calculated.hours);
						return `${calculated.hours} ${hours} ${this.translations.ago}`;
					} else if (calculated.seconds > 60) {
						const minutes = this.getCountedNoun('minute', calculated.minutes);
						return `${calculated.minutes} ${minutes} ${this.translations.ago}`;
					}

					const seconds = this.getCountedNoun('second', calculated.seconds);
					return `${calculated.seconds} ${seconds} ${this.translations.ago}`;
				}

				// Do nothing if we can't calculate a time diff
				return this.el.textContent;
			};

			this.el.textContent = makeReadable(this.datetime);

			return this;
		}
	},
};

const noop = function () {};

const generateStringAttributeMethods = function (attribute) {
	const getter = function () {
		return this.el.getAttribute(attribute) || undefined;
	};

	const setter = function (to) {
		const parsed = to && to.toString ? to.toString() : undefined;
		const oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (parsed) {
			this.el.setAttribute(attribute, parsed);
		} else {
			this.el.removeAttribute(attribute);
		}
	};

	return { getter, setter };
};

const generateBoolAttributeMethods = function (attribute) {
	const getter = function () {
		return !!this.el.hasAttribute(attribute);
	};

	const setter = function (to) {
		const parsed = typeof to === 'string' || !!to;
		const oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (parsed) {
			this.el.setAttribute(attribute, '');
		} else {
			this.el.removeAttribute(attribute);
		}
	};

	return { getter, setter };
};

const generateIntegerAttributeMethods = function (attribute) {
	const getter = function () {
		return parseInt(this.el.getAttribute(attribute), 10);
	};

	const setter = function (to) {
		const parsed = parseInt(to, 10);
		const oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (!Number.isNaN(parsed)) {
			this.el.setAttribute(attribute, parsed);
		} else {
			console.warn(`Could not set ${attribute} to ${to}`);
			this.el.removeAttribute(attribute);
		}
	};

	return { getter, setter };
};

const generateNumberAttributeMethods = function (attribute) {
	const getter = function () {
		return parseFloat(this.el.getAttribute(attribute));
	};

	const setter = function (to) {
		const parsed = parseFloat(to);
		const oldValue = this[attribute];

		if (parsed === oldValue) {
			return;
		}

		if (!Number.isNaN(parsed)) {
			this.el.setAttribute(attribute, parsed);
		} else {
			console.warn(`Could not set ${attribute} to ${to}`);
			this.el.removeAttribute(attribute);
		}
	};

	return { getter, setter };
};

const generateAttributeMethods = function (attribute, type = 'string') {
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

const CONTROLLER = Symbol('controller');

const registerElement = function (tag, options) {
	const observedAttributes = options.observedAttributes || [];

	customElements.define(tag, class extends HTMLElement {
		static get observedAttributes() {
			return observedAttributes;
		}

		attributeChangedCallback(attribute, oldValue, newValue) {
			if (oldValue === newValue) {
				return;
			}

			if (!this[CONTROLLER]) {
				return;
			}

			const propertyName = convertAttributeToPropertyName(attribute);

			const prototype = Object.getPrototypeOf(this[CONTROLLER]);
			const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);

			if (descriptor && descriptor.set) {
				this[CONTROLLER][propertyName] = newValue;
			}

			// If for argument `current` the method
			// `currentChangedCallback` exists, trigger
			const callback = this[CONTROLLER][`${propertyName}ChangedCallback`];

			if (typeof callback === 'function') {
				callback.call(this[CONTROLLER], oldValue, newValue);
			}
		}

		constructor() {
			super();

			observedAttributes.forEach((attribute) => {
				if (typeof this[attribute] !== 'undefined') {
					console.warn(`Requested syncing on attribute '${attribute}' that already has defined behavior`);
				}

				Object.defineProperty(this, attribute, {
					configurable: false,
					enumerable: false,
					get: () => this[CONTROLLER][attribute],
					set: (to) => { this[CONTROLLER][attribute] = to; },
				});
			});
		}

		connectedCallback() {
			this[CONTROLLER] = new options.controller(this);
		}

		disconnectedCallback() {
			if (typeof this[CONTROLLER].unbind === 'function') {
				this[CONTROLLER].unbind();
			}

			if (typeof this[CONTROLLER].destroy === 'function') {
				this[CONTROLLER].destroy();
			}

			this[CONTROLLER] = null;
		}
	});
};

const registerAttribute = (function registerAttribute() {
	const handlers = [];

	const observer = new MutationObserver((mutations) => {
		
	});

	return function register(attribute, options = {}) {
		waitForDOMReady().then(() => {
			const extend = options.extends || HTMLElement;

			const nodeIsSupported = function (node) {
				if (Array.isArray(extend)) {
					return extend.some((supported) => node instanceof supported);
				}

				return node instanceof extend;
			};

			const attach = function (node) {
				const el = node;
				el[CONTROLLER] = new options.controller(el);
				return el;
			};

			const detach = function (node) {
				const el = node;

				if (el[CONTROLLER]) {
					el[CONTROLLER].destroy();
					el[CONTROLLER] = null;
				}

				return el;
			};

			// Setup observers
			handlers.push((mutation) => {
				if (mutation.type === 'attributes' && nodeIsSupported(mutation.target)) {
					// Attribute changed on supported DOM node type
					const node = mutation.target;

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
				attributeFilter: [attribute],
			});

			// Look for current on DOM ready
			Array.from(document.body.querySelectorAll(`[${attribute}]`), (el) => {
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
}());

const addAttributesToController = function (controller, attributes = []) {
	return attributes.map((attribute) => {
		// String, sync with actual element attribute
		if (typeof attribute === 'string') {
			const { getter, setter } = generateAttributeMethods(attribute, 'string');
			addProperty(controller, attribute, getter, setter);
			return attribute;
		}

		if (typeof attribute === 'object') {
			const type = attribute.type || 'string';
			const name = attribute.attribute;
			const { getter, setter } = generateAttributeMethods(name, type);
			addProperty(controller, name, getter, setter);
			return name;
		}

		if (typeof attribute.attachTo === 'function') {
			attribute.attachTo(controller);
			return false;
		}

		return false;
	}).filter((attribute) => !!attribute);
};

function defineCustomElement(tag, options = {}) {
	// Validate tag
	const isValidTag = tag.split('-').length > 1;

	// Validate type
	const type = ['element', 'attribute'].includes(options.type) ? options.type : 'element';

	if (type === 'element' && !isValidTag) {
		console.warn(tag, 'is not a valid Custom Element name. Register as an attribute instead.');
		return false;
	}

	// Validate attributes
	const attributes = Array.isArray(options.attributes) ? options.attributes : [];

	// Validate controller
	const controller = options.controller;

	// Validate extends
	const extend = options.extends;

	if (type === 'element' && extend) {
		console.warn('`extends` is not supported on element-registered Custom Elements. Register as an attribute instead.');
		return false;
	}

	const observedAttributes = addAttributesToController(controller, attributes);

	const validatedOptions = { type, extends: extend, attributes, controller, observedAttributes };

	if (type === 'attribute') {
		return registerAttribute(tag, validatedOptions);
	}

	return registerElement(tag, validatedOptions);
}

// Base Controller

defineCustomElement('mr-slideshow', {
	attributes: [
		{ attribute: 'loop', type: 'bool' },
		{ attribute: 'auto', type: 'int' },
		{ attribute: 'current', type: 'int' },
	],
	controller: class extends BaseController {
		set current(to) {
			let parsed = parseInt(to, 10);

			if (parsed === this.current) {
				return;
			}

			const max = this.elements.items.length;

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

			this.elements.items.forEach((item, i) => {
				if (item.classList.contains('is-active')) {
					item.classList.remove('is-active');
				}

				if (i === parsed) {
					item.classList.add('is-active');
				}
			});

			this.el.setAttribute('current', parsed);
		}

		set auto(to) {
			const parsed = parseInt(to, 10);

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

		start() {
			this.stop();

			if (this.auto && this.auto > 0) {
				console.log('Starting auto interval', this.auto);

				this.looper = setInterval(() => {
					this.next();
				}, this.auto);
			}
		}

		stop() {
			if (this.looper) {
				console.log('Stopping auto interval');
				clearInterval(this.looper);
				this.looper = null;
			}
		}

		next() {
			this.current = this.current + 1;
		}

		previous() {
			this.current = this.current - 1;
		}

		resolve() {
			if (this.el.children.length === 1) {
				// Keep hanging, don't activate if empty
				return new Promise(() => {});
			}

			return super.resolve();
		}

		init() {
			this.elements = {};
			this.elements.items = Array.from(this.el.children);

			this.current = 0;

			this.start();
		}

		destroy() {
			this.stop();
			super.destroy();
		}
	},
});
