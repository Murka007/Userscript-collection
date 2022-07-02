// ==UserScript==
// @name Moomoo.io Game grid removal
// @author Murka
// @description Removes the game grid
// @icon https://moomoo.io/img/favicon.png?v=1
// @version 0.1
// @match *://moomoo.io/*
// @match *://*.moomoo.io/*
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

    // Change to true or false
    const GRID_ENABLED = false;
    function inRange(value, min, max) {
        return value > min && value < max;
    }

    CanvasRenderingContext2D.prototype.moveTo = new Proxy(CanvasRenderingContext2D.prototype.moveTo, {
        apply(target, _this, args) {

            if (!GRID_ENABLED) {
                const [ x, y ] = args;
                const { maxScreenWidth, maxScreenHeight } = window.config || {};
                if (inRange(x, 0, maxScreenWidth) || inRange(y, 0, maxScreenHeight)) return null;
            }

            return target.apply(_this, args);
        }
    })

})();
