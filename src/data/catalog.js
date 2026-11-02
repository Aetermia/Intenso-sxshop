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
    id: 'vibrador-punto-g',
    nombre: 'Vibrador Punto G Curvo',
    categoria: 'juguetes',
    precio: 38500,
    imagen: '/products/vibrador-punto-g.png',
    insignias: ['Top Ventas', 'Envio Discreto'],
    destacado: true,
    ordenDestacado: 1,
    promo: 'PROMO 2x1',
    tinte: ['#DC015B', '#7d0036'],
    descripcion:
      'Un curvo disenado para acariciar exactamente donde mas se pide. Su textura sedosa y su vibracion potente lo vuelven el companero ideal para explorar tu punto G con total control. Silencioso, recargable y listo para subir la temperatura cuando quieras.',
    instrucciones:
      'Aplica lubricante a base de agua antes de usar. Recargalo con el cable incluido y usalo en modo bajo para comenzar, subiendo la intensidad con calma. Limpialo con agua tibia y jabon neutro despues de cada uso. Guardalo en su bolsita para mantenerlo impecable.',
    variantes: {
      Color: ['Magenta', 'Negro', 'Lila'],
      Intensidad: ['10 velocidades', '15 velocidades'],
    },
  },
  {
    id: 'bullets-mini',
    nombre: 'Bullet Mini Clitoral',
    categoria: 'juguetes',
    precio: 12500,
    insignias: ['Envio Discreto'],
    tinte: ['#f5426b', '#a80044'],
    descripcion:
      'Chiquito en tamaño, enorme en sensaciones. Este bullet se esconde en cualquier bolsillo pero promete momentos intensos. Su vibracion potente y su punta concentrada lo hacen perfecto para estimulacion clitoral precisa, adentro o afuera.',
    instrucciones:
      'Discreto y facil de llevar. Usalo con lubricante a base de agua, movelo en circulos suaves y explora distintos ritmos. Limpialo con agua y jabon neutro. Ideal para viajar o para empezar en el mundo del placer.',
    variantes: {
      Color: ['Rosa', 'Negro', 'Fucsia'],
    },
  },
  {
    id: 'anillo-parejas',
    nombre: 'Anillo Vibrador para Parejas',
    categoria: 'juguetes-parejas',
    precio: 21500,
    insignias: ['Top Ventas'],
    destacado: true,
    ordenDestacado: 2,
    tinte: ['#e07bd0', '#9c27b0'],
    descripcion:
      'Un juego en dos. Este anillo vibrador se coloca y potencia la conexion entre los dos, estimulando a ambos al mismo tiempo. El elastico de ajuste comodo y la vibracion intensa hacen que compartir sea mucho mas divertido.',
    instrucciones:
      'Colocalo en la base y ajusta a tu medida. Encendelo para disfrutar de la vibracion en pareja. Usa lubricante a base de agua y limpialo despues de cada encuentro con agua tibia. Bastan pilas incluidas para varias sesiones.',
    variantes: {
      Talle: ['Unico', 'Ajustable'],
      Color: ['Violeta', 'Transparente'],
    },
  },
  {
    id: 'osito-vibrador',
    nombre: 'Osito Vibrador Sorpresa',
    categoria: 'juguetes',
    precio: 29500,
    insignias: ['Nuevo'],
    tinte: ['#d2b6ff', '#7a4bd6'],
    descripcion:
      'Un compañero peludo y discreto que guarda un secreto vibrante. Con su forma adorable y su potencia oculta, es ideal para regalar o para romper el hielo con una sonrisa picara. Recargable, silencioso y divertido.',
    instrucciones:
      'Cargalo por USB y activalo con su boton oculto. Usalo con lubricante y disfruta de distintas intensidades. Limpialo con un panio humedo sin sumergirlo. Perfecto para regalar o para jugar en pareja.',
    variantes: {
      Color: ['Gris', 'Rosado', 'Crema'],
    },
  },
  {
    id: 'conjunto-lenceria',
    nombre: 'Conjunto de Lenceria Encaje',
    categoria: 'lenceria-mujer',
    precio: 24800,
    insignias: ['Top Ventas', 'Envio Discreto'],
    destacado: true,
    ordenDestacado: 3,
    promo: '-20%',
    tinte: ['#f2a0c0', '#c2185b'],
    descripcion:
      'Encaje suave que abraza cada curva con una elegancia sensual. Este conjunto de corpiño y bombacha a juego invita a sentirte segura y deseada. El detalle de cintas ajustables suma un toque picaro y sofisticado.',
    instrucciones:
      'Lavar a mano con agua fria y jabon neutro. Secar a la sombra sin exprimir. Consulta la tabla de talles para elegir el ajuste perfecto. Ideal para una noche especial o para el dia a dia con actitud.',
    variantes: {
      Talle: ['S', 'M', 'L', 'XL'],
      Color: ['Negro', 'Rojo', 'Rosa'],
    },
  },
  {
    id: 'bodysuit-rendija',
    nombre: 'Bodysuit con Corte Picaro',
    categoria: 'lenceria-mujer',
    precio: 18900,
    insignias: ['Nuevo'],
    tinte: ['#ff7aa2', '#d81b60'],
    descripcion:
      'Un bodysuit con aberturas estratégicas que deja poco a la imaginacion y mucho al deseo. Su tejido elastico se adapta al cuerpo y resalta lo mejor de vos. Perfecto para sorprender a tu pareja o a vos misma.',
    instrucciones:
      'Lavar a mano con agua fria. Evitar plancha y secadora para conservar la elasticidad. Talle flexible: consulta la guia de medidas para elegir tu ajuste ideal.',
    variantes: {
      Talle: ['S', 'M', 'L'],
      Color: ['Negro', 'Rojo'],
    },
  },
  {
    id: 'lubricante-agua',
    nombre: 'Lubricante Base Agua 250ml',
    categoria: 'lubricantes',
    precio: 8900,
    insignias: ['Top Ventas'],
    destacado: true,
    ordenDestacado: 4,
    tinte: ['#4fc3f7', '#0288d1'],
    descripcion:
      'Suavidad que se desliza y acompaña cada momento. Este lubricante a base de agua es compatible con todos los juguetes y preservativos, no deja residuos pegajosos y se mantiene comodo durante todo el encuentro.',
    instrucciones:
      'Aplica una pequeña cantidad y agrega de a poco segun necesidad. Compatible con latex y juguetes de silicona. Guardar en lugar fresco y seco. Reutilizable en muchas sesiones: rinde muchisimo.',
    variantes: {
      Sabor: ['Neutro', 'Frutilla', 'Chocolate'],
    },
  },
  {
    id: 'aceite-masaje',
    nombre: 'Aceite de Masaje Caliente',
    categoria: 'cosmetica-masajes',
    precio: 11200,
    insignias: ['Envio Discreto'],
    tinte: ['#ffb74d', '#e65100'],
    descripcion:
      'Transforma un masaje comun en una experiencia ardiente. Este aceite caliente al contacto se desliza suave y prepara la piel para caricias que no se olvidan. Aroma delicado y sensacion reconfortante.',
    instrucciones:
      'Calentar en un bol con agua tibia (no exponer al microondas). Masajear en movimientos circulares y disfrutar de la sensacion de calor. Lavar la zona con agua y jabon despues de usar.',
    variantes: {
      Sabor: ['Vainilla', 'Jazmin', 'Coco'],
    },
  },
  {
    id: 'set-velas',
    nombre: 'Set de Velas Corporales',
    categoria: 'cosmetica-masajes',
    precio: 15600,
    insignias: ['Nuevo'],
    tinte: ['#ef9a9a', '#c62828'],
    descripcion:
      'Una vela que derrite en aceite tibio para masajes sensuales. Se prende, se deja fundir y su cera a baja temperatura se convierte en un baño de aceite que acaricia la piel. Una cita a la luz de la llama.',
    instrucciones:
      'Prender la mecha y dejar fundir unos minutos. Volcar gotas sobre la piel (tibia, no hirviendo) y masajear. Esperar a que se enfrie antes de guardar. Ideal para una velada intima.',
    variantes: {
      Color: ['Rojo', 'Violeta', 'Rosa'],
      Sabor: ['Sandalo', 'Frutilla'],
    },
  },
  {
    id: 'arnes-bdsm',
    nombre: 'Arnes de Cuerpo BDSM',
    categoria: 'bdsm',
    precio: 32900,
    insignias: ['Envio Discreto'],
    tinte: ['#444444', '#111111'],
    descripcion:
      'Un arnes de cuero sintetico que realza el cuerpo y abre la puerta a juegos de poder con estilo. Ajustable, audaz y elegante. Para quienes se atreven a explorar el control y la rendicion con confianza.',
    instrucciones:
      'Ajusta las tiras al contorno deseado sin comprimir en exceso. Utiliza siempre una palabra de seguridad acordada. Asegura un acuerdo mutuo y previo. Limpia con un panio humedo y guarda colgado.',
    variantes: {
      Talle: ['Unico ajustable'],
      Color: ['Negro', 'Rojo'],
    },
  },
  {
    id: 'kit-esposas',
    nombre: 'Kit de Esposas y Antifaz',
    categoria: 'bdsm',
    precio: 23400,
    insignias: ['Nuevo'],
    tinte: ['#616161', '#212121'],
    descripcion:
      'Para jugar con la imaginacion y la anticipacion. Esposas acolchadas comodas y un antifaz de seda que potencian la expectativa. Un combo pensado para sumar suspenso y confianza a tus juegos.',
    instrucciones:
      'Usar siempre con consentimiento y un codigo de palabra acordada. Las esposas son acolchadas y comodas, pero no apretar demasiado. Guardar en su bolsita. Limpiar con panio humedo.',
    variantes: {
      Color: ['Negro', 'Rojo'],
    },
  },
  {
    id: 'paleta-sensaciones',
    nombre: 'Paleta de Sensaciones',
    categoria: 'bdsm',
    precio: 16800,
    insignias: ['Top Ventas'],
    tinte: ['#8d6e63', '#3e2723'],
    descripcion:
      'Una paleta elegante de un lado suave y del otro texturizado, para jugar con intensidades distintas. Suma un clic de anticipacion y un toque de color a tus sesiones. Pensada para un juego consentido y sensual.',
    instrucciones:
      'Comienza con intensidad suave y aumenta segun el acuerdo. Siempre con consentimiento y comunicacion abierta. Limpia con un panio humedo despues de usar y guarda en lugar seguro.',
    variantes: {
      Color: ['Piel', 'Negro'],
    },
  },
  {
    id: 'dados-picantes',
    nombre: 'Dados Picantes para Parejas',
    categoria: 'juegos',
    precio: 9800,
    insignias: ['Nuevo'],
    tinte: ['#ff6fa5', '#b0305c'],
    descripcion:
      'Un par de dados que convierten cualquier noche en un juego de complicidad. Tirá, combiná las caras y dejá que el azar marque el ritmo de los mimos. Chiquito, liviano y perfecto para romper el hielo entre los dos.',
    instrucciones:
      'Tirá los dados y combiná la accion con la zona del cuerpo que salga. Jugalo con calma, entre risas y con el acuerdo de ambos. Guardalo en su cajita para la proxima noche de juego.',
  },
  {
    id: 'cartas-atrevidas',
    nombre: 'Cartas Atrevidas para Parejas',
    categoria: 'juegos',
    precio: 11500,
    insignias: ['Top Ventas'],
    tinte: ['#f06292', '#ad1457'],
    descripcion:
      'Un mazo de cartas con retos y preguntas pensado para conocerse mejor y subir la temperatura de a poco. Ideal para una previa distinta, sin apuro, a puro juego entre los dos.',
    instrucciones:
      'Mezclá el mazo y sacá una carta por turno. Respeten el ritmo y el limite de cada uno: la idea es jugar, no apurar nada. Guardalo en su caja despues de cada partida.',
  },
  {
    id: 'plumas-caricias',
    nombre: 'Plumas de Caricias para Parejas',
    categoria: 'juguetes-parejas',
    precio: 7200,
    insignias: [],
    tinte: ['#ffb6c9', '#d4698f'],
    descripcion:
      'Un plumero suave pensado para recorrer la piel con caricias livianas que erizan y despiertan cada sentido. Mango comodo para que el otro tenga el control del juego.',
    instrucciones:
      'Deslizalo despacio sobre la piel, variando la presion y el recorrido segun lo que mas guste. Guardalo en un lugar seco para que las plumas se mantengan impecables.',
  },
  {
    id: 'antifaz-duo',
    nombre: 'Antifaz Dúo para Parejas',
    categoria: 'juguetes-parejas',
    precio: 6400,
    insignias: ['Envio Discreto'],
    tinte: ['#e879b0', '#9c275c'],
    descripcion:
      'Un antifaz de tela suave que potencia el resto de los sentidos y suma anticipacion a cada caricia. Vienen dos, uno para cada uno, para turnarse el juego cuando quieran.',
    instrucciones:
      'Colocalo comodo sin ajustar de mas y dejá que el otro guie el momento. Usalo siempre con confianza y acuerdo mutuo. Limpialo con un panio humedo y guardalo en su bolsita.',
  },
  {
    id: 'kit-iniciacion-parejas',
    nombre: 'Kit de Iniciación para Parejas',
    categoria: 'juguetes-parejas',
    precio: 18700,
    insignias: ['Nuevo'],
    tinte: ['#ff85ab', '#a1174f'],
    descripcion:
      'Un combo pensado para animarse a explorar juntos por primera vez: un poco de juego, un poco de caricia y mucha complicidad. La forma mas facil de sumar algo nuevo a la pareja sin complicarse.',
    instrucciones:
      'Explora el kit de a poco y a su propio ritmo, hablando siempre de que les gusta y que no. Limpiá cada elemento segun su material despues de usarlo y guardalo en su estuche.',
  },
  {
    id: 'anillo-vibrador-bala-recargable',
    nombre: 'Anillo Vibrador con Bala Recargable',
    categoria: 'juguetes-anillos',
    precio: 0,
    imagen: '/products/anillo-vibrador-bala-recargable.png',
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
    imagen: '/products/bomba-vacio-pene.png',
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
    categoria: 'juguetes-anal-toys',
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
    categoria: 'juguetes-anal-toys',
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
    categoria: 'juguetes-anal-toys',
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
    categoria: 'juguetes-anal-toys',
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
    categoria: 'juguetes-anal-toys',
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
    categoria: 'juguetes-anal-toys',
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
    categoria: 'juguetes-anal-toys',
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
    categoria: 'juguetes-anal-toys',
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
    categoria: 'juguetes-anal-toys',
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
  {
    id: 'kit-vela-san-valentin',
    nombre: 'Kit San Valentín: Vela Corazón y Bullet',
    categoria: 'cosmetica-masajes',
    precio: 0,
    imagen: '/products/kit-vela-san-valentin.png',
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
    imagen: '/products/anillo-vibrador-purple-line-four.png',
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
    imagen: '/products/huevo-vibrador-luna-control-remoto.png',
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
    imagen: '/products/succionador-clitoris-luxury-succion-7.png',
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
    imagen: '/products/succionador-clitoris-luxury-succion-5.png',
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
    imagen: '/products/funda-extensora-x-tender-1.png',
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
    imagen: '/products/funda-extensora-x-tender-2.png',
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
    imagen: '/products/funda-extensora-x-tender-3.png',
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
    imagen: '/products/succionador-clitoris-ana-6.png',
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
    imagen: '/products/vibrador-punto-g-gina.png',
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
    imagen: '/products/vibrador-punto-g-frida.png',
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
    imagen: '/products/vibrador-punto-g-olivia.png',
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
    imagen: '/products/vibrador-luxury-vilma.png',
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
    imagen: '/products/vibrador-rabbit-bety.png',
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
    imagen: '/products/vibrador-rabbit-carla.png',
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
    imagen: '/products/funda-realista-negra-anilla.png',
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
    imagen: '/products/vibrador-punto-g-lola-2.png',
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
    imagen: '/products/set-3-anillos-silicona.png',
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
    imagen: '/products/dildo-ventosa-becky.png',
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
    imagen: '/products/dildo-ventosa-milo.png',
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
    imagen: '/products/dildo-ventosa-karol.png',
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
    imagen: '/products/vibrador-punto-g-vibe-black-1.png',
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
    imagen: '/products/estimulador-dedo-finger-3.png',
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
    imagen: '/products/estimulador-dedo-finger-4.png',
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
    imagen: '/products/esposas-eco-cuero-negro.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un par de esposas de cuero ecológico negro, para juegos de ataduras y sumisión.',
    instrucciones:
      'Usalas siempre con consentimiento y una palabra de seguridad acordada. No las ajustes de más. Limpiá el cuero con un paño húmedo después de cada uso.',
  },
  {
    id: 'plug-anal-cola-conejo',
    nombre: 'Plug Anal de Silicona con Cola de Conejo',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/plug-anal-cola-conejo.png',
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
    imagen: '/products/consolador-ultra-realista.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un consolador de textura ultra realista, con forma y detalles pensados para una sensación lo más parecida posible a la real.',
    instrucciones:
      'Aplicá lubricante a base de agua antes de usarlo. Lavalo con agua y jabón neutro después de cada uso y dejalo secar bien antes de guardarlo.',
  },
  {
    id: 'guante-masturbador',
    nombre: 'Guante Masturbador',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/guante-masturbador.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un guante masturbador para estimulación manual, ideal para usar solo o en pareja.',
    instrucciones:
      'Aplicá lubricante a base de agua antes de usarlo. Lavalo con agua y jabón neutro después de cada uso y dejalo secar bien.',
  },
  {
    id: 'anillo-vibrador-prostata',
    nombre: 'Anillo Vibrador para Próstata',
    categoria: 'juguetes-anillos',
    precio: 0,
    imagen: '/products/anillo-vibrador-prostata.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un anillo vibrador con estímulo para la próstata, pensado para sumar intensidad en el juego solitario o en pareja.',
    instrucciones:
      'Usalo con lubricante a base de agua y empezá por la intensidad más baja. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'masturbador-bolsillo-mitta',
    nombre: 'Masturbador de Bolsillo Mitta',
    categoria: 'juguetes-masturbadores',
    precio: 0,
    imagen: '/products/masturbador-bolsillo-mitta.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un masturbador de bolsillo para estimulación manual, pensado para usar solo y guardar sin complicaciones.',
    instrucciones:
      'Aplicá lubricante a base de agua dentro y en la entrada. Lavalo con agua tibia y jabón neutro después de cada uso y dejalo secar antes de guardarlo.',
  },
  {
    id: 'vibrador-anal',
    nombre: 'Vibrador Anal',
    categoria: 'juguetes-anal-toys',
    precio: 0,
    imagen: '/products/vibrador-anal.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador anal para estimulación interna, con vibración para sumar intensidad.',
    instrucciones:
      'Usalo siempre con abundante lubricante a base de agua y empezá por la intensidad más baja. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'vibrador-huevo-duoluxe',
    nombre: 'Vibrador Huevo DuoLuxe',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-huevo-duoluxe.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion:
      'Un vibrador en formato huevo de la línea DuoLuxe, práctico para estimulación puntual.',
    instrucciones:
      'Usalo con lubricante a base de agua, empezando por la intensidad más baja. Limpialo con agua y jabón neutro después de cada uso.',
  },
  {
    id: 'vibrador-silkyvibe',
    nombre: 'Vibrador SilkyVibe',
    categoria: 'juguetes-vibradores',
    precio: 0,
    imagen: '/products/vibrador-silkyvibe.png',
    insignias: ['Nuevo'],
    tinte: ['#DC015B', '#A80044'],
    descripcion: 'Un vibrador de la línea SilkyVibe, de tacto suave.',
    instrucciones:
      'Usalo con lubricante a base de agua, empezando por la intensidad más baja. Limpialo con agua y jabón neutro después de cada uso.',
  },
];
