# Suwatte CLI Tool

## Installation

```sh
npm i -g @suwatte/cli
```

## Usage

```sh
Suwatte Development Tools.

Options:
  -V, --version    output the version number
  -h, --help       display help for command

Commands:
  build [options]  Builds valid runners in project directory.
  serve [options]  Builds & Serves a List on the local network.
  help [command]   display help for command
```

## Commands

### `daisuke build`

```sh
Usage: daisuke build [options]

Builds valid runners in project directory.

Options:
  --noList    Skips generating the runner list.
  -h, --help  display help for command
```


### `daisuke serve`

```sh
Usage: daisuke serve [options]

Serves a built source list

Options:
  -p, --port <string>  Port to run the server
  -h, --help           display help for command
```