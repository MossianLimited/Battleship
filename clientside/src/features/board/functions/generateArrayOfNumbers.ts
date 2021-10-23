const generateArrayOfNumbers = (length: number): number[] => {
    let i = 0,
        a = Array(length);
    while (i < length) a[i++] = i;
    return a;
};

export default generateArrayOfNumbers;
