sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	// Very simple page-context personalization
	// persistence service, not for productive use!
	var competencyTabPersonalizationService = {

		oData : {
			_persoSchemaVersion: "1.0",
			aColumns : [
				{
					id: "learningApp-lineItemsList-employeeCol",
					order: 1,
					visible: true
				},
				{
					id: "learningApp-lineItemsList-competencyCol",
					order: 2,
					visible: true
				},
				{
					id: "learningApp-lineItemsList-areaCol",
					order: 3,
					visible: true
				},
				{
					id: "learningApp-lineItemsList-classificationCol",
					order: 4,
					visible: true
				},
				{
					id: "learningApp-lineItemsList-completedCol",
					order: 5,
					visible: true
				}
			]
		},

		getPersData : function () {
			var oDeferred = new jQuery.Deferred();
			if (!this._oBundle) {
				this._oBundle = this.oData;
			}
			var oBundle = this._oBundle;
			oDeferred.resolve(oBundle);
			return oDeferred.promise();
		},

		setPersData : function (oBundle) {
			var oDeferred = new jQuery.Deferred();
			this._oBundle = oBundle;
			oDeferred.resolve();
			return oDeferred.promise();
		},

		resetPersData : function () {
			var oDeferred = new jQuery.Deferred();
			var oInitialData = {
					_persoSchemaVersion: "1.0",
					aColumns : [
					{
								id: "learningApp-lineItemsList-employeeCol",
									order: 0,
									visible: true
								},
								{
									id: "learningApp-lineItemsList-competencyCol",
									order: 1,
									visible: true
								},
								{
									id: "learningApp-lineItemsList-areaCol",
									order: 3,
									visible: true
								},
								{
									id: "learningApp-lineItemsList-classificationCol",
									order: 4,
									visible: true
								},
								{
									id: "learningApp-lineItemsList-completedCol",
									order: 5,
									visible: true
								}
							]
			};

			//set personalization
			this._oBundle = oInitialData;

			//reset personalization, i.e. display table as defined
	//		this._oBundle = null;

			oDeferred.resolve();
			return oDeferred.promise();
		},

		getCaption : function (oColumn) {
			return null;
		},

		getGroup : function(oColumn) {
			return null;
		}
	};

	return competencyTabPersonalizationService;

}, /* bExport= */ true);