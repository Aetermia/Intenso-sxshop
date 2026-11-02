// Catalogo demo de Intenso Tandil.
// Cada producto tiene: id, nombre, categoria, precio ARS, imagen (gradiente),
// insignias, descripcion, instrucciones, variantes y color para placeholder.
// Flags opcionales:
//   activo     (boolean, default true)  -> false esconde el producto de la tienda (sin borrarlo)
//   destacado  (boolean, default false) -> true lo muestra en el carrusel de la portada
//   promo      (string opcional)        -> etiqueta para el cartelito de esquina (ej: "PROMO 2x1")
//   ordenDestacado (number)             -> posicion en el carrusel (1 = primero)

export const CATEGORY_TINT = {
  juguetes: ['#DC015B', '#A80044'],
  'juguetes-parejas': ['#e07bd0', '#9c27b0'],
  juegos: ['#F4A6C1', '#DC015B'],
  lenceria: ['#D63384', '#8e0f58'],
  'lenceria-mujer': ['#D63384', '#8e0f58'],
  'lenceria-hombre': ['#6b4a5a', '#2b1620'],
  lubricantes: ['#f5426b', '#c2185b'],
  cosmetica: ['#f8a5c2', '#b8945f'],
  'cosmetica-masajes': ['#ffb74d', '#e65100'],
  'cosmetica-perfumes': ['#f8bbd0', '#ad1457'],
  'suplementos-potenciadores': ['#ff9d4d', '#DC015B'],
  bdsm: ['#3a3a3a', '#141414'],
};

