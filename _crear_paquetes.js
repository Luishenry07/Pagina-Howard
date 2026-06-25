// _crear_paquetes.js
// Abre el navegador, tú inicias sesión (con doble factor si aplica),
// y el script crea los 14 paquetes automáticamente en el panel admin.
//
// Uso: node _crear_paquetes.js

const { chromium } = require('playwright');

const URL = 'https://luishenry07.github.io/Pagina-Howard/jcdetalles_landing.html';

const paquetes = [
  // ── BODAS ──────────────────────────────────────────────────────────
  {
    nombre: 'Basic I',
    servicio: 'bodas',
    descripcion:
      'Ceremonia Civil — 20 a 30 personas. ' +
      'Mesa de invitados: 5 centros con flores naturales, plato base, copas y cristalería para 30 personas, menú e individuales. ' +
      'Mesa nupcial: arreglo floral, cilindros de vidrio, candelabros y mesa de firma de madera. ' +
      'Mesa de dulce: mesitas decoradas con arreglo floral, velas y candelabros.'
  },
  {
    nombre: 'Basic II',
    servicio: 'bodas',
    descripcion:
      'Ceremonia Civil — 40 a 50 personas. ' +
      'Mesa de invitados: 7 centros con flores naturales, cristalería para 50 personas, menú e individuales. ' +
      'Mesa nupcial: arreglo floral, candelabros y mesa de firma. ' +
      'Mesa de dulce decorada. ' +
      'Área de recepción: letrero de bienvenida con arreglo floral, buzón de regalo de cristales y cilindros con velas.'
  },
  {
    nombre: 'Básico III',
    servicio: 'bodas',
    descripcion:
      'Ceremonia Civil o Religiosa — 25 a 50 personas. ' +
      'Mesa de invitados: 7 centros con flores naturales, cristalería para 50 personas, menú. ' +
      'Mesa nupcial: sillas doradas para novios, arco hexagonal o redondo con arreglo floral, letrero LED con frase de amor, candelabros. ' +
      'Mesa de dulce: arco/mamparas floral artificial, cristalería fina, 2 arreglos florales, iluminación. ' +
      'Área de recepción completa: letrero, buzón de cristales, trípode, arco o pedestal, iluminación.'
  },
  {
    nombre: 'Premium',
    servicio: 'bodas',
    descripcion:
      'Ceremonia Religiosa y Recepción. ' +
      'Área nupcial: dos sillas doradas, arco hexagonal o redondo, letrero LED, alfombra y lámparas. ' +
      'Decoración de iglesia: sillas de altar, 2 pedestales con arreglos grandes, arreglo del altar, botones para bancas. ' +
      '10 centros de mesa naturales con pedestal dorado. ' +
      'Mesa de recepción con buzón de cristales, trípode y pedestal floral. ' +
      'Mesa de dulce: arco/mamparas floral, juego de mesas, bases y cristalería fina. ' +
      'Ramo de novia, botonier del novio y copas personalizadas.'
  },
  {
    nombre: 'Todo Incluido',
    servicio: 'bodas',
    descripcion:
      'Boda completa. ' +
      'Área nupcial: sillas doradas, arco hexagonal o redondo, letrero LED, alfombra y lámparas. ' +
      'Mesa de entrada: fondo de césped con letrero, trípode, buzón de cristales, pedestal, iluminación. ' +
      '12 centros de mesa naturales con pedestal dorado. ' +
      'Candy bar: dulce de 4 niveles, 6 docenas de postres, arco/mamparas floral, cristalería fina, iluminación. ' +
      'Discoteca completa: DJ, truss, bocinas y 6 luces. ' +
      'Maquillaje y peinado. Cobertura fotográfica: filmaker, iluminación y spot fotográfico. ' +
      'Wedding Planner el día del evento, personal de protocolo y cronograma. ' +
      'Murga y hora loca.'
  },
  // ── XV AÑOS — Solo Decoración ────────────────────────────────────────
  {
    nombre: 'Económico',
    servicio: 'quinceanos',
    descripcion:
      'Solo Decoración — XV Años. ' +
      'Trono con Candy Bar: sofá blanco imperial, fondo de banner personalizado o telas, mamparas con tela y lámparas colgantes, arreglos florales artificiales, número 15 LED y tuberías LED, 2 imágenes de la temática, bases y cristalería fina, candelabros dorados, iluminación, alfombra y luces robóticas. ' +
      'Área de recepción: mesita, trípode para retrato, buzón de cristales, 2 arreglos florales, pedestal y letrero MIS XV AÑOS.'
  },
  {
    nombre: 'Básico',
    servicio: 'quinceanos',
    descripcion:
      'Solo Decoración — XV Años. ' +
      'Trono: sofá blanco imperial, fondo personalizado o telas, mamparas con lámparas, 2 cuadros con fotos de la quinceañera, 8 arreglos florales artificiales, mesita de noche con detalles florales, número 15 LED, 2 impresiones en foamboard, iluminación y luces robóticas. ' +
      'Mesa de entrada: mesita, trípode, buzón, pedestal, fondo de césped con letrero MIS XV AÑOS, iluminación. ' +
      'Candy bar: arco/mamparas con tela y LED, bases y cristalería fina, candelabros, 3 arreglos florales grandes, 2 foamboards, iluminación. ' +
      '12 centros de mesa naturales con pedestal dorado.'
  },
  {
    nombre: 'Intermedio',
    servicio: 'quinceanos',
    descripcion:
      'Solo Decoración — XV Años. ' +
      'Trono: sofá Blanco Luxury, mesita de noche, fondo de banner con arco decorativo de foam o flores, mamparas con lámparas, 6 arreglos florales artificiales, candelabros, 2 imágenes de escultura en foam grandes de la temática, iluminación y luces robóticas. ' +
      'Mesa de entrada: mesita, trípode, buzón, 2 mamparas con imagen de la quinceañera, fondo de rosas con letrero MIS XV AÑOS, número XV LED. ' +
      'Candy bar: columna con arco floral, juego de mesas doradas, 2 esculturas foam, cristalería fina dorada, 2 mamparas con telas y LED, 4 arreglos florales grandes, 2 cuadros fotográficos. ' +
      '12 centros de mesa naturales. Entrada: arco dorado o de flores, imagen en foamboard, letrero de bienvenida y alfombra roja.'
  },
  {
    nombre: 'Gold',
    servicio: 'quinceanos',
    descripcion:
      'Solo Decoración — XV Años. ' +
      'Trono: sofá Blanco Luxury, mesita de noche, fondo de banner/tela con arco temático, estructura con letrero temático, mamparas con imagen y arreglo floral, 4 esculturas grandes de la temática, rótulo de piso y alfombra roja, iluminación y luces robóticas. ' +
      'Mesa de entrada dorada: mesita dorada, trípode, buzón, 2 mamparas con tela y lámparas, mamparas con imagen en foamboard y arreglos florales, número XV LED. ' +
      'Candy bar: mesa dorada grande, 2 mesas rectangulares rotuladas de la temática, bases y cristalería fina, candelabros, 4 esculturas de la temática, 2 mamparas con imagen, arco con nombre, 4 arreglos florales grandes, iluminación. ' +
      '15 centros de mesa naturales. Entrada: arco decorado con letrero gigante de bienvenida, 2 esculturas gigantes, alfombra roja con pasafilas.'
  },
  // ── XV AÑOS — Todo Incluido ──────────────────────────────────────────
  {
    nombre: 'Básico Todo Incluido',
    servicio: 'quinceanos',
    descripcion:
      'Todo Incluido — XV Años. ' +
      'Trono: sofá blanco imperial, fondo personalizado o telas, mamparas, 2 cuadros fotográficos, 8 arreglos florales artificiales, número 15 LED, 2 foamboards, iluminación y luces robóticas. ' +
      'Mesa de entrada con fondo de césped y letrero MIS XV AÑOS. ' +
      'Candy bar completo: dulce de 4 niveles personalizado, 3 docenas de postres, 3 docenas de golosinas, 6 docenas de suvenires personalizados, arco/mamparas floral con LED, bases y cristalería fina, candelabros, 3 arreglos grandes, 2 foamboards, iluminación. ' +
      '12 centros de mesa naturales. Discoteca: DJ, truss, 2 bocinas medianas, 2 bocinas de bajos, 6 luces, micrófono. ' +
      'Maquillaje y peinado (prueba gratis). Fotografía y video: cobertura 5 horas, filmaker, iluminación y spot fotográfico. ' +
      'Murga y vestido de carnaval.'
  },
  {
    nombre: 'Gold Todo Incluido',
    servicio: 'quinceanos',
    descripcion:
      'Todo Incluido Premium — XV Años. ' +
      'Trono: sofá Blanco Luxury, mesita de noche, fondo de banner/tela con arco temático, estructura con letrero, mamparas con imagen y arreglo floral, 4 esculturas grandes de la temática, rótulo de piso y alfombra roja, iluminación y luces robóticas. ' +
      'Candy bar premium: dulce de 6 niveles, 6 docenas de postres, 6 docenas de golosinas, 10 docenas de suvenires variados, mesa dorada grande, 2 mesas rectangulares rotuladas, cristalería fina, candelabros, 4 esculturas de la temática, 2 mamparas con imagen, arco con nombre en grande, 4 arreglos florales grandes, iluminación. ' +
      'Mesa de entrada dorada: mesita, trípode, buzón, 2 mamparas con tela y lámparas, mamparas con imagen en foamboard, número XV LED. ' +
      '15 centros de mesa naturales. Entrada: arco decorado, letrero gigante de bienvenida, 2 esculturas gigantes, alfombra roja con pasafilas. ' +
      'Discoteca: DJ, truss, bocinas, 12 luces, 2 pantallas, micrófono. ' +
      'Maquillaje y peinado (prueba gratis). Fotografía y video: cobertura 5 horas, filmaker y spot fotográfico. ' +
      'Murga y vestido de carnaval.'
  },
  // ── FIESTAS — PROM 2026 ──────────────────────────────────────────────
  {
    nombre: 'Prom Basic',
    servicio: 'fiestas',
    descripcion:
      'Paquete para Graduaciones — PROM. ' +
      'Decoración de tarima: estructura truss con letrero temático y luces automatizadas, decoración según temática, rótulo de piso, iluminación profesional y luces robóticas. ' +
      'Candy bar premium: 4 docenas de postres, 4 docenas de golosinas, 10 docenas de souvenirs personalizados, mesa principal y mesas auxiliares, cristalería fina, candelabros, mamparas, arco y arreglos florales. ' +
      'Mesa de bienvenida: arco de entrada, mesa de recepción, arreglos florales, mamparas iluminadas y letrero LED PROM 2026. ' +
      '10 centros de mesa altos con flores artificiales y pedestales dorados. ' +
      'Fotografía y video: 3 horas, filmaker, iluminación y spot fotográfico. ' +
      'Entretenimiento: Photobooth 360° por 2 horas y Glitter Bar por 2 horas. Murga o batucada y protocolo de cortesía.'
  },
  {
    nombre: 'Prom Platinum',
    servicio: 'fiestas',
    descripcion:
      'Paquete Platinum para Graduaciones — PROM. ' +
      'Decoración de tarima: fondo personalizado, estructura truss con letrero e iluminación automatizada, 2 esculturas gigantes de la temática, rótulo de piso, luces robóticas. ' +
      'Candy bar premium: 6 docenas de postres, 6 docenas de golosinas, 10 docenas de souvenirs, mesa principal dorada y mesas auxiliares, cristalería fina, esculturas gigantes, mamparas, arco y arreglos florales. ' +
      'Mesa de bienvenida con letrero de nombres por estudiante, arreglos florales, mamparas iluminadas y letrero LED PROM 2026. ' +
      '15 centros de mesa altos con flores artificiales y numeración. Entrada principal: arco decorado y 1 escultura gigante. ' +
      'Discoteca profesional: DJ, booth, sistema de sonido completo, 12 luces, truss, micrófono inalámbrico y 2 pantallas. ' +
      'Fotografía y video: 3 horas, filmaker profesional, iluminación y spot fotográfico. ' +
      'Entretenimiento: chispas frías, Photobooth 360°, Glitter Bar, maquillaje glitter con artista especializado, tatuajes temporales y pintura neón. ' +
      'Coordinación y producción integral. Murga o batucada y protocolo.'
  },
  {
    nombre: 'Prom Gold',
    servicio: 'fiestas',
    descripcion:
      'Paquete Gold para Graduaciones — PROM. ' +
      'Decoración de tarima: fondo personalizado, estructura truss con letrero e iluminación automatizada, 4 esculturas gigantes de la temática, rótulo de piso o pista iluminada, iluminación arquitectónica y luces robóticas profesionales. ' +
      'Candy bar premium: 6 docenas de postres, 6 docenas de golosinas, 10 docenas de souvenirs, mesa dorada grande y mesas auxiliares, cristalería fina, esculturas gigantes, mamparas, arco decorado y arreglos florales. ' +
      'Mesa de bienvenida con letrero de ubicación por estudiante, arreglos florales, mamparas iluminadas y letrero LED PROM 2026. ' +
      '20 centros de mesa altos con flores artificiales y numeración. Entrada principal: arco decorado, letrero gigante de bienvenida y arreglos florales. ' +
      'Discoteca profesional: DJ, booth, sistema de sonido completo, 12 luces, truss, micrófono inalámbrico y 2 pantallas LED. ' +
      'Fotografía y video: 5 horas, filmaker profesional, iluminación y spot fotográfico. ' +
      'Entretenimiento: chispas frías, Photobooth 360°, Glitter Bar, maquillaje glitter con artista especializado, tatuajes temporales y pintura neón. ' +
      'Coordinación y producción integral. Murga o batucada y protocolo.'
  }
];

