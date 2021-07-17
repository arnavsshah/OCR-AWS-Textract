const { spawn } = require('child_process');
const { v4 } = require('uuid')

const express = require('express')
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express()

const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


app.post('/', (req, res) => {

  let largeDataSet = []
  // spawn new child process to call the python script
  const python = spawn('python', ['textract.py', req.body.img_path]);

  // collect data from script
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...')
    largeDataSet.push(data)
  })

  // in close event we are sure that stream is from child process is closed
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`)
    // send data to browser
    data = largeDataSet.join('')
    var output_data = JSON.parse(data);
    output_data.id = v4();
    axios.post('https://a5ii9i974f.execute-api.ap-south-1.amazonaws.com/dev/form', output_data)
        .then(function (response) {
          
          console.log('Data Uploaded!');
        })
        .catch(function (error) {
          console.log(error)
        });
    res.send(output_data)
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})