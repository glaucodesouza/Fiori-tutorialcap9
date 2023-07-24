sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("dashboard.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        onPressExecutar: function (oEvent) {

            let oView = this.getView();
            let dtInitialFilter = oView.byId("inpDataInicial").getDateValue();
            let dtFinalFilter = oView.byId("inpDataFinal").getDateValue();

            //Datas teste INI---------------------------------------------
            if(!dtInitialFilter){
                // 'Tue Apr 27 2021 10:37:30 GMT-0300 (Brasilia Standard Time)'
                dtInitialFilter = new Date("1/1/2021");
            }

            if(!dtFinalFilter){
                // 'Tue Apr 27 2021 10:37:30 GMT-0300 (Brasilia Standard Time)'
                dtFinalFilter = new Date("6/30/2021");
            }
            //Datas teste FIM---------------------------------------------

            var dataTest = this.fillTestData();
            debugger;
            // Chart 1
            this.processChart1(dtInitialFilter,dtFinalFilter,dataTest);

        },

        processChart1(dtInitialFilter,dtFinalFilter,dataTest){
            const chartData = [];
            this.buildChart1Data(dtInitialFilter,dtFinalFilter,dataTest,chartData);
            const oModelchart1 = new JSONModel(chartData);
            this.setModel(oModelchart1, "chart1");

            var oVizFrameChart1 = this.getView().byId("idVizFrameChart1");
            if (oVizFrameChart1){
                oVizFrameChart1.setVizProperties({
                    plotArea: {
                        dataLabel: {
                            visible: true
                        }
                    },
                    title: {
                        visible: true,
                        text: 'Chart 1 Buy x Sell'
                    }
                });
            }

        },

        buildChart1Data : function (dtFiltroInicial,dtFiltroFinal,dataTest,chartData){
            try {
                let lv_card = {};
                // buyQuantity
                // sellQuantity
                // yearMonth
                debugger;
                try {
                    dataTest.forEach(data => {
                        
                        //Procurar se já existe o ano-mês atual já no array de dados finais do chart
                        let existingData = chartData.find((existingData) => existingData.yearMonth == data.yearMonth)

                        //if exists year-month
                        if (!!existingData){
                            if (data.movType == 'Buy') {
                                existingData.buyQuantity    += data.quantity;
                                //existingData.sellQuantity   = 0;
                            } else {
                                // existingData.buyQuantity    
                                existingData.sellQuantity   += data.quantity;
                            }
                        // if not
                        } else {
                            if (data.movType == 'Buy') {
                                lv_card.buyQuantity     = data.quantity;
                                lv_card.sellQuantity    = 0;
                                lv_card.yearMonth       = data.yearMonth;
                                chartData.push(lv_card);
                                lv_card = {};
                            } else {
                                lv_card.buyQuantity     = 0;
                                lv_card.sellQuantity    = data.quantity
                                lv_card.yearMonth       = data.yearMonth;
                                chartData.push(lv_card);
                                lv_card = {};
                            }
                        }
                    });

                    chartData.sort(function (x, y) {
                        let a = x.yearMonth,
                            b = y.yearMonth;
                        return a == b ? 0 : a > b ? 1 : -1;
                    });
                    return chartData;
                } catch (error) {
                    
                }

            } catch (oError) {

            }

        },

        timestampToBrazilianShort: function (timestampDate) {
            let brazilianShortDate = timestampDate.toLocaleDateString('pt-BR');//'2023-06-07'
            return brazilianShortDate;
        },
        brazilianShortDateToChartDate: function (brazilianShortDate) {
            let chartDate = brazilianShortDate.substring(6,10) + '-' + brazilianShortDate.substring(3,5);
            return chartDate;
        },

        fillTestData: function(){
            var tab_test = 
            [   { 
                    movType : 'Buy',
                    quantity: 75,
                    yearMonth: "2021-01"
                },
                { 
                    movType : 'Buy',
                    quantity: 100,
                    yearMonth: "2021-01"
                },
                { 
                    movType : 'Sell',
                    quantity: 50,
                    yearMonth: "2021-01"
                },
                { 
                    movType : 'Sell',
                    quantity: 200,
                    yearMonth: "2021-01"
                },
                { 
                    movType : 'Buy',
                    quantity: 33,
                    yearMonth: "2021-02"
                },
                { 
                    movType : 'Buy',
                    quantity: 45,
                    yearMonth: "2021-02"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-02"
                },
                { 
                    movType : 'Sell',
                    quantity: 33,
                    yearMonth: "2021-02"
                },
                { 
                    movType : 'Sell',
                    quantity: 200,
                    yearMonth: "2021-02"
                },
                { 
                    movType : 'Buy',
                    quantity: 50,
                    yearMonth: "2021-03"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-03"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-03"
                },
                { 
                    movType : 'Sell',
                    quantity: 310,
                    yearMonth: "2021-03"
                },
                { 
                    movType : 'Sell',
                    quantity: 120,
                    yearMonth: "2021-03"
                },
                { 
                    movType : 'Buy',
                    quantity: 10,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 12,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 11,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 12,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Sell',
                    quantity: 250,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Sell',
                    quantity: 300,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Sell',
                    quantity: 10,
                    yearMonth: "2021-04"
                },
                { 
                    movType : 'Buy',
                    quantity: 15,
                    yearMonth: "2021-05"
                },
                { 
                    movType : 'Sell',
                    quantity: 700,
                    yearMonth: "2021-05"
                },
                { 
                    movType : 'Sell',
                    quantity: 100,
                    yearMonth: "2021-05"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-06"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-06"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-06"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-06"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-06"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-06"
                },
                { 
                    movType : 'Buy',
                    quantity: 1,
                    yearMonth: "2021-06"
                },
                { 
                    movType : 'Sell',
                    quantity: 500,
                    yearMonth: "2021-06"
                },
                { 
                    movType : 'Sell',
                    quantity: 100,
                    yearMonth: "2021-06"
                },
            ];
            return tab_test;
        },

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished : function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onPress : function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack : function() {
            // eslint-disable-next-line fiori-custom/sap-no-history-manipulation, fiori-custom/sap-browser-api-warning
            history.go(-1);
        },


        onSearch : function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("ID", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh : function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject : function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/Products".length)
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        }

    });
});
