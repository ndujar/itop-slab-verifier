/*!

=========================================================
* Black Dashboard React v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
// nodejs library that concatenates classes
import MaterialProperties from "../components/Forms/MaterialProperties";
import Geometry from "../components/Forms/Geometry";
import Loads from "../components/Forms/Loads";
import Safety from "../components/Forms/Safety";
import CrossSection from "../components/Drawings/CrossSection";
import Verifications from "../components/Forms/Verifications";

// reactstrap components
import {
  Card,
  Row,
  Col,
  Button
} from "reactstrap";

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      fck: 25,
      fyk: 500,
      ClaseMadera: "C20",
      ClaseServicio: "1",
      Ecc: 6,
      Lvig: 515,
      Bvig: 15,
      Hvig: 20,
      Svig: 65,
      Dcon: 12,
      Smin: 50,
      Smax: 100,
      Hcon: 50,
      Pcon: 100,
      Pangle: 90,
      Pforjado: 1.5,
      Pcm: 1.5,
      Puso: 2,
      gammaG: 1.35,
      gammaQ: 1.5,
      gammaV: 1.3,
      gammaC: 1.5,
      gammaM: 1.3,
      gammaS: 1.15,
      gammaMb: 1.25,
      shortTermBending:{
        compressionRatio:'N/A',
        tensionRatio:'N/A',
        woodFlexoTractionRatio:'N/A'},
      shortTermShear:'N/A',
      shortTermUnions:'N/A',
      longTermBending:{
          compressionRatio:'N/A',
          tensionRatio:'N/A',
          woodFlexoTractionRatio:'N/A'},
      longTermShear:'N/A',
      longTermUnions:'N/A',
      deflection:'N/A'
    }
    this.childToParent = this.childToParent.bind(this);

  }

  clickVerify = async (e) => {
    console.log('State:', this.state)
    const response = await fetch('/.netlify/functions/verify?' + new URLSearchParams(this.state)).then(
    response => response.json()
    )

  console.log(response)

  this.setState({
                shortTermBending: response.shortTermBending,
                shortTermShear: response.shortTermShear,
                shortTermUnions: response.shortTermUnions,
                longTermBending: response.longTermBending,
                longTermShear: response.longTermShear,
                longTermUnions: response.longTermUnions,
                deflection: response.deflection
              })
    console.log(this.state) 
}

  childToParent(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {

    return (
      <> 
        <div className="content">
          <Row>
            <Col xs="6">
              <Card className="card-chart">
                <MaterialProperties 
                      fck={this.state.fck}
                      fyk={this.state.fyk}
                      ClaseMadera={this.state.ClaseMadera}
                      ClaseServicio={this.state.ClaseServicio}
                      childToParent={this.childToParent}/>                
              </Card>
       
              <Card className="card-chart">
                <Loads 
                      Pforjado={this.state.Pforjado}
                      Pcm={this.state.Pcm}
                      Puso={this.state.Puso}
                      childToParent={this.childToParent}/>                
              </Card>
     
              <Card className="card-chart">
                <Safety 
                      gammaG={this.state.gammaG}
                      gammaQ={this.state.gammaQ}
                      gammaV={this.state.gammaV}
                      gammaC={this.state.gammaC}
                      gammaM={this.state.gammaM}
                      gammaS={this.state.gammaS}
                      gammaMb={this.state.gammaMb}
                      childToParent={this.childToParent}/>                
              </Card>
              <Card className="card-chart">
                <Button onClick={this.clickVerify} >Comprobar</Button>
                <Verifications 
                      fck={this.state.fck}
                      fyk={this.state.fyk}
                      ClaseMadera={this.state.ClaseMadera}
                      Pforjado={this.state.Pforjado}
                      Pcm={this.state.Pcm}
                      Puso={this.state.Puso}
                      Ecc={this.state.Ecc}
                      Lvig={this.state.Lvig}
                      Bvig={this.state.Bvig}
                      Hvig={this.state.Hvig}
                      Svig={this.state.Svig}
                      Dcon={this.state.Dcon}
                      Smin={this.state.Smin}
                      Smax={this.state.Smax}
                      Hcon={this.state.Hcon}
                      Pcon={this.state.Pcon}
                      Pangle={this.state.Pangle}
                      gammaG={this.state.gammaG}
                      gammaQ={this.state.gammaQ}
                      gammaV={this.state.gammaV}
                      gammaC={this.state.gammaC}
                      gammaM={this.state.gammaM}
                      gammaS={this.state.gammaS}
                      gammaMb={this.state.gammaMb}
                      shortTermBending={this.state.shortTermBending}
                      shortTermShear={this.state.shortTermShear}
                      shortTermUnions={this.state.shortTermUnions}
                      longTermBending={this.state.longTermBending}
                      longTermShear={this.state.longTermShear}
                      longTermUnions={this.state.longTermUnions}
                      deflection={this.state.deflection}
                      childToParent={this.childToParent}/>                  
              </Card>
            </Col>

  
            <Col xs="6">
              <Card className="card-chart">
                <Geometry 
                      Ecc={this.state.Ecc}
                      Lvig={this.state.Lvig}
                      Bvig={this.state.Bvig}
                      Hvig={this.state.Hvig}
                      Svig={this.state.Svig}
                      Dcon={this.state.Dcon}
                      Smin={this.state.Smin}
                      Smax={this.state.Smax}
                      Hcon={this.state.Hcon}
                      Pcon={this.state.Pcon}
                      Pangle={this.state.Pangle}
                      childToParent={this.childToParent}/> 
     
                <CrossSection Ecc={this.state.Ecc}
                      Lvig={this.state.Lvig}
                      Bvig={this.state.Bvig}
                      Hvig={this.state.Hvig}
                      Svig={this.state.Svig}
                      Dcon={this.state.Dcon}
                      Smin={this.state.Smin}
                      Smax={this.state.Smax}
                      Hcon={this.state.Hcon}
                      Pcon={this.state.Pcon} 
                      Pangle={this.state.Pangle} 
                      /> 
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
    }
}

export default Dashboard;
