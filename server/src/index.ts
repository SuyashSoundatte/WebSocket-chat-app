import { parse } from "@babel/core";
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User{
    socket:WebSocket,
    room: string
}

let countUser = 0;
let allSockets :User[] = [] 

wss.on("connection", (socket)=>{
    countUser = countUser + 1;
    console.log("User connected #" + countUser);
    
    socket.on("message", (msg)=>{
        const parseMsg = JSON.parse(msg as unknown as string)
        if(parseMsg.type === "join"){
            allSockets.push({
                socket,
                room: parseMsg.payload.roomID
            })
        }
        console.log(allSockets)

        if(parseMsg.type === "chat"){
            const currentRoom = allSockets.find((user)=> user.socket === socket)?.room;
            if (currentRoom) {
                allSockets.forEach((user) => {
                    if (user.room === currentRoom) {
                        user.socket.send(parseMsg.payload.message + ": from server");
                    }
                });
            }
        }
    })

    socket.on("close", () => {
        allSockets = allSockets.filter((x) => x.socket !== socket);
    });

});