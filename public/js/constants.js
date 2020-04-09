// TODO: needs to be communicated/received from the url
const WIDTH = 400;
const HEIGHT = 400;
const GRID_NUM_ROWS = 8;
const GRID_NUM_COLS = 8;

const CELL_DRAW_SIZE = WIDTH / GRID_NUM_ROWS;
const CELL_DRAW_OFFSET = CELL_DRAW_SIZE / 2;



// const ip = "192.168.178.25:"; // or "localhost: // or "https://wizardchess-proto.herokuapp.com/"
const ip = "wizardchess-proto.herokuapp.com";
const port = "";
//const port = "5000";
const server_address = `https://${ip+port}/`;
//const server_address = `http://${ip+port}/`;
const ws_address = `ws://${ip+port}/`;
const url = (path) => server_address + path;
const ws_url = (path) => ws_address + path;