const SERVICIOS = {
  bodas: 'Bodas',
  quinceanos: 'XV Años',
  fiestas: 'Fiestas & Celebraciones'
};

(async () => {
  console.log('Abriendo navegador — inicia sesión cuando aparezca la página...');
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();
  page.setDefaultTimeout(120000); // 2 minutos para que puedas completar el doble factor

  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000); // dar tiempo a Firebase para inicializarse

  // Abrir el modal de login automáticamente
  await page.click('#admin-trigger');
  await page.waitForSelector('#admin-overlay.open', { state: 'visible' });

  console.log('✓ Modal de login abierto en el navegador.');
  console.log('  → Ingresa tu correo y contraseña (y completa el doble factor si aplica).');
  console.log('  → El script continuará automáticamente cuando estés logueado.\n');

  // Esperar hasta 10 minutos para que el usuario complete el login + 2FA
  await page.waitForSelector('.admin-bar', { state: 'visible', timeout: 600000 });
  console.log('✓ Sesión iniciada. Comenzando a crear paquetes...\n');

  let creados = 0;

  for (const p of paquetes) {
    process.stdout.write(`  Creando [${SERVICIOS[p.servicio]}] "${p.nombre}"... `);

    // Abrir panel de paquetes
    await page.click('#admin-paquetes-btn');
    await page.waitForSelector('#paquetes-overlay.open', { state: 'visible' });

    // Llenar formulario
    await page.fill('#pkg-nombre', p.nombre);
    await page.fill('#pkg-desc', p.descripcion);
    await page.selectOption('#pkg-servicio', p.servicio);
    await page.fill('#pkg-precio', '0');

    // Guardar
    await page.click('#pkg-form-save');

    // Esperar confirmación: el nombre aparece en la lista
    await page.waitForFunction(
      nombre => document.querySelector('#paquetes-list')?.textContent?.includes(nombre),
      p.nombre,
      { timeout: 15000 }
    );

    // Cerrar panel para el siguiente ciclo
    await page.click('#paquetes-close');
    await page.waitForSelector('#paquetes-overlay', { state: 'hidden' });

    creados++;
    console.log(`✓`);
  }

  console.log(`\n✅ ${creados} paquetes creados correctamente.`);
  console.log('Puedes cerrar el navegador o revisarlo antes de cerrarlo.');

  await page.waitForTimeout(5000);
  await browser.close();
})();
