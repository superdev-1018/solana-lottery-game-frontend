import { createContext, useEffect, useState } from "react";
import { socket } from "@/utils/util";

export const SocketContext = createContext({
    newGame: false,
    message: "",
    state:"success"
});

export const SocketProvider = ({children}:any) => {
  const [newgame, setNewGame] = useState(false);
  const [newmsg, setMessage] = useState("");
  const [state, setState] = useState("success");

  useEffect(() => {
    socket.on("newGame", (data) => {
      setNewGame(data?.newGame);
      setMessage(data?.message);
      setState(data?.state);
    });
  }, [socket]);

  const store = {
    newGame:newgame,
    message: newmsg,
    state: state,
  };

  return (
    <SocketContext.Provider value={store}>{children}</SocketContext.Provider>
  );
};
