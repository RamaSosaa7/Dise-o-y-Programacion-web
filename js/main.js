/* ==========================================
   ÓRBITA RECORDS — JavaScript principal
   ========================================== */

/* ======= CURSOR PERSONALIZADO ======= */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();


/* ======= DISCO VINILO — P5.js ======= */
const discoContainer = document.getElementById('disco-canvas').parentElement;

new p5(function(p) {
  let angle = 0;
  let isHovered = false;
  let currentX, currentY;
  let img; 

  let maskGraphics; // Nueva variable

  p.preload = function() {
    // Asegúrate de que el nombre coincida con tu archivo
    img = p.loadImage('imgs/disco.jpg'); 
  };

  p.setup = function() {
    const placeholder = document.getElementById('disco-canvas');
    if (placeholder) placeholder.remove();

    let cnv = p.createCanvas(380, 380);
    cnv.parent(discoContainer);
    
    currentX = p.width / 2;
    currentY = p.height / 2;

    // --- AQUÍ PODRÁS CARGAR TU IMAGEN ---
    // Cuando tengas el archivo (ej: portada.jpg), descomenta la línea de abajo:
    img = p.loadImage('imgs/disco.jpg'); 

    cnv.mouseOver(() => isHovered = true);
    cnv.mouseOut(() => isHovered = false);
 maskGraphics = p.createGraphics(110, 110);
  maskGraphics.circle(55, 55, 110); // Dibujamos el círculo que servirá de recorte
};

p.draw = function() {
    p.clear();

    // 1. FORZAMOS EL CENTRO (Para que no se mueva)
    currentX = p.width / 2;
    currentY = p.height / 2;

    // 2. ROTACIÓN MANUAL (Solo si el mouse está encima)
    if (isHovered) {
      let mouseSpeed = p.mouseY - p.pmouseY; 
      angle += mouseSpeed * 0.02; // Ajustá el 0.02 para más o menos sensibilidad
    }

    // 3. DIBUJO DEL DISCO
    p.push();
    p.translate(currentX, currentY);
    p.rotate(angle); 

    // Cuerpo negro
    p.fill(15);
    p.stroke(40);
    p.strokeWeight(2);
    p.circle(0, 0, 320);

    // Surcos
    p.noFill();
    p.stroke(255, 15);
    for (let d = 130; d < 310; d += 15) {
      p.circle(0, 0, d);
    }

    // --- LA IMAGEN (Solo la circular) ---
    if (img && maskGraphics) {
      img.mask(maskGraphics); // Esto la hace redonda
      p.imageMode(p.CENTER);
      p.image(img, 0, 0, 110, 110); 
    } else {
      p.fill('#274C77');
      p.noStroke();
      p.circle(0, 0, 100);
    }

    // Agujero central
    p.fill(10);
    p.noStroke();
    p.circle(0, 0, 15);

    p.pop(); // Cerramos la transformación
  };
}, discoContainer);


