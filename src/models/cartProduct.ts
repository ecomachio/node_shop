import Product from "./product";

export default interface CartProduct extends Product {
    quantity: number;
}