## Multi-dimensional Visualization of Nepal's Risk Index

## Data Sources
This visualization uses data sources available on the [Humanitarian Data Exchange](https://data.hdx.rwlabs.org/group/nepal-earthquake) site. The breakdown of sources are:

### Boundaries
* Admin 0: https://data.hdx.rwlabs.org/dataset/nepal-admin-level-0-administrative-boundaries-cod
* Admin 1: https://data.hdx.rwlabs.org/dataset/nepal-admin-level-1-administrative-boundaries-cod
* Admin 2: https://data.hdx.rwlabs.org/dataset/nepal-admin-level-2-administrative-boundaries-cod
* Admin 3: https://data.hdx.rwlabs.org/dataset/nepal-admin-level-3-administrative-boundaries-cod
* Admin 4: https://data.hdx.rwlabs.org/dataset/nepal-admin-level-4-administrative-boundaries-cod
* Admin 5: https://data.hdx.rwlabs.org/dataset/nepal-admin-level-5-administrative-boundaries-cod

### Tabular data
* Severity index: https://data.hdx.rwlabs.org/dataset/nepal-earthquake-severity-index

## Setup
Clone this repository and run the `setup.sh` script on your machine:

```shell
$ git clone http://github.com/luiscape/hdxviz-nepal-earthquake-risk-index
$ cd hdxviz-nepal-earthquake-risk-index
$ ./setup.sh
```

This should setup everything you need.

## Usage
After setup, run the `run.sh` script:

```shell
$ ./run.sh
```

This should start a loal HTTP server, usually on port 8080.