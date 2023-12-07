"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOEmit = void 0;
const socket_io_1 = require("socket.io");
const server_1 = require("./server");
const accessLogs_1 = __importDefault(require("./accessLogs"));
const serverIO = new socket_io_1.Server(server_1.server, {
    cors: {
        origin: "*",
    },
    path: "/caa.io",
    maxHttpBufferSize: 1e8,
});
const currentPath = [];
serverIO.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    accessLogs_1.default.debug(`socket ${socket.id} is connected!`);
    const auth = socket.handshake.auth;
    if (auth) {
        socket.join("general");
        if (auth.permissions[4] < 1)
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
            }
            else {
                currentPath.splice(index, 1, {
                    wsId: socket.id,
                    auth,
                    path,
                    fifo: new Date().getTime(),
                });
            }
            serverIO.emit("current-path", "async", currentPath.sort((a, b) => a.fifo - b.fifo));
        });
    }
    else {
        socket.disconnect();
    }
    socket.on("disconnect", () => {
        const index = currentPath.findIndex((f) => f.wsId === socket.id);
        if (index >= 0) {
            currentPath.splice(index, 1);
        }
        accessLogs_1.default.debug(`socket ${socket.id} is disconnected!`);
    });
}));
class SocketIO {
    constructor() { }
    emitEvent(chanel, action, id = 0, location) {
        if (location) {
            const { groupId, perIndex } = location;
            if (perIndex !== undefined) {
                serverIO.to("permission-" + perIndex).emit(chanel, action, id);
            }
            if (groupId !== undefined) {
                serverIO.to("group-" + groupId).emit(chanel, action, id);
            }
        }
        else {
            serverIO.to("general").emit(chanel, action, id);
        }
    }
}
exports.IOEmit = new SocketIO();
//# sourceMappingURL=socketIO.js.map