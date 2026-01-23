# Mock Server Documentation

This document gives a quickstart for running the mock server

## Running the mock server

The mock server can be run using the following command:

```bash
node mock/server.js --type B23 -p 8080 -h 0.0.0.0
```

The `-p, --port` argument is optional and defaults to `5020`

The `-h, --host` argument is optional and defaults to `127.0.0.1`

The `--type` argument is required. The following types are supported:
- [x] B23
- [x] B24
- [x] M1M20
- [x] M4M20
- [x] REU615
