// Comprehensive testing utilities for JARVIS Chat Bot

import errorLogger from './errorLogger.js';

class TestRunner {
  constructor() {
    this.tests = [];
    this.results = [];
    this.isRunning = false;
  }

  // Add a test case
  addTest(name, testFunction, category = 'general') {
    this.tests.push({
      id: crypto.randomUUID(),
      name,
      testFunction,
      category,
      status: 'pending'
    });
  }

  // Run all tests
  async runAllTests() {
    if (this.isRunning) {
      console.warn('Tests are already running');
      return this.results;
    }

    this.isRunning = true;
    this.results = [];
    
    console.log(`🧪 Starting JARVIS test suite (${this.tests.length} tests)`);
    const startTime = performance.now();

    for (const test of this.tests) {
      await this.runSingleTest(test);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    this.isRunning = false;
    this.logTestSummary(duration);
    
    return this.results;
  }

  // Run a single test
  async runSingleTest(test) {
    const startTime = performance.now();
    
    try {
      console.log(`🔍 Running: ${test.name}`);
      
      const result = await test.testFunction();
      const endTime = performance.now();
      const duration = endTime - startTime;

      const testResult = {
        id: test.id,
        name: test.name,
        category: test.category,
        status: 'passed',
        duration,
        result,
        error: null,
        timestamp: new Date().toISOString()
      };

      this.results.push(testResult);
      console.log(`✅ ${test.name} - PASSED (${duration.toFixed(2)}ms)`);
      
      return testResult;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      const testResult = {
        id: test.id,
        name: test.name,
        category: test.category,
        status: 'failed',
        duration,
        result: null,
        error: {
          message: error.message,
          stack: error.stack
        },
        timestamp: new Date().toISOString()
      };

      this.results.push(testResult);
      console.error(`❌ ${test.name} - FAILED (${duration.toFixed(2)}ms)`, error);
      errorLogger.error(`Test Failed: ${test.name}`, error, 'Test Runner');
      
      return testResult;
    }
  }

  // Log test summary
  logTestSummary(totalDuration) {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const total = this.results.length;

    console.log('\n📊 Test Summary:');
    console.log(`Total: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️ Duration: ${totalDuration.toFixed(2)}ms`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'failed')
        .forEach(r => console.log(`  - ${r.name}: ${r.error.message}`));
    }
  }

  // Get test results by category
  getResultsByCategory(category) {
    return this.results.filter(r => r.category === category);
  }

  // Clear all tests and results
  clear() {
    this.tests = [];
    this.results = [];
  }
}

