import baseEntity from "./baseEntity";
import { category } from "./getAllProducts";

export default interface product extends baseEntity {
    name: string;
    image: File;
    category: category;
    price: number;
    stockAvailability: number;
    imagePath: string
} 