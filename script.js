/* ==========================================================================
   Leilão dos Brasileiros — lógica do portal
   JavaScript puro, sem dependências. Funciona em hospedagem estática.

   Onde editar (tudo no topo deste arquivo):
   1. WHATSAPP_NUMBER, CONTACT e LEGAL  → dados de contato e legais reais
   2. SITE_CONFIG.demoMode               → liga/desliga os lotes de demonstração
   3. LOTS_PRODUCTION                    → lotes reais (comece por aqui)
   4. LOTS_DEMO                          → exemplos visuais; apague antes de publicar
   ========================================================================== */
'use strict';

/* --------------------------------------------------------------------------
   1. CONFIGURAÇÃO CENTRALIZADA
   -------------------------------------------------------------------------- */

/**
 * NÚMERO DE WHATSAPP
 * Formato internacional, somente dígitos (55 + DDD + número), sem espaços,
 * parênteses, traços ou o sinal de "+". Número informado pelo cliente: +55 71 99837-389.
 * ATENÇÃO: após o DDD 71 há apenas 8 dígitos (99837389); celulares brasileiros costumam
 * ter 9. Teste o link no celular antes de publicar. Se faltar um dígito, corrija aqui
 * e em WHATSAPP_DISPLAY; o restante do site se atualiza sozinho.
 * Enquanto estiver vazio, o site avisa que o contato precisa ser configurado
 * e não direciona ninguém para nenhum número.
 */
const WHATSAPP_NUMBER = '557199837389';
/** Como o número aparece escrito no site (exatamente como informado). */
const WHATSAPP_DISPLAY = '+55 71 99837-389';

const SITE_CONFIG = {
  brandName: 'Leilão dos Brasileiros',
  /**
   * Modo demonstração. Com true, os lotes de LOTS_DEMO aparecem junto dos reais,
   * com aviso no topo e etiqueta "Demonstração" nos cards.
   * Antes de publicar de verdade: troque para false.
   */
  demoMode: true,
};

/**
 * CONTATO — preencha somente com informações confirmadas.
 * Campos vazios não aparecem no site.
 */
const CONTACT = {
  email: '',    // ex.: 'contato@seudominio.com.br'
  phone: '',    // ex.: '5513999999999' (somente dígitos, formato internacional)
  address: '',  // ex.: 'Rua Exemplo, 100 - Cidade/UF'
  hours: '',    // ex.: 'Segunda a sexta, das 9h às 18h'
};

/**
 * INFORMAÇÕES LEGAIS — preencha somente com dados reais.
 * privacyUrl e termsUrl só devem ser preenchidos quando as páginas existirem.
 */
const LEGAL = {
  companyName: '',  // razão social
  cnpj: '',         // ex.: '00.000.000/0000-00'
  privacyUrl: '',   // ex.: 'privacidade.html'
  termsUrl: '',     // ex.: 'termos.html'
};

/* --------------------------------------------------------------------------
   2. DADOS: CATEGORIAS, SITUAÇÕES E LOTES
   -------------------------------------------------------------------------- */

const CATEGORIES = [
  { id: 'imoveis', label: 'Imóveis' },
  { id: 'carros', label: 'Carros' },
  { id: 'motos', label: 'Motocicletas' },
  { id: 'caminhoes', label: 'Caminhões e utilitários' },
  { id: 'terrenos', label: 'Terrenos' },
  { id: 'maquinas', label: 'Máquinas e equipamentos' },
  { id: 'outros', label: 'Outros bens' },
];

const STATUSES = [
  { id: 'aberto', label: 'Disponível' },
  { id: 'em-breve', label: 'Próximo lote' },
  { id: 'encerrado', label: 'Encerrado' },
];

