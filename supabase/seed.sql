-- ============================================================
--  Maktub Accesorios · datos de ejemplo (opcional)
--  Ejecutá este archivo después de schema.sql si querés ver la tienda
--  con contenido mientras cargás tus productos reales.
-- ============================================================

insert into public.products
  (id, slug, name, description, price, compare_at_price, category, images, stock, featured, active, materials, created_at)
values
  (
    '11111111-1111-4111-8111-111111111101',
    'collar-luna-de-turquesa',
    'Collar Luna de Turquesa',
    'Un dije de luna con una piedra de turquesa natural, pensado para acompañar todos los días. Cadena dorada de acero inoxidable con baño de oro, liviana y resistente al agua.',
    32900, 38900, 'collares', array['/productos/collar-luna.jpg'], 2, true, true,
    'Turquesa natural · Acero inoxidable con baño de oro', now() - interval '2 days'
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'collar-perlas-de-rio',
    'Collar Perlas de Río',
    'Perlas de río de formas irregulares, únicas como quien las usa. Una pieza delicada que combina con todo y se lleva sola.',
    28500, null, 'collares', array['/productos/collar-perlas.jpg'], 3, false, true,
    'Perlas de río cultivadas · Cierre de plata 925', now() - interval '8 days'
  ),
  (
    '11111111-1111-4111-8111-111111111103',
    'collar-capas-de-cristal',
    'Collar Capas de Cristal',
    'Tres cadenas superpuestas con pequeños dijes de cristal y cuarzo. Ideal para sumar textura a un look simple, sin esfuerzo.',
    26900, null, 'collares', array['/productos/collar-capas.jpg'], 2, true, true,
    'Cuarzo natural · Acero inoxidable dorado', now() - interval '1 day'
  ),
  (
    '11111111-1111-4111-8111-111111111104',
    'collar-dije-de-cuarzo',
    'Collar Dije de Cuarzo',
    'Un dije mínimo con una gota de cuarzo blanco. Para regalar(te) un poco de calma en medio de la rutina.',
    24900, 29900, 'collares', array['/productos/collar-dije.jpg'], 4, false, true,
    'Cuarzo blanco · Cadena de acero dorado', now() - interval '15 days'
  ),
  (
    '11111111-1111-4111-8111-111111111105',
    'combito-maktub',
    'Combito Maktub',
    'Nuestro combo favorito: collar de perlas finas + aros pequeños a juego. Dos piezas que se potencian y llegan en un estuche de regalo.',
    38900, 45000, 'combitos', array['/productos/combito.jpg'], 2, true, true,
    'Perlas cultivadas · Acero inoxidable con baño de oro', now() - interval '4 days'
  ),
  (
    '11111111-1111-4111-8111-111111111106',
    'pulsera-eslabones',
    'Pulsera Eslabones',
    'Eslabones redondeados y un cierre simple: la pulsera que no te querés sacar. Perfecta para usar sola o combinar con otras.',
    21900, null, 'pulseras', array['/productos/pulsera-eslabones.jpg'], 5, false, true,
    'Acero inoxidable con baño de oro', now() - interval '20 days'
  ),
  (
    '11111111-1111-4111-8111-111111111107',
    'pulsera-tejida',
    'Pulsera Tejida',
    'Trama fina y textura suave para acompañar la muñeca todo el día. Resistente al agua y a los planes improvisados.',
    19500, 23900, 'pulseras', array['/productos/pulsera-tejida.jpg'], 4, false, true,
    'Acero inoxidable dorado · Cierre ajustable', now() - interval '12 days'
  ),
  (
    '11111111-1111-4111-8111-111111111108',
    'pulsera-duo-de-hilos',
    'Pulsera Dúo de Hilos',
    'Dos pulseras finas para regalar una y quedarte la otra. Un detalle simple para compartir con alguien especial.',
    17900, null, 'pulseras', array['/productos/pulsera-duo.jpg'], 6, true, true,
    'Hilo encerado · Dijes de acero dorado', now() - interval '3 days'
  ),
  (
    '11111111-1111-4111-8111-111111111109',
    'aros-cristal-de-agua',
    'Aros Cristal de Agua',
    'Cristales azules que atrapan la luz. Livianos, cómodos y con ese azul que ilumina cualquier outfit.',
    18900, null, 'aritos', array['/productos/aros-cristal.jpg'], 3, true, true,
    'Cristal facetado · Plata 925', now() - interval '1 day'
  ),
  (
    '11111111-1111-4111-8111-111111111110',
    'aros-corazon-de-cristal',
    'Aros Corazón de Cristal',
    'Un corazón pequeño en cristal azul para llevar cerca. La dosis justa de color y dulzura.',
    16900, 20900, 'aritos', array['/productos/aros-corazon.jpg'], 4, false, true,
    'Cristal · Acero inoxidable con baño de oro', now() - interval '18 days'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'anillo-jade',
    'Anillo Jade',
    'Una piedra de jade verde profundo en un anillo minimalista. Amuleto chiquito para usar todos los días.',
    22900, null, 'mimos', array['/productos/anillo-jade.jpg'], 2, false, true,
    'Jade natural · Plata 925', now() - interval '25 days'
  ),
  (
    '11111111-1111-4111-8111-111111111112',
    'anillo-duo-de-piedras',
    'Anillo Dúo de Piedras',
    'Dos piedras naturales en un mismo anillo, cada una con su propia energía. Una pieza artesanal para regalar o regalarte.',
    27900, null, 'mimos', array['/productos/anillo-duo.jpg'], 3, true, true,
    'Piedras naturales · Plata 925', now() - interval '5 days'
  ),
  (
    '11111111-1111-4111-8111-111111111113',
    'anillo-brillo',
    'Anillo Brillo',
    'Un clásico con brillo para esos días en los que querés un poco más. Pieza única, lista para regalar.',
    25900, null, 'mimos', array['/productos/anillo-brillo.jpg'], 0, false, true,
    'Circonias · Plata 925', now() - interval '30 days'
  )
