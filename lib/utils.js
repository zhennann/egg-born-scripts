const urllib = require('urllib');
const semverDiff = require('semver-diff');
const chalk = require('chalk');
const boxen = require('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

const utils = {
  async versionCheck(moduleName, scene) {
    try {
      const httpClient = urllib.create();
      const url = `https://admin.cabloy.com/api/cabloy/store/util/version/${moduleName}/${scene}`;
      const options = {
        dataType: 'json',
        followRedirect: true,
        maxRedirects: 5,
        timeout: 20000,
      };
      const res = await httpClient.request(url, options);
      return res.data.data;
    } catch (err) {
      return null;
    }
  },
  versionPrompt(moduleName, moduleVersion) {
    try {
      if (!moduleVersion) return;
      const _pkg = require('cabloy/package.json');
      const diffType = semverDiff(_pkg.version, moduleVersion);
      if (!diffType) return;
      setTimeout(() => {
        // log
        let message = `[${chalk.keyword('cyan')(moduleName)}] new version available: ${chalk.keyword('yellow')(_pkg.version)} → ${chalk.keyword('orange')(moduleVersion)}`;
        message += `\nRun ${chalk.keyword('orange')('npm update')} to update!`;
        console.log('\n' + boxen(message, boxenOptions));
      }, 6000);
    } catch (err) { }
  },
};
module.exports = utils;
