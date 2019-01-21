import React, { PureComponent } from "react";
import "./header.scss";
import Signout from "../signout/Signout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import debounce from "lodash/debounce";

export class Header extends PureComponent {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.performSearch = debounce(this.performSearch.bind(this), 1000);
  }

  handleSearchClick(evt) {
    if (this.props.searhQuery !== "") {
      this.performSearch();
    }    
  }

  handleInputChange(evt) {
    this.props.setSearchQuery(evt.target.value);  
    this.performSearch();
  }

  performSearch() {
    const searchParams = {}
    if (!this.props.searchQuery || this.props.searchQuery === "") {
      searchParams.labelIds = ["INBOX"];
    }
    this.props.getLabelMessages({...searchParams})
  }

  render() {
    const userInfo = this.props.googleUser.w3;
    const email = userInfo.U3;
    const fullName = userInfo.ig;
    const picUrl = userInfo.Paa;

    return (
      <header className="d-flex p-3 align-content-center align-items-center header">
        <div className="header-logo justify-content-center">
          <Link to="/inbox">REACT GMAIL CLIENT</Link>
        </div>

        <div className="header-search">
          <div className="input-group w-75 ml-1 mr-auto">
            <input
              type="search"
              className="form-control border-light"
              placeholder="Search mail"
              value={this.props.searchQuery}
              onChange={this.handleInputChange}
            />
            <div className="input-group-append" onClick={this.handleSearchClick}>
              <button
                className="btn btn-light btn-outline-light bg-white text-dark"
                type="button"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
          <div>
            <span className="user-name" title={email}>
              {fullName}
            </span>

            <img className="mx-2 profile-pic" src={picUrl} alt="" />
          </div>
        </div>

        <Signout onSignout={this.props.onSignout} />
      </header>
    );
  }
}

export default Header;
