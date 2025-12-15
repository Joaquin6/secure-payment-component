import React, { Component } from 'react';

import './app.css';
import { fetchUsername } from './api';
import SecurePaymentForm from './components/secure-payment-form';

export default class App extends Component {
  state = { username: null };

  componentDidMount() {    
    fetchUsername()
      .then(user => this.setState({ username: user.username }))
      .then(() => customElements.define('secure-payment-form', SecurePaymentForm))
      .then(() => {
        // Listen for messages from payment iframe
        window.addEventListener('message', (event) => {
          const data = event.data || {};
          if (data.type === 'payment-success') {
            console.log('Payment iframe Message Recieved: ', event);
            const statusEl = document.getElementById('status');
            statusEl.className = 'status success show';
            statusEl.innerHTML = `
          <strong>✓ Payment Successful!</strong><br>
          Token: ${data.data.token}<br>
          Card ending in: ${data.data.last4}
        `;

            setTimeout(() => {
              statusEl.classList.remove('show');
            }, 5000);
          }

          // // Example message contract from the PSP iframe:
          // // { type: "ready" }
          // // { type: "token_created", token: "tok_123" }
          // // { type: "error", message: "Card declined" }

          // if (data.type === "ready") {
          //     payButton.disabled = false;
          // }

          // if (data.type === "token_created") {
          //     errorEl.textContent = "";
          //     tokenInput.value = data.token; // put token in hidden input
          //     form.submit();                 // submit to your backend
          // }

          // if (data.type === "error") {
          //     errorEl.textContent = data.message || "Payment error";
          //     payButton.disabled = false;
          // }
        });
      })
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
              <secure-payment-form height="400"></secure-payment-form>
            </div>
            <div className="info">
              <strong>ℹ️ Demo Mode:</strong> This is a demonstration. No real payment will be processed.
            </div>
            <div id="status" className="status"></div>
          </div>
        </div>
      </div>
    );
  }
}
