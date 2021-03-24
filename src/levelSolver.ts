/**
 * @param {string} line Line to analyze
 */
export default (line: string): number => {
    const chars = line.split('')
    let level = 0
    let strs = {
        template: 0,
        double: 0,
        single: 0
    }
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i]
        if (char !== '\\') {
            if (char === '`') {
                strs.template = strs.template ? 0 : 1
            } else if (char === '"') {
                strs.double = strs.double ? 0 : 1
            } else if (char === "'") {
                strs.single = strs.single ? 0 : 1
            } else if (!strs.template && !strs.double && !strs.single) {
                if (char === '{') {
                    level++
                } else if (char === '}') {
                    level--
                }
            }
        }
    }

    return level
}