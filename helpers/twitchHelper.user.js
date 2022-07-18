// ==UserScript==
// @name Twitch helper
// @icon https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @description Auto claim bonus and automatically restart the player if an error occurs
// @author Murka
// @version 0.1
// @match *://www.twitch.tv/*
// @run-at document-start
// @grant none
// @license MIT
// ==/UserScript==
/* jshint esversion:6 */

(function() {

    function getReload() {
        try {
            const button = document.querySelector("[data-a-target='player-overlay-content-gate']").children[2].firstChild;
            if (button.firstChild.children.length === 2) return button;
        } catch(err) {}
    }

    setInterval(() => {
        const bonus = document.querySelector("button[aria-label='Claim Bonus']");
		const reloadPlayer = getReload();
		if (bonus) bonus.click();
		if (reloadPlayer) reloadPlayer.click();
    }, 250);

})();
