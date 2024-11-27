import { IExpense } from "./Expense";
import { groupExpenses } from "./utility/ExpenseUtility";
import { ExpenseListItem } from "./ExpenseListItem";
import { formatNumberByDigits } from "./utility/StringUtility";
import { relativeTimeFormat, formatMonthYear } from "./utility/DateUtility";
import { renderTemplate } from "./utility/Render";

class InterfaceManager {
    private expenseListItems: ExpenseListItem[];
    private expensesWrapperNode: HTMLElement = document.querySelector('#js-expenses-wrapper');
    private groupsWrapperNode: HTMLElement = document.querySelector('#js-groups-wrapper');
    private elements;

    constructor() {
        this.updateElements();
        this.elements.buttonAddNewExpense.addEventListener('click', () => this.dispatchOpenModalExpense());
        this.renderHeaderGroupsFilter();
    }

    public renderExpenses(expenses: IExpense[], group?: "day" | "month" | "year"): void {
        this.expensesWrapperNode.innerHTML = '';
        this.expenseListItems = [];

        if (!expenses || expenses.length === 0) {
            this.renderZeroState();
            return;
        }

        const formatFunctions: { [key: string]: (group: any) => string } = {
            day: (group) => relativeTimeFormat(group.day, "force"),
            month: (group) => formatMonthYear(group.month),
            year: (group) => String(group.year),
            category: (group) => group.category.name
        };

        if (!group) {
            expenses.forEach(expense => this.renderExpenseListItem(expense, this.expensesWrapperNode));
        } else {
            const groupedExpenses = groupExpenses(expenses, group);
            const formatFunc = formatFunctions[group];
            formatFunc && this.renderGroupOfExpenses(groupedExpenses, formatFunc);
        }
    }

    private renderGroupOfExpenses(groupedExpenses: any[], formatFunc: (group: any) => string) {
        groupedExpenses.forEach(group => {
            let groupTotalValue = 0;

            const groupWrapperNode = document.createElement('div');
            groupWrapperNode.className = "expense-group";
            this.expensesWrapperNode.appendChild(groupWrapperNode);

            renderTemplate("#template-expense-group-name", groupWrapperNode, (fragment) => {
                const expenseGroupTextElement: HTMLElement = fragment.querySelector('.expense-group-name__text');
                expenseGroupTextElement.textContent = formatFunc(group);
                group.expenses.forEach(expense => {
                    this.renderExpenseListItem(expense, groupWrapperNode);
                    groupTotalValue += expense.value;
                });
            });

            const expenseGroupValueNode: HTMLElement = groupWrapperNode.querySelector('.expense-group-name__value');
            expenseGroupValueNode.textContent = formatNumberByDigits(groupTotalValue);
        });
    }

    private renderExpenseListItem(expense: IExpense, containerElement: HTMLElement): void {
        const expenseListItem = new ExpenseListItem(expense, containerElement);
        this.expenseListItems.push(expenseListItem);
    }

    private renderZeroState(): void {
        renderTemplate('#template-expenses-zero-state', this.expensesWrapperNode);
    }

    private renderHeaderGroupsFilter(): void {
        const groups = [
            { name: "по дням", value: "day" },
            { name: "по месяцам", value: "month" },
            { name: "по годам", value: "year" },
            { name: "по категории", value: "category" }
        ];

        let firstInputElement: boolean = true;

        groups.forEach(group => {
            renderTemplate('#template-expense-group', this.groupsWrapperNode, (fragment) => {
                const chipInputElement: HTMLInputElement = fragment.querySelector('.chip__input');
                const chipLabel: HTMLElement = fragment.querySelector('.chip__text');

                chipInputElement.value = group.value;
                chipInputElement.checked = firstInputElement;
                chipLabel.textContent = group.name;

                chipInputElement.addEventListener("change", () => {
                    this.dispatchChangeGroupExpense(chipInputElement.value);
                });
                
                firstInputElement = false;
            });
        });
    }

    private updateElements(): void {
        this.elements = {
            buttonAddNewExpense: document.querySelector('#js-button-add-new-expense')
        };
    }

    private dispatchOpenModalExpense(): void {
        const evt = new CustomEvent("openExpensesModal", { detail: { expense: null } });
        document.dispatchEvent(evt);
    }

    private dispatchChangeGroupExpense(value: string): void {
        const evt = new CustomEvent("changeExpensesGroup", { detail: { value } });
        document.dispatchEvent(evt);
    }
}

export { InterfaceManager };