/**
 * LOTES REAIS (produção)
 * Adicione aqui somente lotes confirmados pelo responsável.
 *
 * Modelo de um lote (copie, cole dentro da lista e preencha):
 *   {
 *     id: 'lote-0001',                 // identificador único, sem espaços
 *     lot: 'Lote 0001',                // número exibido no card
 *     category: 'imoveis',             // imoveis | carros | motos | caminhoes | terrenos | maquinas | outros
 *     title: 'Título do lote',
 *     location: 'Cidade, UF',          // opcional
 *     status: 'aberto',                // aberto | em-breve | encerrado
 *     price: 150000,                   // valor inicial confirmado, ou null para "Consultar valor"
 *     priceLabel: 'Valor inicial',
 *     closesAt: '2026-12-31',          // opcional, formato AAAA-MM-DD; só informe data confirmada
 *     images: [                        // fotos em images/ (use caminhos relativos)
 *       { src: 'images/lote-0001-frente.jpg', alt: 'Fachada do imóvel' },
 *     ],
 *     description: 'Descrição do lote.',
 *     details: [                       // opcional: informações comerciais fornecidas pelo responsável
 *       { label: 'Área', value: '120 m²' },
 *     ],
 *     documentUrl: '',                 // opcional: link do edital/documentação, se existir
 *   }
 */
const LOTS_PRODUCTION = [];

/**
 * LOTES DE DEMONSTRAÇÃO — DADOS DE EXEMPLO (apagar antes da publicação)
 * Servem só para mostrar o layout. Não representam bens, valores, locais ou
 * situações reais. Ficam separados dos lotes reais e são marcados com demo: true.
 * As fotos são ilustrativas.
 */
const LOTS_DEMO = [
  {
    id: 'demo-001',
    lot: 'Lote 001',
    category: 'imoveis',
    title: 'Casa térrea de acabamento moderno',
    location: 'Goiânia, GO',
    status: 'aberto',
    price: 480000,
    priceLabel: 'Valor inicial',
    images: [{ src: 'images/imovel-casa-terrea.jpg', alt: 'Casa térrea moderna com fachada branca, porta de madeira e garagem coberta' }],
    description: 'Descrição de exemplo: substitua por metragem, número de quartos, vagas e situação do imóvel.',
    demo: true,
  },
  {
    id: 'demo-002',
    lot: 'Lote 002',
    category: 'imoveis',
    title: 'Apartamento em edifício residencial',
    location: 'Recife, PE',
    status: 'encerrado',
    price: 420000,
    priceLabel: 'Valor inicial',
    images: [{ src: 'images/imovel-apartamento.jpg', alt: 'Fachada de edifício residencial com revestimento azul em rua urbana' }],
    description: 'Lote de exemplo já encerrado, usado para demonstrar essa situação no layout.',
    demo: true,
  },
  {
    id: 'demo-003',
    lot: 'Lote 003',
    category: 'imoveis',
    title: 'Galpão comercial com área administrativa',
    location: 'Campinas, SP',
    status: 'em-breve',
    price: null,
    priceLabel: 'Valor inicial',
    images: [{ src: 'images/imovel-galpao.jpg', alt: 'Galpão de fachada cinza com entrada envidraçada e portão de carga' }],
    description: 'Descrição de exemplo: substitua por área construída, área do terreno e condições de acesso.',
    demo: true,
  },
  {
    id: 'demo-004',
    lot: 'Lote 004',
    category: 'carros',
    title: 'Veículos diversos em pátio',
    location: 'São Paulo, SP',
    status: 'aberto',
    price: 18500,
    priceLabel: 'Valor inicial',
    images: [{ src: 'images/veiculos-carros-e-motos.jpg', alt: 'Pátio com muitos automóveis e três motocicletas em primeiro plano' }],
    description: 'Descrição de exemplo: substitua por marca, modelo, ano, quilometragem e situação documental de cada veículo.',
    demo: true,
  },
  {
    id: 'demo-005',
    lot: 'Lote 005',
    category: 'maquinas',
    title: 'Máquinas e equipamentos industriais',
    location: 'Curitiba, PR',
    status: 'aberto',
    price: null,
    priceLabel: 'Valor de referência',
    images: [{ src: 'images/bens-maquinas.jpg', alt: 'Galpão industrial com tornos e máquinas de usinagem expostos' }],
    description: 'Descrição de exemplo: substitua pela relação de equipamentos, estado de conservação e local de retirada.',
    demo: true,
  },
];

const LOTS = SITE_CONFIG.demoMode ? [...LOTS_PRODUCTION, ...LOTS_DEMO] : LOTS_PRODUCTION;

/* --------------------------------------------------------------------------
   3. UTILITÁRIOS
   -------------------------------------------------------------------------- */

const ALL = 'todos';
const SVG_NS = 'http://www.w3.org/2000/svg';

const currencyFormat = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

