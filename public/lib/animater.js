(function(window, document) {
	"use strict";

	var config = {
		assetsUrl: './assets/',
		containerId: 'animaters',
		loadingId: 'loading'
	};
	var zIndex = 1000;

	var Loading = {
		/**
		 * @param [immediately]
		 */
		show: function(immediately) {
			if (immediately) {
				this.timer && clearTimeout(this.timer);
				this.timer = null;
				var loading = $(config.loadingId);
				if (loading) {
					loading.style.visibility = 'visible';
				}
			}
			else if (!this.timer) {
				var that = this;
				this.timer = setTimeout(function() {
					that.show(true);
				}, 1000);
			}
		},
		hide: function() {
			this.timer && clearTimeout(this.timer);
			this.timer = null;
			var loading = $(config.loadingId);
			if (loading) {
				loading.style.visibility = 'hidden';
			}
		}
	};
	/**
	 * @param {HTMLElement[]} elements
	 * @param {HTMLElement} animaterElement
	 * @constructor
	 */
	var AnimateElement = function(elements, animaterElement) {
		this._els = elements ? elements : [];
		this._rootEl = animaterElement;
	};
	AnimateElement.prototype = {
		/**
		 * @param {Number} top
		 */
		topCenter: function(top) {
			var rootSize = {
				width: this._rootEl.offsetWidth,
				height: this._rootEl.offsetHeight
			};
			this._els.forEach(function(el) {
				TweenLite.set(el, {
					left: (rootSize.width-el.offsetWidth)/2,
					top: top || 0
				});
			});
			return this;
		},
		/**
		 * @param {Number} bottom
		 */
		bottomCenter: function(bottom) {
			var rootSize = {
				width: this._rootEl.offsetWidth,
				height: this._rootEl.offsetHeight
			};
			this._els.forEach(function(el) {
				TweenLite.set(el, {
					left: (rootSize.width-el.offsetWidth)/2,
					bottom: bottom || 0
				});
			});
			return this;
		},
		/**
		 * 动画中是否可视使用透明度实验
		 * @param {Boolean} visible
		 */
		visible: function(visible) {
			TweenLite.set(this._els, {
				opacity: Number(!!visible)
			});
			return this;
		},
		width: function() {
			return this.get(0).offsetWidth;
		},
		height: function() {
			return this.get(0).offsetHeight;
		},
		/**
		 * @returns {AnimateElement}
		 */
		parent: function() {
			return new AnimateElement([this.get(0).parentNode], this._rootEl);
		},
		/**
		 * @param {Object} cssAttrs
		 */
		css: function(cssAttrs) {
			TweenLite.set(this._els, cssAttrs);
			return this;
		},
		/**
		 * @param {string} attrName
		 * @param {string} [value]
		 * @returns {string|AnimateElement}
		 */
		attr: function(attrName, value) {
			var args = Array.prototype.slice.call(arguments);
			if (args.length < 2) {
				return this.get(0).getAttribute(attrName);
			}
			else {
				this.get(0).setAttribute(attrName, value);
				return this;
			}
		},
		each: function(callback) {
			callback || (callback = function() {});
			var rootEl = this._rootEl;
			this._els.forEach(function(el, i) {
				el = new AnimateElement([el], rootEl);
				callback.apply(el, [el, i]);
			});
			return this;
		},
		/**
		 * @param {Number} [number]
		 * @returns {Array|HTMLElement}
		 */
		get: function(number) {
			if (number == undefined) {
				return this._els;
			}
			else {
				return this._els[number];
			}
		},
		remove: function() {
			this._els.forEach(function(el) {
				el.parentNode.removeChild(el);
			});
			return this;
		},
		item: function(number) {
			return new AnimateElement(this.get(number), this._rootEl);
		},
		find: function(selector) {
			selector = this.get(0).querySelectorAll(selector);
			var els = [];
			if (selector) {
				els = Array.prototype.slice.call(selector);
			}
			return new AnimateElement(els, this._rootEl);
		},
		tap: function(listener) {
			this._els.forEach(function(el) {
				el.addEventListener('click', listener, false);
				el.addEventListener('touchend', listener, false);
			});
			return this;
		},
		onceTap: function(listener) {
			var callback = function() {
				this.removeEventListener('click', callback, false);
				this.removeEventListener('touchend', callback, false);
				listener && listener.apply(this, arguments);
			};
			this._els.forEach(function(el) {
				el.addEventListener('click', callback, false);
				el.addEventListener('touchend', callback, false);
			});
			return this;
		},
		/**
		 * @param {String} className
		 */
		addClass: function(className) {
			this._els.forEach(function(el) {
				el.classList.add(className);
			});
			return this;
		},
		/**
		 * @param {String} className
		 */
		removeClass: function(className) {
			this._els.forEach(function(el) {
				el.classList.remove(className);
			});
			return this;
		},
		/**
		 * @returns {Number}
		 */
		size: function() {
			return this._els.length;
		},
		/**
		 * @param {Number} duration
		 * @param {Object} vars
		 */
		to: function(duration, vars) {
			return TweenLite.to(this._els, duration, vars);;
		}
	};
	AnimateElement.prototype.constructor = AnimateElement;

	var Animater = function(id) {
		this.id = id;
		this._readys = [];
		this._done = [];
		this._animation = [];
		this._loaded = false;
		this.state = false;
		this.container = createElement(id, 'div', $(config.containerId));
		this.container.className = 'animater';
		this.container.style.zIndex = zIndex;
		zIndex--;
		this._assetsList = Animater._assets[id] || [];
		if (Animater._assets.hasOwnProperty(id)) {
			delete Animater._assets[id];
		}
		this._loadAssetsList();
	};

	var prop = Animater.prototype;
	prop.log = function(msg) {
		console && console.log && console.log(msg);
	};
	prop.ready = function(callback) {
		if (this._loaded) {
			var that = this;
			setTimeout(function() {
				callback.call(that);
			}, 0);
		}
		else {
			this._readys.push(callback);
		}
	};
	/**
	 * @param selector
	 * @returns {AnimateElement}
	 */
	prop.$ = function(selector) {
		selector = this.container.querySelectorAll(selector);
		var els = [];
		if (selector) {
			els = Array.prototype.slice.call(selector);
		}
		return new AnimateElement(els, this.container);
	};
	prop._loadAssetsList = function() {
		this._assetsList.forEach(function(assets) {
			var img = new Image();
			var src = config.assetsUrl + assets[1];
			this.log('load assets: ' + '{id:' + assets[0] + ', src:' + src + '}');
			img.src = src;
		}, this);
	};
	prop.load = function() {
		Loading.show();
		var that = this;
		var assetsList = this._assetsList;
		if (assetsList.length > 0) {
			var loadedCount = 0;
			var loaded = function() {
				loadedCount++;
				if (loadedCount >= assetsList.length) {
					setTimeout(function() {
						that._loadComplete();
					}, 100);
				}
			};
			assetsList.forEach(function(assets) {
				var img = this.container.querySelector('[aid=' + assets[0] + ']');
				if (!img) {
					img = that.createAssetsEl(assets[0]);
				}
				img.id = that.id + '_' + assets[0];
				var src = config.assetsUrl + assets[1];
				img.src = src;
				if (img.complete) {
					loaded();
				}
				else {
					img.onload = img.onerror = loaded;
				}
			}, this);
		}
		else {
			setTimeout(function() {
				that._loadComplete();
			}, 0);
		}
	};
	prop._loadComplete = function() {
		Loading.hide();
		this._loaded = 1;
		this._readys.forEach(function(callback) {
			callback.call(this);
		}, this);
		this._readys = [];
	};
	prop.createAssetsEl = function(id) {
		var img = document.createElement('img');
		img.className = id;
		this.container.appendChild(img);
		return img;
	};
	prop.define = function(animation) {
		this._animation.push(animation);
	};
	prop._next = function() {
		if (this._animation.length > 0) {
			var animation = this._animation.shift();
			animation.call(this, this._next.bind(this));
		}
		else {
			this.state = true;
			this._done.forEach(function(callback) {
				callback.call(this);
			}, this);
			this._done = [];
		}
	};
	prop.run = function() {
		this.ready(function() {
			this._next();
		});
	};
	prop.done = function(callback) {
		if (this.state) {
			callback.call(this);
		}
		else {
			this._done.push(callback);
		}
	};
	Animater._assets = {};
	Animater.assets = function(type, id, filename) {
		if (typeof id == 'object') {
			var files = id;
			Object.keys(files).forEach(function(id) {
				Animater.assets(type, id, files[id]);
			});
		}
		else {
			Animater._assets[type] || (Animater._assets[type] = []);
			Animater._assets[type].push([id, filename])
		}
	};
	Animater.init = function() {
		createElement(config.containerId);
		createElement(config.loadingId);
		touch.on('#' + config.containerId, 'touchstart touchmove', function(e) {
			e.preventDefault();
		});
	};
	window.Loading = Loading;
	window.Animater = Animater;

	/**
	 * @param {String} id
	 * @param {String} [elementName]
	 * @param {HTMLElement} [parentNode]
	 * @return {HTMLElement}
	 */
	function createElement(id, elementName, parentNode) {
		parentNode || (parentNode = document.body);
		elementName || (elementName = 'div');
		var element = document.getElementById(id);
		if (!element) {
			element = document.createElement(elementName);
			element.id = id;
			parentNode.appendChild(element);
		}
		return element;
	};
	/**
	 * @param {String} id
	 * @returns {HTMLElement}
	 */
	function $(id) {
		return document.getElementById(id);
	};

})(window, document);
