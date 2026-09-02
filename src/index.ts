import frameworkMetadata from '../framework-metadata.json' assert { type: 'json' };
import testData from './data/testData.json' assert { type: 'json' };

export { BasePage } from './pages/BasePage.js';
export { LoginPage } from './pages/LoginPage.js';
export { InboundPage, InboundReceiptData } from './pages/InboundPage.js';
export { frameworkMetadata };
export { testData };

export function getFrameworkSummary(): string {
  return `
=====================================================
📦 ${frameworkMetadata.frameworkName} (v${frameworkMetadata.version})
=====================================================
Architecture: ${frameworkMetadata.architecture}
Language: ${frameworkMetadata.technologyStack.language}
Test Runner: ${frameworkMetadata.technologyStack.testRunner}
Automation Engine: ${frameworkMetadata.technologyStack.browserAutomation}

Modules Supported:
${frameworkMetadata.modulesSupported.map(m => ` - ${m.moduleName} (${m.scenarios.length} scenarios)`).join('\n')}

Run Commands:
 - Full Suite: ${frameworkMetadata.executionCommands.fullSuite}
 - Login Suite: ${frameworkMetadata.executionCommands.loginSuite}
 - Inbound Suite: ${frameworkMetadata.executionCommands.inboundSuite}
=====================================================
`;
}
