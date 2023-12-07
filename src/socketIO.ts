import { Server, Socket } from "socket.io";
import { server as httpServer } from "./server";
import logger from "./accessLogs";
import {
  PERMISSION,
  SocketAction,
  SocketChanel,
  TokenInfo,
} from "./interfaces";

const serverIO = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  path: "/caa.io", // socket.io
  maxHttpBufferSize: 1e8,
});
const currentPath: {
  wsId: string;
  auth: TokenInfo;
  path: string;
  fifo: number;
}[] = [];
serverIO.on("connection", async (socket: Socket) => {
  logger.debug(`socket ${socket.id} is connected!`);
  const auth = socket.handshake.auth as TokenInfo;
  if (auth) {
    socket.join("general");
    if (auth.permissions[PERMISSION.ACCOUNT] < 1)
      socket.join("group-" + auth.groupId);
    if (auth.permissions) {
      for (const [index, value] of auth.permissions.entries()) {
        if (value >= 1) {
          socket.join("permission-" + index);
        }
      }
    }
    socket.on("path", (path) => {
      const index = currentPath.findIndex((f) => f.wsId === socket.id);
      if (index < 0) {
        currentPath.push({
          wsId: socket.id,
          auth,
          path,
          fifo: new Date().getTime(),
        });
      } else {
        currentPath.splice(index, 1, {
          wsId: socket.id,
          auth,
          path,
          fifo: new Date().getTime(),
        });
      }
      serverIO.emit(
        "current-path",
        "async",
        currentPath.sort((a, b) => a.fifo - b.fifo)
      );
    });
  } else {
    socket.disconnect();
  }

  socket.on("disconnect", () => {
    const index = currentPath.findIndex((f) => f.wsId === socket.id);
    if (index >= 0) {
      currentPath.splice(index, 1);
    }
    logger.debug(`socket ${socket.id} is disconnected!`);
  });
});

class SocketIO {
  constructor() {}
  emitEvent(
    chanel: SocketChanel,
    action: SocketAction,
    id:number|string=0,
    location?: {
      groupId?: number;
      perIndex?: number;
    }
  ) {
    if (location) {
      const { groupId, perIndex } = location;
      if (perIndex !== undefined) {
        serverIO.to("permission-" + perIndex).emit(chanel, action, id);
      }
      if (groupId !== undefined) {
        serverIO.to("group-" + groupId).emit(chanel, action, id);
      }
    } else {
      serverIO.to("general").emit(chanel, action, id);
    }
  }
}

export const IOEmit = new SocketIO();