/** Minúsculas e sem acentos, para pesquisa tolerante. */
function normalize(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function categoryLabel(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
}

function statusLabel(id) {
  const found = STATUSES.find((s) => s.id === id);
  return found ? found.label : id;
}

/** Cria um elemento sem usar innerHTML (evita injeção de HTML). */
function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) return;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else node.setAttribute(key, value === true ? '' : value);
  });
  [].concat(children).forEach((child) => {
    if (child) node.append(child);
  });
  return node;
}

/** Ícone do sprite definido no index.html. */
function svgIcon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}

/** "2026-12-31" → "31/12/2026", sem deslocamento de fuso horário. */
function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}

function formatPhone(digits) {
  const d = String(digits).replace(/\D/g, '');
  const m = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(d);
  return m ? `+55 (${m[1]}) ${m[2]}-${m[3]}` : `+${d}`;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrollToId(id) {
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

/* --------------------------------------------------------------------------
   4. IMAGENS COM FALHA SEGURA
   -------------------------------------------------------------------------- */

function mediaFallback(label) {
  return el('div', {
    class: 'media-fallback',
    role: label ? 'img' : null,
    'aria-label': label || null,
    'aria-hidden': label ? null : 'true',
    text: label || 'Foto a ser adicionada',
  });
}

/** Troca a <img> por um espaço reservado se o arquivo não carregar. */
function attachFallback(img) {
  // Foto ausente: espaço reservado neutro, sem descrever um bem que o visitante não consegue ver.
  const swap = () => img.replaceWith(mediaFallback(img.dataset.placeholder || (img.getAttribute('alt') ? 'Foto ainda não disponível' : '')));
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) swap();
  else img.addEventListener('error', swap, { once: true });
}

/**
 * Imagem de um lote. Para usar fotos reais: salve o arquivo em images/ e
 * informe o caminho em images: [{ src: 'images/arquivo.jpg', alt: '...' }].
 */
function lotImage(lot, index, loading) {
  const image = lot.images && lot.images[index];
  if (!image || !image.src) return mediaFallback('Foto a ser adicionada');
  const img = el('img', {
    src: image.src,
    alt: image.alt || lot.title,
    width: 1200,
    height: 900,
    loading,
    decoding: 'async',
    'data-placeholder': 'Foto do lote ainda não disponível',
  });
  attachFallback(img);
  return img;
}

/* --------------------------------------------------------------------------
   5. WHATSAPP
   Toda mensagem e todo link são gerados por buildWhatsappMessage() e
   whatsappUrl(). Os botões são links reais (<a href>), então funcionam em
   computador e celular. Abrir o WhatsApp não garante que a mensagem seja
   enviada: o visitante revisa e envia por conta própria.
   -------------------------------------------------------------------------- */

const WHATSAPP_BASE = 'https://wa.me/';

function isWhatsappConfigured() {
  return /^\d{10,15}$/.test(WHATSAPP_NUMBER);
}

/** Categorias que usam o texto de imóvel e o de veículo. */
const REAL_ESTATE_CATEGORIES = ['imoveis', 'terrenos'];
const VEHICLE_CATEGORIES = ['carros', 'motos', 'caminhoes'];

/** Endereço da página atual, sem o #fragmento (funciona em /leilaobrteste/ e em qualquer subpasta). */
function pageUrl() {
  return location.href.split('#')[0];
}

/** Link direto para o lote (abre o modal do lote). */
function lotUrl(lot) {
  return `${pageUrl()}#lote-${encodeURIComponent(lot.id)}`;
}

/** Código exibido ao visitante: "Lote 001" → "001". Vazio se não houver. */
function lotCode(lot) {
  return String(lot.code || lot.lot || '').replace(/^lote\s*/i, '').trim();
}

/** Junta somente as partes preenchidas, para nunca enviar campos vazios. */
function sentence(...parts) {
  return parts.filter((part) => part && String(part).trim()).join(' ');
}

/**
 * Monta o texto da mensagem.
 * options.type: 'general' | 'lot' | 'edital' | 'visit' | 'category'
 * options.lot: objeto do lote (obrigatório nos tipos de lote)
 * options.category: id da categoria (tipo 'category')
 * Para 'lot', o texto muda conforme a categoria (imóvel, veículo ou genérico).
 */
function buildWhatsappMessage(options = {}) {
  const { type = 'general', lot = null } = options;
  const brand = SITE_CONFIG.brandName;

  // Sem lote, qualquer tipo de lote cai na mensagem geral.
  if (type === 'category' && options.category) {
    return `Olá! Acessei a categoria ${categoryLabel(options.category)} no site do ${brand} e gostaria de receber ajuda para encontrar lotes de meu interesse.`;
  }
  if (!lot || type === 'general' || type === 'category') {
    return `Olá! Acessei o site do ${brand} e gostaria de falar com um atendente. Poderiam me ajudar?`;
  }

  const code = lotCode(lot);
  const link = lotUrl(lot);
  const demoNote = lot.demo ? ' (Observação: vi este lote como exemplo de demonstração do site.)' : '';
  const where = lot.location ? `, localizado em ${lot.location}` : '';
  const label = lot.title + where;
  const codeText = code ? `código ${code}` : '';
  const ref = sentence(`${lot.title}${code ? `, ${codeText}` : ''}`);

  let text;
  if (type === 'edital') {
    text = sentence(
      `Olá! Gostaria de consultar o edital e esclarecer dúvidas sobre o lote ${lot.title}${code ? ` (${codeText})` : ''},`,
      `que encontrei no site do ${brand}.`,
      `Link: ${link}`
    );
  } else if (type === 'visit') {
    text = sentence(
      `Olá! Tenho interesse no lote ${lot.title}${code ? ` (${codeText})` : ''}`,
      'e gostaria de saber se há visitação disponível e quais são os procedimentos.',
      `Link: ${link}`
    );
  } else if (REAL_ESTATE_CATEGORIES.includes(lot.category)) {
    const kind = lot.category === 'terrenos' ? 'terreno' : 'imóvel';
    text = sentence(
      `Olá! Tenho interesse no ${kind} ${label}${code ? `, ${codeText}` : ''}, anunciado no site do ${brand}.`,
      'Gostaria de saber mais sobre a localização, a documentação, o edital e as condições de participação.',
      `Link: ${link}`
    );
  } else if (VEHICLE_CATEGORIES.includes(lot.category)) {
    text = sentence(
      `Olá! Tenho interesse no veículo ${lot.title}${code ? `, ${codeText}` : ''}, da categoria ${categoryLabel(lot.category)}, anunciado no site do ${brand}.`,
      'Poderiam me informar as condições do lote, a documentação e os próximos passos?',
      `Link: ${link}`
    );
  } else {
    text = sentence(
      `Olá! Acessei o site do ${brand} e tenho interesse no lote ${ref} (categoria ${categoryLabel(lot.category)}${lot.location ? `, ${lot.location}` : ''}).`,
      'Gostaria de receber mais informações sobre as condições, o edital e os próximos passos.',
      `Link do lote: ${link}`
    );
  }
  return text + demoNote;
}

/** https://wa.me/NÚMERO?text=MENSAGEM-CODIFICADA */
function whatsappUrl(options = {}) {
  return `${WHATSAPP_BASE}${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsappMessage(options))}`;
}

let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 6000);
}

