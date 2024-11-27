function isValidExpenseType(expense: any): boolean {
    return (
        typeof expense.id === 'string' &&
        typeof expense.value === 'number' &&
        expense.value >= 0 &&
        isValidExpenseCategoryType(expense.category) &&
        !isNaN( new Date(expense.date).getTime() )
    );
}

function isValidExpenseCategoryType(category: any): boolean {
    return (
        typeof category.id === 'string' &&
        typeof category.name === 'string' &&
        (typeof category.iconSrc === 'string' || category.iconSrc === null) &&
        typeof category.color === 'string'
    );
}

export { isValidExpenseType, isValidExpenseCategoryType };