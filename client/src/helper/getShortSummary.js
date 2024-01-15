
const getShortSummary = (summary) => {
    if(summary === undefined) return 'No Summary'
    if(summary.length > 120) {
        summary = summary.substring(0, 100) + '...'
        return summary
    }
    return summary
}

export default getShortSummary