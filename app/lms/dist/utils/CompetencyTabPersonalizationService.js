sap.ui.define(["jquery.sap.global"],function(jQuery){"use strict";var e={oData:{_persoSchemaVersion:"1.0",aColumns:[{id:"learningApp-lineItemsList-employeeCol",order:1,visible:true},{id:"learningApp-lineItemsList-competencyCol",order:2,visible:true},{id:"learningApp-lineItemsList-areaCol",order:3,visible:true},{id:"learningApp-lineItemsList-classificationCol",order:4,visible:true},{id:"learningApp-lineItemsList-completedCol",order:5,visible:true}]},getPersData:function(){var e=new jQuery.Deferred;if(!this._oBundle){this._oBundle=this.oData}var i=this._oBundle;e.resolve(i);return e.promise()},setPersData:function(e){var i=new jQuery.Deferred;this._oBundle=e;i.resolve();return i.promise()},resetPersData:function(){var e=new jQuery.Deferred;var i={_persoSchemaVersion:"1.0",aColumns:[{id:"learningApp-lineItemsList-employeeCol",order:0,visible:true},{id:"learningApp-lineItemsList-competencyCol",order:1,visible:true},{id:"learningApp-lineItemsList-areaCol",order:3,visible:true},{id:"learningApp-lineItemsList-classificationCol",order:4,visible:true},{id:"learningApp-lineItemsList-completedCol",order:5,visible:true}]};this._oBundle=i;e.resolve();return e.promise()},getCaption:function(e){return null},getGroup:function(e){return null}};return e},true);
//# sourceMappingURL=CompetencyTabPersonalizationService.js.map