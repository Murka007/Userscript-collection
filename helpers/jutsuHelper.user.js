// ==UserScript==
// @name Jutsu helper
// @description Скрипт для автоматического пропуска опенингов и эндингов
// @author Murka
// @version 0.2
// @icon https://gen.jut.su/safari_152.png
// @match *://jut.su/*
// @run-at document-end
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// ==/UserScript==
/* jshint esversion:6 */

(function() {

    function isVisible(elem) {
        return elem && elem.offsetParent !== null;
    }

    (function loop() {
        const opening = document.querySelector("div[title='Нажмите, если лень смотреть опенинг']");
        const ending = document.querySelector("div[title='Перейти к следующему эпизоду']");
        const playButton = document.querySelector("button[title='Воспроизвести видео']");
        if (isVisible(opening)) opening.click();
        if (isVisible(ending)) ending.click();
        if (isVisible(playButton)) playButton.click();
        setTimeout(loop, isVisible(opening) || isVisible(ending) ? 5000 : 250);
    })();

})();
