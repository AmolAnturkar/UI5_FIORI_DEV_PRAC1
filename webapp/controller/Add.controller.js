sap.ui.define([
    'tss/mm/ord/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment'
   
], function(BaseController,JSONModel,MessageBox,MessageToast,Fragment) {
    'use strict';
    return BaseController.extend("tss.mm.ord.controller.Add",{
        // This is our App controller   

        onInit: function(){
            var oModel = new JSONModel;
            oModel.setData({
                "productData": {
                    "PRODUCT_ID": "",
                    "TYPE_CODE": "PR",
                    "CATEGORY": "Notebooks",
                    "NAME": "",
                    "DESCRIPTION": "",
                    "SUPPLIER_ID": "0100000046",
                    "SUPPLIER_NAME": "SAP",
                    "TAX_TARIF_CODE": "1 ",
                    "MEASURE_UNIT": "EA",
                    "PRICE": "0.00",
                    "CURRENCY_CODE": "USD",
                    "DIM_UNIT": "CM"
                },
                "SUPPLIER_NAME": ""
            });
            
            //create above model as local model and create varial as global to reuse it again in required location.
            this.getView().setModel(oModel,"local");
            this.oLocalModel = oModel;

        },

        onSave: function(){
            // Get the payload from local model
            var payload = this.oLocalModel.getProperty("/productData");
            // Validate the data*
            if(payload.PRODUCT_ID==="" || payload.NAME === "")
            {
                MessageBox.error("Input Validation faile!");
                return;
            }
            // Get the access of ODataModel (Which is defualt model @ app level)
            var oDataModel = this.getView().getModel();
            // Fire the OData create (Post) request on ProductSet with our payload
            if(this.mode === "create"){
                oDataModel.create("/ProductSet",payload,{
                    success: function(){
                        MessageToast.show("Clicked on Save");
                    
                    },
                    error: function(oError){
                        MessageToast.show(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    }
                });

            }else{
                // Here we need to write code for Update by its key
                // Step1: Read the payload which need to be updated
                var payload = this.oLocalModel.getProperty("/productData");
                var {PRODUCT_ID} = payload;

                // Step2: Prepare path for single entity which needs to be updated
                var sPath = "/ProductSet('" + PRODUCT_ID + "')";
                // Step3: Make a request to backend for update
                oDataModel.update(sPath,payload,{
                    success: function(){
                        // Step4: Handle the response
                        MessageToast.show("We have updated the product");
                    },
                    error: function(){
                        // Step4: Handle the response
                        MessageToast.show(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    }
                })
                
                

            }


          
            // Handle the response using callbacks

        },

        onClear: function(){
            // reset the data in the local model since its two way binding
            // The data will be cleared on UI as well
            this.oLocalModel.setProperty("/productData",{
                "PRODUCT_ID": "",
                "TYPE_CODE": "PR",
                "CATEGORY": "Notebooks",
                "NAME": "",
                "DESCRIPTION": "",
                "SUPPLIER_ID": "0100000046",
                "SUPPLIER_NAME": "SAP",
                "TAX_TARIF_CODE": "1 ",
                "MEASURE_UNIT": "EA",
                "PRICE": "0.00",
                "CURRENCY_CODE": "USD",
                "DIM_UNIT": "CM"
            });
            this.setMode("create");
        },

        oField: null,
        oSupplierPopUp:null,

       
        onF4Supplier: function(oEvent){
            // Take the snapshot of the object of the field on which F4 was pressed
            this.oField = oEvent.getSource();
            // Create local varial so we can use "this" variable inside callback
            var that = this;
            // Check our global object to avoid piling up all popups
            if(!this.oSupplierPopUp){
                Fragment.load({
                    name: 'tss.mm.ord.fragments.popup',
                    type: 'XML',
                    controller: this
                }).then(function(oDialog){
                    // Callback/promise for having popup
                    that.oSupplierPopUp = oDialog;
                    that.oSupplierPopUp.setTitle("Select Supplier");
                    that.oSupplierPopUp.setMultiSelect(false);
                    
                    that.getView().addDependent(that.oSupplierPopUp);
                    that.oSupplierPopUp.bindAggregation("items",{
                        path: '/SupplierSet',
                        template: new sap.m.DisplayListItem({
                            label: '{BP_ID}',
                            value: '{COMPANY_NAME}'
                        })
                    });
                    that.oSupplierPopUp.open();
                });
            }else{
                this.oSupplierPopUp.open();
            }


            // MessageToast.show("This Function is under consutruction!");
        } ,

        onItemSelect: function(oEvent){
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var sId = oSelectedItem.getLabel();
            var sSupplierName = oSelectedItem.getValue();
            this.oField.setValue(sId);
            this.oLocalModel.setProperty("/SUPPLIER_NAME",sSupplierName);

        },

        onSubmit:function(oEvent){
            // Step 1: What is the value given by user on input field
            var sValue = oEvent.getParameter("value");
            // Step 2: Get OData model object
            var oDataModel = this.getView().getModel();
            // Step 3: Prepare endpoints
            var sPath = "/ProductSet('"+ sValue.toUpperCase() +"')";
            // Step 4: Make the GET call - to read single product data - ex /ProductSet('PR-1002')
            var that = this;
            oDataModel.read(sPath,{
                success: function(data){
                     // Step 5: Handle response - SUCESS
                    that.oLocalModel.setProperty("/productData", data)
                    that.setMode("update");
                },
                error: function(oError){
                     // Step 5: Handle response - ERROR
                     MessageToast.show(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                     that.setMode("create");
                     that.onClear();
                }
            })
           
        },
        
        mode:'create',
        setMode: function(sMode){
            this.mode = sMode;
            if(this.mode === 'create'){
                this.getView().byId("idSave").setText("Save");
                this.getView().byId("id").setEnabled(true);
                this.getView().byId("idDelete").setEnabled(false);
            }else{
                this.getView().byId("idSave").setText("Update");
                this.getView().byId("id").setEnabled(false);
                this.getView().byId("idDelete").setEnabled(true);
            }
        },

        onLoadExp:function(){
            // Step 1: Read the product category from drop down
            var sCategory = this.oLocalModel.getProperty("/productData/CATEGORY")
            // Step 2: Get the OData model objec
            var oDataModel = this.getView().getModel();
            // Bonus: Show a loading indicator in view
            this.getView().setBusy(true);


            // Step 3: Call the Function Import - callFunction API in model
           var that = this;
            oDataModel.callFunction("/GetMostExpensiveProduct",{
                urlParameters:{
                    I_CATEGORY: sCategory
                },
                success: function(data){
                    // Step 4: Handle the response
                    that.oLocalModel.setProperty("/productData",data)
                    that.setMode("update");
                    that.getView().setBusy(false);
                },
                error: function(oError){
                    MessageBox.show("An Error Occured!")
                }

            })
            
        },

        onDelete: function(){
            // Step 1: Ask confirmation
            MessageBox.confirm("Do you want to delete this product?",{
                // onClose: function(stats){
                //     if(stats==="OK"){
                //         // If confirmed, call delete function
                //     }
                // }

                onClose: this.onConfirmDelete.bind(this)
            });
        },
        onConfirmDelete: function(stats){
            //Here you cannot get "this" pointer, in-order to allow access of "this" pointer
            // as a controller object the caller has to pass it via  
            // special syntax bind(this)

            if(stats==="OK"){
                // Step 1: Get OData model object
                var oDataModel = this.getView().getModel();
                // Step 2: Fire Delete request for the Product ID
                var {PRODUCT_ID} = this.oLocalModel.getProperty("/productData");
                var sPath = "/ProductSet('" + PRODUCT_ID + "')"

                // Step 3: Trigger Delete Request
                var that = this;
                oDataModel.remove(sPath,{
                    success: function(){
                        MessageToast.show("Deleted has been done!");
                        that.onClear();
                    }
                });

                // If confirmed, call delete functions
                //MessageBox.show("Delete has been done!");
                this.onClear();


            }
        }









    });

});