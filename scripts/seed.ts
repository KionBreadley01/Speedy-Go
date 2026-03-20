import { collection, addDoc, getDocs, doc, query, where } from 'firebase/firestore';
import { db } from '../Lib/firebase';

const restaurants = [
    {
        name: 'Burger King',
        category: 'American • Hamburguesas • Fast Food',
        deliveryTime: '15-20 min',
        rating: 4.5,
        deliveryFee: 0,
        promoted: true,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'McDonald\'s',
        category: 'American • Hamburguesas • Fast Food',
        deliveryTime: '10-15 min',
        rating: 4.2,
        deliveryFee: 1.50,
        promoted: false,
        image: 'https://images.unsplash.com/photo-1598182126858-0a30975b9790?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Sushi Express',
        category: 'Japanese • Sushi • Asian',
        deliveryTime: '25-35 min',
        rating: 4.8,
        deliveryFee: 2.50,
        promoted: false,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Sushi Itto',
        category: 'Japanese • Sushi • Asian',
        deliveryTime: '20-30 min',
        rating: 4.6,
        deliveryFee: 3.00,
        promoted: true,
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Pizza Hut',
        category: 'Italian • Pizza • Faster',
        deliveryTime: '20-30 min',
        rating: 4.4,
        deliveryFee: 1.50,
        promoted: true,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Papa John\'s',
        category: 'Italian • Pizza • Hot',
        deliveryTime: '15-25 min',
        rating: 4.5,
        deliveryFee: 2.00,
        promoted: false,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Tacos el Pata',
        category: 'Mexican • Tacos • Antojitos',
        deliveryTime: '15-25 min',
        rating: 4.7,
        deliveryFee: 1.00,
        promoted: false,
        image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Tacos el Gordo',
        category: 'Mexican • Tacos • Carne Asada',
        deliveryTime: '10-20 min',
        rating: 4.8,
        deliveryFee: 0.50,
        promoted: true,
        image: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Fresko',
        category: 'Healthy • Saludable • Fresh',
        deliveryTime: '10-20 min',
        rating: 4.3,
        deliveryFee: 2.00,
        promoted: false,
        image: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'OXXO',
        category: 'Grocery • Súper • Snacks',
        deliveryTime: '5-15 min',
        rating: 4.1,
        deliveryFee: 1.00,
        promoted: false,
        image: 'https://images.unsplash.com/photo-1534723452202-41789bc20b21?q=80&w=800&auto=format&fit=crop',
    }
];

const productsMap: { [key: string]: any[] } = {
    'Burger King': [
        { name: 'Whopper Doble con Queso', description: 'Dos carnes de res a la parrilla, queso americano, lechuga y tomate fresco.', price: 145.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' },
        { name: 'Chicken Crispy Sandwich', description: 'Pollo crujiente, mayonesa de chipotle y lechuga fresca en pan tostado.', price: 98.00, image: 'https://images.unsplash.com/photo-1606755962773-b32ee09bd62b?q=80&w=800&auto=format&fit=crop' }
    ],
    'McDonald\'s': [
        { name: 'Big Mac', description: 'Dos carnes 100% de res, salsa especial, queso derretido, pepinillos, lechuga y cebolla.', price: 125.00, image: 'https://images.unsplash.com/photo-1542574271-7f3b92e6c821?q=80&w=800&auto=format&fit=crop' },
        { name: 'Cuarto de Libra', description: 'Carne 100% de res, queso cheddar, cebolla, mostaza y catsup.', price: 110.00, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop' }
    ],
    'Sushi Express': [
        { name: 'Sushi Dragon Roll', description: 'Queso crema, salmón fresco, camarón empanizado, aguacate y salsa curry.', price: 180.00, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop' }
    ],
    'Sushi Itto': [
        { name: 'Sushi California Roll', description: 'Surimi, pepino y aguacate por dentro, ajonjolí por fuera.', price: 145.00, image: 'https://images.unsplash.com/photo-1626082927389-6cd087ef1c65?q=80&w=800&auto=format&fit=crop' }
    ],
    'Pizza Hut': [
        { name: 'Pizza Pepperoni Mediana', description: 'Nuestra clásica masa con salsa de tomate y abundante queso mozzarella y pepperoni.', price: 199.00, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' }
    ],
    'Papa John\'s': [
        { name: 'Pizza Alfredo de Pollo', description: 'Salsa Alfredo rica, pollo a la parrilla, tocino y queso mozzarella.', price: 235.00, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop' }
    ],
    'Tacos el Pata': [
        { name: 'Orden Tacos al Pastor', description: '5 tacos de carne al pastor marinada, piña, cilantro y cebolla.', price: 85.00, image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=800&auto=format&fit=crop' }
    ],
    'Tacos el Gordo': [
        { name: 'Taco de Asada Grande', description: 'Carne asada al carbón, guacamole y salsa verde en tortilla hecha a mano.', price: 45.00, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865.jpg?auto=format&fit=crop' }
    ],
    'Fresko': [
        { name: 'Ensalada César con Pollo', description: 'Lechuga romana fresca, crutones, queso parmesano y tiras de pollo a la parrilla.', price: 145.00, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop' }
    ],
    'OXXO': [
        { name: 'Vikingo de Pavo', description: 'Clásico Hot Dog Vikingo con salchicha de pavo y aderezos al gusto.', price: 35.00, image: 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?q=80&w=800&auto=format&fit=crop' }
    ]
};

export const seedDatabase = async () => {
    try {
        console.log("Seeding missing restaurants...");
        
        for (const res of restaurants) {
            const q = query(collection(db, 'restaurants'), where('name', '==', res.name));
            const snap = await getDocs(q);

            if (snap.empty) {
                console.log(`Adding missing restaurant: ${res.name}...`);
                const docRef = await addDoc(collection(db, 'restaurants'), res);
                
                const prods = productsMap[res.name];
                if (prods) {
                    for (const prod of prods) {
                        await addDoc(collection(db, 'products'), {
                            ...prod,
                            restaurantId: docRef.id
                        });
                    }
                }
            }
        }
        console.log("Seeding verification complete!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};
