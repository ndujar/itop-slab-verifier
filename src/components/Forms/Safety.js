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
              <Row>
                <h5 className="card-category">Coeficientes de Seguridad</h5>
              </Row>

              <Row>
                <Col>
                  <CardTitle tag="h2">Mayoracion</CardTitle>
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
                  <CardTitle tag="h2">Minoracion</CardTitle>   
                  <Row>
                    <label>
                      Elementos de union
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
                      Hormigon
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
                      Pernos
                      <Input
                        name="gammaS"
                        defaultValue={this.props.gammaS}
                        type="number"
                        onChange={this.onInputchange}
                      />
                    </label>
                  </Row>
                </Col>
              </Row>
            </CardHeader>  
        </div>
    );
  }
}

export default Safety;