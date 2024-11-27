class DataLoader<T> {
    /**
     * @param key — ключ для доступа к данным в хранилище.
     * @param validate — функция для валидации загруженных данных.
     * @param onSuccess — функция для создания объекта типа T из загруженных данных.
     * @param onError — функция, вызываемая при ошибках загрузки или проверки данных.
     */
    constructor(
        private key: string,
        private validate: (data: any) => boolean,
        private onSuccess: (data: any) => T,
        private onError: Function
    ) { }

    loadFromLocalStorage(): T[] | null {
        const rawData = localStorage.getItem(this.key);
        if (!rawData) return null;

        try {
            const parsedData = JSON.parse(rawData);
            this.validateParsedData(parsedData);
            return parsedData.map(this.onSuccess);
        } catch (error) {
            this.onError(error);
            console.error(`Ошибка загрузки данных из localStorage для ключа "${this.key}":`, error);
            return null;
        }
    }

    private validateParsedData(parsedData: any): void {
        if (!Array.isArray(parsedData)) {
            throw new Error('Загруженные данные — не массив');
        }

        parsedData.forEach(item => {
            if (!this.validate(item)) {
                throw new Error(`Ошибка валидации данных: ${item}`);
            }
        });
    }
}

export { DataLoader };