on conflict (id) do nothing;

insert into public.events
  (id, title, description, starts_at, location, address, maps_url, image, published, created_at)
values
  (
    '22222222-2222-4222-8222-222222222201',
    'Feria de Diseño en Palermo',
    'Vamos a estar con nuestro stand llevando lo último de la colección. Pasá a conocer las piedras, probarte las piezas y charlar un rato con nosotras.',
    date_trunc('day', now()) + interval '18 days 18 hours',
    'Plaza Serrano',
    'Serrano y Honduras, Palermo, CABA',
    'https://maps.google.com/?q=Plaza+Serrano+Palermo+Buenos+Aires',
    '/eventos/feria-diseno.jpg', true, now() - interval '6 days'
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    'Mercado de Autor',
    'Un domingo de diseño, música y piezas hechas a mano. Nos encontrás en el patio central con todos los combitos y novedades.',
    date_trunc('day', now()) + interval '44 days 14 hours',
    'Museo de Arte Decorativo',
    'Av. del Libertador 1902, Recoleta, CABA',
    'https://maps.google.com/?q=Museo+Nacional+de+Arte+Decorativo',
    '/eventos/mercado-autor.jpg', true, now() - interval '2 days'
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    'Pop-up de primavera',
    'Nuestro primer pop-up del año. Tres días de accesorios, regalos y muchas historias. Gracias a cada persona que pasó a saludar.',
    date_trunc('day', now()) - interval '24 days' + interval '17 hours',
    'Estudio Maktub',
    'Villa Crespo, CABA',
    null,
    '/eventos/popup.jpg', true, now() - interval '40 days'
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    'Encuentro de emprendedoras',
    'Compartimos una tarde con otras marcas hechas a mano. Llevamos nuestras piedras, nuestros procesos y las piezas favoritas de la comunidad.',
    date_trunc('day', now()) - interval '62 days' + interval '19 hours',
    'Mercado de Autor',
    'Palermo, CABA',
    null,
    '/eventos/encuentro.jpg', true, now() - interval '80 days'
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    'Feria de regalos',
    'Cerramos el año con una feria dedicada a los regalos. Cada pieza salió envuelta con nuestra etiqueta y una piedra elegida con intención.',
    date_trunc('day', now()) - interval '130 days' + interval '15 hours',
    'Mercado de Diseño',
    'San Telmo, CABA',
    null,
    '/eventos/regalos.jpg', true, now() - interval '150 days'
  )
on conflict (id) do nothing;