/* ======= CARRUSEL DE PROYECTOS — Canvas 2D ======= */
(function() {
  const proyectos = [
    { title: 'Ameri',      artist: 'Duki',  cat: 'Producción Musical', color: '#e8c547' },
    { title: 'El Último Verano',   artist: 'Trueno — Score Original',     cat: 'Cine & TV',          color: '#ff5733' },
    { title: 'Marca País',         artist: 'Argentina — Spot TV',         cat: 'Publicidad · Jingle', color: '#4ecdc4' },
    { title: 'Galaxia FM',         artist: 'Lali Espósito',               cat: 'Producción Musical', color: '#a855f7' },
    { title: 'Verano Libre',       artist: 'Coca-Cola Argentina',         cat: 'Publicidad · Spot',  color: '#ef4444' },
    { title: 'Desde Adentro',      artist: 'Bizarrap Session',            cat: 'Producción Musical', color: '#22c55e' },
    { title: 'Mil Luces',          artist: 'Luciano Pereyra',             cat: 'Álbum Completo',     color: '#f59e0b' },
  ];

  const wrap = document.getElementById('carousel-wrap');
  const cnv  = document.getElementById('carousel-canvas');
  const ctx  = cnv.getContext('2d');
  const CARD_W = 320, CARD_H = 220, GAP = 24, CARD_RADIUS = 8;
  let offset = 0;
  const SPEED = 0.7;
  let hovering = false;
  let hoverCard = -1;
  let mouseXLocal = 0, mouseYLocal = 0;

  function resize() {
    cnv.width  = wrap.clientWidth;
    cnv.height = CARD_H + 80;
    cnv.style.width = '100%';
  }
  resize();
  window.addEventListener('resize', resize);

  const totalW = proyectos.length * (CARD_W + GAP);

  function drawCard(x, y, v, idx, isHover) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, CARD_W, CARD_H, CARD_RADIUS);
    ctx.clip();

    // Fondo degradado
    let grad = ctx.createLinearGradient(x, y, x + CARD_W, y + CARD_H);
    grad.addColorStop(0, '#1a1a1a');
    grad.addColorStop(1, '#111');
    ctx.fillStyle = grad;
    ctx.fill();

    // Barra de color superior
    ctx.fillStyle = v.color;
    ctx.fillRect(x, y, CARD_W, 3);

    // Forma de onda decorativa
    ctx.beginPath();
    ctx.strokeStyle = v.color + '18';
    ctx.lineWidth = 1;
    for (let wx = 0; wx < CARD_W; wx += 4) {
      let wy = CARD_H * 0.6 + Math.sin((wx / CARD_W) * Math.PI * 4 + idx) * 25;
      wx === 0 ? ctx.moveTo(x + wx, y + wy) : ctx.lineTo(x + wx, y + wy);
    }
    ctx.stroke();

    // Círculo decorativo
    ctx.beginPath();
    ctx.arc(x + CARD_W - 40, y + 40, 80, 0, Math.PI * 2);
    ctx.fillStyle = v.color + '08';
    ctx.fill();

    // Badge de categoría
    ctx.font = '600 10px DM Sans, sans-serif';
    let tw = ctx.measureText(v.cat).width + 24;
    ctx.fillStyle = v.color + '22';
    ctx.beginPath();
    ctx.roundRect(x + 16, y + 18, tw, 22, 4);
    ctx.fill();
    ctx.fillStyle = v.color;
    ctx.fillText(v.cat, x + 28, y + 33);

    // Título
    ctx.fillStyle = '#f0ede6';
    ctx.font = 'italic 700 22px DM Serif Display, serif';
    ctx.fillText(v.title, x + 16, y + 80);

    // Artista
    ctx.fillStyle = '#888';
    ctx.font = '300 13px DM Sans, sans-serif';
    ctx.fillText(v.artist, x + 16, y + 100);

    // Hover: overlay + botón play
    if (isHover) {
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x, y, CARD_W, CARD_H);

      let cx2 = x + CARD_W / 2, cy2 = y + CARD_H / 2;
      ctx.beginPath();
      ctx.arc(cx2, cy2, 34, 0, Math.PI * 2);
      ctx.strokeStyle = v.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx2 + 12, cy2);
      ctx.lineTo(cx2 - 7, cy2 - 12);
      ctx.lineTo(cx2 - 7, cy2 + 12);
      ctx.closePath();
      ctx.fillStyle = v.color;
      ctx.fill();

      ctx.fillStyle = v.color;
      ctx.font = '11px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('▶ Ver proyecto', cx2, y + CARD_H - 18);
      ctx.textAlign = 'left';
    }
    ctx.restore();

    // Borde hover
    if (isHover) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, CARD_W, CARD_H, CARD_RADIUS);
      ctx.strokeStyle = v.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    if (!hovering) {
      offset += SPEED;
      if (offset > totalW) offset -= totalW;
    }

    hoverCard = -1;
    let startY = 30;
    for (let i = 0; i < proyectos.length * 2; i++) {
      let vi = i % proyectos.length;
      let x  = (i * (CARD_W + GAP)) - offset + 32;
      if (x + CARD_W < 0 || x > cnv.width) continue;
      let isHover = hovering
        && Math.abs(mouseXLocal - (x + CARD_W / 2)) < CARD_W / 2
        && Math.abs(mouseYLocal - (startY + CARD_H / 2)) < CARD_H / 2;
      if (isHover) hoverCard = vi;
      drawCard(x, startY, proyectos[vi], vi, isHover);
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  cnv.addEventListener('mouseenter', () => { hovering = true; });
  cnv.addEventListener('mouseleave', () => { hovering = false; hoverCard = -1; });
  cnv.addEventListener('mousemove', e => {
    let rect = cnv.getBoundingClientRect();
    mouseXLocal = e.clientX - rect.left;
    mouseYLocal = e.clientY - rect.top;
  });
  cnv.addEventListener('click', () => {
    if (hoverCard >= 0) {
      alert('▶ Reproduciendo: ' + proyectos[hoverCard].title + ' — ' + proyectos[hoverCard].artist);
    }
  });
})();


