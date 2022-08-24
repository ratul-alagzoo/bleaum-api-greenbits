import { Server, Socket } from "socket.io";
import User from "./models/users";

export const EVENTS = {
  CONNECTION: "connection",
  RECEIVE_NOTIFICATION: "RECEIVE_NOTIFICATION",
};
export default function socket({ io }: { io: Server }) {
  io.on(EVENTS.CONNECTION, async (socket: Socket) => {
    const terminal = (socket.handshake?.query?.id ?? "") + "";
    if (!!terminal) {
      //TO DO
      //make socket endpoints secured
      // const data = await User.findOne({ userId: terminal });
      // if(data){
      //   //Join the terminal
      // }else{
      //   socket.disconnect()
      // }
      socket.join(terminal);
      console.log(`${terminal} is connected with socket id of: ${socket.id}`);

      const connectedUsers = Object.keys(io.engine["clients"]).toString();
      console.log(`Users connected with socket_id of : ${connectedUsers}`);
    } else {
      socket.disconnect();
    }
  });
}
