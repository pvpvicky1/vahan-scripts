
// ==UserScript==
// @name         VAHAN Mobile OTP Button Enable
// @namespace    vahan.mobile.otp.enable
// @version      1.1
// @description  Adds a right-side button to enable and open “Proceed with mobile OTP Verification”
// @match        https://vahan.parivahan.gov.in/vahanservice/vahan/ui/eapplication/form_eApplicatonHome.xhtml*
// @run-at       document-idle
// @grant        none
// @updateURL    https://raw.githubusercontent.com/pvpvicky1/vahan-scripts/main/vahan-mobile.user.js
// @downloadURL  https://raw.githubusercontent.com/pvpvicky1/vahan-scripts/main/vahan-mobile.user.js
// ==/UserScript==

(function () {
    'use strict';

    const ORIGINAL_BUTTON_ID = 'form_eapp:failyesid1';
    const FLOATING_BUTTON_ID = 'vahan-enable-mobile-otp';

    function enableAndClickMobileOTP() {
        const originalButton = document.getElementById(ORIGINAL_BUTTON_ID);

        if (!originalButton) {
            alert('Mobile OTP Verification option is not available on this page.');
            return;
        }

        // Enable the original button
        originalButton.disabled = false;
        originalButton.removeAttribute('disabled');
        originalButton.removeAttribute('aria-disabled');

        // Remove PrimeFaces disabled classes
        originalButton.classList.remove(
            'ui-state-disabled',
            'ui-button-disabled',
            'disabled'
        );

        // Enable its parent containers if hidden or disabled
        let parent = originalButton.parentElement;

        for (let i = 0; parent && i < 4; i++, parent = parent.parentElement) {
            parent.style.setProperty('display', '', 'important');
            parent.style.setProperty('visibility', 'visible', 'important');
            parent.style.setProperty('opacity', '1', 'important');
            parent.style.setProperty('pointer-events', 'auto', 'important');

            parent.classList.remove(
                'ui-state-disabled',
                'ui-helper-hidden',
                'ui-helper-hidden-accessible',
                'disabled'
            );
        }

        // Trigger the actual VAHAN button
        originalButton.click();
    }

    function createFloatingButton() {
        if (document.getElementById(FLOATING_BUTTON_ID)) return;

        const button = document.createElement('button');

        button.id = FLOATING_BUTTON_ID;
        button.type = 'button';
        button.textContent = 'MOBILE';

        Object.assign(button.style, {
            position: 'fixed',
            right: '12px',
            top: '310px',
            zIndex: '2147483647',
            padding: '10px 15px',
            background: '#1565c0',
            color: '#ffffff',
            border: '2px solid #ffffff',
            borderRadius: '7px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer'
        });

        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            enableAndClickMobileOTP();
        });

        document.body.appendChild(button);
    }

    function init() {
        if (!document.body) {
            setTimeout(init, 300);
            return;
        }

        createFloatingButton();
    }

    init();

    // Restore the floating button after PrimeFaces AJAX updates
    new MutationObserver(createFloatingButton).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
