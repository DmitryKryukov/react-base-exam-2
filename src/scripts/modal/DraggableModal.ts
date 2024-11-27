import { Modal } from "./Modal";
import { linearInterpolation } from "../utility/MathUtility";

interface IDragEvent {
    event: string;
    handler: (event: Event) => void;
}

class DraggableModal extends Modal {
    private modalDragHandler: HTMLElement;
    private isDragging: boolean = false;
    private startY: number = 0;
    private currentY: number = 0;
    private closeThreshold: number;

    private dragEventsHandlers: IDragEvent[];

    constructor(closeThreshold?: number) {
        super();
        this.closeThreshold = closeThreshold ?? window.innerHeight / 4;
        this.dragEventsHandlers = [
            { event: 'mousedown', handler: this.onDragStart.bind(this) },
            { event: 'touchstart', handler: this.onDragStart.bind(this) },
            { event: 'mousemove', handler: this.onDrag.bind(this) },
            { event: 'touchmove', handler: this.onDrag.bind(this) },
            { event: 'mouseup', handler: this.onDragEnd.bind(this) },
            { event: 'touchend', handler: this.onDragEnd.bind(this) },
            { event: 'mouseleave', handler: this.onDragEnd.bind(this) },
        ];
    }

    protected beforeOpen(): void {
        super.beforeOpen();
        this.resetDrag();
    }

    protected updateBasicElements(): void {
        super.updateBasicElements();
        this.modalDragHandler = this.modalWrapperElement.querySelector("#js-modal-drag-handler");
    }

    protected bindEvents(): void {
        super.bindEvents();
        this.bindDragEvents();
    }

    private bindDragEvents(): void {
        this.dragEventsHandlers.forEach(({ event, handler }) => {
            this.modalWrapperElement.addEventListener(event, handler);
        });
    }

    protected unbindDragEvents(): void {
        this.dragEventsHandlers.forEach(({ event, handler }) => {
            this.modalWrapperElement.removeEventListener(event, handler);
        });
    }

    protected afterClose(): void {
        super.afterClose();
        this.unbindDragEvents();
    }

    private resetDrag(): void {
        this.modalDragHandler.style.setProperty("--drag-modal-y", "0");
        this.currentY = 0;
    }

    private getClientY(event: MouseEvent | TouchEvent): number {
        return 'touches' in event ? event.touches[0].clientY : (event as MouseEvent).clientY;
    }

    private onDragStart(event: MouseEvent | TouchEvent): void {
        this.modalDragHandler.style.setProperty("--transition-time", "0s");
        this.modalDragHandler.classList.add("dragging");
        this.isDragging = true;
        this.startY = this.getClientY(event);
    }

    private onDrag(event: MouseEvent | TouchEvent): void {
        if (!this.isDragging) return;

        this.currentY = Math.max(0, this.getClientY(event) - this.startY);
        this.modalDragHandler.style.setProperty("--drag-modal-y", `${this.currentY}px`);
    }

    private onDragEnd(): void {
        if (!this.isDragging) return;

        const dragDistance = Math.abs(this.currentY);

        if (dragDistance > this.closeThreshold) {
            this.closeModal();
        } else {
            const transitionTime = linearInterpolation(0, this.closeThreshold, dragDistance) * 0.3;
            this.modalDragHandler.style.setProperty("--transition-time", `${transitionTime}s`);
            this.resetDrag();
        }
        
        this.modalDragHandler.classList.remove("dragging");
        this.isDragging = false;
    }
}

export { DraggableModal, IDragEvent };