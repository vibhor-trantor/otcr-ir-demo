"use strict";var otcWebApp=angular.module("otcWebApp",["toaster","ngAnimate","ngResource","ngRoute","ngSanitize","ngTouch","ui.router","ui.bootstrap","LocalStorageModule","angucomplete-alt","ui.grid","ui.grid.exporter","ui.grid.pagination"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$qProvider",function(a,b,c,d){d.errorOnUnhandledRejections(!1),c.html5Mode(!1).hashPrefix("!"),b.otherwise("/preAllocation"),a.state("preAllocation",{url:"/preAllocation",views:{"":{controller:"preAllocationCtrl",templateUrl:"views/preAllocation/preAllocation.html"},sidebar:{templateUrl:"views/sidebar.html"},header:{templateUrl:"views/header.html"}}}).state("404",{url:"/404",templateUrl:"404.html"})}]);angular.module("arpWebApp").constant("UIGridCellTemplates",{dateCell:{template:'<div class="ui-grid-cell-contents">{{grid.getCellValue(row, col) | date:"LLLL dd, yyyy"}}</div>',width:120},errorDescription:{template:'<div class="grid-tooltip" uib-tooltip="{{ row.entity.errorDescription }}" tooltip-append-to-body="true"><div class="ui-grid-cell-contents">{{ COL_FIELD }}</div></div>'}});var API=function(a,b){this.httpService=a,this.apiUrlPrefix=b.apiEndpoint+"/api/v1"};API.$inject=["$http","ENV"],API.prototype.getPending=function(){return this.httpService.get(this.apiUrlPrefix+"/orders/pending")};var _sanitizeFilter=function(a){return a=_.omitBy(a,function(a){return"undefined"==typeof a||null===a||""===a}),a=_.mapValues(a,function(a){return _.isDate(a)?moment(a).format("L"):a})};API.prototype.getHistory=function(a){return a=a?_sanitizeFilter(a):{},this.httpService.get(this.apiUrlPrefix+"/orders/history",{params:a})},API.prototype.rejectOrders=function(a){return this.httpService.patch(this.apiUrlPrefix+"/orders",a.map(function(a){return{id:a.id,arpOrderStatus:"REJECTED"}}))},API.prototype.doLogin=function(a,b){return this.httpService.post(this.apiUrlPrefix+"/session",{username:a,password:b})},API.prototype.doLogout=function(){return this.httpService["delete"](this.apiUrlPrefix+"/session")},angular.module("arpWebApp").service("api",API),angular.module("arpWebApp").service("AuthIntercepter",["$q","$injector","localStorageService",function(a,b,c){var d=this;d.responseError=function(d){return 401===d.status&&(c.remove("session"),b.get("$state").transitionTo("login")),a.reject(d)}}]).config(["$httpProvider",function(a){a.interceptors.push("AuthIntercepter")}]),angular.module("arpWebApp").constant("OrderAttributes",[{label:"ISBN",id:"isbn",dataType:"string",scope:["pending","history"]},{label:"Title",id:"bookTitle",dataType:"string",scope:["pending","history"]},{label:"Publisher",id:"publisher",dataType:"string",scope:["pending","history"]},{label:"Format",id:"format",dataType:"string",scope:["pending","history"]},{label:"Planner Segment",id:"plannerSegment",dataType:"string",scope:["pending","history"]},{label:"PO Create Date",id:"plannedPOCreationDate",dataType:"date",scope:["pending","history"]},{label:"WHSE Due Date",id:"projectedInWarehouseDate",dataType:"date",scope:["pending","history"]},{label:"Out of Stock Date",id:"outOfStockDate",dataType:"date",scope:["pending","history"]},{label:"Carton Qty",id:"cartonQuantity",dataType:"number",scope:["pending","history"]},{label:"Recommended Qty",id:"recommendedQuantity",dataType:"number",scope:["pending","history"]},{label:"Lot Size",id:"lotSize",dataType:"number",scope:["pending","history"]},{label:"Print Qty",id:"printQuantity",dataType:"number",scope:["pending","history"]},{label:"Print Carton Count",id:"printCartonQuantity",dataType:"number",scope:["pending","history"]},{label:"PO No.",id:"purchaseOrderNumber",dataType:"string",scope:["history"]},{label:"Status",id:"arpOrderStatus",dataType:"string",scope:["history"]},{label:"Submit Date",id:"poEDITransmissionDate",dataType:"date",scope:["history"]}]);var RoleType=function(a){this.RW=a.roleTypes.RW,this.RO=a.roleTypes.RO};RoleType.$inject=["ENV"],angular.module("arpWebApp").service("RoleType",RoleType),angular.module("arpWebApp").controller("DashboardPendingCtrl",["$scope","api","$uibModal","$rootScope","$state","userRole","RoleType",function(a,b,c,d,e,f,g){f||e.transitionTo("login");var h="PENDING",i=this,j=function(a){return _.find(a,function(a){return a.arpOrderStatus===h})?!0:!1};i.initRejection=function(a){c.open({templateUrl:"views/dashboard/rejection-warning.html",controller:"OrderRejectionCtrl",controllerAs:"$ctrl",resolve:{selectedOrders:function(){return a}}})};var k=function(){a.data=null,a.enableOrderRejectionFeature=!1,b.getPending().then(function(b){var c=b.data;a.poDetails={},c.length>0?(i.hasOrders=!0,a.poDetails.purchaseOrderNumber=c[0].purchaseOrderNumber,a.poDetails.scheduledPOSubmissionDate=c[0].scheduledPOSubmissionDate):i.hasOrders=!1,a.data=b.data,a.hasPendingOrders=j(a.data),a.enableOrderRejectionFeature=f===g.RW&&a.hasPendingOrders},function(){})};d.$on("orders-updated",k),k()}]);var preallocationFilters=function(a,b){this.httpService=a,this.apiUrlPrefix=b.apiEndpoint+"/api/v1"};preallocationFilters.$inject=["$http","ENV"],preallocationFilters.prototype.getOwners=function(){return otc.owners},preallocationFilters.prototype.getItems=function(){return otc.books},preallocationFilters.prototype.getForm=function(){return otc.form},preallocationFilters.prototype.getData=function(){return otc.data},preallocationFilters.prototype.getBillTo=function(){return otc.billTo},preallocationFilters.prototype.getRG=function(a){var b=[],c=0;for(c=0;c<otc.rg.length;c++)otc.rg[c].owner===a&&b.push(otc.rg[c]);return b},preallocationFilters.prototype.getCat1=function(a){var b=[],c=0;for(c=0;c<otc.cat1.length;c++)otc.cat1[c].rg===a&&b.push(otc.cat1[c]);return b},preallocationFilters.prototype.getCat2=function(a){var b=[],c=0;for(c=0;c<otc.cat2.length;c++)otc.cat2[c].cat1===a&&b.push(otc.cat2[c]);return b},preallocationFilters.prototype.getSubForm=function(a){var b=[],c=0;for(c=0;c<otc.subForm.length;c++)otc.subForm[c].form===a&&b.push(otc.subForm[c]);return b},angular.module("otcWebApp").service("preallocationFilters",preallocationFilters),angular.module("otcWebApp").controller("preAllocationCtrl",["$scope","preallocationFilters","toaster",function(a,b,c){a.otc={},a.searchType="family",a.ft={},a.today=new Date,a.format="MMMM-dd-yyyy",a.popup={},a.dateOptions={minDate:new Date},a.active=!0,a.changeData=function(){a.gridOptionsFT.data=_.filter(a.getData(),{inactive:!a.active})},a.compDate=function(b){var c=new Date(b);return a.today>c};var d=function(a,b){return b?'<div ng-class="{\'expiredData\': grid.appScope.compDate(row.entity.expDate)}" class="ui-grid-cell-contents" title="TOOLTIP">{{row.entity.'+a+"}}</p></div>":"exp"==a?'<div ng-class="{\'expiredData\': grid.appScope.compDate(row.entity.expDate)}" class="ui-grid-cell-contents" title="TOOLTIP">{{row.entity.expDate | date : "shortDate"}}</p></div>':'<div ng-class="{\'expiredData\': grid.appScope.compDate(row.entity.expDate)}" class="ui-grid-cell-contents" title="TOOLTIP">{{row.entity.'+a+".title}}<p>{{row.entity."+a+".code}}</p></div>"},e=function(a){return'<div ng-class="{\'expiredData\': grid.appScope.compDate(row.entity.expDate)}" class="ui-grid-cell-contents" title="TOOLTIP">{{row.entity.'+a+'?"Yes":"No"}}</div>'};a.getData=function(){return b.getData()},a.clearData=function(){a.ft={},a.selectedItem=null,a.$broadcast("angucomplete-alt:clearInput"),a.searchType="family",a.selectedItem=null,a.newRec={}},a.goToStep2=function(){},a.init=function(){a.getOwners(),a.getItems(),a.getForm(),a.getBillTo()},a.gridOptionsFT={enableSorting:!0,enablePaginationControls:!0,columnDefs:[{name:"Owner",field:"owner.title",cellTemplate:d("owner")},{name:"Reporting Group",field:"rg.title",cellTemplate:d("rg")},{name:"Category 1",field:"cat1.title",cellTemplate:d("cat1")},{name:"Category 2",field:"cat2.title",cellTemplate:d("cat2"),visible:!1},{name:"Format",field:"form.title",cellTemplate:d("form")},{name:"Sub-format",field:"subForm.title",cellTemplate:d("subForm"),visible:!1},{name:"Item Code",field:"item.code",cellTemplate:d("item")},{name:"Bill To",field:"billTo.title",cellTemplate:d("billTo")},{name:"Expiration Date",field:"expDate",cellTemplate:d("exp")},{name:"Default Preallocated Quantity",field:"defaultQty",cellTemplate:d("defaultQty",!0)},{name:"Usable minimum",field:"usableMin",cellTemplate:d("usableMin",!0)},{name:"% If Falls Below",field:"percentFallsBelow",cellTemplate:d("percentFallsBelow",!0)},{name:"Pre-release",field:"pr",cellTemplate:e("pr"),visible:!1},{name:"Override NYP",field:"nyp",cellTemplate:e("nyp")}],data:_.filter(a.getData(),{inactive:!a.active}),enableGridMenu:!0,enableFiltering:!0,paginationPageSizes:[25,50,75,100],paginationPageSize:25,exporterCsvFilename:"myFile.csv",onRegisterApi:function(b){a.gridApi=b}},a.getOwners=function(){a.otc.owners=b.getOwners()},a.getItems=function(){a.otc.items=b.getItems()},a.getBillTo=function(){a.otc.billTo=b.getBillTo()},a.getRG=function(c){a.ft.owner=c,a.ft.owner&&a.ft.owner.hasOwnProperty("originalObject")&&(a.otc.rg=b.getRG(a.ft.owner.originalObject.code))},a.getCat1=function(c){a.ft.rg=c,a.ft.rg&&a.ft.rg.hasOwnProperty("originalObject")&&(a.otc.cat1=b.getCat1(a.ft.rg.originalObject.code))},a.getCat2=function(c){a.ft.cat1=c,a.ft.cat1&&a.ft.cat1.hasOwnProperty("originalObject")&&(a.otc.cat2=b.getCat2(a.ft.cat1.originalObject.code))},a.getForm=function(){a.otc.form=b.getForm()},a.getSubForm=function(c){a.ft.form=c,a.ft.form&&a.ft.form.hasOwnProperty("originalObject")&&(a.otc.subForm=b.getSubForm(a.ft.form.originalObject.code))},a.setItem=function(b){a.selectedItem=b&&b.originalObject?b.originalObject:null},a.saveData=function(){var b=a.newRec;console.log(b),"family"==a.searchType?(b.type=1,b.owner=a.ft.owner.originalObject,b.rg=a.ft.rg.originalObject,b.cat1=a.ft.cat1.originalObject,b.cat2=a.ft.cat2.originalObject,b.form=a.ft.form.originalObject,b.subForm=a.ft.subForm.originalObject):"item"==a.searchType&&(b.type=2,b.item=a.selectedItem),a.gridOptionsFT.data.unshift(b),$("#step2").modal("hide"),a.clearData(),c.success({title:"Success",body:"Pre-allocation criteria added successfully."})},a.init()}]),angular.module("arpWebApp").controller("DashboardHistoryCtrl",["$scope","api",function(a,b){a.fetchLatestData=function(){b.getHistory(a.searchFilter).then(function(b){a.data=b.data},function(){})},a.fetchLatestData(),a.clearFilters=function(){c(),a.fetchLatestData()};var c=function(){a.searchFilter={isbn:null,plannerSegment:null,purchaseOrderNumber:null,searchDateType:null,searchDateFrom:null,searchDateTo:null}}}]),angular.module("arpWebApp").controller("OrderRejectionCtrl",["$uibModalInstance","selectedOrders","api","$rootScope",function(a,b,c,d){var e=this;e.selectedOrders=b,e.cancel=function(){a.dismiss("cancel")},e.rejectOrders=function(a){g(),c.rejectOrders(a).then(i,h)};var f=function(){e.rejectionProcessOutputMessage={description:"",success:!1,selectedISBNs:[]}},g=function(){f()},h=function(){e.rejectionProcessOutputMessage.description="There was a problem while rejecting the selected orders. Please try again in a while and contact your administrator if the problem persists.",e.rejectionProcessOutputMessage.success=!1},i=function(){e.rejectionProcessOutputMessage.description="The following title(s) will be removed from your order. Please update your forecast in Demantra.",e.rejectionProcessOutputMessage.success=!0,e.rejectionProcessOutputMessage.selectedISBNs=_.map(e.selectedOrders,"isbn"),e.selectedOrders=[],d.$emit("orders-updated")}}]),angular.module("arpWebApp").directive("orderDataGrid",["OrderAttributes","UIGridCellTemplates",function(a,b){return{template:'<div ng-if="enableOrderRejectionFeature" ui-grid="gridOptions" ui-grid-selection class="grid" ui-grid-resize-columns></div> <div ng-if="!enableOrderRejectionFeature" ui-grid="gridOptions" class="grid" ui-grid-resize-columns></div>',restrict:"E",scope:{data:"=",enableOrderRejectionFeature:"=",selection:"="},link:function(c,d,e){var f="PENDING";c.data=c.data||[],c.gridOptions={multiSelect:!0,enableSelectAll:!0,enableSorting:!0,enableFiltering:!0,enableColumnResizing:!0,columnDefs:[],isRowSelectable:function(a){return a.entity.arpOrderStatus===f},onRegisterApi:function(a){console.log("onRegisterApi : in right place 1........................."),c.selection=a.selection}};var g=_.filter(a,function(a){return console.log("filter: in right place 1........................."),_.indexOf(a.scope,e.gridType)>=0});angular.forEach(g,function(a){var d={field:a.id,displayName:a.label,cellTooltip:!0,headerTooltip:!0,type:a.dataType};"date"===a.dataType&&(d.width=b.dateCell.width,d.cellTemplate=b.dateCell.template),"arpOrderStatus"===a.id&&(d.cellTemplate=b.errorDescription.template),c.gridOptions.columnDefs.push(d)}),c.$watch("data",function(){c.data&&(console.log("watch: in right place 1........................."),c.gridOptions.data=c.data)})}}}]),angular.module("otcWebApp").directive("numbersOnly",function(){return{require:"ngModel",link:function(a,b,c,d){function e(a){if(a){var b=a.replace(/[^0-9]/g,"");return c.customMaxLength>0&&(b=b.slice(0,parseInt(c.customMaxLength))),b!==a&&(d.$setViewValue(b),d.$render()),b}return void 0}d.$parsers.push(e)}}}),angular.module("arpWebApp").controller("LoginCtrl",["api","$state","localStorageService","RoleType",function(a,b,c,d){var e=this;e.doLogin=function(f,g){a.doLogin(f,g).then(function(a){var f=a.data;_.includes([d.RW,d.RO],f.userrole)?(c.set("session",f),b.transitionTo("dashboard.pending")):e.loginError="You do not have permission to access this application. Please contact the administrators."},function(a){e.loginError=a.data.message})}}]),angular.module("arpWebApp").controller("LogoutCtrl",["$state","api","localStorageService",function(a,b,c){b.doLogout().then(function(){c.remove("session"),a.transitionTo("login")})}]);var fixIECachingIssue=function(a){a.defaults.headers.get||(a.defaults.headers.get={}),a.defaults.headers.get["If-Modified-Since"]="Mon, 26 Jul 1997 05:00:00 GMT",a.defaults.headers.get["Cache-Control"]="no-cache",a.defaults.headers.get.Pragma="no-cache"};angular.module("otcWebApp").config(["$httpProvider",function(a){bowser.msie&&fixIECachingIssue(a)}]),angular.module("arpWebApp").run(["$templateCache",function(a){a.put("views/about.html",'<p>This is the about view.</p> <span ng-bind="about.vibhor"></span>'),a.put("views/dashboard/history.html",'<strong>Search order history for the last 90 days</strong> <form ng-submit="fetchLatestData()"> <div class="container"> <div class="row"> <div class="col-sm-5"> <div class="form-group row"> <label for="isbn" class="col-sm-2 col-form-label">ISBN</label> <div class="col-sm-10"> <input type="text" class="form-control form-control-sm" id="isbn" ng-model="searchFilter.isbn" pattern="^\\d{1,13}$" placeholder="ISBN"> </div> </div> <div class="form-group row"> <label for="planner-segment" class="col-sm-2 col-form-label">Planner Segment</label> <div class="col-sm-10"> <select ng-model="searchFilter.plannerSegment" class="form-control form-control-sm" id="planner-segment"> <option></option> <option value="S">S</option> <option value="T">T</option> </select> </div> </div> <div class="form-group row"> <label for="po-number" class="col-sm-2 col-form-label">PO No.</label> <div class="col-sm-10"> <input ng-model="searchFilter.purchaseOrderNumber" type="text" class="form-control form-control-sm" id="po-number" placeholder="PO Number"> </div> </div> </div> <div class="col-sm-7"> <div class="container-fluid"> <div class="row"> <div class="col-sm-4"> <select ng-model="searchFilter.searchDateType" class="form-control form-control-sm" id="date-type"> <option value="">Date</option> <option value="plannedPOCreationDate">PO Create Date</option> <option value="poEDITransmissionDate">Submit Date</option> <option value="projectedInWarehouseDate">WHSE Due Date</option> <option value="outOfStockDate">Out of Stock Date</option> </select> </div> <div class="col-sm-3"> <div class="input-group input-group-sm"> <input type="text" class="form-control" is-open="fromDateCalOpen" uib-datepicker-popup="MM/dd/yyyy" ng-model="searchFilter.searchDateFrom" placeholder="mm/dd/yyyy" pattern="^\\d{1,2}\\/\\d{1,2}\\/\\d{4}$" close-text="Close"> <span class="input-group-addon" ng-click="fromDateCalOpen = !fromDateCalOpen"> <i class="glyphicon glyphicon-calendar" aria-hidden="true"></i> </span> </div> </div> <div class="col-sm-1"> <label class="col-sm-2 col-form-label">To:</label> </div> <div class="col-sm-3"> <div class="input-group input-group-sm"> <input type="text" class="form-control form-control-sm" is-open="toDateCalOpen" uib-datepicker-popup="MM/dd/yyyy" ng-model="searchFilter.searchDateTo" placeholder="mm/dd/yyyy" pattern="^\\d{1,2}\\/\\d{1,2}\\/\\d{4}$" close-text="Close"> <span class="input-group-addon" ng-click="toDateCalOpen = !toDateCalOpen"> <i class="glyphicon glyphicon-calendar" aria-hidden="true"></i> </span> </div> </div> </div> </div> </div> </div> </div> <div> <button class="btn btn-primary">Search</button> <button class="btn btn-primary" ng-click="clearFilters()">Clear</button> </div> </form> <br> <order-data-grid data="data" grid-type="history"></order-data-grid>'),a.put("views/dashboard/pending.html",'<h4 ng-if="pending.hasOrders === false"> There are no orders in the queue. Select the Order History tab to see what has been submitted in the last 90 days. </h4> <table class="po-header" ng-if="pending.hasOrders === true"> <tbody> <tr> <td>PO No.:</td> <td ng-bind="hasPendingOrders ? poDetails.purchaseOrderNumber : \'In Progress\'" class="value"></td> </tr> <tr> <td>For Submission On:</td> <td class="value">{{poDetails.scheduledPOSubmissionDate | date:\'LLLL dd, yyyy\'}}</td> </tr> </tbody> </table> <order-data-grid data="data" selection="selection" enable-order-rejection-feature="enableOrderRejectionFeature" grid-type="pending"></order-data-grid> <div class="pull-right text-right"> <button ng-if="enableOrderRejectionFeature" title="You must select some orders in order to reject them" ng-disabled="selection.getSelectedCount() === 0" class="btn btn-primary" id="reject-orders-button" ng-click="pending.initRejection(selection.getSelectedRows())">Reject Selected Orders </button> </div>'),a.put("views/dashboard/rejection-warning.html",'<div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="$ctrl.cancel()"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="modal-title"><i class="glyphicon glyphicon-alert"></i> Warning</h4> </div> <div class="modal-body" id="modal-body"> <h5 ng-if="!$ctrl.rejectionProcessOutputMessage.success">Clicking on Yes will Reject the selected ISBNs. Are you sure you want to proceed?</h5> <div ng-if="$ctrl.rejectionProcessOutputMessage.description" ng-class="{\'alert-success\': $ctrl.rejectionProcessOutputMessage.success, \'alert-danger\': !$ctrl.rejectionProcessOutputMessage.success}" class="alert alert-dismissible" role="alert" ng-if="$ctrl.rejectionProcessOutputMessage.description"> {{$ctrl.rejectionProcessOutputMessage.description}} <ul> <li ng-repeat="isbn in $ctrl.rejectionProcessOutputMessage.selectedISBNs track by $index"> {{isbn}} </li> </ul> </div> </div> <div class="modal-footer" ng-if="!$ctrl.rejectionProcessOutputMessage.success"> <button class="btn btn-warning" type="button" ng-click="$ctrl.rejectOrders($ctrl.selectedOrders)">Yes</button> <button class="btn btn-success" type="button" ng-click="$ctrl.cancel()">Cancel</button> </div>'),a.put("views/header.html",'<div style="position:relative"> <nav class="navbar navbar-inverse navbar-fixed-top"> <div class="container-fluid"> <div class="navbar-header"> <a class="logo" href="javascript:void(0)"><img src="images/Hachette-Book-Group-logo.80568db1.png"></a> </div> <div id="navbar" class="navbar-collapse collapse"> <ul class="nav navbar-nav navbar-right"> <li><a href="#">Settings</a></li> <li><a href="#">Profile</a></li> <li><a href="#">Help</a></li> </ul> </div> </div> </nav> </div>'),a.put("views/login.html",'<div class="container"> <div class="row"> <div class="col-sm-6 col-md-4 col-md-offset-4"> <h1 class="text-center login-title">Login to HBG Autoreplenish System</h1> <div class="account-wall"> <img class="profile-img" ng-src="images/user.fbec7e75.png" alt=""> <form class="form-signin" ng-submit="$ctrl.doLogin(username, password)"> <input ng-model="username" type="text" class="form-control" placeholder="Username" required autofocus> <input ng-model="password" type="password" class="form-control" placeholder="Password" required> <button class="btn btn-lg btn-primary btn-block" type="submit"> Sign in </button> <br> <div class="alert alert-danger" role="alert" ng-if="$ctrl.loginError" ng-bind="$ctrl.loginError"></div> </form> </div> </div> </div> </div>'),a.put("views/preAllocation/preAllocation.html",'<div> <div> <h1>Pre-allocation criteria</h1> <div class="input-group col-md-6" style="float:left"> <span class="input-group-btn" ng-init="currDetails.status = 1"> <label>Pre-allocation record status : </label> <button class="btn btn-default" ng-class="{\'btn-success\': active ==true}" ng-click="active=true;changeData()"> Active </button> <button class="btn btn-default" ng-class="{\'btn-warning\': active == false}" ng-click="active=false;changeData()"> In-active </button> </span> </div> <button class="btn btn-success pull-right" data-toggle="modal" data-target="#step1"><i class="glyphicon glyphicon-plus"></i> Add</button> </div> <div class="clearfix"></div> <div class="row margin-top-20"> <div id="grid1" ui-grid="gridOptionsFT" ui-grid-exporter ui-grid-pagination class="grid"></div> </div> </div> <!-- Modal --> <div id="step1" class="modal fade" role="dialog"> <div class="modal-dialog modal-lg"> <!-- Modal content--> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">Create Pre-allocation Criteria</h4> </div> <form class="inner-form" name="addForm"> <div class="modal-body"> <div class="row" style="padding-left: 20px;margin-bottom: 30px"> <div class="form-group"> <span>Select selection criteria </span> <label> <input name="type" placeholder="Email" type="radio" group="a" value="family" ng-model="searchType"> Family tree </label> <label> <input name="type" placeholder="Email" type="radio" group="a" value="item" ng-model="searchType"> Item </label> </div> <div ng-if="searchType == \'family\'"> <div class="col-md-4"> <label for="owner">Owner</label> <angucomplete-alt id="owner" placeholder="Search owners" pause="100" selected-object="getRG" match-class="highlight" local-data="otc.owners" search-fields="title,code" title-field="title" description-field="code" minlength="0" input-class="form-control" input-changed="getRG" field-required="true"> </div> <div class="col-md-4"> <label for="rg">Reporting Group</label> <angucomplete-alt id="rg" placeholder="Search Registeration Group" pause="100" selected-object="getCat1" local-data="otc.rg" search-fields="title,code" title-field="title" description-field="code" minlength="0" input-class="form-control" disable-input="!ft.owner"> </div> <div class="col-md-4"> <label for="cat1">Category 1</label> <angucomplete-alt id="cat1" placeholder="Search category 1" pause="100" selected-object="getCat2" local-data="otc.cat1" search-fields="title,code" title-field="title" description-field="code" minlength="0" input-class="form-control" disable-input="!ft.rg"> </div> <div class="col-md-4"> <label for="cat2">Category 2</label> <angucomplete-alt id="cat2" placeholder="Search category 2" pause="100" selected-object="ft.cat2" local-data="otc.cat2" search-fields="title,code" title-field="title" description-field="code" minlength="0" input-class="form-control" disable-input="!ft.cat1"> </div> <div class="col-md-4"> <label for="form">Format</label> <angucomplete-alt id="form" placeholder="Search format" pause="100" selected-object="getSubForm" local-data="otc.form" search-fields="title,code" title-field="title" description-field="code" minlength="0" input-class="form-control" disable-input="!ft.cat2"> </div> <div class="col-md-4"> <label for="subForm">Sub-format</label> <angucomplete-alt id="subForm" placeholder="Search sub format" pause="100" selected-object="ft.subForm" local-data="otc.subForm" search-fields="title,code" title-field="title" description-field="code" minlength="0" input-class="form-control" disable-input="!ft.form"> </div> </div> <div ng-if="searchType == \'item\'"> <div class="col-md-4"> <label for="owner">Item Code</label> <angucomplete-alt id="owner" placeholder="Search items" pause="100" selected-object="setItem" match-class="highlight" local-data="otc.items" search-fields="title,code" title-field="title" description-field="code" minlength="0" input-class="form-control" field-required="true"> </div> <div class="col-md-12" style="margin-top:20px"> <table class="table table-striped" ng-if="selectedItem"> <tr> <th> Item Code</th> <th>Title</th> <th>ISBN</th> <th>Short Title</th> </tr> <tr> <td>{{selectedItem.code}}</td> <td>{{selectedItem.title}}</td> <td>{{selectedItem.isbn}}</td> <td>{{selectedItem.shortTitle}}</td> </tr> </table> </div> </div> <div class="col-md-12 padding0"> <h4 class="margin-top-20">Billing Information</h4> <div class="col-md-4"> <label for="billTo">Bill To</label> <angucomplete-alt name="billTo" id="billTo" placeholder="Search billing acount" pause="100" selected-object="newRec.billTo" match-class="highlight" local-data="otc.billTo" search-fields="title,code" title-field="title" description-field="code" minlength="0" input-class="form-control" field-required="true"> </div> <div class="clearfix"></div> <h4 class="margin-top-20">Pre-allocation Quantity</h4> <div class="col-md-4"> <label for="defaultQty">Default Quantity</label> <input type="text" id="defaultQty" name="defQty" ng-model="newRec.defaultQty" class="form-control" numbers-only custom-max-length="10" required> </div> <div class="col-md-4"> <label for="usableMin">Usable minimum</label> <input name="usableMin" ng-model="newRec.usableMin" type="text" id="usableMin" class="form-control" numbers-only custom-max-length="10" required> </div> <div class="col-md-4"> <label for="percentFallsBelow">% If falls below*</label> <input name="percentFallsBelow" ng-model="newRec.percentFallsBelow" type="text" id="percentFallsBelow" class="form-control" numbers-only custom-max-length="10" required> </div> <div class="col-md-4"> <label for="expDate">Expiration Date*</label> <p class="input-group"> <input name="expDate" id="expDate" type="text" class="form-control" uib-datepicker-popup="{{format}}" ng-model="newRec.expDate" is-open="popup.open" datepicker-options="dateOptions" ng-required="true" close-text="Close" alt-input-formats="altInputFormats" required> <span class="input-group-btn"> <button type="button" class="btn btn-default" ng-click="popup.open = !popup.open"><i class="glyphicon glyphicon-calendar"></i></button> </span> </p> </div> <div class="col-md-12"> <div class="col-md-4"> <label for="pr">Pre-release </label> <input type="checkbox" id="pr" ng-model="newRec.pr"> </div> <div class="col-md-4"> <label for="nyp">Override NYP </label> <input type="checkbox" id="nyp" ng-model="newRec.nyp"> </div> </div> <div class="clearfix"></div> <!--</form>--> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-danger" data-dismiss="modal" ng-click="clearData()">Close</button> <button ng-disabled="addForm.$invalid" type="button" ng-disabled="step2.$invalid" class="btn btn-success" data-dismiss="modal" ng-click="saveData()">Save</button> <button ng-disabled="addForm.$invalid" type="button" ng-disabled="step2.$invalid" class="btn btn-info" ng-click="saveData()">Save & add another</button> </div> </div></form> </div> </div> </div> <!-- Modal End--> <script type="text/ng-template" id="abc"><div class="angucomplete-row ng-scope angucomplete-selected-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseenter="hoverRow($index)" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}" style=""> \r\n  <div class="angucomplete-title ng-binding ng-scope" ng-if="matchClass" ng-bind-html="result.title"></div>\r\n  <div ng-if="matchClass &amp;&amp; result.description &amp;&amp; result.description != \'\'" class="angucomplete-description ng-binding ng-scope" ng-bind-html="result.description">\r\n  </div>\r\n</div></script>'),a.put("views/sidebar.html",'<nav class="navbar navbar-default sidebar sidebar-fixed" role="navigation"> <div class="container-fluid"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-sidebar-navbar-collapse-1"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> </div> <div class="collapse navbar-collapse" id="bs-sidebar-navbar-collapse-1"> <ul class="nav navbar-nav"> <li class="active"><a href="javascript:void(0)">Dashboard<span style="font-size:16px" class="pull-right hidden-xs showopacity glyphicon glyphicon-home"></span></a></li> <li class="dropdown"> <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">Inventory <span class="caret"></span><span style="font-size:16px" class="pull-right hidden-xs showopacity glyphicon glyphicon-user"></span></a> <ul class="dropdown-menu forAnimate" role="menu"> <li><a class="text180" href="javascript:void(0)">Maintain Pre-allocation Criteria</a></li> <li class="divider"></li> <li><a class="text180" href="javascript:void(0)">Reservations</a></li> </ul> </li> </ul> </div> </div> </nav>')}]);