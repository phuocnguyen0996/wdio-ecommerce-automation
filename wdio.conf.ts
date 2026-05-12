import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { addAttachment } from '@wdio/allure-reporter';

interface StepLog {
    text: string;
    passed: boolean;
    duration: number;
    error?: string;
}

interface ScenarioLog {
    name: string;
    feature: string;
    tags: string;
    browser: string;
    startTime: Date;
    steps: StepLog[];
}

const scenarioLogs = new Map<string, ScenarioLog>();

function getScenarioKey(world: any): string {
    return world?.pickle?.id ?? world?.pickle?.name ?? 'unknown';
}

const LINE = '═'.repeat(64);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseEnvList(value?: string, fallback = ''): string[] {
  const raw = value?.trim().replace(/^['"]|['"]$/g, '') || fallback;
  return raw
    .split(',')
    .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

const specs = parseEnvList(process.env.SPECT, './features/*.feature');
const tagExpression = process.env.TAGS?.trim().replace(/^['"]|['"]$/g, '') || '';
const isCi = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

export const config: WebdriverIO.Config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    // WebdriverIO supports running e2e tests as well as unit and component tests.
    runner: 'local',
    tsConfigPath: './tsconfig.json',
    
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // of the configuration file being run.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // The path of the spec files will be resolved relative from the directory of
    // of the config file unless it's absolute.
    //
    specs: specs,
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 10,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://saucelabs.com/platform/platform-configurator
    //
    capabilities: [
        {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: isCi
                    ? ['--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
                    : []
            }
        },
        {
            browserName: 'firefox',
            'moz:firefoxOptions': {
                args: isCi ? ['-headless'] : []
            }
        },
        // {
        //     browserName: 'safari'
        // }
        // ,
        //  {
        //     browserName: 'MicrosoftEdge'
        // }
    ],

    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/lighthouse-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    // baseUrl: 'http://localhost:8080',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    // services: [],
    //
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'cucumber',
    
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableScreenshots: false
        }],
        ['video', {
            outputDir: 'allure-results',
            saveAllVideos: true,
            videoSlowdownMultiplier: 3
        }]
    ],

    // If you are using Cucumber you need to specify the location of your step definitions.
    cucumberOpts: {
        // <string[]> (file/dir) require files before executing features
        require: [
            './features/step-definitions/login.steps.ts',
            './features/step-definitions/inventory.steps.ts'
        ],
        // <boolean> show full backtrace for errors
        backtrace: false,
        // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        requireModule: [],
        // <boolean> invoke formatters without executing steps
        dryRun: false,
        // <boolean> abort the run on first failure
        failFast: false,
        // <string[]> Only execute the scenarios with name matching the expression (repeatable).
        name: [],
        // <boolean> hide step definition snippets for pending steps
        snippets: true,
        // <boolean> hide source uris
        source: true,
        // <boolean> fail if there are any undefined or pending steps
        strict: false,
        // <string> (expression) only execute the features or scenarios with tags matching the expression
        tagExpression: tagExpression,
        // <number> timeout for step definitions
        timeout: 60000,
        // <boolean> Enable this config to treat undefined definitions as warnings.
        ignoreUndefinedDefinitions: false
    },


    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    // onPrepare: function (config, capabilities) {
    // },
    /**
     * Gets executed before a worker process is spawned and can be used to initialize specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {object} specs    specs to be run in the worker process
     * @param  {object} args     object that will be merged with the main configuration once worker is initialized
     * @param  {object} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just after a worker process has exited.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {number} exitCode 0 - success, 1 - fail
     * @param  {object} specs    specs to be run in the worker process
     * @param  {number} retries  number of retries used
     */
    // onWorkerEnd: function (cid, exitCode, specs, retries) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     * @param {string} cid worker id (e.g. 0-0)
     */
    // beforeSession: function (config, capabilities, specs, cid) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {object}         browser      instance of created browser/device session
     */
    // before: function (capabilities, specs) {
    // },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Cucumber Hooks
     *
     * Runs before a Cucumber Feature.
     * @param {string}                   uri      path to feature file
     * @param {GherkinDocument.IFeature} feature  Cucumber feature object
     */
    // beforeFeature: function (uri, feature) {
    // },
    /**
     *
     * Runs before a Cucumber Scenario.
     * @param {ITestCaseHookParameter} world    world object containing information on pickle and test step
     * @param {object}                 context  Cucumber World object
     */
    beforeScenario: function (world: any, _context: any) {
        const key = getScenarioKey(world);
        const featureName = world?.gherkinDocument?.feature?.name ?? 'Unknown Feature';
        const tags = (world?.pickle?.tags ?? []).map((t: any) => t.name).join(' ') || '(none)';
        const browserName = (browser as any)?.capabilities?.browserName ?? 'unknown';

        scenarioLogs.set(key, {
            name: world?.pickle?.name ?? 'Unknown Scenario',
            feature: featureName,
            tags,
            browser: browserName,
            startTime: new Date(),
            steps: []
        });

        console.log(`\n${LINE}`);
        console.log(`  SCENARIO : ${world?.pickle?.name}`);
        console.log(`  FEATURE  : ${featureName}`);
        console.log(`  TAGS     : ${tags}`);
        console.log(`  BROWSER  : ${browserName}`);
        console.log(`  START    : ${new Date().toLocaleString('vi-VN')}`);
        console.log(LINE);
    },
    /**
     *
     * Runs before a Cucumber Step.
     * @param {Pickle.IPickleStep} step     step data
     * @param {IPickle}            scenario scenario pickle
     * @param {object}             context  Cucumber World object
     */
    beforeStep: function (step: any, _scenario: any, _context: any) {
        console.log(`\n  ▶ ${step?.text ?? ''}`);
    },
    /**
     *
     * Runs after a Cucumber Step.
     * @param {Pickle.IPickleStep} step             step data
     * @param {IPickle}            scenario         scenario pickle
     * @param {object}             result           results object containing scenario results
     * @param {boolean}            result.passed    true if scenario has passed
     * @param {string}             result.error     error stack if scenario failed
     * @param {number}             result.duration  duration of scenario in milliseconds
     * @param {object}             context          Cucumber World object
     */
    afterStep: async function (step: any, scenario: any, result: any, _context: any) {
        const key = scenario?.id ?? scenario?.name ?? 'unknown';
        const entry = scenarioLogs.get(key);
        const durationMs = Math.round((result.duration ?? 0) / 1_000_000);
        const passed = result.passed ?? !result.error;

        const statusIcon = passed ? '  ✔' : '  ✘';
        console.log(`${statusIcon} ${passed ? 'PASSED' : 'FAILED'} (${durationMs}ms)`);
        if (!passed && result.error) {
            const errLine = String(result.error).split('\n')[0];
            console.log(`     ERROR: ${errLine}`);
        }

        if (entry) {
            entry.steps.push({
                text: step?.text ?? '',
                passed,
                duration: durationMs,
                error: result.error ? String(result.error).split('\n')[0] : undefined
            });
        }

        if (!passed) {
            const screenshot = await browser.takeScreenshot();
            addAttachment('Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');
        }
    },
    /**
     *
     * Runs after a Cucumber Scenario.
     * @param {ITestCaseHookParameter} world            world object containing information on pickle and test step
     * @param {object}                 result           results object containing scenario results
     * @param {boolean}                result.passed    true if scenario has passed
     * @param {string}                 result.error     error stack if scenario failed
     * @param {number}                 result.duration  duration of scenario in milliseconds
     * @param {object}                 context          Cucumber World object
     */
    afterScenario: async function (world: any, result: any, _context: any) {
        const key = getScenarioKey(world);
        const entry = scenarioLogs.get(key);

        if (entry) {
            const passed = result.passed ?? !result.error;
            const totalSteps = entry.steps.length;
            const passedSteps = entry.steps.filter(s => s.passed).length;
            const failedSteps = totalSteps - passedSteps;
            const totalDuration = entry.steps.reduce((sum, s) => sum + s.duration, 0);
            const statusLabel = passed ? '✅ PASSED' : '❌ FAILED';

            // Console summary
            console.log(`\n${LINE}`);
            console.log(`  RESULT   : ${statusLabel}`);
            console.log(`  STEPS    : ${totalSteps} total | ${passedSteps} passed | ${failedSteps} failed`);
            console.log(`  DURATION : ${totalDuration}ms`);
            console.log(`  END      : ${new Date().toLocaleString('vi-VN')}`);
            console.log(`${LINE}\n`);

            // Build Allure text attachment
            let log = '';
            log += `SCENARIO : ${entry.name}\n`;
            log += `FEATURE  : ${entry.feature}\n`;
            log += `TAGS     : ${entry.tags}\n`;
            log += `BROWSER  : ${entry.browser}\n`;
            log += `START    : ${entry.startTime.toLocaleString('vi-VN')}\n`;
            log += `${'─'.repeat(64)}\n`;
            entry.steps.forEach((s, i) => {
                const icon = s.passed ? '✔' : '✘';
                log += `[${String(i + 1).padStart(2, '0')}] ${icon} ${s.text}  (${s.duration}ms)\n`;
                if (!s.passed && s.error) {
                    log += `       ERROR: ${s.error}\n`;
                }
            });
            log += `${'─'.repeat(64)}\n`;
            log += `RESULT   : ${statusLabel}\n`;
            log += `STEPS    : ${totalSteps} total | ${passedSteps} passed | ${failedSteps} failed\n`;
            log += `DURATION : ${totalDuration}ms\n`;
            log += `END      : ${new Date().toLocaleString('vi-VN')}\n`;

            addAttachment('Scenario Execution Log', log, 'text/plain');
            scenarioLogs.delete(key);
        }

        // Attach video to Allure report
        try {
            const videoDir = path.join(__dirname, '_results_');
            if (fs.existsSync(videoDir)) {
                const videos = fs.readdirSync(videoDir)
                    .filter(f => f.endsWith('.webm'))
                    .sort((a, b) => fs.statSync(path.join(videoDir, b)).mtime.getTime() -
                                   fs.statSync(path.join(videoDir, a)).mtime.getTime());

                if (videos.length > 0) {
                    const latestVideo = path.join(videoDir, videos[0]);
                    if (fs.existsSync(latestVideo)) {
                        const videoBuffer = fs.readFileSync(latestVideo);
                        await addAttachment('Test Execution Video', videoBuffer, 'video/webm');
                    }
                }
            }
        } catch (error: any) {
            console.log('Could not attach video:', error?.message ?? error);
        }
    },
    /**
     *
     * Runs after a Cucumber Feature.
     * @param {string}                   uri      path to feature file
     * @param {GherkinDocument.IFeature} feature  Cucumber feature object
     */
    // afterFeature: function (uri, feature) {
    // },
    
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {number} result 0 - command success, 1 - command error
     * @param {object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {object} exitCode 0 - success, 1 - fail
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },
    /**
    * Gets executed when a refresh happens.
    * @param {string} oldSessionId session ID of the old session
    * @param {string} newSessionId session ID of the new session
    */
    // onReload: function(oldSessionId, newSessionId) {
    // }
    /**
    * Hook that gets executed before a WebdriverIO assertion happens.
    * @param {object} params information about the assertion to be executed
    */
    // beforeAssertion: function(params) {
    // }
    /**
    * Hook that gets executed after a WebdriverIO assertion happened.
    * @param {object} params information about the assertion that was executed, including its results
    */
    // afterAssertion: function(params) {
    // }
}
