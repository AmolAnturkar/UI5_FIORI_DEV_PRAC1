sap.ui.define([
    'tss/mm/ord/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
   
], function(BaseController,MessageBox,MeassageToast,Fragment,Filter,FilterOperator) {
    'use strict';
    return BaseController.extend("tss.mm.ord.controller.View2",{
        // This is our App controller   

        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            //Whenever we click fruit, the route is changing 
            // This change of route we need to handle via event
            // So here we are attaching the event via function
            // Whenever route change call my function herculis
            this.oRouter.getRoute("detail").attachMatched(this.herculis,this);

        },

        herculis:function(oEvent){
            var fruitId = oEvent.getParameter("arguments").fruitId;   
            // var sPath = '/fruits/' + fruitId;
            var sPath = '/' + fruitId;  // T0 bind to default model set
            
            this.getView().bindElement({
                path: sPath,
                parameters: {
                    expand: 'To_Supplier'
                }
            });
            // debugger;
        },

        onNavNextRow: function(oEvent){
            var sPath = oEvent.getParameter("listItem").getBindingContextPath();
            MeassageToast.show(sPath);

            //TODO: Implement level 3 navigation to another view Supplier
        },

        onBack: function(){
             // View to View there is no direct access to navigate
            // In-order to achieve that, we need to create object of parent container of views is "appCon" using getParent(), which is parent of all views
            // and then navigate to other view using "to" function 

            // Go to parent now -appCon object is obtained
            var oAppCon = this.getView().getParent();
            // Using the parent we go to child = navigate to another child
            oAppCon.to("idView1");
        },

        onSave: function(){
            MessageBox.confirm("Do you want to save?",{
                title: "Confirm Save",
                onClose: function(status){
                    if (status === "OK"){
                        MeassageToast.show("Your order has been placed successfully!");
                    }else{
                        MessageBox.alert("Cound not save!");
                    }
                }
            });
        },

        onDisplSelect: function(){
            var oDD = this.getView().byId("mcb");
            var aItems = oDD.getSelectedItems();
            for (let i = 0; i < aItems.length; i++) {
                const element = aItems[i];
                console.log(element.getKey());
            }
        },

        // Global Varial for supplier popup
        oSupplierPopup: null,
        oCityPopup: null,
        oField:null,

        onFilter:function(){
            //Local variable to work for global varial "this"
            var that = this;

            if(!this.oSupplierPopup){
                Fragment.load({
                    id:"supplier",
                    controller: this,
                    name:"tss.mm.ord.fragments.popup"
    
                }).then(function(oDialog){
                    // Inside the callbacks/promise we will not be able to access the global variable "this"
                    // oSupplierPopup is kind of remote control of our fragment
                    that.oSupplierPopup = oDialog;

                    that.oSupplierPopup.setTitle("Supplier Details");
                    // Authorize the access of fragment to the model using view
                    that.getView().addDependent(oDialog);

                    // Binding the items to the supplier entity of local JSON model using 4th syntax.
                    // Checked the ManagedObject class in control heirarachy for the method
                    that.oSupplierPopup.bindAggregation("items",{
                        path:"/suppliers",
                        template: new sap.m.DisplayListItem({
                            label:"{name}",
                            value: "{city}"
                        })


                    });
                    //Open the Popup
                    that.oSupplierPopup.open();
                });
            }else{
                this.oSupplierPopup.open();
            }
           
            // MeassageToast.show("This functionality is under construction!");
        },

        onF4Help:function(oEvent){
            var that = this;
            this.oField = oEvent.getSource()

            if (!this.oCityPopup){
                Fragment.load({
                    id:"city",
                    controller: this,
                    name:"tss.mm.ord.fragments.popup"
                }).then(function(oDialog){
                    that.oCityPopup = oDialog;
                    that.getView().addDependent(that.oCityPopup);
                    that.oCityPopup.setTitle("Cities");
                    that.oCityPopup.setMultiSelect(false);
                    that.oCityPopup.bindAggregation("items",{
                        path:'/cities',
                        template: new sap.m.DisplayListItem({
                            label: "{name}",
                            value: "{famousFor}"
                        })

                       
                    });
                    that.oCityPopup.open();
                })
                   
                
            }else{
                this.oCityPopup.open();
            }


            // MeassageToast.show("This functionality of onF4Help is under construction!");
        },

        onItemSelect:function(oEvent){
            // Get ID
            var sId = oEvent.getSource().getId();
            if (sId.indexOf("city") !== -1){
                // Step1 Get the object of selected item by user
            var oSelItem = oEvent.getParameter("selectedItem");
            // Step2 Get the value from that item
            var sText = oSelItem.getLabel();
            //Step3 Change the value back
            this.oField.setValue(sText);
            }else{
                var aFilters = [];
                var aItems = oEvent.getParameter("selectedItems");
                for (let i = 0; i < aItems.length; i++) {
                    const element = aItems[i];

                    var oFilter = new Filter("name",FilterOperator.EQ, element.getLabel());
                    aFilters.push(oFilter);
                    
                }
                var oFilterFinal = new Filter({
                    filters: aFilters,
                    and:false
                });
                this.getView().byId("idTab").getBinding("items").filter(oFilterFinal);
            }

            
        },

        onCancel: function(){

        }
       
    });
});