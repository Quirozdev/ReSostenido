const { defineConfig } = require('cypress');

module.exports = defineConfig({
  experimentalInteractiveRunEvents: true,
  reporter: 'mochawesome',
  reporterOptions: {
    // To display small circular charts regarding test results
    charts: true,
    // Generate HTML file
    html: true,
    // Customize the directory in which reports are saved
    reportsDir: 'cypress/reports/ReSostenido',
    // Customize the report file name
    reportFilename: 'Re_Sostenido',
    // Generate new report file or overwrite a single file
    overwrite: false,
    reporterEnabled: 'mochawesome',
    mochawesomeReporterOptions: {
      reportDir: 'cypress/reports/mocha',
      quiet: true,  // Corregir 'quite' a 'quiet'
      overwrite: false,
      html: true,
      json: true,
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
