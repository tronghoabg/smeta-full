function realtime(io, data) {
    io.on("connection", (socket) => {
        // socket.emit('soket-reveive', "test socket")
        socket.on(`${data}`,function(data){
            console.log(data,"asdasdasdasd");
        })
    });
}
module.exports = realtime