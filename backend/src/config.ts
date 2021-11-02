export const timePerRound: number = 10000;
export const validColumns: string[] = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J'
];
export const validRows = validColumns.map((column, index) =>
	(index + 1).toString()
);
export const adminPasswordHashed: string = "test1234";
