sap.ui.define([
	'sap/ui/thirdparty/d3',
	'sap/ui/core/Control',
	'sap/ui/core/EnabledPropagator'
], function (d3, Control, EnabledPropagator) {
	"use strict";

	var Donut = Control.extend("ui.lms.controls.Donut", {
		metadata: {
			
			properties: {
				value        : {type : "float", defaultValue : null},
				text         : {type : "string",  defaultValue : null},
				title        : {type : "string",  defaultValue : null},
				height       : {type : "int",  defaultValue : 140},
				width        : {type : "int",  defaultValue : 350},
				innerRadius  : {type : "int",  defaultValue : 35},
				outerRadius  : {type : "int",  defaultValue : 50}
			},

			aggregations: {
            },
            
			events: {
				press: {}
			}
		},

		renderer: function (oRm, oControl) {
			oRm.write("<section");
			oRm.writeControlData(oControl);
			oRm.writeClasses();
			oRm.write('><article id=' + oControl.getId().concat('-article') + ' class="therm">');
			oRm.write("</section>");
		}
	});
	EnabledPropagator.call(Donut.prototype);

	Donut.prototype.onAfterRendering = function () {

		var render = function (container, configuration) {
			var tau = 2 * Math.PI;

			var centerTranslation = function () {
				return "translate(" + configuration.width / 2 + "," + configuration.height / 2 + ")";
			};

			var topTranslation = function () {
				return "translate(" + configuration.width / 2 + "," + (10) + ")";
				// return "translate(" + 0 + "," + (configuration.height / 2 - 50) + ")";
			};

			var color = function(d) {
				if(+d*100 < 50) { return d3.rgb('#ff0000'); }
				else if(+d*100 < 95) { return d3.rgb('#c8a567'); }
				else { return d3.rgb('#008000'); }
			};

			var arc = d3.svg.arc().innerRadius(configuration.innerRadius).outerRadius(configuration.outerRadius).startAngle(0);

			var svg = d3.select(container)
				.append('svg:svg')
				.attr('class', 'arc')
				.attr('width', configuration.width)
				.attr('height', configuration.height);

			var g = svg.append("g").attr("transform", centerTranslation());

			if(configuration.value) {
				g.append("path")
					.datum({ endAngle: tau })
					.style("fill", "#ddd")
					.attr("d", arc);
	
				g.append("path")
					.datum({ endAngle: configuration.value * tau })
					.style("fill", color(configuration.value))
					.attr("d", arc);
	
				var lg = svg.append('g')
					.attr('class', 'label')
					.attr('transform', centerTranslation());
				lg.selectAll("text")
					.data([configuration.text])
					.enter().append("text")
					.text(function (d) { return d; });
			} else {
				var labelNA = svg.append('g')
						.attr('class', 'boldlabel')
						.attr('transform', centerTranslation());
				labelNA.selectAll('text')
						.data([configuration.text])
					.enter().append('text')
						.text(function(d){return d;});
			}

			var label = svg.append('g')
				.attr('class', 'label')
				.attr('transform', topTranslation());
				//.attr('x', 20).attr('y', 0);
			label.selectAll('text')
				.data([configuration.title])
				.enter().append('text')
				.text(function (d) { return d; });
		};

		render('#' + this.getIdForLabel(), {
			height     : this.getHeight(),
			width      : this.getWidth(),
			innerRadius: this.getInnerRadius(),
			outerRadius: this.getOuterRadius(),
			value      : this.getValue(),
			text       : this.getText(),
			title      : this.getTitle()
		});
	};

	return Donut;
});