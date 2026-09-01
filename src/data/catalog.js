// Catalogo demo de Intenso Tandil.
// Cada producto tiene: id, nombre, categoria, precio ARS, imagen (gradiente),
// insignias, descripcion, instrucciones, variantes y color para placeholder.

export const CATEGORY_TINT = {
  juguetes: ['#DC015B', '#A80044'],
  lenceria: ['#D63384', '#8e0f58'],
  lubricantes: ['#f5426b', '#c2185b'],
  parejas: ['#e5477a', '#a11245'],
  bdsm: ['#3a3a3a', '#141414'],
};

export const CATALOG = [
  {
    id: 'vibrador-punto-g',
    nombre: 'Vibrador Punto G Curvo',
    categoria: 'juguetes',
    precio: 38500,
    insignias: ['Top Ventas', 'Envio Discreto'],
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
    categoria: 'parejas',
    precio: 21500,
    insignias: ['Top Ventas'],
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
    categoria: 'parejas',
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
    categoria: 'lenceria',
    precio: 24800,
    insignias: ['Top Ventas', 'Envio Discreto'],
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
    categoria: 'lenceria',
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
    categoria: 'lubricantes',
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
    categoria: 'lubricantes',
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
];
