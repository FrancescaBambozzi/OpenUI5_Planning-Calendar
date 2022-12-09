sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/base/Log",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, Log, formatter, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("movies.controller.App", {

            formatter: formatter,
            onInit: function () {
                Log.info("controller has been inizialized")
            },

            onPress: function (sValue) {
                //As there is a passed argument from the XML view, 
                //the first argument in the handler function is now the passed value.
                sap.ui.require(["sap/m/MessageToast"], function (oMessage) {
                    var oResourceBundle =
                        this.getOwnerComponent().getModel("i18n").getResourceBundle();
                    oMessage.show(oResourceBundle.getText("search") + sValue
                    );
                }.bind(this));

                //collect the string that the user entered in the search field into var
                var sCity = this.byId('city').getValue(),
                    sGenre = this.byId('genre').getSelectedItem().getKey(),
                    oCalendar = this.byId("calendar"),
                    //get the rows of the calendar to update the binding
                    oRowBinding = oCalendar.getBinding("rows"), //get binding gets the DATA bound to the rows
                    oFilterGenre,
                    oFilterCity;

                // Create filters for genre and city according to user inputs
                oFilterGenre = sGenre ? new Filter("genre", FilterOperator.EQ, sGenre) : null;
                oFilterCity = sCity ? new Filter("info", FilterOperator.Contains, sCity) : null;
                // Apply genre filter to calendar rows
                oRowBinding.filter(oFilterGenre);
                // Apply city filter to row appointments
                var aRows = oCalendar.getAggregation("rows"); //get aggregations gets the actual rows CONTROLS
                aRows.forEach(function (oItem) {
                    var oAppointmentsBinding = oItem.getBinding("appointments");
                    oAppointmentsBinding.filter(oFilterCity);
                });
            },

            onAppointmentSelect: function (oAppointment) {
                var oContext = oAppointment.getBindingContext("movies"),
                    sPath = oContext.getPath();

                //extract the position of the selected movie and appointment (nav params) from sPath     
                //look at XML view .onAppointmentSelect("parameters")
                var aParameters = sPath.split("/");
                UIComponent.getRouterFor(this).navTo("Detail", {
                    movieId: aParameters[2],
                    appointmentId: aParameters[4]
                });
            }
        });
    });
