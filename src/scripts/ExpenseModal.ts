import { IExpense, expenseCategories } from "./Expense";
import { DraggableModal } from "./modal/DraggableModal";
import { renderTemplate } from "./utility/Render";
import { parseFormattedDate, formatDate } from "./utility/DateUtility";

class ExpenseModal extends DraggableModal {
    private handleMainExpenseEvent: (evt: Event) => void;
    private expense: IExpense | null;
    private elements;

    public openModalExpense(expense?: IExpense): void {
        this.expense = expense || null;
        this.openModal();
    }

    protected initializeModalElements(): void {
        super.initializeModalElements();
        this.updateElements();
        this.renderCategories();
        this.resetModal();

        this.elements.buttonMainButtonText.textContent = "Добавить расход";
        
        if (this.expense) {
            this.populateModal();
        }
    }

    protected initializeModalEvents(): void {
        super.initializeModalEvents();
        this.handleMainExpenseEvent = this.handleMainExpenseAction.bind(this);
    }

    protected bindEvents(): void {
        super.bindEvents();
        this.elements.buttonMainButton.addEventListener('click', this.handleMainExpenseEvent);
    }

    protected afterOpen(): void {
        super.afterOpen();
        this.elements.inputExpenseValue.focus();
    }

    protected afterClose(): void {
        super.afterClose();
        this.elements.buttonMainButton.removeEventListener('click', this.handleMainExpenseEvent);
    }

    private updateElements(): void {
        this.elements = {
            buttonMainButton: this.modalElement.querySelector<HTMLButtonElement>('#js-button-modal-expense'),
            buttonMainButtonText: this.modalElement.querySelector<HTMLElement>(".button__text"),
            inputExpenseValue: this.modalElement.querySelector<HTMLInputElement>('#js-input-expense-value'),
            inputExpenseDate: this.modalElement.querySelector<HTMLInputElement>('#js-input-expense-date'),
            wrapperCategories: this.modalElement.querySelector<HTMLElement>('#js-modal-categories-wrapper')
        };
    }

    private renderCategories(): void {
        this.elements.wrapperCategories.innerHTML = "";

        let firstInputElement: boolean = true;

        expenseCategories.forEach(expenseCategory => {
            renderTemplate("#template-expense-category", this.elements.wrapperCategories, (fragment) => {
                const chipElement: HTMLElement = fragment.querySelector('.chip');
                const chipInputElement: HTMLInputElement = fragment.querySelector('.chip__input');
                const chipLabel: HTMLElement = fragment.querySelector('.chip__text');
                const chipIcon: HTMLImageElement = fragment.querySelector('.chip__icon');

                chipInputElement.value = expenseCategory.id;
                chipInputElement.checked = firstInputElement;
                chipLabel.textContent = expenseCategory.name;

                chipElement.style.setProperty("--active-color", expenseCategory.color || "");

                if (expenseCategory.iconSrc) {
                    chipIcon.src = expenseCategory.iconSrc;
                } else {
                    chipIcon.remove();
                }

                firstInputElement = false;
            });
        });
    }

    private populateModal(): void {
        if (this.expense) {
            this.elements.inputExpenseValue.value = this.expense.value.toString();
            this.elements.inputExpenseDate.value = formatDate(this.expense.date);
            this.elements.wrapperCategories.querySelector(`.chip__input[value='${this.expense.category.id}']`).checked = true;
            this.elements.buttonMainButtonText.textContent = "Редактировать!";
        }
    }

    private resetModal(): void {
        this.elements.inputExpenseValue.value = "";
        
        const today = new Date();
        this.elements.inputExpenseDate.value = formatDate(today);
    }

    private handleMainExpenseAction(evt: Event): void {
        if (this.expense) {
            this.expense.value = Number(this.elements.inputExpenseValue.value);
            this.expense.date = parseFormattedDate(this.elements.inputExpenseDate.value);

            const selectedCategoryId = this.elements.wrapperCategories.querySelector(`.chip__input:checked`).value;
            this.expense.category = expenseCategories.find(category => category.id === selectedCategoryId);

            this.dispatchEditExpenseEvent(this.expense);
        } else {
            this.dispatchCreateExpenseEvent(
                Number(this.elements.inputExpenseValue.value),
                this.elements.wrapperCategories.querySelector('.chip__input:checked').value,
                parseFormattedDate(this.elements.inputExpenseDate.value)
            );
        }
        
        this.closeModal();
    }

    protected handleKeyPress(evt: KeyboardEvent): void {
        super.handleKeyPress(evt);

        if (evt.shiftKey && evt.key === 'Enter') {
            this.handleMainExpenseEvent(evt);
            evt.preventDefault();
        }
    }

    private dispatchCreateExpenseEvent(expenseValue: number, expenseCategoryID: string, expenseDate: Date | null): void {
        const evt = new CustomEvent("createExpense", {
            detail: { expenseValue, expenseCategoryID, expenseDate }
        });

        document.dispatchEvent(evt);
    }

    private dispatchEditExpenseEvent(expense: IExpense): void {
        const evt = new CustomEvent("editExpense", {
            detail: { expense }
        });

        document.dispatchEvent(evt);
    }
}

export { ExpenseModal };
