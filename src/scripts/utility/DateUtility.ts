function relativeTimeFormat(date: Date, precision: boolean | 'force' = true): string {
    const now = new Date();
    const differenceInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' });

    const thresholds: Array<{ limit: number; unit: Intl.RelativeTimeFormatUnit }> = [
        { limit: 60, unit: 'second' },
        { limit: 3600, unit: 'minute' },
        { limit: 86400, unit: 'hour' },
        { limit: 2592000, unit: 'day' },
        { limit: 31536000, unit: 'month' }
    ];

    const absDifferenceInSeconds = Math.abs(differenceInSeconds);
    
    if (precision === 'force') {
        const absDifferenceInDays = absDifferenceInSeconds / 86400;

        if (absDifferenceInDays < 30) {
            return rtf.format(differenceInSeconds < 0 ? -Math.floor(absDifferenceInDays) : Math.ceil(absDifferenceInDays), 'day');
        } else if (absDifferenceInDays < 365) {
            return rtf.format(differenceInSeconds < 0 ? -Math.floor(absDifferenceInDays / 30) : Math.ceil(absDifferenceInDays / 30), 'month');
        } else {
            return rtf.format(differenceInSeconds < 0 ? -Math.floor(absDifferenceInDays / 365) : Math.ceil(absDifferenceInDays / 365), 'year');
        }
    }

    for (const { limit, unit } of thresholds) {
        if (absDifferenceInSeconds < limit) {
            const previousLimit = thresholds[thresholds.indexOf({ limit, unit }) - 1]?.limit || 1;
            const value = Math.floor(differenceInSeconds / (previousLimit / (limit / previousLimit)));
            return rtf.format(value, unit);
        }
    }

    return rtf.format(differenceInSeconds < 0 ? -Math.floor(absDifferenceInSeconds / 31536000) : Math.floor(absDifferenceInSeconds / 31536000), 'year');
}


function formatDate(date: Date): string{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return  `${year}-${month}-${day}`;
}

function formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseFormattedDateTime(formattedDateTime): Date {
    const [datePart, timePart] = formattedDateTime.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute);
}

function parseFormattedDate(formattedDate: string): Date {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const [year, month, day] = formattedDate.split('-').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
}

function isBeforeNow(date: Date): boolean {
    const now = new Date();
    return date > now;
}

function formatMonthYear(dateString: string): string {
    const [yearStr, monthStr] = dateString.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const currentYear = new Date().getFullYear();

    if (year === currentYear) {
        return monthNames[monthIndex];
    } else {
        return `${monthNames[monthIndex]}, ${year}`;
    }
}

export { relativeTimeFormat, formatDate, formatDateTime, formatMonthYear, parseFormattedDateTime, parseFormattedDate, isBeforeNow };