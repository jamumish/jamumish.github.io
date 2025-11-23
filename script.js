// JavaScript for the Aladar lentiсular posters website
// Handles year updates, dynamic pricing calculator, and quick message sending

// Price table: [price for first item, price for each subsequent]
const priceTable = {
  noframe: { A2: [3000, 2200], A3: [2600, 1800], A4: [2200, 1400] },
  click:   { A2: [4300, 3500], A3: [3900, 3100], A4: [3500, 2700] },
  lightbox_single: { A2: [6500, 5700], A3: [5800, 5000], A4: [5000, 4200] },
  lightbox_double: { A2: [8700, 6700] },
  crystal: { A2: [11000, 10200], A3: [10000, 9200] }
};

let sizeSelect, typeSelect;

// Populate size dropdown according to selected product type
function refreshSizes() {
  const t = typeSelect.value;
  const sizes = Object.keys(priceTable[t]);
  sizeSelect.innerHTML = sizes.map(s => `<option value="${s}">${s}</option>`).join('');
}

// Calculate and display total price based on form inputs
function recalc() {
  const t = typeSelect.value;
  const s = sizeSelect.value;
  const designs = Math.max(1, parseInt(document.getElementById('designs').value || '1', 10));
  const totalPosters = Math.max(1, parseInt(document.getElementById('totalPosters').value || '1', 10));
  const del = document.getElementById('deliveryMsk').value;

  // Проверяем чтобы общее количество было не меньше количества дизайнов
  const posters = Math.max(totalPosters, designs);
  
  const pair = priceTable[t][s];
  const out = document.getElementById('out');
  if (!pair) {
    out.innerHTML = '— Недоступная комбинация';
    return;
  }
  
  const first = pair[0];  // Цена с дизайном (3000 для A2 без рамки)
  const next = pair[1] ?? pair[0];  // Цена без дизайна (2200 для A2 без рамки)
  
  // Расчет: (дизайны × цена_первого) + ((общее_количество - дизайны) × цена_следующего)
  const uniquePostersCost = designs * first;
  const repeatedPostersCost = (posters - designs) * next;
  const printTotal = uniquePostersCost + repeatedPostersCost;

  let delivery = 0;
  if (del === 'yes') {
    delivery = (printTotal >= 12000) ? 0 : 1500;
  }

  const total = printTotal + delivery;
  const f = n => n.toLocaleString('ru-RU') + ' ₽';
  out.innerHTML = `
    <div><b>Итого изделий:</b> ${posters} шт (уникальных дизайнов: ${designs})</div>
    <div><b>Стоимость печати:</b> ${f(printTotal)}</div>
    <div><b>Доставка (Москва):</b> ${del === 'yes' ? f(delivery) : '—'}</div>
    <div style="margin-top:6px"><b>ИТОГО к оплате:</b> ${f(total)}</div>
    <div class="note" style="margin-top:6px">«Каждый следующий» — цена для экземпляров с тем же дизайном. Другие размеры обсуждаются отдельно.</div>`;
}
// Set copyright years automatically and initialize calculator
document.addEventListener('DOMContentLoaded', () => {
  // Инициализируем переменные
  sizeSelect = document.getElementById('size');
  typeSelect = document.getElementById('type');
  
  try {
    const y = new Date().getFullYear();
    const yearEls = document.querySelectorAll('#year, #year2');
    yearEls.forEach(el => el.textContent = y);
  } catch(e) {}

  try { refreshSizes(); } catch(e) {}
  try {
    if (typeSelect) {
      typeSelect.addEventListener('change', () => { refreshSizes(); recalc(); });
    }
    if (sizeSelect) {
      sizeSelect.addEventListener('change', recalc);
    }
    const d = document.getElementById('designs');
    const tp = document.getElementById('totalPosters');
    if (d) d.addEventListener('input', recalc);
    if (tp) tp.addEventListener('input', recalc);
  } catch(e) {}
  try { recalc(); } catch(e) {}
});

// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav .row');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Закрываем меню при клике на ссылку
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
});