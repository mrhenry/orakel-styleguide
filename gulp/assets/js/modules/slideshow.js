import { defineCustomElement, BaseController } from 'custom-elements-helpers';

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

			this.el.setAttribute('current', parsed);

			this.render();
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
				this.looper = setInterval(() => {
					this.next();
				}, this.auto);
			}
		}

		stop() {
			if (this.looper) {
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

			if (!this.current) {
				this.current = 0;
			}

			this.start();
		}

		render() {
			this.elements.items.forEach((item, i) => {
				if (item.classList.contains('is-active')) {
					item.classList.remove('is-active');
				}

				if (i === this.current) {
					item.classList.add('is-active');
				}
			});
		}

		destroy() {
			this.stop();
			super.destroy();
		}
	},
});
