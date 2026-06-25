// Prueba automatizada: crear paquete desde admin y verificar que aparece en el acordeón
// Uso: node _test_paquetes.js
// Requiere: $env:ADMIN_EMAIL y $env:ADMIN_PASS definidos en el entorno

const { chromium } = require('playwright');

const URL      = 'https://luishenry07.github.io/Pagina-Howard/jcdetalles_landing.html';
const EMAIL    = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASS;
const TEST_PKG = { nombre: 'Paquete TEST-AUTO', desc: 'Prueba automática — eliminar', servicio: 'bodas', precio: '999' };

if (!EMAIL || !PASSWORD) {
  console.error('ERROR: Define ADMIN_EMAIL y ADMIN_PASS como variables de entorno.');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const page    = await browser.newPage();
  page.setDefaultTimeout(20000);

  const ok  = (msg) => console.log('  ✓', msg);
  const err = (msg) => console.error('  ✗', msg);

  try {
    // 1. Abrir la página
    console.log('\n[1] Abriendo página...');
    await page.goto(URL, { waitUntil: 'networkidle' });
    ok('Página cargada');

    // 2. Abrir modal de admin
    console.log('\n[2] Abriendo panel admin...');
    await page.click('#admin-trigger');
    await page.waitForSelector('#admin-overlay.open', { state: 'visible' });
    ok('Modal de login visible');

    // 3. Iniciar sesión
    console.log('\n[3] Iniciando sesión...');
    await page.fill('#admin-email', EMAIL);
    await page.fill('#admin-password', PASSWORD);
    await page.click('#admin-login-btn');
    await page.waitForSelector('.admin-bar', { state: 'visible' });
    ok('Sesión iniciada — barra admin visible');

    // 4. Abrir panel de paquetes
    console.log('\n[4] Abriendo panel de paquetes...');
    await page.click('button[onclick="openPaquetesModal()"]');
    await page.waitForSelector('#paquetes-overlay.open', { state: 'visible' });
    ok('Panel de paquetes abierto');

    // 5. Crear paquete de prueba
    console.log('\n[5] Creando paquete de prueba...');
    await page.fill('#pkg-nombre', TEST_PKG.nombre);
    await page.fill('#pkg-desc',   TEST_PKG.desc);
    await page.selectOption('#pkg-servicio', TEST_PKG.servicio);
    await page.fill('#pkg-precio', TEST_PKG.precio);
    ok('Campos llenados: nombre, descripción, servicio=bodas, precio=999');

    await page.click('#pkg-form-save');
    await page.waitForFunction(
      (nombre) => document.querySelector('#paquetes-list')?.textContent?.includes(nombre),
      TEST_PKG.nombre
    );
    ok('Paquete guardado y visible en la lista del admin');

    // Verificar que muestra la etiqueta de servicio en la tarjeta admin
    const servicioEnCard = await page.locator('.pkg-card-service').first().textContent();
    if (servicioEnCard.includes('Bodas')) {
      ok(`Etiqueta de servicio correcta en tarjeta admin: "${servicioEnCard.trim()}"`);
    } else {
      err(`Etiqueta de servicio incorrecta: "${servicioEnCard.trim()}"`);
    }

    // 6. Cerrar panel y verificar en acordeón
    console.log('\n[6] Verificando en acordeón de servicios...');
    await page.click('#paquetes-close');
    await page.waitForSelector('#paquetes-overlay', { state: 'hidden' });

    // Esperar que renderPaquetesEnAcordeon inyecte la tarjeta
    await page.waitForFunction(
      (nombre) => {
        const body = document.querySelector('.acc-body[data-servicio="bodas"]');
        return body && body.textContent.includes(nombre);
      },
      TEST_PKG.nombre
    );
    ok('Paquete aparece en el acordeón de Bodas para clientes');

    // Verificar precio visible
    const precioEnAcordeon = await page.locator('.acc-body[data-servicio="bodas"] .acc-paq-precio').first().textContent();
    ok(`Precio en acordeón: "${precioEnAcordeon.trim()}"`);

    // Verificar botón de WhatsApp
    const waHref = await page.locator('.acc-body[data-servicio="bodas"] .acc-paquete').first().getAttribute('href');
    if (waHref && waHref.includes('wa.me') && waHref.includes(encodeURIComponent(TEST_PKG.nombre))) {
      ok('Enlace de WhatsApp contiene el nombre del paquete');
    } else {
      err(`Enlace de WhatsApp inesperado: ${waHref}`);
    }

    // 7. Eliminar paquete de prueba
    console.log('\n[7] Limpiando — eliminando paquete de prueba...');
    await page.click('button[onclick="openPaquetesModal()"]');
    await page.waitForSelector('#paquetes-overlay.open', { state: 'visible' });

    const deleteBtn = page.locator(`.pkg-del-btn`).filter({ hasText: /Eliminar/ }).first();
    await deleteBtn.click();

    await page.waitForFunction(
      (nombre) => !document.querySelector('#paquetes-list')?.textContent?.includes(nombre),
      TEST_PKG.nombre
    );
    ok('Paquete de prueba eliminado');

    console.log('\n✅ TODAS LAS PRUEBAS PASARON\n');

  } catch (e) {
    err('Prueba fallida: ' + e.message);
    console.error(e);
    process.exitCode = 1;
  } finally {
    await page.waitForTimeout(2000);
    await browser.close();
  }
})();
