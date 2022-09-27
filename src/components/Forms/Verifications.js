import React, { Component } from "react";

// reactstrap components
import {
  Row,
  Col,
  CardHeader,
  Label,
  CardTitle
} from "reactstrap";

class Verifications extends Component {
 
  render() {
    
    const fck = parseFloat(this.props.fck);
    const gammaC = parseFloat(this.props.gammaC);

    const tractionCoeff = fck > 50 ? 0.58 : 0.3;

    const fcd = fck / this.props.gammaC;
    const f1cd = fcd * 0.6;
    const fcm =  this.props.fck + 8;
    const fctm = tractionCoeff * fck**(2/3);
    const fctmd = fctm / gammaC;
    const fctfl = 0.37 * fck**(2/3);
    const Ec = 8500 * fcm**(1/3);
    const woodType = this.props.ClaseMadera;

    return (
        <div>
            <CardHeader>
              <Row>
                <h5 className="card-category">Verificacion</h5>
              </Row>

              <Row>
                <Col>
                  <CardTitle tag="h2">Estados Límite Últimos</CardTitle>
                  <Row>
                    <label>
                      Acciones de Corta Duración 
                      <br/>
                      <br/>
                      <Label>fcd:{fcd}</Label>
                      <br/>
                      <Label>f1cd:{f1cd}</Label>
                      <br/>
                      <Label>fcm:{fcm}</Label>
                      <br/>
                      <Label>fctm:{fctm}</Label>
                      <br/>
                      <Label>fctmd:{fctmd}</Label>
                      <br/>
                      <Label>fctfl:{fctfl}</Label>
                      <br/>
                      <Label>Ec:{Ec}</Label>
                      <br/>
                      <Label>Clase:{woodType}</Label>
                    </label>
                  </Row>
                  <Row>
                    <label>
                      Acciones de Larga Duración
                      <Label></Label>
                    </label>
                  </Row>
                </Col>
                <Col>
                  <CardTitle tag="h2">Estados Límite de Servicio</CardTitle>   
                  <Row>
                    <label>
                      Acciones de Corta Duración
                      <Label></Label>
                    
                    </label>
                  </Row>
                  <Row>
                    <label>
                      Acciones de Larga Duración
                      <Label></Label>
                    </label>
                  </Row>
                </Col>
              </Row>
            </CardHeader>  
        </div>
    );
  }
}

export default Verifications;