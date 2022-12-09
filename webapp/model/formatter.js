sap.ui.define([], function () {
    "use strict";
    return {
        formatDate: function (sValue) {
            //return "date" from json model in new Date() js obj
            if (!sValue) {
                return null;
            }
            return new Date(sValue);
        }
    };
});