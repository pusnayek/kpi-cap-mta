sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "ui/lms/utils/ServiceUrlProvider"
], function(Object, JSONModel, Filter, ServiceUrlProvider) {
	"use strict";

	return Object.extend("ui.lms.utils.TablesController", {

		init: function() {
			var $this = this;
			return new Promise(function(resolve, reject) {
				$.getJSON(ServiceUrlProvider.TableConfig, function(json) {
					$this.configuration = json;
					resolve();
				});
			});
		},
		
		iterateTables: function(funcTableHandler) {
			var $this = this;
			var tables = [...new Set($this.configuration.map(item => item['Table']))];
			$.each(tables, function(indx, $tableName) {
				funcTableHandler($tableName);
			});
		},
		
		getTables: function(mode) {
			return this.configuration.filter(function($table) {
				return mode === $table.Actor;
			});
		},
		
		getVisibilityModel: function(mode, tables) {
			var $modelData = {
				"CompetencyStatus": false,
				"CompetencyGaps": false,
				"ByEmployees" : false,
				"ByCompetencies" : false,
				"ByManagers" : false,
				"ByCompanies" : false,
				"ByDivisions" : false,
				"ByDepartments" : false
			};

			$.each(tables, function(indx, $config) {
				$modelData[$config.Table] = true;
			});

			return new JSONModel($modelData); 
		},

		initializeTables: function(oController) {
			var $this = this;

			var $tables = this.getTables(oController.mode);
			//-initialize the visibility
			oController.getView().setModel(
				$this.getVisibilityModel(oController.mode, $tables), "tableVisibilityModel");
			
			//-apply initial filter
			var initialFilter = oController.filterController.getPopulationFilter(oController.userInfo.user, oController.mode);
			$.each($tables, function(indx, $config) {
				var tableUi = oController.getView().byId($config.Table) || sap.ui.getCore().byId($config.Table);
				if(tableUi) { 
					if($config.Table === 'CompetencyStatus' || $config.Table === 'CompetencyGaps') {
						var oBinding = tableUi.getBinding('items'); 
						if(oBinding && oBinding.filter) { 
							oBinding.filter(initialFilter); 
						}	
					} else {
						$this.refreshAggregatedTables(oController, initialFilter, $config.Table, tableUi);
					}
				}
			});
		},

		refreshAggregatedTables: function(oController, $filters, tableName, tableUi) {
			if(tableName === 'ByCompanies') {
				oController.dataManager.getCompentenciesByCompanies(oController, $filters).then(function(data) {
					tableUi.setModel(new JSONModel(data));
				}).catch(function(error) {

				});
			} else if(tableName === 'ByDepartments') {
				oController.dataManager.getCompentenciesByDepartments(oController, $filters).then(function(data) {
					tableUi.setModel(new JSONModel(data));
				}).catch(function(error) {

				});
			} else if(tableName === 'ByDivisions') {
				oController.dataManager.getCompentenciesByDivisions(oController, $filters).then(function(data) {
					tableUi.setModel(new JSONModel(data));
				}).catch(function(error) {

				});
			} else if(tableName === 'ByEmployees') {
				oController.dataManager.getCompentenciesByEmployees(oController, $filters).then(function(data) {
					tableUi.setModel(new JSONModel(data));
				}).catch(function(error) {

				});
			} else if(tableName === 'ByManagers') {
				oController.dataManager.getCompentenciesByManagers(oController, $filters).then(function(data) {
					tableUi.setModel(new JSONModel(data));
				}).catch(function(error) {

				});
			} else if(tableName === 'ByCompetencies') {
				oController.dataManager.getCompentenciesByCompetencies(oController, $filters).then(function(data) {
					tableUi.setModel(new JSONModel(data));
				}).catch(function(error) {

				});
			}
		},
		
		refreshFilters: function(oController) {
			var $this = this;
			var $tables = this.getTables(oController.mode);
			var $populationFilters = oController.filterController.getPopulationFilter(oController.userInfo.user, oController.mode);

			//-apply initial filter
			$.each($tables, function(indx, $config) {
				var $filters = [...$populationFilters]
							.concat(oController.filterController.getAllFilters(oController, $config.Filter));
				var tableUi = oController.getView().byId($config.Table) || sap.ui.getCore().byId($config.Table);
				if(tableUi) { 
					if($config.Table === 'CompetencyStatus' || $config.Table === 'CompetencyGaps') {
						var oBinding = tableUi.getBinding('items'); 
						if(oBinding && oBinding.filter) { 
							oBinding.filter($filters); 
						}	
					} else {
						$this.refreshAggregatedTables(oController, $filters, $config.Table, tableUi);
					}
				}
			});
		},

		initializeTable: function(oController, tableName) {
			var $this = this;

			var $tables = this.getTables(oController.mode).filter(function($config) {
				return tableName === $config.Table;
			});

			//-apply initial filter
			var initialFilter = oController.filterController.getPopulationFilter(oController.userInfo.user, oController.mode);
							
			$.each($tables, function(indx, $config) {
				var tableUi = oController.getView().byId($config.Table) || sap.ui.getCore().byId($config.Table);
				var $filter = initialFilter.concat(oController.filterController.getAllFilters(oController, $config.Filter));
				if(tableUi) { 
					if(tableName === 'CompetencyStatus' || tableName === 'CompetencyGaps') {
						var oBinding = tableUi.getBinding('items'); 
						if(oBinding && oBinding.filter) { 
							oBinding.filter($filter); 
						}	
					} else {
						$this.refreshAggregatedTables(oController, $filter, tableName, tableUi);
					}
				}
			});
		}
	});
}, false);