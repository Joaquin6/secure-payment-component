import React, { Component } from 'react';
import './app.css';
// import ReactImage from './react.png';
import SecurePaymentForm from './components/secure-payment-form';

export default class App extends Component {
  state = { username: null };

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }))
      .then(() => customElements.define('secure-payment-form', SecurePaymentForm))
  }

  render() {
    const { username } = this.state;
    return (
      <div>
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
        {/* <img src={ReactImage} alt="react" /> */}
        <secure-payment-form title="Secure Payment Form">
          <p>This form is rendered using a Shadow DOM and a customizable title.</p>
        </secure-payment-form>
      </div>
    );
  }
}
