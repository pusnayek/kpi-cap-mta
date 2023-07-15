sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("ui.lms.controller.Main", {
            onInit: function () {

            },

            onBeforeRendering: function(oEvent) {
                var $this = this;
                this.getOwnerComponent().getModel().read("/Populations", {
                    success: function(data) {
                        $this.getView().setModel(new JSONModel({
                            "items": data.results
                        }), "population");
                    },
                    error: function(oError) {}
                });
            }
        });
    });
