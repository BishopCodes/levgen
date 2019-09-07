const fs = require('fs');
const localConfigPath = './.env.local';

const _configExists = () => fs.existsSync(localConfigPath);
const _isObject = (value) => value && typeof value === 'object' && value.constructor === Object;

const handleUpdate = (value, section, data) => {
    let sectionIndex, valueIndex;
    // Slight optimization than two findIndex
    // TODO: Further optimization
    data.forEach((line, index) => {
        if (section.trim() !== '' && line.includes(section) && sectionIndex === undefined) {
            sectionIndex = index;
        }
        if (value.trim() !== '', line.includes(value) && valueIndex === undefined) {
            valueIndex = index;
        }
    });

    if(sectionIndex === undefined && section != '') {
        data.push(`# ${section}`);
    }

    if (valueIndex === undefined && value.trim() !== '') {
        (sectionIndex === undefined) ? data.push(`${value}=`) : data.splice(sectionIndex + 1, 0, `${value}=`);
    }

    return data;
}

const handleRemoval = (configToUpdate, newConfig) =>
    configToUpdate.filter(existingLine => newConfig.findIndex(newLine => newLine === existingLine) >= 0);


const generate = (data, shouldClobber) => {
    let existingConfig = ((_configExists()) ? fs.readFileSync(localConfigPath, 'utf8').split('\n') : []);
    const config = data.map(value => {
        if (_isObject(value)) {
            const {'__comment': comment = '', values = []} = value;
            const section = values.map(name => {
                handleUpdate(name, comment, existingConfig);
                return `${name}=\n`;
            });
            return `# ${comment}\n${section.join('')}`
        } else {
            handleUpdate(value, '', existingConfig);
            return `${value}=\n`
        }
    });

    if (shouldClobber && existingConfig.join('') !== '') {
        existingConfig = handleRemoval(existingConfig, config);
    }

    const configToWrite = (existingConfig.join('') === '') ? config.join('') : existingConfig.join('\n');

    fs.writeFileSync(localConfigPath, configToWrite);
}

const makeConfig = (envData, shouldClobber) => {
    if (envData === null || envData === undefined) {
        console.error("env section could not be found in package.json");
        return;
    } else if (!Array.isArray(envData)) {
        console.error("env must be an array of values or objects");
        return;
    }

    generate(envData, shouldClobber);
}

module.exports = {
    makeConfig
};