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
              <Row>
                <h5 className="card-category">Cargas</h5>
              </Row>

              <Row>
                <Col>
                  <CardTitle tag="h2">Peso propio</CardTitle>
                  <Row>
                    <label>
                      Pforjado
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
                  <CardTitle tag="h2">Cargas muertas</CardTitle>   
                    <label>
                      Pcm
                      <Input
                        name="Pcm"
                        defaultValue={this.props.Pcm}
                        type="number"
                        onChange={this.onInputchange}
                      />
                    </label>  
                </Col>
                <Col>
                  <CardTitle tag="h2">Uso</CardTitle>
                    <Row>
                      <label>
                        Puso
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
            </CardHeader>  
        </div>
    );
  }
}

export default Loads;