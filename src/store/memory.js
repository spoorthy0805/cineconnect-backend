// Simple in-memory store for demo purposes
export const plans = [];
export const messages = {}; // { [planId]: [ { message, userId, userName, timestamp } ] }

let ioInstance = null;
export const setSocket = (io) => { ioInstance = io; };
export const getSocket = () => ioInstance;
