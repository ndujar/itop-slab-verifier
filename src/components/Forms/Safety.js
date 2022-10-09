import React, { Component } from "react";
// reactstrap components
import {
  Row,
  Col,
  CardHeader,
  Input,
  CardTitle
} from "reactstrap";

class Safety extends Component {
  constructor(props) {
    super(props);
    this.onInputchange = this.onInputchange.bind(this);

  }

  onInputchange(event) {
    this.props.childToParent(event);
  }
  

  render() {
  
    return (
        <div>
            <CardHeader>
              <Col>
                <Row>
                  <h5 className="card-category">Coeficientes de Seguridad</h5>
                </Row>

                <Row>
                  <Col>
                    <CardTitle tag="h3">Mayoración</CardTitle>
                    <Row>
                      <label>
                        Acciones Permanentes
                        <Input
                          name="gammaG"
                          defaultValue={this.props.gammaG}
                          type="number"
                          onChange={this.onInputchange}
                        />
                      </label>
                    </Row>
                    <Row>
                      <label>
                        Acciones Variables
                        <Input
                          name="gammaQ"
                          defaultValue={this.props.gammaQ}
                          type="number"
                          onChange={this.onInputchange}
                        />
                      </label>
                    </Row>
                  </Col>
                  <Col>
                    <CardTitle tag="h3">Minoración</CardTitle>   
                    <Row>
                      <label>
                        Hormigón
                        <Input
                          name="gammaC"
                          defaultValue={this.props.gammaC}
                          type="number"
                          onChange={this.onInputchange}
                        />
                      </label>
                    </Row>
                    <Row>
                      <label>
                        Madera en puntos de union
                        <Input
                          name="gammaV"
                          defaultValue={this.props.gammaV}
                          type="number"
                          onChange={this.onInputchange}
                        />
                      </label>
                    </Row>
                    <Row>
                      <label>
                        Madera
                        <Input
                          title="Madera"
                          name="gammaM"
                          defaultValue={this.props.gammaM}
                          type="number"
                          onChange={this.onInputchange}
                        />
                      </label>
                    </Row>
                    <Row>
                      <label>
                        Conectores con acero de armar
                        <Input
                          name="gammaS"
                          defaultValue={this.props.gammaS}
                          type="number"
                          onChange={this.onInputchange}
                        />
                      </label>
                    </Row>
                    <Row>
                      <label>
                        Conectores con tornillos calibrados
                        <Input
                          name="gammaMb"
                          defaultValue={this.props.gammaMb}
                          type="number"
                          onChange={this.onInputchange}
                        />
                      </label>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </CardHeader>  
        </div>
    );
  }
}

export default Safety;