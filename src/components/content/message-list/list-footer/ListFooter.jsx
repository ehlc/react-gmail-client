import React, { PureComponent } from "react";

export class Footer extends PureComponent {
  render() {
    const { messagesTotal } = this.props;
    let totalLabel = '';
    if (messagesTotal > 0) {
      totalLabel = `${messagesTotal.toLocaleString()} messages`;
    }

    return (
      <div className="mt-auto p-2  list-footer">
        <div className="d-flex px-4 h-100 align-items-center">
          <div className="total-count">{totalLabel}</div>

          <div className="ml-auto "></div>
        </div>
      </div>
    );
  }
}

export default Footer;
