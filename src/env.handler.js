const fs = require('fs');
const logger = require('./log.handler');

let _configPath = './.env.local';
const _configExists = () => fs.existsSync(_configPath);
const _isObject = (value) => value && typeof value === 'object' && value.constructor === Object;

const _handleUpdate = (value, section, data) => {
    let sectionIndex, valueIndex;
    // TODO: Further optimization
    data.forEach((line, index) => {
        if (section.trim() !== '' && line.includes(section) && sectionIndex === undefined) {
            sectionIndex = index;
        }
        if (value.trim() !== '' && line.split('=')[0] === value && valueIndex === undefined) {
            valueIndex = index;
        }
    });

    if (sectionIndex === undefined && section != '') {
        data.push(`# ${section}`);
    }

    if (valueIndex === undefined && value.trim() !== '') {
        (sectionIndex === undefined) ? data.push(`${value}=`) : data.splice(sectionIndex + 1, 0, `${value}=`);
    }

    return data;
}

const _makeTemplateAndUpdateConfig = (data, existingConfig) => {
    return {
        template:
            [].concat(...data.map(value => {
                if (_isObject(value)) {
                    const { '__comment': comment = '', values = [''] } = value;
                    const section = values.map(name => {
                        existingConfig = _handleUpdate(name, comment, existingConfig);
                        return `${name}=`;
                    });
                    return [`# ${comment}`, ...section];
                } else {
                    existingConfig = _handleUpdate(value, '', existingConfig);
                    return `${value}=`
                }
            })), configToWrite: existingConfig
    }
};

const _handleRemoval = (configToWrite, template) =>
    configToWrite.filter(existingLine =>
        template.findIndex(line => ((existingLine.startsWith('#') && existingLine.includes(line))
            || existingLine.split("=")[0] === line.split("=")[0])) >= 0);

const _generate = (data, shouldClobber) => {
    let existingConfig = ((_configExists()) ? fs.readFileSync(_configPath, 'utf8').split('\n') : []);

    let { template, configToWrite } = _makeTemplateAndUpdateConfig(data, existingConfig);

    if (shouldClobber && configToWrite.join('') !== '') {
        configToWrite = _handleRemoval(configToWrite, template);
    }

    fs.writeFileSync(_configPath, configToWrite.join('\n'));
}

const makeConfig = (shouldClobber, overrideName) => {
    if (!fs.existsSync('./package.json')) {
        return logger.error("No package.json file exists in the executing directory. Have you ran npm init?");
    }

    const envData = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

    if (envData.env === null || envData.env === undefined) {
        return logger.error("env section could not be found in package.json");
    } else if (!Array.isArray(envData.env)) {
        return logger.error("env must be an array of values or objects");
    }

    _configPath = `./${overrideName}`;

    _generate(envData.env, shouldClobber, overrideName);
}

module.exports = {
    makeConfig
};