export const CATALOG = [
  {
    id: 'anillo-vibrador-bala-recargable',
    nombre: 'Anillo Vibrador con Bala Recargable',
    categoria: 'juguetes-anillos',
    precio: 0,
    imagen: '/products/anillo-vibrador-bala-recargable.png',
    insignias: ['Nuevo'],
    destacado: true,
    ordenDestacado: 1,
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un anillo de silicona suave con una bala vibradora extraíble que potencia el placer de los dos. Resistente al agua, libre de ftalatos y con 7 ritmos de vibración diferentes para ir variando la intensidad.',
    instrucciones:
      'Colocá el anillo en la base y ajustá la bala vibradora a tu gusto. Usalo con lubricante a base de agua. Es resistente al agua pero no sumergible: limpialo con un paño húmedo después de cada uso. Se recarga por USB.',
  },
  {
    id: 'bomba-vacio-pene',
    nombre: 'Bomba de Vacío para Pene',
    categoria: 'juguetes-bombas-vacio',
    precio: 0,
    imagen: '/products/bomba-vacio-pene.png',
    insignias: ['Nuevo'],
    destacado: true,
    ordenDestacado: 2,
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un sistema completo de bomba de vacío para pene, con cilindro graduado, válvula de liberación rápida y manguera con pera manual. Ayuda a lograr una erección más firme por estimulación de la circulación.',
    instrucciones:
      'Aplicá un poco de lubricante en la base para mejorar el sello. Bombeá de a poco hasta sentir una succión cómoda, nunca forzada, y liberá la válvula para soltar la presión. Usalo por sesiones cortas y limpiá cada pieza con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'kit-estimuladores-intercambiables',
    nombre: 'Kit de Estimuladores Intercambiables',
    categoria: 'juguetes-estimuladores',
    precio: 0,
    imagen: '/products/kit-estimuladores-intercambiables.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un set de 5 cabezales de silicona con texturas y formas distintas más un bullet vibrador, para combinar y probar qué estimulación gusta más.',
    instrucciones:
      'Encajá el cabezal elegido en el bullet vibrador y activalo con el botón. Usalo con lubricante a base de agua y limpiá cada pieza por separado después de cada sesión.',
  },
  {
    id: 'mini-vibrador-luxury-negro',
    nombre: 'Mini Vibrador Luxury Negro',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/mini-vibrador-luxury-negro.png',
    insignias: ['Nuevo'],
    destacado: true,
    ordenDestacado: 3,
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un mini vibrador de silicona suave, resistente al agua y recargable, con 7 modos de vibración para variar la intensidad a gusto.',
    instrucciones:
      'Recargalo por USB antes del primer uso. Aplicá lubricante a base de agua y empezá en el modo más suave. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'mini-vibrador-luxury-naranja',
    nombre: 'Mini Vibrador Luxury Naranja',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/mini-vibrador-luxury-naranja.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador compacto con superficie texturada, 4 modos y 6 ritmos de vibración distintos, resistente al agua y recargable por USB.',
    instrucciones:
      'Cargalo por USB antes de usar. Usalo con lubricante a base de agua y explorá los distintos ritmos hasta encontrar el que más te guste. Limpialo con agua y jabón después de cada uso.',
  },
  {
    id: 'mini-vibrador-luxury-bicolor',
    nombre: 'Mini Vibrador Luxury Piel y Turquesa',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/mini-vibrador-luxury-bicolor.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un mini vibrador de silicona con acabado suave, 7 modos de vibración, resistente al agua y recargable por USB.',
    instrucciones:
      'Recargalo antes del primer uso. Aplicá lubricante a base de agua y subí la intensidad de a poco. Limpialo con agua y jabón neutro después de cada sesión.',
  },
  {
    id: 'vibrador-rabbit-paula',
    nombre: 'Vibrador Rabbit Paula',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-rabbit-paula.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador rabbit de silicona con cuerpo texturado y brazo estimulador externo, resistente al agua, con 7 funciones de vibración y carga USB.',
    instrucciones:
      'Cargalo por USB antes de usar. Aplicá lubricante a base de agua y probá primero con intensidad baja. Limpialo con agua y jabón neutro después de cada uso y guardalo en un lugar seco.',
  },
  {
    id: 'vibrador-rabbit-isabella',
    nombre: 'Vibrador Rabbit Isabella',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-rabbit-isabella.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador rabbit recargable con 10 funciones de vibración, cuerpo curvo de silicona suave y brazo estimulador externo.',
    instrucciones:
      'Recargalo por USB antes del primer uso. Usalo con lubricante a base de agua, comenzando en la intensidad más baja. Limpialo con agua tibia y jabón neutro después de cada uso.',
  },
  {
    id: 'anillo-vibrador-control-remoto',
    nombre: 'Anillo Vibrador con Control Remoto',
    categoria: 'juguetes-anillos',
    precio: 0,
    imagen: '/products/anillo-vibrador-control-remoto.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un anillo vibrador con bullet desmontable y control remoto inalámbrico, ideal para sumar sorpresa y jugar en pareja.',
    instrucciones:
      'Colocá el anillo en la base y activá el bullet con el control remoto. Usalo con lubricante a base de agua. Limpiá ambas piezas después de cada uso y guardalas en su estuche.',
  },
  {
    id: 'estimulador-dedo-recargable',
    nombre: 'Estimulador de Dedo Recargable',
    categoria: 'juguetes-estimuladores',
    precio: 0,
    imagen: '/products/estimulador-dedo-recargable.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un estimulador que se ajusta al dedo como un dedal, con textura suave y 7 velocidades en 3 funciones distintas, ideal para estimulación precisa.',
    instrucciones:
      'Colocalo en el dedo y ajustá la velocidad con el botón. Usalo con lubricante a base de agua. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'anillo-vibrador-rabbit-negro',
    nombre: 'Anillo Vibrador Rabbit Negro',
    categoria: 'juguetes-anillos',
    precio: 0,
    imagen: '/products/anillo-vibrador-rabbit-negro.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un anillo vibrador con orejas estimuladoras y bullet recargable, pensado para potenciar el placer de los dos durante la penetración.',
    instrucciones:
      'Colocá el anillo en la base y ajustá a tu medida. Usalo con lubricante a base de agua. Recargalo por USB y limpialo con un paño húmedo después de cada uso.',
  },
  {
    id: 'anillo-vibrador-rabbit-turquesa',
    nombre: 'Anillo Vibrador Rabbit Turquesa',
    categoria: 'juguetes-anillos',
    precio: 0,
    imagen: '/products/anillo-vibrador-rabbit-turquesa.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un anillo vibrador con orejitas estimuladoras, resistente al agua y con varias velocidades, para sumar vibración a la penetración.',
    instrucciones:
      'Colocá el anillo en la base del pene y ajustá la intensidad. Usalo con lubricante a base de agua y limpialo después de cada uso.',
  },
  {
    id: 'plug-anal-anillo-fucsia',
    nombre: 'Plug Anal con Anillo Fucsia',
    categoria: 'juguetes-anales',
    precio: 0,
    imagen: '/products/plug-anal-anillo-fucsia.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un plug anal de silicona con forma de bolitas progresivas y un anillo en la base para retirarlo con comodidad y seguridad.',
    instrucciones:
      'Aplicá abundante lubricante a base de agua antes de usar. Introducilo de a poco y con calma, respetando tu propio ritmo. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'masturbador-bolsillo',
    nombre: 'Masturbador de Bolsillo',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/masturbador-bolsillo.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un masturbador compacto de textura suave y realista, fácil de llevar y discreto, ideal para uso individual.',
    instrucciones:
      'Aplicá lubricante a base de agua tanto dentro como en la entrada. Lavalo con agua tibia y jabón neutro después de cada uso y dejalo secar bien antes de guardarlo.',
  },
  {
    id: 'plug-anal-fucsia-mediano',
    nombre: 'Plug Anal de Silicona Fucsia Mediano',
    categoria: 'juguetes-anales',
    precio: 0,
    imagen: '/products/plug-anal-fucsia-mediano.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un plug anal de silicona suave, con base curva para mayor comodidad, ideal para quienes se inician en el juego anal.',
    instrucciones:
      'Usalo siempre con abundante lubricante a base de agua. Introducilo de a poco, sin apurar. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'plug-anal-fucsia-grande',
    nombre: 'Plug Anal de Silicona Fucsia Grande',
    categoria: 'juguetes-anales',
    precio: 0,
    imagen: '/products/plug-anal-fucsia-grande.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un plug anal de silicona de mayor tamaño, pensado para quienes ya tienen experiencia y buscan una sensación de mayor plenitud.',
    instrucciones:
      'Usalo con abundante lubricante a base de agua y progresá de a poco. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'anal-beads-negro-doble-anilla',
    nombre: 'Anal Beads Negro con Doble Anilla',
    categoria: 'juguetes-anales',
    precio: 0,
    imagen: '/products/anal-beads-negro-doble-anilla.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Una cadena de bolitas anales de silicona en degradé, con doble anilla en la base para un retiro cómodo y seguro.',
    instrucciones:
      'Aplicá abundante lubricante a base de agua. Introducí las bolitas de a una, respetando tu ritmo, y retiralas con calma al terminar. Limpialas con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'kit-fundas-texturizadas-pene',
    nombre: 'Kit de Fundas Texturizadas para Pene',
    categoria: 'juguetes-internacional',
    precio: 0,
    imagen: '/products/kit-fundas-texturizadas-pene.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un set de 7 fundas de silicona con texturas distintas (relieve, puntos, estrías) para sumar sensaciones nuevas durante la penetración.',
    instrucciones:
      'Elegí la funda según la textura que más te guste y colocala sobre el pene. Usalo con lubricante a base de agua. Lavá cada funda con agua y jabón neutro después de usar.',
  },
  {
    id: 'manguito-estimulante-pene',
    nombre: 'Manguito Estimulante para Pene',
    categoria: 'juguetes-internacional',
    precio: 0,
    imagen: '/products/manguito-estimulante-pene.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un manguito elástico con relieve de puntos y una base acolchada, pensado para sumar estimulación extra durante la penetración.',
    instrucciones:
      'Colocalo sobre el pene antes de la penetración. Usalo con lubricante a base de agua. Lavalo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'anillo-textura-transparente',
    nombre: 'Anillo Texturado de Silicona Transparente',
    categoria: 'juguetes-internacional',
    precio: 0,
    imagen: '/products/anillo-textura-transparente.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un anillo de silicona suave con textura de relieve, ideal para ayudar a mantener la erección y sumar sensación a la pareja.',
    instrucciones:
      'Colocalo en la base del pene antes de la erección completa, ajustado pero cómodo. Usalo con lubricante a base de agua y no lo dejes puesto más de 20 a 30 minutos.',
  },
  {
    id: 'plug-anal-turquesa-grande',
    nombre: 'Plug Anal de Silicona Turquesa',
    categoria: 'juguetes-anales',
    precio: 0,
    imagen: '/products/plug-anal-turquesa-grande.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un plug anal curvo de silicona premium, de superficie lisa y base plana, pensado para estimulación prostática o anal general.',
    instrucciones:
      'Usalo siempre con abundante lubricante a base de agua. Introducilo de a poco y con calma. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'plug-anal-turquesa-chico',
    nombre: 'Plug Anal de Silicona Turquesa Chico',
    categoria: 'juguetes-anales',
    precio: 0,
    imagen: '/products/plug-anal-turquesa-chico.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Una versión más pequeña del plug curvo de silicona premium, ideal para quienes se inician en la estimulación anal.',
    instrucciones:
      'Usalo con abundante lubricante a base de agua. Introducilo despacio, respetando tu ritmo. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'bolas-anales-cristal-flexible',
    nombre: 'Bolas Anales Cristal Flexible',
    categoria: 'juguetes-anales',
    precio: 0,
    imagen: '/products/bolas-anales-cristal-flexible.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Una cadena de bolas anales tipo cristal, con un punto flexible en el medio para adaptarse mejor al cuerpo.',
    instrucciones:
      'Aplicá abundante lubricante a base de agua antes de usar. Introducí las bolas de a una, sin apurar. Limpialas con agua y jabón neutro después de cada uso y guardalas en un lugar seco.',
  },
  {
    id: 'masturbador-calor-succion',
    nombre: 'Masturbador con Calor y Succión',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/masturbador-calor-succion.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un masturbador con función de calor, succión regulable y vibración, para una experiencia más envolvente e intensa.',
    instrucciones:
      'Cargalo por USB antes de usar. Aplicá lubricante a base de agua en el interior y activá las funciones que prefieras. Lavalo con agua tibia después de cada uso y dejalo secar bien antes de guardarlo.',
  },
  {
    id: 'masturbador-rene',
    nombre: 'Masturbador Rene Recargable',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/masturbador-rene.png',
    insignias: ['Nuevo'],
    destacado: true,
    ordenDestacado: 4,
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un masturbador de silicona con interior texturado, 5 frecuencias y 5 intensidades de vibración, resistente al agua y recargable.',
    instrucciones:
      'Cargalo por USB antes del primer uso. Aplicá lubricante a base de agua en el interior. Lavalo con agua tibia y jabón neutro después de cada uso.',
  },
  {
    id: 'estimulador-prostata-blue-pro',
    nombre: 'Estimulador de Próstata Blue Pro',
    categoria: 'juguetes-estimuladores',
    precio: 0,
    imagen: '/products/estimulador-prostata-blue-pro.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un estimulador de próstata de silicona con curva ergonómica, base de apoyo y 7 funciones de vibración, resistente al agua.',
    instrucciones:
      'Usalo siempre con abundante lubricante a base de agua. Introducilo despacio y con calma. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'funda-realistica-pene',
    nombre: 'Funda Realística para Pene',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/funda-realistica-pene.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Una funda realista que se desliza sobre el pene, con hueco en la base para mayor sensibilidad y un acabado texturizado natural.',
    instrucciones:
      'Aplicá lubricante a base de agua antes de colocarla. Lavala con agua y jabón neutro después de cada uso y dejala secar bien antes de guardarla.',
  },
  {
    id: 'plug-anal-negro-clasico',
    nombre: 'Plug Anal de Silicona Negro',
    categoria: 'juguetes-anales',
    precio: 0,
    imagen: '/products/plug-anal-negro-clasico.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un plug anal clásico de silicona suave, con base en forma de ancla para mayor seguridad y comodidad.',
    instrucciones:
      'Usalo con abundante lubricante a base de agua. Introducilo de a poco, respetando tu ritmo. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'bolas-anales-azul',
    nombre: 'Bolas Anales de Silicona Azul',
    categoria: 'juguetes-anales',
    precio: 0,
    imagen: '/products/bolas-anales-azul.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Una cadena de bolas anales de silicona de tamaño creciente, con doble anilla en la base para un retiro cómodo.',
    instrucciones:
      'Aplicá abundante lubricante a base de agua. Introducí las bolas de a una, sin apurar, y retiralas con calma. Limpialas con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'bullet-vibrador-rosa-violeta',
    nombre: 'Bullet Vibrador Rosa y Violeta',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/bullet-vibrador-rosa-violeta.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un bullet vibrador compacto, fácil de llevar, con botón de encendido simple e intensidad firme para estimulación directa.',
    instrucciones:
      'Usalo con lubricante a base de agua. Limpialo con agua y jabón neutro después de cada uso y guardalo en un lugar seco.',
  },
  {
    id: 'bullet-vibrador-turquesa-fucsia',
    nombre: 'Bullet Vibrador Turquesa y Fucsia',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/bullet-vibrador-turquesa-fucsia.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un bullet vibrador chiquito y discreto, ideal para llevar de viaje o para sumar estimulación puntual en cualquier momento.',
    instrucciones:
      'Usalo con lubricante a base de agua. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'kit-vela-masaje-bullet',
    nombre: 'Kit de Vela de Masaje y Bullet Vibrador',
    categoria: 'cosmetica-masajes',
    precio: 0,
    imagen: '/products/kit-vela-masaje-bullet.png',
    insignias: ['Nuevo'],
    tinte: ['#ffb74d', '#e65100'],
    descripcion:
      'Un combo pensado para una velada sensorial completa: una vela que se derrite en aceite tibio para masajear y un bullet vibrador para sumar después.',
    instrucciones:
      'Prendé la vela y dejá que funda unos minutos antes de volcar el aceite tibio (nunca hirviendo) sobre la piel para masajear. Usá el bullet con lubricante a base de agua. Limpiá el bullet después de cada uso.',
  },
];
