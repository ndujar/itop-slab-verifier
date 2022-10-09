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
                <Col>
                  <h5 className="card-category">Comprobación</h5>
                </Col>
              </Row>

              <Row>
                <Col>
                  <CardTitle tag="h3">Estados Límite Últimos</CardTitle>
                  <Row>
                    <Col>
                      <label>
                        Acciones de Corta Duración
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <ul>
                      <li>Flexotracción: </li>
                        <ul>
                        <li style={{color: this.props.shortTermBending.compressionRatio > 1 ? "red" : "white"}}>Compresión Hormigón: {isNaN(this.props.shortTermBending.compressionRatio) ? "--" : parseFloat(this.props.shortTermBending.compressionRatio* 100).toFixed(0)}%</li>
                        <li style={{color: this.props.shortTermBending.tensionRatio > 1 ? "red" : "white"}}>Tracción Hormigón: {isNaN(this.props.shortTermBending.compressionRatio) ? "--" : parseFloat(this.props.shortTermBending.tensionRatio* 100).toFixed(0)}%</li>
                        <li style={{color: this.props.shortTermBending.woodFlexoTractionRatio > 1 ? "red" : "white"}}>Flexotracción en la madera: {isNaN(this.props.shortTermBending.compressionRatio) ? "--" : parseFloat(this.props.shortTermBending.woodFlexoTractionRatio* 100).toFixed(0)}%</li>
                        </ul>
                      <li style={{color: this.props.shortTermShear > 1 ? "red" : "white"}}>Cortante: {isNaN(this.props.shortTermShear) ? "--" : parseFloat(this.props.shortTermShear* 100).toFixed(0)}%</li>
                      <li style={{color: this.props.shortTermUnions > 1 ? "red" : "white"}}>Uniones: {isNaN(this.props.shortTermUnions) ? "--" : parseFloat(this.props.shortTermUnions* 100).toFixed(0)}%</li>
                    </ul>
          
                  </Row>
                  <Row>
                    <Col>
                      <label>
                        Acciones de Larga Duración
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <ul>
                      <li>Flexotracción: </li>
                        <ul>
                          <li style={{color: this.props.longTermBending.compressionRatio > 1 ? "red" : "white"}}>Compresión Hormigón: {isNaN(this.props.longTermBending.compressionRatio) ? "--" : parseFloat(this.props.longTermBending.compressionRatio * 100).toFixed(0)}%</li>
                          <li style={{color: this.props.longTermBending.tensionRatio > 1 ? "red" : "white"}}>Tracción Hormigón: {isNaN(this.props.longTermBending.tensionRatio) ? "--" : parseFloat(this.props.longTermBending.tensionRatio * 100).toFixed(0)}%</li>
                          <li style={{color: this.props.longTermBending.woodFlexoTractionRatio > 1 ? "red" : "white"}}>Flexotracción en la madera: {isNaN(this.props.longTermBending.woodFlexoTractionRatio) ? "--" : parseFloat(this.props.longTermBending.woodFlexoTractionRatio * 100).toFixed(0)}%</li>
                        </ul>                      
                      <li style={{color: this.props.longTermShear > 1 ? "red" : "white"}}>Cortante: {isNaN(this.props.longTermShear) ? "--" : parseFloat(this.props.longTermShear * 100).toFixed(0)}%</li>
                      <li style={{color: this.props.longTermUnions > 1 ? "red" : "white"}}>Uniones: {isNaN(this.props.longTermUnions) ? "--" : parseFloat(this.props.longTermUnions * 100).toFixed(0)}%</li>
                    </ul>
                  </Row>
                </Col>
                <Col>
                  <CardTitle tag="h3">Estados Límite de Servicio</CardTitle>   
                  <Row>
                      <Label>Acciones de Corta Duración:</Label>                      
                  </Row>
                  <ul>
                  <li style={{color: this.props.deflections.fratio < 240 ? "red" : "white"}}>L/240: {isNaN(this.props.deflections.fratio) ? "--" : parseFloat(this.props.deflections.fratio).toFixed(0)}</li>
                  </ul>
                  <Row>
                      <Label>Acciones de Larga Duración:</Label>                      
                  </Row>
                  <ul>
                  <li style={{color: this.props.deflections.fratioflu < 240 ? "red" : "white"}}>L/240: {isNaN(this.props.deflections.fratioflu) ? "--" : parseFloat(this.props.deflections.fratioflu).toFixed(0)}</li>
                  </ul>
                </Col>
              </Row>
            </CardHeader>  
        </div>
    );
  }
}

export default Verifications;