var app = (function () {
    'use strict';

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    let SvelteElement;
    if (typeof HTMLElement === 'function') {
        SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
                const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
                callbacks.push(callback);
                return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1)
                        callbacks.splice(index, 1);
                };
            }
            $set($$props) {
                if (this.$$set && !is_empty($$props)) {
                    this.$$.skip_bound = true;
                    this.$$set($$props);
                    this.$$.skip_bound = false;
                }
            }
        };
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var prism = createCommonjsModule(function (module) {
    /* **********************************************
         Begin prism-core.js
    ********************************************** */

    /// <reference lib="WebWorker"/>

    var _self = (typeof window !== 'undefined')
    	? window   // if in browser
    	: (
    		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
    		? self // if in worker
    		: {}   // if in node js
    	);

    /**
     * Prism: Lightweight, robust, elegant syntax highlighting
     *
     * @license MIT <https://opensource.org/licenses/MIT>
     * @author Lea Verou <https://lea.verou.me>
     * @namespace
     * @public
     */
    var Prism = (function (_self){

    // Private helper vars
    var lang = /\blang(?:uage)?-([\w-]+)\b/i;
    var uniqueId = 0;


    var _ = {
    	/**
    	 * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
    	 * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
    	 * additional languages or plugins yourself.
    	 *
    	 * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
    	 *
    	 * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
    	 * empty Prism object into the global scope before loading the Prism script like this:
    	 *
    	 * ```js
    	 * window.Prism = window.Prism || {};
    	 * Prism.manual = true;
    	 * // add a new <script> to load Prism's script
    	 * ```
    	 *
    	 * @default false
    	 * @type {boolean}
    	 * @memberof Prism
    	 * @public
    	 */
    	manual: _self.Prism && _self.Prism.manual,
    	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,

    	/**
    	 * A namespace for utility methods.
    	 *
    	 * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
    	 * change or disappear at any time.
    	 *
    	 * @namespace
    	 * @memberof Prism
    	 */
    	util: {
    		encode: function encode(tokens) {
    			if (tokens instanceof Token) {
    				return new Token(tokens.type, encode(tokens.content), tokens.alias);
    			} else if (Array.isArray(tokens)) {
    				return tokens.map(encode);
    			} else {
    				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
    			}
    		},

    		/**
    		 * Returns the name of the type of the given value.
    		 *
    		 * @param {any} o
    		 * @returns {string}
    		 * @example
    		 * type(null)      === 'Null'
    		 * type(undefined) === 'Undefined'
    		 * type(123)       === 'Number'
    		 * type('foo')     === 'String'
    		 * type(true)      === 'Boolean'
    		 * type([1, 2])    === 'Array'
    		 * type({})        === 'Object'
    		 * type(String)    === 'Function'
    		 * type(/abc+/)    === 'RegExp'
    		 */
    		type: function (o) {
    			return Object.prototype.toString.call(o).slice(8, -1);
    		},

    		/**
    		 * Returns a unique number for the given object. Later calls will still return the same number.
    		 *
    		 * @param {Object} obj
    		 * @returns {number}
    		 */
    		objId: function (obj) {
    			if (!obj['__id']) {
    				Object.defineProperty(obj, '__id', { value: ++uniqueId });
    			}
    			return obj['__id'];
    		},

    		/**
    		 * Creates a deep clone of the given object.
    		 *
    		 * The main intended use of this function is to clone language definitions.
    		 *
    		 * @param {T} o
    		 * @param {Record<number, any>} [visited]
    		 * @returns {T}
    		 * @template T
    		 */
    		clone: function deepClone(o, visited) {
    			visited = visited || {};

    			var clone, id;
    			switch (_.util.type(o)) {
    				case 'Object':
    					id = _.util.objId(o);
    					if (visited[id]) {
    						return visited[id];
    					}
    					clone = /** @type {Record<string, any>} */ ({});
    					visited[id] = clone;

    					for (var key in o) {
    						if (o.hasOwnProperty(key)) {
    							clone[key] = deepClone(o[key], visited);
    						}
    					}

    					return /** @type {any} */ (clone);

    				case 'Array':
    					id = _.util.objId(o);
    					if (visited[id]) {
    						return visited[id];
    					}
    					clone = [];
    					visited[id] = clone;

    					(/** @type {Array} */(/** @type {any} */(o))).forEach(function (v, i) {
    						clone[i] = deepClone(v, visited);
    					});

    					return /** @type {any} */ (clone);

    				default:
    					return o;
    			}
    		},

    		/**
    		 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
    		 *
    		 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
    		 *
    		 * @param {Element} element
    		 * @returns {string}
    		 */
    		getLanguage: function (element) {
    			while (element && !lang.test(element.className)) {
    				element = element.parentElement;
    			}
    			if (element) {
    				return (element.className.match(lang) || [, 'none'])[1].toLowerCase();
    			}
    			return 'none';
    		},

    		/**
    		 * Returns the script element that is currently executing.
    		 *
    		 * This does __not__ work for line script element.
    		 *
    		 * @returns {HTMLScriptElement | null}
    		 */
    		currentScript: function () {
    			if (typeof document === 'undefined') {
    				return null;
    			}
    			if ('currentScript' in document && 1 < 2 /* hack to trip TS' flow analysis */) {
    				return /** @type {any} */ (document.currentScript);
    			}

    			// IE11 workaround
    			// we'll get the src of the current script by parsing IE11's error stack trace
    			// this will not work for inline scripts

    			try {
    				throw new Error();
    			} catch (err) {
    				// Get file src url from stack. Specifically works with the format of stack traces in IE.
    				// A stack will look like this:
    				//
    				// Error
    				//    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
    				//    at Global code (http://localhost/components/prism-core.js:606:1)

    				var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) || [])[1];
    				if (src) {
    					var scripts = document.getElementsByTagName('script');
    					for (var i in scripts) {
    						if (scripts[i].src == src) {
    							return scripts[i];
    						}
    					}
    				}
    				return null;
    			}
    		},

    		/**
    		 * Returns whether a given class is active for `element`.
    		 *
    		 * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
    		 * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
    		 * given class is just the given class with a `no-` prefix.
    		 *
    		 * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
    		 * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
    		 * ancestors have the given class or the negated version of it, then the default activation will be returned.
    		 *
    		 * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
    		 * version of it, the class is considered active.
    		 *
    		 * @param {Element} element
    		 * @param {string} className
    		 * @param {boolean} [defaultActivation=false]
    		 * @returns {boolean}
    		 */
    		isActive: function (element, className, defaultActivation) {
    			var no = 'no-' + className;

    			while (element) {
    				var classList = element.classList;
    				if (classList.contains(className)) {
    					return true;
    				}
    				if (classList.contains(no)) {
    					return false;
    				}
    				element = element.parentElement;
    			}
    			return !!defaultActivation;
    		}
    	},

    	/**
    	 * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
    	 *
    	 * @namespace
    	 * @memberof Prism
    	 * @public
    	 */
    	languages: {
    		/**
    		 * Creates a deep copy of the language with the given id and appends the given tokens.
    		 *
    		 * If a token in `redef` also appears in the copied language, then the existing token in the copied language
    		 * will be overwritten at its original position.
    		 *
    		 * ## Best practices
    		 *
    		 * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
    		 * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
    		 * understand the language definition because, normally, the order of tokens matters in Prism grammars.
    		 *
    		 * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
    		 * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
    		 *
    		 * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
    		 * @param {Grammar} redef The new tokens to append.
    		 * @returns {Grammar} The new language created.
    		 * @public
    		 * @example
    		 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
    		 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
    		 *     // at its original position
    		 *     'comment': { ... },
    		 *     // CSS doesn't have a 'color' token, so this token will be appended
    		 *     'color': /\b(?:red|green|blue)\b/
    		 * });
    		 */
    		extend: function (id, redef) {
    			var lang = _.util.clone(_.languages[id]);

    			for (var key in redef) {
    				lang[key] = redef[key];
    			}

    			return lang;
    		},

    		/**
    		 * Inserts tokens _before_ another token in a language definition or any other grammar.
    		 *
    		 * ## Usage
    		 *
    		 * This helper method makes it easy to modify existing languages. For example, the CSS language definition
    		 * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
    		 * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
    		 * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
    		 * this:
    		 *
    		 * ```js
    		 * Prism.languages.markup.style = {
    		 *     // token
    		 * };
    		 * ```
    		 *
    		 * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
    		 * before existing tokens. For the CSS example above, you would use it like this:
    		 *
    		 * ```js
    		 * Prism.languages.insertBefore('markup', 'cdata', {
    		 *     'style': {
    		 *         // token
    		 *     }
    		 * });
    		 * ```
    		 *
    		 * ## Special cases
    		 *
    		 * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
    		 * will be ignored.
    		 *
    		 * This behavior can be used to insert tokens after `before`:
    		 *
    		 * ```js
    		 * Prism.languages.insertBefore('markup', 'comment', {
    		 *     'comment': Prism.languages.markup.comment,
    		 *     // tokens after 'comment'
    		 * });
    		 * ```
    		 *
    		 * ## Limitations
    		 *
    		 * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
    		 * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
    		 * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
    		 * deleting properties which is necessary to insert at arbitrary positions.
    		 *
    		 * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
    		 * Instead, it will create a new object and replace all references to the target object with the new one. This
    		 * can be done without temporarily deleting properties, so the iteration order is well-defined.
    		 *
    		 * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
    		 * you hold the target object in a variable, then the value of the variable will not change.
    		 *
    		 * ```js
    		 * var oldMarkup = Prism.languages.markup;
    		 * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
    		 *
    		 * assert(oldMarkup !== Prism.languages.markup);
    		 * assert(newMarkup === Prism.languages.markup);
    		 * ```
    		 *
    		 * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
    		 * object to be modified.
    		 * @param {string} before The key to insert before.
    		 * @param {Grammar} insert An object containing the key-value pairs to be inserted.
    		 * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
    		 * object to be modified.
    		 *
    		 * Defaults to `Prism.languages`.
    		 * @returns {Grammar} The new grammar object.
    		 * @public
    		 */
    		insertBefore: function (inside, before, insert, root) {
    			root = root || /** @type {any} */ (_.languages);
    			var grammar = root[inside];
    			/** @type {Grammar} */
    			var ret = {};

    			for (var token in grammar) {
    				if (grammar.hasOwnProperty(token)) {

    					if (token == before) {
    						for (var newToken in insert) {
    							if (insert.hasOwnProperty(newToken)) {
    								ret[newToken] = insert[newToken];
    							}
    						}
    					}

    					// Do not insert token which also occur in insert. See #1525
    					if (!insert.hasOwnProperty(token)) {
    						ret[token] = grammar[token];
    					}
    				}
    			}

    			var old = root[inside];
    			root[inside] = ret;

    			// Update references in other language definitions
    			_.languages.DFS(_.languages, function(key, value) {
    				if (value === old && key != inside) {
    					this[key] = ret;
    				}
    			});

    			return ret;
    		},

    		// Traverse a language definition with Depth First Search
    		DFS: function DFS(o, callback, type, visited) {
    			visited = visited || {};

    			var objId = _.util.objId;

    			for (var i in o) {
    				if (o.hasOwnProperty(i)) {
    					callback.call(o, i, o[i], type || i);

    					var property = o[i],
    					    propertyType = _.util.type(property);

    					if (propertyType === 'Object' && !visited[objId(property)]) {
    						visited[objId(property)] = true;
    						DFS(property, callback, null, visited);
    					}
    					else if (propertyType === 'Array' && !visited[objId(property)]) {
    						visited[objId(property)] = true;
    						DFS(property, callback, i, visited);
    					}
    				}
    			}
    		}
    	},

    	plugins: {},

    	/**
    	 * This is the most high-level function in Prism’s API.
    	 * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
    	 * each one of them.
    	 *
    	 * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
    	 *
    	 * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
    	 * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
    	 * @memberof Prism
    	 * @public
    	 */
    	highlightAll: function(async, callback) {
    		_.highlightAllUnder(document, async, callback);
    	},

    	/**
    	 * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
    	 * {@link Prism.highlightElement} on each one of them.
    	 *
    	 * The following hooks will be run:
    	 * 1. `before-highlightall`
    	 * 2. `before-all-elements-highlight`
    	 * 3. All hooks of {@link Prism.highlightElement} for each element.
    	 *
    	 * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
    	 * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
    	 * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
    	 * @memberof Prism
    	 * @public
    	 */
    	highlightAllUnder: function(container, async, callback) {
    		var env = {
    			callback: callback,
    			container: container,
    			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
    		};

    		_.hooks.run('before-highlightall', env);

    		env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

    		_.hooks.run('before-all-elements-highlight', env);

    		for (var i = 0, element; element = env.elements[i++];) {
    			_.highlightElement(element, async === true, env.callback);
    		}
    	},

    	/**
    	 * Highlights the code inside a single element.
    	 *
    	 * The following hooks will be run:
    	 * 1. `before-sanity-check`
    	 * 2. `before-highlight`
    	 * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
    	 * 4. `before-insert`
    	 * 5. `after-highlight`
    	 * 6. `complete`
    	 *
    	 * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
    	 * the element's language.
    	 *
    	 * @param {Element} element The element containing the code.
    	 * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
    	 * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
    	 * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
    	 * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
    	 *
    	 * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
    	 * asynchronous highlighting to work. You can build your own bundle on the
    	 * [Download page](https://prismjs.com/download.html).
    	 * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
    	 * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
    	 * @memberof Prism
    	 * @public
    	 */
    	highlightElement: function(element, async, callback) {
    		// Find language
    		var language = _.util.getLanguage(element);
    		var grammar = _.languages[language];

    		// Set language on the element, if not present
    		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

    		// Set language on the parent, for styling
    		var parent = element.parentElement;
    		if (parent && parent.nodeName.toLowerCase() === 'pre') {
    			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
    		}

    		var code = element.textContent;

    		var env = {
    			element: element,
    			language: language,
    			grammar: grammar,
    			code: code
    		};

    		function insertHighlightedCode(highlightedCode) {
    			env.highlightedCode = highlightedCode;

    			_.hooks.run('before-insert', env);

    			env.element.innerHTML = env.highlightedCode;

    			_.hooks.run('after-highlight', env);
    			_.hooks.run('complete', env);
    			callback && callback.call(env.element);
    		}

    		_.hooks.run('before-sanity-check', env);

    		if (!env.code) {
    			_.hooks.run('complete', env);
    			callback && callback.call(env.element);
    			return;
    		}

    		_.hooks.run('before-highlight', env);

    		if (!env.grammar) {
    			insertHighlightedCode(_.util.encode(env.code));
    			return;
    		}

    		if (async && _self.Worker) {
    			var worker = new Worker(_.filename);

    			worker.onmessage = function(evt) {
    				insertHighlightedCode(evt.data);
    			};

    			worker.postMessage(JSON.stringify({
    				language: env.language,
    				code: env.code,
    				immediateClose: true
    			}));
    		}
    		else {
    			insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
    		}
    	},

    	/**
    	 * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
    	 * and the language definitions to use, and returns a string with the HTML produced.
    	 *
    	 * The following hooks will be run:
    	 * 1. `before-tokenize`
    	 * 2. `after-tokenize`
    	 * 3. `wrap`: On each {@link Token}.
    	 *
    	 * @param {string} text A string with the code to be highlighted.
    	 * @param {Grammar} grammar An object containing the tokens to use.
    	 *
    	 * Usually a language definition like `Prism.languages.markup`.
    	 * @param {string} language The name of the language definition passed to `grammar`.
    	 * @returns {string} The highlighted HTML.
    	 * @memberof Prism
    	 * @public
    	 * @example
    	 * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
    	 */
    	highlight: function (text, grammar, language) {
    		var env = {
    			code: text,
    			grammar: grammar,
    			language: language
    		};
    		_.hooks.run('before-tokenize', env);
    		env.tokens = _.tokenize(env.code, env.grammar);
    		_.hooks.run('after-tokenize', env);
    		return Token.stringify(_.util.encode(env.tokens), env.language);
    	},

    	/**
    	 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
    	 * and the language definitions to use, and returns an array with the tokenized code.
    	 *
    	 * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
    	 *
    	 * This method could be useful in other contexts as well, as a very crude parser.
    	 *
    	 * @param {string} text A string with the code to be highlighted.
    	 * @param {Grammar} grammar An object containing the tokens to use.
    	 *
    	 * Usually a language definition like `Prism.languages.markup`.
    	 * @returns {TokenStream} An array of strings and tokens, a token stream.
    	 * @memberof Prism
    	 * @public
    	 * @example
    	 * let code = `var foo = 0;`;
    	 * let tokens = Prism.tokenize(code, Prism.languages.javascript);
    	 * tokens.forEach(token => {
    	 *     if (token instanceof Prism.Token && token.type === 'number') {
    	 *         console.log(`Found numeric literal: ${token.content}`);
    	 *     }
    	 * });
    	 */
    	tokenize: function(text, grammar) {
    		var rest = grammar.rest;
    		if (rest) {
    			for (var token in rest) {
    				grammar[token] = rest[token];
    			}

    			delete grammar.rest;
    		}

    		var tokenList = new LinkedList();
    		addAfter(tokenList, tokenList.head, text);

    		matchGrammar(text, tokenList, grammar, tokenList.head, 0);

    		return toArray(tokenList);
    	},

    	/**
    	 * @namespace
    	 * @memberof Prism
    	 * @public
    	 */
    	hooks: {
    		all: {},

    		/**
    		 * Adds the given callback to the list of callbacks for the given hook.
    		 *
    		 * The callback will be invoked when the hook it is registered for is run.
    		 * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
    		 *
    		 * One callback function can be registered to multiple hooks and the same hook multiple times.
    		 *
    		 * @param {string} name The name of the hook.
    		 * @param {HookCallback} callback The callback function which is given environment variables.
    		 * @public
    		 */
    		add: function (name, callback) {
    			var hooks = _.hooks.all;

    			hooks[name] = hooks[name] || [];

    			hooks[name].push(callback);
    		},

    		/**
    		 * Runs a hook invoking all registered callbacks with the given environment variables.
    		 *
    		 * Callbacks will be invoked synchronously and in the order in which they were registered.
    		 *
    		 * @param {string} name The name of the hook.
    		 * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
    		 * @public
    		 */
    		run: function (name, env) {
    			var callbacks = _.hooks.all[name];

    			if (!callbacks || !callbacks.length) {
    				return;
    			}

    			for (var i=0, callback; callback = callbacks[i++];) {
    				callback(env);
    			}
    		}
    	},

    	Token: Token
    };
    _self.Prism = _;


    // Typescript note:
    // The following can be used to import the Token type in JSDoc:
    //
    //   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

    /**
     * Creates a new token.
     *
     * @param {string} type See {@link Token#type type}
     * @param {string | TokenStream} content See {@link Token#content content}
     * @param {string|string[]} [alias] The alias(es) of the token.
     * @param {string} [matchedStr=""] A copy of the full string this token was created from.
     * @class
     * @global
     * @public
     */
    function Token(type, content, alias, matchedStr) {
    	/**
    	 * The type of the token.
    	 *
    	 * This is usually the key of a pattern in a {@link Grammar}.
    	 *
    	 * @type {string}
    	 * @see GrammarToken
    	 * @public
    	 */
    	this.type = type;
    	/**
    	 * The strings or tokens contained by this token.
    	 *
    	 * This will be a token stream if the pattern matched also defined an `inside` grammar.
    	 *
    	 * @type {string | TokenStream}
    	 * @public
    	 */
    	this.content = content;
    	/**
    	 * The alias(es) of the token.
    	 *
    	 * @type {string|string[]}
    	 * @see GrammarToken
    	 * @public
    	 */
    	this.alias = alias;
    	// Copy of the full string this token was created from
    	this.length = (matchedStr || '').length | 0;
    }

    /**
     * A token stream is an array of strings and {@link Token Token} objects.
     *
     * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
     * them.
     *
     * 1. No adjacent strings.
     * 2. No empty strings.
     *
     *    The only exception here is the token stream that only contains the empty string and nothing else.
     *
     * @typedef {Array<string | Token>} TokenStream
     * @global
     * @public
     */

    /**
     * Converts the given token or token stream to an HTML representation.
     *
     * The following hooks will be run:
     * 1. `wrap`: On each {@link Token}.
     *
     * @param {string | Token | TokenStream} o The token or token stream to be converted.
     * @param {string} language The name of current language.
     * @returns {string} The HTML representation of the token or token stream.
     * @memberof Token
     * @static
     */
    Token.stringify = function stringify(o, language) {
    	if (typeof o == 'string') {
    		return o;
    	}
    	if (Array.isArray(o)) {
    		var s = '';
    		o.forEach(function (e) {
    			s += stringify(e, language);
    		});
    		return s;
    	}

    	var env = {
    		type: o.type,
    		content: stringify(o.content, language),
    		tag: 'span',
    		classes: ['token', o.type],
    		attributes: {},
    		language: language
    	};

    	var aliases = o.alias;
    	if (aliases) {
    		if (Array.isArray(aliases)) {
    			Array.prototype.push.apply(env.classes, aliases);
    		} else {
    			env.classes.push(aliases);
    		}
    	}

    	_.hooks.run('wrap', env);

    	var attributes = '';
    	for (var name in env.attributes) {
    		attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
    	}

    	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
    };

    /**
     * @param {string} text
     * @param {LinkedList<string | Token>} tokenList
     * @param {any} grammar
     * @param {LinkedListNode<string | Token>} startNode
     * @param {number} startPos
     * @param {RematchOptions} [rematch]
     * @returns {void}
     * @private
     *
     * @typedef RematchOptions
     * @property {string} cause
     * @property {number} reach
     */
    function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
    	for (var token in grammar) {
    		if (!grammar.hasOwnProperty(token) || !grammar[token]) {
    			continue;
    		}

    		var patterns = grammar[token];
    		patterns = Array.isArray(patterns) ? patterns : [patterns];

    		for (var j = 0; j < patterns.length; ++j) {
    			if (rematch && rematch.cause == token + ',' + j) {
    				return;
    			}

    			var patternObj = patterns[j],
    				inside = patternObj.inside,
    				lookbehind = !!patternObj.lookbehind,
    				greedy = !!patternObj.greedy,
    				lookbehindLength = 0,
    				alias = patternObj.alias;

    			if (greedy && !patternObj.pattern.global) {
    				// Without the global flag, lastIndex won't work
    				var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
    				patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
    			}

    			/** @type {RegExp} */
    			var pattern = patternObj.pattern || patternObj;

    			for ( // iterate the token list and keep track of the current token/string position
    				var currentNode = startNode.next, pos = startPos;
    				currentNode !== tokenList.tail;
    				pos += currentNode.value.length, currentNode = currentNode.next
    			) {

    				if (rematch && pos >= rematch.reach) {
    					break;
    				}

    				var str = currentNode.value;

    				if (tokenList.length > text.length) {
    					// Something went terribly wrong, ABORT, ABORT!
    					return;
    				}

    				if (str instanceof Token) {
    					continue;
    				}

    				var removeCount = 1; // this is the to parameter of removeBetween

    				if (greedy && currentNode != tokenList.tail.prev) {
    					pattern.lastIndex = pos;
    					var match = pattern.exec(text);
    					if (!match) {
    						break;
    					}

    					var from = match.index + (lookbehind && match[1] ? match[1].length : 0);
    					var to = match.index + match[0].length;
    					var p = pos;

    					// find the node that contains the match
    					p += currentNode.value.length;
    					while (from >= p) {
    						currentNode = currentNode.next;
    						p += currentNode.value.length;
    					}
    					// adjust pos (and p)
    					p -= currentNode.value.length;
    					pos = p;

    					// the current node is a Token, then the match starts inside another Token, which is invalid
    					if (currentNode.value instanceof Token) {
    						continue;
    					}

    					// find the last node which is affected by this match
    					for (
    						var k = currentNode;
    						k !== tokenList.tail && (p < to || typeof k.value === 'string');
    						k = k.next
    					) {
    						removeCount++;
    						p += k.value.length;
    					}
    					removeCount--;

    					// replace with the new match
    					str = text.slice(pos, p);
    					match.index -= pos;
    				} else {
    					pattern.lastIndex = 0;

    					var match = pattern.exec(str);
    				}

    				if (!match) {
    					continue;
    				}

    				if (lookbehind) {
    					lookbehindLength = match[1] ? match[1].length : 0;
    				}

    				var from = match.index + lookbehindLength,
    					matchStr = match[0].slice(lookbehindLength),
    					to = from + matchStr.length,
    					before = str.slice(0, from),
    					after = str.slice(to);

    				var reach = pos + str.length;
    				if (rematch && reach > rematch.reach) {
    					rematch.reach = reach;
    				}

    				var removeFrom = currentNode.prev;

    				if (before) {
    					removeFrom = addAfter(tokenList, removeFrom, before);
    					pos += before.length;
    				}

    				removeRange(tokenList, removeFrom, removeCount);

    				var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
    				currentNode = addAfter(tokenList, removeFrom, wrapped);

    				if (after) {
    					addAfter(tokenList, currentNode, after);
    				}

    				if (removeCount > 1) {
    					// at least one Token object was removed, so we have to do some rematching
    					// this can only happen if the current pattern is greedy
    					matchGrammar(text, tokenList, grammar, currentNode.prev, pos, {
    						cause: token + ',' + j,
    						reach: reach
    					});
    				}
    			}
    		}
    	}
    }

    /**
     * @typedef LinkedListNode
     * @property {T} value
     * @property {LinkedListNode<T> | null} prev The previous node.
     * @property {LinkedListNode<T> | null} next The next node.
     * @template T
     * @private
     */

    /**
     * @template T
     * @private
     */
    function LinkedList() {
    	/** @type {LinkedListNode<T>} */
    	var head = { value: null, prev: null, next: null };
    	/** @type {LinkedListNode<T>} */
    	var tail = { value: null, prev: head, next: null };
    	head.next = tail;

    	/** @type {LinkedListNode<T>} */
    	this.head = head;
    	/** @type {LinkedListNode<T>} */
    	this.tail = tail;
    	this.length = 0;
    }

    /**
     * Adds a new node with the given value to the list.
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {T} value
     * @returns {LinkedListNode<T>} The added node.
     * @template T
     */
    function addAfter(list, node, value) {
    	// assumes that node != list.tail && values.length >= 0
    	var next = node.next;

    	var newNode = { value: value, prev: node, next: next };
    	node.next = newNode;
    	next.prev = newNode;
    	list.length++;

    	return newNode;
    }
    /**
     * Removes `count` nodes after the given node. The given node will not be removed.
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {number} count
     * @template T
     */
    function removeRange(list, node, count) {
    	var next = node.next;
    	for (var i = 0; i < count && next !== list.tail; i++) {
    		next = next.next;
    	}
    	node.next = next;
    	next.prev = node;
    	list.length -= i;
    }
    /**
     * @param {LinkedList<T>} list
     * @returns {T[]}
     * @template T
     */
    function toArray(list) {
    	var array = [];
    	var node = list.head.next;
    	while (node !== list.tail) {
    		array.push(node.value);
    		node = node.next;
    	}
    	return array;
    }


    if (!_self.document) {
    	if (!_self.addEventListener) {
    		// in Node.js
    		return _;
    	}

    	if (!_.disableWorkerMessageHandler) {
    		// In worker
    		_self.addEventListener('message', function (evt) {
    			var message = JSON.parse(evt.data),
    				lang = message.language,
    				code = message.code,
    				immediateClose = message.immediateClose;

    			_self.postMessage(_.highlight(code, _.languages[lang], lang));
    			if (immediateClose) {
    				_self.close();
    			}
    		}, false);
    	}

    	return _;
    }

    // Get current script and highlight
    var script = _.util.currentScript();

    if (script) {
    	_.filename = script.src;

    	if (script.hasAttribute('data-manual')) {
    		_.manual = true;
    	}
    }

    function highlightAutomaticallyCallback() {
    	if (!_.manual) {
    		_.highlightAll();
    	}
    }

    if (!_.manual) {
    	// If the document state is "loading", then we'll use DOMContentLoaded.
    	// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
    	// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
    	// might take longer one animation frame to execute which can create a race condition where only some plugins have
    	// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
    	// See https://github.com/PrismJS/prism/issues/2102
    	var readyState = document.readyState;
    	if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
    		document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
    	} else {
    		if (window.requestAnimationFrame) {
    			window.requestAnimationFrame(highlightAutomaticallyCallback);
    		} else {
    			window.setTimeout(highlightAutomaticallyCallback, 16);
    		}
    	}
    }

    return _;

    })(_self);

    if ( module.exports) {
    	module.exports = Prism;
    }

    // hack for components to work correctly in node.js
    if (typeof commonjsGlobal !== 'undefined') {
    	commonjsGlobal.Prism = Prism;
    }

    // some additional documentation/types

    /**
     * The expansion of a simple `RegExp` literal to support additional properties.
     *
     * @typedef GrammarToken
     * @property {RegExp} pattern The regular expression of the token.
     * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
     * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
     * @property {boolean} [greedy=false] Whether the token is greedy.
     * @property {string|string[]} [alias] An optional alias or list of aliases.
     * @property {Grammar} [inside] The nested grammar of this token.
     *
     * The `inside` grammar will be used to tokenize the text value of each token of this kind.
     *
     * This can be used to make nested and even recursive language definitions.
     *
     * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
     * each another.
     * @global
     * @public
    */

    /**
     * @typedef Grammar
     * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
     * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
     * @global
     * @public
     */

    /**
     * A function which will invoked after an element was successfully highlighted.
     *
     * @callback HighlightCallback
     * @param {Element} element The element successfully highlighted.
     * @returns {void}
     * @global
     * @public
    */

    /**
     * @callback HookCallback
     * @param {Object<string, any>} env The environment variables of the hook.
     * @returns {void}
     * @global
     * @public
     */


    /* **********************************************
         Begin prism-markup.js
    ********************************************** */

    Prism.languages.markup = {
    	'comment': /<!--[\s\S]*?-->/,
    	'prolog': /<\?[\s\S]+?\?>/,
    	'doctype': {
    		// https://www.w3.org/TR/xml/#NT-doctypedecl
    		pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    		greedy: true,
    		inside: {
    			'internal-subset': {
    				pattern: /(\[)[\s\S]+(?=\]>$)/,
    				lookbehind: true,
    				greedy: true,
    				inside: null // see below
    			},
    			'string': {
    				pattern: /"[^"]*"|'[^']*'/,
    				greedy: true
    			},
    			'punctuation': /^<!|>$|[[\]]/,
    			'doctype-tag': /^DOCTYPE/,
    			'name': /[^\s<>'"]+/
    		}
    	},
    	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
    	'tag': {
    		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    		greedy: true,
    		inside: {
    			'tag': {
    				pattern: /^<\/?[^\s>\/]+/,
    				inside: {
    					'punctuation': /^<\/?/,
    					'namespace': /^[^\s>\/:]+:/
    				}
    			},
    			'attr-value': {
    				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
    				inside: {
    					'punctuation': [
    						{
    							pattern: /^=/,
    							alias: 'attr-equals'
    						},
    						/"|'/
    					]
    				}
    			},
    			'punctuation': /\/?>/,
    			'attr-name': {
    				pattern: /[^\s>\/]+/,
    				inside: {
    					'namespace': /^[^\s>\/:]+:/
    				}
    			}

    		}
    	},
    	'entity': [
    		{
    			pattern: /&[\da-z]{1,8};/i,
    			alias: 'named-entity'
    		},
    		/&#x?[\da-f]{1,8};/i
    	]
    };

    Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
    	Prism.languages.markup['entity'];
    Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

    // Plugin to make entity title show the real entity, idea by Roman Komarov
    Prism.hooks.add('wrap', function (env) {

    	if (env.type === 'entity') {
    		env.attributes['title'] = env.content.replace(/&amp;/, '&');
    	}
    });

    Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    	/**
    	 * Adds an inlined language to markup.
    	 *
    	 * An example of an inlined language is CSS with `<style>` tags.
    	 *
    	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
    	 * case insensitive.
    	 * @param {string} lang The language key.
    	 * @example
    	 * addInlined('style', 'css');
    	 */
    	value: function addInlined(tagName, lang) {
    		var includedCdataInside = {};
    		includedCdataInside['language-' + lang] = {
    			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
    			lookbehind: true,
    			inside: Prism.languages[lang]
    		};
    		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

    		var inside = {
    			'included-cdata': {
    				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    				inside: includedCdataInside
    			}
    		};
    		inside['language-' + lang] = {
    			pattern: /[\s\S]+/,
    			inside: Prism.languages[lang]
    		};

    		var def = {};
    		def[tagName] = {
    			pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () { return tagName; }), 'i'),
    			lookbehind: true,
    			greedy: true,
    			inside: inside
    		};

    		Prism.languages.insertBefore('markup', 'cdata', def);
    	}
    });

    Prism.languages.html = Prism.languages.markup;
    Prism.languages.mathml = Prism.languages.markup;
    Prism.languages.svg = Prism.languages.markup;

    Prism.languages.xml = Prism.languages.extend('markup', {});
    Prism.languages.ssml = Prism.languages.xml;
    Prism.languages.atom = Prism.languages.xml;
    Prism.languages.rss = Prism.languages.xml;


    /* **********************************************
         Begin prism-css.js
    ********************************************** */

    (function (Prism) {

    	var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

    	Prism.languages.css = {
    		'comment': /\/\*[\s\S]*?\*\//,
    		'atrule': {
    			pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
    			inside: {
    				'rule': /^@[\w-]+/,
    				'selector-function-argument': {
    					pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
    					lookbehind: true,
    					alias: 'selector'
    				},
    				'keyword': {
    					pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
    					lookbehind: true
    				}
    				// See rest below
    			}
    		},
    		'url': {
    			// https://drafts.csswg.org/css-values-3/#urls
    			pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
    			greedy: true,
    			inside: {
    				'function': /^url/i,
    				'punctuation': /^\(|\)$/,
    				'string': {
    					pattern: RegExp('^' + string.source + '$'),
    					alias: 'url'
    				}
    			}
    		},
    		'selector': RegExp('[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'),
    		'string': {
    			pattern: string,
    			greedy: true
    		},
    		'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    		'important': /!important\b/i,
    		'function': /[-a-z0-9]+(?=\()/i,
    		'punctuation': /[(){};:,]/
    	};

    	Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

    	var markup = Prism.languages.markup;
    	if (markup) {
    		markup.tag.addInlined('style', 'css');

    		Prism.languages.insertBefore('inside', 'attr-value', {
    			'style-attr': {
    				pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
    				inside: {
    					'attr-name': {
    						pattern: /^\s*style/i,
    						inside: markup.tag.inside
    					},
    					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
    					'attr-value': {
    						pattern: /.+/i,
    						inside: Prism.languages.css
    					}
    				},
    				alias: 'language-css'
    			}
    		}, markup.tag);
    	}

    }(Prism));


    /* **********************************************
         Begin prism-clike.js
    ********************************************** */

    Prism.languages.clike = {
    	'comment': [
    		{
    			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    			lookbehind: true
    		},
    		{
    			pattern: /(^|[^\\:])\/\/.*/,
    			lookbehind: true,
    			greedy: true
    		}
    	],
    	'string': {
    		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    		greedy: true
    	},
    	'class-name': {
    		pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
    		lookbehind: true,
    		inside: {
    			'punctuation': /[.\\]/
    		}
    	},
    	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    	'boolean': /\b(?:true|false)\b/,
    	'function': /\w+(?=\()/,
    	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    	'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    	'punctuation': /[{}[\];(),.:]/
    };


    /* **********************************************
         Begin prism-javascript.js
    ********************************************** */

    Prism.languages.javascript = Prism.languages.extend('clike', {
    	'class-name': [
    		Prism.languages.clike['class-name'],
    		{
    			pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
    			lookbehind: true
    		}
    	],
    	'keyword': [
    		{
    			pattern: /((?:^|})\s*)(?:catch|finally)\b/,
    			lookbehind: true
    		},
    		{
    			pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\[$\w\xA0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    			lookbehind: true
    		},
    	],
    	'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    	'function': /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    	'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    });

    Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

    Prism.languages.insertBefore('javascript', 'keyword', {
    	'regex': {
    		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
    		lookbehind: true,
    		greedy: true,
    		inside: {
    			'regex-source': {
    				pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
    				lookbehind: true,
    				alias: 'language-regex',
    				inside: Prism.languages.regex
    			},
    			'regex-flags': /[a-z]+$/,
    			'regex-delimiter': /^\/|\/$/
    		}
    	},
    	// This must be declared before keyword because we use "function" inside the look-forward
    	'function-variable': {
    		pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
    		alias: 'function'
    	},
    	'parameter': [
    		{
    			pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		}
    	],
    	'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    });

    Prism.languages.insertBefore('javascript', 'string', {
    	'template-string': {
    		pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
    		greedy: true,
    		inside: {
    			'template-punctuation': {
    				pattern: /^`|`$/,
    				alias: 'string'
    			},
    			'interpolation': {
    				pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
    				lookbehind: true,
    				inside: {
    					'interpolation-punctuation': {
    						pattern: /^\${|}$/,
    						alias: 'punctuation'
    					},
    					rest: Prism.languages.javascript
    				}
    			},
    			'string': /[\s\S]+/
    		}
    	}
    });

    if (Prism.languages.markup) {
    	Prism.languages.markup.tag.addInlined('script', 'javascript');
    }

    Prism.languages.js = Prism.languages.javascript;


    /* **********************************************
         Begin prism-file-highlight.js
    ********************************************** */

    (function () {
    	if (typeof self === 'undefined' || !self.Prism || !self.document) {
    		return;
    	}

    	var Prism = window.Prism;

    	var LOADING_MESSAGE = 'Loading…';
    	var FAILURE_MESSAGE = function (status, message) {
    		return '✖ Error ' + status + ' while fetching file: ' + message;
    	};
    	var FAILURE_EMPTY_MESSAGE = '✖ Error: File does not exist or is empty';

    	var EXTENSIONS = {
    		'js': 'javascript',
    		'py': 'python',
    		'rb': 'ruby',
    		'ps1': 'powershell',
    		'psm1': 'powershell',
    		'sh': 'bash',
    		'bat': 'batch',
    		'h': 'c',
    		'tex': 'latex'
    	};

    	var STATUS_ATTR = 'data-src-status';
    	var STATUS_LOADING = 'loading';
    	var STATUS_LOADED = 'loaded';
    	var STATUS_FAILED = 'failed';

    	var SELECTOR = 'pre[data-src]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])'
    		+ ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';

    	var lang = /\blang(?:uage)?-([\w-]+)\b/i;

    	/**
    	 * Sets the Prism `language-xxxx` or `lang-xxxx` class to the given language.
    	 *
    	 * @param {HTMLElement} element
    	 * @param {string} language
    	 * @returns {void}
    	 */
    	function setLanguageClass(element, language) {
    		var className = element.className;
    		className = className.replace(lang, ' ') + ' language-' + language;
    		element.className = className.replace(/\s+/g, ' ').trim();
    	}


    	Prism.hooks.add('before-highlightall', function (env) {
    		env.selector += ', ' + SELECTOR;
    	});

    	Prism.hooks.add('before-sanity-check', function (env) {
    		var pre = /** @type {HTMLPreElement} */ (env.element);
    		if (pre.matches(SELECTOR)) {
    			env.code = ''; // fast-path the whole thing and go to complete

    			pre.setAttribute(STATUS_ATTR, STATUS_LOADING); // mark as loading

    			// add code element with loading message
    			var code = pre.appendChild(document.createElement('CODE'));
    			code.textContent = LOADING_MESSAGE;

    			var src = pre.getAttribute('data-src');

    			var language = env.language;
    			if (language === 'none') {
    				// the language might be 'none' because there is no language set;
    				// in this case, we want to use the extension as the language
    				var extension = (/\.(\w+)$/.exec(src) || [, 'none'])[1];
    				language = EXTENSIONS[extension] || extension;
    			}

    			// set language classes
    			setLanguageClass(code, language);
    			setLanguageClass(pre, language);

    			// preload the language
    			var autoloader = Prism.plugins.autoloader;
    			if (autoloader) {
    				autoloader.loadLanguages(language);
    			}

    			// load file
    			var xhr = new XMLHttpRequest();
    			xhr.open('GET', src, true);
    			xhr.onreadystatechange = function () {
    				if (xhr.readyState == 4) {
    					if (xhr.status < 400 && xhr.responseText) {
    						// mark as loaded
    						pre.setAttribute(STATUS_ATTR, STATUS_LOADED);

    						// highlight code
    						code.textContent = xhr.responseText;
    						Prism.highlightElement(code);

    					} else {
    						// mark as failed
    						pre.setAttribute(STATUS_ATTR, STATUS_FAILED);

    						if (xhr.status >= 400) {
    							code.textContent = FAILURE_MESSAGE(xhr.status, xhr.statusText);
    						} else {
    							code.textContent = FAILURE_EMPTY_MESSAGE;
    						}
    					}
    				}
    			};
    			xhr.send(null);
    		}
    	});

    	Prism.plugins.fileHighlight = {
    		/**
    		 * Executes the File Highlight plugin for all matching `pre` elements under the given container.
    		 *
    		 * Note: Elements which are already loaded or currently loading will not be touched by this method.
    		 *
    		 * @param {ParentNode} [container=document]
    		 */
    		highlight: function highlight(container) {
    			var elements = (container || document).querySelectorAll(SELECTOR);

    			for (var i = 0, element; element = elements[i++];) {
    				Prism.highlightElement(element);
    			}
    		}
    	};

    	var logged = false;
    	/** @deprecated Use `Prism.plugins.fileHighlight.highlight` instead. */
    	Prism.fileHighlight = function () {
    		if (!logged) {
    			console.warn('Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.');
    			logged = true;
    		}
    		Prism.plugins.fileHighlight.highlight.apply(this, arguments);
    	};

    })();
    });

    (function () {

    	if (typeof self === 'undefined' || !self.Prism || !self.document) {
    		return;
    	}

    	/**
    	 * Plugin name which is used as a class name for <pre> which is activating the plugin
    	 * @type {String}
    	 */
    	var PLUGIN_NAME = 'line-numbers';

    	/**
    	 * Regular expression used for determining line breaks
    	 * @type {RegExp}
    	 */
    	var NEW_LINE_EXP = /\n(?!$)/g;


    	/**
    	 * Global exports
    	 */
    	var config = Prism.plugins.lineNumbers = {
    		/**
    		 * Get node for provided line number
    		 * @param {Element} element pre element
    		 * @param {Number} number line number
    		 * @return {Element|undefined}
    		 */
    		getLine: function (element, number) {
    			if (element.tagName !== 'PRE' || !element.classList.contains(PLUGIN_NAME)) {
    				return;
    			}

    			var lineNumberRows = element.querySelector('.line-numbers-rows');
    			var lineNumberStart = parseInt(element.getAttribute('data-start'), 10) || 1;
    			var lineNumberEnd = lineNumberStart + (lineNumberRows.children.length - 1);

    			if (number < lineNumberStart) {
    				number = lineNumberStart;
    			}
    			if (number > lineNumberEnd) {
    				number = lineNumberEnd;
    			}

    			var lineIndex = number - lineNumberStart;

    			return lineNumberRows.children[lineIndex];
    		},

    		/**
    		 * Resizes the line numbers of the given element.
    		 *
    		 * This function will not add line numbers. It will only resize existing ones.
    		 * @param {HTMLElement} element A `<pre>` element with line numbers.
    		 * @returns {void}
    		 */
    		resize: function (element) {
    			resizeElements([element]);
    		},

    		/**
    		 * Whether the plugin can assume that the units font sizes and margins are not depended on the size of
    		 * the current viewport.
    		 *
    		 * Setting this to `true` will allow the plugin to do certain optimizations for better performance.
    		 *
    		 * Set this to `false` if you use any of the following CSS units: `vh`, `vw`, `vmin`, `vmax`.
    		 *
    		 * @type {boolean}
    		 */
    		assumeViewportIndependence: true
    	};

    	/**
    	 * Resizes the given elements.
    	 *
    	 * @param {HTMLElement[]} elements
    	 */
    	function resizeElements(elements) {
    		elements = elements.filter(function (e) {
    			var codeStyles = getStyles(e);
    			var whiteSpace = codeStyles['white-space'];
    			return whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line';
    		});

    		if (elements.length == 0) {
    			return;
    		}

    		var infos = elements.map(function (element) {
    			var codeElement = element.querySelector('code');
    			var lineNumbersWrapper = element.querySelector('.line-numbers-rows');
    			if (!codeElement || !lineNumbersWrapper) {
    				return undefined;
    			}

    			/** @type {HTMLElement} */
    			var lineNumberSizer = element.querySelector('.line-numbers-sizer');
    			var codeLines = codeElement.textContent.split(NEW_LINE_EXP);

    			if (!lineNumberSizer) {
    				lineNumberSizer = document.createElement('span');
    				lineNumberSizer.className = 'line-numbers-sizer';

    				codeElement.appendChild(lineNumberSizer);
    			}

    			lineNumberSizer.innerHTML = '0';
    			lineNumberSizer.style.display = 'block';

    			var oneLinerHeight = lineNumberSizer.getBoundingClientRect().height;
    			lineNumberSizer.innerHTML = '';

    			return {
    				element: element,
    				lines: codeLines,
    				lineHeights: [],
    				oneLinerHeight: oneLinerHeight,
    				sizer: lineNumberSizer,
    			};
    		}).filter(Boolean);

    		infos.forEach(function (info) {
    			var lineNumberSizer = info.sizer;
    			var lines = info.lines;
    			var lineHeights = info.lineHeights;
    			var oneLinerHeight = info.oneLinerHeight;

    			lineHeights[lines.length - 1] = undefined;
    			lines.forEach(function (line, index) {
    				if (line && line.length > 1) {
    					var e = lineNumberSizer.appendChild(document.createElement('span'));
    					e.style.display = 'block';
    					e.textContent = line;
    				} else {
    					lineHeights[index] = oneLinerHeight;
    				}
    			});
    		});

    		infos.forEach(function (info) {
    			var lineNumberSizer = info.sizer;
    			var lineHeights = info.lineHeights;

    			var childIndex = 0;
    			for (var i = 0; i < lineHeights.length; i++) {
    				if (lineHeights[i] === undefined) {
    					lineHeights[i] = lineNumberSizer.children[childIndex++].getBoundingClientRect().height;
    				}
    			}
    		});

    		infos.forEach(function (info) {
    			var lineNumberSizer = info.sizer;
    			var wrapper = info.element.querySelector('.line-numbers-rows');

    			lineNumberSizer.style.display = 'none';
    			lineNumberSizer.innerHTML = '';

    			info.lineHeights.forEach(function (height, lineNumber) {
    				wrapper.children[lineNumber].style.height = height + 'px';
    			});
    		});
    	}

    	/**
    	 * Returns style declarations for the element
    	 * @param {Element} element
    	 */
    	var getStyles = function (element) {
    		if (!element) {
    			return null;
    		}

    		return window.getComputedStyle ? getComputedStyle(element) : (element.currentStyle || null);
    	};

    	var lastWidth = undefined;
    	window.addEventListener('resize', function () {
    		if (config.assumeViewportIndependence && lastWidth === window.innerWidth) {
    			return;
    		}
    		lastWidth = window.innerWidth;

    		resizeElements(Array.prototype.slice.call(document.querySelectorAll('pre.' + PLUGIN_NAME)));
    	});

    	Prism.hooks.add('complete', function (env) {
    		if (!env.code) {
    			return;
    		}

    		var code = /** @type {Element} */ (env.element);
    		var pre = /** @type {HTMLElement} */ (code.parentNode);

    		// works only for <code> wrapped inside <pre> (not inline)
    		if (!pre || !/pre/i.test(pre.nodeName)) {
    			return;
    		}

    		// Abort if line numbers already exists
    		if (code.querySelector('.line-numbers-rows')) {
    			return;
    		}

    		// only add line numbers if <code> or one of its ancestors has the `line-numbers` class
    		if (!Prism.util.isActive(code, PLUGIN_NAME)) {
    			return;
    		}

    		// Remove the class 'line-numbers' from the <code>
    		code.classList.remove(PLUGIN_NAME);
    		// Add the class 'line-numbers' to the <pre>
    		pre.classList.add(PLUGIN_NAME);

    		var match = env.code.match(NEW_LINE_EXP);
    		var linesNum = match ? match.length + 1 : 1;
    		var lineNumbersWrapper;

    		var lines = new Array(linesNum + 1).join('<span></span>');

    		lineNumbersWrapper = document.createElement('span');
    		lineNumbersWrapper.setAttribute('aria-hidden', 'true');
    		lineNumbersWrapper.className = 'line-numbers-rows';
    		lineNumbersWrapper.innerHTML = lines;

    		if (pre.hasAttribute('data-start')) {
    			pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
    		}

    		env.element.appendChild(lineNumbersWrapper);

    		resizeElements([pre]);

    		Prism.hooks.run('line-numbers', env);
    	});

    	Prism.hooks.add('line-numbers', function (env) {
    		env.plugins = env.plugins || {};
    		env.plugins.lineNumbers = true;
    	});

    }());

    Prism.languages.c = Prism.languages.extend('clike', {
    	'comment': {
    		pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
    		greedy: true
    	},
    	'class-name': {
    		pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+/,
    		lookbehind: true
    	},
    	'keyword': /\b(?:__attribute__|_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
    	'function': /[a-z_]\w*(?=\s*\()/i,
    	'operator': />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
    	'number': /(?:\b0x(?:[\da-f]+\.?[\da-f]*|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)[ful]*/i
    });

    Prism.languages.insertBefore('c', 'string', {
    	'macro': {
    		// allow for multiline macro definitions
    		// spaces after the # character compile fine with gcc
    		pattern: /(^\s*)#\s*[a-z]+(?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
    		lookbehind: true,
    		greedy: true,
    		alias: 'property',
    		inside: {
    			'string': [
    				{
    					// highlight the path of the include statement as a string
    					pattern: /^(#\s*include\s*)<[^>]+>/,
    					lookbehind: true
    				},
    				Prism.languages.c['string']
    			],
    			'comment': Prism.languages.c['comment'],
    			// highlight macro directives as keywords
    			'directive': {
    				pattern: /^(#\s*)[a-z]+/,
    				lookbehind: true,
    				alias: 'keyword'
    			},
    			'directive-hash': /^#/,
    			'punctuation': /##|\\(?=[\r\n])/,
    			'expression': {
    				pattern: /\S[\s\S]*/,
    				inside: Prism.languages.c
    			}
    		}
    	},
    	// highlight predefined macros as constants
    	'constant': /\b(?:__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|stdin|stdout|stderr)\b/
    });

    delete Prism.languages.c['boolean'];

    Prism.languages.lua = {
    	'comment': /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
    	// \z may be used to skip the following space
    	'string': {
    		pattern: /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[\s\S]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
    		greedy: true
    	},
    	'number': /\b0x[a-f\d]+\.?[a-f\d]*(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|\.?\d*(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
    	'keyword': /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
    	'function': /(?!\d)\w+(?=\s*(?:[({]))/,
    	'operator': [
    		/[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/,
    		{
    			// Match ".." but don't break "..."
    			pattern: /(^|[^.])\.\.(?!\.)/,
    			lookbehind: true
    		}
    	],
    	'punctuation': /[\[\](){},;]|\.+|:+/
    };

    (function (Prism) {

    	var keyword = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char8_t|char16_t|char32_t|class|compl|concept|const|consteval|constexpr|constinit|const_cast|continue|co_await|co_return|co_yield|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/;

    	Prism.languages.cpp = Prism.languages.extend('c', {
    		'class-name': [
    			{
    				pattern: RegExp(/(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source
    					.replace(/<keyword>/g, function () { return keyword.source; })),
    				lookbehind: true
    			},
    			// This is intended to capture the class name of method implementations like:
    			//   void foo::bar() const {}
    			// However! The `foo` in the above example could also be a namespace, so we only capture the class name if
    			// it starts with an uppercase letter. This approximation should give decent results.
    			/\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
    			// This will capture the class name before destructors like:
    			//   Foo::~Foo() {}
    			/\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
    			// This also intends to capture the class name of method implementations but here the class has template
    			// parameters, so it can't be a namespace (until C++ adds generic namespaces).
    			/\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/
    		],
    		'keyword': keyword,
    		'number': {
    			pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+\.?[\da-f']*|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+\.?[\d']*|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]*/i,
    			greedy: true
    		},
    		'operator': />>=?|<<=?|->|([-+&|:])\1|[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
    		'boolean': /\b(?:true|false)\b/
    	});

    	Prism.languages.insertBefore('cpp', 'string', {
    		'raw-string': {
    			pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
    			alias: 'string',
    			greedy: true
    		}
    	});

    	Prism.languages.insertBefore('cpp', 'class-name', {
    		// the base clause is an optional list of parent classes
    		// https://en.cppreference.com/w/cpp/language/class
    		'base-clause': {
    			pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)(?:[^;{}"'])+?(?=\s*[;{])/,
    			lookbehind: true,
    			greedy: true,
    			inside: Prism.languages.extend('cpp', {})
    		}
    	});
    	Prism.languages.insertBefore('inside', 'operator', {
    		// All untokenized words that are not namespaces should be class names
    		'class-name': /\b[a-z_]\w*\b(?!\s*::)/i
    	}, Prism.languages.cpp['base-clause']);

    }(Prism));

    Prism.languages.r = {
    	'comment': /#.*/,
    	'string': {
    		pattern: /(['"])(?:\\.|(?!\1)[^\\\r\n])*\1/,
    		greedy: true
    	},
    	'percent-operator': {
    		// Includes user-defined operators
    		// and %%, %*%, %/%, %in%, %o%, %x%
    		pattern: /%[^%\s]*%/,
    		alias: 'operator'
    	},
    	'boolean': /\b(?:TRUE|FALSE)\b/,
    	'ellipsis': /\.\.(?:\.|\d+)/,
    	'number': [
    		/\b(?:NaN|Inf)\b/,
    		/(?:\b0x[\dA-Fa-f]+(?:\.\d*)?|\b\d+\.?\d*|\B\.\d+)(?:[EePp][+-]?\d+)?[iL]?/
    	],
    	'keyword': /\b(?:if|else|repeat|while|function|for|in|next|break|NULL|NA|NA_integer_|NA_real_|NA_complex_|NA_character_)\b/,
    	'operator': /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
    	'punctuation': /[(){}\[\],;]/
    };

    // issues: nested multiline comments
    Prism.languages.swift = Prism.languages.extend('clike', {
    	'string': {
    		pattern: /("|')(?:\\(?:\((?:[^()]|\([^)]+\))+\)|\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    		greedy: true,
    		inside: {
    			'interpolation': {
    				pattern: /\\\((?:[^()]|\([^)]+\))+\)/,
    				inside: {
    					delimiter: {
    						pattern: /^\\\(|\)$/,
    						alias: 'variable'
    					}
    					// See rest below
    				}
    			}
    		}
    	},
    	'keyword': /\b(?:as|associativity|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic(?:Type)?|else|enum|extension|fallthrough|final|for|func|get|guard|if|import|in|infix|init|inout|internal|is|lazy|left|let|mutating|new|none|nonmutating|operator|optional|override|postfix|precedence|prefix|private|protocol|public|repeat|required|rethrows|return|right|safe|self|Self|set|static|struct|subscript|super|switch|throws?|try|Type|typealias|unowned|unsafe|var|weak|where|while|willSet|__(?:COLUMN__|FILE__|FUNCTION__|LINE__))\b/,
    	'number': /\b(?:[\d_]+(?:\.[\de_]+)?|0x[a-f0-9_]+(?:\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
    	'constant': /\b(?:nil|[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
    	'atrule': /@\b(?:IB(?:Outlet|Designable|Action|Inspectable)|class_protocol|exported|noreturn|NS(?:Copying|Managed)|objc|UIApplicationMain|auto_closure)\b/,
    	'builtin': /\b(?:[A-Z]\S+|abs|advance|alignof(?:Value)?|assert|contains|count(?:Elements)?|debugPrint(?:ln)?|distance|drop(?:First|Last)|dump|enumerate|equal|filter|find|first|getVaList|indices|isEmpty|join|last|lexicographicalCompare|map|max(?:Element)?|min(?:Element)?|numericCast|overlaps|partition|print(?:ln)?|reduce|reflect|reverse|sizeof(?:Value)?|sort(?:ed)?|split|startsWith|stride(?:of(?:Value)?)?|suffix|swap|toDebugString|toString|transcode|underestimateCount|unsafeBitCast|with(?:ExtendedLifetime|Unsafe(?:MutablePointers?|Pointers?)|VaList))\b/
    });
    Prism.languages.swift['string'].inside['interpolation'].inside.rest = Prism.languages.swift;

    /**
     * Original by Samuel Flores
     *
     * Adds the following new token classes:
     *     constant, builtin, variable, symbol, regex
     */
    (function (Prism) {
    	Prism.languages.ruby = Prism.languages.extend('clike', {
    		'comment': [
    			/#.*/,
    			{
    				pattern: /^=begin\s[\s\S]*?^=end/m,
    				greedy: true
    			}
    		],
    		'class-name': {
    			pattern: /(\b(?:class)\s+|\bcatch\s+\()[\w.\\]+/i,
    			lookbehind: true,
    			inside: {
    				'punctuation': /[.\\]/
    			}
    		},
    		'keyword': /\b(?:alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|extend|for|if|in|include|module|new|next|nil|not|or|prepend|protected|private|public|raise|redo|require|rescue|retry|return|self|super|then|throw|undef|unless|until|when|while|yield)\b/
    	});

    	var interpolation = {
    		pattern: /#\{[^}]+\}/,
    		inside: {
    			'delimiter': {
    				pattern: /^#\{|\}$/,
    				alias: 'tag'
    			},
    			rest: Prism.languages.ruby
    		}
    	};

    	delete Prism.languages.ruby.function;

    	Prism.languages.insertBefore('ruby', 'keyword', {
    		'regex': [
    			{
    				pattern: RegExp(/%r/.source + '(?:' + [
    					/([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1[gim]{0,3}/.source,
    					/\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/.source,
    					// Here we need to specifically allow interpolation
    					/\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/.source,
    					/\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/.source,
    					/<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/.source
    				].join('|') + ')'),
    				greedy: true,
    				inside: {
    					'interpolation': interpolation
    				}
    			},
    			{
    				pattern: /(^|[^/])\/(?!\/)(?:\[[^\r\n\]]+\]|\\.|[^[/\\\r\n])+\/[gim]{0,3}(?=\s*(?:$|[\r\n,.;})]))/,
    				lookbehind: true,
    				greedy: true
    			}
    		],
    		'variable': /[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,
    		'symbol': {
    			pattern: /(^|[^:]):[a-zA-Z_]\w*(?:[?!]|\b)/,
    			lookbehind: true
    		},
    		'method-definition': {
    			pattern: /(\bdef\s+)[\w.]+/,
    			lookbehind: true,
    			inside: {
    				'function': /\w+$/,
    				rest: Prism.languages.ruby
    			}
    		}
    	});

    	Prism.languages.insertBefore('ruby', 'number', {
    		'builtin': /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|Fixnum|Float|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
    		'constant': /\b[A-Z]\w*(?:[?!]|\b)/
    	});

    	Prism.languages.ruby.string = [
    		{
    			pattern: RegExp(/%[qQiIwWxs]?/.source + '(?:' + [
    				/([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source,
    				/\((?:[^()\\]|\\[\s\S])*\)/.source,
    				// Here we need to specifically allow interpolation
    				/\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/.source,
    				/\[(?:[^\[\]\\]|\\[\s\S])*\]/.source,
    				/<(?:[^<>\\]|\\[\s\S])*>/.source
    			].join('|') + ')'),
    			greedy: true,
    			inside: {
    				'interpolation': interpolation
    			}
    		},
    		{
    			pattern: /("|')(?:#\{[^}]+\}|\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    			greedy: true,
    			inside: {
    				'interpolation': interpolation
    			}
    		}
    	];

    	Prism.languages.rb = Prism.languages.ruby;
    }(Prism));

    Prism.languages.dart = Prism.languages.extend('clike', {
    	'string': [
    		{
    			pattern: /r?("""|''')[\s\S]*?\1/,
    			greedy: true
    		},
    		{
    			pattern: /r?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
    			greedy: true
    		}
    	],
    	'keyword': [
    		/\b(?:async|sync|yield)\*/,
    		/\b(?:abstract|assert|async|await|break|case|catch|class|const|continue|covariant|default|deferred|do|dynamic|else|enum|export|extension|external|extends|factory|final|finally|for|Function|get|hide|if|implements|interface|import|in|library|mixin|new|null|on|operator|part|rethrow|return|set|show|static|super|switch|sync|this|throw|try|typedef|var|void|while|with|yield)\b/
    	],
    	'operator': /\bis!|\b(?:as|is)\b|\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/
    });

    Prism.languages.insertBefore('dart','function',{
    	'metadata': {
    		pattern: /@\w+/,
    		alias: 'symbol'
    	}
    });

    (function (Prism) {

    	Prism.languages.typescript = Prism.languages.extend('javascript', {
    		'class-name': {
    			pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
    			lookbehind: true,
    			greedy: true,
    			inside: null // see below
    		},
    		// From JavaScript Prism keyword list and TypeScript language spec: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#221-reserved-words
    		'keyword': /\b(?:abstract|as|asserts|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|undefined|var|void|while|with|yield)\b/,
    		'builtin': /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
    	});

    	// doesn't work with TS because TS is too complex
    	delete Prism.languages.typescript['parameter'];

    	// a version of typescript specifically for highlighting types
    	var typeInside = Prism.languages.extend('typescript', {});
    	delete typeInside['class-name'];

    	Prism.languages.typescript['class-name'].inside = typeInside;

    	Prism.languages.insertBefore('typescript', 'function', {
    		'generic-function': {
    			// e.g. foo<T extends "bar" | "baz">( ...
    			pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
    			greedy: true,
    			inside: {
    				'function': /^#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*/,
    				'generic': {
    					pattern: /<[\s\S]+/, // everything after the first <
    					alias: 'class-name',
    					inside: typeInside
    				}
    			}
    		}
    	});

    	Prism.languages.ts = Prism.languages.typescript;

    }(Prism));

    (function (Prism) {

    	/**
    	 * Replaces all placeholders "<<n>>" of given pattern with the n-th replacement (zero based).
    	 *
    	 * Note: This is a simple text based replacement. Be careful when using backreferences!
    	 *
    	 * @param {string} pattern the given pattern.
    	 * @param {string[]} replacements a list of replacement which can be inserted into the given pattern.
    	 * @returns {string} the pattern with all placeholders replaced with their corresponding replacements.
    	 * @example replace(/a<<0>>a/.source, [/b+/.source]) === /a(?:b+)a/.source
    	 */
    	function replace(pattern, replacements) {
    		return pattern.replace(/<<(\d+)>>/g, function (m, index) {
    			return '(?:' + replacements[+index] + ')';
    		});
    	}
    	/**
    	 * @param {string} pattern
    	 * @param {string[]} replacements
    	 * @param {string} [flags]
    	 * @returns {RegExp}
    	 */
    	function re(pattern, replacements, flags) {
    		return RegExp(replace(pattern, replacements), flags || '');
    	}

    	/**
    	 * Creates a nested pattern where all occurrences of the string `<<self>>` are replaced with the pattern itself.
    	 *
    	 * @param {string} pattern
    	 * @param {number} depthLog2
    	 * @returns {string}
    	 */
    	function nested(pattern, depthLog2) {
    		for (var i = 0; i < depthLog2; i++) {
    			pattern = pattern.replace(/<<self>>/g, function () { return '(?:' + pattern + ')'; });
    		}
    		return pattern.replace(/<<self>>/g, '[^\\s\\S]');
    	}

    	// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/
    	var keywordKinds = {
    		// keywords which represent a return or variable type
    		type: 'bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void',
    		// keywords which are used to declare a type
    		typeDeclaration: 'class enum interface struct',
    		// contextual keywords
    		// ("var" and "dynamic" are missing because they are used like types)
    		contextual: 'add alias and ascending async await by descending from get global group into join let nameof not notnull on or orderby partial remove select set unmanaged value when where where',
    		// all other keywords
    		other: 'abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield'
    	};

    	// keywords
    	function keywordsToPattern(words) {
    		return '\\b(?:' + words.trim().replace(/ /g, '|') + ')\\b';
    	}
    	var typeDeclarationKeywords = keywordsToPattern(keywordKinds.typeDeclaration);
    	var keywords = RegExp(keywordsToPattern(keywordKinds.type + ' ' + keywordKinds.typeDeclaration + ' ' + keywordKinds.contextual + ' ' + keywordKinds.other));
    	var nonTypeKeywords = keywordsToPattern(keywordKinds.typeDeclaration + ' ' + keywordKinds.contextual + ' ' + keywordKinds.other);
    	var nonContextualKeywords = keywordsToPattern(keywordKinds.type + ' ' + keywordKinds.typeDeclaration + ' ' + keywordKinds.other);

    	// types
    	var generic = nested(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source, 2); // the idea behind the other forbidden characters is to prevent false positives. Same for tupleElement.
    	var nestedRound = nested(/\((?:[^()]|<<self>>)*\)/.source, 2);
    	var name = /@?\b[A-Za-z_]\w*\b/.source;
    	var genericName = replace(/<<0>>(?:\s*<<1>>)?/.source, [name, generic]);
    	var identifier = replace(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source, [nonTypeKeywords, genericName]);
    	var array = /\[\s*(?:,\s*)*\]/.source;
    	var typeExpressionWithoutTuple = replace(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source, [identifier, array]);
    	var tupleElement = replace(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source, [generic, nestedRound, array]);
    	var tuple = replace(/\(<<0>>+(?:,<<0>>+)+\)/.source, [tupleElement]);
    	var typeExpression = replace(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source, [tuple, identifier, array]);

    	var typeInside = {
    		'keyword': keywords,
    		'punctuation': /[<>()?,.:[\]]/
    	};

    	// strings & characters
    	// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#character-literals
    	// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#string-literals
    	var character = /'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source; // simplified pattern
    	var regularString = /"(?:\\.|[^\\"\r\n])*"/.source;
    	var verbatimString = /@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;


    	Prism.languages.csharp = Prism.languages.extend('clike', {
    		'string': [
    			{
    				pattern: re(/(^|[^$\\])<<0>>/.source, [verbatimString]),
    				lookbehind: true,
    				greedy: true
    			},
    			{
    				pattern: re(/(^|[^@$\\])<<0>>/.source, [regularString]),
    				lookbehind: true,
    				greedy: true
    			},
    			{
    				pattern: RegExp(character),
    				greedy: true,
    				alias: 'character'
    			}
    		],
    		'class-name': [
    			{
    				// Using static
    				// using static System.Math;
    				pattern: re(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source, [identifier]),
    				lookbehind: true,
    				inside: typeInside
    			},
    			{
    				// Using alias (type)
    				// using Project = PC.MyCompany.Project;
    				pattern: re(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source, [name, typeExpression]),
    				lookbehind: true,
    				inside: typeInside
    			},
    			{
    				// Using alias (alias)
    				// using Project = PC.MyCompany.Project;
    				pattern: re(/(\busing\s+)<<0>>(?=\s*=)/.source, [name]),
    				lookbehind: true
    			},
    			{
    				// Type declarations
    				// class Foo<A, B>
    				// interface Foo<out A, B>
    				pattern: re(/(\b<<0>>\s+)<<1>>/.source, [typeDeclarationKeywords, genericName]),
    				lookbehind: true,
    				inside: typeInside
    			},
    			{
    				// Single catch exception declaration
    				// catch(Foo)
    				// (things like catch(Foo e) is covered by variable declaration)
    				pattern: re(/(\bcatch\s*\(\s*)<<0>>/.source, [identifier]),
    				lookbehind: true,
    				inside: typeInside
    			},
    			{
    				// Name of the type parameter of generic constraints
    				// where Foo : class
    				pattern: re(/(\bwhere\s+)<<0>>/.source, [name]),
    				lookbehind: true
    			},
    			{
    				// Casts and checks via as and is.
    				// as Foo<A>, is Bar<B>
    				// (things like if(a is Foo b) is covered by variable declaration)
    				pattern: re(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source, [typeExpressionWithoutTuple]),
    				lookbehind: true,
    				inside: typeInside
    			},
    			{
    				// Variable, field and parameter declaration
    				// (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
    				pattern: re(/\b<<0>>(?=\s+(?!<<1>>)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source, [typeExpression, nonContextualKeywords, name]),
    				inside: typeInside
    			}
    		],
    		'keyword': keywords,
    		// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#literals
    		'number': /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:ul|lu|[dflmu])?\b/i,
    		'operator': />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
    		'punctuation': /\?\.?|::|[{}[\];(),.:]/
    	});

    	Prism.languages.insertBefore('csharp', 'number', {
    		'range': {
    			pattern: /\.\./,
    			alias: 'operator'
    		}
    	});

    	Prism.languages.insertBefore('csharp', 'punctuation', {
    		'named-parameter': {
    			pattern: re(/([(,]\s*)<<0>>(?=\s*:)/.source, [name]),
    			lookbehind: true,
    			alias: 'punctuation'
    		}
    	});

    	Prism.languages.insertBefore('csharp', 'class-name', {
    		'namespace': {
    			// namespace Foo.Bar {}
    			// using Foo.Bar;
    			pattern: re(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source, [name]),
    			lookbehind: true,
    			inside: {
    				'punctuation': /\./
    			}
    		},
    		'type-expression': {
    			// default(Foo), typeof(Foo<Bar>), sizeof(int)
    			pattern: re(/(\b(?:default|typeof|sizeof)\s*\(\s*)(?:[^()\s]|\s(?!\s*\))|<<0>>)*(?=\s*\))/.source, [nestedRound]),
    			lookbehind: true,
    			alias: 'class-name',
    			inside: typeInside
    		},
    		'return-type': {
    			// Foo<Bar> ForBar(); Foo IFoo.Bar() => 0
    			// int this[int index] => 0; T IReadOnlyList<T>.this[int index] => this[index];
    			// int Foo => 0; int Foo { get; set } = 0;
    			pattern: re(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source, [typeExpression, identifier]),
    			inside: typeInside,
    			alias: 'class-name'
    		},
    		'constructor-invocation': {
    			// new List<Foo<Bar[]>> { }
    			pattern: re(/(\bnew\s+)<<0>>(?=\s*[[({])/.source, [typeExpression]),
    			lookbehind: true,
    			inside: typeInside,
    			alias: 'class-name'
    		},
    		/*'explicit-implementation': {
    			// int IFoo<Foo>.Bar => 0; void IFoo<Foo<Foo>>.Foo<T>();
    			pattern: replace(/\b<<0>>(?=\.<<1>>)/, className, methodOrPropertyDeclaration),
    			inside: classNameInside,
    			alias: 'class-name'
    		},*/
    		'generic-method': {
    			// foo<Bar>()
    			pattern: re(/<<0>>\s*<<1>>(?=\s*\()/.source, [name, generic]),
    			inside: {
    				'function': re(/^<<0>>/.source, [name]),
    				'generic': {
    					pattern: RegExp(generic),
    					alias: 'class-name',
    					inside: typeInside
    				}
    			}
    		},
    		'type-list': {
    			// The list of types inherited or of generic constraints
    			// class Foo<F> : Bar, IList<FooBar>
    			// where F : Bar, IList<int>
    			pattern: re(
    				/\b((?:<<0>>\s+<<1>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>)(?:\s*,\s*(?:<<3>>|<<4>>))*(?=\s*(?:where|[{;]|=>|$))/.source,
    				[typeDeclarationKeywords, genericName, name, typeExpression, keywords.source]
    			),
    			lookbehind: true,
    			inside: {
    				'keyword': keywords,
    				'class-name': {
    					pattern: RegExp(typeExpression),
    					greedy: true,
    					inside: typeInside
    				},
    				'punctuation': /,/
    			}
    		},
    		'preprocessor': {
    			pattern: /(^\s*)#.*/m,
    			lookbehind: true,
    			alias: 'property',
    			inside: {
    				// highlight preprocessor directives as keywords
    				'directive': {
    					pattern: /(\s*#)\b(?:define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
    					lookbehind: true,
    					alias: 'keyword'
    				}
    			}
    		}
    	});

    	// attributes
    	var regularStringOrCharacter = regularString + '|' + character;
    	var regularStringCharacterOrComment = replace(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source, [regularStringOrCharacter]);
    	var roundExpression = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2);

    	// https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/attributes/#attribute-targets
    	var attrTarget = /\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source;
    	var attr = replace(/<<0>>(?:\s*\(<<1>>*\))?/.source, [identifier, roundExpression]);

    	Prism.languages.insertBefore('csharp', 'class-name', {
    		'attribute': {
    			// Attributes
    			// [Foo], [Foo(1), Bar(2, Prop = "foo")], [return: Foo(1), Bar(2)], [assembly: Foo(Bar)]
    			pattern: re(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source, [attrTarget, attr]),
    			lookbehind: true,
    			greedy: true,
    			inside: {
    				'target': {
    					pattern: re(/^<<0>>(?=\s*:)/.source, [attrTarget]),
    					alias: 'keyword'
    				},
    				'attribute-arguments': {
    					pattern: re(/\(<<0>>*\)/.source, [roundExpression]),
    					inside: Prism.languages.csharp
    				},
    				'class-name': {
    					pattern: RegExp(identifier),
    					inside: {
    						'punctuation': /\./
    					}
    				},
    				'punctuation': /[:,]/
    			}
    		}
    	});


    	// string interpolation
    	var formatString = /:[^}\r\n]+/.source;
    	// multi line
    	var mInterpolationRound = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2);
    	var mInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [mInterpolationRound, formatString]);
    	// single line
    	var sInterpolationRound = nested(replace(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source, [regularStringOrCharacter]), 2);
    	var sInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [sInterpolationRound, formatString]);

    	function createInterpolationInside(interpolation, interpolationRound) {
    		return {
    			'interpolation': {
    				pattern: re(/((?:^|[^{])(?:\{\{)*)<<0>>/.source, [interpolation]),
    				lookbehind: true,
    				inside: {
    					'format-string': {
    						pattern: re(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source, [interpolationRound, formatString]),
    						lookbehind: true,
    						inside: {
    							'punctuation': /^:/
    						}
    					},
    					'punctuation': /^\{|\}$/,
    					'expression': {
    						pattern: /[\s\S]+/,
    						alias: 'language-csharp',
    						inside: Prism.languages.csharp
    					}
    				}
    			},
    			'string': /[\s\S]+/
    		};
    	}

    	Prism.languages.insertBefore('csharp', 'string', {
    		'interpolation-string': [
    			{
    				pattern: re(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source, [mInterpolation]),
    				lookbehind: true,
    				greedy: true,
    				inside: createInterpolationInside(mInterpolation, mInterpolationRound),
    			},
    			{
    				pattern: re(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source, [sInterpolation]),
    				lookbehind: true,
    				greedy: true,
    				inside: createInterpolationInside(sInterpolation, sInterpolationRound),
    			}
    		]
    	});

    }(Prism));

    Prism.languages.dotnet = Prism.languages.cs = Prism.languages.csharp;

    (function (Prism) {

    	var multilineComment = /\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|<self>)*\*\//.source;
    	for (var i = 0; i < 2; i++) {
    		// support 4 levels of nested comments
    		multilineComment = multilineComment.replace(/<self>/g, function () { return multilineComment; });
    	}
    	multilineComment = multilineComment.replace(/<self>/g, function () { return /[^\s\S]/.source; });


    	Prism.languages.rust = {
    		'comment': [
    			{
    				pattern: RegExp(/(^|[^\\])/.source + multilineComment),
    				lookbehind: true,
    				greedy: true
    			},
    			{
    				pattern: /(^|[^\\:])\/\/.*/,
    				lookbehind: true,
    				greedy: true
    			}
    		],
    		'string': {
    			pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/,
    			greedy: true
    		},
    		'char': {
    			pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
    			greedy: true,
    			alias: 'string'
    		},
    		'attribute': {
    			pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
    			greedy: true,
    			alias: 'attr-name',
    			inside: {
    				'string': null // see below
    			}
    		},

    		// Closure params should not be confused with bitwise OR |
    		'closure-params': {
    			pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
    			lookbehind: true,
    			greedy: true,
    			inside: {
    				'closure-punctuation': {
    					pattern: /^\||\|$/,
    					alias: 'punctuation'
    				},
    				rest: null // see below
    			}
    		},

    		'lifetime-annotation': {
    			pattern: /'\w+/,
    			alias: 'symbol'
    		},

    		'fragment-specifier': {
    			pattern: /(\$\w+:)[a-z]+/,
    			lookbehind: true,
    			alias: 'punctuation'
    		},
    		'variable': /\$\w+/,

    		'function-definition': {
    			pattern: /(\bfn\s+)\w+/,
    			lookbehind: true,
    			alias: 'function'
    		},
    		'type-definition': {
    			pattern: /(\b(?:enum|struct|union)\s+)\w+/,
    			lookbehind: true,
    			alias: 'class-name'
    		},
    		'module-declaration': [
    			{
    				pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/,
    				lookbehind: true,
    				alias: 'namespace'
    			},
    			{
    				pattern: /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
    				lookbehind: true,
    				alias: 'namespace',
    				inside: {
    					'punctuation': /::/
    				}
    			}
    		],
    		'keyword': [
    			// https://github.com/rust-lang/reference/blob/master/src/keywords.md
    			/\b(?:abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|Self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,
    			// primitives and str
    			// https://doc.rust-lang.org/stable/rust-by-example/primitives.html
    			/\b(?:[ui](?:8|16|32|64|128|size)|f(?:32|64)|bool|char|str)\b/
    		],

    		// functions can technically start with an upper-case letter, but this will introduce a lot of false positives
    		// and Rust's naming conventions recommend snake_case anyway.
    		// https://doc.rust-lang.org/1.0.0/style/style/naming/README.html
    		'function': /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
    		'macro': {
    			pattern: /\w+!/,
    			alias: 'property'
    		},
    		'constant': /\b[A-Z_][A-Z_\d]+\b/,
    		'class-name': /\b[A-Z]\w*\b/,

    		'namespace': {
    			pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
    			inside: {
    				'punctuation': /::/
    			}
    		},

    		// Hex, oct, bin, dec numbers with visual separators and type suffix
    		'number': /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:\d(?:_?\d)*)?\.?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:[iu](?:8|16|32|64|size)?|f32|f64))?\b/,
    		'boolean': /\b(?:false|true)\b/,
    		'punctuation': /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
    		'operator': /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
    	};

    	Prism.languages.rust['closure-params'].inside.rest = Prism.languages.rust;
    	Prism.languages.rust['attribute'].inside['string'] = Prism.languages.rust['string'];

    }(Prism));

    Prism.languages.sql = {
    	'comment': {
    		pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
    		lookbehind: true
    	},
    	'variable': [
    		{
    			pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
    			greedy: true
    		},
    		/@[\w.$]+/
    	],
    	'string': {
    		pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
    		greedy: true,
    		lookbehind: true
    	},
    	'function': /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i, // Should we highlight user defined functions too?
    	'keyword': /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:S|ING)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
    	'boolean': /\b(?:TRUE|FALSE|NULL)\b/i,
    	'number': /\b0x[\da-f]+\b|\b\d+\.?\d*|\B\.\d+\b/i,
    	'operator': /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
    	'punctuation': /[;[\]()`,.]/
    };

    (function (Prism) {
    	Prism.languages.kotlin = Prism.languages.extend('clike', {
    		'keyword': {
    			// The lookbehind prevents wrong highlighting of e.g. kotlin.properties.get
    			pattern: /(^|[^.])\b(?:abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|final|finally|for|fun|get|if|import|in|infix|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|to|try|typealias|val|var|vararg|when|where|while)\b/,
    			lookbehind: true
    		},
    		'function': [
    			/\w+(?=\s*\()/,
    			{
    				pattern: /(\.)\w+(?=\s*\{)/,
    				lookbehind: true
    			}
    		],
    		'number': /\b(?:0[xX][\da-fA-F]+(?:_[\da-fA-F]+)*|0[bB][01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?[fFL]?)\b/,
    		'operator': /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/
    	});

    	delete Prism.languages.kotlin["class-name"];

    	Prism.languages.insertBefore('kotlin', 'string', {
    		'raw-string': {
    			pattern: /("""|''')[\s\S]*?\1/,
    			alias: 'string'
    			// See interpolation below
    		}
    	});
    	Prism.languages.insertBefore('kotlin', 'keyword', {
    		'annotation': {
    			pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
    			alias: 'builtin'
    		}
    	});
    	Prism.languages.insertBefore('kotlin', 'function', {
    		'label': {
    			pattern: /\w+@|@\w+/,
    			alias: 'symbol'
    		}
    	});

    	var interpolation = [
    		{
    			pattern: /\$\{[^}]+\}/,
    			inside: {
    				'delimiter': {
    					pattern: /^\$\{|\}$/,
    					alias: 'variable'
    				},
    				rest: Prism.languages.kotlin
    			}
    		},
    		{
    			pattern: /\$\w+/,
    			alias: 'variable'
    		}
    	];

    	Prism.languages.kotlin['string'].inside = Prism.languages.kotlin['raw-string'].inside = {
    		interpolation: interpolation
    	};

    	Prism.languages.kt = Prism.languages.kotlin;
    	Prism.languages.kts = Prism.languages.kotlin;
    }(Prism));

    (function (Prism) {

    	var keywords = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|null|open|opens|package|private|protected|provides|public|record|requires|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/;

    	// based on the java naming conventions
    	var className = /\b[A-Z](?:\w*[a-z]\w*)?\b/;

    	Prism.languages.java = Prism.languages.extend('clike', {
    		'class-name': [
    			className,

    			// variables and parameters
    			// this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
    			/\b[A-Z]\w*(?=\s+\w+\s*[;,=())])/
    		],
    		'keyword': keywords,
    		'function': [
    			Prism.languages.clike.function,
    			{
    				pattern: /(\:\:)[a-z_]\w*/,
    				lookbehind: true
    			}
    		],
    		'number': /\b0b[01][01_]*L?\b|\b0x[\da-f_]*\.?[\da-f_p+-]+\b|(?:\b\d[\d_]*\.?[\d_]*|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    		'operator': {
    			pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
    			lookbehind: true
    		}
    	});

    	Prism.languages.insertBefore('java', 'string', {
    		'triple-quoted-string': {
    			// http://openjdk.java.net/jeps/355#Description
    			pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
    			greedy: true,
    			alias: 'string'
    		}
    	});

    	Prism.languages.insertBefore('java', 'class-name', {
    		'annotation': {
    			alias: 'punctuation',
    			pattern: /(^|[^.])@\w+/,
    			lookbehind: true
    		},
    		'namespace': {
    			pattern: RegExp(
    				/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/
    					.source.replace(/<keyword>/g, function () { return keywords.source; })),
    			lookbehind: true,
    			inside: {
    				'punctuation': /\./,
    			}
    		},
    		'generics': {
    			pattern: /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
    			inside: {
    				'class-name': className,
    				'keyword': keywords,
    				'punctuation': /[<>(),.:]/,
    				'operator': /[?&|]/
    			}
    		}
    	});
    }(Prism));

    Prism.languages.go = Prism.languages.extend('clike', {
    	'keyword': /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
    	'builtin': /\b(?:bool|byte|complex(?:64|128)|error|float(?:32|64)|rune|string|u?int(?:8|16|32|64)?|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(?:ln)?|real|recover)\b/,
    	'boolean': /\b(?:_|iota|nil|true|false)\b/,
    	'operator': /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
    	'number': /(?:\b0x[a-f\d]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[-+]?\d+)?)i?/i,
    	'string': {
    		pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/,
    		greedy: true
    	}
    });
    delete Prism.languages.go['class-name'];

    Prism.languages.python = {
    	'comment': {
    		pattern: /(^|[^\\])#.*/,
    		lookbehind: true
    	},
    	'string-interpolation': {
    		pattern: /(?:f|rf|fr)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
    		greedy: true,
    		inside: {
    			'interpolation': {
    				// "{" <expression> <optional "!s", "!r", or "!a"> <optional ":" format specifier> "}"
    				pattern: /((?:^|[^{])(?:{{)*){(?!{)(?:[^{}]|{(?!{)(?:[^{}]|{(?!{)(?:[^{}])+})+})+}/,
    				lookbehind: true,
    				inside: {
    					'format-spec': {
    						pattern: /(:)[^:(){}]+(?=}$)/,
    						lookbehind: true
    					},
    					'conversion-option': {
    						pattern: /![sra](?=[:}]$)/,
    						alias: 'punctuation'
    					},
    					rest: null
    				}
    			},
    			'string': /[\s\S]+/
    		}
    	},
    	'triple-quoted-string': {
    		pattern: /(?:[rub]|rb|br)?("""|''')[\s\S]*?\1/i,
    		greedy: true,
    		alias: 'string'
    	},
    	'string': {
    		pattern: /(?:[rub]|rb|br)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
    		greedy: true
    	},
    	'function': {
    		pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
    		lookbehind: true
    	},
    	'class-name': {
    		pattern: /(\bclass\s+)\w+/i,
    		lookbehind: true
    	},
    	'decorator': {
    		pattern: /(^\s*)@\w+(?:\.\w+)*/im,
    		lookbehind: true,
    		alias: ['annotation', 'punctuation'],
    		inside: {
    			'punctuation': /\./
    		}
    	},
    	'keyword': /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    	'builtin': /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    	'boolean': /\b(?:True|False|None)\b/,
    	'number': /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
    	'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    	'punctuation': /[{}[\];(),.:]/
    };

    Prism.languages.python['string-interpolation'].inside['interpolation'].inside.rest = Prism.languages.python;

    Prism.languages.py = Prism.languages.python;

    /* src\fa.svelte generated by Svelte v3.16.5 */

    function create_if_block(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let svg_viewBox_value;

    	function select_block_type(ctx, dirty) {
    		if (typeof /*i*/ ctx[8][4] == "string") return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			if_block.c();
    			attr(g0, "transform", /*transform*/ ctx[10]);
    			attr(g1, "transform", "translate(256 256)");
    			attr(svg, "id", /*id*/ ctx[1]);
    			attr(svg, "class", /*clazz*/ ctx[0]);
    			attr(svg, "style", /*s*/ ctx[9]);
    			attr(svg, "viewBox", svg_viewBox_value = `0 0 ${/*i*/ ctx[8][0]} ${/*i*/ ctx[8][1]}`);
    			attr(svg, "aria-hidden", "true");
    			attr(svg, "role", "img");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, g1);
    			append(g1, g0);
    			if_block.m(g0, null);
    		},
    		p(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(g0, null);
    				}
    			}

    			if (dirty & /*transform*/ 1024) {
    				attr(g0, "transform", /*transform*/ ctx[10]);
    			}

    			if (dirty & /*id*/ 2) {
    				attr(svg, "id", /*id*/ ctx[1]);
    			}

    			if (dirty & /*clazz*/ 1) {
    				attr(svg, "class", /*clazz*/ ctx[0]);
    			}

    			if (dirty & /*s*/ 512) {
    				attr(svg, "style", /*s*/ ctx[9]);
    			}

    			if (dirty & /*i*/ 256 && svg_viewBox_value !== (svg_viewBox_value = `0 0 ${/*i*/ ctx[8][0]} ${/*i*/ ctx[8][1]}`)) {
    				attr(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(svg);
    			if_block.d();
    		}
    	};
    }

    // (124:8) {:else}
    function create_else_block(ctx) {
    	let path0;
    	let path0_d_value;
    	let path0_fill_value;
    	let path0_fill_opacity_value;
    	let path1;
    	let path1_d_value;
    	let path1_fill_value;
    	let path1_fill_opacity_value;

    	return {
    		c() {
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr(path0, "d", path0_d_value = /*i*/ ctx[8][4][0]);
    			attr(path0, "fill", path0_fill_value = /*secondaryColor*/ ctx[4] || /*color*/ ctx[2] || "currentColor");

    			attr(path0, "fill-opacity", path0_fill_opacity_value = /*swapOpacity*/ ctx[7] != false
    			? /*primaryOpacity*/ ctx[5]
    			: /*secondaryOpacity*/ ctx[6]);

    			attr(path0, "transform", "translate(-256 -256)");
    			attr(path1, "d", path1_d_value = /*i*/ ctx[8][4][1]);
    			attr(path1, "fill", path1_fill_value = /*primaryColor*/ ctx[3] || /*color*/ ctx[2] || "currentColor");

    			attr(path1, "fill-opacity", path1_fill_opacity_value = /*swapOpacity*/ ctx[7] != false
    			? /*secondaryOpacity*/ ctx[6]
    			: /*primaryOpacity*/ ctx[5]);

    			attr(path1, "transform", "translate(-256 -256)");
    		},
    		m(target, anchor) {
    			insert(target, path0, anchor);
    			insert(target, path1, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*i*/ 256 && path0_d_value !== (path0_d_value = /*i*/ ctx[8][4][0])) {
    				attr(path0, "d", path0_d_value);
    			}

    			if (dirty & /*secondaryColor, color*/ 20 && path0_fill_value !== (path0_fill_value = /*secondaryColor*/ ctx[4] || /*color*/ ctx[2] || "currentColor")) {
    				attr(path0, "fill", path0_fill_value);
    			}

    			if (dirty & /*swapOpacity, primaryOpacity, secondaryOpacity*/ 224 && path0_fill_opacity_value !== (path0_fill_opacity_value = /*swapOpacity*/ ctx[7] != false
    			? /*primaryOpacity*/ ctx[5]
    			: /*secondaryOpacity*/ ctx[6])) {
    				attr(path0, "fill-opacity", path0_fill_opacity_value);
    			}

    			if (dirty & /*i*/ 256 && path1_d_value !== (path1_d_value = /*i*/ ctx[8][4][1])) {
    				attr(path1, "d", path1_d_value);
    			}

    			if (dirty & /*primaryColor, color*/ 12 && path1_fill_value !== (path1_fill_value = /*primaryColor*/ ctx[3] || /*color*/ ctx[2] || "currentColor")) {
    				attr(path1, "fill", path1_fill_value);
    			}

    			if (dirty & /*swapOpacity, secondaryOpacity, primaryOpacity*/ 224 && path1_fill_opacity_value !== (path1_fill_opacity_value = /*swapOpacity*/ ctx[7] != false
    			? /*secondaryOpacity*/ ctx[6]
    			: /*primaryOpacity*/ ctx[5])) {
    				attr(path1, "fill-opacity", path1_fill_opacity_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(path0);
    			if (detaching) detach(path1);
    		}
    	};
    }

    // (118:8) {#if typeof i[4] == 'string'}
    function create_if_block_1(ctx) {
    	let path;
    	let path_d_value;
    	let path_fill_value;

    	return {
    		c() {
    			path = svg_element("path");
    			attr(path, "d", path_d_value = /*i*/ ctx[8][4]);
    			attr(path, "fill", path_fill_value = /*color*/ ctx[2] || /*primaryColor*/ ctx[3] || "currentColor");
    			attr(path, "transform", "translate(-256 -256)");
    		},
    		m(target, anchor) {
    			insert(target, path, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*i*/ 256 && path_d_value !== (path_d_value = /*i*/ ctx[8][4])) {
    				attr(path, "d", path_d_value);
    			}

    			if (dirty & /*color, primaryColor*/ 12 && path_fill_value !== (path_fill_value = /*color*/ ctx[2] || /*primaryColor*/ ctx[3] || "currentColor")) {
    				attr(path, "fill", path_fill_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(path);
    		}
    	};
    }

    function create_fragment(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[8][4] && create_if_block(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, [dirty]) {
    			if (/*i*/ ctx[8][4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { class: clazz = "" } = $$props;
    	let { id = "" } = $$props;
    	let { style = "" } = $$props;
    	let { icon } = $$props;
    	let { fw = false } = $$props;
    	let { flip = false } = $$props;
    	let { pull = false } = $$props;
    	let { rotate = false } = $$props;
    	let { size = false } = $$props;
    	let { color = "" } = $$props;
    	let { primaryColor = "" } = $$props;
    	let { secondaryColor = "" } = $$props;
    	let { primaryOpacity = 1 } = $$props;
    	let { secondaryOpacity = 0.4 } = $$props;
    	let { swapOpacity = false } = $$props;
    	let i;
    	let s;
    	let transform;

    	$$self.$set = $$props => {
    		if ("class" in $$props) $$invalidate(0, clazz = $$props.class);
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("style" in $$props) $$invalidate(11, style = $$props.style);
    		if ("icon" in $$props) $$invalidate(12, icon = $$props.icon);
    		if ("fw" in $$props) $$invalidate(13, fw = $$props.fw);
    		if ("flip" in $$props) $$invalidate(14, flip = $$props.flip);
    		if ("pull" in $$props) $$invalidate(15, pull = $$props.pull);
    		if ("rotate" in $$props) $$invalidate(16, rotate = $$props.rotate);
    		if ("size" in $$props) $$invalidate(17, size = $$props.size);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    		if ("primaryColor" in $$props) $$invalidate(3, primaryColor = $$props.primaryColor);
    		if ("secondaryColor" in $$props) $$invalidate(4, secondaryColor = $$props.secondaryColor);
    		if ("primaryOpacity" in $$props) $$invalidate(5, primaryOpacity = $$props.primaryOpacity);
    		if ("secondaryOpacity" in $$props) $$invalidate(6, secondaryOpacity = $$props.secondaryOpacity);
    		if ("swapOpacity" in $$props) $$invalidate(7, swapOpacity = $$props.swapOpacity);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*icon*/ 4096) {
    			 $$invalidate(8, i = icon && icon.icon || [0, 0, "", [], ""]);
    		}

    		if ($$self.$$.dirty & /*fw, pull, size, style*/ 174080) {
    			 {
    				let float;
    				let width;
    				const height = "1em";
    				let lineHeight;
    				let fontSize;
    				let textAlign;
    				let verticalAlign = "-.125em";
    				const overflow = "visible";

    				if (fw) {
    					textAlign = "center";
    					width = "1.25em";
    				}

    				if (pull) {
    					float = pull;
    				}

    				if (size) {
    					if (size == "lg") {
    						fontSize = "1.33333em";
    						lineHeight = ".75em";
    						verticalAlign = "-.225em";
    					} else if (size == "xs") {
    						fontSize = ".75em";
    					} else if (size == "sm") {
    						fontSize = ".875em";
    					} else {
    						fontSize = size.replace("x", "em");
    					}
    				}

    				const styleObj = {
    					float,
    					width,
    					height,
    					"line-height": lineHeight,
    					"font-size": fontSize,
    					"text-align": textAlign,
    					"vertical-align": verticalAlign,
    					overflow
    				};

    				let styleStr = "";

    				for (const prop in styleObj) {
    					if (styleObj[prop]) {
    						styleStr += `${prop}:${styleObj[prop]};`;
    					}
    				}

    				$$invalidate(9, s = styleStr + style);
    			}
    		}

    		if ($$self.$$.dirty & /*flip, rotate*/ 81920) {
    			 {
    				let t = "";

    				if (flip) {
    					let flipX = 1;
    					let flipY = 1;

    					if (flip == "horizontal") {
    						flipX = -1;
    					} else if (flip == "vertical") {
    						flipY = -1;
    					} else {
    						flipX = flipY = -1;
    					}

    					t += ` scale(${flipX} ${flipY})`;
    				}

    				if (rotate) {
    					t += ` rotate(${rotate} 0 0)`;
    				}

    				$$invalidate(10, transform = t);
    			}
    		}
    	};

    	return [
    		clazz,
    		id,
    		color,
    		primaryColor,
    		secondaryColor,
    		primaryOpacity,
    		secondaryOpacity,
    		swapOpacity,
    		i,
    		s,
    		transform,
    		style,
    		icon,
    		fw,
    		flip,
    		pull,
    		rotate,
    		size
    	];
    }

    class Fa extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			class: 0,
    			id: 1,
    			style: 11,
    			icon: 12,
    			fw: 13,
    			flip: 14,
    			pull: 15,
    			rotate: 16,
    			size: 17,
    			color: 2,
    			primaryColor: 3,
    			secondaryColor: 4,
    			primaryOpacity: 5,
    			secondaryOpacity: 6,
    			swapOpacity: 7
    		});
    	}
    }

    /*!
     * Font Awesome Free 5.15.1 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     */
    var faArrowLeft = {
      prefix: 'fas',
      iconName: 'arrow-left',
      icon: [448, 512, [], "f060", "M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"]
    };
    var faArrowRight = {
      prefix: 'fas',
      iconName: 'arrow-right',
      icon: [448, 512, [], "f061", "M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"]
    };
    var faTimes = {
      prefix: 'fas',
      iconName: 'times',
      icon: [352, 512, [], "f00d", "M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"]
    };
    var faWindowMinimize = {
      prefix: 'fas',
      iconName: 'window-minimize',
      icon: [512, 512, [], "f2d1", "M464 352H48c-26.5 0-48 21.5-48 48v32c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-32c0-26.5-21.5-48-48-48z"]
    };

    /* src/App.svelte generated by Svelte v3.29.0 */

    const { document: document_1 } = globals;

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (214:0) {#if lesson}
    function create_if_block$1(ctx) {
    	let section1;
    	let section0;
    	let div0;
    	let button0;
    	let fa0;
    	let t0;
    	let button1;
    	let fa1;
    	let t1;
    	let div1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	fa0 = new Fa({ props: { icon: faTimes } });
    	fa1 = new Fa({ props: { icon: faWindowMinimize } });
    	let if_block0 = /*lesson*/ ctx[4].steps.length > 1 && create_if_block_8(ctx);
    	let if_block1 = !/*min*/ ctx[2] && create_if_block_1$1(ctx);

    	return {
    		c() {
    			section1 = element("section");
    			section0 = element("section");
    			div0 = element("div");
    			button0 = element("button");
    			create_component(fa0.$$.fragment);
    			t0 = space();
    			button1 = element("button");
    			create_component(fa1.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr(button0, "class", "sm");
    			attr(button1, "class", "sm");
    			attr(div0, "id", "right-btn-container");
    			attr(div1, "id", "circles");
    			attr(section0, "id", "header");
    			set_style(section1, "left", /*left*/ ctx[1] + "px");
    			set_style(section1, "top", /*top*/ ctx[0] + "px");
    			attr(section1, "id", "lesson");
    		},
    		m(target, anchor) {
    			insert(target, section1, anchor);
    			append(section1, section0);
    			append(section0, div0);
    			append(div0, button0);
    			mount_component(fa0, button0, null);
    			append(div0, t0);
    			append(div0, button1);
    			mount_component(fa1, button1, null);
    			append(section0, t1);
    			append(section0, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append(section1, t2);
    			if (if_block1) if_block1.m(section1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", stop_propagation(prevent_default(onClose))),
    					listen(button1, "click", stop_propagation(prevent_default(/*onMin*/ ctx[9]))),
    					listen(section1, "mousedown", /*startMove*/ ctx[10])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (/*lesson*/ ctx[4].steps.length > 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*min*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*min*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(section1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*left*/ 2) {
    				set_style(section1, "left", /*left*/ ctx[1] + "px");
    			}

    			if (!current || dirty & /*top*/ 1) {
    				set_style(section1, "top", /*top*/ ctx[0] + "px");
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(fa0.$$.fragment, local);
    			transition_in(fa1.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o(local) {
    			transition_out(fa0.$$.fragment, local);
    			transition_out(fa1.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section1);
    			destroy_component(fa0);
    			destroy_component(fa1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (230:8) {#if lesson.steps.length > 1}
    function create_if_block_8(ctx) {
    	let each_1_anchor;
    	let each_value = /*lesson*/ ctx[4].steps;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*stepIndex, lesson*/ 24) {
    				each_value = /*lesson*/ ctx[4].steps;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (231:10) {#each lesson.steps as step, index}
    function create_each_block(ctx) {
    	let span;
    	let span_data_step_value;

    	return {
    		c() {
    			span = element("span");
    			attr(span, "data-step", span_data_step_value = /*index*/ ctx[19]);
    			toggle_class(span, "active", /*stepIndex*/ ctx[3] == /*index*/ ctx[19]);
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*stepIndex*/ 8) {
    				toggle_class(span, "active", /*stepIndex*/ ctx[3] == /*index*/ ctx[19]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    // (237:4) {#if !min}
    function create_if_block_1$1(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let if_block5_anchor;
    	let current;
    	let if_block0 = /*currentStep*/ ctx[6].step && create_if_block_7(ctx);
    	let if_block1 = /*currentStep*/ ctx[6].contentType === "youtube" && create_if_block_6(ctx);
    	let if_block2 = /*currentStep*/ ctx[6].contentType == "code" && create_if_block_5(ctx);
    	let if_block3 = /*currentStep*/ ctx[6].contentType === "picture" && create_if_block_4(ctx);
    	let if_block4 = /*currentStep*/ ctx[6].description && create_if_block_3(ctx);
    	let if_block5 = /*lesson*/ ctx[4].steps.length > 1 && create_if_block_2(ctx);

    	return {
    		c() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			if_block5_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert(target, t3, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert(target, t4, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert(target, if_block5_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (/*currentStep*/ ctx[6].step) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*currentStep*/ ctx[6].contentType === "youtube") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*currentStep*/ ctx[6].contentType == "code") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_5(ctx);
    					if_block2.c();
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*currentStep*/ ctx[6].contentType === "picture") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_4(ctx);
    					if_block3.c();
    					if_block3.m(t3.parentNode, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*currentStep*/ ctx[6].description) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_3(ctx);
    					if_block4.c();
    					if_block4.m(t4.parentNode, t4);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*lesson*/ ctx[4].steps.length > 1) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);

    					if (dirty & /*lesson*/ 16) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_2(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(if_block5_anchor.parentNode, if_block5_anchor);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block5);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block5);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach(t2);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach(t3);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach(t4);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach(if_block5_anchor);
    		}
    	};
    }

    // (238:6) {#if currentStep.step}
    function create_if_block_7(ctx) {
    	let h3;
    	let t_value = /*currentStep*/ ctx[6].step + "";
    	let t;

    	return {
    		c() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr(h3, "id", "step");
    		},
    		m(target, anchor) {
    			insert(target, h3, anchor);
    			append(h3, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*currentStep*/ 64 && t_value !== (t_value = /*currentStep*/ ctx[6].step + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(h3);
    		}
    	};
    }

    // (241:6) {#if currentStep.contentType === 'youtube'}
    function create_if_block_6(ctx) {
    	let iframe;
    	let iframe_src_value;

    	return {
    		c() {
    			iframe = element("iframe");
    			attr(iframe, "width", "560");
    			attr(iframe, "height", "450");
    			if (iframe.src !== (iframe_src_value = "https://www.youtube.com/embed/" + /*currentStep*/ ctx[6].youtubeId)) attr(iframe, "src", iframe_src_value);
    			attr(iframe, "frameborder", "0");
    			attr(iframe, "allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
    			iframe.allowFullscreen = true;
    		},
    		m(target, anchor) {
    			insert(target, iframe, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*currentStep*/ 64 && iframe.src !== (iframe_src_value = "https://www.youtube.com/embed/" + /*currentStep*/ ctx[6].youtubeId)) {
    				attr(iframe, "src", iframe_src_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(iframe);
    		}
    	};
    }

    // (252:6) {#if currentStep.contentType == 'code'}
    function create_if_block_5(ctx) {
    	let pre;
    	let code;
    	let pre_class_value;
    	let highlight_action;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			pre = element("pre");
    			code = element("code");
    			attr(pre, "class", pre_class_value = "language-" + /*currentStep*/ ctx[6].language + " line-numbers");
    			toggle_class(pre, "copy", /*currentStep*/ ctx[6].canCopy);
    			toggle_class(pre, "not-copy", !/*currentStep*/ ctx[6].canCopy);
    		},
    		m(target, anchor) {
    			insert(target, pre, anchor);
    			append(pre, code);
    			/*pre_binding*/ ctx[14](pre);

    			if (!mounted) {
    				dispose = action_destroyer(highlight_action = /*highlight*/ ctx[13].call(null, pre));
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*currentStep*/ 64 && pre_class_value !== (pre_class_value = "language-" + /*currentStep*/ ctx[6].language + " line-numbers")) {
    				attr(pre, "class", pre_class_value);
    			}

    			if (dirty & /*currentStep, currentStep*/ 64) {
    				toggle_class(pre, "copy", /*currentStep*/ ctx[6].canCopy);
    			}

    			if (dirty & /*currentStep, currentStep*/ 64) {
    				toggle_class(pre, "not-copy", !/*currentStep*/ ctx[6].canCopy);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(pre);
    			/*pre_binding*/ ctx[14](null);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (263:6) {#if currentStep.contentType === 'picture'}
    function create_if_block_4(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*currentStep*/ ctx[6].url)) attr(img, "src", img_src_value);
    			attr(img, "alt", img_alt_value = "step " + (/*stepIndex*/ ctx[3] + 1));
    			attr(img, "id", "main-image");
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);

    			if (!mounted) {
    				dispose = listen(img, "dragstart", prevent_default(/*dragstart_handler*/ ctx[15]));
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*currentStep*/ 64 && img.src !== (img_src_value = /*currentStep*/ ctx[6].url)) {
    				attr(img, "src", img_src_value);
    			}

    			if (dirty & /*stepIndex*/ 8 && img_alt_value !== (img_alt_value = "step " + (/*stepIndex*/ ctx[3] + 1))) {
    				attr(img, "alt", img_alt_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(img);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (272:6) {#if currentStep.description}
    function create_if_block_3(ctx) {
    	let section;
    	let t_value = /*currentStep*/ ctx[6].description + "";
    	let t;

    	return {
    		c() {
    			section = element("section");
    			t = text(t_value);
    			attr(section, "class", "description");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*currentStep*/ 64 && t_value !== (t_value = /*currentStep*/ ctx[6].description + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    		}
    	};
    }

    // (276:6) {#if lesson.steps.length > 1}
    function create_if_block_2(ctx) {
    	let section;
    	let button0;
    	let fa0;
    	let button0_disabled_value;
    	let t;
    	let button1;
    	let fa1;
    	let button1_disabled_value;
    	let current;
    	let mounted;
    	let dispose;
    	fa0 = new Fa({ props: { icon: faArrowLeft } });
    	fa1 = new Fa({ props: { icon: faArrowRight } });

    	return {
    		c() {
    			section = element("section");
    			button0 = element("button");
    			create_component(fa0.$$.fragment);
    			t = space();
    			button1 = element("button");
    			create_component(fa1.$$.fragment);
    			button0.disabled = button0_disabled_value = /*stepIndex*/ ctx[3] === 0;
    			attr(button0, "id", "back");
    			button1.disabled = button1_disabled_value = /*stepIndex*/ ctx[3] === /*lesson*/ ctx[4].steps.length - 1;
    			attr(button1, "id", "forward");
    			attr(section, "id", "controls");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, button0);
    			mount_component(fa0, button0, null);
    			append(section, t);
    			append(section, button1);
    			mount_component(fa1, button1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", stop_propagation(prevent_default(/*moveBack*/ ctx[7]))),
    					listen(button1, "click", stop_propagation(prevent_default(/*moveForward*/ ctx[8])))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (!current || dirty & /*stepIndex*/ 8 && button0_disabled_value !== (button0_disabled_value = /*stepIndex*/ ctx[3] === 0)) {
    				button0.disabled = button0_disabled_value;
    			}

    			if (!current || dirty & /*stepIndex, lesson*/ 24 && button1_disabled_value !== (button1_disabled_value = /*stepIndex*/ ctx[3] === /*lesson*/ ctx[4].steps.length - 1)) {
    				button1.disabled = button1_disabled_value;
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(fa0.$$.fragment, local);
    			transition_in(fa1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(fa0.$$.fragment, local);
    			transition_out(fa1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(fa0);
    			destroy_component(fa1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*lesson*/ ctx[4] && create_if_block$1(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			t = space();
    			this.c = noop;
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, t, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(document_1.body, "mousemove", /*move*/ ctx[11]),
    					listen(document_1.body, "mouseup", /*stopMove*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (/*lesson*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*lesson*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(t);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function onClose() {
    	const event = new Event("lesson-close");
    	document.dispatchEvent(event);
    }

    function instance$1($$self, $$props, $$invalidate) {
    	
    	let { top = 300 } = $$props;
    	let { left = 300 } = $$props;

    	onMount(() => {
    		window.Prism = window.Prism || {};
    		window.Prism.manual = true;
    	});

    	let min = false;
    	let stepIndex = 0;
    	let lesson;
    	let preEl;

    	document.addEventListener("lesson-change", event => {
    		$$invalidate(4, lesson = event.detail);
    	});

    	function moveBack() {
    		if (stepIndex > 0) {
    			$$invalidate(3, stepIndex -= 1);
    		}
    	}

    	function moveForward() {
    		if (stepIndex <= lesson.steps.length - 2) {
    			$$invalidate(3, stepIndex += 1);
    		}
    	}

    	function onMin() {
    		$$invalidate(2, min = !min);
    	}

    	let moving = false;

    	function startMove(e) {
    		if (e.target.tagName === "BUTTON" || e.target.tagName === "I" || e.target.tagName === "CODE" || e.target.tagName === "IFRAME") {
    			return;
    		}

    		moving = true;
    	}

    	function move(e) {
    		if (moving) {
    			$$invalidate(0, top = +top + e.movementY);
    			$$invalidate(1, left = +left + e.movementX);
    		}
    	}

    	function stopMove() {
    		moving = false;
    		console.log("stop");
    	}

    	function highlight(node) {
    		node.querySelector("code").innerHTML = currentStep.code;
    		window.Prism.highlightAllUnder(node, window.Prism.languages[currentStep.language]);
    	}

    	function pre_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			preEl = $$value;
    			$$invalidate(5, preEl);
    		});
    	}

    	const dragstart_handler = e => console.log("prevented");

    	$$self.$$set = $$props => {
    		if ("top" in $$props) $$invalidate(0, top = $$props.top);
    		if ("left" in $$props) $$invalidate(1, left = $$props.left);
    	};

    	let currentStep;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*lesson, stepIndex*/ 24) {
    			 $$invalidate(3, stepIndex = lesson && lesson.steps.length <= stepIndex && stepIndex > 0
    			? lesson.steps.length - 1
    			: stepIndex);
    		}

    		if ($$self.$$.dirty & /*lesson, stepIndex*/ 24) {
    			 $$invalidate(6, currentStep = lesson && lesson.steps[stepIndex]);
    		}

    		if ($$self.$$.dirty & /*currentStep, preEl*/ 96) {
    			 if (currentStep && currentStep.contentType == "code" && currentStep.code && preEl) {
    				highlight(preEl);
    			}
    		}
    	};

    	return [
    		top,
    		left,
    		min,
    		stepIndex,
    		lesson,
    		preEl,
    		currentStep,
    		moveBack,
    		moveForward,
    		onMin,
    		startMove,
    		move,
    		stopMove,
    		highlight,
    		pre_binding,
    		dragstart_handler
    	];
    }

    class App extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>@import url("https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/themes/prism.min.css");@import url("https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/themes/prism-coy.min.css");@import url("https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/line-numbers/prism-line-numbers.min.css");section#lesson{width:560px;margin:0;border-radius:4px;position:absolute;right:-30px;z-index:200;user-select:none;-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;-o-user-drag:none;cursor:move;font-family:monospace;background-color:#fff}section#header{justify-content:space-around;height:40px;background-color:#505bda;border-top-left-radius:5px;border-top-right-radius:5px;margin:0;position:relative}section#header #right-btn-container{position:absolute;top:4px;left:8px;font-size:16px}section#header #circles{display:flex;width:400px;height:10px;justify-content:space-evenly;position:absolute;top:14px;left:100px}section#header #circles span{border-radius:5px;width:10px;height:10px;background-color:#fff}section#header #circles span.active{background-color:#ffaac3}section.description{margin:5px;border:solid gray 1px;padding:2px}h3#step{text-align:center;background-color:#fff;padding:6px;margin:0;font-size:1.5em;background-color:#fff}img{width:560px;background-color:#fff;max-height:500px}section#controls{display:flex;justify-content:space-evenly;background-color:#fff}section#controls button{flex:1}.copy{user-select:text !important;cursor:initial}.not-copy{user-select:none;cursor:default}button{margin:5px;border:none;border-radius:2px;font-size:20px;padding:5px 10px;cursor:pointer}#forward{margin-right:0}#back{margin-left:0}button.sm{padding:0 10px}button:focus,button:active{outline:none}button:disabled{cursor:not-allowed;background-color:rgb(251, 251, 247)}</style>`;
    		init(this, { target: this.shadowRoot }, instance$1, create_fragment$1, safe_not_equal, { top: 0, left: 1 });

    		if (options) {
    			if (options.target) {
    				insert(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["top", "left"];
    	}

    	get top() {
    		return this.$$.ctx[0];
    	}

    	set top(top) {
    		this.$set({ top });
    		flush();
    	}

    	get left() {
    		return this.$$.ctx[1];
    	}

    	set left(left) {
    		this.$set({ left });
    		flush();
    	}
    }

    customElements.define("ng-lessons", App);

    return App;

}());
//# sourceMappingURL=ng-tutorial-component.js.map
