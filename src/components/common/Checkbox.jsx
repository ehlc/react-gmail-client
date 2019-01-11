import React, {PureComponent} from 'react';
import './checkbox.scss';

export class Checkbox extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isChecked: !!props.checked
    }

    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.checked !== this.props.checked) {
      this.setState({
        isChecked: this.props.checked
      })
    }
  }

  onChange(evt) {
    this.setState({
      isChecked: !this.state.isChecked
    })
    this.props.onChange(evt);
  }

  render() {
    return (
      <label className="custom-control fill-checkbox">
        <input checked={this.state.isChecked} 
          type="checkbox" 
          onChange={this.props.onChange} 
          className="fill-control-input" 
        />
        <span className="fill-control-indicator" />
        {
          this.props.label ? (
            <span className="fill-control-description">
             {this.props.label}
            </span>
          ) : null
        }
      </label>
    )
  }
}

export default Checkbox;