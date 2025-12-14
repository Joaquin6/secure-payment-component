# Known Security Warnings

### `An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing`

> The warning "An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing" indicates a potential security vulnerability in your iframe's sandbox configuration. When both allow-scripts and allow-same-origin are present in the sandbox attribute, a script running within the iframe can bypass the same-origin policy. This means the script could potentially access or modify the parent document's DOM, cookies, and other data, effectively "escaping" the sandbox and compromising the security intended by the iframe. This combination essentially negates the security benefits of sandboxing.
- This is in play since we are in development running in `http://localhost`. This would not be an issue if this ran in a production environment where the origins would defer.