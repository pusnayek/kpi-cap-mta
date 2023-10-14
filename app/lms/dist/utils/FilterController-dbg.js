sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function(Object, JSONModel, Filter, FilterOperator) {
	"use strict";

	return Object.extend("ui.lms.utils.FilterController", {

		prepareUserFilter: function(userName) {
			return new Filter('ACTING_USERID', 'EQ', userName);
		},
		
		prepareModeFilter: function(mode) {
			return new Filter('ACTOR', 'EQ', mode);
		},
		
		getPopulationFilter: function(userName, mode) {
			return [
				this.prepareUserFilter(userName),
				this.prepareModeFilter(mode)
			];
		},

		unique: function(data, fieldname) {
			return [...new Set(data.map(item => item[fieldname]))].filter(function(item) {
				return (item && item.length > 0);
			});
		},
		
		uniqueKeyValues: function(data, fieldKey, fieldValue) {
			var hash = {}, uniqueValues = [];
			var $this = this;
			$.each(data, $.proxy(function(indx, item) {
				hash[item[fieldKey]] = item[fieldValue];
			}, $this));
			
			window.Object.keys(hash).sort().forEach(function(key) {
				uniqueValues.push({"key" : key, "text" : hash[key]});
			});
			
			return uniqueValues.filter(function(item) {
				return ((item.key && item.key.length > 0)
						&& (item.text && item.text.length > 0));
			});
		},
		
		setModel: function(fieldname, filterMasterData, oController) {
			var $this = this;
			var oModel = undefined;
			if("COMPETENCY_ID" === fieldname) {
				oModel = new JSONModel({
					"items": $this.uniqueKeyValues(filterMasterData, "COMPETENCY_ID", "COMPETENCY_NAME")
				});
			} else if("COMPETENCY_AREA" === fieldname) {
				oModel = new JSONModel({
					"items": $this.uniqueKeyValues(filterMasterData, "COMPETENCY_AREA", "COMPETENCY_DESCRIPTION")
				});
			} else {
				var uniqueValues = $this.unique(filterMasterData, fieldname).filter(function(item) {return (item && item.length > 0)});
				oModel = new JSONModel({
					"items": uniqueValues.map(function(item) {
						return {"key" : item};
					})
				});
			} 

			//-set the sizelimit
			var dataSize = oModel.getData().items.length;
			oModel.setSizeLimit(dataSize);

			oController.getView().setModel(oModel, fieldname);
		},
		
		updateModels: function(order, filterMasterData, oController) {
			var $this = this;
			$.each(order, $.proxy(function(indx, fieldname) {
				$this.setModel(fieldname, filterMasterData, oController);
			}, $this));
		},


		initialize: function(mode, filterMasterData, oController) {
			var $this = this;
			this.data = filterMasterData;	
			this.order = ["DOMAIN", "DIVISION", "GROUPBU", "DEPARTMENT", "JOBGROUP", "JOBCODE", "JOBLOCATION", "EMPLOYEEGROUP", "EMPCUSTOMSTATUS", "COMPETENCY_AREA", "COMPETENCY_ID"];
			
			//-set filter models
			this.updateModels(this.order, this.data, oController);

			//-initialize the selections
			oController.getView().setModel(new JSONModel({
				"population": mode,
				"DOMAIN": [],
				"DIVISION": [],
				"GROUPBU": [],
				"DEPARTMENT": [],
				"JOBCODE": [],
				"JOBGROUP": [],
				"JOBLOCATION": [],
				"EMPLOYEEGROUP": [],
				"EMPCUSTOMSTATUS": [],
				"COMPETENCY_AREA": [],
				"COMPETENCY_ID": []
			}), "filterSelections");
		},
		
		refresh: function(oController, ui) {
			var $this = this;
			//-get a copy of data
			var filterMasterData = this.data;
			
			//-get applied filter data
			var $selModel = oController.getView().getModel("filterSelections");
			if($selModel) {
				var filterSelections = $selModel.getData();
				if(filterSelections) {
					//-get adjusted order - uis with lesser order
					var $order = [...$this.order];
					$order = $this.getAdjustedOrder($order, ui);
					//-clear selection for lower order uis
					$.each($order, $.proxy(function(indx, fieldname) {
						filterSelections[fieldname] = [];
					}, $this));
					oController.getView().setModel(new JSONModel(filterSelections), "filterSelections");
					
					//-apply filter per field
					$.each($this.order, $.proxy(function(indx, fieldname) {
						if(filterSelections[fieldname] && filterSelections[fieldname].length > 0) {
							// $.each(filterSelections[fieldname], $.proxy(function(indx, filterValue) {
							// 	filterMasterData = filterMasterData.filter(function(item) {
							// 		return (item[fieldname] === filterValue);
							// 	});
							// }, $this));
							filterMasterData = filterMasterData.filter(function(item) {
								return (filterSelections[fieldname].includes(item[fieldname]));
							});
						}
					}, $this));

					//-update filter models
					$this.updateModels($order, filterMasterData, oController);	
				}
			}
		},
		
		getAdjustedOrder: function(fields, fieldName) {
			var indexOfItem = fields.indexOf(fieldName);
			for(var i = 0; i <= indexOfItem; i++) { fields.shift(); }
			return fields;
		},
		
		getAllFilters: function(oController, order) {
			var $this = this;
			var filters = [];
			
			//-if order is not sent, use the default one
			var $order = (order === undefined) ? $this.order : order;
			
			var $selModel = oController.getView().getModel("filterSelections");
			var filterSelections = $selModel.getData();
			
			if(filterSelections) {
				$.each($order, $.proxy(function(indx, fieldname) {
					if(filterSelections[fieldname] && filterSelections[fieldname].length > 0) {
						//-filters for a field
						var fieldFilters = [];
						$.each(filterSelections[fieldname], $.proxy(function(indx, filterValue) {
							fieldFilters.push(new Filter(fieldname, FilterOperator.EQ, filterValue));
						}, $this));
						//-if single, push directly, else append using or and then push
						if(fieldFilters.length > 0) {
							if(fieldFilters.length === 1) {
								filters.push(fieldFilters[0]);
							} else {
								filters.push(new Filter({filters: fieldFilters, and: false}));
							}
						}
					}
				}, $this));
			}
			return filters;
		},
		
		getAllFilterValues: function(oController) {
			var $this = this;
			var filters = [];
			
			var $selModel = oController.getView().getModel("filterSelections");
			var filterSelections = $selModel.getData();
			
			if(filterSelections) {
				$.each($this.order, $.proxy(function(indx, fieldname) {
					if(filterSelections[fieldname] && filterSelections[fieldname].length > 0) {
						//-filters for a field
						var fieldValues = [];
						$.each(filterSelections[fieldname], $.proxy(function(indx, filterValue) {
							fieldValues.push(btoa(encodeURIComponent(filterValue)));
							// fieldValues.push(filterValue);
						}, $this));
						//-push key and values
						filters.push({"name": fieldname, values: fieldValues});
					}
				}, $this));
			}	
			return filters;
		}		
	});
}, false);