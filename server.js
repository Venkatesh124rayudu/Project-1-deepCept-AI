const express = require('express');
const bodyParser = require('body-parser');
const jsyaml = require('js-yaml');
const fs = require('fs');

const app = express();
const port = 3002;

app.use(bodyParser.json());

app.post('/generateYAML', (req, res) => {
  const { yamlString } = req.body;

  // Write YAML to a file
  fs.writeFileSync('config.yaml', yamlString);

  console.log('YAML file created successfully: config.yaml');

  res.json({ message: 'YAML file created successfully' });
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
