// Base de datos de productos de Distribuidora San Roque S.R.L.
const PRODUCTS = [
  {
    id: "premezcla-brownies",
    name: "Premezcla para Brownies",
    brand: "Innova 360°",
    category: "premezclas",
    presentation: "Bolsa x 3 kg",
    description: "Premezcla para elaborar exquisitos brownies con receta artesanal, textura húmeda y sabor intenso a chocolate.",
    image: "imagenes de pagina/premezcla-brownies-innova-360-3kg.jpg",
    tags: ["brownies", "chocolate", "repostería", "premezcla", "innova"]
  },
  {
    id: "premezcla-muffins-vainilla",
    name: "Premezcla para Muffins Vainilla",
    brand: "Innova 360°",
    category: "premezclas",
    presentation: "Bolsa x 3 kg",
    description: "Premezcla lista para muffins y magdalenas de vainilla esponjosos con receta artesanal tradicional.",
    image: "imagenes de pagina/premezcla-muffins-vainilla-innova-360-3kg.jpg",
    tags: ["muffins", "vainilla", "pastelería", "innova"]
  },
  {
    id: "premezcla-pan-dulce-rosca",
    name: "Premezcla Pan Dulce y Rosca",
    brand: "Línea de Plata (Calsa)",
    category: "premezclas",
    presentation: "Bolsa x 3 kg",
    description: "Excelente salto de horno, mayor humedad y rápida elaboración. Ideal para pan dulce navideño y roscas de pascua.",
    image: "imagenes de pagina/premezcla-pan-dulce-rosca-linea-de-plata.jpg",
    tags: ["pan dulce", "rosca", "navidad", "pascuas", "calsa"]
  },
  {
    id: "premezcla-aktivo-panaderia",
    name: "Premezcla Aktivo Multicereal y Semillas",
    brand: "Línea de Plata (Calsa)",
    category: "premezclas",
    presentation: "Bolsa x 3 kg",
    description: "Premezcla para panificados a base de harina de trigo, harina integral y mix de semillas seleccionadas con gran sabor.",
    image: "imagenes de pagina/premezcla-aktivo-panaderia-calsa-3kg.jpg",
    tags: ["semillas", "integral", "panadería", "saludable", "calsa"]
  },
  {
    id: "harina-de-almendra",
    name: "Harina de Almendra Pura",
    brand: "San Roque Fraccionado",
    category: "premezclas",
    presentation: "Bolsa x 1 kg",
    description: "Almendra repelada y molida finamente. Ideal para macarons, tortas gourmet y repostería libre de gluten.",
    image: "imagenes de pagina/harina-de-almendra-1kg.jpg",
    tags: ["almendra", "frutos secos", "macarons", "harina", "keto"]
  },
  {
    id: "margarina-mtk-hojaldre",
    name: "Margarina MTK Hojaldre",
    brand: "Calsa",
    category: "margarinas",
    presentation: "Caja x 5 kg (Precortada en placas)",
    description: "Margarina para repostería y hojaldres finos. Excelente plasticidad, laminado uniforme y alto rendimiento.",
    image: "imagenes de pagina/margarina-mtk-hojaldre-calsa-5kg.jpg",
    tags: ["margarina", "hojaldre", "calsa", "facturas", "placas"]
  },
  {
    id: "margarina-mtk-reposteria",
    name: "Margarina MTK Repostería",
    brand: "Calsa",
    category: "margarinas",
    presentation: "Caja x 5 kg (Precortada en placas)",
    description: "Margarina de alta calidad para cremas, masas secas, budines y repostería general.",
    image: "imagenes de pagina/margarina-mtk-reposteria-calsa-5kg.jpg",
    tags: ["margarina", "repostería", "calsa", "cremas", "placas"]
  },
  {
    id: "margarina-milhojas",
    name: "Margarina Milhojas Hojaldre",
    brand: "Milhojas",
    category: "margarinas",
    presentation: "Caja x 10 kg (Precortada en placas)",
    description: "Margarina tradicional especial para hojaldres, palmeritas, cañoncitos y masas laminadas en gran volumen.",
    image: "imagenes de pagina/margarina-milhojas-hojaldre-10kg.jpg",
    tags: ["milhojas", "hojaldre", "margarina", "placas", "10kg"]
  },
  {
    id: "premium-hojaldre-con-manteca",
    name: "Compuesto Graso Premium Hojaldre con Manteca",
    brand: "Calsa",
    category: "margarinas",
    presentation: "Caja x 5 kg (Precortada en placas)",
    description: "Masa hojaldrada con auténtico sabor a manteca. Aporta un dorado inigualable y aroma tentador a facturas y medialunas.",
    image: "imagenes de pagina/premium-hojaldre-calsa-5kg.jpg",
    tags: ["manteca", "hojaldre", "medialunas", "calsa", "premium"]
  },
  {
    id: "selecta-melange",
    name: "Selecta Melange Compuesto Graso",
    brand: "Calsa",
    category: "margarinas",
    presentation: "Caja x 5 kg (Precortada en placas)",
    description: "Mezcla grasa con butter oil de primer nivel para medialunas, alfajores y masas finas de confitería.",
    image: "imagenes de pagina/selecta-melange-calsa-5kg.jpg",
    tags: ["melange", "medialunas", "butter oil", "calsa", "selecta"]
  },
  {
    id: "idealina-grasa-vacuna",
    name: "Idealina Grasa Vacuna Refinada",
    brand: "Calsa",
    category: "margarinas",
    presentation: "Caja x 20 kg",
    description: "Emulsión a base de grasa vacuna refinada para uso industrial alimentario. Máxima calidad y rendimiento panadero.",
    image: "imagenes de pagina/idealina-grasa-vacuna-calsa-20kg.jpg",
    tags: ["grasa", "idealina", "calsa", "panadería", "bizcochos"]
  },
  {
    id: "chips-semiamargo-linea-plata",
    name: "Chips de Chocolate Semiamargo",
    brand: "Línea de Plata (Calsa)",
    category: "reposteria",
    presentation: "Bolsa x 1 kg",
    description: "Gotas de baño de repostería semiamargo horneables. Mantienen su forma perfecta en muffins, cookies y budines.",
    image: "imagenes de pagina/chips-semiamargo-linea-de-plata-1kg.jpg",
    tags: ["chips", "chocolate", "horneables", "cookies", "calsa"]
  },
  {
    id: "micky-pasta-pistacho",
    name: "Micky Pasta de Relleno Pistacho",
    brand: "MAPSA",
    category: "reposteria",
    presentation: "Pote práctico cubretortas",
    description: "Crema de relleno y cobertura sabor pistacho. Textura suave lista para aplicar en tortas, bombones y postres modernos.",
    image: "imagenes de pagina/micky-pasta-relleno-pistacho-mapsa.jpg",
    tags: ["pistacho", "relleno", "mapsa", "pastas", "repostería"]
  },
  {
    id: "ledevit-cremas-polvo",
    name: "Polvo para Crema Lemon Pie & Cheesecake",
    brand: "Ledevit",
    category: "reposteria",
    presentation: "Pack x 300 g (Sin Gluten)",
    description: "Fácil preparación sin horno, listas en heladera. Sabor auténtico y textura inmejorable para tartas y copas.",
    image: "imagenes de pagina/ledevit-crema-lemon-y-cheesecake.jpg",
    tags: ["lemon pie", "cheesecake", "ledevit", "sin gluten", "postres"]
  },
  {
    id: "queso-crema-san-ignacio",
    name: "Queso Crema San Ignacio",
    brand: "San Ignacio",
    category: "lacteos",
    presentation: "Balde x 4.2 kg",
    description: "Sin sal agregada, libre de gluten (Sin TACC). Ideal para rellenos de tartas, cheesecakes, untables y gastronomía.",
    image: "imagenes de pagina/queso-crema-san-ignacio-4.2kg.jpg",
    tags: ["queso crema", "san ignacio", "sin tacc", "cheesecake", "balde"]
  },
  {
    id: "mani-fileteado-tioluca",
    name: "Maní Fileteado Tostado",
    brand: "Tioluca",
    category: "golosinas",
    presentation: "Bolsa x 1 kg",
    description: "Láminas crocantes de maní seleccionadas. El toque crujiente perfecto para decoración de tortas, helados y postres.",
    image: "imagenes de pagina/mani-fileteado-tioluca.jpg",
    tags: ["maní", "frutos secos", "decoración", "crocante", "tioluca"]
  },
  {
    id: "postre-de-mani-lheritier",
    name: "Postre de Maní Tradicional en Trozos",
    brand: "Lheritier",
    category: "golosinas",
    presentation: "Bolsa para fraccionar",
    description: "Delicioso postre tipo mantecol tradicional en trozos tiernos y crocantes para confiterías y heladerías.",
    image: "imagenes de pagina/postre-de-mani-lheritier.jpg",
    tags: ["postre de maní", "mantecol", "lheritier", "golosinas"]
  },
  {
    id: "micro-galletitas-chocolate",
    name: "Micro Galletitas Bañadas en Chocolate",
    brand: "Argentfrut",
    category: "golosinas",
    presentation: "Bolsa x 1 kg (Negro y Blanco)",
    description: "Esferas crujientes bañadas en chocolate con leche y chocolate blanco artesanal. Decoración irresistible.",
    image: "imagenes de pagina/micro-galletitas-chocolate-argentfrut.jpg",
    tags: ["micro galletitas", "crispis", "chocolate blanco", "argentfrut"]
  },
  {
    id: "huesitos-frutales-grabich",
    name: "Huesitos Frutales Confitados",
    brand: "Grabich Golosinas",
    category: "golosinas",
    presentation: "Bolsa de confites surtidos",
    description: "Confites de sabores frutales surtidos y colores vivos. Especiales para candy bar, repostería infantil y sueltos.",
    image: "imagenes de pagina/huesitos-frutales-grabich-golosinas.jpg",
    tags: ["confites", "huesitos", "grabich", "candy bar", "golosinas"]
  },
  {
    id: "lentejas-frutales-grabich",
    name: "Lentejas Frutales de Fantasía",
    brand: "Grabich Golosinas",
    category: "golosinas",
    presentation: "Bolsa x 900 g",
    description: "Confites de fantasía frutales multicolores. Ideales para decorar tortas, cupcakes y mesas dulces.",
    image: "imagenes de pagina/lentejas-frutales-grabich-golosinas.jpg",
    tags: ["lentejas", "confites", "grabich", "decoración", "golosinas"]
  }
];

const BRANDS = [
  { name: "Calsa", desc: "Líder en levaduras, margarinas y premezclas industriales" },
  { name: "Levadura Virgen", desc: "La levadura fresca por excelencia de la panadería tradicional" },
  { name: "Ledevit", desc: "Cremas vegetales, rellenos y premezclas sin gluten de alta pastelería" },
  { name: "Mapsa", desc: "Pastas de relleno y coberturas premium para chocolatería" },
  { name: "San Ignacio", desc: "Tradición y excelencia en dulce de leche y quesos crema" },
  { name: "Grabich", desc: "Golosinas, confites de fantasía e insumos para candy bar" },
  { name: "Línea de Plata", desc: "Soluciones especializadas para panificación y repostería" },
  { name: "Innova 360°", desc: "Premezclas artesanales con sabor auténtico y fácil preparación" },
  { name: "Lheritier", desc: "Calidad reconocida en postres de maní y confituras" },
  { name: "Argentfrut", desc: "Especialistas en decoraciones crocantes y baños de chocolate" }
];
