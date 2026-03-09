/**
 * DIANOMY — Utilities
 * Data extraction from NITW student emails.
 */

const DEPARTMENTS = {
    'CE': 'Civil Engineering',
    'EE': 'Electrical Engineering',
    'ME': 'Mechanical Engineering',
    'EC': 'Electronics and Communication Engineering',
    'MM': 'Metallurgical and Materials Engineering',
    'CH': 'Chemical Engineering',
    'CS': 'Computer Science and Engineering',
    'BT': 'Biotechnology',
    'CD': 'Mathematics and Computing',
    'MA': 'Mathematics',
    'PY': 'Physics',
    'CY': 'Chemistry',
    'MS': 'Management Studies',
    'HS': 'Humanities & Social Science'
};

const BRANCHES = {
    'A': 'Dual Degree',
    'B': 'B.Tech',
    'C': 'M.Sc',
    'D': 'PG Diploma',
    'E': 'M.Sc (Int)',
    'F': 'MCA',
    'G': 'MBA',
    'H': 'MS',
    'M': 'M.Tech',
    'R': 'Research'
};

const Utils = {
    /**
     * Extracts data from NITW email format: ab12cde3f45@student.nitw.ac.in
     * ab - name (ignored)
     * 12 - year of joining (2012)
     * cd - department
     * e - branch
     */
    extractNitwEmailData(email) {
        if (!email || !email.includes('@student.nitw.ac.in')) {
            return null;
        }

        const localPart = email.split('@')[0];
        // Regex to match: [chars][2 digits][2 chars department][1 char branch][any]
        // Example: ab12cde3f45
        // [a-z]+ matches 'ab'
        // (\d{2}) matches '12' -> group 1
        // ([a-zA-Z]{2}) matches 'cd' -> group 2
        // ([a-zA-Z]) matches 'e' -> group 3
        const match = localPart.match(/^[a-z]+(\d{2})([a-zA-Z]{2})([a-zA-Z])/);

        if (!match) return null;

        const yearSuffix = match[1];
        const deptCode = match[2].toUpperCase();
        const branchCode = match[3].toUpperCase();

        return {
            year: '20' + yearSuffix,
            department: DEPARTMENTS[deptCode] || deptCode,
            branch: BRANCHES[branchCode] || branchCode
        };
    }
};
