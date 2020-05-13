// TODO: needs to be communicated/received from the url
const WIDTH = 400;
const HEIGHT = 400;
const GRID_NUM_ROWS = 8;
const GRID_NUM_COLS = 8;

const CELL_DRAW_SIZE = WIDTH / GRID_NUM_ROWS;
const CELL_DRAW_OFFSET = CELL_DRAW_SIZE / 2;



// const ip = "192.168.178.25:"; // or "localhost" // or "wizardchess.herokuapp.com"


// localhost needs http/ws -> heroku needs https and wss
const local_client = true;
const localServer = true;

let server_address, ws_address, ip, port;
if (localServer) {
  ip = "localhost:";
  port = "5000";
  server_address = `http://${ip+port}/`;
  ws_address = `ws://${ip+port}/`;
} else {
  ip = "wizardchess.herokuapp.com";
  port = "";
  server_address = `https://${ip+port}/`;
  ws_address = `wss://${ip+port}/`;
}
const client_address = (local_client) ?
  `http://localhost:8000/` :
  `https://ctrlmonster.github.io/wizardchess/`;

const url = (path) => server_address + path;
const ws_url = (path) => ws_address + path;
