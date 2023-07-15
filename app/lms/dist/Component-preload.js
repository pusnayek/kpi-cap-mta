//@ui5-bundle ui/lms/Component-preload.js
sap.ui.require.preload({
	"ui/lms/Component.js":function(){
sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","ui/lms/model/models"],function(e,i,t){"use strict";return e.extend("ui.lms.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"ui/lms/controller/App.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("ui.lms.controller.App",{onInit(){}})});
},
	"ui/lms/controller/Main.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],function(n){"use strict";return n.extend("ui.lms.controller.Main",{onInit:function(){}})});
},
	"ui/lms/i18n/i18n.properties":'# This is the resource bundle for ui.lms\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=LMS Reports\n\n#YDES: Application description\nappDescription=LMS Reports\n#XTIT: Main view title\ntitle=LMS Reports',
	"ui/lms/manifest.json":'{"_version":"1.49.0","sap.app":{"id":"ui.lms","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.10.2","toolsId":"163fa130-7146-43a1-a201-93bdffc83980"},"dataSources":{"mainService":{"uri":"kpi/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"4.0"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.116.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"ui.lms.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"ui.lms.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteMain","pattern":":?query:","target":["TargetMain"]}],"targets":{"TargetMain":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Main","viewName":"Main"}}},"rootView":{"viewName":"ui.lms.view.App","type":"XML","async":true,"id":"App"}}}',
	"ui/lms/model/models.js":function(){
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"ui/lms/view/App.view.xml":'<mvc:View controllerName="ui.lms.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"></App></mvc:View>\n',
	"ui/lms/view/Main.view.xml":'<mvc:View controllerName="ui.lms.controller.Main"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><Page id="page" title="{i18n>title}"><content /></Page></mvc:View>\n'
});
//# sourceMappingURL=Component-preload.js.map
