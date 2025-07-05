import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    // Test file patterns
    specPattern: 'cypress/e2e/**/*.cy.{ts,js}',
    
    // Screenshots and videos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Fixtures
    fixturesFolder: 'cypress/fixtures',
    
    // Support file
    supportFile: 'cypress/support/e2e.ts',
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config
    },
    
    // Environment variables
    env: {
      // Add any environment specific variables here
    }
  }
}) 