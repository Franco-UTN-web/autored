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
    image: "https://placehold.co/300x200/1f2937/10b981?text=Balatas+Brembo"
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
    image: "https://placehold.co/300x200/1f2937/10b981?text=Aceite+Castrol"
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
    image: "https://placehold.co/300x200/1f2937/10b981?text=Amortiguadores+KYB"
  }
];

export const mockChat = [
  { sender: "bot", text: "¡Hola! Soy el asistente de AutoRed. ¿Buscas alguna pieza en específico?" },
  { sender: "user", text: "Busco unas balatas para un Jetta 2018." },
  { sender: "bot", text: "Te recomiendo las Balatas de Cerámica Brembo. Tienen una duración estimada de 40,000 km y las tenemos en la Sucursal Norte por $1,250 MXN." }
];