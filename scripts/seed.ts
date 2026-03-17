import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../Lib/firebase';

const restaurants = [
    {
        name: 'Burger King',
        category: 'American • Burgers • Fast Food',
        deliveryTime: '15-20 min',
        rating: 4.5,
        deliveryFee: 0,
        promoted: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIhomPRZzyN13C9Nr297Lbuxd42ChLmhF_hWFLVC5Gh_j94JkWjLKRh7wCLFW2-2XaZeKfzBk0HdMN98GfJH8q99wjQV9-II5euaFjXSkPtDZTKVW0drdFYdeeOE21Z-44Frsf_yTYUvBY3hGdz8bRrH29ITx5mEch_eXuQnWE6871mwDBE6PO0FR_w8bHnp9-7TqcAslumIlA_5cmkr2s5vojnqaL1kNG5GgHFViLFPNPTiwmA0aayZi4FcMdyBEkgD6sErFSPf4T',
    },
    {
        name: 'Sushi Express',
        category: 'Japanese • Sushi • Asian',
        deliveryTime: '25-35 min',
        rating: 4.8,
        deliveryFee: 2.50,
        promoted: false,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUvvda9bbU34pR4VlFOm8yizPfRY6QX_T_UsQSVcgQH72YDmmQ-uZVbeyVwgc8e8JRqQakVUHAk3BwhxipCVXQVJFuro2C3DpdYwJkvxGvcq_kD4Y57co3FpUBCboQ50uGLCnVY36X7Q2ZnlhdzLf4KiqL8dveS1iv4Q_R4R4wzv1DW3XCcP30HhhDH3b_ljzcg97fKkA8KtFHHqiY1QNc6OrF7dIfXRhYE97YWbQApygnMU73weusnACjl2g9SZXt4ouOKDQohXeC',
    },
];

const products = [
    {
        name: 'Whopper Doble con Queso',
        description: 'Dos carnes de res a la parrilla, queso americano, lechuga y tomate fresco.',
        price: 145.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3gONcJkHATsMmpKqsfnSaksvm3JxCtprL6dlymu2rDya37uVW_sco3yFyWzrlaZ8muhEcq4LvSX9qlcZeTQDzQGGSj7atPNSsArvwpG0kpkPneN6AjF-TvQdB0RiuPDnG8r3Lp4BK8gsnG3E2zLtcheE2g-GFauW3s5f9OdOWHLV4hHww-422EZk5DeVaJZ4vsPUQZqtBRXa6A-etTxXy2VGPUzEVLFfEFYTx6t05Zr56vvVN7ottHCyf1xjhfXCZqQGfJaOfyGo_',
    },
    {
        name: 'Chicken Crispy Sandwich',
        description: 'Pollo crujiente, mayonesa de chipotle y lechuga fresca en pan tostado.',
        price: 98.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIhomPRZzyN13C9Nr297Lbuxd42ChLmhF_hWFLVC5Gh_j94JkWjLKRh7wCLFW2-2XaZeKfzBk0HdMN98GfJH8q99wjQV9-II5euaFjXSkPtDZTKVW0drdFYdeeOE21Z-44Frsf_yTYUvBY3hGdz8bRrH29ITx5mEch_eXuQnWE6871mwDBE6PO0FR_w8bHnp9-7TqcAslumIlA_5cmkr2s5vojnqaL1kNG5GgHFViLFPNPTiwmA0aayZi4FcMdyBEkgD6sErFSPf4T',
    },
];

export const seedDatabase = async () => {
    try {
        console.log("Checking if data already exists...");
        const snapshot = await getDocs(collection(db, 'restaurants'));
        if (!snapshot.empty) {
            console.log("Database already seeded");
            return;
        }

        console.log("Seeding database...");
        
        // Add restaurants
        for (const res of restaurants) {
            const docRef = await addDoc(collection(db, 'restaurants'), res);
            
            // If it's Burger King, add the products to it
            if (res.name === 'Burger King') {
                for (const prod of products) {
                    await addDoc(collection(db, 'products'), {
                        ...prod,
                        restaurantId: docRef.id
                    });
                }
            }
        }
        
        console.log("Seeding complete!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};
