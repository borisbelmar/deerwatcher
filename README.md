# DeerWatcher

Powerful and simple tool for develop with local packages. DeerWatcher will watch your local packages and run your command when any changes are detected, restarting the process, like nodemon does.

> **Warning**: This project is under development and is not yet ready for production. This documentation is also WIP and may not be up to date with the current state of the project and may change in the future.

## Installation

```bash
npm install --save-dev deerwatcher

# or

yarn add --dev deerwatcher
```

### Configuration

Need to setup a configuration file in your project root.

```bash
# Create a configuration file
touch deerwatcher.json
```

Add the following configuration to your file, in packages you can add the packages that you want to watch, the key is the package name and the value is the local path to the package.

```json
{
  "command": "node ./server.js",
  "packages": {
    "@mypackage/hello-world": "path/to/project",
    "@mypackage/hello-world2": {
      "path": "path/to/project",
      "ignore": ["src"]
    }
  }
}
```

### CLI

You can use deerwatcher in your package.json scripts or run it directly in your terminal.

```json
{
  "scripts": {
    "dev": "deerwatcher"
  }
}
```

### Importing DeerWatcher in your code

You can import DeerWatcher in your code and use it as a library. If second argument is not provided, DeerWatcher will try to load the configuration from **deerwatcher.json** file.

```js
const DeerWatcher = require('deerwatcher');

DeerWatcher.startWatchers(
  () => {
    console.log('Package changed');
  }
  {
    '@mypackage/hello-world': 'path/to/project',
    '@mypackage/hello-world2': {
      path: 'path/to/project',
      ignore: ['src']
    }
  }
)
```
