sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter"
], function(Object, JSONModel, Filter) {
	"use strict";

	return Object.extend("ui.lms.utils.ApplicationController", {
		
		getApplicationMode: function() {
			//-url parameters - mode
			var mode = jQuery.sap.getUriParameters().mParams.mode;
			return (mode) ? mode[0] : 'RE';
		},
		
		preparePopulationModel: function(populations, oResourceBundle) {
			return populations.map(function(item) {
				return {
					"Actor" : item.ACTOR,
					"Text" : oResourceBundle.getText(item.ACTOR),
					"IndexOfPopulation" : item.INDEX_OF_POPULATION
				};
			});
		},
		
		prepareGraph: function(clockValues, oResourceBundle) {
			var $graphData = {};
			//-regulations
			$graphData.regulation = this.prepareGraphData(clockValues.Regulation, oResourceBundle.getText('reguCompetency'), oResourceBundle);
			//-professionals
			$graphData.professional = this.prepareGraphData(clockValues.Professional, oResourceBundle.getText('profCompetency'), oResourceBundle);
			//general
			$graphData.general = this.prepareGraphData(clockValues.Total, oResourceBundle.getText('genrCompetency'), oResourceBundle);

			return $graphData;
		},
		
		prepareGraphData: function(completed, title, oResourceBundle) {
			var notApplicable = (completed === undefined || completed === null);
			return {
				"value" : (notApplicable ? undefined : +completed/100),
				"text"  : (notApplicable ? oResourceBundle.getText('notApplicable') : "".concat(completed).concat('%')),
				"title" : title
			};
		},
		
		
		setFilterModels: function(filterData, oResourceBundle) {}
		
	});
}, false);