import generateArrayOfNumbers from "./generateArrayOfNumbers";

describe("generateArrayOfNumbers", () => {
    test("Generating an array of numbers given a number N should provide numbers from 1 to N", () => {
        const mockInput: number = 10;
        const expectedOutput: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        expect(generateArrayOfNumbers(mockInput)).toStrictEqual(expectedOutput);
    });
});
