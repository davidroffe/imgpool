import React from "react";
import { Route, Link, Redirect } from "react-router-dom";
import axios from "axios";
import CarList from "./CarList";
import CarDetail from "./CarDetail";
import MainMenu from "./MainMenu";
import Settings from "./Settings";

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      showMainMenu: false
    };
    this.toggle = this.toggle.bind(this);
    this.hide = this.hide.bind(this);
    this.logOut = this.logOut.bind(this);
  }
  componentDidMount() {
    // axios
    //   .get("/api/user")
    //   .then(function(response) {
    //     this.setState({ user: response });
    //   })
    //   .catch(function(error) {
    //     alert(error.message);
    //   });

    window.addEventListener("click", this.hide.bind(this, "showMainMenu"));
  }
  componentWillUnmount() {
    window.removeEventListener("click", this.hide.bind(this, "showMainMenu"));
  }
  toggle(name, stopPropagation = false, event) {
    if (stopPropagation) {
      event.stopPropagation();
    }
    const newValue = !this.state[name];
    let newState = {};

    newState[name] = newValue;

    this.setState(newState);
  }
  hide(name, event) {
    const newValue = false;
    let newState = {};

    newState[name] = newValue;

    this.setState(newState);
  }
  logOut() {
    axios
      .post("/api/logout")
      .then(() => this.props.history.push("/"))
      .catch(function(error) {
        console.log("error is " + error);
      });
  }
  render() {
    return (
      <div>
        <div id="top-nav">
          <div id="top-nav-left">
            <Link to="/panel" className="logo">
              <img src="/assets/img/tire-logo.png" alt="Tire logo" />
              <div>Track Setup</div>
            </Link>
          </div>
          <MainMenu
            show={this.state.showMainMenu}
            toggle={this.toggle.bind(this, "showMainMenu")}
            hide={this.hide.bind(this, "showMainMenu")}
            logOut={this.logOut}
          />
        </div>
        <div id="content">
          <Route path="/panel/cars" component={CarList} />
          <Route path="/panel/car/:carId" component={CarDetail} />
          <Route path="/panel/settings" component={Settings} />
          <Route
            exact
            path="/panel"
            render={() => <Redirect to="/panel/cars" />}
          />
        </div>
      </div>
    );
  }
}

export default Panel;
