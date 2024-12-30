import { useEffect, useRef, useState } from "react";

function App() {
  const [msg, setMsg] = useState(["Hi There......", "hello"]);
  const [room, setRoom] = useState("");
  const [val, setVal] = useState("");
  const wsRef = useRef<WebSocket | null> (null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (e) => {
      setMsg((m) => [...m, e.data]);
    };
    wsRef.current = ws;
  }, []);

  function joinRoom() {
    if (room && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomID: room,
          },
        })
      );
    } else {
      alert("Please enter a room name before joining.");
    }
  }

  function sendMessage() {
    if (val && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: val,
          },
        })
      );
      setVal("");
    } else {
      alert("Please enter a message before sending.");
    }
  }

  return (
    <>
      <div className="h-screen text-white bg-[#212121] flex justify-center items-center gap-2">
        <div className="border border-white h-80 w-80 bg-pink-400 text-black flex flex-col items-start overflow-y-auto p-2">
          {msg.map((m, index) => (
            <span
              key={index}
              className="border border-red-500 p-1 m-1 rounded"
            >
              {m}
            </span>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <input
            id="r"
            type="text"
            placeholder="Choose Room"
            className="p-4 border rounded text-black w-64"
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            className="bg-green-500 p-2 rounded-md"
            onClick={joinRoom}
          >
            Join Room
          </button>

          <input
            id="m"
            type="text"
            placeholder="Send Message"
            className="p-4 border rounded text-black w-64"
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
          <button
            className="bg-purple-500 p-2 rounded-md"
            onClick={sendMessage}
          >
            Send Message
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
