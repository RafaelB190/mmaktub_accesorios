import type { Product, StoreEvent } from "./types";

/**
 * Catálogo de demostración.
 *
 * Se usa únicamente cuando todavía no configuraste Supabase. Sirve para ver el
 * diseño y probar el carrito. En cuanto las variables de entorno de Supabase
 * estén definidas, la tienda lee los datos reales y este archivo deja de usarse.
 */

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function eventDate(daysFromNow: number, hour: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromNow);
  date.setUTCHours(hour + 3, 0, 0, 0); // Argentina (UTC-3)
  return date.toISOString();
}

export const demoProducts: Product[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    slug: "collar-luna-de-turquesa",
    name: "Collar Luna de Turquesa",
    description:
      "Un dije de luna con una piedra de turquesa natural, pensado para acompañar todos los días. Cadena dorada de acero inoxidable con baño de oro, liviana y resistente al agua.",
    price: 32_900,
    compareAtPrice: 38_900,
    category: "collares",
    images: ["/productos/collar-luna.jpg"],
    stock: 2,
    featured: true,
    active: true,
    materials: "Turquesa natural · Acero inoxidable con baño de oro",
    createdAt: daysAgo(2),
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    slug: "collar-perlas-de-rio",
    name: "Collar Perlas de Río",
    description:
      "Perlas de río de formas irregulares, únicas como quien las usa. Una pieza delicada que combina con todo y se lleva sola.",
    price: 28_500,
    compareAtPrice: null,
    category: "collares",
    images: ["/productos/collar-perlas.jpg"],
    stock: 3,
    featured: false,
    active: true,
    materials: "Perlas de río cultivadas · Cierre de plata 925",
    createdAt: daysAgo(8),
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    slug: "collar-capas-de-cristal",
    name: "Collar Capas de Cristal",
    description:
      "Tres cadenas superpuestas con pequeños dijes de cristal y cuarzo. Ideal para sumar textura a un look simple, sin esfuerzo.",
    price: 26_900,
    compareAtPrice: null,
    category: "collares",
    images: ["/productos/collar-capas.jpg"],
    stock: 2,
    featured: true,
    active: true,
    materials: "Cuarzo natural · Acero inoxidable dorado",
    createdAt: daysAgo(1),
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    slug: "collar-dije-de-cuarzo",
    name: "Collar Dije de Cuarzo",
    description:
      "Un dije mínimo con una gota de cuarzo blanco. Para regalar(te) un poco de calma en medio de la rutina.",
    price: 24_900,
    compareAtPrice: 29_900,
    category: "collares",
    images: ["/productos/collar-dije.jpg"],
    stock: 4,
    featured: false,
    active: true,
    materials: "Cuarzo blanco · Cadena de acero dorado",
    createdAt: daysAgo(15),
  },
  {
    id: "11111111-1111-4111-8111-111111111105",
    slug: "combito-maktub",
    name: "Combito Maktub",
    description:
      "Nuestro combo favorito: collar de perlas finas + aros pequeños a juego. Dos piezas que se potencian y llegan en un estuche de regalo.",
    price: 38_900,
    compareAtPrice: 45_000,
    category: "combitos",
    images: ["/productos/combito.jpg"],
    stock: 2,
    featured: true,
    active: true,
    materials: "Perlas cultivadas · Acero inoxidable con baño de oro",
    createdAt: daysAgo(4),
  },
  {
    id: "11111111-1111-4111-8111-111111111106",
    slug: "pulsera-eslabones",
    name: "Pulsera Eslabones",
    description:
      "Eslabones redondeados y un cierre simple: la pulsera que no te querés sacar. Perfecta para usar sola o combinar con otras.",
    price: 21_900,
    compareAtPrice: null,
    category: "pulseras",
    images: ["/productos/pulsera-eslabones.jpg"],
    stock: 5,
    featured: false,
    active: true,
    materials: "Acero inoxidable con baño de oro",
    createdAt: daysAgo(20),
  },
  {
    id: "11111111-1111-4111-8111-111111111107",
    slug: "pulsera-tejida",
    name: "Pulsera Tejida",
    description:
      "Trama fina y textura suave para acompañar la muñeca todo el día. Resistente al agua y a los planes improvisados.",
    price: 19_500,
    compareAtPrice: 23_900,
    category: "pulseras",
    images: ["/productos/pulsera-tejida.jpg"],
    stock: 4,
    featured: false,
    active: true,
    materials: "Acero inoxidable dorado · Cierre ajustable",
    createdAt: daysAgo(12),
  },
  {
    id: "11111111-1111-4111-8111-111111111108",
    slug: "pulsera-duo-de-hilos",
    name: "Pulsera Dúo de Hilos",
    description:
      "Dos pulseras finas para regalar una y quedarte la otra. Un detalle simple para compartir con alguien especial.",
    price: 17_900,
    compareAtPrice: null,
    category: "pulseras",
    images: ["/productos/pulsera-duo.jpg"],
    stock: 6,
    featured: true,
    active: true,
    materials: "Hilo encerado · Dijes de acero dorado",
    createdAt: daysAgo(3),
  },
  {
    id: "11111111-1111-4111-8111-111111111109",
    slug: "aros-cristal-de-agua",
    name: "Aros Cristal de Agua",
    description:
      "Cristales azules que atrapan la luz. Livianos, cómodos y con ese azul que ilumina cualquier outfit.",
    price: 18_900,
    compareAtPrice: null,
    category: "aritos",
    images: ["/productos/aros-cristal.jpg"],
    stock: 3,
    featured: true,
    active: true,
    materials: "Cristal facetado · Plata 925",
    createdAt: daysAgo(1),
  },
  {
    id: "11111111-1111-4111-8111-111111111110",
    slug: "aros-corazon-de-cristal",
    name: "Aros Corazón de Cristal",
    description:
      "Un corazón pequeño en cristal azul para llevar cerca. La dosis justa de color y dulzura.",
    price: 16_900,
    compareAtPrice: 20_900,
    category: "aritos",
    images: ["/productos/aros-corazon.jpg"],
    stock: 4,
    featured: false,
    active: true,
    materials: "Cristal · Acero inoxidable con baño de oro",
    createdAt: daysAgo(18),
  },
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "anillo-jade",
    name: "Anillo Jade",
    description:
      "Una piedra de jade verde profundo en un anillo minimalista. Amuleto chiquito para usar todos los días.",
    price: 22_900,
    compareAtPrice: null,
    category: "mimos",
    images: ["/productos/anillo-jade.jpg"],
    stock: 2,
    featured: false,
    active: true,
    materials: "Jade natural · Plata 925",
    createdAt: daysAgo(25),
  },
  {
    id: "11111111-1111-4111-8111-111111111112",
    slug: "anillo-duo-de-piedras",
    name: "Anillo Dúo de Piedras",
    description:
      "Dos piedras naturales en un mismo anillo, cada una con su propia energía. Una pieza artesanal para regalar o regalarte.",
    price: 27_900,
    compareAtPrice: null,
    category: "mimos",
    images: ["/productos/anillo-duo.jpg"],
    stock: 3,
    featured: true,
    active: true,
    materials: "Piedras naturales · Plata 925",
    createdAt: daysAgo(5),
  },
  {
    id: "11111111-1111-4111-8111-111111111113",
    slug: "anillo-brillo",
    name: "Anillo Brillo",
    description:
      "Un clásico con brillo para esos días en los que querés un poco más. Pieza única, lista para regalar.",
    price: 25_900,
    compareAtPrice: null,
    category: "mimos",
    images: ["/productos/anillo-brillo.jpg"],
    stock: 0,
    featured: false,
    active: true,
    materials: "Circonias · Plata 925",
    createdAt: daysAgo(30),
  },
];

