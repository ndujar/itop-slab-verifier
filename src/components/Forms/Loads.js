import React, { Component } from "react";
// reactstrap components
import {
  Row,
  Col,
  Input,
  CardHeader,
  CardTitle
} from "reactstrap";

class Loads extends Component {
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
                  <h5 className="card-category">Cargas</h5>
                </Row>

                <Row>
                  <Col>
                    <CardTitle tag="h3">Peso propio</CardTitle>
                    <Row>
                      <label>
                        Pforjado (kN/m2)
                        <Input
                          name="Pforjado"
                          defaultValue={this.props.Pforjado}
                          type="number"
                          onChange={this.onInputchange}
                        />
                      </label>
                    </Row>
                  </Col>
                  <Col>
                    <CardTitle tag="h3">Cargas muertas</CardTitle>   
                      <label>
                        Pcm (kN/m2)
                        <Input
                          name="Pcm"
                          defaultValue={this.props.Pcm}
                          type="number"
                          onChange={this.onInputchange}
                        />
                      </label>  
                  </Col>
                  <Col>
                    <CardTitle tag="h3">Uso</CardTitle>
                      <Row>
                        <label>
                          Puso (kN/m2)
                          <Input
                            name="Puso"
                            defaultValue={this.props.Puso}
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

export default Loads;