// Test utilities for specific components
export class ComponentTester {
  static testHolographicButton() {
    return new Promise((resolve, reject) => {
      try {
        // Test button creation and basic properties
        const buttonElement = document.createElement('button');
        buttonElement.className = 'holographic-button';
        buttonElement.textContent = 'Test Button';
        
        // Test click functionality
        let clicked = false;
        buttonElement.addEventListener('click', () => {
          clicked = true;
        });
        
        buttonElement.click();
        
        if (!clicked) {
          throw new Error('Button click event not triggered');
        }
        
        resolve({
          element: buttonElement,
          clickable: true,
          hasClass: buttonElement.classList.contains('holographic-button')
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static testHolographicInput() {
    return new Promise((resolve, reject) => {
      try {
        const inputElement = document.createElement('input');
        inputElement.className = 'holographic-input';
        inputElement.placeholder = 'Test input';
        
        // Test input functionality
        inputElement.value = 'test value';
        
        if (inputElement.value !== 'test value') {
          throw new Error('Input value not set correctly');
        }
        
        resolve({
          element: inputElement,
          valueSettable: true,
          hasPlaceholder: inputElement.placeholder === 'Test input'
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static testStatusIndicator() {
    return new Promise((resolve, reject) => {
      try {
        const statusElement = document.createElement('div');
        statusElement.className = 'status-indicator';
        
        const statuses = ['idle', 'listening', 'speaking', 'error'];
        const results = {};
        
        statuses.forEach(status => {
          statusElement.setAttribute('data-status', status);
          results[status] = statusElement.getAttribute('data-status') === status;
        });
        
        resolve({
          element: statusElement,
          statusChanges: results
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Browser compatibility tests
export class BrowserTester {
  static testWebAudioSupport() {
    return new Promise((resolve) => {
      const hasWebAudio = typeof window !== 'undefined' && 'AudioContext' in window;
      resolve({
        supported: hasWebAudio,
        details: hasWebAudio ? 'Web Audio API supported' : 'Web Audio API not supported'
      });
    });
  }

  static testMediaDevicesSupport() {
    return new Promise((resolve) => {
      const hasMediaDevices = typeof navigator !== 'undefined' && 'mediaDevices' in navigator;
      resolve({
        supported: hasMediaDevices,
        details: hasMediaDevices ? 'MediaDevices API supported' : 'MediaDevices API not supported'
      });
    });
  }

  static testCustomElementsSupport() {
    return new Promise((resolve) => {
      const hasCustomElements = typeof window !== 'undefined' && 'customElements' in window;
      resolve({
        supported: hasCustomElements,
        details: hasCustomElements ? 'Custom Elements supported' : 'Custom Elements not supported'
      });
    });
  }

  static async testMicrophonePermission() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return {
          supported: false,
          permission: 'not-supported',
          details: 'getUserMedia not supported'
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      return {
        supported: true,
        permission: 'granted',
        details: 'Microphone access granted'
      };
    } catch (error) {
      return {
        supported: true,
        permission: 'denied',
        details: `Microphone access denied: ${error.message}`
      };
    }
  }
}

// ElevenLabs widget tests
export class ElevenLabsWidgetTester {
  static testWidgetScriptLoading() {
    return new Promise((resolve) => {
      const scriptExists = document.querySelector('script[src*="convai-widget-embed"]');
      resolve({
        scriptLoaded: !!scriptExists,
        details: scriptExists ? 'ElevenLabs script found' : 'ElevenLabs script not found'
      });
    });
  }

  static testWidgetElementCreation() {
    return new Promise((resolve, reject) => {
      try {
        const widgetElement = document.createElement('elevenlabs-convai');
        widgetElement.setAttribute('agent-id', 'test-agent-id');
        
        resolve({
          element: widgetElement,
          hasAgentId: widgetElement.getAttribute('agent-id') === 'test-agent-id',
          tagName: widgetElement.tagName.toLowerCase()
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static testAgentIdValidation() {
    return new Promise((resolve) => {
      const validId = 'agent_7601k23b460aeejb2pvyfcvw6atk';
      const invalidId = 'invalid-id';
      
      const validPattern = /^agent_[a-zA-Z0-9_]+$/;
      
      resolve({
        validIdTest: validPattern.test(validId),
        invalidIdTest: !validPattern.test(invalidId),
        pattern: validPattern.toString()
      });
    });
  }
}

// Performance tests
export class PerformanceTester {
  static testComponentRenderTime() {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      // Simulate component rendering
      const container = document.createElement('div');
      container.innerHTML = `
        <div class="holographic-container">
          <h1 class="holographic-text">JARVIS</h1>
          <div class="chat-window">
            <div class="messages"></div>
            <div class="input-area">
              <input class="holographic-input" placeholder="Type message...">
              <button class="holographic-button">Send</button>
            </div>
          </div>
        </div>
      `;
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      resolve({
        renderTime,
        acceptable: renderTime < 100, // Should render in under 100ms
        details: `Component rendered in ${renderTime.toFixed(2)}ms`
      });
    });
  }

  static testMemoryUsage() {
    return new Promise((resolve) => {
      if (performance.memory) {
        const memory = {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        };
        
        resolve({
          supported: true,
          memory,
          usagePercentage: (memory.used / memory.total) * 100,
          details: `Memory usage: ${(memory.used / 1024 / 1024).toFixed(2)}MB`
        });
      } else {
        resolve({
          supported: false,
          details: 'Memory API not supported'
        });
      }
    });
  }
}

// Create and export test runner instance
const testRunner = new TestRunner();

// Add default tests
testRunner.addTest('Holographic Button', ComponentTester.testHolographicButton, 'components');
testRunner.addTest('Holographic Input', ComponentTester.testHolographicInput, 'components');
testRunner.addTest('Status Indicator', ComponentTester.testStatusIndicator, 'components');

testRunner.addTest('Web Audio Support', BrowserTester.testWebAudioSupport, 'browser');
testRunner.addTest('Media Devices Support', BrowserTester.testMediaDevicesSupport, 'browser');
testRunner.addTest('Custom Elements Support', BrowserTester.testCustomElementsSupport, 'browser');

testRunner.addTest('Widget Script Loading', ElevenLabsWidgetTester.testWidgetScriptLoading, 'elevenlabs');
testRunner.addTest('Widget Element Creation', ElevenLabsWidgetTester.testWidgetElementCreation, 'elevenlabs');
testRunner.addTest('Agent ID Validation', ElevenLabsWidgetTester.testAgentIdValidation, 'elevenlabs');

testRunner.addTest('Component Render Time', PerformanceTester.testComponentRenderTime, 'performance');
testRunner.addTest('Memory Usage', PerformanceTester.testMemoryUsage, 'performance');

export {
  TestRunner,
  ComponentTester,
  BrowserTester,
  ElevenLabsWidgetTester,
  PerformanceTester,
  testRunner
};

export default testRunner;

