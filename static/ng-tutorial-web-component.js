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
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (167:0) {#if lesson}
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
    	let if_block0 = /*lesson*/ ctx[4].steps.length > 1 && create_if_block_6(ctx);
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
    					listen(button1, "click", stop_propagation(prevent_default(/*onMin*/ ctx[8]))),
    					listen(section1, "mousedown", /*startMove*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (/*lesson*/ ctx[4].steps.length > 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_6(ctx);
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

    // (183:6) {#if lesson.steps.length > 1}
    function create_if_block_6(ctx) {
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

    // (184:8) {#each lesson.steps as step, index}
    function create_each_block(ctx) {
    	let span;
    	let span_data_step_value;

    	return {
    		c() {
    			span = element("span");
    			attr(span, "data-step", span_data_step_value = /*index*/ ctx[18]);
    			toggle_class(span, "active", /*stepIndex*/ ctx[3] == /*index*/ ctx[18]);
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*stepIndex*/ 8) {
    				toggle_class(span, "active", /*stepIndex*/ ctx[3] == /*index*/ ctx[18]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    // (190:2) {#if !min}
    function create_if_block_1$1(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let if_block3_anchor;
    	let current;
    	let if_block0 = /*currentStep*/ ctx[5].step && create_if_block_5(ctx);
    	let if_block1 = /*currentStep*/ ctx[5].contentType === "video" && create_if_block_4(ctx);
    	let if_block2 = /*currentStep*/ ctx[5].contentType === "picture" && create_if_block_3(ctx);
    	let if_block3 = /*lesson*/ ctx[4].steps.length > 1 && create_if_block_2(ctx);

    	return {
    		c() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert(target, if_block3_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (/*currentStep*/ ctx[5].step) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*currentStep*/ ctx[5].contentType === "video") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*currentStep*/ ctx[5].contentType === "picture") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3(ctx);
    					if_block2.c();
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*lesson*/ ctx[4].steps.length > 1) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*lesson*/ 16) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_2(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block3);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block3);
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
    			if (detaching) detach(if_block3_anchor);
    		}
    	};
    }

    // (191:2) {#if currentStep.step}
    function create_if_block_5(ctx) {
    	let h3;
    	let t_value = /*currentStep*/ ctx[5].step + "";
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
    			if (dirty & /*currentStep*/ 32 && t_value !== (t_value = /*currentStep*/ ctx[5].step + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(h3);
    		}
    	};
    }

    // (194:4) {#if currentStep.contentType === 'video'}
    function create_if_block_4(ctx) {
    	let video;
    	let source;
    	let source_src_value;
    	let track;
    	let t;

    	return {
    		c() {
    			video = element("video");
    			source = element("source");
    			track = element("track");
    			t = text(" \n              Your browser does not support the video tag.");
    			if (source.src !== (source_src_value = /*currentStep*/ ctx[5].url)) attr(source, "src", source_src_value);
    			attr(source, "type", "video/mp4");
    			attr(track, "kind", "captions");
    			attr(video, "width", "840");
    			attr(video, "height", "472");
    			video.controls = true;
    		},
    		m(target, anchor) {
    			insert(target, video, anchor);
    			append(video, source);
    			append(video, track);
    			append(video, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*currentStep*/ 32 && source.src !== (source_src_value = /*currentStep*/ ctx[5].url)) {
    				attr(source, "src", source_src_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(video);
    		}
    	};
    }

    // (203:4) {#if currentStep.contentType === 'picture'}
    function create_if_block_3(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*currentStep*/ ctx[5].url)) attr(img, "src", img_src_value);
    			attr(img, "alt", img_alt_value = "step " + (/*stepIndex*/ ctx[3] + 1));
    			attr(img, "id", "main-image");
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);

    			if (!mounted) {
    				dispose = listen(img, "dragstart", prevent_default(/*dragstart_handler*/ ctx[12]));
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*currentStep*/ 32 && img.src !== (img_src_value = /*currentStep*/ ctx[5].url)) {
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

    // (212:4) {#if lesson.steps.length > 1}
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
    					listen(button0, "click", stop_propagation(prevent_default(/*moveBack*/ ctx[6]))),
    					listen(button1, "click", stop_propagation(prevent_default(/*moveForward*/ ctx[7])))
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
    					listen(document_1.body, "mousemove", /*move*/ ctx[10]),
    					listen(document_1.body, "mouseup", /*stopMove*/ ctx[11])
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
    	let min = false;
    	let stepIndex = 0;
    	let lesson;

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
    	let offsetX = 0;
    	let offsetY = 0;

    	function startMove(e) {
    		if (e.target.tagName === "BUTTON" || e.target.tagName === "I") {
    			return;
    		}

    		moving = true;
    		offsetY = e.offsetY + e.target.offsetTop;
    		offsetX = e.offsetX + e.target.offsetLeft;
    	}

    	function move(e) {
    		if (moving) {
    			$$invalidate(0, top = e.pageY - offsetY);
    			$$invalidate(1, left = e.pageX - offsetX);
    		}
    	}

    	function stopMove() {
    		moving = false;
    		console.log("stop");
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
    			 $$invalidate(5, currentStep = lesson && lesson.steps[stepIndex]);
    		}
    	};

    	return [
    		top,
    		left,
    		min,
    		stepIndex,
    		lesson,
    		currentStep,
    		moveBack,
    		moveForward,
    		onMin,
    		startMove,
    		move,
    		stopMove,
    		dragstart_handler
    	];
    }

    class App extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>section#lesson{width:839px;margin:0;border-radius:4px;position:absolute;right:-30px;z-index:200;user-select:none;-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;-o-user-drag:none;cursor:move}section#header{justify-content:space-around;height:40px;background-color:#505bda;border-top-left-radius:5px;border-top-right-radius:5px;margin:0;position:relative}section#header #right-btn-container{position:absolute;top:4px;left:8px;font-size:16px}section#header #circles{display:flex;width:400px;height:10px;justify-content:space-evenly;position:absolute;top:14px;left:219.5px}section#header #circles span{border-radius:5px;width:10px;height:10px;background-color:#fff}section#header #circles span.active{background-color:#ffaac3}h3#step{text-align:center;background-color:#fff;padding:6px;margin:0;font-size:1.5em;background-color:#fff}img{width:840px;background-color:#fff;max-height:500px}section#controls{display:flex;justify-content:space-evenly;background-color:#fff;margin-top:-8px}section#controls button{flex:1}button{margin:5px;border:none;border-radius:2px;font-size:20px;padding:5px 10px;cursor:pointer}#forward{margin-right:0}#back{margin-left:0}button.sm{padding:0 10px}button:focus,button:active{outline:none}button:disabled{cursor:not-allowed;background-color:rgb(251, 251, 247)}</style>`;
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
