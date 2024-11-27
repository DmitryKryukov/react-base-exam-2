function linearInterpolation(min: number, max: number, value: number): number {
    if (min === max) {
        throw new Error('Минимальное значение не может быть равно максимальному.');
    }
    
    const normalizedValue = (value - min) / (max - min);
    
    return normalizedValue;
}

export { linearInterpolation };