/**
 * Configura um <a> como link de WhatsApp. Sem número configurado, o link
 * não navega e avisa o visitante.
 */
function setWhatsappLink(anchor, options = {}) {
  anchor.setAttribute('target', '_blank');
  anchor.setAttribute('rel', 'noopener noreferrer');
  if (!isWhatsappConfigured()) {
    anchor.setAttribute('href', '#contato');
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('O contato por WhatsApp ainda precisa ser configurado neste site.');
    });
    return anchor;
  }
  anchor.setAttribute('href', whatsappUrl(options));
  return anchor;
}

/** Cria um <a> de WhatsApp. */
function whatsappLink(props, children, options) {
  return setWhatsappLink(el('a', props, children), options);
}

/** Aviso exibido perto dos botões: o WhatsApp só abre a conversa. */
const WA_NOTE = 'Ao clicar, o WhatsApp será aberto com uma mensagem pronta para você revisar e enviar. Nada é enviado automaticamente.';

/* --------------------------------------------------------------------------
   6. CARDS E CATÁLOGO
   -------------------------------------------------------------------------- */

const state = { query: '', category: ALL, status: ALL, location: ALL };
const refs = {};

function statusBadge(lot) {
  return el('span', { class: `status status-${lot.status}`, text: statusLabel(lot.status) });
}

