interface IExpenseCategory {
    id: string; 
    name: string;
    iconSrc: string | null,
    color: string | null,
}

let expenseCategories: IExpenseCategory[] = [
    { id: "cat-none", name: "Без категории", iconSrc: "assets/icon-category-none.svg", color: "" },
    { id: "cat-purchase", name: "Покупки", iconSrc: "assets/icon-category-purchase.svg", color: "#00991A" },
    { id: "cat-food", name: "Еда", iconSrc: "assets/icon-category-food.svg", color: "#B57800" },
    { id: "cat-transport", name: "Транспорт", iconSrc: "assets/icon-category-transport.svg", color: "#B57800" },
    { id: "cat-medicine", name: "Медицина", iconSrc: "assets/icon-category-medicine.svg", color: "#2C98E1" },
    { id: "cat-entertainment", name: "Развлечение", iconSrc: "assets/icon-category-entertainment.svg", color: "#C700A9" },
    { id: "cat-culture", name: "Культура", iconSrc: "assets/icon-category-culture.svg", color: "#00991A" },
    { id: "cat-sport", name: "Спорт и фитнес", iconSrc: "assets/icon-category-sport.svg", color: "#CA1E00" },
    { id: "cat-beauty", name: "Красота", iconSrc: "assets/icon-category-beauty.svg", color: "#C700A9" },
    { id: "cat-travel", name: "Путешествия", iconSrc: "assets/icon-category-travel.svg", color: "#00991A" },
    { id: "cat-home", name: "Дом и быт", iconSrc: "assets/icon-category-home.svg", color: "#B57800" },
    { id: "cat-education", name: "Образование", iconSrc: "assets/icon-category-education.svg", color: "#2C98E1" },
    { id: "cat-pet", name: "Животные", iconSrc: "assets/icon-category-pet.svg", color: "#CA1E00" },
    { id: "cat-communication", name: "Связь", iconSrc: "assets/icon-category-communication.svg", color: "#2C98E1" },
    { id: "cat-gift", name: "Подарки", iconSrc: "assets/icon-category-gift.svg", color: "#C700A9" },
    { id: "cat-taxes", name: "Налоги", iconSrc: "assets/icon-category-taxes.svg", color: "#CA1E00" },
];

interface IExpense {
    id: string;
    value: number;
    category: IExpenseCategory;
    date: Date;
}

export { IExpenseCategory, IExpense, expenseCategories }