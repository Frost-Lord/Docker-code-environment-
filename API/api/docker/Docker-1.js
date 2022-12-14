const clc = require("cli-color");
const { exec } = require("child_process");
const db = require("../../Database/Schema/User");
const fs = require("fs");

module.exports = (router) => {
router.post("/docker-1", async (req, res) => {
    let { id, key, port } = req.body;
    console.log(clc.greenBright(`Docker-1: ${id} ${key} ${port}`));
    if (!key === "elysiumnodesglichi") return res.sendStatus(403);
    if (!id) return res.send("No id");
    if (!port) return res.send("No port");

    console.log(`Port: ${port} || User ID: ${id} || Key: ${key}`);


    exec(`cd C:/Users/ewen2/Documents/GitHub/Docker-Sharded-code/testCode/ && docker build -t bot1 .`, async (error, stdout) => {
        let response = error || stdout;
        if (error) {
          console.log(error);
        } else {
            console.log("///////////////////////////////////////////////////////////////////////")
            console.log(response)
            console.log("///////////////////////////////////////////////////////////////////////")
            // build container
            let portopen = port;
    
            exec(`cd C:/Users/ewen2/Documents/GitHub/Docker-Sharded-code/testCode/ && docker run -e PORTOPEN=${portopen} -d bot1`, async (error, stdout) => {
                let response1 = error || stdout;
                if (error) {
                  console.log(error);
                } else {
                    console.log("///////////////////////////////////////////////////////////////////////")
                    console.log(response1)
                    console.log("///////////////////////////////////////////////////////////////////////")
                    // run container
    
                    
                    exec(`docker ps -qf "id=${response1}"`, async (error, stdout) => {
                        let response2 = error || stdout;
                        if (error) {
                          console.log(error);
                        } else {
                          console.log("///////////////////////////////////////////////////////////////////////")
                            console.log(response2)
                            console.log("///////////////////////////////////////////////////////////////////////")

                            let user = await db.findOne({ usertoken: id });
                            if (!user) return res.send("User not found");

                          if (response2.includes("\n")) {
                              response2 = response2.replace("\n", "");
                          }

                            user.docker.push({ id: response2, port: portopen, type: "bot", status: "running" });
                            await user.save();


                            if (!fs.existsSync(`C:/Users/ewen2/Desktop/test/${response2}`)){
                              fs.mkdirSync(`C:/Users/ewen2/Desktop/test/${response2}`);
                            }

                            res.sendStatus(200);
                        }
                      });
    
    
                }
              });
        }
      });

});
}