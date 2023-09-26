function realtime(io, data) {
    io.on("connection", (socket) => {
        // socket.emit('soket-reveive', "test socket")
        socket.on(`${data}`,function(data){
        })
    });
}
module.exports = realtime