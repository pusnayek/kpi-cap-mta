sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "ui/lms/utils/ServiceUrlProvider"
], function(Object, JSONModel, Filter, ServiceUrlProvider) {
	"use strict";

	return Object.extend("ui.lms.utils.DataManagerUtils", {

		quote: function(value) {
			return "'".concat(value).concat("'");
		},
		
		stringify: function(values) {
			//-first value
			var $val = values.shift();

			//-next values
			$.each(values, $.proxy(function(indx, $value) {
				$val = $val.concat(",").concat($value);	
			}, this));

			return $val;
		},

		prepareClockUrl: function(user, mode, filterValues) {
			// var $this = this;
			// var baseUrl = "/LMD/cbc/lms/competency/kpi/Competencies.xsjs?";
			// var baseUrl = "../sap/fiori/kpicompetency/LMD/cbc/lms/competency/kpi/Competencies.xsjs?";

			//-url parameters - Actor user
			// baseUrl = baseUrl.
			// 	concat('ActingUserID').concat('=').concat($this.quote(user));

			// //-url parameters - mode
			// baseUrl = baseUrl.concat('&')
			// 	.concat('ActorType').concat('=').concat($this.quote(mode));

			// //-loop at filter fields
			// $.each(filterValues, $.proxy(function(indx, $filter) {
			// 	baseUrl = baseUrl.concat('&')
			// 		.concat($filter.name).concat('=').concat($this.quote($filter.values));	
			// }, this));
			
			// return baseUrl;
		},

		prepareXlsDownloadUrl: function(mode, scenario) {
			var baseUrl = ServiceUrlProvider.Xls.concat('?');
			//-url parameters - mode
			baseUrl = baseUrl
				.concat('mode').concat('=').concat(mode);

			//-url parameters - scenario
			baseUrl = baseUrl.concat('&')
				.concat('scenario').concat('=').concat(scenario);

			//-url parameters - scenario
			baseUrl = baseUrl.concat('&')
				.concat('language').concat('=').concat(sap.ui.getCore().getConfiguration().getLanguage());

			return baseUrl;
		},

		prepareBigXlsDownloadPostUrl: function(mode, scenario) {
			var baseUrl = ServiceUrlProvider.BigXls.concat('?');
			//-url parameters - mode
			baseUrl = baseUrl
				.concat('mode').concat('=').concat(mode);

			//-url parameters - scenario
			baseUrl = baseUrl.concat('&')
				.concat('scenario').concat('=').concat(scenario);

			//-url parameters - scenario
			baseUrl = baseUrl.concat('&')
				.concat('language').concat('=').concat(sap.ui.getCore().getConfiguration().getLanguage());

			//-url parameters - timezone offset
			baseUrl = baseUrl.concat('&')
				.concat('tz').concat('=').concat(new Date().getTimezoneOffset());

			return baseUrl;
		},

		prepareBigXlsDownloadGetUrl: function(token) {
			var baseUrl = ServiceUrlProvider.BigXls.concat('?');
			//-url parameters - mode
			baseUrl = baseUrl
				.concat('tokenxls').concat('=').concat(token);

			return baseUrl;
		},

		prepareBigXlsDownloadCheckUrl: function(token) {
			var baseUrl = ServiceUrlProvider.BigXlsCheck.concat('?');
			//-url parameters - mode
			baseUrl = baseUrl
				.concat('tokenxls').concat('=').concat(token);

			return baseUrl;
		},
		
		prepareXlsDownloadPayload: function(filterValues) {
			var $payload = {};
			var $this = this;

			//-loop at filter fields
			$.each(filterValues, $.proxy(function(indx, $filter) {
				$payload[$filter.name] = $this.stringify($filter.values);
			}, this));
			
			return $payload;
		}
	});
}, false);