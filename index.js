const LAST_YEAR = (() => {
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear();
    const aocStartTime = new Date(currentYear, 11, 0);
    return (currentTime > aocStartTime ? currentYear : currentYear - 1);
})();

const FIRST_YEAR = 2015;
const FIRST_DAY = 1;
const FIRST_PART = 1;

const YEARS = LAST_YEAR - FIRST_YEAR + 1;
const DAYS_PER_YEAR = 25;
const PARTS_PER_DAY = 2;

const VALID_YEARS = Array.from(Array(YEARS)).map((_, i) => i + FIRST_YEAR);
const VALID_DAYS = Array.from(Array(DAYS_PER_YEAR)).map((_, i) => i + FIRST_DAY);
const VALID_PARTS = Array.from(Array(PARTS_PER_DAY)).map((_, i) => i + FIRST_PART);

const INPUT_REGEX = (() => {
    const value = '\\d*';
    const range = `${value}(?:-${value})?`;
    const rule = `${range}(?:,${range})*`;
    const inex = `${rule}(?:\\.${rule}){0,2}`;
    const set = `${inex}(?::${inex})?`;
    const glob = `${set}(?:;${set})*`;
    return new RegExp(`^${glob}$`);
})();

const isInRange = (min, max, value) => min <= value && value <= max;

const mergeFlags = (A, B) => A.map((a, i) => a || B[i]);

const parseRule = (valids, rule = '') => {
    return valids.map((value) => {
        const terms = rule.split(/,/g);
        return terms.some((term) => {
            let [a, b = a] = term.split('-');
            if (a === '') {
                a = valids[0];
            }
            if (b === '') {
                b = valids[valids.length - 1];
            }
            return isInRange(Number(a), Number(b), value);
        });
    });
};

const parseSet = (input) => {
    const [include, exclude = ''] = input.split(':');
    const [includeYears, includeDays, includeParts] = include.split(/\./g);
    const [excludeYears, excludeDays, excludeParts] = exclude.split(/\./g);

    const includedYearFlags = parseRule(VALID_YEARS, includeYears || VALID_YEARS.toString());
    const excludedYearFlags = parseRule(VALID_YEARS, excludeYears || VALID_YEARS.toString());
    const includedDayFlags = parseRule(VALID_DAYS, includeDays || VALID_DAYS.toString());
    const excludedDayFlags = parseRule(VALID_DAYS, excludeDays || VALID_DAYS.toString());
    const includedPartFlags = parseRule(VALID_PARTS, includeParts || VALID_PARTS.toString());
    const excludedPartFlags = parseRule(VALID_PARTS, excludeParts || VALID_PARTS.toString());
    // const includedYearFlags = (includeYears === '') ? Array(YEARS).fill(true) : parseRule(VALID_YEARS, includeYears);
    // const excludedYearFlags = (excludeYears === '') ? Array(YEARS).fill(false) : parseRule(VALID_YEARS, excludeYears);
    // const includedDayFlags = (includeDays === '') ? Array(DAYS_PER_YEAR).fill(true) : parseRule(VALID_DAYS, includeDays);
    // const excludedDayFlags = (excludeDays === '') ? Array(DAYS_PER_YEAR).fill(false) : parseRule(VALID_DAYS, excludeDays);
    // const includedPartFlags = (includeParts === '') ? Array(PARTS_PER_DAY).fill(true) : parseRule(VALID_PARTS, includeParts);
    // const excludedPartFlags = (excludeParts === '') ? Array(PARTS_PER_DAY).fill(false) : parseRule(VALID_PARTS, excludeParts);

    const flags = [];
    for (let year = 0; year < YEARS; year += 1) {
        for (let day = 0; day < DAYS_PER_YEAR; day += 1) {
            for (let part = 0; part < PARTS_PER_DAY; part += 1) {
                if (exclude !== '' && excludedYearFlags[year] && excludedDayFlags[day] && excludedPartFlags[part]) {
                    flags.push(false);
                } else if (includedYearFlags[year] && includedDayFlags[day] && includedPartFlags[part]) {
                    flags.push(true);
                } else {
                    flags.push(undefined);
                }
            }
        }
    }
    return flags;
};

const generateAllRows = () => {
    const rows = [];
    for (const year of VALID_YEARS) {
        for (const day of VALID_DAYS) {
            for (const part of VALID_PARTS) {
                rows.push({ year, day, part, string: `${year}.${day}.${part}` });
            }
        }
    }
    return rows;
};

const parse = (input) => {
    if (!input.match(INPUT_REGEX)) {
        throw new Error('Malformed input');
    }

    const sets = input.split(/;/g);
    const flags = sets.map(parseSet).reduce(mergeFlags);
    return generateAllRows().filter((_, i) => flags[i]);
};

module.exports = parse;
