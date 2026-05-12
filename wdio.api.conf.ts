import 'dotenv/config';
import type {} from '@wdio/cucumber-framework';
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
    startTime: Date;
    steps: StepLog[];
}

const scenarioLogs = new Map<string, ScenarioLog>();

function getScenarioKey(world: any): string {
    return world?.pickle?.id ?? world?.pickle?.name ?? 'unknown';
}

const LINE = '═'.repeat(64);

export const config: WebdriverIO.Config = {
    runner: 'local',
    tsConfigPath: './tsconfig.json',

    specs: ['./features/api/**/*.feature'],
    exclude: [],

    maxInstances: 1,

    // Headless Chrome is used as the runner; API steps never open a browser page.
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
        }
    }],

    logLevel: 'warn',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 60000,
    connectionRetryCount: 3,

    framework: 'cucumber',

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableScreenshots: true
        }]
    ],

    cucumberOpts: {
        require: ['./features/step-definitions/api.steps.ts'],
        backtrace: true,
        requireModule: [],
        dryRun: false,
        failFast: false,
        name: [],
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 30000,
        ignoreUndefinedDefinitions: false
    },

    beforeScenario: function (world: any, _context: any) {
        const key = getScenarioKey(world);
        const featureName = world?.gherkinDocument?.feature?.name ?? 'Unknown Feature';
        const tags = (world?.pickle?.tags ?? []).map((t: any) => t.name).join(' ') || '(none)';

        scenarioLogs.set(key, {
            name: world?.pickle?.name ?? 'Unknown Scenario',
            feature: featureName,
            tags,
            startTime: new Date(),
            steps: []
        });

        console.log(`\n${LINE}`);
        console.log(`  SCENARIO : ${world?.pickle?.name}`);
        console.log(`  FEATURE  : ${featureName}`);
        console.log(`  TAGS     : ${tags}`);
        console.log(`  START    : ${new Date().toLocaleString('vi-VN')}`);
        console.log(LINE);
    },

    beforeStep: function (step: any, _scenario: any, _context: any) {
        console.log(`\n  ▶ ${step?.text ?? ''}`);
    },

    afterStep: function (step: any, scenario: any, result: any, _context: any) {
        const key = scenario?.id ?? scenario?.name ?? 'unknown';
        const entry = scenarioLogs.get(key);
        const durationMs = Math.round((result.duration ?? 0) / 1_000_000);
        const passed = result.passed ?? !result.error;

        const statusIcon = passed ? '  ✔' : '  ✘';
        console.log(`${statusIcon} ${passed ? 'PASSED' : 'FAILED'} (${durationMs}ms)`);
        if (!passed && result.error) {
            console.log(`     ERROR: ${String(result.error).split('\n')[0]}`);
        }

        if (entry) {
            entry.steps.push({
                text: step?.text ?? '',
                passed,
                duration: durationMs,
                error: result.error ? String(result.error).split('\n')[0] : undefined
            });
        }
    },

    afterScenario: function (world: any, result: any, _context: any) {
        const key = getScenarioKey(world);
        const entry = scenarioLogs.get(key);

        if (!entry) return;

        const passed = result.passed ?? !result.error;
        const totalSteps = entry.steps.length;
        const passedSteps = entry.steps.filter(s => s.passed).length;
        const failedSteps = totalSteps - passedSteps;
        const totalDuration = entry.steps.reduce((sum, s) => sum + s.duration, 0);
        const statusLabel = passed ? '✅ PASSED' : '❌ FAILED';

        console.log(`\n${LINE}`);
        console.log(`  RESULT   : ${statusLabel}`);
        console.log(`  STEPS    : ${totalSteps} total | ${passedSteps} passed | ${failedSteps} failed`);
        console.log(`  DURATION : ${totalDuration}ms`);
        console.log(`  END      : ${new Date().toLocaleString('vi-VN')}`);
        console.log(`${LINE}\n`);

        let log = '';
        log += `SCENARIO : ${entry.name}\n`;
        log += `FEATURE  : ${entry.feature}\n`;
        log += `TAGS     : ${entry.tags}\n`;
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
};
