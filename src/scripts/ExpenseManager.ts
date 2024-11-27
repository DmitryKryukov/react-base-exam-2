import { DataLoader } from './data/DataLoader';
import { IExpense, expenseCategories, IExpenseCategory } from './Expense';
import { isValidExpenseType } from './data/ValidateRules';

class ExpenseManager {
    private expenses: IExpense[] = [];

    constructor() {
        this.loadExpenses();
    }

    public addExpense(expense: IExpense) {
        this.expenses.push(expense);
        this.saveExpenses();
    }
 
    public editExpense(updatedExpense: IExpense) {
        this.expenses = this.expenses.map(expense =>
            expense.id === updatedExpense.id ? updatedExpense : expense
        );
        this.saveExpenses();
    }

    public deleteExpense(expenseToDelete: IExpense): void {
        this.expenses = this.expenses.filter(expense => expense !== expenseToDelete);
        this.saveExpenses();
    }

    public saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    public getExpenses(): IExpense[] {
        return this.expenses
    }

    public getCategoryByID(id: string): IExpenseCategory | null {
        const category = expenseCategories.find(category => category.id === id);
        return category || null;
    }

    public loadExpenses() {
        const loader = new DataLoader<IExpense>(
            'expenses',
            isValidExpenseType.bind(this),
            this.createExpenseFromParsedData.bind(this),
            this.errorLoadingExpenses.bind(this)
        );
        const loadedExpenses = loader.loadFromLocalStorage();

        if (loadedExpenses) {
            this.expenses = loadedExpenses;
        }
    }

    private createExpenseFromParsedData(data: any): IExpense {
        return {
            id: data.id,
            value: data.value,
            category: data.category,
            date: new Date(data.date)
        };
    }

    private errorLoadingExpenses() {
        alert('Всё сломалось, шеф!')
    }
}

export { ExpenseManager }