## Setup
- Create a folder with project name
- `cd <project_name>`
- `npm init -y`


## Directory Structure
- `public/` : This directory contains your public assets, such as JavaScript `script.js` and CSS `style.css` files as they are your frontend assets.

- `views/` : This directory contains HTML templates for your web pages. You have the main page `index.html` and the login/signup page `login.html`.

- `server.js` : This is the main server file. It handles routing, user authentication, and serves your static assets and HTML templates. This is server side asset.

- `auth.js` : This file contains the client-side JavaScript code responsible for handling user authentication and managing the login/signup forms on the frontend.

- `package.json` : This is your project's package configuration file, which lists dependencies and defines scripts for running your application.