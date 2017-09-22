import { defineCustomElement, BaseController } from 'custom-elements-helpers';

defineCustomElement('mr-slideshow', {
	attributes: [
		{ attribute: 'loop', type: 'bool' },
	],
	controller: class extends BaseController {
		get current() {
			return this._current;
		}

		set current(to) {
			let parsed = parseInt(to, 10);

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

			this._current = parsed;
		}

		resolve() {
			if (this.el.children.length === 1) {
				// Keep hanging, don't activate if empty
				return new Promise(() => {});
			}
			return super.resolve();
		}

		init() {
			this.elements = {
				items: Array.from(this.el.children),
			};

			this.current = 0;

			return this;
		}

		bind() {
			if (this.loop) {
				this.looper = setInterval(() => {
					this.current = this.current + 1;
				}, 4000);
			}

			return this;
		}

		destroy() {
			if (this.looper) {
				clearInterval(this.looper);
				this.looper = null;
			}
		}
	},
});
