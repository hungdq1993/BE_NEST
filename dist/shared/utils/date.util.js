"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateVN = formatDateVN;
exports.formatDateTimeVN = formatDateTimeVN;
exports.startOfDay = startOfDay;
exports.endOfDay = endOfDay;
exports.startOfMonth = startOfMonth;
exports.endOfMonth = endOfMonth;
exports.isPast = isPast;
exports.isFuture = isFuture;
exports.isSameDay = isSameDay;
exports.addDays = addDays;
exports.addHours = addHours;
exports.diffInDays = diffInDays;
exports.getMonthYearString = getMonthYearString;
exports.parseMonthYearString = parseMonthYearString;
function formatDateVN(date) {
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}
function formatDateTimeVN(date) {
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}
function startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}
function endOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}
function startOfMonth(date) {
    const result = new Date(date);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
}
function endOfMonth(date) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    result.setDate(0);
    result.setHours(23, 59, 59, 999);
    return result;
}
function isPast(date) {
    return date.getTime() < Date.now();
}
function isFuture(date) {
    return date.getTime() > Date.now();
}
function isSameDay(date1, date2) {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate());
}
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function addHours(date, hours) {
    const result = new Date(date);
    result.setTime(result.getTime() + hours * 60 * 60 * 1000);
    return result;
}
function diffInDays(date1, date2) {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
function getMonthYearString(month, year) {
    return `${month.toString().padStart(2, '0')}/${year}`;
}
function parseMonthYearString(monthYear) {
    const match = monthYear.match(/^(\d{1,2})\/(\d{4})$/);
    if (!match)
        return null;
    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10);
    if (month < 1 || month > 12)
        return null;
    return { month, year };
}
//# sourceMappingURL=date.util.js.map