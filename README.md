# aoc-glob-parser
A parser for a specific custom glob-like format to select/filter AoC problems

---

- `a;b = a+b` Multiple sets of rules are split with `;`, combining uses set union.
- `a:b = a-b` Per set denote include rules as `a` and exclude rules as `b`.
- `a.b.c = y.m.p` For both includes and excludes, denote rules as three parts split by `.` like so: `years.days.parts`.
- `a,b = a+b` Within a rule, terms are split with `,`, combining uses set union.
- `a = a` Denote a single specified value.
- `a-b = a, a+1, ..., b-1, b` Denote a range of values from a to b (inclusive).
- `a- = a, a+1, ..., MAX-1, MAX` Denote a range of values from a to MAX (inclusive).
- `-b = MIN, MIN+1, ..., b-1, b` Denote a range of values from MIN to b (inclusive).
- `- = MIN, MIN+1, ..., MAX-1, MAX` Denote a range of values from MIN to MAX (inclusive).
