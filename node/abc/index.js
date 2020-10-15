"use strict";
// declare function e(): ABC
function abc() {
    return mm();
}
function mm() {
    return {
        get: function (a) {
            return a;
        }
    };
}
module.exports = abc;
