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
  Col
} from "reactstrap";

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      fck: 30,
      fyk: 500,
      ClaseMadera: "C20",
      Ecc: 5,
      Lvig: 400,
      Bvig: 15,
      Hvig: 25,
      Svig: 60,
      Dcon: 25,
      Smin: 100,
      Smax: 110,
      Hcon: 100,
      Pcon: 50,
      Pforjado: 100,
      Pcm: 100,
      Puso: 200,
      gammaG: 1.35,
      gammaQ: 1.5,
      gammaV: 1.25,
      gammaC: 1.5,
      gammaM: 1.3,
      gammaS: 1.25
    }
    this.childToParent = this.childToParent.bind(this);
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
                      childToParent={this.childToParent}/>                
              </Card>
              <Card className="card-chart">
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
                      gammaG={this.state.gammaG}
                      gammaQ={this.state.gammaQ}
                      gammaV={this.state.gammaV}
                      gammaC={this.state.gammaC}
                      gammaM={this.state.gammaM}
                      gammaS={this.state.gammaS}
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
