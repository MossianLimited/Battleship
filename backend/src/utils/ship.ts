import { validColumns, validRows } from '../config';

interface Board {
	[key: string]: number;
}

const ascii = (char: string) => {
	return char.charCodeAt(0);
};
const char = (ascii: number) => {
	return String.fromCharCode(ascii);
};

const shiftColumn = (column: string, num: number) => {
	return char(ascii(column) + num);
};

const shiftRow = (row: string, num: number) => {
	return (parseInt(row) + num).toString();
};

const randomLocation = (board: Board) => {
	const asArray = Object.entries(board);
	const filtered = asArray.filter(([key, value]) => value === 1);
	const filteredBoard = Object.fromEntries(filtered);
	const keys = Object.keys(filteredBoard);

	return keys[(keys.length * Math.random()) << 0];
};
const directions = ['vertical', 'horizontal'];

const ships: string[][] = [];

export const randomShip = (numOfShips: number, shipLength: number) => {
	const board: Board = {};

	validColumns.forEach((column) => {
		validRows.forEach((row) => {
			board[column + row] = 1;
		});
	});

	let locationAvaliable = false;
	while (!locationAvaliable || ships.length < numOfShips) {
		const startLocation = randomLocation(board);
		const column = startLocation[0];
		const row = startLocation.substring(1);

		const direction = directions[Math.floor(Math.random() * directions.length)];
		let lastLocation;
		if (direction === 'horizontal') {
			lastLocation = shiftColumn(column, shipLength - 1) + row;
			for (let i = 0; i < shipLength; i++) {
				const shiftedColumn = shiftColumn(column, i);
				const location = shiftedColumn + row;
				if (!(location in board) || board[location] === 0) {
					locationAvaliable = false;
					break;
				} else locationAvaliable = true;
			}
			if (!locationAvaliable) continue;
			const shipLocation: string[] = [];
			for (let i = 0; i < shipLength; i++) {
				const shiftedColumn = shiftColumn(column, i);
				const location = shiftedColumn + row;
				board[location] = 0;

				const upper = shiftedColumn + shiftRow(row, -1);
				// console.log('upper:', upper);
				if (upper in board) board[upper] = 0;
				const lower = shiftedColumn + shiftRow(row, 1);
				// console.log('lower:', lower);
				if (lower in board) board[lower] = 0;
				if (i === 0) {
					const left = shiftColumn(shiftedColumn, -1) + row;
					// console.log('left:', left);
					if (left in board) board[left] = 0;
					const upperLeft = shiftColumn(shiftedColumn, -1) + shiftRow(row, -1);
					// console.log('upper left:', upperLeft);
					if (upperLeft in board) board[upperLeft] = 0;
					const lowerLeft = shiftColumn(shiftedColumn, -1) + shiftRow(row, 1);
					// console.log('lower left:', lowerLeft);
					if (lowerLeft in board) board[lowerLeft] = 0;
				} else if (i === shipLength - 1) {
					const right = shiftColumn(shiftedColumn, 1) + row;
					// console.log('right:', right);
					if (right in board) board[right] = 0;
					const upperRight = shiftColumn(shiftedColumn, 1) + shiftRow(row, -1);
					// console.log('upper right:', upperRight);
					if (upperRight in board) board[upperRight] = 0;
					const lowerRight = shiftColumn(shiftedColumn, 1) + shiftRow(row, 1);
					// console.log('lower right:', lowerRight);
					if (lowerRight in board) board[lowerRight] = 0;
				}
				shipLocation.push(location);
			}
			ships.push(shipLocation);
		} else {
			lastLocation = column + shiftRow(row, shipLength - 1);
			for (let i = 0; i < shipLength; i++) {
				const shiftedRow = shiftRow(row, i);
				const location = column + shiftedRow;
				if (!(location in board) || board[location] === 0) {
					locationAvaliable = false;
					break;
				} else locationAvaliable = true;
			}
			if (!locationAvaliable) continue;
			const shipLocation: string[] = [];
			for (let i = 0; i < shipLength; i++) {
				const shiftedRow = shiftRow(row, i);
				const location = column + shiftedRow;
				board[location] = 0;
				const left = shiftColumn(column, -1) + shiftedRow;
				// console.log('left:', left);
				if (left in board) board[left] = 0;
				const right = shiftColumn(column, 1) + shiftedRow;
				// console.log('right:', right);
				if (right in board) board[right] = 0;
				if (i === 0) {
					const upper = column + shiftRow(shiftedRow, -1);
					// console.log('upper:', upper);
					if (upper in board) board[upper] = 0;
					const upperLeft = shiftColumn(column, -1) + shiftRow(shiftedRow, -1);
					// console.log('upper left', upperLeft);
					if (upperLeft in board) board[upperLeft] = 0;
					const upperRight = shiftColumn(column, 1) + shiftRow(shiftedRow, -1);
					// console.log('upper right', upperRight);
					if (upperRight in board) board[upperRight] = 0;
				} else if (i === shipLength - 1) {
					const lower = column + shiftRow(shiftedRow, 1);
					// console.log('lower:', lower);
					if (lower in board) board[lower] = 0;
					const lowerLeft = shiftColumn(column, -1) + shiftRow(shiftedRow, 1);
					// console.log('lower left', lowerLeft);
					if (lowerLeft in board) board[lowerLeft] = 0;
					const lowerRight = shiftColumn(column, 1) + shiftRow(shiftedRow, 1);
					// console.log('lower right', lowerRight);
					if (lowerRight in board) board[lowerRight] = 0;
				}
				shipLocation.push(location);
			}
			ships.push(shipLocation);
		}
	}

	console.log(ships);
	return ships;
};
