export default class SecurePaymentForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.__setupListener();
    }

    static get observedAttributes() {
        return ['title'];
    }

    connectedCallback() {
        console.log('Component added to the page');
    }

    disconnectedCallback() {
        console.log('Component removed from the page');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Shortstack Component Attribute ${name} has changed.
        - Old Value: ${oldValue}
        - New Value: ${newValue}
        `);

        this.render();
        this.__setupListener();
    }

    render() {
        const title = this.getAttribute('title') || 'Untitled Form';

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                margin-inline: auto;
                display: block;
                max-width: 400px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                overflow: hidden;
                background: #fff;
                font-family: Arial, sans-serif;
            }

            .header {
                background: #0d6efd;
                color: white;
                padding: 12px 16px;
                font-size: 1.2rem;
                font-weight: bold;
            }

            .body {
                padding: 16px;
                color: #333;
            }

            ::slotted(img) {
                width: 100%;
                display: block;
                border-bottom: 1px solid #eee;
            }
        </style>

        <div class="header">${title}</div>
        <div class="body">
            <slot></slot>
            <form id="payment-form" action="/api/submit" method="post">
                <label>
                    Cardholder name
                    <input type="text" name="cardholder_name" required />
                </label>

                <!-- Provider-managed iframes for card data -->
                <div id="card-number"></div>
                <div id="card-expiry"></div>
                <div id="card-cvv"></div>

                <button type="submit" id="submit-button">Submit</button>
            </form>
            <iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                src="https://platform.twitter.com/widgets/tweet_button.html"
                style="border: 0; width:130px; height:20px;"></iframe>
        </div>
        `;
    }

    __setupListener() {
        const iframe = document.getElementById("payment-iframe");
        const form = this.shadowRoot.children[2].children[1];
        const tokenInput = document.getElementById("payment_token");
        const payButton = document.getElementById("submit-button");
        const errorEl = document.getElementById("error");

        // In production, replace with the real, exact origin of your PSP iframe
        const GATEWAY_ORIGIN = "http://localhost:3000";

        // Listen for postMessage events from the iframe
        window.addEventListener("message", function (event) {
            if (event.origin !== GATEWAY_ORIGIN) {
                return;
            }

            console.log(event);

            const data = event.data || {};

            // Example message contract from the PSP iframe:
            // { type: "ready" }
            // { type: "token_created", token: "tok_123" }
            // { type: "error", message: "Card declined" }

            if (data.type === "ready") {
                payButton.disabled = false;
            }

            if (data.type === "token_created") {
                errorEl.textContent = "";
                tokenInput.value = data.token; // put token in hidden input
                form.submit();                 // submit to your backend
            }

            if (data.type === "error") {
                errorEl.textContent = data.message || "Payment error";
                payButton.disabled = false;
            }
        });

        // When user clicks Pay, ask iframe to tokenize
        form.addEventListener("submit", function (e) {
            // If we do not have a token yet, prevent default and request one
            if (!tokenInput.value) {
                e.preventDefault();
                errorEl.textContent = "";
                payButton.disabled = true;

                // Message contract: tell iframe to tokenize the card details it holds
                iframe.contentWindow.postMessage({ type: "tokenize" }, GATEWAY_ORIGIN);
            }
        });
    }
}