function priceBlock(lot) {
  const hasPrice = typeof lot.price === 'number';
  const closes = formatDate(lot.closesAt);
  return el('div', { class: 'lot-price' }, [
    el('span', { class: 'price-label', text: lot.priceLabel || 'Valor informado' }),
    el('span', {
      class: hasPrice ? 'price-value' : 'price-value is-consult',
      text: hasPrice ? currencyFormat.format(lot.price) : 'Consultar valor',
    }),
    closes ? el('span', { class: 'price-date', text: `Encerramento: ${closes}` }) : null,
  ]);
}

function createCard(lot, index) {
  const media = el('div', { class: 'lot-media' }, [
    lotImage(lot, 0, index < 3 ? 'eager' : 'lazy'),
    el('span', { class: 'lot-chip', text: categoryLabel(lot.category) }),
    el('span', { class: 'lot-number', text: lot.lot }),
    lot.demo ? el('span', { class: 'lot-demo', text: 'Demonstração' }) : null,
  ]);

  const detailsBtn = el('button', { type: 'button', class: 'btn btn-primary', text: 'Ver detalhes' });
  detailsBtn.setAttribute('aria-label', `Ver detalhes do ${lot.lot}: ${lot.title}`);
  detailsBtn.addEventListener('click', () => openDialog(lot));

  // Link real de WhatsApp, com a mensagem do lote deste card.
  const contactBtn = whatsappLink(
    {
      class: 'btn btn-whatsapp btn-icon',
      'aria-label': `Consultar o ${lot.lot} pelo WhatsApp (abre uma nova aba)`,
      title: 'Consultar pelo WhatsApp',
    },
    [svgIcon('whatsapp')],
    { type: 'lot', lot }
  );

  const body = el('div', { class: 'lot-body' }, [
    el('div', { class: 'lot-status-row' }, [statusBadge(lot)]),
    el('h3', { class: 'lot-title', text: lot.title }),
    lot.location ? el('p', { class: 'lot-location' }, [svgIcon('pin'), el('span', { text: lot.location })]) : null,
    priceBlock(lot),
    el('div', { class: 'lot-actions' }, [detailsBtn, contactBtn]),
  ]);

  return el('article', { class: 'lot-card' }, [media, body]);
}

function matchesQuery(lot, query) {
  if (!query) return true;
  const haystack = normalize(
    [lot.title, lot.lot, lot.id, lot.description, lot.location, categoryLabel(lot.category)].join(' ')
  );
  // Todas as palavras digitadas precisam aparecer em algum campo.
  return normalize(query)
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

function getFilteredLots() {
  return LOTS.filter(
    (lot) =>
      matchesQuery(lot, state.query) &&
      (state.category === ALL || lot.category === state.category) &&
      (state.status === ALL || lot.status === state.status) &&
      (state.location === ALL || lot.location === state.location)
  );
}

/** Link "falar sobre esta categoria": só aparece com uma categoria escolhida. */
function updateCategoryHelp() {
  const box = refs.categoryHelp;
  if (state.category === ALL) {
    box.hidden = true;
    return;
  }
  const label = categoryLabel(state.category);
  setWhatsappLink(refs.categoryHelpLink, { type: 'category', category: state.category });
  refs.categoryHelpLink.setAttribute('aria-label', `Pedir ajuda sobre ${label} pelo WhatsApp (abre uma nova aba)`);
  refs.categoryHelpText.textContent = label;
  box.hidden = false;
}

function render() {
  // Catálogo sem nenhum lote cadastrado.
  if (LOTS.length === 0) {
    refs.filters.hidden = true;
    refs.count.textContent = '';
    refs.grid.replaceChildren();
    refs.emptyResults.hidden = true;
    refs.emptyCatalog.hidden = false;
    refs.categoryHelp.hidden = true;
    return;
  }

  const lots = getFilteredLots();
  refs.grid.replaceChildren(...lots.map(createCard));
  updateCategoryHelp();
  refs.emptyResults.hidden = lots.length > 0;
  refs.count.textContent = lots.length === 1 ? '1 lote encontrado' : `${lots.length} lotes encontrados`;
  syncCategoryButtons();
}

/* --------------------------------------------------------------------------
   7. PESQUISA E FILTROS
   -------------------------------------------------------------------------- */

function fillSelect(select, allLabel, options) {
  select.replaceChildren(
    el('option', { value: ALL, text: allLabel }),
    ...options.map((o) => el('option', { value: o.id, text: o.label }))
  );
}

/** Marca como ativo o botão de categoria (cards e chips) que corresponde ao filtro. */
function syncCategoryButtons() {
  document.querySelectorAll('[data-category]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.category === state.category));
  });
}

