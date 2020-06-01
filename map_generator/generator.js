const cellSelection = document.getElementById("cellSelection");
const mapOutput = document.getElementById("mapOutput");
const saveMapButton = document.getElementById("saveMapButton");



const ROWS = 8;
const COLS = 8;

for (let x = 0; x < COLS; x++) {
  const rowElem = document.createElement("DIV");
  rowElem.classList.add("rowStyle");
  for (let y = 0; y < ROWS; y++) {
    const cellElem = document.createElement("DIV");
    cellElem.classList.add("cellStyle");
    cellElem.innerHTML = `${x} | ${y}`
    cellElem.addEventListener("click", function() {
      selectCell(x, y, this);
    })
    rowElem.appendChild(cellElem);
  }
  cellSelection.appendChild(rowElem);
}


const selectedCells = [];
function selectCell(x, y, cellElem) {
  const cellIndex = selectedCells.findIndex(cell => cell.x === x && cell.y === y);

  console.log("click");
  console.log(cellElem);
  if (cellIndex === -1) {
    selectedCells.push({x, y});
    cellElem.classList.add("selectedCell");
  }
  else {
    selectedCells.splice(cellIndex, 1);
    cellElem.classList.remove("selectedCell");
  }
}


saveMapButton.addEventListener("click", function() {
  let outputString = "[";
  selectedCells.forEach(cell => {
    outputString += `{x:${cell.x}, y:${cell.y}},`
  });
  outputString += "]";
  mapOutput.innerHTML = outputString;
})
