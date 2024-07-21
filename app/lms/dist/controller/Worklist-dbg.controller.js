sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/core/Fragment',
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"ui/lms/utils/ApplicationController",
	"ui/lms/utils/FilterController",
	"ui/lms/utils/TablesController",
	"ui/lms/utils/DataManager",
	"sap/m/TablePersoController"	
], function (BaseController, 
			JSONModel, 
			Fragment,
			formatter, 
			Filter, 
			FilterOperator,
			MessageToast,
			MessageBox,
			ApplicationController,
			FilterController,
			TablesController,
			DataManager,
			TablePersoController) {

	"use strict";

	return BaseController.extend("ui.lms.controller.Worklist", {

		formatter: formatter,

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var $this = this;
			//-app controller
			this.applicationController = new ApplicationController();
			//-data manager
			this.dataManager = new DataManager().init();
			//-filter controller
			this.filterController = new FilterController();
			//-data manager
			this.tablesController = new TablesController();
			//-odata model
			this.oModel = $this.getOwnerComponent().getModel();
			//-application mode
			this.mode = this.applicationController.getApplicationMode();
			//-resource bundle
			this.oResourceBundle = this.getResourceBundle();
			$this.userInfo = {};

			//-initialize
			// $this.dataManager.getSessionUser($.proxy(function(data) {
			// 	$this.userInfo = data;
				
			// 	//-hardcode user
			// 	// $this.userInfo.user = "00013945"; //'32146';
			// 	$this.afterRendering();
			// 	$this.init($this.mode);
			// }, $this), $.proxy(function(data) {
			// 	MessageToast.show("Failed reading user!");
			// }, $this));

			this.tablesController.init().then(function() {
				//-hardcode user	
				// var user = new URLSearchParams(window.location.search).getAll("uid")[0];		
				// $this.userInfo.user = user ? user : "adminPN";

				// $this.userInfo.user = "adminPN";
				// $this.afterRendering();
				// $this.init($this.mode);

				$this.getUser().then(function(user) {
					$this.userInfo.user = user ? user : "";
					$this.afterRendering();
					$this.init($this.mode);
				});
			});
		},

		getUser: function() {
			var $this = this;
			return new Promise(function(resolve, reject) {
				$.getJSON("/user-api/currentUser", function(json) {
					resolve(json.name);
				});
			});			
		},

		
		init: function(mode) {
			var $this = this;
			this.getView().setBusy(true);
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				var lock = $.Deferred();

				//-initialize tables visibility
				$this.tablesController.initializeTables($this);

				//-load default clock
				// $this.loadClocks(false);

				//load population
				$.when($this.dataManager.loadPopulations($this),
					$this.dataManager.loadFilters($this, mode))	
				.done(function(populations, filterdata) {
					//-prepare population
					$this.getView().setModel(new JSONModel({
						"items": $this.applicationController.preparePopulationModel(populations, $this.oResourceBundle)
					}), "population");

					//-initialize tables visibility
					// $this.tablesController.initializeTables($this);
					
					//-filter data preparation
					$this.filterController.initialize(mode, filterdata, $this);

					$this.loadClocks(false);

					$this.getView().setBusy(false);
				}).fail(function() {
					lock.reject();
					$this.getView().setBusy(false);
					$this.displayMessage($this.getResourceBundle().getText('filterLoadFailed'));
				});
			});
		}, 

		/**
		 * Display message box
		 */ 
		displayMessage: function(message) {
			var $this = this;
			jQuery.sap.delayedCall(10, null, function() {
				MessageBox.show(
					message, {
						icon: MessageBox.Icon.ERROR,
						title: $this.getResourceBundle().getText('messageErrorTitle'),
						actions: [MessageBox.Action.OK],
						onClose: function(oAction) {  }
					}
				);
			});
		},
		
		/**
		 * After rendering
		 */ 
		onAfterRendering: function(oEvent) {
			var a = 1;
		},

		afterRendering: function() {
			var $this = this;
			jQuery.sap.delayedCall(10, null, function() {
				//-add clear button to filter bar
				var clearButton = new sap.m.Button({"text" : $this.oResourceBundle.getText('clear')});
				clearButton.attachPress($.proxy($this.changePopulation, $this));
				$this.getView().byId('filterbar').getContent()[0].addContent(clearButton);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		
		changePopulation: function(oEvent) {
			var $this = this;
			jQuery.sap.delayedCall(10, $this, $.proxy(function() {
				var $filter = $this.getView().getModel("filterSelections").getData();
				$this.mode = $filter.population;
				$this.init($filter.population);
			}, $this));
		},

		filter: function(oEvent) {
			var $this = this;
			var ui = oEvent.getSource().data("ui");
			if(ui && ui.length > 0) {
				jQuery.sap.delayedCall(10, $this, $.proxy(function() {
					$this.filterController.refresh($this, ui);
				}, $this));
			}
		},
		
		onSearch: function(oEvent) {
			this.loadClocks(true);
			//-apply filters to the table
			this.tablesController.refreshFilters(this);
		},

		selectTable: function(oEvent) {
			var $this = this;
			
			var $selectedItem = oEvent.getParameter("item");
			var $frag   = $selectedItem.data('frag');
			var $loaded = $selectedItem.data('loaded');
			if($loaded === true || $loaded === "true") return;
			//-load the fragment
			var fragmentName = "ui.lms.view.fragments.".concat($frag);
			Fragment.load({
				name: fragmentName,
				controller: $this
			}).then(function(fragment){
				$this.getView().addDependent(fragment);
				$this.getView().byId("tab".concat($frag)).addItem(fragment);
				$this.tablesController.initializeTable($this, $frag);
				$selectedItem.data('loaded', true);
			}.bind($this));
		},

		/**
		 * attach page event 
		 * when more than 100 items in table, scroll to bottom to focus more button to load further
		 */ 
		scroll: function(oEvent) {
			var tableUI = oEvent.getSource();
			if(tableUI.getItems().length > 100) {
				$.each($('.sapMPage').children(), function(idx, $page) { 
					$($page).control()[0].scrollToElement($($('#' + tableUI.getId()).find('.sapMGrowingListTrigger')[0]).control()[0]);
				});	
			}
		},

		
		loadClocks: function(hasFilters) {
			var $this = this;
			//-get clock values
			this.getView().setBusy(true);
			
			//-prepare filter
			var $filters = $this.filterController.getPopulationFilter($this.userInfo.user, $this.mode);
			if(hasFilters) {
				$filters = $filters.concat($this.filterController.getAllFilters($this));
			}

			//-get clock values
			$.when($this.dataManager.loadClockValues($this, $filters))	
			.done(function(clockValues) {
				//-apply graph
				$this.getView().setModel(new JSONModel(
					$this.applicationController.prepareGraph(clockValues, $this.oResourceBundle)
				), 'graphModel');

				$this.getView().setBusy(false);
			}).fail(function() {
				$this.getView().setBusy(false);
				$this.displayMessage($this.getResourceBundle().getText('filterLoadFailed'));
			});
		},
		
		exportExcel: function(oEvent) {
		//-prepare url
		// var $filtersValues = this.filterController.getAllFilterValues(this);
		// var $url = "https://kpi-delta-feed-optimistic-dugong-vp.cfapps.eu10-004.hana.ondemand.com/download";
		// window.open($url);

			var $this = this;
			this.getView().setBusy(true);
			var scenario = oEvent.getSource().data("table");

			//-prepare filter
			var $filtersValues = $this.filterController.getAllFilterValues($this);
			//-get export data
			// $.when($this.dataManager.downloadXlsContent($this, scenario, $filtersValues))	
			$.when($this.dataManager.downloadXls($this, scenario, $filtersValues))	
			.done(function($response) {
				$this.getView().setBusy(false);
				var blob = new Blob([$response.content]);
				var link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = decodeURIComponent($response.filename.replaceAll('"',''));
				// link.download = 'Kpi.xlsx';
				link.click();
			}).fail(function() {
				$this.getView().setBusy(false);
				sap.m.MessageToast.show("Download failed!");
			});
		},
		
		//-user popover
		handleUserPopover: function(oEvent) {
			var oButton = oEvent.getSource();
			//-prepare json for card details
			var $data = oButton.getBindingContext().getObject();
			var $copy = $.extend({}, $data);
			this.getView().setModel(new JSONModel({"details" : $copy}), "UserCard");
			//-open popup with JSON element			
			if (!this._oUserPopover) {
				Fragment.load({
					name: "ui.lms.view.fragments.UserCard",
					controller: this
				}).then(function(oPopover){
					this._oUserPopover = oPopover;
					this.getView().addDependent(this._oUserPopover);
					this._oUserPopover.bindElement("UserCard>/details");
					this._oUserPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oUserPopover.bindElement("UserCard>/details");
				this._oUserPopover.openBy(oButton);
			}
		},

		handleItemCompetencyPopover: function(oEvent) {
			var oButton = oEvent.getSource();
			//-prepare json for card details
			var $data = oButton.getBindingContext().getObject();
			var $copy = $.extend({}, $data);
			this.getView().setModel(new JSONModel({"details" : $copy}), "CompetencyCard");
			//-open popover with JSON details data
			if (!this._oItemCompetencyPopover) {
				Fragment.load({
					name: "ui.lms.view.fragments.ItemCompetencyCard",
					controller: this
				}).then(function(oPopover){
					this._oItemCompetencyPopover = oPopover;
					this.getView().addDependent(this._oItemCompetencyPopover);
					this._oItemCompetencyPopover.bindElement("CompetencyCard>/details");
					this._oItemCompetencyPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oItemCompetencyPopover.bindElement("CompetencyCard>/details");
				this._oItemCompetencyPopover.openBy(oButton);
			}
		},

		handleCompetencyPopover: function(oEvent) {
			var oButton = oEvent.getSource();
			//-prepare json for card details
			var $data = oButton.getBindingContext().getObject();
			var $copy = $.extend({}, $data);
			this.getView().setModel(new JSONModel({"details" : $copy}), "CompetencyCard");
			//-open popover with JSON details data
			if (!this._oCompetencyPopover) {
				Fragment.load({
					name: "ui.lms.view.fragments.CompetencyCard",
					controller: this
				}).then(function(oPopover){
					this._oCompetencyPopover = oPopover;
					this.getView().addDependent(this._oCompetencyPopover);
					this._oCompetencyPopover.bindElement("CompetencyCard>/details");
					this._oCompetencyPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oCompetencyPopover.bindElement("CompetencyCard>/details");
				this._oCompetencyPopover.openBy(oButton);
			}
		},

		//-user popover
		handleLatestItemPopover: function(oEvent) {
			var oButton = oEvent.getSource();
			//-prepare json for card details
			var $data = this.getView().getModel().getProperty(oButton.getBindingContext().sPath);
			var $copy = $.extend({}, $data);
			this.getView().setModel(new JSONModel({"details" : $copy}), "LastItemAssignmentCard");
			//-open popup with JSON element			
			if (!this._oLatestItemPopover) {
				Fragment.load({
					name: "ui.lms.view.fragments.LatestItemAssignedCard",
					controller: this
				}).then(function(oPopover){
					this._oLatestItemPopover = oPopover;
					this.getView().addDependent(this._oLatestItemPopover);
					this._oLatestItemPopover.bindElement("LastItemAssignmentCard>/details");
					this._oLatestItemPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oLatestItemPopover.bindElement("LastItemAssignmentCard>/details");
				this._oLatestItemPopover.openBy(oButton);
			}
		},

		isCompetencyApplicable: function(value) {
			if(value === undefined || value === null || value.length === 0) {
				return this.oResourceBundle.getText('notApplicable');
			} 
			return value;
		},

		getBoolean: function(value) {
			if(value && "X" === value.toUpperCase()) {
				return this.oResourceBundle.getText('grantsCertificateYes');
			}
			return this.oResourceBundle.getText('grantsCertificateNo');
		},
		
		getCompetencyType: function(value) {
			if("Prof Competency" === value) {
				return this.oResourceBundle.getText('profCompetency');
			} else if("Regulation" === value) {
				return this.oResourceBundle.getText('reguCompetency');
			}
			return value;
		},

		getGrantsCertificate: function(value) {
			if(value) {
				if("YES" === value.toUpperCase()) {
					return this.oResourceBundle.getText('grantsCertificateYes');
				} else if("NO" === value.toUpperCase()) {
					return this.oResourceBundle.getText('grantsCertificateNo');
				}
			}
			return value;
		}

	});
});