/* ======= MARQUEE DE CLIENTES — Canvas 2D ======= */
(function() {
  const clientes = [
    'Tini', 'Trueno', 'Duki', 'Bizarrap', 'Luciano Pereyra',
    'Coca-Cola', 'YPF', 'Banco Galicia', 'Falabella', 'Disney',
    'Movistar', 'Peugeot', 'Ford', 'Nike', 'Claro',
    'Nickelodeon', 'Jumbo', 'Sodimac', 'Santander', 'Cirque du Soleil',
    'Miranda!', 'Nicki Nicole', 'Abel Pintos', 'El Bahiano', 'Airbag'
  ];

  const cnv = document.getElementById('clientes-canvas');
  const ctx = cnv.getContext('2d');
  const H = 160;
  let W;
  let offset1 = 0, offset2 = 0;

  function resize() {
    W = cnv.parentElement.clientWidth;
    cnv.width  = W;
    cnv.height = H;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawRow(items, y, vel, off, accent) {
    ctx.font = '300 14px DM Sans, sans-serif';
    let itemW = 180;
    let total = items.length * itemW;
    let x = -(off % total);
    ctx.save();
    for (let rep = 0; rep < 3; rep++) {
      for (let i = 0; i < items.length; i++) {
        let ix = x + (rep * total) + i * itemW;
        if (ix > W + 20) continue;

        // Píldora
        let tw = ctx.measureText(items[i]).width + 32;
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.beginPath();
        ctx.roundRect(ix, y, tw, 36, 18);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Punto de color
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(ix + 14, y + 18, 3, 0, Math.PI * 2);
        ctx.fill();

        // Texto
        ctx.fillStyle = '#999';
        ctx.fillText(items[i], ix + 24, y + 23);
      }
    }
    ctx.restore();
    return off + vel;
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    offset1 = drawRow(clientes.slice(0, 13), 20,  0.5,  offset1, '#e8c547');
    offset2 = drawRow(clientes.slice(12),    80,  0.35, offset2, '#ff5733');

    // Fundidos en los bordes
    let fadew = 80;
    let lg = ctx.createLinearGradient(0, 0, fadew, 0);
    lg.addColorStop(0, 'rgba(17,17,17,1)');
    lg.addColorStop(1, 'rgba(17,17,17,0)');
    let rg = ctx.createLinearGradient(W - fadew, 0, W, 0);
    rg.addColorStop(0, 'rgba(17,17,17,0)');
    rg.addColorStop(1, 'rgba(17,17,17,1)');
    ctx.fillStyle = lg; ctx.fillRect(0, 0, fadew, H);
    ctx.fillStyle = rg; ctx.fillRect(W - fadew, 0, fadew, H);

    requestAnimationFrame(animate);
  }
  animate();
})();


/* ======= ANIMACIÓN DE ENTRADA AL SCROLL ======= */
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.servicio-item, .team-card, .stat').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  obs.observe(el);
});
