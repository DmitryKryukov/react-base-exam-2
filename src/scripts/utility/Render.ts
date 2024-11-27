function renderTemplate(templateID: string, container: HTMLElement | string, preRenderFunction?: (fragment: DocumentFragment) => void) {
    const template: HTMLTemplateElement = document.querySelector(templateID);

    if (!template) {
        console.error(`Не найден шаблон с ID «${templateID}».`);
        return;
    }

    const documentFragment = document.importNode(template.content, true);

    if (preRenderFunction) {
        preRenderFunction(documentFragment);
    }

    const containerElement = typeof container === "string"
        ? document.querySelector(container) as HTMLElement
        : container;

    if (!containerElement) {
        console.error(`Не найден контейнер с ID «${container}».`);
        return;
    }

    containerElement.append(documentFragment);
}

export {renderTemplate}