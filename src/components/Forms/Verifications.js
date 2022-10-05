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
  constructor(props) {
    super(props);

  }
  render() {

    return (
        <div>
            <CardHeader>
              <Row>
                <h5 className="card-category">Comprobación</h5>
              </Row>

              <Row>
                <Col>
                  <CardTitle tag="h3">Estados Límite Últimos</CardTitle>
                  <Row>
                    <label>
                      Acciones de Corta Duración
                    </label>
                  </Row>
                  <Row>
                    <ul>
                      <li>Flexotracción: </li>
                        <ul>
                        <li style={{color: this.props.shortTermBending.compressionRatio > 1 ? "red" : "white"}}>Compresión Hormigón: {parseFloat(this.props.shortTermBending.compressionRatio).toFixed(2)}</li>
                        <li style={{color: this.props.shortTermBending.tensionRatio > 1 ? "red" : "white"}}>Tracción Hormigón: {parseFloat(this.props.shortTermBending.tensionRatio).toFixed(2)}</li>
                        <li style={{color: this.props.shortTermBending.woodFlexoTractionRatio > 1 ? "red" : "white"}}>Flexotracción en la madera: {parseFloat(this.props.shortTermBending.woodFlexoTractionRatio).toFixed(2)}</li>
                        </ul>
                      <li style={{color: this.props.shortTermShear > 1 ? "red" : "white"}}>Cortante: {parseFloat(this.props.shortTermShear).toFixed(2)}</li>
                      <li style={{color: this.props.shortTermUnions > 1 ? "red" : "white"}}>Uniones: {parseFloat(this.props.shortTermUnions).toFixed(2)}</li>
                    </ul>
          
                  </Row>
                  <Row>
                    <label>
                      Acciones de Larga Duración
                    </label>
                  </Row>
                  <Row>
                    <ul>
                      <li>Flexotracción: </li>
                        <ul>
                          <li style={{color: this.props.longTermBending.compressionRatio > 1 ? "red" : "white"}}>Compresión Hormigón: {parseFloat(this.props.longTermBending.compressionRatio).toFixed(2)}</li>
                          <li style={{color: this.props.longTermBending.tensionRatio > 1 ? "red" : "white"}}>Tracción Hormigón: {parseFloat(this.props.longTermBending.tensionRatio).toFixed(2)}</li>
                          <li style={{color: this.props.longTermBending.woodFlexoTractionRatio > 1 ? "red" : "white"}}>Flexotracción en la madera: {parseFloat(this.props.longTermBending.woodFlexoTractionRatio).toFixed(2)}</li>
                        </ul>                      
                      <li style={{color: this.props.longTermShear > 1 ? "red" : "white"}}>Cortante: {parseFloat(this.props.longTermShear).toFixed(2)}</li>
                      <li style={{color: this.props.longTermShear > 1 ? "red" : "white"}}>Uniones: {parseFloat(this.props.longTermShear).toFixed(2)}</li>
                    </ul>
                  </Row>
                </Col>
                <Col>
                  <CardTitle tag="h3">Estados Límite de Servicio</CardTitle>   
                  <Row>
                      <Label>Flecha:</Label>                      
                  </Row>
                  <ul>
                      <li style={{color: this.props.deflection < 240 ? "red" : "white"}}>L/240: {parseFloat(this.props.deflection).toFixed(0)}</li>
                  </ul>
                </Col>
              </Row>
            </CardHeader>  
        </div>
    );
  }
}

export default Verifications;