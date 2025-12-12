export default class SecurePaymentForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
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
            <iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                src="https://platform.twitter.com/widgets/tweet_button.html"
                style="border: 0; width:130px; height:20px;"></iframe>
        </div>
        `;
    }
}
