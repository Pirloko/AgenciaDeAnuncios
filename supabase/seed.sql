-- ============================================================
--  SEED — datos iniciales (Skokka + sitios "pronto")
--  Ejecutá DESPUÉS de schema.sql
-- ============================================================

-- Sitio principal
insert into sitios (slug, nombre, dominio, desde, slogan, color, accent, disponible, descripcion, faq, orden)
values (
  'skokka', 'skokka', 'skokka.com', 2015, 'Nuestros anuncios venden', '#E5167B', '#2E9BE5', true,
  '["El aviso destacado en Skokka funciona por subidas y horarios. Una subida es cada vez que tu aviso vuelve a los primeros lugares del listado. Mientras más subidas, más veces aparece arriba durante el día.","Los horarios son las franjas en que querés que el aviso se vea destacado: podés elegir de 1 a 6 franjas diurnas (06:00 a 00:00). El valor diurno es por horario y se multiplica por la cantidad de franjas. La madrugada (00:00 a 06:00) tiene un valor propio."]'::jsonb,
  '[{"q":"¿Cómo funciona un aviso destacado en Skokka?","a":"Tu aviso se muestra en los primeros lugares del listado. Elegís cuántas veces sube al día (subidas), en qué horarios y por cuántos días. Mientras más subidas y horarios, más visibilidad."},{"q":"¿Qué significan las «subidas»?","a":"Una subida es cada vez que tu aviso vuelve automáticamente a los primeros puestos durante el día. Podés elegir 3 o 6 subidas diarias."},{"q":"¿Qué diferencia hay entre TOP, Súper Top y Top All in One?","a":"TOP aparece en los primeros lugares. Súper Top tiene más prioridad de posición. Top All in One es lo máximo: sale en Súper Top, con fondo de color y etiqueta «Novedad»."},{"q":"¿Cuánto cuesta destacar un aviso en Skokka?","a":"Depende de la modalidad (día o madrugada), los días, las subidas, el nivel y la cantidad de horarios. En el cotizador ves el precio exacto en segundos."},{"q":"¿Puedo destacar mi aviso en la madrugada?","a":"Sí. La franja de madrugada (00:00 a 06:00) tiene un valor plano propio, con 6 subidas incluidas."}]'::jsonb,
  1
)
on conflict (slug) do nothing;

-- Sitios "pronto" (se ven en el home, deshabilitados)
insert into sitios (slug, nombre, dominio, color, disponible, orden) values
  ('locanto',      'Locanto',       'locanto.cl',         '#f0901e', false, 3),
  ('simpleescort', 'SimpleEscorts', 'simpleescorts.com',  '#6c5ce7', false, 4)
on conflict (slug) do nothing;

-- Chimbis (activo)
insert into sitios (slug, nombre, dominio, desde, slogan, color, accent, disponible, descripcion, faq, orden)
values (
  'chimbis', 'Chimbis', 'chimbis.com', 2010, 'Anuncios que llegan', '#13b8a6', '#0d9488', true,
  '["En Chimbis los avisos destacados funcionan por zona (Santiago/RM u otras ciudades), días, subidas y plan (TOP, Destacado e Historias).","Solo se publican avisos con fotos 100% reales comprobables. También podés subir videos."]'::jsonb,
  '[{"q":"¿Cómo funciona un aviso destacado en Chimbis?","a":"Elegís si publicás en Santiago/Región Metropolitana u otra ciudad del norte o sur de Chile. Luego definís los días, las subidas y el plan: TOP, TOP + Destacado, TOP + Historias o la combinación completa."},{"q":"¿Qué significan las «subidas» en Chimbis?","a":"Cada subida es una vez que tu aviso vuelve a los primeros puestos del listado durante el período contratado."},{"q":"¿Qué diferencia hay entre TOP, Destacado e Historias?","a":"TOP te lleva a los primeros lugares. Destacado agrega mayor visibilidad. Historias incluye publicación en historias."},{"q":"¿Puedo subir fotos y videos?","a":"Sí. Solo se aceptan fotos 100% reales comprobables. También podés subir videos."},{"q":"¿Los precios son distintos en Santiago y en otras ciudades?","a":"Sí. Santiago/RM y las demás ciudades tienen tablas de precios diferentes."}]'::jsonb,
  2
)
on conflict (slug) do update set
  nombre = excluded.nombre,
  dominio = excluded.dominio,
  desde = excluded.desde,
  slogan = excluded.slogan,
  color = excluded.color,
  accent = excluded.accent,
  disponible = excluded.disponible,
  descripcion = excluded.descripcion,
  faq = excluded.faq,
  orden = excluded.orden;

-- Niveles de Skokka
insert into niveles (sitio_slug, id, nombre, beneficio, orden) values
  ('skokka','TOP','TOP','Aparece en los primeros lugares.',0),
  ('skokka','SUPER TOP','Súper Top','Más arriba y con más prioridad que TOP.',1),
  ('skokka','TOP ALL IN ONE','Top All in One','Lo máximo: fondo de color, etiqueta «Novedad» y sale en Súper Top.',2)
on conflict do nothing;

-- Horarios de Skokka
insert into horarios (sitio_slug, idx, etiqueta) values
  ('skokka',0,'06–09'),('skokka',1,'09–12'),('skokka',2,'12–15'),
  ('skokka',3,'15–18'),('skokka',4,'18–21'),('skokka',5,'21–00')
