import { Component } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { withRouter } from "../components/withRouter";
import "../styles/login.css";

interface LoginProps {
  navigate: (path: string) => void; // Add the navigate prop
}

interface State {
  name: string;
  pass: string;
  showSubmitError: boolean;
  errorMsg: string;
  isPasswordVisible: boolean;
}

class Login extends Component<LoginProps, State> {
  state: State = {
    name: "",
    pass: "",
    showSubmitError: false,
    errorMsg: "",
    isPasswordVisible: false,
  };

  onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: event.target.value,
      showSubmitError:false
    });
  };

  onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      pass: event.target.value,
      showSubmitError:false
    });
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };

  renderPasswordField = () => {
    const { pass, isPasswordVisible } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type={isPasswordVisible ? "text" : "password"}
          id="password"
          value={pass}
          onChange={this.onChangePassword}
          className="password-input-field"
          placeholder="Password"
        />
      </>
    );
  };

  renderUsernameField = () => {
    const { name } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          onChange={this.onChangeUsername}
          className="username-input-field"
          placeholder="Username"
          value={name}
        />
      </>
    );
  };

  settingCookies = (token: string) => {
    Cookies.set("jwt_token", token, { expires: 1 });
    this.props.navigate("/");
  };

  onSubmitFailure = (errorMsg: string) => {
    this.setState({
      showSubmitError: true,
      errorMsg,
    });
  };

  submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name, pass } = this.state;
    if(name==="rohith" && pass==="rohith@123"){

    const username="rahul"
    const password="rahul@2021"
    const userDetails = { username, password };

    const url = "https://apis.ccbp.in/login";
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      this.settingCookies(data.jwt_token);
      this.setState({name:'',pass:''})
    } else {
      this.onSubmitFailure(data.error_msg);
    }
    }else{
      this.setState({showSubmitError:true,errorMsg:'Invalid Credentials'})
    }
  };

  render(): React.ReactNode {
    const { showSubmitError, errorMsg, isPasswordVisible } = this.state;
    const jwtToken = Cookies.get("jwt_token");

    if (jwtToken !== undefined) {
      return <Navigate to="/" />;
    }

    return (
      <div className="login-form-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            className="login-website-logo-mobile-img"
            alt="website logo"
          />
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <div className="checkbox">
            <input
              id="checkBox"
              type="checkbox"
              checked={isPasswordVisible}
              onChange={this.togglePasswordVisibility}
            />
            <label htmlFor="checkBox">Show Password</label>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">{showSubmitError?`*${errorMsg}`:''}</p>}
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
