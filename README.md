# API Testing with Mocha & SuperTest

A JavaScript API test automation project using **Mocha, SuperTest, AJV, and Mochawesome**, tested against the [DummyJSON API](https://dummyjson.com/).

## Tech Stack

- **JavaScript (ES Modules) & Node.js**
- **Mocha** — test runner
- **SuperTest** — HTTP requests
- **AJV** — JSON Schema validation
- **Mochawesome** — HTML test reports
- **GitHub Actions** — CI

## Test Coverage

- Authentication: valid credentials, invalid credentials, missing and invalid tokens
- CRUD operations: GET, POST, PUT, and DELETE
- Query parameters, filtering, and pagination
- Positive, negative, and boundary testing
- Response status, headers, body, and JSON Schema validation

## Project Structure

```text
tests/
├── config/       # Environment and API configuration
├── helpers/      # Authentication and schema utilities
├── schemas/      # JSON Schemas
├── specs/        # API test specifications
└── testdata/     # Reusable test payloads
```

## Run Locally

Install dependencies:

```bash
npm ci
```

Create a `.env` file in the project root:

```env
BASE_URL=https://dummyjson.com
API_USERNAME=emilys
API_PASSWORD=emilyspass
```

Run tests:

```bash
npm test
```

Generate an HTML report:

```bash
npm run test:report
```

The Mochawesome report is generated in `mochawesome-report/`.

## CI

GitHub Actions runs the API tests on pushes and pull requests. The Mochawesome report is uploaded as a downloadable workflow artifact.

## Notes

DummyJSON is a practice API. Write operations simulate API behavior and do not guarantee persistent data changes.

**Related project:** [REST Assured API Testing](https://github.com/Myra-QA/rest-assured-api-testing)