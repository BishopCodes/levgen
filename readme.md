# Local Environment Variable Generator

Levgen is a small npm package that generates\updates an .env.local (default) file from configuration set in a projects package.json file. The purpose is to store the configuration keys in the package.json but not to have a .env file associated into source control.

## Local Config

To use add a env section in your package.json file

    ...
    "env": [
    {
      "__comment": "This is a header",
      "values": ["ENV_VALUE_ONE", "ENV_VALUE_TWO"]
    }],
    ...

The `env` section must be an array and can contain a mixture of strings and objects. If an object exists it must atleast contain a key named `values` declared as an array. The `__comment` key is optional but it will write that first before the values grouping them together.

## Running

As of npm 5.2.0 npx (nodes package runner) is available. Thus, there is no need to directly Install Levgen and instead can be ran in the terminal using

    npx levgen

## Options

    -v, --version      output the version number
    -c, --clobber      should values in env file be removed if they no longer exist in config (default: false)
    -n, --name [name]  override the output file name that env variables are written to (default: ".env.local")
    -h, --help         output usage information

### Usage

    npx levgen --clobber

## Note

This is a basic first itteration. Please report any bugs found and or make a pull request and I will get them resolved as soon as possible.

## Todo

> As of 09/07/2019

* Optimizations / Refactoring
* Better Error Handling
