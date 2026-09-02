import * as reporter from 'cucumber-html-reporter';
import * as path from 'path';
import * as fs from 'fs';

const jsonReportPath = path.join(process.cwd(), 'reports', 'cucumber-report.json');
const htmlReportPath = path.join(process.cwd(), 'reports', 'cucumber-report.html');

if (fs.existsSync(jsonReportPath)) {
  const options: reporter.Options = {
    theme: 'bootstrap',
    jsonFile: jsonReportPath,
    output: htmlReportPath,
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false,
    metadata: {
      'App Name': 'und-wms Warehouse Management System',
      'Test Environment': 'LOCAL / STAGING',
      'Browser': 'Chromium (Playwright)',
      'Platform': process.platform,
      'Framework': 'Cucumber JS + Playwright + TypeScript'
    }
  };

  reporter.generate(options);
  console.log(`✅ Cucumber HTML Report generated successfully at: ${htmlReportPath}`);
} else {
  console.warn(`⚠️ JSON report not found at ${jsonReportPath}. Run 'npm test' first.`);
}
