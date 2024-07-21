sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";

	return {
		
		// User: "/TileService/user",
		User: "../sap/fiori/kpicompetency/TileService/user",

		// Xls: "/TileService/xls",
		Xls: "../sap/fiori/kpicompetency/TileService/xls",

		// BigXls: "/TileService/bigxls",
		BigXls: "../sap/fiori/kpicompetency/TileService/bigxls",

		// BigXlsCheck: "/TileService/bigxlscheck",
		BigXlsCheck: "../sap/fiori/kpicompetency/TileService/bigxlscheck",

		TableConfig: "data/tablesConfig.json"
		// TableConfig: "../sap/fiori/kpicompetency/data/tablesConfig.json"

	};

}, false);