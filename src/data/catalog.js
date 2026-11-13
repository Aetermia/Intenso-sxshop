// Catalogo demo de Intenso Tandil.
//
// IMPORTANTE: la tienda publicada NO lee este archivo: lee la base de datos
// (ver src/services/api.js). Esto queda como (1) origen del SQL inicial
// (node scripts/export_catalog_sql.mjs -> backend/seed_catalogo.sql) y
// (2) respaldo para ver la tienda en local sin tener el backend levantado.
//
// Cada producto tiene: id, nombre, categoria, precio ARS, imagen (gradiente),
// insignias, descripcion, instrucciones, variantes y color para placeholder.
// Flags opcionales:
//   activo     (boolean, default true)  -> false esconde el producto de la tienda (sin borrarlo)
//   promo      (string opcional)        -> etiqueta para el cartelito de esquina (ej: "PROMO 2x1")
//   sku        (string opcional)        -> código del proveedor (ej: "ST-GN80"), solo referencia interna

export const CATALOG = [
  {
    id: 'anillo-vibrador-bala-recargable',
    nombre: 'Anillo Vibrador con Bala Recargable',
    categoria: 'juguetes-anillos',
    precio: 0,
    imagen: '/products/anillo-vibrador-bala-recargable.webp',
    insignias: ['Nuevo'],
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
    imagen: '/products/bomba-vacio-pene.webp',
    insignias: ['Nuevo'],
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
    imagen: '/products/kit-estimuladores-intercambiables.webp',
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
    imagen: '/products/mini-vibrador-luxury-negro.webp',
    insignias: ['Nuevo'],
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
    imagen: '/products/mini-vibrador-luxury-naranja.webp',
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
    imagen: '/products/mini-vibrador-luxury-bicolor.webp',
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
    imagen: '/products/vibrador-rabbit-paula.webp',
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
    imagen: '/products/vibrador-rabbit-isabella.webp',
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
    imagen: '/products/anillo-vibrador-control-remoto.webp',
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
    imagen: '/products/estimulador-dedo-recargable.webp',
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
    imagen: '/products/anillo-vibrador-rabbit-negro.webp',
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
    imagen: '/products/anillo-vibrador-rabbit-turquesa.webp',
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
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-anillo-fucsia.webp',
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
    imagen: '/products/masturbador-bolsillo.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un masturbador compacto de textura suave y realista, fácil de llevar y discreto, ideal para uso individual.',
    instrucciones:
      'Aplicá lubricante a base de agua tanto dentro como en la entrada. Lavalo con agua tibia y jabón neutro después de cada uso y dejalo secar bien antes de guardarlo.',
  },
  {
    id: 'plug-anal-fucsia',
    nombre: 'Plug Anal de Silicona Fucsia',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-fucsia-mediano.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un plug anal de silicona suave, con base curva para mayor comodidad. Disponible en dos tamaños: uno más chico, ideal para quienes se inician en el juego anal, y otro más grande para quienes ya tienen experiencia.',
    instrucciones:
      'Usalo siempre con abundante lubricante a base de agua. Introducilo de a poco, sin apurar. Limpialo con agua y jabón neutro después de cada uso.',
    variantes: {
      Tamaño: ['Mediano', 'Grande'],
    },
  },
  {
    id: 'anal-beads-negro-doble-anilla',
    nombre: 'Anal Beads Negro con Doble Anilla',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/anal-beads-negro-doble-anilla.webp',
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
    imagen: '/products/kit-fundas-texturizadas-pene.webp',
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
    imagen: '/products/manguito-estimulante-pene.webp',
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
    imagen: '/products/anillo-textura-transparente.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un anillo de silicona suave con textura de relieve, ideal para ayudar a mantener la erección y sumar sensación a la pareja.',
    instrucciones:
      'Colocalo en la base del pene antes de la erección completa, ajustado pero cómodo. Usalo con lubricante a base de agua y no lo dejes puesto más de 20 a 30 minutos.',
  },
  {
    id: 'plug-anal-turquesa',
    nombre: 'Plug Anal de Silicona Turquesa Fun Factory',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-turquesa-grande.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un plug anal curvo de la línea Bootie de Fun Factory, de silicona premium, superficie lisa y base plana. Disponible en dos tamaños.',
    instrucciones:
      'Usalo siempre con abundante lubricante a base de agua. Introducilo de a poco y con calma. Limpialo con agua y jabón neutro después de cada uso.',
    variantes: {
      Tamaño: ['Chico', 'Mediano'],
    },
    medidas: {
      Tamaño: {
        Mediano: 'Fun Factory Bootie, talle M (según la caja original del fabricante).',
      },
    },
  },
  {
    id: 'bolas-anales-cristal-flexible',
    nombre: 'Bolas Anales Cristal Flexible',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/bolas-anales-cristal-flexible.webp',
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
    imagen: '/products/masturbador-calor-succion.webp',
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
    imagen: '/products/masturbador-rene.webp',
    insignias: ['Nuevo'],
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
    imagen: '/products/estimulador-prostata-blue-pro.webp',
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
    imagen: '/products/funda-realistica-pene.webp',
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
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-negro-clasico.webp',
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
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/bolas-anales-azul.webp',
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
    imagen: '/products/bullet-vibrador-rosa-violeta.webp',
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
    imagen: '/products/bullet-vibrador-turquesa-fucsia.webp',
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
    imagen: '/products/kit-vela-masaje-bullet.webp',
    insignias: ['Nuevo'],
    tinte: ['#ffb74d', '#e65100'],
    descripcion:
      'Un combo pensado para una velada sensorial completa: una vela que se derrite en aceite tibio para masajear y un bullet vibrador para sumar después.',
    instrucciones:
      'Prendé la vela y dejá que funda unos minutos antes de volcar el aceite tibio (nunca hirviendo) sobre la piel para masajear. Usá el bullet con lubricante a base de agua. Limpiá el bullet después de cada uso.',
  },
  {
    id: 'kit-vela-san-valentin',
    nombre: 'Kit San Valentín: Vela Corazón y Bullet',
    categoria: 'cosmetica-masajes',
    precio: 0,
    imagen: '/products/kit-vela-san-valentin.webp',
    insignias: ['Nuevo'],
    tinte: ['#ffb74d', '#e65100'],
    descripcion:
      'Una vela en lata con forma de corazón que se derrite en aceite tibio para masajear, con un bullet vibrador metálico rojo. Un combo pensado para una velada romántica.',
    instrucciones:
      'Prendé la vela y dejá que se funda antes de volcar el aceite tibio (nunca hirviendo) sobre la piel. Usá el bullet con lubricante a base de agua.',
  },
  {
    id: 'anillo-vibrador-purple-line-four',
    nombre: 'Anillo Vibrador Luxury Purple Line Four',
    categoria: 'juguetes-anillos',
    precio: 0,
    imagen: '/products/anillo-vibrador-purple-line-four.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un anillo vibrador doble de silicona violeta, con control táctil, 10 modos de vibración y carga por USB.',
    instrucciones:
      'Colocalo en la base, ajustalo cómodo y usalo con lubricante a base de agua. Limpialo después de cada uso.',
  },
  {
    id: 'huevo-vibrador-luna-control-remoto',
    nombre: 'Huevo Vibrador Luna con Control Remoto',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/huevo-vibrador-luna-control-remoto.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un huevo vibrador insertable con control remoto inalámbrico, 8 modos de vibración y movimientos oscilantes.',
    instrucciones:
      'Insertalo con lubricante a base de agua y manejalo con el control remoto. Limpialo después de cada uso.',
  },
  {
    id: 'succionador-clitoris-luxury-succion-7',
    nombre: 'Succionador de Clítoris Luxury Succión 7',
    categoria: 'juguetes-succionadores',
    precio: 0,
    imagen: '/products/succionador-clitoris-luxury-succion-7.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un succionador de clítoris amarillo con doble motor: 9 modos de presión de aire y 5 de vibración.',
    instrucciones:
      'Apoyalo sobre el clítoris y activalo, empezando por la intensidad más baja.',
  },
  {
    id: 'succionador-clitoris-luxury-succion-5',
    nombre: 'Succionador de Clítoris Luxury Succión 5',
    categoria: 'juguetes-succionadores',
    precio: 0,
    imagen: '/products/succionador-clitoris-luxury-succion-5.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un succionador clitoriano con un huevo vibrador adicional conectado por cable, para combinar la succión con la vibración.',
    instrucciones:
      'Usá el succionador y el huevo por separado o juntos, con lubricante a base de agua. Limpiá cada pieza después de cada uso.',
  },
  {
    id: 'funda-extensora-x-tender-1',
    nombre: 'Funda Extensora X-Tender 1',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/funda-extensora-x-tender-1.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Una funda extensora realista de TPE con textura de venas, para sumar largo y sensación.',
    instrucciones:
      'Aplicá lubricante antes de colocarla. Lavala con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'funda-extensora-x-tender-2',
    nombre: 'Funda Extensora X-Tender 2',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/funda-extensora-x-tender-2.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Una funda extensora realista de TPE como la X-Tender 1, con textura arrugada en lugar de venas, para sumar largo y sensación.',
    instrucciones:
      'Aplicá lubricante antes de colocarla. Lavala con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'funda-extensora-x-tender-3',
    nombre: 'Funda Extensora X-Tender 3 con Bala Vibradora',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/funda-extensora-x-tender-3.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Una funda extensora con anillo en la base y una bala vibradora incorporada, para sumar largo y vibración en un solo accesorio.',
    instrucciones:
      'Colocá el anillo en la base y activá la bala vibradora. Usala con lubricante a base de agua y lavala con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'succionador-clitoris-ana-6',
    nombre: 'Succionador de Clítoris Ana 6',
    categoria: 'juguetes-succionadores',
    precio: 0,
    imagen: '/products/succionador-clitoris-ana-6.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un succionador clitoriano dorado y amarillo que combina succión y vibración.',
    instrucciones:
      'Apoyalo sobre el clítoris y activalo, empezando por la intensidad más baja. Usalo con lubricante a base de agua y limpialo después de cada uso.',
  },
  {
    id: 'vibrador-punto-g-gina',
    nombre: 'Vibrador Punto G My First Toy Gina',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-punto-g-gina.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador punto G color durazno con base amarilla, 7 velocidades y 3 funciones.',
    instrucciones:
      'Usalo con lubricante a base de agua, empezando por la velocidad más baja. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'vibrador-punto-g-frida',
    nombre: 'Vibrador Punto G My First Toy Frida',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-punto-g-frida.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador punto G verde con base lila, de la línea My First Toy.',
    instrucciones:
      'Usalo con lubricante a base de agua, empezando por la velocidad más baja. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'vibrador-punto-g-olivia',
    nombre: 'Vibrador Punto G My First Toy Olivia',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-punto-g-olivia.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador punto G rosa con base naranja, de la línea My First Toy.',
    instrucciones:
      'Usalo con lubricante a base de agua, empezando por la velocidad más baja. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'vibrador-luxury-vilma',
    nombre: 'Vibrador Luxury Vilma',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-luxury-vilma.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador bordó texturado de doble motor, con 10 frecuencias de empuje y carga por USB.',
    instrucciones:
      'Cargalo por USB antes de usar. Aplicá lubricante a base de agua y probá las distintas frecuencias de empuje. Limpialo después de cada uso.',
  },
  {
    id: 'vibrador-rabbit-bety',
    nombre: 'Vibrador Rabbit Bety',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-rabbit-bety.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Un vibrador rabbit de silicona fucsia, con brazo estimulador externo.',
    instrucciones:
      'Usalo con lubricante a base de agua, empezando por la intensidad más baja. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'vibrador-rabbit-carla',
    nombre: 'Vibrador Rabbit Carla',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-rabbit-carla.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Un vibrador rabbit de silicona rosa, con brazo estimulador externo.',
    instrucciones:
      'Usalo con lubricante a base de agua, empezando por la intensidad más baja. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'funda-realista-negra-anilla',
    nombre: 'Funda Realista Negra con Anilla',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/funda-realista-negra-anilla.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Una funda realista negra con base de anilla para sujetarla, pensada para sumar textura.',
    instrucciones:
      'Aplicá lubricante antes de colocarla. Lavala con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'vibrador-punto-g-lola-2',
    nombre: 'Vibrador Punto G My First Toy Lola 2',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-punto-g-lola-2.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador punto G violeta con 7 modos de vibración y 3 modos lineales.',
    instrucciones:
      'Usalo con lubricante a base de agua, empezando por el modo más suave. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'set-3-anillos-silicona',
    nombre: 'Set de 3 Anillos de Silicona',
    categoria: 'juguetes-anillos',
    precio: 0,
    imagen: '/products/set-3-anillos-silicona.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Tres anillos de silicona, transparente, azul y negro, para mantener la erección.',
    instrucciones:
      'Colocá el anillo elegido en la base y ajustalo cómodo. Usalo con lubricante a base de agua y lavalo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'dildo-ventosa-becky',
    nombre: 'Dildo con Ventosa Becky',
    categoria: 'juguetes-dildos',
    precio: 0,
    imagen: '/products/dildo-ventosa-becky.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Un dildo con base de ventosa, color rosa jaspeado.',
    instrucciones:
      'Aplicá lubricante a base de agua antes de usarlo. La base de ventosa se adhiere a superficies lisas. Lavalo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'dildo-ventosa-milo',
    nombre: 'Dildo con Ventosa Milo',
    categoria: 'juguetes-dildos',
    precio: 0,
    imagen: '/products/dildo-ventosa-milo.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Un dildo con base de ventosa, color celeste jaspeado.',
    instrucciones:
      'Aplicá lubricante a base de agua antes de usarlo. La base de ventosa se adhiere a superficies lisas. Lavalo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'dildo-ventosa-karol',
    nombre: 'Dildo con Ventosa Karol',
    categoria: 'juguetes-dildos',
    precio: 0,
    imagen: '/products/dildo-ventosa-karol.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Un dildo con base de ventosa, color violeta jaspeado.',
    instrucciones:
      'Aplicá lubricante a base de agua antes de usarlo. La base de ventosa se adhiere a superficies lisas. Lavalo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'vibrador-punto-g-vibe-black-1',
    nombre: 'Vibrador Punto G Vibe Black 1',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-punto-g-vibe-black-1.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador punto G negro con detalle dorado, 3 velocidades y 7 ritmos.',
    instrucciones:
      'Usalo con lubricante a base de agua, empezando por la velocidad más baja. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'estimulador-dedo-finger-3',
    nombre: 'Estimulador de Dedo Finger 3 Black',
    categoria: 'juguetes-estimuladores',
    precio: 0,
    imagen: '/products/estimulador-dedo-finger-3.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un estimulador de dedo negro con orejitas, de la línea Finger, con carga por USB.',
    instrucciones:
      'Colocalo en el dedo y activalo con el botón. Usalo con lubricante a base de agua. Se recarga por USB. Limpialo después de cada uso.',
  },
  {
    id: 'estimulador-dedo-finger-4',
    nombre: 'Estimulador de Dedo Finger 4 Purple',
    categoria: 'juguetes-estimuladores',
    precio: 0,
    imagen: '/products/estimulador-dedo-finger-4.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un estimulador de dedo con forma de mariposa, color violeta, de la línea Finger, con carga por USB.',
    instrucciones:
      'Colocalo en el dedo y activalo con el botón. Usalo con lubricante a base de agua. Se recarga por USB. Limpialo después de cada uso.',
  },
  {
    id: 'esposas-eco-cuero-negro',
    nombre: 'Esposas Eco Cuero Negro',
    categoria: 'bdsm',
    precio: 0,
    imagen: '/products/esposas-eco-cuero-negro.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un par de esposas de muñeca en eco-cuero negro, con hebillas metálicas ajustables y mosquetón de conexión entre ambas, para juegos de ataduras y sumisión.',
    instrucciones:
      'Ajustalas de forma que entre un dedo entre la muñeca y la esposa, usalas con consentimiento y una palabra de seguridad acordada, y no dejes a la persona atada sola. Para soltar rápido, abrí el mosquetón. Limpiá el cuero con un paño húmedo después de cada uso.',
  },
  {
    id: 'plug-anal-cola-conejo',
    nombre: 'Plug Anal de Silicona con Cola de Conejo',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-cola-conejo.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un plug anal de silicona con cola de conejo en la base, para sumar un detalle juguetón a la estimulación anal.',
    instrucciones:
      'Usalo siempre con abundante lubricante a base de agua. Introducilo de a poco y con calma. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'consolador-ultra-realista',
    nombre: 'Consolador Ultra Realista',
    categoria: 'juguetes-dildos',
    precio: 0,
    imagen: '/products/consolador-ultra-realista.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un consolador realista de silicona líquida de 4 capas, con base de ventosa, en tono piel medio. De la línea "Ultra Realistic 4-Layer".',
    instrucciones:
      'Pegá la base de ventosa a una superficie lisa, limpia y no porosa, presionando firme hasta que quede fija, y comprobá que esté bien adherida antes de apoyar peso. Usalo con lubricante a base de agua. Lavalo con agua y jabón neutro después de cada uso y dejalo secar bien antes de guardarlo.',
  },
  {
    id: 'guante-masturbador',
    nombre: 'Guante Masturbador',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/guante-masturbador.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un masturbador con forma de guante, de silicona/TPE negro, con textura interior en relieve (a modo de "puño" simulado) y superficie cuadriculada en el dorso. De la línea Gripmaster.',
    instrucciones:
      'Aplicá lubricante a base de agua por dentro antes de usarlo. Lavalo con agua tibia y jabón neutro después de cada uso y dejalo secar bien al aire antes de guardarlo.',
  },
  {
    id: 'anillo-vibrador-prostata',
    nombre: 'Anillo Vibrador para Próstata',
    categoria: 'juguetes-anillos',
    precio: 0,
    imagen: '/products/anillo-vibrador-prostata.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un estimulador de próstata de silicona negra con anillo integrado para la base del pene y motor vibrador tipo bala. Mide 13 x 7,4 x 2,3 cm y pesa 101 g (medidas impresas en la caja). De la línea Maxthor.',
    instrucciones:
      'Cargá el motor antes del primer uso. Usalo con lubricante a base de agua: colocá el anillo en la base del pene (cómodo, nunca ajustado al punto de doler) e introducí la parte de próstata de a poco. Si sentís dolor o mucha molestia, quitalo de inmediato. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'masturbador-bolsillo-mitta',
    nombre: 'Masturbador de Bolsillo Mitta',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/masturbador-bolsillo-mitta.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un masturbador de bolsillo realista ("pocket pussy"), con apertura texturada. De la línea "Mitta — Tight & Wet Pocket Pussy".',
    instrucciones:
      'Aplicá lubricante a base de agua dentro y en la entrada. Lavalo con agua tibia y jabón neutro después de cada uso y dejalo secar bien al aire antes de guardarlo.',
  },
  {
    id: 'vibrador-anal',
    nombre: 'Vibrador Anal',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/vibrador-anal.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un plug/vibrador anal negro controlable por aplicación de celular, con 9 modos de vibración seleccionables desde el teléfono. De la línea Noctis.',
    instrucciones:
      'Cargalo por completo antes del primer uso y descargá la app indicada por el fabricante (se vincula por Bluetooth). Usalo siempre con abundante lubricante a base de agua, introducilo de a poco dejando la base fuera del cuerpo, y manejá los modos desde el botón del equipo o la app. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'vibrador-huevo-duoluxe',
    nombre: 'Vibrador Huevo DuoLuxe',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-huevo-duoluxe.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador en forma de "U" para usar en pareja durante la penetración (un extremo estimula el punto G, el otro el clítoris). Con 10 modos de vibración, control por app vía Bluetooth, hasta 1,4 h de uso continuo, carga magnética USB (2 h) y resistencia al agua IP65. De la línea DuoLuxe.',
    instrucciones:
      'Cargalo por completo antes del primer uso (2 h de carga) y descargá la app indicada por el fabricante. Usalo con abundante lubricante a base de agua, colocándolo con un extremo sobre el punto G y el otro sobre el clítoris. Lavalo con agua después de cada uso, secalo bien y guardalo en un lugar limpio.',
  },
  {
    id: 'vibrador-silkyvibe',
    nombre: 'Vibrador SilkyVibe',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-silkyvibe.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador curvo color violeta, de tacto suave, con control remoto inalámbrico independiente. Carga magnética USB (1,5 h) y autonomía de hasta 2 h.',
    instrucciones:
      'Cargá tanto el vibrador como el control remoto antes del primer uso (1,5 h). Usalo con lubricante a base de agua y manejá la intensidad desde el control remoto. Lavalo con agua y jabón neutro después de cada uso y guardalo junto con el control en un lugar limpio.',
  },
  /*---------------------------------Santino------------------------------------------------*/
  {
    id: 'set-anillos-drakon',
    nombre: 'Set de anillos Drakon',
    categoria: 'juguetes-anillos',
    precio: 0,
    imagen: '/products/set-anillos-drakon.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Anillo peneano de silicona negra texturada, con diseño decorativo tipo "alas". Una de las piezas del set mide 25 mm de diámetro interno x 47 mm de alto, peso 4,5 g (puede haber más de un tamaño en el set).',
    instrucciones: 'Lavalo antes del primer uso. Colocalo en la base del pene antes de la erección completa, estirando la silicona con cuidado. Tiene que quedar firme pero cómodo. No usar por más de 20-30 minutos seguidos. Lavalo y guardalo limpio después de cada uso.'
  },
  {
    id: 'plug-anal-eros-dorado',
    nombre: 'Plug anal Eros',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-eros-dorado.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Plug anal metálico acabado dorado espejado, con gema celeste en la base. Superficie lisa, impermeable y fácil de higienizar.',
    instrucciones: 'Es un plug fijo (no vibra). Usá abundante lubricante a base de agua. Introducilo de a poco, dejando la base ancha siempre fuera. Por ser metal, se puede jugar con la temperatura (probá siempre en la muñeca primero). Lavalo con agua y jabón neutro después de cada uso.',
    variantes: { Tamaño: ['Small'] }
  },
  {
    id: 'plug-anal-heart-love-oro-rosa',
    nombre: 'Plug anal Heart Love',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-heart-love-oro-rosa.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Plug anal metálico en oro rosa, con gema en forma de corazón verde en la base. Superficie lisa con acabado brillante, peso equilibrado, apto para frío y calor.',
    instrucciones: 'Usá lubricante a base de agua, introducción lenta con base siempre afuera. Si usás juegos de temperatura, probá antes en la muñeca. Lavalo con agua y jabón neutro después de usar.',
    variantes: { Tamaño: ['Small'] }
  },
  {
    id: 'plug-anal-ergo-oro-rosa',
    nombre: 'Plug anal Ergo',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-ergo-oro-rosa.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Plug anal metálico en oro rosa, de forma curva/ergonómica. Medidas: largo total 7,8 cm, diámetro 2,3 cm. Resistente al agua.',
    instrucciones: 'Usá lubricante a base de agua, introducilo de a poco con la base siempre fuera. Lavado con agua y jabón neutro después de cada uso.',
    variantes: { Tamaño: ['Small'] }
  },
  {
    id: 'plug-anal-orion-azul',
    nombre: 'Plug anal Orion',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-orion-azul.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Plug anal metálico en tono cobre/oro rosa con forma de 3 esferas graduadas y gema azul oscuro en la base. Medidas: 9,3 cm, 46 g.',
    instrucciones: 'Introducilo de a una bolita por vez, dejando que el cuerpo se adapte. Usá lubricante a base de agua, dejá la base afuera y lavalo después de cada uso con agua y jabón neutro.',
    variantes: { Tamaño: ['Small'] }
  },
  {
    id: 'plug-anal-titan-cromado',
    nombre: 'Plug anal Titan',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-titan-cromado.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Plug anal de aluminio, acabado cromado/plateado, forma clásica alargada con gema azul en la base. Medidas: 11,2 cm, 96 g.',
    instrucciones: 'Tomate más tiempo para la introducción al ser más grande, de a poco y con abundante lubricante a base de agua. Base siempre afuera. Lavalo con agua y jabón neutro después de usar.',
    variantes: { Tamaño: ['Small'] }
  },
  {
    id: 'plug-anal-bunny-tail-blanca',
    nombre: 'Plug anal Bunny Tail',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-bunny-tail-blanca.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Plug anal metálico plateado con cola de conejo esponjosa blanca desmontable en la base.',
    instrucciones: 'Usá lubricante a base de agua, introducción lenta. Revisá que la cola desmontable quede bien enganchada. Evitá mojar la cola al lavar el plug; limpiala aparte con un paño húmedo si hace falta.',
    variantes: { Tamaño: ['Small'] }
  },
  {
    id: 'plug-anal-tail-negra',
    nombre: 'Plug anal Tail',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-tail-negra.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Plug anal metálico en tono gunmetal/negro, con cola tipo zorro larga y tupida en color negro, desmontable en la base.',
    instrucciones: 'Usá lubricante a base de agua e introducilo lento. Lavá el plug metálico con agua y jabón neutro, y la cola desmontable limpiala aparte con un paño húmedo.',
    variantes: { Tamaño: ['Small'] }
  },
  {
    id: 'anal-hook-acero',
    nombre: 'Anal Hook de acero',
    categoria: 'bdsm',
    precio: 0,
    imagen: '/products/anal-hook-acero.webp',
    insignias: ['Nuevo'],
    tinte: ['#3a3a3a', '#141414'],
    descripcion: 'Accesorio BDSM: gancho de acero con bola en un extremo y argolla en el otro, para uso anal con atadura.',
    instrucciones: 'Para nivel avanzado. Usá abundante lubricante a base de agua e introducilo de a poco. Nunca tires con fuerza de la argolla. Acordá una palabra de seguridad antes de usarlo. Lavalo, secalo bien para evitar óxido y guardalo seco.'
  },
  {
    id: 'jaula-castidad-helix-shield',
    nombre: 'Jaula de castidad Helix Shield',
    categoria: 'bdsm',
    precio: 0,
    imagen: '/products/jaula-castidad-helix-shield.webp',
    insignias: ['Nuevo'],
    tinte: ['#3a3a3a', '#141414'],
    descripcion: 'Jaula de castidad masculina de metal, con anillo de base, estructura en espiral y candado incluido.',
    instrucciones: 'Colocala con el pene flácido, ajustando primero el anillo de base y después la estructura. Recomendable quitarla cada 24-48 horas para higienizar. Lavala con agua y jabón neutro.',
    variantes: { Tamaño: ['Medium'] }
  },
  {
    id: 'plug-anal-silverpulse',
    nombre: 'Plug anal Silverpulse',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-silverpulse.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Plug anal con punta metálica plateada y base de silicona negra con forma de ancla para retención. Modelo fijo (no vibra).',
    instrucciones: 'Usá lubricante a base de agua, introducilo de a poco con la base siempre afuera. Lavalo con agua y jabón neutro después de cada uso.',
    variantes: { Tamaño: ['Small'] }
  },
  {
    id: 'vibrador-punto-g-aura-one',
    nombre: 'Vibrador punto G Aura One',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-punto-g-aura-one.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Vibrador de silicona color fucsia/rosa, punta curva para estimulación de punto G, con rotación 360° y recargable.',
    instrucciones: 'Cargalo por completo antes del primer uso. Usá lubricante a base de agua. Encendé y elegí la velocidad de rotación empezando en la más baja. Lavalo con agua y jabón neutro.'
  },
  {
    id: 'vibrador-rabbit-douce-tap',
    nombre: 'Vibrador rabbit Douce Tap',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-rabbit-douce-tap.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Vibrador rabbit color rojo/bordó, con brazo estimulador de clítoris que aletea (flapping tickler) y textura en relieve en la punta.',
    instrucciones: 'Cargalo antes de usar. Aplicá lubricante a base de agua. Con los 3 botones encendé y ajustá la intensidad de vibración y aleteo empezando despacio. Lavalo con agua y jabón neutro.'
  },
  {
    id: 'plug-vibrador-anal-mirage',
    nombre: 'Plug vibrador anal Mirage',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-vibrador-anal-mirage.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Plug anal de silicona negra con base ancha en forma de ancla y motor vibrador bala insertable en la parte superior.',
    instrucciones: 'Retirá el motor antes de lavar el plug. Insertá el motor cargado, usá lubricante a base de agua e introducilo de a poco. Después de usar, lavá el cuerpo de silicona con agua y jabón, y limpiá el motor con paño húmedo.'
  },
  {
    id: 'vibrador-rabbit-rabitas',
    nombre: 'Vibrador rabbit Rabitas',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-rabbit-rabitas.webp',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Vibrador rabbit color fucsia, con brazo estimulador de clítoris en forma de orejas, cuerpo curvo y 3 botones de control en la base.',
    instrucciones: 'Cargalo antes del primer uso. Usá lubricante a base de agua. Encendé con el botón central y usá +/- para intensidad y patrones, empezando despacio. Lavalo con agua y jabón neutro.'
  },
  {
    id: 'crema-intima-anal-vanal-fly-night-70ml',
    sku: 'FN-C2015',
    nombre: 'Crema Íntima Anal Vanal Fly Night 70 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/crema-intima-anal-vanal-fly-night-70ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Crema íntima pensada para una experiencia anal más cómoda y placentera. Su textura facilita el deslizamiento y reduce molestias, con lubricación prolongada y 3 extractos naturales que ayudan a relajar. Viene en pomo de 70 ml, práctico y fácil de usar.',
    instrucciones:
      'Aplicá una cantidad pequeña en la zona y renová cuando lo necesites. Empezá despacio y con calma. Se retira con agua.',
  },
  {
    id: 'gel-intimo-neutro-fly-night-70ml',
    sku: 'FN-C2016',
    nombre: 'Gel Íntimo Neutro con Aloe Vera Fly Night 70 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-intimo-neutro-fly-night-70ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel íntimo a base de agua con aloe vera, que nutre y calma la piel. Tiene pH optimizado para respetar el equilibrio natural, no tiene sabor ni aroma y está formulado sin parabenos ni parafinas. Pomo de 70 ml.',
    instrucciones:
      'Aplicá la cantidad que necesites sobre la zona íntima y renová cuando haga falta. Al ser a base de agua, se limpia fácil con agua.',
  },
  {
    id: 'gel-intimo-wet-pleasure-fly-night-70ml',
    sku: 'FN-C2017',
    nombre: 'Gel Íntimo Wet Pleasure Fly Night 70 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-intimo-wet-pleasure-fly-night-70ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel íntimo a base de agua con L-Arginina, que potencia la sensibilidad, y aroma a rosas. Genera una suave sensación de calor y está pensado especialmente para la mujer. Pomo de 70 ml.',
    instrucciones:
      'Aplicá una pequeña cantidad sobre la zona íntima y esperá unos segundos para sentir el efecto. Probá primero en una zona chica. Se limpia con agua.',
  },
  {
    id: 'gel-intimo-calor-hot-power-fly-night-70ml',
    sku: 'FN-C2018',
    nombre: 'Gel Íntimo Efecto Calor Hot Power Fly Night 70 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-intimo-calor-hot-power-fly-night-70ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel íntimo a base de agua con efecto calor inmediato, que aumenta la sensibilidad al instante. No genera sensación de frío al aplicarlo. Viene en pomo de 70 ml para dosificar la cantidad justa.',
    instrucciones:
      'Aplicá una pequeña cantidad sobre la zona y regulá la intensidad con la cantidad que uses. Probá primero en una zona chica. Se limpia con agua.',
  },
  {
    id: 'gel-intimo-retardante-one-more-time-fly-night-70ml',
    sku: 'FN-C2019',
    nombre: 'Gel Íntimo Retardante One More Time Fly Night 70 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-intimo-retardante-one-more-time-fly-night-70ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel íntimo retardante a base de agua, con extractos que desensibilizan suavemente para ayudar a prolongar la erección y retardar la eyaculación. Fácil de aplicar, en pomo de 70 ml.',
    instrucciones:
      'Aplicá una pequeña cantidad y masajeá suavemente unos minutos antes del encuentro. Probá primero en una zona chica. Se limpia con agua.',
  },
  {
    id: 'gel-intimo-flavored-frutilla-fly-night-70ml',
    sku: 'FN-C2020',
    nombre: 'Gel Íntimo Flavored Sabor Frutilla Fly Night 70 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-intimo-flavored-frutilla-fly-night-70ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel íntimo a base de agua con sabor y aroma a frutilla. No se pega, tiene textura suave y no contiene azúcar, ideal para piel sensible. Pomo de 70 ml.',
    instrucciones:
      'Aplicá la cantidad justa directo del pomo sobre la zona y renová cuando lo necesites. Se limpia con agua.',
  },
  {
    id: 'gel-intimo-frio-refreshing-fly-night-70ml',
    sku: 'FN-C2021',
    nombre: 'Gel Íntimo Efecto Frío Refreshing Fly Night 70 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-intimo-frio-refreshing-fly-night-70ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel íntimo a base de agua con efecto frío: genera una sensación refrescante y un cosquilleo suave que intensifica el placer. También actúa como retardante de la eyaculación. Pomo de 70 ml, fácil de aplicar y transportar.',
    instrucciones:
      'Aplicá una pequeña cantidad sobre la zona y esperá unos segundos para sentir el efecto. Probá primero en una zona chica. Se limpia con agua.',
  },
  {
    id: 'gel-intimo-sweet-temptation-chocolate-fly-night-70ml',
    sku: 'FN-C2022',
    nombre: 'Gel Íntimo Sweet Temptation Aroma a Chocolate Fly Night 70 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-intimo-sweet-temptation-chocolate-fly-night-70ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel íntimo a base de agua con sabor y aroma a chocolate. No se pega, tiene textura suave y su fórmula no contiene azúcar ni parabenos. Ideal para juegos sensoriales en pareja. Pomo de 70 ml.',
    instrucciones:
      'Aplicá la cantidad que quieras sobre la zona y renová cuando lo necesites. Se limpia con agua.',
  },
  {
    id: 'gel-intimo-milkxxx-fly-night-200ml',
    sku: 'FN-C3313',
    nombre: 'Gel Íntimo Milkxxx Símil Semen Fly Night 200 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-intimo-milkxxx-fly-night-200ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Lubricante a base de agua con textura símil semen, para una sensación realista, y aroma a coco suave. Viene en envase de 200 ml con dosificador, que evita desperdicios.',
    instrucciones:
      'Producto de uso externo. Dosificá con el pump la cantidad que necesites. Se retira fácil con agua, sin dejar residuos.',
  },
  {
    id: 'crema-intima-anal-vanal-fly-night-200ml',
    sku: 'FN-C3315',
    nombre: 'Crema Íntima Anal Vanal Fly Night 200 ml con Dosificador',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/crema-intima-anal-vanal-fly-night-200ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Crema íntima para uso anal, de textura cremosa y suave que reduce la fricción para una experiencia más cómoda y placentera. Es compatible con preservativos. Envase de 200 ml con dosificador pump.',
    instrucciones:
      'Dosificá con el pump la cantidad que necesites, aplicá en la zona y renová cuando haga falta. Empezá despacio y con calma. Se retira con agua.',
  },
  {
    id: 'gel-lubricante-diabolico-fly-night-200ml',
    sku: 'FN-C3323',
    nombre: 'Gel Lubricante Diabólico Fly Night 200 ml con Dosificador',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-diabolico-fly-night-200ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Lubricante ultradeslizante pensado para fisting y uso anal. Tiene textura cristalina, liviana y elástica, no tiene olor ni sabor y dura más que un lubricante convencional. Envase de 200 ml con dosificador.',
    instrucciones:
      'Dosificá con el pump la cantidad que necesites y renová durante el uso si hace falta. Se limpia con agua.',
  },
  {
    id: 'gel-diabolico-fisting-fly-night-500ml',
    sku: 'FN-C3523',
    nombre: 'Gel Diabólico Fisting Anal y Vaginal Fly Night 500 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-diabolico-fisting-fly-night-500ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Lubricante ultradeslizante para fisting anal y vaginal, de textura cristalina y suave, sin olor ni sabor. Viene en pote de 500 ml, rinde para muchas sesiones.',
    instrucciones:
      'Tomá la cantidad que necesites con la mano limpia y aplicá en abundancia, renovando cuando haga falta. Cerrá bien el pote después de cada uso. Se limpia con agua.',
  },
  {
    id: 'gel-lubricante-gold-sextual-80ml',
    sku: 'ST-GFG80',
    nombre: 'Gel Lubricante Gold con L-Arginina, Maca y Jengibre Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-gold-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante de la línea Fancy con 3 ingredientes naturales: L-Arginina, maca y jengibre. Mejora la estimulación íntima y aumenta la sensibilidad, para orgasmos más intensos y duraderos. Envase de 80 ml.',
    instrucciones:
      'Aplicá una pequeña cantidad sobre la zona íntima y renová cuando lo necesites. Probá primero en una zona chica. Se limpia con agua.',
  },
  {
    id: 'gel-lubricante-jade-sextual-80ml',
    sku: 'ST-GFJ80',
    nombre: 'Gel Lubricante Jade con Colágeno y Vitamina C Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-jade-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante a base de agua de la línea Fancy, con colágeno que nutre y repara la zona íntima y vitamina C que favorece la circulación. No tiene aromas ni sabores artificiales. Envase de 80 ml.',
    instrucciones:
      'Usalo antes, durante o después del encuentro: aplicá la cantidad que necesites sobre la zona. Se limpia con agua.',
  },
  {
    id: 'gel-lubricante-ruby-sextual-80ml',
    sku: 'ST-GFR80',
    nombre: 'Gel Lubricante Ruby con Ácido Hialurónico y Argán Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-ruby-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante 100% a base de agua de la línea Fancy, con ácido hialurónico y argán para proteger y nutrir, y efecto antiage que mejora la elasticidad íntima. Sin aromas ni sabores añadidos. Envase de 80 ml.',
    instrucciones:
      'Aplicá la cantidad que necesites sobre la zona y renová cuando haga falta. Se limpia con agua.',
  },
  {
    id: 'gel-lubricante-neutro-sextual',
    sku: 'ST-GN30 / ST-GN80 / ST-GN200',
    nombre: 'Gel Lubricante Neutro Natural Sextual',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-neutro-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante neutro a base de agua, translúcido y sin aroma, de alto poder de lubricación. Es hidrosoluble, no mancha la piel ni la ropa, no deja residuos y deja la piel humectada y sedosa. Ideal para pieles sensibles y compatible con preservativos y juguetes. Disponible en 30 ml (ideal para llevar), 80 ml y 200 ml.',
    instrucciones:
      'Aplicá la cantidad que necesites sobre la zona o el juguete y renová cuando haga falta. Se limpia fácil con agua.',
    variantes: {
      Tamaño: ['30 ml', '80 ml', '200 ml'],
    },
  },
  {
    id: 'gel-lubricante-aloe-vera-sextual-80ml',
    sku: 'ST-GNAV80',
    nombre: 'Gel Lubricante Natural con Aloe Vera Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-aloe-vera-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante 100% hidrosoluble con aloe vera, que aporta propiedades calmantes. Tiene alto poder de lubricación, textura ligera de rápida absorción y no mancha ni deja residuos. Envase de 80 ml.',
    instrucciones:
      'Aplicá la cantidad que necesites sobre la zona y renová cuando haga falta. Se limpia con agua.',
  },
  {
    id: 'gel-lubricante-sens-chicle-sextual-80ml',
    sku: 'ST-GSCH80',
    nombre: 'Gel Lubricante Sens Sabor Chicle Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-sens-chicle-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante a base de agua con sabor y aroma a chicle. Deja la piel humectada y sedosa, no mancha ni deja residuos y es compatible con preservativos. Envase de 80 ml.',
    instrucciones:
      'Aplicá la cantidad que quieras sobre la zona y renová cuando lo necesites. Se limpia fácil con agua.',
  },
  {
    id: 'gel-lubricante-sens-dulce-de-leche-sextual-80ml',
    sku: 'ST-GSDL80',
    nombre: 'Gel Lubricante Sens Sabor Dulce de Leche Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-sens-dulce-de-leche-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante a base de agua con sabor dulce de leche. Tiene alto poder de lubricación y textura ligera, no mancha ni deja residuos y es compatible con preservativos. Envase de 80 ml.',
    instrucciones:
      'Aplicá la cantidad que quieras sobre la zona y renová cuando lo necesites. Se limpia fácil con agua.',
  },
  {
    id: 'gel-lubricante-sens-frutilla-sextual-80ml',
    sku: 'ST-GSF80',
    nombre: 'Gel Lubricante Sens Sabor Frutilla Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-sens-frutilla-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante a base de agua con aroma y sabor a frutilla. Tiene alto poder de lubricación, deja la piel humectada y sedosa y no mancha ni deja residuos en la piel o la ropa. Envase de 80 ml.',
    instrucciones:
      'Aplicá la cantidad que quieras sobre la zona y renová cuando lo necesites. Se limpia fácil con agua.',
  },
  {
    id: 'gel-lubricante-sens-fire-sextual-80ml',
    sku: 'ST-GSFIRE80',
    nombre: 'Gel Lubricante Sens Fire Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-sens-fire-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante hidrosoluble de color rojo intenso y sin aroma, con lubricación suave y duradera. No mancha ni deja residuos y deja la piel humectada y sedosa. Envase de 80 ml.',
    instrucciones:
      'Aplicá la cantidad que necesites sobre la zona y renová cuando haga falta. Se limpia con agua.',
  },
  {
    id: 'gel-lubricante-sens-ice-sextual-80ml',
    sku: 'ST-GSICE80',
    nombre: 'Gel Lubricante Sens Ice Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-sens-ice-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante a base de agua, transparente y sin aroma, de alto poder de lubricación. Se extiende fácil, no mancha ni deja residuos y deja la piel humectada y sedosa. Para usar en pareja o en solitario. Envase de 80 ml.',
    instrucciones:
      'Aplicá la cantidad que necesites sobre la zona y renová cuando haga falta. Se limpia con agua.',
  },
  {
    id: 'gel-lubricante-sens-limon-sextual-80ml',
    sku: 'ST-GSL80',
    nombre: 'Gel Lubricante Sens Sabor Limón Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-sens-limon-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante a base de agua con aroma y sabor a limón. Tiene alto poder de lubricación, textura suave que no deja residuos y es compatible con preservativos. Envase de 80 ml.',
    instrucciones:
      'Aplicá la cantidad que quieras sobre la zona y renová cuando lo necesites. Se limpia fácil con agua.',
  },
  {
    id: 'gel-lubricante-anal-twerking-rosas-sextual-80ml',
    sku: 'ST-GT80',
    nombre: 'Gel Lubricante Anal Twerking Aroma a Rosas Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-anal-twerking-rosas-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante anal hidrosoluble con fragancia relajante a rosas. Brinda lubricación de larga duración para disfrutar sin interrupciones ni molestias, y no mancha la piel ni la ropa. Envase de 80 ml.',
    instrucciones:
      'Aplicá en abundancia sobre la zona y renová cuando haga falta. Empezá despacio y con calma. Se limpia con agua.',
  },
  {
    id: 'gel-lubricante-twerking-arnica-manzanilla-sextual-80ml',
    sku: 'ST-GTAM80',
    nombre: 'Gel Lubricante Twerking con Árnica y Manzanilla Sextual 80 ml',
    categoria: 'lubricantes',
    precio: 0,
    imagen: '/products/gel-lubricante-twerking-arnica-manzanilla-sextual-80ml.webp',
    insignias: ['Nuevo'],
    tinte: ['#f5426b', '#c2185b'],
    descripcion:
      'Gel lubricante hidrosoluble sin aroma, con árnica y manzanilla de propiedades antiinflamatorias y relajantes. Brinda lubricación de larga duración, cuida la piel sensible y no mancha ni deja residuos. Envase de 80 ml.',
    instrucciones:
      'Aplicá la cantidad que necesites sobre la zona y renová cuando haga falta. Se limpia con agua.',
  }
];