export const demoEvents: StoreEvent[] = [
  {
    id: "22222222-2222-4222-8222-222222222201",
    title: "Feria de Diseño en Palermo",
    description:
      "Vamos a estar con nuestro stand llevando lo último de la colección. Pasá a conocer las piedras, probarte las piezas y charlar un rato con nosotras.",
    startsAt: eventDate(18, 15),
    location: "Plaza Serrano",
    address: "Serrano y Honduras, Palermo, CABA",
    mapsUrl: "https://maps.google.com/?q=Plaza+Serrano+Palermo+Buenos+Aires",
    image: "/eventos/feria-diseno.jpg",
    published: true,
    createdAt: daysAgo(6),
  },
  {
    id: "22222222-2222-4222-8222-222222222202",
    title: "Mercado de Autor",
    description:
      "Un domingo de diseño, música y piezas hechas a mano. Nos encontrás en el patio central con todos los combitos y novedades.",
    startsAt: eventDate(44, 11),
    location: "Museo de Arte Decorativo",
    address: "Av. del Libertador 1902, Recoleta, CABA",
    mapsUrl: "https://maps.google.com/?q=Museo+Nacional+de+Arte+Decorativo",
    image: "/eventos/mercado-autor.jpg",
    published: true,
    createdAt: daysAgo(2),
  },
  {
    id: "22222222-2222-4222-8222-222222222203",
    title: "Pop-up de primavera",
    description:
      "Nuestro primer pop-up del año. Tres días de accesorios, regalos y muchas historias. Gracias a cada persona que pasó a saludar.",
    startsAt: eventDate(-24, 14),
    location: "Estudio Maktub",
    address: "Villa Crespo, CABA",
    mapsUrl: null,
    image: "/eventos/popup.jpg",
    published: true,
    createdAt: daysAgo(40),
  },
  {
    id: "22222222-2222-4222-8222-222222222204",
    title: "Encuentro de emprendedoras",
    description:
      "Compartimos una tarde con otras marcas hechas a mano. Llevamos nuestras piedras, nuestros procesos y las piezas favoritas de la comunidad.",
    startsAt: eventDate(-62, 16),
    location: "Mercado de Autor",
    address: "Palermo, CABA",
    mapsUrl: null,
    image: "/eventos/encuentro.jpg",
    published: true,
    createdAt: daysAgo(80),
  },
  {
    id: "22222222-2222-4222-8222-222222222205",
    title: "Feria de regalos",
    description:
      "Cerramos el año con una feria dedicada a los regalos. Cada pieza salió envuelta con nuestra etiqueta y una piedra elegida con intención.",
    startsAt: eventDate(-130, 12),
    location: "Mercado de Diseño",
    address: "San Telmo, CABA",
    mapsUrl: null,
    image: "/eventos/regalos.jpg",
    published: true,
    createdAt: daysAgo(150),
  },
];
