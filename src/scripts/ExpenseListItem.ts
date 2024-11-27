import { IExpense } from "./Expense";
import { renderTemplate } from "./utility/Render";
import { formatNumberByDigits } from "./utility/StringUtility";
import { IDragEvent } from "./modal/DraggableModal";
import { linearInterpolation } from "./utility/MathUtility";

class ExpenseListItem {
    private expense: IExpense;
    private isDragging: boolean = false;
    private isCanEdit: boolean = true;
    private startX: number = 0;
    private currentX: number = 0;
    private deleteThreshold: number = 200;

    private dragStartHandler: (event: MouseEvent | TouchEvent) => void;
    private dragHandler: (event: MouseEvent | TouchEvent) => void;
    private dragEndHandler: () => void;
    private dragEventsHandlers: IDragEvent[];
    private rootNode: HTMLElement;
    private handleAfterTransitionToDelete: (event) => void;
    private handleAfterTransitionToStay: (event) => void;

    constructor(expense: IExpense, containerElement: HTMLElement) {
        this.expense = expense;

        this.dragStartHandler = this.onDragStart.bind(this);
        this.dragHandler = this.onDrag.bind(this);
        this.dragEndHandler = this.onDragEnd.bind(this);

        this.dragEventsHandlers = [
            { event: 'mousedown', handler: this.dragStartHandler },
            { event: 'touchstart', handler: this.dragStartHandler },
            { event: 'mousemove', handler: this.dragHandler },
            { event: 'touchmove', handler: this.dragHandler },
            { event: 'mouseup', handler: this.dragEndHandler },
            { event: 'touchend', handler: this.dragEndHandler },
            { event: 'mouseleave', handler: this.dragEndHandler },
        ];

        this.handleAfterTransitionToStay = this.afterTransitionToStay.bind(this);
        this.handleAfterTransitionToDelete = this.afterTransitionToDelete.bind(this);
        this.renderExpense(containerElement);
    }

    public renderExpense(containerElement: HTMLElement): void {
        renderTemplate('#template-expense', containerElement, (fragment) => {
            const rootElement: HTMLElement = fragment.querySelector('.expense');
            const valueElement: HTMLElement = fragment.querySelector('.expense__value');
            const categoryIconElement: HTMLImageElement = fragment.querySelector('.expense-category__icon');
            const categoryNameElement: HTMLElement = fragment.querySelector('.expense-category__name');

            rootElement.style.setProperty('--accent-color', this.expense.category.color);
            valueElement.textContent = formatNumberByDigits(this.expense.value);
            categoryIconElement.src = this.expense.category.iconSrc;
            categoryIconElement.alt = this.expense.category.name;
            categoryNameElement.textContent = this.expense.category.name;

            this.rootNode = rootElement;
            this.bindEvents();
        });
    }

    private bindEvents(): void {
        this.rootNode.addEventListener("click", this.dispatchOpenModalExpense.bind(this));
        this.bindDragEvents();
    }

    private bindDragEvents(): void {
        this.dragEventsHandlers.forEach(({ event, handler }) => {
            this.rootNode.addEventListener(event, handler);
        });
    }

    private unbindDragEvents(): void {
        this.dragEventsHandlers.forEach(({ event, handler }) => {
            this.rootNode.removeEventListener(event, handler);
        });
    }

    private onDragStart(event: MouseEvent): void {
        this.rootNode.style.setProperty("--transition-time", "0");
        this.rootNode.classList.add("dragging");
        this.isDragging = true;

        setTimeout(() => {
            this.isCanEdit = false;
        }, 100);

        this.startX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
    }

    private onDrag(event: MouseEvent): void {
        if (!this.isDragging) return;

        this.currentX = Math.min(
            0,
            ('touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX) - this.startX
        );

        this.rootNode.style.setProperty("--drag-item-x", `${this.currentX}px`);
    }

    private onDragEnd(): void {
        this.rootNode.classList.remove("dragging");
        const dragDistance = Math.abs(this.currentX);

        if (dragDistance > this.deleteThreshold) {
            this.rootNode.style.setProperty("--transition-time", "0.3s");
            this.rootNode.style.setProperty("--drag-item-x", "-100%");
            this.rootNode.addEventListener("transitionend", this.handleAfterTransitionToDelete);
        } 
        else {
            this.rootNode.style.setProperty("--drag-item-x", "0");
            const transitionTime = linearInterpolation(0, this.deleteThreshold, dragDistance * 0.3);
            this.rootNode.style.setProperty("--transition-time", `${transitionTime}s`);
            this.rootNode.addEventListener("transitionend", this.handleAfterTransitionToStay);
        }

        setTimeout(() => {
            this.isCanEdit = true;
        }, 100);

        this.isDragging = false;
    }

    private afterTransitionToStay(event): void {
        if (event.propertyName === "translate") {
            this.isCanEdit = true;
            this.rootNode.removeEventListener("transitionend", this.handleAfterTransitionToStay);
        }
    }

    private afterTransitionToDelete(event): void {
        if (event.propertyName === "translate") {

            this.unbindDragEvents();
            this.rootNode.removeEventListener("transitionend", this.handleAfterTransitionToDelete);
            this.dispatchDelete();
        }
    }

    private dispatchOpenModalExpense(): void {
        if (this.isCanEdit) {
            const evt = new CustomEvent("openExpensesModal", { detail: { expense: this.expense } });
            document.dispatchEvent(evt);
        }

        this.isDragging = false;
    }

    private dispatchDelete(): void {
        this.rootNode.classList.add("expense--collapse");

        const evt = new CustomEvent("deleteExpense", { detail: { expense: this.expense } });

        setTimeout(() => {
            document.dispatchEvent(evt);
        }, 150);
    }
}

export { ExpenseListItem };
