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