import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import NotFound from "../not-found/NotFound";

import MessageList from "../content/message-list/MessageList";
import MessageContent from "../content/message-list/message-content/MessageContent";

import { Route, Switch, withRouter } from "react-router-dom";

import { getLabels } from "../sidebar/sidebar.actions";

import {
  getLabelMessages,
  emptyLabelMessages,
  toggleSelected,
  setPageTokens,
  addInitialPageToken,
  clearPageTokens,
  setSearchQuery
} from "../content/message-list/actions/message-list.actions";

import {selectLabel} from '../sidebar/sidebar.actions';
import {signOut} from '../../api/authentication';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


export class Main extends Component {
  constructor(props) {
    super(props);

    this.getLabelList = this.getLabelList.bind(this);
    this.getLabelMessages = this.getLabelMessages.bind(this);
    this.renderLabelRoutes = this.renderLabelRoutes.bind(this);
    this.loadLabelMessages = this.loadLabelMessages.bind(this);
    this.navigateToNextPage = this.navigateToNextPage.bind(this);
    this.navigateToPrevPage = this.navigateToPrevPage.bind(this);
    this.addInitialPageToken = this.addInitialPageToken.bind(this);
    this.onSignout = this.onSignout.bind(this);
  }

  componentDidMount() {
    /* Label list is fetched from here 
    so that we can declare Routes by labelId 
    before rendering anything else */
    this.getLabelList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.signedInUser !== this.props.signedInUser) {
      this.setState({
        signedInUser: this.props.signedInUser
      });
    }

    const {labels} = this.props.labelsResult;
    const {pathname} = this.props.location;
    const selectedLabel = labels.find(el => el.selected);
    const labelPathMatch = labels.find(el => el.id.toLowerCase() === pathname.slice(1));
    if (!selectedLabel) {
      if (labelPathMatch && this.props.searchQuery === "") {
        this.props.selectLabel(labelPathMatch.id);
      }      
    }
    else {
      if (labelPathMatch && selectedLabel.id !== labelPathMatch.id) {
        this.props.selectLabel(labelPathMatch.id);
      } 
    }
  }

  navigateToNextPage(token) {
    const searchParam = this.props.location.search;
    const currentToken = searchParam.indexOf("?") === 0 ? searchParam.slice(1) : "";
    this.props.setPageTokens({
      prevPageToken: currentToken
    });
    this.props.history.push(token);
  }

  navigateToPrevPage(token) {
    this.props.history.push(token);
  }

  loadLabelMessages(label) {
    const currentSearchQuery = this.props.searchQuery;
    this.props.clearPageTokens();
    this.props.selectLabel(label.id);    

    const newPathToPush = `/${label.id.toLowerCase()}`;

    if (currentSearchQuery && currentSearchQuery !== "") {
      this.props.setSearchQuery("");
      const {pathname} = this.props.location;
      if (newPathToPush === pathname) {
        this.getLabelMessages({labelIds: [label.id] });
        return;
      }
    }

    this.props.history.push(`/${label.id.toLowerCase()}`);
  }
  

  getLabelList() {
    this.props.getLabels();
  }

  getLabelMessages({labelIds, q, pageToken}) {
    this.props.emptyLabelMessages();    
    this.props.getLabelMessages({labelIds, q, pageToken});
  }


  addInitialPageToken(token) {
    this.props.addInitialPageToken(token);
  }

  renderLabelRoutes() {
    return this.props.labelsResult.labels.map(el => (
      <Route
        key={el.id + '_route'}
        exact
        path={"/" + el.id}
        render={props => {          
          const that = this;
          return (
            <MessageList
              {...props}
              getLabelMessages={this.getLabelMessages}
              messagesResult={this.props.messagesResult}
              toggleSelected={this.props.toggleSelected}
              navigateToNextPage={this.navigateToNextPage}
              navigateToPrevPage={this.navigateToPrevPage}
              pageTokens={this.props.pageTokens}
              addInitialPageToken={this.addInitialPageToken}
              parentLabel={that.props.labelsResult.labels.find(el => el.id === props.match.path.slice(1) )}
              searchQuery={this.props.searchQuery}
            />
          )
        }}
      />
    ));    
  }

  renderSpinner() {
    return (
      <div className="d-flex h-100 align-items-center justify-content-center">
        <FontAwesomeIcon icon={faSpinner} spin size="5x" />
      </div>
    )
  }

  onSignout() {
    const that = this;
    signOut().then(_ => {
      that.props.history.replace('inbox');
      window.location.reload(true);
    })
  }

  renderInboxViewport() {

    if (this.props.labelsResult.labels.length < 1) {
      return this.renderSpinner();
    }

    return (
      <Fragment>
        <Header googleUser={this.props.googleUser} 
          onSignout={this.onSignout} 
          setSearchQuery={this.props.setSearchQuery}
          getLabelMessages={this.getLabelMessages} 
          searchQuery={this.props.searchQuery}
        />
        <section className="main hbox space-between">
          <Sidebar
            getLabelList={this.getLabelList}
            pathname={this.props.location.pathname}
            labelsResult={this.props.labelsResult}
            onLabelClick={this.loadLabelMessages}
          />
          <article className="d-flex flex-column position-relative">
            <Switch>
              {this.renderLabelRoutes()}
              <Route
                exact
                path="/notfound"
                component={NotFound}
              />
              <Route
                exact
                path="/:id([a-zA-Z0-9]+)"
                component={MessageContent}
              />
            </Switch>
          </article>
        </section>
      </Fragment>
    );
  }

  render() {
    return this.renderInboxViewport();
  }
}

const mapStateToProps = state => ({
  labelsResult: state.labelsResult,
  messagesResult: state.messagesResult,
  pageTokens: state.pageTokens,
  searchQuery: state.searchQuery
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getLabels,
      getLabelMessages,
      emptyLabelMessages,
      toggleSelected,
      selectLabel,
      setPageTokens,
      addInitialPageToken,
      clearPageTokens,
      setSearchQuery
    },
    dispatch
  );

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Main);
