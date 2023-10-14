sap.ui.define(["sap/ui/base/Object","sap/ui/model/json/JSONModel","sap/ui/model/Filter","ui/lms/utils/ServiceUrlProvider","ui/lms/utils/DataManagerUtils"],function(e,r,n,t,o){"use strict";return e.extend("ui.lms.utils.DataManager",{init:function(){this.utils=new o;return this},getSessionUser:function(e,r){$.ajax({method:"POST",contentType:"application/json",url:t.User,async:true,beforeSend:function(e){}}).done(function(r){e(r)}).fail(function(e){r(e)})},loadPopulations:function(e){var r=$.Deferred();var n=[e.filterController.prepareUserFilter(e.userInfo.user)];e.getView().getModel().read("/Populations",{filters:n,success:function(e){r.resolve(e.results)},error:function(e){r.reject(e)}});return r},loadFilters:function(e,r){var n=$.Deferred();var t=[e.filterController.prepareUserFilter(e.userInfo.user),e.filterController.prepareModeFilter(r)];e.getView().getModel().read("/Filters",{filters:t,success:function(e){n.resolve(e.results)},error:function(e){n.reject(e)}});return n},loadClockValues:function(e,r){var n=$.Deferred();e.getView().getModel().read("/ClockValues",{urlParameters:{$select:"PROFESSIONAL_COMPETENCY_PERCENTAGE,REGULATION_COMPETENCY_PERCENTAGE,TOTAL_COMPETENCY_PERCENTAGE"},filters:r,success:function(e){if(e.results&&e.results.length>0){var r=e.results[0];n.resolve({Professional:r.PROFESSIONAL_COMPETENCY_PERCENTAGE,Regulation:r.REGULATION_COMPETENCY_PERCENTAGE,Total:r.TOTAL_COMPETENCY_PERCENTAGE})}else{n.resolve({Professional:null,Regulation:null,Total:null})}},error:function(e){n.reject(e)}});return n},downloadXlsContent:function(e,r,n){var t=$.Deferred();var o=this;var l=this.utils.prepareXlsDownloadUrl(e.mode,r);$.ajax({method:"POST",contentType:"application/json",url:l,async:true,data:JSON.stringify(o.utils.prepareXlsDownloadPayload(n)),xhrFields:{responseType:"blob"},beforeSend:function(e){}}).done(function(e,r,n){var o=n.getResponseHeader("content-disposition").split("=")[1];var l=o.substring(1,o.length-1);l=decodeURIComponent(l).replace("#"," ");t.resolve({content:e,filename:l})}).fail(function(e){t.reject(e)});return t},downloadBigXlsContent:function(e,r,n){var t=$.Deferred();var o=$.Deferred();var l=this;var s=this.utils.prepareBigXlsDownloadPostUrl(e.mode,r);$.ajax({method:"POST",contentType:"application/json",url:s,async:true,data:JSON.stringify(l.utils.prepareXlsDownloadPayload(n)),beforeSend:function(e){}}).done(function(e){var r=JSON.parse(e);l.checkBigXlsReady(o,r.token)}).fail(function(e){o.reject(e);t.reject(e)});$.when(o).done(function(e){s=l.utils.prepareBigXlsDownloadGetUrl(e.token);$.ajax({method:"GET",contentType:"application/json",url:s,async:true,xhrFields:{responseType:"blob"},beforeSend:function(e){}}).done(function(e,r,n){var o=n.getResponseHeader("content-disposition").split("=")[1];var l=o.substring(1,o.length-1);l=decodeURIComponent(l).replace("#"," ");t.resolve({content:e,filename:l})}).fail(function(e){t.reject(e)})});return t},checkBigXlsReady:function(e,r){var n=this;jQuery.sap.delayedCall(1e4,n,$.proxy(function(){var t=n.utils.prepareBigXlsDownloadCheckUrl(r);$.ajax({method:"GET",contentType:"application/json",url:t,async:true}).done(function(t){var o=JSON.parse(t);if(o.hasError){e.reject()}else if(o.ready){e.resolve({token:r})}else{n.checkBigXlsReady(e,r)}}).fail(function(r){e.reject(r)})},n))}})},false);
//# sourceMappingURL=DataManager.js.map