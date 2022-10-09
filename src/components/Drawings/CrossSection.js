import React, { Component } from "react";
import makerjs, { paths, unitType, exporter } from "makerjs";
import { Col, Button } from "reactstrap";

class CrossSection extends Component {
	constructor(){
	  super()
	  this.state = {
		width: 0,
		height: 0
	  }
	  this.resizeHandler = this.resizeHandler.bind(this);
	}

	resizeHandler() {
		const width = this.divElement.clientWidth;
		const height = this.divElement.clientHeight;
		this.setState({ width, height });
	  }
	
	  componentDidMount() {
		this.resizeHandler();
		window.addEventListener('resize', this.resizeHandler);
	  }

	drawSvg = (Bvig, Hvig, Svig, Ecc, Dcon, Smin, Smax, Hcon, Pcon, Pangle, canvasHeight, canvasWidth)=>{
		const canvasScale = 1/3.78;
		const scale = 0.4 * canvasWidth / Svig;
		const margin = 0.02 * canvasHeight;
		const offsetY = 0.15 * canvasHeight;
		const centerX = canvasWidth * 0.5;
		const centerY = canvasHeight * 0.5;

		var section = {
			paths: {
				marginLeftLine: new paths.Line([0, 0], [0, canvasHeight]),
				marginTopLine: new paths.Line([0, canvasHeight], [canvasWidth, canvasHeight]),
				marginLeftRigthLine: new paths.Line([canvasWidth, canvasHeight], [canvasWidth, 0]),
				marginBottomLine: new paths.Line([canvasWidth, 0], [0, 0]),
				
				// Floor slab
				line1: new paths.Line([centerX - (margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY], 									[centerX + (margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY]),
				line2: new paths.Line([centerX - (margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY + Ecc * scale], 						[centerX + (margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY + Ecc * scale]),
				line3: new paths.Line([centerX - (margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY + (Ecc + margin * 0.5) * scale], 	[centerX - (margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY - (Ecc + margin) * 0.5 * scale]),
				line4: new paths.Line([centerX + (margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY + (Ecc + margin * 0.5) * scale], 	[centerX + (margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY - (Ecc + margin) * 0.5 * scale]),
				// // Left beam
				line5: new paths.Line([centerX - (Svig + Bvig) * 0.5 * scale, offsetY + centerY], 					[centerX - (Svig + Bvig) * 0.5 * scale, offsetY + centerY - Hvig * scale]),
				line6: new paths.Line([centerX - (Svig + Bvig) * 0.5 * scale, offsetY + centerY - Hvig * scale], 	[centerX - (Svig - Bvig) * 0.5 * scale, offsetY + centerY - Hvig * scale]),
				line7: new paths.Line([centerX - (Svig - Bvig) * 0.5 * scale, offsetY + centerY - Hvig * scale], 	[centerX - (Svig - Bvig) * 0.5 * scale, offsetY + centerY]),
				// // Right beam
				line8: new paths.Line([centerX + (Svig + Bvig) * 0.5 * scale, offsetY + centerY ], 					[centerX + (Svig + Bvig) * 0.5 * scale, offsetY + centerY - Hvig * scale]),
				line9: new paths.Line([centerX + (Svig + Bvig) * 0.5 * scale, offsetY + centerY - Hvig * scale], 	[centerX + (Svig - Bvig) * 0.5 * scale, offsetY + centerY - Hvig * scale]),
				line10: new paths.Line([centerX + (Svig - Bvig) * 0.5 * scale, offsetY + centerY - Hvig * scale], 	[centerX + (Svig - Bvig) * 0.5 * scale, offsetY + centerY]),			}
		  };
		
		section = makerjs.$(section)
							.scale(canvasScale)
							.$result;

		var dimensionsS = {
			paths: {
					line1: new paths.Line([centerX - (margin + Svig) * 0.5 * scale, offsetY + centerY + margin * 1.5 * scale], [centerX + (margin + Svig) * 0.5 * scale, offsetY + centerY + margin * 1.5 * scale]), 
					line2: new paths.Line([centerX - Svig * 0.5 * scale, offsetY + centerY + margin  * scale], [centerX - Svig * 0.5 * scale, offsetY + centerY + 2 * margin * scale]), 
					line3: new paths.Line([centerX + Svig * 0.5 * scale, offsetY + centerY + margin  * scale], [centerX + Svig * 0.5 * scale, offsetY + centerY + 2 * margin * scale]), 
					}
		}
		
		dimensionsS = makerjs.$(dimensionsS)
							.addCaption('S (' + Svig + ' cm)', [centerX - (margin + Svig * 0.5) * scale, offsetY + centerY + 2 * margin * scale], [centerX + (margin + Svig * 0.5) * scale, offsetY + centerY + 2 * margin * scale])
							.scale(canvasScale)
							.$result;

		var dimensionsB = {
			paths: {
					line1: new paths.Line([centerX + (Svig + Bvig + margin) * 0.5 * scale, offsetY + centerY - (Hvig + margin) * scale], 	[centerX + (Svig - Bvig - margin) * 0.5 * scale, offsetY + centerY - (Hvig + margin) * scale]), 
					line2: new paths.Line([centerX + (Svig + Bvig) * 0.5 * scale, offsetY + centerY - (Hvig + 1.5 * margin)  * scale], 	[centerX + (Svig + Bvig) * 0.5 * scale, offsetY + centerY - (Hvig + 0.5 * margin) * scale]), 
					line3: new paths.Line([centerX + (Svig - Bvig) * 0.5 * scale, offsetY + centerY - (Hvig + 1.5 * margin)  * scale], 	[centerX + (Svig - Bvig) * 0.5 * scale, offsetY + centerY - (Hvig + 0.5 * margin) * scale]), 
					}
		}
		
		dimensionsB = makerjs.$(dimensionsB)
							.addCaption('B (' + Bvig + ' cm)', [centerX +  Svig * 0.5 * scale, offsetY + centerY - (2 * margin + Hvig) * scale], [centerX + Svig * 0.5 * scale, offsetY + centerY - (2 * margin + Hvig) * scale])
							.scale(canvasScale)
					.$result;

		var dimensionsH = {
			paths: {
				line1: new paths.Line([centerX - (2 * margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY - (Hvig + margin * 0.5) * scale], 	[centerX - (2 * margin + (Svig + Bvig) * 0.5) * scale , offsetY + centerY + (Ecc + margin * 0.5) * scale]), 
				line2: new paths.Line([centerX - (1.5 * margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY], 	[centerX - (2.5 * margin + (Svig + Bvig) * 0.5) * scale , offsetY + centerY]), 
				line3: new paths.Line([centerX - (1.5 * margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY + Ecc * scale], 	[centerX - (2.5 * margin + (Svig + Bvig) * 0.5) * scale , offsetY + centerY + Ecc * scale]), 
				line4: new paths.Line([centerX - (1.5 * margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY - Hvig * scale], 	[centerX - (2.5 * margin + (Svig + Bvig) * 0.5) * scale , offsetY + centerY -Hvig * scale]), 
					
					}
		}
		
		dimensionsH = makerjs.$(dimensionsH)
							.addCaption('H (' + Hvig + ' cm)', [centerX - (2.5 * margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY - Hvig * scale], 	[centerX - (2.5 * margin + (Svig + Bvig) * 0.5) * scale , offsetY + centerY ])
							.scale(canvasScale)
					.$result;
		
		var dimensionsEcc = {
			paths: {
				line1: new paths.Line([centerX - (2 * margin + (Svig + Bvig) * 0.5) * scale, offsetY + centerY - (Hvig + margin * 0.5) * scale], 	[centerX - (2 * margin + (Svig + Bvig) * 0.5) * scale , offsetY + centerY + (Ecc + margin * 0.5) * scale]), 				
					}
		}
		
		dimensionsEcc = makerjs.$(dimensionsEcc)
							.addCaption('Ecc (' + Ecc + ' cm)', [centerX - (3.5 * margin + (Svig + Bvig) * 0.5) * scale , offsetY + centerY ], 	[centerX - (3.5 * margin + (Svig + Bvig) * 0.5) * scale , offsetY + centerY + Ecc * scale ])
							.scale(canvasScale)
					.$result;
										
		var detail = {
			models: {
				section: section,
				dimensionsS: dimensionsS,
				dimensionsB: dimensionsB,
				dimensionsH: dimensionsH,
				dimensionsEcc: dimensionsEcc
			}
		};
		return detail;
	}

	render() {

		const Bvig = parseFloat(this.props.Bvig)?parseFloat(this.props.Bvig):1;
		const Hvig = parseFloat(this.props.Hvig)?parseFloat(this.props.Hvig):1;
		const Svig = parseFloat(this.props.Svig)?parseFloat(this.props.Svig):1;
		const Ecc = parseFloat(this.props.Ecc)?parseFloat(this.props.Ecc):1;
		const Dcon = parseFloat(this.props.Dcon)?parseFloat(this.props.Dcon):1;
		const Smin = parseFloat(this.props.Smin)?parseFloat(this.props.Smin):1;
		const Smax = parseFloat(this.props.Smax)?parseFloat(this.props.Smax):1;
		const Hcon = parseFloat(this.props.Hcon)?parseFloat(this.props.Hcon):1;
		const Pcon = parseFloat(this.props.Pcon)?parseFloat(this.props.Pcon):1;
		const Pangle = parseFloat(this.props.Pangle)?parseFloat(this.props.Pangle):1;
		var canvasHeight = this.state.height;
		var canvasWidth = this.state.width;
		var textHeight =  0.45 * canvasWidth / Svig;

		const mod = this.drawSvg(Bvig, Hvig, Svig, Ecc, Dcon, Smin, Smax, Hcon, Pcon, Pangle, canvasHeight, canvasWidth);
		mod.units = unitType.Millimeter;

		const dxfString = exporter.toDXF(mod, {fontSize: 5});

		const downloadTxtFile = () => {
			const element = document.createElement("a");
			const file = new Blob([dxfString], {
			  type: "text/plain"
			});

			element.href = URL.createObjectURL(file);
			element.download = "esquema.dxf";
			document.body.appendChild(element);
			element.click();
		  };
		
		const sketchStyleObj = {
			color: 'white',
			backgroundColor: 'gray',
			height: '500px',
			maxWidth: '100%',
		  };

		return (
			<div>	
				<Col>
					<h3>Esquema</h3>
					<div 
						className="content"
						ref={ (divElement) => { this.divElement = divElement } }
						dangerouslySetInnerHTML={ {__html: exporter.toSVG(mod, {fontSize: textHeight} )}} style={sketchStyleObj} 
					/>
					<Button onClick={downloadTxtFile}>Descargar DXF</Button>
					Size: width: <b>{this.state.width}px</b>, height: <b>{this.state.height}px</b>
				</Col>
			</div>
	  	);
	}
  }

  export default CrossSection;