function setQuery(value) {
  state.query = value;
  refs.search.value = value;
  refs.heroSearch.value = value;
  render();
}

function setCategory(category) {
  state.category = category;
  refs.category.value = category;
  render();
}

function clearFilters() {
  state.query = '';
  state.category = ALL;
  state.status = ALL;
  state.location = ALL;
  refs.search.value = '';
  refs.heroSearch.value = '';
  refs.category.value = ALL;
  refs.status.value = ALL;
  refs.location.value = ALL;
  render();
}

function setupFilters() {
  fillSelect(refs.category, 'Todas', CATEGORIES);
  fillSelect(refs.status, 'Todas', STATUSES);

  const locations = [...new Set(LOTS.map((l) => l.location).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  );
  // Sem localização nos dados, o filtro não é exibido.
  refs.locationField.hidden = locations.length === 0;
  fillSelect(
    refs.location,
    'Todas',
    locations.map((l) => ({ id: l, label: l }))
  );

  refs.search.addEventListener('input', () => setQuery(refs.search.value));
  refs.category.addEventListener('change', () => setCategory(refs.category.value));
  refs.status.addEventListener('change', () => {
    state.status = refs.status.value;
    render();
  });
  refs.location.addEventListener('change', () => {
    state.location = refs.location.value;
    render();
  });

  refs.clear.addEventListener('click', clearFilters);
  refs.emptyClear.addEventListener('click', clearFilters);

  // Busca do hero: aplica o termo ao catálogo e leva o visitante até ele.
  refs.heroForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setQuery(refs.heroSearch.value);
    scrollToId('catalogo');
  });

  // Categorias visuais: filtram o catálogo. Clicar de novo na ativa remove o filtro.
  document.querySelectorAll('[data-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = state.category === btn.dataset.category ? ALL : btn.dataset.category;
      setCategory(next);
      if (next !== ALL) scrollToId('catalogo');
    });
  });
}

/* --------------------------------------------------------------------------
   8. DETALHES DO LOTE
   -------------------------------------------------------------------------- */

let currentLot = null;

function showGalleryImage(lot, index) {
  const d = refs.dialog;
  d.media.replaceChildren(lotImage(lot, index, 'eager'));
  d.thumbs.querySelectorAll('button').forEach((btn, i) => {
    btn.setAttribute('aria-current', String(i === index));
  });
}

function buildThumbs(lot) {
  const d = refs.dialog;
  const images = lot.images || [];
  d.thumbs.replaceChildren();
  d.thumbs.hidden = images.length < 2;
  if (images.length < 2) return;

  images.forEach((image, i) => {
    const img = el('img', { src: image.src, alt: '', width: 72, height: 54, loading: 'lazy' });
    attachFallback(img);
    const btn = el('button', { type: 'button' }, [img]);
    btn.setAttribute('aria-label', `Ver imagem ${i + 1} de ${images.length}`);
    btn.addEventListener('click', () => showGalleryImage(lot, i));
    d.thumbs.append(el('li', {}, [btn]));
  });
}

function fact(label, valueNode) {
  return el('div', {}, [el('dt', { text: label }), el('dd', {}, [valueNode])]);
}

