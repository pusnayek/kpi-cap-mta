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

		/**
		 * Load clocks using xsjs service
		 */ 
		// loadClockValues: function(oController, datafilterValues) {
		// 	var lock = $.Deferred();

		// 	//-prepare url
		// 	var $url = this.utils.prepareClockUrl(oController.userInfo.user, oController.mode, datafilterValues);

		// 	$.ajax({
		// 		method: "GET",
		// 		contentType: "application/json",
		// 		url: $url,
		// 		async: true,
		// 		beforeSend: function (xhr) {}
		// 	}).done(function (results) {
		// 		lock.resolve(results);
		// 	}).fail(function (oError) {
		// 		lock.reject(oError);
		// 	});

		// 	return lock;
		// },

		/**
		 * Load clocks using xsodata call
		 */ 
		loadClockValues: function(oController, filters) {
			var lock = $.Deferred();

			oController.getView().getModel().read("/EmployeeCompetencies", {
				urlParameters:{"$select" : "ProfessionalCompetencyPercentage,RegulationCompetencyPercentage,TotalCompetencyPercentage"},
				filters: filters,
				success: function(oData) {
					//process data
					if(oData.results && oData.results.length > 0) {
						var $result = oData.results[0];
						lock.resolve({
							"Professional" : $result.ProfessionalCompetencyPercentage,
							"Regulation" : $result.RegulationCompetencyPercentage,
							"Total" : $result.TotalCompetencyPercentage
						});
					} else {
						lock.resolve({
							"Professional" : null,
							"Regulation" : null,
							"Total" : null
						});
					}
				},
				error: function(oError) {
					lock.reject(oError);
				}
			});

			return lock;
		},
		
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