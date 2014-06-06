'use strict';
define(['metro'], function (metro) {
    return metro.app('settings', [])
        .states(['home'])
        .init();
});

