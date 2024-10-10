const { exec } = require('child_process');
const { readFileSync } = require('fs');
const { red, yellow, blue, green, magenta, greenBright } = require('colorette');

const packageJson = JSON.parse(readFileSync(__dirname + '../../../package.json', 'utf8'));
const currentVersion = packageJson.version;

exec(`npm show ${packageJson.name} version`, (err, stdout, stderr) => {
    if (err || stderr) {
        console.error(red('Error checking for latest version:'), red(err || stderr));
        return;
    }
    const latestVersion = stdout.trim();
    if (currentVersion !== latestVersion) {
        console.warn(
            yellow('WARNING:'),
            `You are using an outdated version of ${blue(packageJson.name)}.\n`,
            `Current version: ${red(currentVersion)},`,
            `Latest version: ${green(latestVersion)}.\n`,
            `Please update to the latest version by doing`,
            magenta('npm update agenthyped-simulation'),
            `or`,
            magenta(`npm i agenthyped-simulation@${latestVersion}\n`),
            `The latest version insures`,
            greenBright('bug fixes'),
            `and`,
            greenBright('new features.'),
        );
    }
});