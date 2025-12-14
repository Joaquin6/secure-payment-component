import React, { Component } from 'react';
import './app.css';
// import ReactImage from './react.png';
// import SecurePaymentForm from './components/secure-payment-form';
import PaymentFormIframe from './components/payment-form-iframe';

export default class App extends Component {
  state = { username: null };

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }))
      .then(() => customElements.define('payment-form-iframe', PaymentFormIframe))
      .then(() => {
        // Listen for messages from iframe
        window.addEventListener('message', (event) => {
          if (event.data.type === 'payment-success') {
            const statusEl = document.getElementById('status');
            statusEl.className = 'status success show';
            statusEl.innerHTML = `
          <strong>✓ Payment Successful!</strong><br>
          Amount: $${event.data.data.amount.toFixed(2)}<br>
          Card ending in: ${event.data.data.last4}
        `;

            setTimeout(() => {
              statusEl.classList.remove('show');
            }, 5000);
          }
        });
      })
    // .then(() => customElements.define('secure-payment-form', SecurePaymentForm))
  }

  render() {
    const { username } = this.state;
    return (
      <div className="container">
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}

        <div className="card">
          <div className="header">
            <h1>🔒 Secure Payment</h1>
            <p>Your payment information is protected</p>
          </div>
          <div className="content">
            <div className="iframe-container">
              <payment-form-iframe height="400"></payment-form-iframe>
            </div>
            <div className="info">
              <strong>ℹ️ Demo Mode:</strong> This is a demonstration. No real payment will be processed.
            </div>
            <div id="status" className="status"></div>
          </div>
        </div>

        {/* <img src={ReactImage} alt="react" /> */}
        {/* <secure-payment-form title="Secure Payment Form">
          <p>This form is rendered using a Shadow DOM and a customizable title.</p>
        </secure-payment-form> */}
      </div>
    );
  }
}
