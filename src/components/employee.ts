const employeeCountMap = {
    "1500+": 1500,
    "800—1500": 1200,
    "200—800": 500,
    "81—200": 150,
};

const defaultEmployeeCount = 15;

export function getEmployeeCount(key: string, officeCount: number): [number, number] {
    if (employeeCountMap.hasOwnProperty(key)) {
        const count = employeeCountMap[key];

        return [count, count / officeCount];
    }

    return [defaultEmployeeCount, defaultEmployeeCount];
}