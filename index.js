/**
 * Root index file
 * 
 * This file is just a reference entry point for the project.
 * It redirects to the actual server/server.js file for execution.
 * 
 * For running the application, please use the scripts defined in package.json:
 * - npm start: Start the backend server
 * - npm run server: Start the backend with nodemon for development
 * - npm run client: Start the React frontend
 * - npm run dev: Start both frontend and backend concurrently
 */

// Just requiring and running the actual server file
require('./server/server.js');