function openDialog(lot) {
  currentLot = lot;
  const d = refs.dialog;
  const hasPrice = typeof lot.price === 'number';
  const closes = formatDate(lot.closesAt);

  buildThumbs(lot);
  showGalleryImage(lot, 0);

  d.meta.textContent = `${categoryLabel(lot.category)} · ${lot.lot}`;
  d.title.textContent = lot.title;
  d.location.replaceChildren(...(lot.location ? [svgIcon('pin'), el('span', { text: lot.location })] : []));

  d.facts.replaceChildren(
    fact('Situação', statusBadge(lot)),
    fact(lot.priceLabel || 'Valor informado', document.createTextNode(hasPrice ? currencyFormat.format(lot.price) : 'Consultar valor'))
  );
  if (closes) d.facts.append(fact('Encerramento', document.createTextNode(closes)));

  d.description.textContent = lot.description || '';

  const details = lot.details || [];
  d.details.hidden = details.length === 0;
  d.details.replaceChildren(
    ...details.map((item) => el('div', {}, [el('dt', { text: item.label }), el('dd', { text: item.value })]))
  );

  d.demo.hidden = !lot.demo;

  // Botões de WhatsApp deste lote (a mensagem identifica o lote aberto).
  setWhatsappLink(d.contact, { type: 'lot', lot });
  setWhatsappLink(d.edital, { type: 'edital', lot });
  setWhatsappLink(d.visit, { type: 'visit', lot });

  // Link do edital: só aparece quando fornecido para o lote.
  if (lot.documentUrl) {
    d.document.href = lot.documentUrl;
    d.document.hidden = false;
    d.edital.hidden = true;
  } else {
    d.document.removeAttribute('href');
    d.document.hidden = true;
    d.edital.hidden = false;
  }

  if (typeof d.root.showModal === 'function') d.root.showModal();
  else d.root.setAttribute('open', '');

  history.replaceState(null, '', `#lote-${encodeURIComponent(lot.id)}`);
}

function closeDialog() {
  if (typeof refs.dialog.root.close === 'function') refs.dialog.root.close();
  else refs.dialog.root.removeAttribute('open');
  onDialogClosed();
}

function onDialogClosed() {
  currentLot = null;
  if (location.hash.startsWith('#lote-')) {
    history.replaceState(null, '', `${location.pathname}${location.search}#catalogo`);
  }
}

function setupDialog() {
  const root = refs.dialog.root;

  refs.dialog.close.addEventListener('click', closeDialog);
  // Esc fecha o <dialog> nativamente; este evento limpa o estado.
  root.addEventListener('close', onDialogClosed);
  // Clique no fundo escurecido (fora do painel) fecha o modal.
  root.addEventListener('click', (event) => {
    if (event.target === root) closeDialog();
  });

  // Link direto para um lote: ...#lote-ID
  const match = /^#lote-(.+)$/.exec(location.hash);
  if (match) {
    const lot = LOTS.find((l) => l.id === decodeURIComponent(match[1]));
    if (lot) openDialog(lot);
  }
}

/* --------------------------------------------------------------------------
   9. NAVEGAÇÃO: MENU MOBILE E SEÇÃO ATIVA
   -------------------------------------------------------------------------- */

function setupMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 961px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/** Destaca no menu a seção que está na tela. */
function setupScrollSpy() {
  if (!('IntersectionObserver' in window)) return;
  const links = new Map(
    [...document.querySelectorAll('.main-nav ul a')].map((a) => [a.getAttribute('href').slice(1), a])
  );

  function setCurrent(id) {
    links.forEach((link, key) => {
      if (key === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && links.has(entry.target.id)) setCurrent(entry.target.id);
      });
    },
    { rootMargin: '-35% 0px -60% 0px' }
  );

  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

/* --------------------------------------------------------------------------
   10. PERGUNTAS FREQUENTES
   -------------------------------------------------------------------------- */

