import { createContext, useEffect, useState } from "react";
import { socket } from "@/utils/util";

export const SocketContext = createContext({
    newGame: false,
    message: ""
});

export const SocketProvider = ({children}:any) => {
  const [newgame, setNewGame] = useState(false);
  const [newmsg, setMessage] = useState("");

  useEffect(() => {
    socket.on("newGame", (data) => {
      setNewGame(data?.newGame);
      setMessage(data?.message);
    });
  }, [socket]);

  const store = {
    newGame:newgame,
    message: newmsg
  };

  return (
    <SocketContext.Provider value={store}>{children}</SocketContext.Provider>
  );
};
