# API Endpoints

As the application is running locally with `yarn dev`, you can run the following curl comands in another shell to test the API endpoints.

### POST `/api/ping`
Test the server is up and responding successfully.
```sh
curl --location --request POST 'http://localhost:3000/api/ping' \
--data ''
```
Example `200` Response:
```json
{
    "message": "pong"
}
```

### POST `/api/submit`
Submit CC details to the submit endpoint to mimic an actual payment transaction.
```sh
curl --location 'http://localhost:3000/api/submit' \
--header 'Content-Type: application/json' \
--data '{
    "cardNumber": "1234 5678 9123 4567",
    "expiryDate": "12 30"
}'
```
Example `200` Response:
```json
{
    "last4": "4567",
    "token": "tk_iik3g3apls5hmrso6berj9b7zs7q2em"
}
```