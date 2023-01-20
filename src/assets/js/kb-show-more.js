/**
 * File kbshowmore.js.
 * Gets the showmore buttons working.
 */
(function () {
    'use strict';
    window.kadenceShowMore = {
        cache: {},
        initShowMore: function () {
            window.kadenceShowMore.cache = document.querySelectorAll('.wp-block-kadence-show-more');
            if (!window.kadenceShowMore.cache.length) {
                return;
            }
            for (let n = 0; n < window.kadenceShowMore.cache.length; n++) {
                // Initialize listener (backward support)
                if ( window.kadenceShowMore.cache[n].querySelector( '.wp-block-kadence-advancedbtn.kb-show-more-buttons > .kt-btn-wrap:first-child a' ) ) {
                    window.kadenceShowMore.cache[n].querySelector( '.wp-block-kadence-advancedbtn.kb-show-more-buttons > .kt-btn-wrap:first-child a' ).addEventListener( 'click', function( e ) {
                        e.preventDefault();
                        window.kadenceShowMore.cache[n].classList.add('kb-smc-open');
                        return false;
                    });
                    window.kadenceShowMore.cache[n].querySelector( '.wp-block-kadence-advancedbtn.kb-show-more-buttons > .kt-btn-wrap:last-child a' ).addEventListener( 'click', function( e ) {
                        e.preventDefault();
                        window.kadenceShowMore.cache[n].classList.remove('kb-smc-open');
                        return false;
                    });
                }
                 // Initialize listener
                 if ( window.kadenceShowMore.cache[n].querySelector( '.wp-block-kadence-advancedbtn.kb-show-more-buttons > .wp-block-kadence-singlebtn:first-child' ) ) {
                    window.kadenceShowMore.cache[n].querySelector( '.wp-block-kadence-advancedbtn.kb-show-more-buttons > .wp-block-kadence-singlebtn:first-child' ).addEventListener( 'click', function( e ) {
                        e.preventDefault();
                        window.kadenceShowMore.cache[n].classList.add('kb-smc-open');
                        return false;
                    });
                    window.kadenceShowMore.cache[n].querySelector( '.wp-block-kadence-advancedbtn.kb-show-more-buttons > .wp-block-kadence-singlebtn:last-child' ).addEventListener( 'click', function( e ) {
                        e.preventDefault();
                        window.kadenceShowMore.cache[n].classList.remove('kb-smc-open');
                        return false;
                    });
                }
            }
        },
        // Initiate sticky when the DOM loads.
        init: function () {
            window.kadenceShowMore.initShowMore();
        }
    }
    if ('loading' === document.readyState) {
        // The DOM has not yet been loaded.
        document.addEventListener('DOMContentLoaded', window.kadenceShowMore.init);
    } else {
        // The DOM has already been loaded.
        window.kadenceShowMore.init();
    }
}());