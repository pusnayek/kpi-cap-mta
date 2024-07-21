sap.ui.define(["sap/ui/thirdparty/d3","sap/ui/core/Control","sap/ui/core/EnabledPropagator"],function(t,e,a){"use strict";var r=e.extend("ui.lms.controls.Donut",{metadata:{properties:{value:{type:"float",defaultValue:null},text:{type:"string",defaultValue:null},title:{type:"string",defaultValue:null},height:{type:"int",defaultValue:140},width:{type:"int",defaultValue:350},innerRadius:{type:"int",defaultValue:35},outerRadius:{type:"int",defaultValue:50}},aggregations:{},events:{press:{}}},renderer:function(t,e){t.write("<section");t.writeControlData(e);t.writeClasses();t.write("><article id="+e.getId().concat("-article")+' class="therm">');t.write("</section>")}});a.call(r.prototype);r.prototype.onAfterRendering=function(){var e=function(e,a){var r=2*Math.PI;var n=function(){return"translate("+a.width/2+","+a.height/2+")"};var i=function(){return"translate("+a.width/2+","+10+")"};var l=function(e){if(+e*100<50){return t.rgb("#ff0000")}else if(+e*100<95){return t.rgb("#c8a567")}else{return t.rgb("#008000")}};var s=t.svg.arc().innerRadius(a.innerRadius).outerRadius(a.outerRadius).startAngle(0);var u=t.select(e).append("svg:svg").attr("class","arc").attr("width",a.width).attr("height",a.height);var d=u.append("g").attr("transform",n());if(a.value){d.append("path").datum({endAngle:r}).style("fill","#ddd").attr("d",s);d.append("path").datum({endAngle:a.value*r}).style("fill",l(a.value)).attr("d",s);var o=u.append("g").attr("class","label").attr("transform",n());o.selectAll("text").data([a.text]).enter().append("text").text(function(t){return t})}else{var p=u.append("g").attr("class","boldlabel").attr("transform",n());p.selectAll("text").data([a.text]).enter().append("text").text(function(t){return t})}var g=u.append("g").attr("class","label").attr("transform",i());g.selectAll("text").data([a.title]).enter().append("text").text(function(t){return t})};e("#"+this.getIdForLabel(),{height:this.getHeight(),width:this.getWidth(),innerRadius:this.getInnerRadius(),outerRadius:this.getOuterRadius(),value:this.getValue(),text:this.getText(),title:this.getTitle()})};return r});
//# sourceMappingURL=Donut.js.map