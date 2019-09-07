# Envmake

Envmake is a small npm package that generates\updates an .env.local file from configuration set in a projects package.json file. The purpose is to store the configuration keys in the package.json but not to have a .env file associated into source control.

## Local Config

To use add a env section in your package.json file

    ...
    "env": [
    {
      "__comment": "This is a header",
      "values": ["ENV_VALUE_ONE", "ENV_VALUE_TWO"]
    }],
    ...

The `env` section must be an array and can contain a mixture of strings and objects. If an object exists it mist atleast contain a key named `values` declared as an array. The `__comment` key is optional but it will write that first before the values grouping them together.

## Running

As of npm 5.2.0 npx (nodes package runner) is available. Thus, there is no need to directly install Envmake and instead can be ran in the terminal using

    npx envmake

## Options

`--no-clobber` does not remove values no longer found in package.json in .local.env

    npx envmake --no-clobber

## Todo

> As of 09/06/2019
* Optimizations / Refactoring
* Better Error Handling
