// ==UserScript==
// @name Sploop.io Zoom hack
// @author Murka
// @description Allows to change zoom of the game using mouse wheels
// @icon https://sploop.io/img/ui/favicon.png
// @version 0.5
// @match *://sploop.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/sG9cyfGPj5
    Greasyfork: https://greasyfork.org/en/users/919633
*/

(function() {
    "use strict";

    const log = console.log;
    function createHook(target, prop, callback) {
        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                return this[symbol];
            },
            set(value) {
                callback(this, symbol, value);
            },
            configurable: true
        })
    }

    function findKey(target, value) {
        for (const key in target) {
            if (target[key] === value) return key;
        }
        return null;
    }

    const CONFIG = {
        maxWidth: {
            key: null,
            value: 1824 + 100 * 6
        },
        maxHeight: {
            key: null,
            value: 1026 + 100 * 6
        }
    };

    // "max_players", is the only way to get access to the max_width and max_height properties
    // otherwise I would have to hook setTransform or Math.max
    createHook(Object.prototype, "max_players", function(that, symbol, value) {
        delete Object.prototype.max_players;
        that.max_players = value;

        const { maxWidth, maxHeight } = CONFIG;
        maxWidth.key = findKey(that, 1824);
        maxHeight.key = findKey(that, 1026);

        Object.defineProperty(that, maxWidth.key, { get: () => maxWidth.value })
        Object.defineProperty(that, maxHeight.key, { get: () => maxHeight.value })
    })

    let wheels = 0;
    const scaleFactor = 150;
    window.addEventListener("wheel", function(event) {
        const { maxWidth, maxHeight } = CONFIG;
        if (event.target.id !== "game-canvas" || maxWidth.key === null || maxHeight.key === null) return;

        // Used to create a small gap, so users could easily find the default scale
        if (maxWidth.value === 1824 && maxHeight.value === 1026) wheels += 1;
        if (wheels % 5 !== 0) return;

        const zoom = event.deltaY > 0 ? -scaleFactor : scaleFactor;
        maxWidth.value += zoom;
        maxHeight.value += zoom;
        window.dispatchEvent(new Event("resize"));
    })

})();
