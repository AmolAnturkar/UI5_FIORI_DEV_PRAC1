sap.ui.define([
    'tss/mm/ord/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'


   
], function(BaseController, Filter, FilterOperator) {
    'use strict';
    return BaseController.extend("tss.mm.ord.controller.View1",{
        // This is our App controller   

        onInit: function(){
            //Get the object of Component.js and from ther get the object of Router
            this.oRouter = this.getOwnerComponent().getRouter();

            // Now we can use router object to Navigate , Check onNext funtion
        },

        onNext: function(sIndex){
            // View to View there is no direct access to navigate
            // In-order to achieve that, we need to create object of parent container of views is "appCon" using getParent(), which is parent of all views
            // and then navigate to other view using "to" function 

            // Go to parent now -appCon object is obtained
                //var oAppCon = this.getView().getParent();
            // Using the parent we go to child = navigate to another child
                //oAppCon.to("idView2");
            
             // Now we can use router object to Navigate 
             this.oRouter.navTo("detail",{
                 fruitId: sIndex
             });

        },

        onSearch:function(oEvent){
            // Step1 1Get the value which is user typed in search field
            var sVal = oEvent.getParameter("query");

            // Step2 Create filter object
            // var oFilter1 = new Filter("name", FilterOperator.Contains, sVal);
            var oFilter1 = new Filter("CATEGORY", FilterOperator.Contains, sVal);
            var oFilter2 = new Filter("type", FilterOperator.Contains, sVal);

            var oFilter = new Filter({
                filters: [oFilter1, oFilter2]
            });
                
            

            // Step3 Use the filter object and inject to the list binding
            var oList = this.getView().byId("idList");
            // oList.getBinding("items").filter(oFilter);  //Filter1 and Filter2 example
            oList.getBinding("items").filter(oFilter1);  //Only one filter

        },

        onDelete: function(){
            // TODO delete of all selected items
            // Step1: Get all the items selected by user
            var oList = this.getView().byId("idList");
            var aItems = oList.getSelectedItems();

            //Step2: Loop over them, access each one by one
            for (let i = 0; i < aItems.length; i++) {
                const element = aItems[i];
                // Step 3: Get the list object and delete them

                oList.removeItem(element);
            }

            
        },

        onItemSelect:function(oEvent){
            // Step1: Item on whcih user does selected
            var oListItem = oEvent.getParameter("listItem");
            
            // Step2: Get the path of this item
            var sPath = oListItem.getBindingContextPath();

            //Step3:Get the View2 object 
            // var oView2 = this.getView().getParent().getPages()[1]; // To obtain App Container

            // Obtain SPLIT APP container object View -> Master Section -> Split App
                //var oAppCon = this.getView().getParent().getParent();
            //Get child object which is inside the detail section
                //var oView2 = oAppCon.getDetailPage("idView2");


            // Step4: Bind path to View2 object
                // oView2.bindElement(sPath);
                // console.log(sPath);

            // Navigate to View2
            var sIndex = sPath.split("/")[sPath.split("/").length-1]; 
            this.onNext(sIndex);

        },

        onItemDelete: function(oEvent){
            // Step1 Get the item on which delete event was fired
            var oItemToBeDeleted = oEvent.getParameter("listItem");

            // Step2 Get the list control object
            // var oList = this.getView().byId("idList");  // We can use as id dependent but if control belongs to same event then we can get object without id. As below
            var oList = oEvent.getSource();

            
            // Step3 Delete the item
            oList.removeItem(oItemToBeDeleted);


        },

        onAdd: function(){
            this.oRouter.navTo("add");
        }


    });
});