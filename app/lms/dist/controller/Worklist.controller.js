sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","../model/formatter","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox","ui/lms/utils/ApplicationController","ui/lms/utils/FilterController","ui/lms/utils/TablesController","ui/lms/utils/DataManager","sap/m/TablePersoController"],function(e,t,o,n,i,r,a,s,l,d,u,c,p){"use strict";return e.extend("ui.lms.controller.Worklist",{formatter:n,onInit:function(){var e=this;this.applicationController=new l;this.dataManager=(new c).init();this.filterController=new d;this.tablesController=new u;this.oModel=e.getOwnerComponent().getModel();this.mode=this.applicationController.getApplicationMode();this.oResourceBundle=this.getResourceBundle();e.userInfo={};this.tablesController.init().then(function(){e.getUser().then(function(t){e.userInfo.user=t?t:"";e.afterRendering();e.init(e.mode)})})},getUser:function(){var e=this;return new Promise(function(e,t){$.getJSON("/user-api/currentUser",function(t){e(t.name)})})},init:function(e){var o=this;this.getView().setBusy(true);this.getOwnerComponent().getModel().metadataLoaded().then(function(){var n=$.Deferred();o.tablesController.initializeTables(o);$.when(o.dataManager.loadPopulations(o),o.dataManager.loadFilters(o,e)).done(function(n,i){o.getView().setModel(new t({items:o.applicationController.preparePopulationModel(n,o.oResourceBundle)}),"population");o.filterController.initialize(e,i,o);o.loadClocks(false);o.getView().setBusy(false)}).fail(function(){n.reject();o.getView().setBusy(false);o.displayMessage(o.getResourceBundle().getText("filterLoadFailed"))})})},displayMessage:function(e){var t=this;jQuery.sap.delayedCall(10,null,function(){s.show(e,{icon:s.Icon.ERROR,title:t.getResourceBundle().getText("messageErrorTitle"),actions:[s.Action.OK],onClose:function(e){}})})},onAfterRendering:function(e){var t=1},afterRendering:function(){var e=this;jQuery.sap.delayedCall(10,null,function(){var t=new sap.m.Button({text:e.oResourceBundle.getText("clear")});t.attachPress($.proxy(e.changePopulation,e));e.getView().byId("filterbar").getContent()[0].addContent(t)})},changePopulation:function(e){var t=this;jQuery.sap.delayedCall(10,t,$.proxy(function(){var e=t.getView().getModel("filterSelections").getData();t.mode=e.population;t.init(e.population)},t))},filter:function(e){var t=this;var o=e.getSource().data("ui");if(o&&o.length>0){jQuery.sap.delayedCall(10,t,$.proxy(function(){t.filterController.refresh(t,o)},t))}},onSearch:function(e){this.loadClocks(true);this.tablesController.refreshFilters(this)},selectTable:function(e){var t=this;var n=e.getParameter("item");var i=n.data("frag");var r=n.data("loaded");if(r===true||r==="true")return;var a="ui.lms.view.fragments.".concat(i);o.load({name:a,controller:t}).then(function(e){t.getView().addDependent(e);t.getView().byId("tab".concat(i)).addItem(e);t.tablesController.initializeTable(t,i);n.data("loaded",true)}.bind(t))},scroll:function(e){var t=e.getSource();if(t.getItems().length>100){$.each($(".sapMPage").children(),function(e,o){$(o).control()[0].scrollToElement($($("#"+t.getId()).find(".sapMGrowingListTrigger")[0]).control()[0])})}},loadClocks:function(e){var o=this;this.getView().setBusy(true);var n=o.filterController.getPopulationFilter(o.userInfo.user,o.mode);if(e){n=n.concat(o.filterController.getAllFilters(o))}$.when(o.dataManager.loadClockValues(o,n)).done(function(e){o.getView().setModel(new t(o.applicationController.prepareGraph(e,o.oResourceBundle)),"graphModel");o.getView().setBusy(false)}).fail(function(){o.getView().setBusy(false);o.displayMessage(o.getResourceBundle().getText("filterLoadFailed"))})},exportExcel:function(e){var t=this;this.getView().setBusy(true);var o=e.getSource().data("table");var n=t.filterController.getAllFilterValues(t);$.when(t.dataManager.downloadXls(t,o,n)).done(function(e){t.getView().setBusy(false);var o=new Blob([e.content]);var n=document.createElement("a");n.href=window.URL.createObjectURL(o);n.download=e.filename;n.click()}).fail(function(){t.getView().setBusy(false);sap.m.MessageToast.show("Download failed!")})},handleUserPopover:function(e){var n=e.getSource();var i=n.getBindingContext().getObject();var r=$.extend({},i);this.getView().setModel(new t({details:r}),"UserCard");if(!this._oUserPopover){o.load({name:"ui.lms.view.fragments.UserCard",controller:this}).then(function(e){this._oUserPopover=e;this.getView().addDependent(this._oUserPopover);this._oUserPopover.bindElement("UserCard>/details");this._oUserPopover.openBy(n)}.bind(this))}else{this._oUserPopover.bindElement("UserCard>/details");this._oUserPopover.openBy(n)}},handleItemCompetencyPopover:function(e){var n=e.getSource();var i=n.getBindingContext().getObject();var r=$.extend({},i);this.getView().setModel(new t({details:r}),"CompetencyCard");if(!this._oItemCompetencyPopover){o.load({name:"ui.lms.view.fragments.ItemCompetencyCard",controller:this}).then(function(e){this._oItemCompetencyPopover=e;this.getView().addDependent(this._oItemCompetencyPopover);this._oItemCompetencyPopover.bindElement("CompetencyCard>/details");this._oItemCompetencyPopover.openBy(n)}.bind(this))}else{this._oItemCompetencyPopover.bindElement("CompetencyCard>/details");this._oItemCompetencyPopover.openBy(n)}},handleCompetencyPopover:function(e){var n=e.getSource();var i=n.getBindingContext().getObject();var r=$.extend({},i);this.getView().setModel(new t({details:r}),"CompetencyCard");if(!this._oCompetencyPopover){o.load({name:"ui.lms.view.fragments.CompetencyCard",controller:this}).then(function(e){this._oCompetencyPopover=e;this.getView().addDependent(this._oCompetencyPopover);this._oCompetencyPopover.bindElement("CompetencyCard>/details");this._oCompetencyPopover.openBy(n)}.bind(this))}else{this._oCompetencyPopover.bindElement("CompetencyCard>/details");this._oCompetencyPopover.openBy(n)}},handleLatestItemPopover:function(e){var n=e.getSource();var i=this.getView().getModel().getProperty(n.getBindingContext().sPath);var r=$.extend({},i);this.getView().setModel(new t({details:r}),"LastItemAssignmentCard");if(!this._oLatestItemPopover){o.load({name:"ui.lms.view.fragments.LatestItemAssignedCard",controller:this}).then(function(e){this._oLatestItemPopover=e;this.getView().addDependent(this._oLatestItemPopover);this._oLatestItemPopover.bindElement("LastItemAssignmentCard>/details");this._oLatestItemPopover.openBy(n)}.bind(this))}else{this._oLatestItemPopover.bindElement("LastItemAssignmentCard>/details");this._oLatestItemPopover.openBy(n)}},isCompetencyApplicable:function(e){if(e===undefined||e===null||e.length===0){return this.oResourceBundle.getText("notApplicable")}return e},getBoolean:function(e){if(e&&"X"===e.toUpperCase()){return this.oResourceBundle.getText("grantsCertificateYes")}return this.oResourceBundle.getText("grantsCertificateNo")},getCompetencyType:function(e){if("Prof Competency"===e){return this.oResourceBundle.getText("profCompetency")}else if("Regulation"===e){return this.oResourceBundle.getText("reguCompetency")}return e},getGrantsCertificate:function(e){if(e){if("YES"===e.toUpperCase()){return this.oResourceBundle.getText("grantsCertificateYes")}else if("NO"===e.toUpperCase()){return this.oResourceBundle.getText("grantsCertificateNo")}}return e}})});
//# sourceMappingURL=Worklist.controller.js.map