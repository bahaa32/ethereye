export const DOCKER_PORT = process.env.NODE_DOCKER_PORT || 8080;
export const LOCAL_PORT = process.env.NODE_LOCAL_PORT || DOCKER_PORT;
export const FETCH_INTERVAL = parseInt(process.env.GAS_FETCH_INTERVAL || '5', 10);
