const hbjs = require('handbrake-js');
 
const options = {
  input: '../src/assets/videos/portfolio/hazard.mov',
  output: '../src/assets/videos/portfolio/compressed/hazard.mp4'
}
hbjs.spawn(options)
  .on('error', console.error)
  .on('output', console.log)