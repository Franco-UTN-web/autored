export const mockProducts = [
  {
    id: 1,
    name: "Balatas de Cerámica Premium",
    brand: "Brembo",
    compatibility: "VW Jetta, Golf (2015-2021)",
    duration: "40,000 km",
    price: 1250,
    availability: "En stock",
    location: "Sucursal Norte",
    // Imagen real de frenos/rueda
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Aceite Sintético 5W-30 (5L)",
    brand: "Castrol",
    compatibility: "Universal",
    duration: "15,000 km",
    price: 980,
    availability: "Pocas unidades",
    location: "Distribuidora Central",
    // Imagen real de motor/aceite
    image: "https://images.unsplash.com/photo-1635784063859-99c67bc28dce?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Amortiguadores Traseros Gas",
    brand: "KYB",
    compatibility: "Nissan Versa (2012-2019)",
    duration: "60,000 km",
    price: 2100,
    availability: "En stock",
    location: "Sucursal Sur",
    // Imagen real de suspensión
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=500&auto=format&fit=crop"
  }
];

export const mockChat = [
  { sender: "bot", text: "¡Hola! Soy el asistente de AutoRed. ¿Buscas alguna pieza en específico?" },
  { sender: "user", text: "Busco unas balatas para un Jetta 2018." },
  { sender: "bot", text: "Te recomiendo las Balatas de Cerámica Brembo. Tienen una duración estimada de 40,000 km y las tenemos en la Sucursal Norte por $1,250 MXN." }
];