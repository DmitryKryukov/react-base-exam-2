import './styles.scss';
import { IExpense } from './scripts/Expense';
import { InterfaceManager } from './scripts/InterfaceManager';
import { ExpenseManager } from './scripts/ExpenseManager';
import { ExpenseModal } from './scripts/ExpenseModal';

class App {
    private interfaceManager = new InterfaceManager();
    private expenseManager = new ExpenseManager();
    private expenseModal = new ExpenseModal();
    private renderedExpenses: IExpense[] = [];
    private groupParameter: "day" | "month" | "year" = "day";
    
    constructor() {
        this.expenseManager.loadExpenses();
        this.updateRenderedExpenses();
        this.bindEvents();
        this.expenseModal.initModal('#template-modal-expense');
    }

    private bindEvents() {
        document.addEventListener('openExpensesModal', (evt: CustomEvent) => 
            this.handleOpenExpesesModal(evt)
        );

        document.addEventListener('createExpense', (evt: CustomEvent) => 
            this.handleCreateExpense(evt)
        );

        document.addEventListener('editExpense', (evt: CustomEvent) => 
            this.handleEditExpense(evt)
        );

        document.addEventListener('deleteExpense', (evt: CustomEvent) => 
            this.handleDeleteExpense(evt)
        );

        document.addEventListener('changeExpensesGroup', (evt: CustomEvent) => 
            this.handleChangeExpensesGroup(evt)
        );

        document.addEventListener('keyup', (evt: KeyboardEvent) => 
            this.handleKeyPress(evt)
        );
    }

    private updateRenderedExpenses() {
        this.renderedExpenses = this.expenseManager.getExpenses();
        this.interfaceManager.renderExpenses(this.renderedExpenses, this.groupParameter);
    }

    private handleCreateExpense(evt: CustomEvent) {
        const { expenseValue, expenseCategoryID, expenseDate } = evt.detail;
        
        const newExpense: IExpense = {
            id: Date.now().toString(),
            value: expenseValue,
            category: this.expenseManager.getCategoryByID(expenseCategoryID),
            date: expenseDate
        };

        this.expenseManager.addExpense(newExpense);
        this.updateRenderedExpenses();
    }

    private handleEditExpense(evt: CustomEvent) {
        const { expense } = evt.detail;
        
        this.expenseManager.editExpense(expense);
        this.updateRenderedExpenses();
    }

    private handleDeleteExpense(evt: CustomEvent) {
        const { expense } = evt.detail;
        
        this.expenseManager.deleteExpense(expense);
        this.updateRenderedExpenses();
    }

    private handleChangeExpensesGroup(evt: CustomEvent) {
        this.groupParameter = evt.detail.value;
        this.updateRenderedExpenses();
    }

    private handleOpenExpesesModal(evt: CustomEvent) {
        const { expense } = evt.detail;
        
        this.expenseModal.openModalExpense(expense);
    }

    private handleKeyPress(evt: KeyboardEvent) {
        if (evt.shiftKey && (evt.key === 'N' || evt.key === 'Т') && !this.expenseModal.isOpen) {
            this.expenseModal.openModalExpense();
            evt.preventDefault();
        }
    }
}

const app = new App();
export { App };
