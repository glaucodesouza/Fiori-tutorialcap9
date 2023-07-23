sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/routing/History",
  "../model/formatter",
  "sap/m/MessageToast"
], function (BaseController, JSONModel, History, formatter, MessageToast) {
  "use strict";

  return BaseController.extend("products.controller.Create", {

      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit : function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("create").attachPatternMatched(this._onCreateMatched, this);

        // let oCreateModel = new JSONModel({
        //     description : '',
        //     quantity : '0.00',
        //     price : '0.00'
        // });
        // this.getView().setModel(oCreateModel, "createView");
      }, 

      _onCreateMatched: function (oEvent) {
        // debugger;
        // var m = this.getView().getModel();
        // let oCreateModel2 = this.getOwnerComponent().getModel();

        // try {
        //   oCreateModel2.metadataLoaded().then(function(){
        //     var oContext = oCreateModel2.createEntry('/Products',{
        //             properties: {
        //               description : '',
        //               quantity : '0.00',
        //               price : '0.00'
        //             }
        //         });
        //     this.getView().bindElement({
        //         path: oContext.getPath()
        //         //model: "",
        //     });
        //     }.bind(this));
        // } catch (error) {
        //   console.log('error _onCreateMatched()');
        // }

        try {
          m.metadataLoaded().then(function(){
            var oContext = m.createEntry('/Products',{
                    properties: {
                      description : '',
                      quantity : '0.00',
                      price : '0.00'
                    }
                });
            this.getView().bindElement({
                path: oContext.getPath()
                //model: "",
            });
            }.bind(this));
        } catch (error) {
          console.log('error _onCreateMatched()');
        }
      },

      onSave: function () {
        debugger;
        let oCreateModel = this.getView().getModel();
        let oCreateModel2 = this.getOwnerComponent().getModel();

        var data = {
          description: this.byId("inpDescription").getValue(),
          quantity: parseFloat(this.byId("inpQuantity").getValue()),
          price: parseFloat(this.byId("inpPrice").getValue())
        };

        console.log('Before create method...');

        oCreateModel2.create("/Products", data, {
          success: function (oData) {
            console.log('create success');
            var msg = `Produto ` + data.description + `\r\ncriado com sucesso!`;
            MessageToast.show(msg);
            window.history.go(-1);
          }.bind(this),
          error: function (oError) {
            console.log('create error');
            msg = `Erro ` + `\r\nao criar Produto!`;
            MessageToast.show(msg);
          }.bind(this),
        });

        // oCreateModel.create("/Products", data, {
        //   success: function (oData) {
        //     console.log('create success');
        //   }.bind(this),
        //   error: function (oError) {
        //     console.log('create error');
        //   }.bind(this),
        // });

        console.log('After create method...');
      },

      _createRequest: async function (oPayload) {

        let oCreateModel = this.getView().getModel();

        return new Promise((resolve, reject) => {
          oCreateModel.create("/Products", oPayload, {
            success: function (oData) {
            }.bind(this),
            error: function (oError) {
            }.bind(this),
          });
        })
      },

      /**
       * Event handler  for navigating back.
       * It there is a history entry we go one step back in the browser history
       * If not, it will replace the current entry of the browser history with the worklist route.
       * @public
       */
      onNavBack : function() {
          var sPreviousHash = History.getInstance().getPreviousHash();
          if (sPreviousHash !== undefined) {
              // eslint-disable-next-line fiori-custom/sap-no-history-manipulation
              history.go(-1);
          } else {
              this.getRouter().navTo("worklist", {}, true);
          }
      },

      /* =========================================================== */
      /* internal methods                                            */
      /* =========================================================== */

      onAfterRendering: function(){
        // debugger;
        // var oComponent = this.getOwnerComponent();
        // var oModel = oComponent.getModel();
      },

      /**
       * Binds the view to the object path.
       * @function
       * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
       * @private
       */
      _onObjectMatched : function (oEvent) {
          debugger;
          var sObjectId =  oEvent.getParameter("arguments").objectId;
          this._bindView("/Products");
      },

      /**
       * Binds the view to the object path.
       * @function
       * @param {string} sObjectPath path to the object to be bound
       * @private
       */
      _bindView : function (sObjectPath) {
          var oViewModel = this.getModel("objectView");

          this.getView().bindElement({
              path: sObjectPath,
              events: {
                  change: this._onBindingChange.bind(this),
                  dataRequested: function () {
                      oViewModel.setProperty("/busy", true);
                  },
                  dataReceived: function () {
                      oViewModel.setProperty("/busy", false);
                  }
              }
          });
      },

      _onBindingChange : function () {
          var oView = this.getView(),
              oViewModel = this.getModel("objectView"),
              oElementBinding = oView.getElementBinding();

          // No data for the binding
          if (!oElementBinding.getBoundContext()) {
              this.getRouter().getTargets().display("objectNotFound");
              return;
          }

          var oResourceBundle = this.getResourceBundle(),
              oObject = oView.getBindingContext().getObject(),
              sObjectId = oObject.ID,
              sObjectName = oObject.Products;

              oViewModel.setProperty("/busy", false);
              oViewModel.setProperty("/shareSendEmailSubject",
                  oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
              oViewModel.setProperty("/shareSendEmailMessage",
                  oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
      }
  });

});
