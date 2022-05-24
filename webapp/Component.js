sap.ui.define([
    'sap/ui/core/UIComponent'
    
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("tss.mm.ord.Component",{
        metadata:{
            manifest:"json"
        },

        init: function(){
            // Like consutructor of component class 
            // Here we call the base class of constructor using super->consutructor()
            sap.ui.core.UIComponent.prototype.init.apply(this);

            //Implement Router
            //Step1: Get the router object from base class
            var oRouter = this.getRouter();
            //Step2: We need to initialize the router
            oRouter.initialize();


            
        },
    //     createContent: function(){
    //       var oAppView = new sap.ui.view({
    //         id: "idAppView",
    //         viewName: "tss.mm.ord.view.App",
    //         type: "XML"
    //       });

    //     //   Create object of our newly created views
    //     var oView1 = new sap.ui.view({
    //         id:"idView1",
    //         viewName:"tss.mm.ord.view.View1",
    //         type:"XML"
    //     });

    //     var oView2 = new sap.ui.view({
    //         id:"idView2",
    //         viewName:"tss.mm.ord.view.View2",
    //         type:"XML"
    //     });

    //     // Obtain the container object from root view 
    //    var oAppCon = oAppView.byId("appCon");

    //     // Add our views to the app container (Check red line in design digram in PPT)
    //     // oAppCon.addPage(oView1).addPage(oView2);
    //     oAppCon.addMasterPage(oView1).addDetailPage(oView2);


    //       return oAppView;
          
    //     },



        destroy: function(){

        }

        

    });
});