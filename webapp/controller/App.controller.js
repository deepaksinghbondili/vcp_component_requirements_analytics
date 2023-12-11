sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("vcpapp.vcpcomponentrequirements.controller.App", {
        onInit: function() {
          var oModel = this.getOwnerComponent().getModel("oModel");
          this.getView().setModel(oModel);
        }
      });
    }
  );
  