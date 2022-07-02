// ==UserScript==
// @name Moomoo.io Auto reloader
// @author Murka
// @description Automatically reload the page on disconnect and handle errors such as "Server is full"
// @icon https://moomoo.io/img/favicon.png?v=1
// @version 0.2
// @match *://moomoo.io/*
// @match *://*.moomoo.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// ==/UserScript==
/* jshint esversion:8 */

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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function reload() {
        await sleep(1500);
        window.onbeforeunload = null;
        location.reload();
    }

    // Handles errors such as "Server is full", "Failed to find server index" etc
    createHook(Object.prototype, "errorCallback", function(that, symbol, value) {
        that[symbol] = value;

        if (typeof value !== "function") return;
        that[symbol] = new Proxy(value, {
            apply(target, _this, args) {
                window.alert = function(){}
                reload();
                return target.apply(_this, args);
            }
        })
    })

    // Handle WebSocket close and error events
    window.WebSocket = class extends WebSocket {
        constructor(...args) {
            super(...args);
            this.addEventListener("close", () => reload());
            this.addEventListener("error", () => reload());
        }
    }

})();
