import http from 'http'
import * as fse from'fs-extra'
import multiparty from 'multiparty'
import path from 'path';
const UPLOAD_DIR = path.resolve(__dirname, "..", "target");
// + const multiparty = require("multiparty");
const server = http.createServer();
server.on("request", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }

  const multipart = new multiparty.Form();
  multipart.parse(req, async(err, fields, files) => {
    if(err) {
      return 
    }
    const chunk  = files.chunk
    const hash  = files.hash
    const fileName  = files.filename
    const chunkDir = path.resolve(UPLOAD_DIR, `chunkDir${fileName}`)
    if(!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir)
    }
    await fse.rename(chunk.path, `${chunkDir}/${hash}`)
    res.status = 200;
    res.end('received file chunk')
  })
});








server.listen(3000, () => console.log("listening port 3000"));