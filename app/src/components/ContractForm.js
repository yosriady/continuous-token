import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
 * Create component.
 */

class ContractForm extends Component {
  static getInputType(type) {
    switch (true) {
      case /^uint/.test(type):
        return 'number';
      case /^string/.test(type) || /^bytes/.test(type):
        return 'text';
      case /^bool/.test(type):
        return 'checkbox';
      default:
        return 'text';
    }
  }


  constructor(props, context) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.contracts = context.drizzle.contracts;

    // Get the contract ABI
    const { abi } = this.contracts[this.props.contract];

    this.inputs = [];
    const initialState = {};

    // Iterate over abi for correct function.
    for (let i = 0; i < abi.length; i++) {
      if (abi[i].name === this.props.method) {
        this.inputs = abi[i].inputs;

        for (let j = 0; j < this.inputs.length; j++) {
          initialState[this.inputs[j].name] = '';
        }

        break;
      }
    }

    this.state = initialState;
  }

  handleSubmit() {
    const contract = this.contracts[this.props.contract].methods[this.props.method];
    if (this.props.sendArgs) {
      return contract.cacheSend(...Object.values(this.state), this.props.sendArgs);
    }
    return contract.cacheSend(...Object.values(this.state));
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <form className="pure-form pure-form-stacked">
        {this.inputs.map((input, index) => {            
            const inputType = ContractForm.getInputType(input.type);
            const inputLabel = this.props.labels ? this.props.labels[index] : input.name;
            // check if input type is struct and if so loop out struct fields as well
            return (<input key={input.name} type={inputType} name={input.name} value={this.state[input.name]} placeholder={inputLabel} onChange={this.handleInputChange} />);
        })}
        <button key="submit" className="pure-button" type="button" onClick={this.handleSubmit}>Submit</button>
      </form>
    );
  }
}

ContractForm.contextTypes = {
  drizzle: PropTypes.object,
};
ContractForm.propTypes = {
  contract: PropTypes.string,
  method: PropTypes.string,
  sendArgs: PropTypes.shape({
    from: PropTypes.string,
    gasPrice: PropTypes.string,
    gas: PropTypes.number,
    value: PropTypes.number,
  }),
  labels: PropTypes.arrayOf(PropTypes.string),
};
ContractForm.defaultProps = {
  contract: null,
  method: null,
  sendArgs: null,
  labels: null,
};

const mapStateToProps = state => ({
  contracts: state.contracts,
});
export default drizzleConnect(ContractForm, mapStateToProps);
