// import the server and start it
const server = require("./api/server")

server.listen(1234, () => {
    console.log("running on port 1234")
})