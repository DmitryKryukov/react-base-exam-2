function formatNumberByDigits(value: number): string {
    return value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');
}

export { formatNumberByDigits }