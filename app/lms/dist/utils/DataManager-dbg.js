sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "ui/lms/utils/ServiceUrlProvider",
  "ui/lms/utils/DataManagerUtils"
], function(Object, JSONModel, Filter, ServiceUrlProvider, DataManagerUtils) {
	"use strict";

	return Object.extend("ui.lms.utils.DataManager", {

		init: function() {
			this.utils = new DataManagerUtils();
			return this;
		},
		
		getSessionUser: function(fnCallback, fnError) {
			$.ajax({
				method: "POST",
				contentType: "application/json",
				url: ServiceUrlProvider.User,
				async: true,
				beforeSend: function (xhr) {}
			}).done(function (results) {
				fnCallback(results);
			}).fail(function (err) {
				fnError(err);
			});
		},

		loadPopulations: function(oController) {
			var lock = $.Deferred();
			//-filter
			var filters = [
					oController.filterController.prepareUserFilter(oController.userInfo.user)
				];

			oController.getView().getModel().read("/Populations", {
				filters: filters,
				success: function(oData) {
					//process data
					lock.resolve(oData.results);
				},
				error: function(oError) {
					lock.reject(oError);
				}
			});
			return lock;
		},

		loadFilters: function(oController, mode) {
			var lock = $.Deferred();
			//-filter
			var filters = [
					oController.filterController.prepareUserFilter(oController.userInfo.user),
					oController.filterController.prepareModeFilter(mode)
				];

			oController.getView().getModel().read("/Filters", {
				filters: filters,
				success: function(oData) {
					//process data
					lock.resolve(oData.results);
				},
				error: function(oError) {
					lock.reject(oError);
				}
			});
			return lock;
		},

		getFilterMultipleValuesAsString: function(filters) {
			return filters.map(item => {
				return item.sPath.concat(" ").concat('eq').concat(" '").concat(item.oValue1).concat("'");
			}).join(' or ');
		},

		getFilterAsString: function(filters) {
			var $this = this;
			return filters.map(item => {
				if(item.sPath) {
					return item.sPath.concat(" ").concat('eq').concat(" '").concat(item.oValue1).concat("'");
				} else {
					return "(".concat($this.getFilterMultipleValuesAsString(item.aFilters)).concat(")");
				}
			}).join(' and ');
		},

		loadClockValues: function(oController, filters) {
			var filterAsString = this.getFilterAsString(filters);
			var path = "/kpi/EmployeeCompetencies?$apply=filter(#)/groupby((ACTING_USERID,ACTOR),aggregate(PROFESSIONAL_QUALIFIED_COMPETENCY with sum as ProfessionalQaulifiedCompetency,PROFESSIONAL_COMPETENCY with sum as ProfessionalCompetency,REGULATION_QUALIFIED_COMPETENCY with sum as RegulationQaulifiedCompetency,REGULATION_COMPETENCY with sum as RegulationCompetency,TOTAL_QUALIFIED_COMPETENCY with sum as TotalQaulifiedCompetency,TOTAL_COMPETENCY with sum as TotalCompetency))"
						.replace('#', filterAsString);
			return new Promise((resolve, reject) => {
				$.get({
					url: path,
					success: function(data) {
						// your success logic
						if(data.value.length > 0) {
							var competency = data.value[0];
							resolve({
								"Professional" : (competency.ProfessionalCompetency === 0 ? 0 : (competency.ProfessionalQaulifiedCompetency * 100 / competency.ProfessionalCompetency)).toFixed(0),
								"Regulation" : (competency.RegulationCompetency === 0 ? 0 : (competency.RegulationQaulifiedCompetency * 100 / competency.RegulationCompetency)).toFixed(0),
								"Total" : (competency.TotalCompetency === 0 ? 0 : (competency.TotalQaulifiedCompetency * 100 / competency.TotalCompetency)).toFixed(0)
							});	
						} else {
							resolve({
								"Professional" : null,
								"Regulation" : null,
								"Total" : null
							});	
						}
					},
					error: function(error) {
						// your error logic
					}
				});				
			});
		},

		getCompentenciesByManagers: function(oController, filters) {
			var filterAsString = this.getFilterAsString(filters);
			var path="/kpi/ByManagers?$apply=filter(#)/groupby((USERID,EMPLOYEEID,FIRSTNAME,LASTNAME,DOMAIN,DEPARTMENT,DIVISION,JOBCODE,JOBGROUP,JOBLOCATION,GROUPBU,EMPLOYEEGROUP,EMPCUSTOMSTATUS,MANAGERUSERID,MANAGERNAME),aggregate(PROFESSIONAL_QUALIFIED_COMPETENCY with sum as ProfessionalQaulifiedCompetency,PROFESSIONAL_COMPETENCY with sum as ProfessionalCompetency,REGULATION_QUALIFIED_COMPETENCY with sum as RegulationQaulifiedCompetency,REGULATION_COMPETENCY with sum as RegulationCompetency,TOTAL_QUALIFIED_COMPETENCY with sum as TotalQaulifiedCompetency,TOTAL_COMPETENCY with sum as TotalCompetency))"
						.replace('#', filterAsString);
			return new Promise((resolve, reject) => {
				$.get({
					url: path,
					success: function(data) {
						// your success logic
						var entries = data.value.map(function(competency) {
							competency.Professional = (competency.ProfessionalCompetency === 0 ? 0 : (competency.ProfessionalQaulifiedCompetency * 100 / competency.ProfessionalCompetency)).toFixed(0);
							competency.Regulation = (competency.RegulationCompetency === 0 ? 0 : (competency.RegulationQaulifiedCompetency * 100 / competency.RegulationCompetency)).toFixed(0);
							competency.Total = (competency.TotalCompetency === 0 ? 0 : (competency.TotalQaulifiedCompetency * 100 / competency.TotalCompetency)).toFixed(0);
							return competency;
						});
						resolve(entries);
					},
					error: function(error) {
						// your error logic
						reject(error);
					}
				});				
			});
		},

		getCompentenciesByCompetencies: function(oController, filters) {
			var filterAsString = this.getFilterAsString(filters);
			var path="/kpi/ByCompetencies?$apply=filter(#)/groupby((COMPETENCY_ID,COMPETENCY_NAME,COMPETENCY_AREA,COMPETENCY_TYPE,COMPETENCY_DESCRIPTION,COMPETENCY_GRANTSCERTIFICATE,RETAININGNUMER),aggregate(NUMBER_OF_EMPLOYEES%20with%20sum%20as%20NumberOfEmployees,NUMBER_OF_QUALIFIED_EMPLOYEES%20with%20sum%20as%20NumberOfQualifiedEmployees))"
						.replace('#', filterAsString);
			return new Promise((resolve, reject) => {
				$.get({
					url: path,
					success: function(data) {
						// your success logic
						var entries = data.value.map(function(competency) {
							competency.QaulificationPercentage = (competency.NumberOfEmployees === 0 ? 0 : (competency.NumberOfQualifiedEmployees * 100 / competency.NumberOfEmployees)).toFixed(0);
							return competency;
						});
						resolve(entries);
					},
					error: function(error) {
						// your error logic
						reject(error);
					}
				});				
			});
		},

		getCompentenciesByEmployees: function(oController, filters) {
			var filterAsString = this.getFilterAsString(filters);
			var path="/kpi/EmployeeCompetencies?$apply=filter(#)/groupby((USERID,EMPLOYEEID,FIRSTNAME,LASTNAME,DOMAIN,DEPARTMENT,DIVISION,JOBCODE,JOBGROUP,JOBLOCATION,GROUPBU,EMPLOYEEGROUP,EMPCUSTOMSTATUS,MANAGERUSERID,MANAGERNAME),aggregate(PROFESSIONAL_QUALIFIED_COMPETENCY with sum as ProfessionalQaulifiedCompetency,PROFESSIONAL_COMPETENCY with sum as ProfessionalCompetency,REGULATION_QUALIFIED_COMPETENCY with sum as RegulationQaulifiedCompetency,REGULATION_COMPETENCY with sum as RegulationCompetency,TOTAL_QUALIFIED_COMPETENCY with sum as TotalQaulifiedCompetency,TOTAL_COMPETENCY with sum as TotalCompetency))"
						.replace('#', filterAsString);
			return new Promise((resolve, reject) => {
				$.get({
					url: path,
					success: function(data) {
						// your success logic
						var entries = data.value.map(function(competency) {
							competency.Professional = (competency.ProfessionalCompetency === 0 ? 0 : (competency.ProfessionalQaulifiedCompetency * 100 / competency.ProfessionalCompetency)).toFixed(0);
							competency.Regulation = (competency.RegulationCompetency === 0 ? 0 : (competency.RegulationQaulifiedCompetency * 100 / competency.RegulationCompetency)).toFixed(0);
							competency.Total = (competency.TotalCompetency === 0 ? 0 : (competency.TotalQaulifiedCompetency * 100 / competency.TotalCompetency)).toFixed(0);
							return competency;
						});
						resolve(entries);
					},
					error: function(error) {
						// your error logic
						reject(error);
					}
				});				
			});
		},

		getCompentenciesByCompanies: function(oController, filters) {
			var filterAsString = this.getFilterAsString(filters);
			var path="/kpi/EmployeeCompetencies?$apply=filter(#)/groupby((DOMAIN),aggregate(PROFESSIONAL_QUALIFIED_COMPETENCY with sum as ProfessionalQaulifiedCompetency,PROFESSIONAL_COMPETENCY with sum as ProfessionalCompetency,REGULATION_QUALIFIED_COMPETENCY with sum as RegulationQaulifiedCompetency,REGULATION_COMPETENCY with sum as RegulationCompetency,TOTAL_QUALIFIED_COMPETENCY with sum as TotalQaulifiedCompetency,TOTAL_COMPETENCY with sum as TotalCompetency))"
						.replace('#', filterAsString);
			return new Promise((resolve, reject) => {
				$.get({
					url: path,
					success: function(data) {
						// your success logic
						var entries = data.value.map(function(competency) {
							competency.Professional = (competency.ProfessionalCompetency === 0 ? 0 : (competency.ProfessionalQaulifiedCompetency * 100 / competency.ProfessionalCompetency)).toFixed(0);
							competency.Regulation = (competency.RegulationCompetency === 0 ? 0 : (competency.RegulationQaulifiedCompetency * 100 / competency.RegulationCompetency)).toFixed(0);
							competency.Total = (competency.TotalCompetency === 0 ? 0 : (competency.TotalQaulifiedCompetency * 100 / competency.TotalCompetency)).toFixed(0);
							return competency;
						});
						resolve(entries);
					},
					error: function(error) {
						// your error logic
						reject(error);
					}
				});				
			});
		},

		getCompentenciesByDivisions: function(oController, filters) {
			var filterAsString = this.getFilterAsString(filters);
			var path="/kpi/EmployeeCompetencies?$apply=filter(#)/groupby((DIVISION),aggregate(PROFESSIONAL_QUALIFIED_COMPETENCY with sum as ProfessionalQaulifiedCompetency,PROFESSIONAL_COMPETENCY with sum as ProfessionalCompetency,REGULATION_QUALIFIED_COMPETENCY with sum as RegulationQaulifiedCompetency,REGULATION_COMPETENCY with sum as RegulationCompetency,TOTAL_QUALIFIED_COMPETENCY with sum as TotalQaulifiedCompetency,TOTAL_COMPETENCY with sum as TotalCompetency))"
						.replace('#', filterAsString);
			return new Promise((resolve, reject) => {
				$.get({
					url: path,
					success: function(data) {
						// your success logic
						var entries = data.value.map(function(competency) {
							competency.Professional = (competency.ProfessionalCompetency === 0 ? 0 : (competency.ProfessionalQaulifiedCompetency * 100 / competency.ProfessionalCompetency)).toFixed(0);
							competency.Regulation = (competency.RegulationCompetency === 0 ? 0 : (competency.RegulationQaulifiedCompetency * 100 / competency.RegulationCompetency)).toFixed(0);
							competency.Total = (competency.TotalCompetency === 0 ? 0 : (competency.TotalQaulifiedCompetency * 100 / competency.TotalCompetency)).toFixed(0);
							return competency;
						});
						resolve(entries);
					},
					error: function(error) {
						// your error logic
						reject(error);
					}
				});				
			});
		},

		getCompentenciesByDepartments: function(oController, filters) {
			var filterAsString = this.getFilterAsString(filters);
			var path="/kpi/EmployeeCompetencies?$apply=filter(#)/groupby((DEPARTMENT),aggregate(PROFESSIONAL_QUALIFIED_COMPETENCY with sum as ProfessionalQaulifiedCompetency,PROFESSIONAL_COMPETENCY with sum as ProfessionalCompetency,REGULATION_QUALIFIED_COMPETENCY with sum as RegulationQaulifiedCompetency,REGULATION_COMPETENCY with sum as RegulationCompetency,TOTAL_QUALIFIED_COMPETENCY with sum as TotalQaulifiedCompetency,TOTAL_COMPETENCY with sum as TotalCompetency))"
						.replace('#', filterAsString);
			return new Promise((resolve, reject) => {
				$.get({
					url: path,
					success: function(data) {
						// your success logic
						var entries = data.value.map(function(competency) {
							competency.Professional = (competency.ProfessionalCompetency === 0 ? 0 : (competency.ProfessionalQaulifiedCompetency * 100 / competency.ProfessionalCompetency)).toFixed(0);
							competency.Regulation = (competency.RegulationCompetency === 0 ? 0 : (competency.RegulationQaulifiedCompetency * 100 / competency.RegulationCompetency)).toFixed(0);
							competency.Total = (competency.TotalCompetency === 0 ? 0 : (competency.TotalQaulifiedCompetency * 100 / competency.TotalCompetency)).toFixed(0);
							return competency;
						});
						resolve(entries);
					},
					error: function(error) {
						// your error logic
						reject(error);
					}
				});				
			});
		},

		// loadClockValues: function(oController, filters) {			
		// 	return new Promise((resolve, reject) => {
		// 		var clockValues = oController.getView().getModel("v4").bindList("/ClockValues",null,[],filters,{$$getKeepAliveContext:true});
		// 		clockValues.requestContexts()
		// 		.then(function(data, response) {
		// 			resolve({
		// 				"Professional" : null,
		// 				"Regulation" : null,
		// 				"Total" : null
		// 			});
		// 		})
		// 		.catch(function(oError) {

		// 		})
		// 	});
		// },

		
		/**
		 * Download xls
		 */ 
		downloadXlsContent: function(oController, scenario, datafilterValues) {
			var lock = $.Deferred();
			var $this = this;
			
			//-prepare url
			var $url = this.utils.prepareXlsDownloadUrl(oController.mode, scenario);

			$.ajax({
				method: "POST",
				contentType: "application/json",
				url: $url,
				async: true,
				data: JSON.stringify($this.utils.prepareXlsDownloadPayload(datafilterValues)),
				xhrFields: {
					responseType: 'blob'
				},
				beforeSend: function (xhr) {}
			}).done(function (content, status, xhr) {
				var str = xhr.getResponseHeader('content-disposition').split('=')[1];
				var filename = str.substring(1, str.length - 1);
				filename = decodeURIComponent(filename).replace('#', ' ');
				lock.resolve({"content" : content, "filename" : filename});
			}).fail(function (oError) {
				lock.reject(oError);
			});

			return lock;
		},

		downloadXls: function(oController, scenario, datafilterValues) {
			var lock = $.Deferred();
			var $this = this;
			//-prepare url
			var $url = "/excel/download";

			var oPayload = {
				"user": oController.userInfo.user,
				"mode": oController.mode,
				"langu": sap.ui.getCore().getConfiguration().getLanguage().substring(0,2),
				"scenario": scenario,
				"filters": datafilterValues
			};

			$.ajax({
				method: "POST",
				contentType: "application/json",
				url: $url,
				data: JSON.stringify(oPayload),
				async: true,
				xhrFields: {
					responseType: 'blob'
				},
				beforeSend: function (xhr) {}
			}).done(function (content, status, xhr) {
				var filename = xhr.getResponseHeader('content-disposition').split('=')[1];
				lock.resolve({"content" : content, "filename" : filename});
			}).fail(function (oError) {
				lock.reject(oError);
			});
			return lock;
		},
		
		/**
		 * Download big xls
		 */ 
		downloadBigXlsContent: function(oController, scenario, datafilterValues) {
			var lock = $.Deferred();
			var readinesslock = $.Deferred();
			var $this = this;
			
			//-prepare url
			var $url = this.utils.prepareBigXlsDownloadPostUrl(oController.mode, scenario);

			$.ajax({
				method: "POST",
				contentType: "application/json",
				url: $url,
				async: true,
				data: JSON.stringify($this.utils.prepareXlsDownloadPayload(datafilterValues)),
				beforeSend: function (xhr) {}
			}).done(function (data) {
				var payload = JSON.parse(data);
				$this.checkBigXlsReady(readinesslock, payload.token);
				// readinesslock.resolve({"token" : payload.token});
			}).fail(function (oError) {
				readinesslock.reject(oError);
				lock.reject(oError);
			});

			$.when(readinesslock)
			.done(function($data) {
				//-prepare url
				$url = $this.utils.prepareBigXlsDownloadGetUrl($data.token);

				$.ajax({
					method: "GET",
					contentType: "application/json",
					url: $url,
					async: true,
					xhrFields: {
						responseType: 'blob'
					},
					beforeSend: function (xhr) {}
				}).done(function (content, status, xhr) {
					var str = xhr.getResponseHeader('content-disposition').split('=')[1];
					var filename = str.substring(1, str.length - 1);
					filename = decodeURIComponent(filename).replace('#', ' ');
					lock.resolve({"content" : content, "filename" : filename});
				}).fail(function (oError) {
					lock.reject(oError);
				});
			});

			return lock;
		},
		
		checkBigXlsReady: function(lock, token) {
			var $this = this;

			jQuery.sap.delayedCall(10000, $this, $.proxy(function() {
				var $url = $this.utils.prepareBigXlsDownloadCheckUrl(token);

				$.ajax({
					method: "GET",
					contentType: "application/json",
					url: $url,
					async: true
				}).done(function (data) {
					var payload = JSON.parse(data);
					if(payload.hasError) {
						lock.reject();
					} else if(payload.ready) {
						lock.resolve({"token" : token});
					} else {
						$this.checkBigXlsReady(lock, token);
					}
				}).fail(function (oError) {
					lock.reject(oError);
				});
			}, $this));
		}						
	});
}, false);