on conflict do nothing;

-- Precios DIURNO (valor por horario)
insert into precios (sitio_slug, modalidad, subidas, dias, nivel, precio) values
  ('skokka','diurno',3,1,'TOP',3000),('skokka','diurno',3,1,'SUPER TOP',4000),('skokka','diurno',3,1,'TOP ALL IN ONE',5000),
  ('skokka','diurno',6,1,'TOP',4000),('skokka','diurno',6,1,'SUPER TOP',5000),('skokka','diurno',6,1,'TOP ALL IN ONE',6000),
  ('skokka','diurno',3,3,'TOP',5000),('skokka','diurno',3,3,'SUPER TOP',7000),('skokka','diurno',3,3,'TOP ALL IN ONE',8500),
  ('skokka','diurno',6,3,'TOP',6000),('skokka','diurno',6,3,'SUPER TOP',8000),('skokka','diurno',6,3,'TOP ALL IN ONE',10000),
  ('skokka','diurno',3,7,'TOP',8000),('skokka','diurno',3,7,'SUPER TOP',11500),('skokka','diurno',3,7,'TOP ALL IN ONE',15500),
  ('skokka','diurno',6,7,'TOP',10000),('skokka','diurno',6,7,'SUPER TOP',14000),('skokka','diurno',6,7,'TOP ALL IN ONE',18500)
on conflict do nothing;

-- Precios MADRUGADA (valor plano, 6 subidas)
insert into precios (sitio_slug, modalidad, subidas, dias, nivel, precio) values
  ('skokka','madrugada',6,1,'TOP',3500),('skokka','madrugada',6,1,'SUPER TOP',4500),('skokka','madrugada',6,1,'TOP ALL IN ONE',5500),
  ('skokka','madrugada',6,3,'TOP',5500),('skokka','madrugada',6,3,'SUPER TOP',6500),('skokka','madrugada',6,3,'TOP ALL IN ONE',8500),
  ('skokka','madrugada',6,7,'TOP',9000),('skokka','madrugada',6,7,'SUPER TOP',12000),('skokka','madrugada',6,7,'TOP ALL IN ONE',15000)
on conflict do nothing;

-- Niveles de Chimbis
insert into niveles (sitio_slug, id, nombre, beneficio, orden) values
  ('chimbis','TOP','TOP','Aparece en los primeros lugares.',0),
  ('chimbis','SUPER TOP','Súper Top','Más arriba y con más prioridad que TOP.',1),
  ('chimbis','TOP ALL IN ONE','Top All in One','Lo máximo: fondo de color, etiqueta «Novedad» y sale en Súper Top.',2)
on conflict do nothing;

-- Horarios de Chimbis
insert into horarios (sitio_slug, idx, etiqueta) values
  ('chimbis',0,'06–09'),('chimbis',1,'09–12'),('chimbis',2,'12–15'),
  ('chimbis',3,'15–18'),('chimbis',4,'18–21'),('chimbis',5,'21–00')
on conflict do nothing;

-- Precios DIURNO Chimbis (valor por horario)
insert into precios (sitio_slug, modalidad, subidas, dias, nivel, precio) values
  ('chimbis','diurno',3,1,'TOP',3000),('chimbis','diurno',3,1,'SUPER TOP',4000),('chimbis','diurno',3,1,'TOP ALL IN ONE',5000),
  ('chimbis','diurno',6,1,'TOP',4000),('chimbis','diurno',6,1,'SUPER TOP',5000),('chimbis','diurno',6,1,'TOP ALL IN ONE',6000),
  ('chimbis','diurno',3,3,'TOP',5000),('chimbis','diurno',3,3,'SUPER TOP',7000),('chimbis','diurno',3,3,'TOP ALL IN ONE',8500),
  ('chimbis','diurno',6,3,'TOP',6000),('chimbis','diurno',6,3,'SUPER TOP',8000),('chimbis','diurno',6,3,'TOP ALL IN ONE',10000),
  ('chimbis','diurno',3,7,'TOP',8000),('chimbis','diurno',3,7,'SUPER TOP',11500),('chimbis','diurno',3,7,'TOP ALL IN ONE',15500),
  ('chimbis','diurno',6,7,'TOP',10000),('chimbis','diurno',6,7,'SUPER TOP',14000),('chimbis','diurno',6,7,'TOP ALL IN ONE',18500)
on conflict do nothing;

-- Precios MADRUGADA Chimbis (valor plano, 6 subidas)
insert into precios (sitio_slug, modalidad, subidas, dias, nivel, precio) values
  ('chimbis','madrugada',6,1,'TOP',3500),('chimbis','madrugada',6,1,'SUPER TOP',4500),('chimbis','madrugada',6,1,'TOP ALL IN ONE',5500),
  ('chimbis','madrugada',6,3,'TOP',5500),('chimbis','madrugada',6,3,'SUPER TOP',6500),('chimbis','madrugada',6,3,'TOP ALL IN ONE',8500),
  ('chimbis','madrugada',6,7,'TOP',9000),('chimbis','madrugada',6,7,'SUPER TOP',12000),('chimbis','madrugada',6,7,'TOP ALL IN ONE',15000)
on conflict do nothing;