/** Mantém apenas uma resposta aberta por vez, também em navegadores sem suporte a details[name]. */
function setupFaq() {
  const items = [...document.querySelectorAll('#faq-list details')];
  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. CONTATO E RODAPÉ (somente dados informados)
   -------------------------------------------------------------------------- */

function contactEntries() {
  const entries = [];
  if (isWhatsappConfigured()) {
    entries.push({ label: 'WhatsApp', text: WHATSAPP_DISPLAY, href: whatsappUrl({ type: 'general' }), external: true });
  }
  if (CONTACT.phone) {
    entries.push({ label: 'Telefone', text: formatPhone(CONTACT.phone), href: `tel:+${CONTACT.phone.replace(/\D/g, '')}` });
  }
  if (CONTACT.email) entries.push({ label: 'E-mail', text: CONTACT.email, href: `mailto:${CONTACT.email}` });
  if (CONTACT.address) entries.push({ label: 'Endereço', text: CONTACT.address });
  if (CONTACT.hours) entries.push({ label: 'Atendimento', text: CONTACT.hours });
  return entries;
}

function entryNode(entry) {
  if (!entry.href) return document.createTextNode(entry.text);
  const link = el('a', { href: entry.href, text: entry.text });
  if (entry.external) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
  return link;
}

function renderContact() {
  const entries = contactEntries();
  const configured = isWhatsappConfigured();

  // Seção de contato
  const whatsappBtn = document.getElementById('contact-whatsapp');
  const status = document.getElementById('contact-status');
  const list = document.getElementById('contact-list');

  whatsappBtn.setAttribute('aria-disabled', String(!configured));
  status.hidden = configured;
  if (!configured) status.textContent = 'O atendimento por WhatsApp será disponibilizado em breve. Enquanto isso, o botão não envia mensagens.';

  list.hidden = entries.length === 0;
  list.replaceChildren(
    ...entries.map((entry) => el('div', {}, [el('dt', { text: entry.label }), el('dd', {}, [entryNode(entry)])]))
  );

  // Rodapé: contato
  const footerContact = document.getElementById('footer-contact');
  footerContact.replaceChildren(
    ...(entries.length
      ? entries.map((entry) => el('li', {}, [document.createTextNode(`${entry.label}: `), entryNode(entry)]))
      : [el('li', { text: 'Os canais de contato serão divulgados em breve.' })])
  );

  // Rodapé: informações legais
  const legal = [];
  if (LEGAL.companyName) legal.push(el('li', { text: LEGAL.companyName }));
  if (LEGAL.cnpj) legal.push(el('li', { text: `CNPJ: ${LEGAL.cnpj}` }));
  if (LEGAL.privacyUrl) legal.push(el('li', {}, [el('a', { href: LEGAL.privacyUrl, text: 'Política de privacidade' })]));
  if (LEGAL.termsUrl) legal.push(el('li', {}, [el('a', { href: LEGAL.termsUrl, text: 'Termos de uso' })]));
  if (legal.length === 0) legal.push(el('li', { text: 'As informações legais da empresa serão publicadas aqui.' }));
  document.getElementById('footer-legal').replaceChildren(...legal);
}

/* --------------------------------------------------------------------------
   12. INICIALIZAÇÃO
   -------------------------------------------------------------------------- */

function init() {
  refs.grid = document.getElementById('lot-grid');
  refs.filters = document.getElementById('filters');
  refs.emptyResults = document.getElementById('empty-results');
  refs.emptyCatalog = document.getElementById('empty-catalog');
  refs.count = document.getElementById('result-count');
  refs.search = document.getElementById('catalog-search');
  refs.heroForm = document.getElementById('hero-search-form');
  refs.heroSearch = document.getElementById('hero-search-input');
  refs.category = document.getElementById('filter-category');
  refs.status = document.getElementById('filter-status');
  refs.location = document.getElementById('filter-location');
  refs.locationField = document.getElementById('field-location');
  refs.clear = document.getElementById('clear-filters');
  refs.emptyClear = document.getElementById('empty-clear');
  refs.categoryHelp = document.getElementById('category-help');
  refs.categoryHelpLink = document.getElementById('category-help-link');
  refs.categoryHelpText = document.getElementById('category-help-text');
  refs.dialog = {
    root: document.getElementById('lot-dialog'),
    close: document.getElementById('dialog-close'),
    media: document.getElementById('dialog-media'),
    thumbs: document.getElementById('dialog-thumbs'),
    meta: document.getElementById('dialog-meta'),
    title: document.getElementById('dialog-title'),
    location: document.getElementById('dialog-location'),
    facts: document.getElementById('dialog-facts'),
    description: document.getElementById('dialog-description'),
    details: document.getElementById('dialog-details'),
    demo: document.getElementById('dialog-demo'),
    document: document.getElementById('dialog-document'),
    contact: document.getElementById('dialog-contact'),
    edital: document.getElementById('dialog-edital'),
    visit: document.getElementById('dialog-visit'),
  };

  document.getElementById('demo-banner').hidden = !SITE_CONFIG.demoMode;
  document.getElementById('year').textContent = new Date().getFullYear();

  // Botões gerais de contato (cabeçalho, hero, contato, flutuante, etc.), sem lote específico.
  document.querySelectorAll('[data-contact="general"]').forEach((link) => setWhatsappLink(link, { type: 'general' }));

  // Imagens estáticas do HTML também ganham o espaço reservado em caso de falha.
  document.querySelectorAll('img[data-fallback]').forEach(attachFallback);

  setupFilters();
  setupDialog();
  setupMenu();
  setupScrollSpy();
  setupFaq();
  renderContact();
  render();
}

// O script é carregado com "defer"; o DOM já está disponível aqui.
init();
