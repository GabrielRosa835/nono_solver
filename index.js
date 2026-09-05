// index.ts
var CellStatus = {
  Unknown: 0,
  Filled: 1,
  Empty: 2
};
var example = {
  size: 5,
  rowHints: [[4], [3], [2], [5], [3]],
  colHints: [[4], [5], [2, 2], [1, 2], [1]]
};
var board = createBoard(example);
printBoard(board);
fillIntersections(board);
printBoard(board);
function extractMinimalPositions(hints) {
  let currStartIndex = 0;
  let currEndIndex = hints[0] - 1;
  const positions = [{ start: currStartIndex, end: currEndIndex, size: currEndIndex - currStartIndex + 1 }];
  for (let i = 1;i < hints.length; i++) {
    currStartIndex = currStartIndex + hints[i] + 1;
    currEndIndex = currStartIndex + hints[i] - 1;
    positions.push({ start: currStartIndex, end: currEndIndex, size: currEndIndex - currStartIndex + 1 });
  }
  return positions;
}
function fillLineIntersections(line) {
  const rowHints = line.hints;
  const rowHintsSum = rowHints.reduce((prev, curr) => prev + curr);
  const totalSpaceTaken = rowHintsSum + rowHints.length - 1;
  const maximumDifference = board.size - totalSpaceTaken;
  const minimalPos = extractMinimalPositions(rowHints);
  console.log(maximumDifference);
  for (let j = 0;j < minimalPos.length; j++) {
    console.log(minimalPos[j]);
    for (let k = minimalPos[j].start + maximumDifference;k <= minimalPos[j].end; k++) {
      line.cells[k].status = CellStatus.Filled;
    }
  }
}
function fillIntersections(board2) {
  for (let i = 0;i < board2.size; i++) {
    fillLineIntersections(board2.cols[i]);
  }
}
function createBoard(example2) {
  const totalCells = Math.pow(example2.size, 2);
  const cells = Array(totalCells);
  for (let i = 0;i < totalCells; i++) {
    cells[i] = { status: CellStatus.Unknown };
  }
  const board2 = {
    size: example2.size,
    rows: [],
    cols: []
  };
  for (let i = 0;i < board2.size; i++) {
    const rowCells = [];
    for (let j = 0;j < board2.size; j++) {
      rowCells[j] = cells[i * board2.size + j];
    }
    board2.rows[i] = {
      hints: example2.rowHints[i],
      cells: rowCells
    };
  }
  for (let i = 0;i < board2.size; i++) {
    const colCells = [];
    for (let j = 0;j < board2.size; j++) {
      colCells[j] = cells[j * board2.size + i];
    }
    board2.cols[i] = {
      hints: example2.colHints[i],
      cells: colCells
    };
  }
  return board2;
}
function displayCell(cell) {
  switch (cell.status) {
    case CellStatus.Unknown:
      return ".";
    case CellStatus.Filled:
      return "X";
    case CellStatus.Empty:
      return "+";
    default:
      return "?";
  }
}
function printBoard(board2) {
  let maxColHintSize = 1;
  for (let i = 0;i < board2.cols.length; i++) {
    const hint = board2.cols[i].hints;
    if (maxColHintSize < hint.length) {
      maxColHintSize = hint.length;
    }
  }
  let maxRowHintSize = 1;
  for (let i = 0;i < board2.rows.length; i++) {
    const hint = board2.rows[i].hints;
    if (maxRowHintSize < hint.length) {
      maxRowHintSize = hint.length;
    }
  }
  const bufferWidth = board2.size + maxRowHintSize;
  const bufferHeight = board2.size + maxColHintSize;
  const buffer = Array(bufferHeight);
  for (let i = 0;i < bufferHeight; i++) {
    buffer[i] = Array(bufferWidth);
  }
  for (let i = 0;i < board2.cols.length; i++) {
    const hints = board2.cols[i].hints;
    const startRowIndex = maxColHintSize - hints.length;
    const colIndex = maxRowHintSize + i;
    for (let j = 0;j < hints.length; j++) {
      const rowIndex = startRowIndex + j;
      buffer[rowIndex][colIndex] = hints[j];
    }
  }
  for (let i = 0;i < board2.rows.length; i++) {
    const hints = board2.rows[i].hints;
    const startColIndex = maxRowHintSize - hints.length;
    const rowIndex = maxColHintSize + i;
    for (let j = 0;j < hints.length; j++) {
      const colIndex = startColIndex + j;
      buffer[rowIndex][colIndex] = hints[j];
    }
  }
  for (let i = 0;i < board2.size; i++) {
    for (let j = 0;j < board2.size; j++) {
      buffer[i + maxColHintSize][j + maxRowHintSize] = displayCell(board2.rows[i].cells[j]);
    }
  }
  for (let i = 0;i < bufferHeight; i++) {
    let line = String(buffer[i][0] ?? ".");
    for (let j = 1;j < bufferWidth; j++) {
      line += ` | ${String(buffer[i][j] ?? ".")}`;
    }
    console.log(line);
  }
  console.log(`
`);
}
