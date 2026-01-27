# miningos-wrk-powermeter-abb

MiningOS worker for managing ABB powermeters in mining operations - provides real-time power monitoring, energy consumption tracking, and alarm management for Bitcoin mining facilities through Modbus TCP communication.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Starting the Worker](#starting-the-worker)
6. [Mock Servers](#mock-servers)
7. [Architecture](#architecture)
8. [Registering Powermeters](#registering-powermeters)
9. [Development](#development)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)

## Overview

This worker extends the base `miningos-tpl-wrk-powermeter` template to provide ABB-specific powermeter integration:
- Communicates with ABB powermeters via Modbus TCP
- Collects real-time power, voltage, current, and energy data
- Supports multiple ABB powermeter models (B23, B24, M1M20, M4M20, REU615)
- Manages alarm configurations and monitoring
- Aggregates power statistics across sites and containers
- Integrates with MiningOS's P2P RPC network (Hyperswarm)

## Prerequisites

- Node.js >= 20.0
- Network access to ABB powermeters (Modbus TCP on port 502 or custom)
- Access to MiningOS Ork cluster (RPC public key required)
- Basic understanding of Modbus TCP protocol

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tetherto/miningos-wrk-powermeter-abb.git
cd miningos-wrk-powermeter-abb
```

2. Install dependencies:
```bash
npm install
```

3. Setup configuration files:
```bash
bash setup-config.sh
# For test configurations as well:
bash setup-config.sh --test
```

## Configuration

### Common Configuration (config/common.json)

Configure worker-level settings and powermeter-specific options:

```json
{
  "rack": "rack-0",
  "wtype": "wrk-powermeter-rack-b24",
  "env": "development",
  "thing": {
    "powermeter": {
      "timeout": 5000,
      "retries": 3
    }
  }
}
```

### Base Thing Configuration (config/base.thing.json)

Template for registering new powermeters:

```json
{
  "info": {
    "pos": "site",
    "container": "container-1",
    "description": "Main site power meter"
  },
  "opts": {
    "address": "192.168.1.100",
    "port": 502,
    "unitId": "0"
  }
}
```

**Thing Parameters:**
- `info.pos`: Position identifier (e.g., "site", "rack", "container")
- `info.container`: Container grouping for statistics
- `opts.address`: IP address of the ABB powermeter
- `opts.port`: Modbus TCP port (typically 502)
- `opts.unitId`: Modbus unit ID (typically "0")

### Network Configuration (config/facs/net.config.json)
Configure Hyperswarm network settings for RPC communication with Ork clusters.

### Modbus Configuration (config/facs/modbus_0.config.json)
Configure Modbus facility settings (timeouts, connection pooling, etc.).

## Starting the Worker

### Supported Worker Types

Each ABB powermeter model has its own worker type:
- `wrk-powermeter-rack-b23` - ABB B23 powermeters
- `wrk-powermeter-rack-b24` - ABB B24 powermeters
- `wrk-powermeter-rack-m1m20` - ABB M1M20 powermeters
- `wrk-powermeter-rack-m4m20` - ABB M4M20 powermeters
- `wrk-powermeter-rack-reu615` - ABB REU615 protection relays

### Development Mode

Using npm scripts (M1M20 model):
```bash
npm run worker
# Runs: node worker.js --wtype wrk-powermeter-rack-M1M20 --env development --rack rack-0
```

### Custom Configuration

```bash
node worker.js --wtype wrk-powermeter-rack-b24 --env production --rack rack-1
node worker.js --wtype wrk-powermeter-rack-m1m20 --env development --rack rack-0
node worker.js --wtype wrk-powermeter-rack-reu615 --env production --rack rack-2
```

**Command Parameters:**
- `--wtype`: Worker type (must match supported models)
- `--env`: Environment (development, production)
- `--rack`: Rack identifier for this worker instance

## Mock Servers

Mock servers simulate ABB powermeters for development and testing without physical hardware.

### Starting a Mock Server

```bash
# Using npm (M1M20 model, port 4008):
npm run mock

# Custom configurations:
node mock/server.js --type B24 -p 5020 -h 0.0.0.0
node mock/server.js --type M1M20 -p 4008 -h 127.0.0.1
node mock/server.js --type M4M20 -p 4009 -h 0.0.0.0 --mockControlPort 5009
node mock/server.js --type REU615 -p 5030 -h 0.0.0.0
```

**Mock Server Parameters:**
- `--type`: Powermeter model (B23, B24, M1M20, M4M20, REU615)
- `-p, --port`: Modbus TCP port (default: 5020)
- `-h, --host`: Host address (default: 127.0.0.1)
- `--mockControlPort`: Control port for mock agent (default: 9999)

### Mock Server Features

- Simulates Modbus register responses based on ABB specifications
- Provides realistic power, voltage, current readings
- Supports write operations for alarm configurations
- M4M20 mock intentionally fails 12.5% of requests to simulate real-world errors

### Testing with Mock Servers

1. Start a mock server:
```bash
node mock/server.js --type B24 -p 5020 -h 0.0.0.0
```

2. Start the worker in another terminal:
```bash
node worker.js --wtype wrk-powermeter-rack-b24 --env development --rack rack-0
```

3. Register the mock powermeter (see [Registering Powermeters](#registering-powermeters))

## Architecture

### Core Components

#### Worker Hierarchy
```
bfx-svc-boot-js (CLI framework)
  └─> miningos-tpl-wrk-powermeter (base template)
      └─> workers/lib/worker-base.js (ABB-specific base)
          └─> workers/[model].rack.powermeter.wrk.js (model workers)
              └─> workers/lib/models/[model].js (device control)
```

#### Worker Classes

**`workers/lib/worker-base.js`** - Base class for all ABB workers:
- Initializes Modbus facility (`svc-facs-modbus`)
- Manages thing connection lifecycle
- Implements snapshot collection
- Handles error recovery and reconnection
- Sets thing tags: `['abb']` and spec tags: `['powermeter']`

**Model-Specific Workers:**
- `workers/b23.rack.powermeter.wrk.js` - B23 implementation (uses B2X model)
- `workers/b24.rack.powermeter.wrk.js` - B24 implementation (uses B2X model)
- `workers/m1m20.rack.powermeter.wrk.js` - M1M20 implementation
- `workers/m4m20.rack.powermeter.wrk.js` - M4M20 implementation
- `workers/reu615.rack.powermeter.wrk.js` - REU615 implementation

#### Device Models (`workers/lib/models/`)

Device-specific control classes that implement:
- Modbus register mapping for each model
- `getSnap()` - Collects current readings
- Alarm configuration methods
- Reset operations (energy counters, logs, etc.)

#### Statistics Aggregation (`workers/lib/stats.js`)

Defines aggregation operations:
- **`site_power_w`**: Sums power for devices with `pos: 'site'`
- **`power_w_container_group_sum`**: Groups and sums power by container

### Thing Lifecycle

1. **Register**: Thing registered via RPC `registerThing` method
2. **Connect**: Worker creates model-specific instance with Modbus client
3. **Collect**: Periodically calls `getSnap()` to gather readings
4. **Error Handling**: Connection errors trigger automatic reconnection
5. **Disconnect**: Clean shutdown on worker stop or persistent errors

### Data Flow

1. Worker receives snapshot request from Ork
2. Calls `collectThingSnap(thg)` on registered thing
3. Device model reads Modbus registers
4. Data normalized to standard format
5. Statistics aggregated across things
6. Snapshot returned via RPC to Ork

## Registering Powermeters

Powermeters ("things") are registered to workers via RPC using the `hp-rpc-cli` tool.

### Prerequisites

- Worker must be running
- Worker's RPC public key (from worker logs or config)
- Powermeter must be network accessible

### Registration Command

```bash
hp-rpc-cli -s [WORKER_PUBLIC_KEY] -m registerThing -d '{
  "info": {
    "pos": "site",
    "container": "container-1",
    "description": "Main site power meter"
  },
  "opts": {
    "address": "192.168.1.100",
    "port": 502,
    "unitId": "0"
  }
}'
```

### Example: Register Mock Powermeter

```bash
hp-rpc-cli -s wrk -m registerThing -d '{
  "info": {},
  "opts": {
    "address": "127.0.0.1",
    "port": 5020,
    "unitId": "0"
  }
}'
```

### Verify Registration

Check worker logs for successful connection messages. The worker will attempt to connect to the powermeter and start collecting snapshots.

## Development

### Running Tests

```bash
npm test              # Run main integration test
npm run test:unit     # Run all unit tests
npm run lint          # Check code style (Standard.js)
npm run lint:fix      # Auto-fix linting issues
```

### Running Individual Tests

```bash
brittle tests/unit/stats.test.js
brittle tests/unit/m1m20.test.js
brittle tests/unit/b2x.test.js
brittle tests/unit/base.test.js
brittle tests/unit/utils.test.js
```

### Code Style

- **Standard.js**: JavaScript Standard Style (no semicolons, 2 spaces)
- **Strict Mode**: All files use `'use strict'`
- Run `npm run lint:fix` before committing

### Project Structure

```
.
├── config/                    # Configuration files
│   ├── common.json            # Worker configuration
│   ├── base.thing.json        # Thing template
│   └── facs/                  # Facility configs (net, modbus, storage)
├── workers/
│   ├── b23.rack.powermeter.wrk.js     # B23 worker
│   ├── b24.rack.powermeter.wrk.js     # B24 worker
│   ├── m1m20.rack.powermeter.wrk.js   # M1M20 worker
│   ├── m4m20.rack.powermeter.wrk.js   # M4M20 worker
│   ├── reu615.rack.powermeter.wrk.js  # REU615 worker
│   └── lib/
│       ├── worker-base.js     # ABB worker base class
│       ├── stats.js           # Statistics definitions
│       ├── alerts.js          # Alert handling
│       ├── models/            # Device-specific implementations
│       │   ├── base.js        # Base model class
│       │   ├── b2x.js         # B23/B24 model
│       │   ├── m1m20.js       # M1M20 model
│       │   ├── m4m20.js       # M4M20 model
│       │   └── reu615.js      # REU615 model
│       └── utils/             # Utility functions
├── mock/
│   ├── server.js              # Mock server entry point
│   └── mock-control-agent.js  # Mock control interface
├── tests/
│   ├── unit/                  # Unit tests
│   ├── schema/                # Schema validation tests
│   └── powermeter.test.js     # Integration tests
├── docs/
│   ├── abb.md                 # Common ABB API docs
│   ├── abb-b23.md             # B23 specific docs
│   ├── abb-b24.md             # B24 specific docs
│   └── mock.md                # Mock server docs
└── worker.js                  # Entry point
```

### ABB Powermeter API

Each model supports standard operations documented in `docs/`:

- **`getSnap()`** - Get current power readings
- **`resetPowerFailCounter()`** - Reset power fail counter
- **`resetPowerOutageTime()`** - Reset outage time
- **`resetSystemLog()`** - Reset system log
- **`resetEventLog()`** - Reset event log
- **`resetNetQualityLog()`** - Reset net quality log
- **`setAlarmConfig(alarmConfig)`** - Configure alarms (1-25)
- **`getAlarmConfig(index)`** - Get alarm configuration

See `docs/abb.md` for complete API reference.

## Troubleshooting

### Common Issues

1. **Cannot connect to powermeter**
   - Verify IP address and port in thing registration
   - Check network connectivity: `ping [POWERMETER_IP]`
   - Ensure Modbus TCP port (typically 502) is not blocked by firewall
   - Verify unit ID matches powermeter configuration
   - Check worker logs for connection errors

2. **Worker fails to start**
   - Run `bash setup-config.sh` to ensure config files exist
   - Check Node.js version: `node --version` (must be >= 20.0)
   - Verify all dependencies installed: `npm install`
   - Review worker logs for specific error messages

3. **Mock server not responding**
   - Ensure mock server is running: `ps aux | grep mock`
   - Verify port is not in use: `lsof -i :[PORT]`
   - Check host/port match in registration
   - Review mock server logs (use `DEBUG=* node mock/server.js ...`)

4. **Modbus timeout errors**
   - Increase timeout in `config/common.json` under `thing.powermeter.timeout`
   - Check network latency to powermeter
   - Verify powermeter is not overloaded with requests
   - Try reducing request frequency

5. **Test failures**
   - Ensure `NODE_ENV=test` is set
   - Run `bash setup-config.sh --test` to create test configs
   - Check for missing dependencies: `npm install`
   - Review specific test output for error details

6. **Statistics not aggregating**
   - Verify `info.pos` field is set correctly on things
   - Check `info.container` for container grouping
   - Ensure things are successfully collecting snapshots
   - Review `workers/lib/stats.js` filter functions

### Debug Mode

Enable debug logging:
```bash
DEBUG=* node worker.js --wtype wrk-powermeter-rack-b24 --env development --rack rack-0
DEBUG=mock node mock/server.js --type B24 -p 5020
```

## Contributing

Contributions are welcome and appreciated!

### How to Contribute

1. **Fork** the repository
2. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and ensure tests pass:
   ```bash
   npm test
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** describing what you changed and why

### Guidelines

- Follow Standard.js code style (`npm run lint`)
- Add tests for new functionality
- Keep PRs focused—one feature or fix per pull request
- Update documentation as needed (`docs/` and this README)
- Ensure all tests pass before submitting
- Test with mock servers before deploying to real hardware

### Areas for Contribution

- Support for additional ABB powermeter models
- Enhanced alarm management features
- Improved error recovery and reconnection logic
- Performance optimizations for Modbus communication
- Additional statistics aggregation operations
- Enhanced mock server features
- Documentation improvements
