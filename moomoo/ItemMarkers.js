// ==UserScript==
// @name Moomoo.io Item markers
// @author Murka
// @description Draws markers on items
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

    // render - false/true, used to toggle rendering of marker
    // color - hex/rgb color, used to change marker color
    const MARKER_COLOR = {
        MY_PLAYER: {
            render: true,
            color: "#a7f060"
        },
        TEAMMATE: {
            render: true,
            color: "#fceb65"
        },
        ENEMY: {
            render: true,
            color: "#f76363"
        }
    };
    const MARKER_SIZE = 10;

    const log = console.log;
    function createHook(target, prop, setter, getter) {
        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                getter(this, this[symbol]);
                return this[symbol];
            },
            set(value) {
                setter(this, symbol, value);
            },
            configurable: true
        })
    }

    let item = null;
    createHook(Object.prototype, "isItem", function(that, symbol, value) {
        that[symbol] = value;
    }, function(that, value) {
        if (value === true) {
            item = that;
        }
    });

    const myPlayer = { id: null };
    const teammates = [];

    // myPlayer spawned
    function setupPlayer(temp) {
        myPlayer.id = temp[1];
    }

    function createDeleteClan(temp) {
        if (!temp[1]) {
            teammates.splice(0, teammates.length);
        }
    }

    function updateClanList(temp) {
        teammates.splice(0, teammates.length);
        for (let i=0;i<temp[1].length;i+=2) {
            const [ id, name ] = temp[1].slice(i, i+2);
            teammates.push(id);
        }
    }

    function getItemColor(id) {
        if (id === myPlayer.id) return MARKER_COLOR.MY_PLAYER;
        if (teammates.includes(id)) return MARKER_COLOR.TEAMMATE;
        return MARKER_COLOR.ENEMY;
    }

    function drawMarker(ctx) {
        if (!item || !item.owner || myPlayer.id === null) return;
        const type = getItemColor(item.owner.sid);
        if (!type.render) return;

        ctx.fillStyle = type.color;
        ctx.beginPath();
        ctx.arc(0, 0, MARKER_SIZE, 0, 2 * Math.PI);
        ctx.fill();
        item = null;
    }

    // This method is called when item was drawn
    CanvasRenderingContext2D.prototype.restore = new Proxy(CanvasRenderingContext2D.prototype.restore, {
        apply(target, _this, args) {
            drawMarker(_this);
            return target.apply(_this, args);
        }
    });

    const msgpack = {
        encode: null,
        decode: null
    };

    // Get msgpack's encode and decode methods
    Function.prototype.call = new Proxy(Function.prototype.call, {
        apply(target, _this, args) {
            const data = target.apply(_this, args);
            if (args[1] && args[1].i) {
                const i = args[1].i;
                if (i === 9) msgpack.encode = args[0].encode;
                if (i === 15) {
                    msgpack.decode = args[0].decode;
                    Function.prototype.call = target;
                }
            }
            return data;
        }
    })

    const PACKETS = {
        1: setupPlayer,
        st: createDeleteClan,
        sa: updateClanList,
    };

    // Handle WebSocket data
    function message(event) {
        try {
            const data = msgpack.decode(new Uint8Array(event.data));
            const temp = [data[0], ...data[1]];
            PACKETS[temp[0]](temp);
        } catch(err){}
    }

    // Intercept WebSocket
    const set = Object.getOwnPropertyDescriptor(WebSocket.prototype, "onmessage").set;
    Object.defineProperty(WebSocket.prototype, "onmessage", {
        set(callback) {
            return set.call(this, new Proxy(callback, {
                apply(target, _this, args) {
                    message(args[0]);
                    return target.apply(_this, args);
                }
            }))
        }
    })

})();
