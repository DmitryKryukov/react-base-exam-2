import { renderTemplate } from "../utility/Render";

class Modal {
    public isOpen: boolean = false;

    protected mainWrapperElement: HTMLElement;
    protected modalWrapperElement: HTMLElement;
    protected modalElement: HTMLElement;
    private modalOverlayElement: HTMLElement;
    private modalCloseButtonElement: HTMLElement;

    protected handleKeyPressEvent: (evt: KeyboardEvent) => void;
    protected handleClose: () => void;
    protected handleAfterOpen: () => void;
    protected handleAfterClose: () => void;


    constructor() {
        this.mainWrapperElement = document.querySelector('#main-wrapper');
        this.modalWrapperElement = document.querySelector('#modal-wrapper');
        this.modalOverlayElement = this.modalWrapperElement.querySelector('.modal-wrapper__overlay');

        this.handleKeyPressEvent = this.handleKeyPress.bind(this);
        this.handleAfterOpen = () => this.afterOpen();
        this.handleClose = () => this.closeModal();
        this.handleAfterClose = () => this.afterClose();
    }

    public initModal(templateID: string): void {
        renderTemplate(templateID, this.modalWrapperElement);
        this.updateBasicElements();
    }

    public openModal(): void {
        this.beforeOpen()
        this.initializeModalElements();
        this.initializeModalEvents();
        this.bindEvents();

        requestAnimationFrame(() => {
            this.modalWrapperElement.classList.add('modal-wrapper--open');
        });

        this.isOpen = true;
    }

    protected beforeOpen(): void {
        this.modalWrapperElement.removeAttribute('inert');
        this.mainWrapperElement.setAttribute('inert', '');
    }

    protected updateBasicElements(): void {
        this.modalElement = this.modalWrapperElement.querySelector(".modal");
        this.modalCloseButtonElement = this.modalWrapperElement.querySelector('#js-button-modal-close');
    }

    protected initializeModalElements() { }

    protected initializeModalEvents() { }

    protected bindEvents(): void {
        this.modalOverlayElement.addEventListener("click", this.handleClose);
        this.modalCloseButtonElement.addEventListener('click', this.handleClose);
        this.modalOverlayElement.addEventListener("transitionend", this.handleAfterOpen);
        document.addEventListener('keyup', this.handleKeyPressEvent);
    }

    protected unbindEvents():void {
        this.modalOverlayElement.removeEventListener("click", this.handleClose);
        this.modalCloseButtonElement.removeEventListener('click', this.handleClose);
        this.modalOverlayElement.removeEventListener("transitionend", this.handleAfterClose);
        this.modalOverlayElement.removeEventListener("transitionend", this.handleAfterOpen);
        document.removeEventListener('keyup', this.handleKeyPressEvent);
    }

    protected afterOpen(): void {
        this.modalOverlayElement.addEventListener("transitionend", this.handleAfterOpen);
    }

    protected afterClose(): void {
      this.unbindEvents()
    }

    protected handleKeyPress(evt: KeyboardEvent): void {
        evt.preventDefault();

        if (evt.key === 'Escape') {
            this.closeModal();
        }
    }

    protected closeModal(): void {
        this.isOpen = false;

        this.modalWrapperElement.classList.remove("modal-wrapper--open");    
        this.modalWrapperElement.setAttribute('inert', '');
        this.mainWrapperElement.removeAttribute('inert');
        
        this.modalOverlayElement.addEventListener("transitionend", this.handleAfterClose);
    }
}

export { Modal };