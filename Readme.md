
# YAML File Generator

This project is a YAML file generator with a web interface to create configuration files for various settings, including MQTT, Detectors, Record, Retain, Cameras, and more.

## Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

## Getting Started


step 1: Navigate to the project directory:

step 2: Install dependencies:

   ```bash
   npm install
   ```

   This will install the required packages, including `js-yaml`.

step 3 : Start the server:

   ```bash
   npm start
   ```
   The server will run on http://localhost:3002.

5. Open your web browser and go to [http://localhost:3002](http://localhost:3002) to use the YAML File Generator.

## Usage

1. Fill in the required information in the form.
2. Click "Add Camera" to add camera details dynamically.
3. Click "Add Role" or "Add Track" to add role or track details for each camera.
4. Click "Generate YAML" to generate the YAML configuration.
5. The generated YAML will be displayed in the console, and a file named `config.yaml` will be created in the project directory.

