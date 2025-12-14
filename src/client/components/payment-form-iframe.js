export default class PaymentFormIframe extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['height'];
    }

    connectedCallback() {
        const height = this.getAttribute('height') || '400';

        this.shadowRoot.innerHTML = `
          <style>
            iframe {
              width: 100%;
              height: ${height}px;
              border: none;
              display: block;
            }
          </style>
          <iframe id="payment-iframe" 
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
        `;

        const iframe = this.shadowRoot.getElementById('payment-iframe');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        const formHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px;
                background: #f9fafb;
              }
              .form-group {
                margin-bottom: 20px;
              }
              label {
                display: block;
                margin-bottom: 6px;
                font-weight: 600;
                font-size: 14px;
                color: #374151;
              }
              input {
                width: 100%;
                padding: 12px;
                border: 2px solid #e5e7eb;
                border-radius: 6px;
                font-size: 14px;
                transition: all 0.2s;
              }
              input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
              }
              .card-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
              }
              button {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
              }
              button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              }
              button:active {
                transform: translateY(0);
              }
              button:disabled {
                background: #9ca3af;
                cursor: not-allowed;
                transform: none;
              }
              .secure-badge {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 16px;
                font-size: 12px;
                color: #6b7280;
              }
              .secure-badge svg {
                width: 16px;
                height: 16px;
                margin-right: 6px;
              }
            </style>
          </head>
          <body>
            <form id="payment-form">
              <div class="form-group">
                <label for="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
              </div>
              
              <div class="form-group">
                <label for="cardName">Cardholder Name</label>
                <input type="text" id="cardName" placeholder="John Doe" required>
              </div>
              
              <div class="card-row">
                <div class="form-group">
                  <label for="expiry">Expiry Date</label>
                  <input type="text" id="expiry" placeholder="MM/YY" maxlength="5" required>
                </div>
                
                <div class="form-group">
                  <label for="cvv">CVV</label>
                  <input type="text" id="cvv" placeholder="123" maxlength="4" required>
                </div>
              </div>
              
              <button type="submit" id="submit-btn">
                Pay $99.00
              </button>
              
              <div class="secure-badge">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Secured with 256-bit SSL encryption
              </div>
            </form>

            <script>
              const form = document.getElementById('payment-form');
              const cardNumber = document.getElementById('cardNumber');
              const expiry = document.getElementById('expiry');
              const cvv = document.getElementById('cvv');
              const submitBtn = document.getElementById('submit-btn');

              // Format card number
              cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\\s/g, '');
                value = value.replace(/\\D/g, '');
                value = value.replace(/(\\d{4})/g, '$1 ').trim();
                e.target.value = value;
              });

              // Format expiry date
              expiry.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\\D/g, '');
                if (value.length >= 2) {
                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                e.target.value = value;
              });

              // CVV numeric only
              cvv.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\\D/g, '');
              });

              form.addEventListener('submit', (e) => {
                e.preventDefault();
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';

                // Simulate payment processing
                setTimeout(() => {
                  window.parent.postMessage({
                    type: 'payment-success',
                    data: {
                      amount: 99.00,
                      last4: cardNumber.value.slice(-4),
                      timestamp: new Date().toISOString()
                    }
                  }, '*');
                  
                  form.reset();
                  submitBtn.disabled = false;
                  submitBtn.textContent = 'Pay $99.00';
                }, 2000);
              });
            <\/script>
          </body>
          </html>
        `;

        iframeDoc.open();
        iframeDoc.write(formHTML);
        iframeDoc.close();
    }
}