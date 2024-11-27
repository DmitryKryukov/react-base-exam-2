import { IExpense, IExpenseCategory, expenseCategories } from "../Expense";

interface IExpenseGroupDay {
    day: Date;
    expenses: IExpense[];
}

interface IExpenseGroupMonth {
    month: string;
    expenses: IExpense[];
}

interface IExpenseGroupYear {
    year: number;
    expenses: IExpense[];
}

interface IExpenseGroupCategory {
    category: IExpenseCategory;
    expenses: IExpense[];
}

function groupExpenses(expenses: IExpense[], keyword: 'day' | 'month' | 'year' | 'category'): IExpenseGroupDay[] | IExpenseGroupMonth[] | IExpenseGroupYear[] | IExpenseGroupCategory[] {
    const grouped = new Map<string, IExpense[]>();

    expenses.forEach(expense => {
        let key: string;

        switch (keyword) {
            case 'day':
                const date = new Date(expense.date);
                key = date.toISOString().split('T')[0];
                break;
            case 'month':
                const monthDate = new Date(expense.date);
                key = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
                break;
            case 'year':
                const yearDate = new Date(expense.date);
                key = String(yearDate.getFullYear());
                break;
            case 'category':
                key = expense.category.id;
                break;
            default:
                throw new Error("Ошибочный ключ.");
        }

        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key)!.push(expense);
    });

    let result: any[];

    switch (keyword) {
        case 'day':
            result = Array.from(grouped.entries()).map(([key, expenses]) => ({
                day: new Date(key),
                expenses
            })) as IExpenseGroupDay[];
            result.sort((a, b) => a.day.getTime() - b.day.getTime());
            return result;

        case 'month':
            result = Array.from(grouped.entries()).map(([key, expenses]) => ({
                month: key,
                expenses
            })) as IExpenseGroupMonth[];
            result.sort((a, b) => a.month.localeCompare(b.month));
            return result;

        case 'year':
            result = Array.from(grouped.entries()).map(([key, expenses]) => ({
                year: Number(key),
                expenses
            })) as IExpenseGroupYear[];
            result.sort((a, b) => a.year - b.year);
            return result;

        case 'category':
            result = Array.from(grouped.entries()).map(([key, expenses]) => ({
                category: expenseCategories.find(cat => cat.id === key)!,
                expenses
            })) as IExpenseGroupCategory[];
            result.sort((a, b) => b.category.name.localeCompare(a.category.name));
            return result;

        default:
            return [];
    }
}

export { IExpenseGroupDay, IExpenseGroupMonth, IExpenseGroupYear, groupExpenses };
