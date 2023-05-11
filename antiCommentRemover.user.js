// ==UserScript==
// @name Anti Сomment Remover [Animego]
// @name:ru Анти Удалитель Комментариев [Анимего]
// @author Murka
// @description Prevents automatic hiding of comments when liking or disliking
// @description:ru Убирает автоматическое скрытие комментариев при нажатии на кнопку лайка или дизлайка
// @icon https://animego.org/android-chrome-192x192.png
// @version 1.0.0
// @match *://animego.org/*
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
    Greasyfork: https://greasyfork.org/users/919633
*/

(function() {
    "use strict";

    const log = console.log;

    const isComment = (node) => {
        return /^comment-\d+$/.test(node.id);
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLDivElement && isComment(node)) {
                    const parent = node.parentElement;
                    const parentContainer = parent.parentElement;

                    const handleRemoval = (target) => {
                        const _removeChild = target.removeChild;
                        target.removeChild = function(child) {
                            if (isComment(child)) return null;
                            return _removeChild.call(this, child);
                        }
                    }

                    handleRemoval(parent);
                    handleRemoval(parentContainer);
                }
            }
        }
    })
    observer.observe(document, { childList: true, subtree: true });

})();
