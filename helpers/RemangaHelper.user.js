// ==UserScript==
// @name Remanga helper
// @name:ru Remanga helper
// @author Murka
// @description Automatically clicks on the "Thanks" button after reading the chapter
// @description:ru Автоматически нажимает на кнопку "Спасибо" при прочтении главы
// @icon https://remanga.org/icon.png
// @version 0.1
// @match *://remanga.org/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Follow me on github: https://github.com/Murka007
    Join my Discord server: https://discord.gg/sG9cyfGPj5
    More scripts you can find here: https://greasyfork.org/en/users/919633
*/

(function() {
    "use strict";

    const log = console.log;

    const isElementVisible = (element) => {
        return element && element.offsetParent !== null;
    }

    const isReadingManga = () => {
        return /https?:\/\/remanga\.org\/manga\/.+?\/\w+/.test(location.href);
    }

    const onVisibilityChange = (getElement, condition, callback) => {
        return () => {
            const elem = getElement();
            if (condition(elem)) callback(elem);
        }
    }

    const getThanksButtons = () => {
        return [
            document.querySelector("div > button[class*='textSizeLarge'][class*='sizeLarge'][tabindex='0'][type='button']"), // old design
            document.querySelector("button[class*='likeButton'][tabindex='0'][type='button'][style='color: var(--inverse);']") // new design
        ]
    }

    const handler = onVisibilityChange(
        () => getThanksButtons().find(button => button !== null),
        (elem) => isElementVisible(elem) && isReadingManga(),
        (elem) => elem.click()
    )

    window.addEventListener("DOMContentLoaded", handler);
    window.addEventListener("load", handler);
    window.addEventListener("scroll", handler);
    window.addEventListener("resize", handler);

})()
