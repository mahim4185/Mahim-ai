const REPO_URL = 'https://github.com/Shubhamsaboo/awesome-llm-apps';
const state = {
  view: 'home', catalog: { items: [], categories: [] }, search: '', category: 'all',
  favorites: new Set(readJSON('mahim-favorites', [])),
  chatMessages: readJSON('mahim-chat-history', []), chatMode: 'general',
  document: null, apiConfigured: false, apiModel: '', pending: false
};
const main = document.getElementById('mainContent');
const viewLabels = { home: 'ওভারভিউ', catalog: 'অ্যাপ লাইব্রেরি', chat: 'AI চ্যাট', documents: 'ডকুমেন্ট Q&A', agents: 'Agent Studio' };
const iconPaths = {
  spark: '<path d="m12 3 1.6 6.1L20 11l-6.4 1.7L12 19l-1.6-6.3L4 11l6.4-1.9L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
  chat: '<path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.9 8.9 0 0 1-3.5-.7L4 20l1.3-3.8A7.1 7.1 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/><path d="M8.5 11.5h.01m3.5 0h.01m3.5 0h.01"/>',
  doc: '<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-11A1.5 1.5 0 0 1 5 19V5.5A2 2 0 0 1 7 3.5Z"/><path d="M14 3.8V8h4m-9 4h6m-6 3.5h6"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4.5 4.5"/>',
  external: '<path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  upload: '<path d="M12 16V4m-4 4 4-4 4 4"/><path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>',
  heart: '<path d="M20.8 8.8c0 5.1-8.8 10.2-8.8 10.2S3.2 13.9 3.2 8.8A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 8.8 1.4Z"/>',
  send: '<path d="m21 3-7.2 18-3.7-7.1L3 10.2 21 3Z"/><path d="M10.1 13.9 15 9"/>',
  clip: '<path d="m9 12.5 6.8-6.8a3 3 0 0 1 4.2 4.2l-8.5 8.5a5 5 0 0 1-7.1-7.1l8.1-8.1"/>',
  trash: '<path d="M4 7h16M10 11v6m4-6v6M5.5 7l.8 13h11.4l.8-13M9 7V4h6v3"/>',
  shield: '<path d="M12 3 3.5 7v5.5c0 4.3 3.6 7.5 8.5 9.5 4.9-2 8.5-5.2 8.5-9.5V7L12 3Z"/><path d="m9 12 2 2 4-4"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18"/>',
  bars: '<path d="M4 19V5m0 14h16"/><path d="M7 15l3-4 3 2 5-6"/>',
  brain: '<path d="M9 5a3 3 0 0 0-5 2 3.5 3.5 0 0 0-.5 6A3 3 0 0 0 6 18a3 3 0 0 0 5-1V7a2 2 0 0 0-2-2Zm6 0a3 3 0 0 1 5 2 3.5 3.5 0 0 1 .5 6A3 3 0 0 1 18 18a3 3 0 0 1-5-1V7a2 2 0 0 1 2-2Z"/><path d="M8 9h3m5 0h-3M8 14h3m5 0h-3"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8m-8 3h7"/>',
  mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0m-7 7v3m-4 0h8"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>'
};
function icon(name, cls = '') { return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.spark}</svg>`; }
function readJSON(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } }
function saveJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
function esc(value = '') { return String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[ch])); }
function cleanCategory(category = '') { return category.replace(/^[^A-Za-z0-9\u0980-\u09FF]+/, '').trim(); }
function categoryCount(category) { return state.catalog.items.filter(item => item.category === category).length; }
function colorFor(value = '') { const colors = ['violet','mint','peach','blue','rose']; let n=0; for (const ch of value) n=(n*31+ch.charCodeAt(0))>>>0; return colors[n%colors.length]; }
function findProject(term) { const q=term.toLowerCase(); return state.catalog.items.find(item => item.title.toLowerCase().includes(q)); }
function openSource(item) { return item?.source || REPO_URL; }

async function init() {
  try {
    const response = await fetch('/catalog.json');
    if (!response.ok) throw new Error('catalog unavailable');
    state.catalog = await response.json();
    document.getElementById('navProjectCount').textContent = state.catalog.items.length;
  } catch (error) {
    state.catalog = { items: [], categories: [] };
    showToast('প্রজেক্ট ক্যাটালগ লোড হয়নি। server.py দিয়ে অ্যাপটি চালু করুন।', 'error');
  }
  renderView();
  refreshApiStatus();
}
function updateBreadcrumb() {
  document.getElementById('breadcrumbPage').textContent = viewLabels[state.view] || 'ওভারভিউ';
  document.getElementById('breadcrumbSection').textContent = state.view === 'catalog' ? 'Discover' : state.view === 'chat' ? 'Create' : 'Workspace';
  document.querySelectorAll('.nav-item[data-view]').forEach(button => {
    const isShortcut = button.hasAttribute('data-category-shortcut');
    button.classList.toggle('active', !isShortcut && button.dataset.view === state.view);
    if (isShortcut) {
      const label = button.dataset.categoryShortcut || '';
      const active = state.view === 'catalog' && state.category !== 'all' && (state.category === label || cleanCategory(state.category).toLowerCase().includes(label.toLowerCase()));
      button.classList.toggle('active', active);
    }
  });
}
function navigate(view, options = {}) {
  state.view = view;
  if (options.resetFilters) { state.category = 'all'; state.search = ''; document.getElementById('globalSearch').value = ''; }
  if (options.category) { state.category = options.category; state.search = ''; document.getElementById('globalSearch').value = ''; }
  document.getElementById('sidebar').classList.remove('open');
  renderView();
  updateBreadcrumb();
}
function renderView() {
  updateBreadcrumb();
  if (state.view === 'catalog') main.innerHTML = renderCatalog();
  else if (state.view === 'chat') main.innerHTML = renderChat();
  else if (state.view === 'documents') main.innerHTML = renderDocuments();
  else if (state.view === 'agents') main.innerHTML = renderAgents();
  else main.innerHTML = renderHome();
  const globalSearch = document.getElementById('globalSearch');
  if (globalSearch && globalSearch.value !== state.search) globalSearch.value = state.search;
  if (state.view === 'chat') scrollChatToBottom();
}
function renderHome() {
  const featuredTerms = ['AI Travel Agent', 'AI Deep Research Agent', 'AI Data Analysis Agent', 'Chat with PDF', 'AI Financial Coach Agent', 'Voice RAG Agent'];
  const featured = featuredTerms.map(findProject).filter(Boolean).slice(0, 6);
  const count = state.catalog.items.length || 122;
  const cats = state.catalog.categories.length || 16;
  return `<div class="page-stack">
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-dot"></span> MAHIM AI · OPEN-SOURCE WORKSPACE</div>
        <h1>AI দিয়ে <em>ভাবনাকে</em><br>বাস্তবে আনুন।</h1>
        <p>Chat, document Q&amp;A আর agent workflow—এক জায়গায়। Awesome LLM Apps থেকে ১২২টি open-source project ঘেঁটে দেখুন, তারপর নিজের idea দিয়ে শুরু করুন।</p>
        <div class="hero-actions"><button class="btn btn-light" data-view="chat">${icon('chat')} AI চ্যাট শুরু করুন</button><button class="btn btn-ghost" data-action="go-catalog">লাইব্রেরি দেখুন ${icon('arrow')}</button></div>
        <div class="hero-foot"><strong>আপনার workspace.</strong><span>·</span><span>Open-source ideas</span><span>·</span><span>নিজের API key দিয়ে live AI</span></div>
      </div>
      <div class="hero-visual" aria-hidden="true"><div class="orbit one"></div><div class="orbit two"></div><div class="orbit three"></div><span class="orbit-dot"></span><span class="orbit-dot purple"></span><div class="hero-ai-card"><div class="ai-card-top"><div class="ai-card-logo">M</div><div><strong>Mahim AI</strong><small>your idea, in motion</small></div></div><div class="ai-wave">${Array.from({length:11},()=>'<i></i>').join('')}</div><div class="ai-card-foot"><b><span class="ai-card-status"></span>Ready to create</b><span>✦ 01</span></div></div></div>
    </section>
    <section class="stats-row" aria-label="Workspace stats">
      <div class="stat-card"><div class="stat-icon violet">${icon('grid')}</div><div class="stat-copy"><strong>${count}+</strong><span>Open-source app ideas</span></div></div>
      <div class="stat-card"><div class="stat-icon mint">${icon('bars')}</div><div class="stat-copy"><strong>${cats}</strong><span>বিভিন্ন category</span></div></div>
      <div class="stat-card"><div class="stat-icon peach">${icon('brain')}</div><div class="stat-copy"><strong>BYO</strong><span>নিজের model / API</span></div></div>
      <div class="stat-card"><div class="stat-icon blue">${icon('shield')}</div><div class="stat-copy"><strong>Local</strong><span>API key থাকে server-এ</span></div></div>
    </section>
    <section>
      <div class="section-heading"><div><h2>কোথা থেকে শুরু করবেন?</h2><p>আপনার কাজ অনুযায়ী একটি workspace বেছে নিন।</p></div></div>
      <div class="quick-grid">
        <button class="quick-card" data-view="chat" style="--icon-bg:#efedff;--icon-color:#6a61e4;--halo:#e9e6ff"><span class="quick-arrow">↗</span><span class="quick-icon">${icon('chat')}</span><h3>AI Chat</h3><p>প্রশ্ন করুন, ভাবনা refine করুন, live model যুক্ত করুন।</p></button>
        <button class="quick-card" data-view="documents" style="--icon-bg:#e9f8f3;--icon-color:#39a986;--halo:#e2f6ee"><span class="quick-arrow">↗</span><span class="quick-icon">${icon('doc')}</span><h3>Document Q&amp;A</h3><p>TXT, Markdown বা CSV ফাইল থেকে তথ্য খুঁজুন।</p></button>
        <button class="quick-card" data-view="agents" style="--icon-bg:#fff1e9;--icon-color:#d7855e;--halo:#fff0e7"><span class="quick-arrow">↗</span><span class="quick-icon">${icon('spark')}</span><h3>Agent Studio</h3><p>Research, travel ও data-agent template দিয়ে শুরু করুন।</p></button>
        <button class="quick-card" data-action="go-catalog" style="--icon-bg:#eaf3ff;--icon-color:#558fc9;--halo:#e8f2ff"><span class="quick-arrow">↗</span><span class="quick-icon">${icon('search')}</span><h3>সব project খুঁজুন</h3><p>RAG, voice, MCP, multi-agent—সব ১৬টি category browse করুন।</p></button>
      </div>
    </section>
    <section>
      <div class="section-heading"><div><h2>লাইব্রেরি থেকে বাছাই</h2><p>রিপোজিটরির কয়েকটি জনপ্রিয় starting point।</p></div><button class="text-link" data-action="go-catalog">সব ${count}টি project দেখুন ${icon('arrow')}</button></div>
      <div class="feature-grid">${featured.map(projectCard).join('')}</div>
    </section>
    <section class="repo-callout"><div class="repo-callout-icon">${icon('book')}</div><div class="repo-callout-copy"><strong>এটি একটি hub—সব ১২২টি repo project একসাথে deploy করা হয়নি।</strong><p>প্রতিটি source app-এর নিজস্ব dependency ও API setup আছে। Mahim AI-তে সবগুলো browse করুন; পছন্দের project-এর original source খুলুন।</p></div><a class="btn btn-primary" href="${REPO_URL}" target="_blank" rel="noopener">Source repository ${icon('external')}</a></section>
  </div>`;
}
function projectCard(item) {
  const favorite = state.favorites.has(item.id);
  return `<article class="project-card"><div class="project-card-top"><span class="project-symbol ${colorFor(item.id)}">${esc((item.title.match(/^\p{Extended_Pictographic}/u)||[])[0]||'✦')}</span><button class="favorite-btn ${favorite?'is-favorite':''}" data-action="favorite" data-id="${esc(item.id)}" aria-label="${favorite?'Unsave':'Save'} ${esc(item.title)}">${icon('heart')}</button></div><h3>${esc(item.title)}</h3><p>${esc(item.description || 'Open-source LLM application template.')}</p><div class="project-card-bottom"><span class="category-tag" title="${esc(item.category)}"><span class="tag-dot"></span>${esc(cleanCategory(item.category))}</span><a class="source-link" href="${esc(openSource(item))}" target="_blank" rel="noopener">Source ${icon('external')}</a></div></article>`;
}
function renderCatalog() {
  const count = state.catalog.items.length;
  const filtered = getFilteredItems();
  return `<div class="page-stack"><section><div class="page-header"><div><div class="page-kicker">THE OPEN-SOURCE LIBRARY</div><h1>অ্যাপ লাইব্রেরি</h1><p>Awesome LLM Apps repository থেকে ${count}টি project—category বা keyword দিয়ে খুঁজুন, তারপর original source-এ যান।</p></div><div class="header-actions"><a class="btn btn-light" href="${REPO_URL}" target="_blank" rel="noopener">GitHub-এ দেখুন ${icon('external')}</a></div></div>
    <div class="catalog-toolbar"><label class="catalog-search">${icon('search')}<input id="catalogSearch" type="search" placeholder="যেমন: RAG, travel, voice…" value="${esc(state.search)}" autocomplete="off"></label><span class="catalog-count" id="catalogCount">${filtered.length}টি result</span></div>
    <div class="filter-row" id="categoryFilters"><button class="filter-chip ${state.category==='all'?'active':''}" data-action="filter-category" data-category="all">সব project <small>${count}</small></button>${state.catalog.categories.map(cat=>`<button class="filter-chip ${state.category===cat?'active':''}" data-action="filter-category" data-category="${esc(cat)}">${esc(cleanCategory(cat))}<small>${categoryCount(cat)}</small></button>`).join('')}</div>
    <div class="catalog-grid" id="catalogGrid">${renderProjectResults(filtered)}</div>
    <div class="catalog-footnote">Project descriptions and source links are indexed from <a href="${REPO_URL}" target="_blank" rel="noopener">Shubhamsaboo/awesome-llm-apps</a> · Apache-2.0</div></section></div>`;
}
function getFilteredItems() {
  const q = state.search.trim().toLowerCase();
  return state.catalog.items.filter(item => {
    const categoryMatches = state.category === 'all' || item.category === state.category;
    const text = `${item.title} ${item.description} ${item.category}`.toLowerCase();
    return categoryMatches && (!q || text.includes(q));
  });
}
function renderProjectResults(items) {
  if (!items.length) return `<div class="empty-state"><strong>কোনো project পাওয়া যায়নি</strong><span>অন্য keyword বা category দিয়ে আবার চেষ্টা করুন।</span></div>`;
  return items.map(projectCard).join('');
}
function renderChat() {
  const modeLabels = { general: 'সাধারণ চ্যাট', research: 'রিসার্চ', travel: 'ট্রাভেল প্ল্যানার', writer: 'রাইটিং সহকারী', document: 'ডকুমেন্ট Q&A' };
  const banner = state.apiConfigured
    ? `<div class="chat-banner"><span class="status-dot"></span>Live AI connected${state.apiModel ? ` · ${esc(state.apiModel)}` : ''}${state.document && state.chatMode==='document' ? `<a href="#" data-action="remove-doc-context">${esc(state.document.name)} ×</a>` : ''}</div>`
    : `<div class="chat-banner"><span class="status-dot"></span>Demo mode — real AI চালাতে server-এর <code>.env</code> file-এ API key দিন।<a href="#" data-action="open-settings">Setup</a></div>`;
  const messageMarkup = state.chatMessages.map(messageMarkupOne).join('');
  const welcome = state.chatMessages.length ? '' : `<div class="chat-welcome"><div class="welcome-orb">${icon('spark')}</div><h2>আজ কী তৈরি করবেন?</h2><p>বাংলা বা English—যেভাবে স্বচ্ছন্দ, সেভাবেই লিখুন। Live AI-এর জন্য provider connect করুন, অথবা demo mode-এ workspace ঘুরে দেখুন।</p><div class="suggestion-grid"><button class="suggestion" data-action="suggest-prompt" data-mode="research" data-prompt="একটি নতুন AI study planner idea নিয়ে research plan তৈরি করো।"><span>RESEARCH</span>একটি idea নিয়ে research plan করো</button><button class="suggestion" data-action="suggest-prompt" data-mode="travel" data-prompt="রংপুর থেকে কক্সবাজারে ৩ দিনের একটি বাজেট-সচেতন ভ্রমণ পরিকল্পনা দাও।"><span>TRAVEL</span>৩ দিনের ভ্রমণ পরিকল্পনা বানাও</button><button class="suggestion" data-action="suggest-prompt" data-mode="writer" data-prompt="আমার ছোট ব্যবসার জন্য একটি আকর্ষণীয় বাংলা social media post লিখো।"><span>WRITE</span>একটি বাংলা social post লিখো</button><button class="suggestion" data-action="suggest-prompt" data-mode="general" data-prompt="এই repository-র AI app ideas থেকে নতুন কী বানানো যায়?"><span>IDEATE</span>নতুন app idea brainstorm করো</button></div></div>`;
  const pending = state.pending ? `<div class="chat-message assistant"><div class="message-avatar">M</div><div class="message-content"><div class="message-meta">Mahim AI · লিখছে</div><div class="message-bubble is-pending">উত্তর তৈরি হচ্ছে <span class="typing-dots"><i></i><i></i><i></i></span></div></div></div>` : '';
  return `<div class="page-stack"><div class="page-header"><div><div class="page-kicker">YOUR AI ASSISTANT</div><h1>AI Chat</h1><p>নিজের OpenAI-compatible model দিয়ে live conversation করুন। Provider না থাকলে interface demo mode-এ থাকবে।</p></div><div class="header-actions"><button class="btn btn-light" data-action="open-settings">${icon('bolt')} Provider setup</button></div></div>
    <div class="chat-layout"><section class="chat-panel"><div class="chat-panel-head"><div class="chat-agent-title"><span class="chat-agent-avatar">M</span><span><strong>Mahim Assistant</strong><small>${state.apiConfigured?'Connected model':'Workspace preview'}</small></span></div><div class="chat-head-actions"><select id="chatMode" class="mode-select" aria-label="Chat mode">${Object.entries(modeLabels).map(([value,label])=>`<option value="${value}" ${state.chatMode===value?'selected':''}>${esc(label)}</option>`).join('')}</select><button class="icon-button" data-action="clear-chat" title="Clear chat" aria-label="Clear chat">${icon('trash')}</button></div></div>
      ${banner}<div class="chat-scroll" id="chatScroll">${welcome}${messageMarkup}${pending}</div>
      <div class="chat-composer-wrap">${state.document && state.chatMode==='document'?`<div class="doc-context-chip">${icon('doc')} Context: ${esc(state.document.name)} <button data-action="remove-doc-context" aria-label="Remove document">×</button></div>`:''}<form class="chat-composer" id="chatForm"><textarea id="chatInput" rows="2" placeholder="আপনার প্রশ্ন লিখুন…" ${state.pending?'disabled':''}></textarea><div class="composer-bottom"><span class="composer-hint">Enter পাঠাবে · Shift + Enter নতুন লাইন</span><div class="composer-tools"><button type="button" class="attach-btn" data-action="go-documents" title="Document যোগ করুন" aria-label="Add document">${icon('clip')}</button><button class="send-btn" type="submit" aria-label="Send message" ${state.pending?'disabled':''}>${icon('send')}</button></div></div></form></div></section>
      <aside class="chat-side"><section class="side-panel-card"><h3>এই workspace</h3><p>Mahim AI repo-র বিভিন্ন pattern একত্র করেছে। Source code আলাদা project হিসেবে run করতে হবে।</p><div class="provider-mini"><span class="provider-mini-logo">${state.apiConfigured?'AI':'M'}</span><div><strong>${state.apiConfigured?esc(state.apiModel||'Connected model'):'API provider'}</strong><small>${state.apiConfigured?'Live connection':'Not connected yet'}</small></div></div><button class="side-link" data-action="open-settings">${state.apiConfigured?'Provider details':'API configure করুন'} →</button></section>
      <section class="side-panel-card"><h3>Try a prompt</h3><div class="suggested-prompts"><button class="mini-prompt" data-action="suggest-prompt" data-mode="research" data-prompt="AI agents কীভাবে ছোট ব্যবসার customer support উন্নত করতে পারে? একটি সংক্ষিপ্ত research brief দাও।">একটি research brief তৈরি করো</button><button class="mini-prompt" data-action="suggest-prompt" data-mode="travel" data-prompt="ঢাকা থেকে সিলেটের জন্য ২ দিনের ভ্রমণ itinerary বানাও।">একটি travel itinerary বানাও</button><button class="mini-prompt" data-action="suggest-prompt" data-mode="writer" data-prompt="Mahim AI launch-এর জন্য একটি ছোট বাংলা product announcement লিখো।">Product announcement লিখো</button></div></section>
      <section class="side-panel-card"><div class="privacy-note">${icon('shield')}<span>API key browser-এ রাখা হয় না। Document text কেবল প্রশ্ন পাঠালে configured provider-এ যায়।</span></div></section></aside></div></div>`;
}
function messageMarkupOne(message) {
  const role = message.role === 'user' ? 'user' : 'assistant';
  const label = role === 'user' ? 'আপনি' : 'Mahim AI';
  return `<div class="chat-message ${role}"><div class="message-avatar">${role==='user'?'M':'✦'}</div><div class="message-content"><div class="message-meta">${label}${message.demo?' · demo':''}</div><div class="message-bubble">${esc(message.content)}</div></div></div>`;
}
function renderDocuments() {
  const doc = state.document;
  return `<div class="page-stack"><div class="page-header"><div><div class="page-kicker">RETRIEVAL · YOUR FILES</div><h1>Document Q&amp;A</h1><p>একটি text file যোগ করুন, তারপর Mahim AI-কে সেটির তথ্য নিয়ে প্রশ্ন করুন। এই light build-এ browser-এ TXT, MD, CSV ও JSON পড়া হয়।</p></div><div class="header-actions"><button class="btn btn-light" data-action="go-catalog">RAG examples দেখুন ${icon('external')}</button></div></div>
    <div class="docs-layout"><section class="upload-panel"><div class="upload-drop" id="uploadDrop" data-action="choose-file"><div class="upload-icon">${icon('upload')}</div><h2>${doc?'আরেকটি file যোগ করুন':'আপনার document এখানে যোগ করুন'}</h2><p>File-এ click করুন বা drag-and-drop করুন। TXT, Markdown, CSV, JSON — সর্বোচ্চ 200 KB.</p><button type="button" class="btn btn-primary">${icon('upload')} File বেছে নিন</button><small>File আপনার browser-এই পড়া হবে; প্রশ্ন পাঠালে content configured AI provider-এ যাবে।</small><input id="docFile" type="file" accept=".txt,.md,.csv,.json,.log,text/plain,text/csv,application/json" hidden></div>
      ${doc?`<div class="file-card"><span class="file-icon">${esc(doc.name.split('.').pop().slice(0,4).toUpperCase()||'TXT')}</span><div class="file-info"><strong>${esc(doc.name)}</strong><small>${formatBytes(doc.size)} · ${doc.text.length.toLocaleString()} characters loaded</small></div><button class="file-remove" data-action="remove-document" aria-label="Remove file">×</button></div><button class="btn btn-primary doc-ask" data-action="ask-document">${icon('chat')} এই document-কে প্রশ্ন করুন</button><div class="doc-preview"><h3>Text preview</h3><p>${esc(doc.text.slice(0,1800))}${doc.text.length>1800?'…':''}</p></div>`:''}
      </section><aside class="doc-help-panel"><h2>কীভাবে কাজ করে</h2><p>এই prototype-এ text extraction browser-এ হয়; live model যুক্ত থাকলে প্রশ্নের সঙ্গে document context server-এ পাঠানো হয়।</p><div class="doc-feature-list"><div class="doc-feature"><span class="doc-check">✓</span><div><strong>TXT · Markdown · CSV · JSON</strong><small>UTF-8 text file upload সমর্থিত; PDF parsing এই build-এ নেই।</small></div></div><div class="doc-feature"><span class="doc-check">✓</span><div><strong>Provider আপনার নিয়ন্ত্রণে</strong><small>API key server-side environment variable থেকে আসে।</small></div></div><div class="doc-feature"><span class="doc-check">✓</span><div><strong>শুধু প্রয়োজনের সময় পাঠান</strong><small>Upload করলে file নিজে থেকে বাইরে যায় না। Ask করলে selected text পাঠানো হয়।</small></div></div></div><div class="doc-caution"><strong>Privacy note</strong>গোপন বা সংবেদনশীল document ব্যবহার করার আগে provider-এর data policy যাচাই করুন। Demo mode-এ file text বাইরে পাঠানো হয় না।</div></aside></div><section class="repo-callout"><div class="repo-callout-icon">${icon('book')}</div><div class="repo-callout-copy"><strong>আরও advanced RAG pattern দেখতে চান?</strong><p>Original repo-তে citations, hybrid search, multimodal RAG ও local models-এর tutorial আছে।</p></div><button class="btn btn-primary" data-category-shortcut="RAG (Retrieval Augmented Generation)" data-action="open-rag">RAG library খুলুন ${icon('arrow')}</button></section></div>`;
}
function formatBytes(bytes) { if (bytes < 1024) return `${bytes} B`; return `${(bytes/1024).toFixed(1)} KB`; }
function renderAgents() {
  const definitions = [
    { title:'Deep Researcher', project:'AI Deep Research Agent', icon:'⌕', category:'Research', prompt:'এই topic নিয়ে একটি structured research brief তৈরি করো: [topic লিখুন]. সম্ভাব্য প্রশ্ন, key themes, এবং next steps দেখাও।', mode:'research' },
    { title:'Travel Architect', project:'AI Travel Agent', icon:'✈', category:'Planning', prompt:'আমার জন্য একটি practical travel itinerary বানাও। Starting city: Rangpur. Destination: [গন্তব্য]. Duration: [দিন]. Budget: [budget].', mode:'travel' },
    { title:'Data Analyst', project:'AI Data Analysis Agent', icon:'▥', category:'Data', prompt:'আমি একটি CSV file বিশ্লেষণ করতে চাই। কী কী pattern, outlier, এবং useful summary দেখা উচিত তা একটি analysis plan-এ সাজাও।', mode:'general' },
    { title:'Document Researcher', project:'Chat with PDF', icon:'▤', category:'RAG', prompt:'এই নথির মূল বক্তব্য কী? সবচেয়ে গুরুত্বপূর্ণ ৫টি point, প্রমাণ, এবং open question আলাদা করো।', mode:'document' },
    { title:'Financial Coach', project:'AI Financial Coach Agent', icon:'⌁', category:'Planning', prompt:'ব্যক্তিগত budget গুছিয়ে নেওয়ার জন্য আমাকে ধাপে ধাপে প্রশ্ন করো; আগে income, fixed cost, savings goal জেনে নাও।', mode:'general' },
    { title:'Voice Knowledge Agent', project:'Voice RAG Agent', icon:'◖', category:'Voice', prompt:'এই knowledge base-এ কী আছে তা সহজ ভাষায় বুঝিয়ে বলো এবং প্রশ্নের উত্তর দাও।', mode:'general' }
  ];
  return `<div class="page-stack"><div class="page-header"><div><div class="page-kicker">AGENT TEMPLATES</div><h1>Agent Studio</h1><p>Repository-র বাস্তব agent project থেকে inspired prompt template—এক click-এ chat workspace-এ নিন।</p></div><button class="btn btn-light" data-action="go-catalog">সব agent browse করুন ${icon('arrow')}</button></div>
    <section class="agent-hero"><div class="agent-hero-copy"><div class="page-kicker">IDEA → WORKFLOW</div><h2>একটি role বেছে নিন, তারপর নিজের task দিন।</h2><p>এখানকার template-গুলো starter prompt; এগুলো source app-এর full backend নয়। Original code প্রতিটি card-এর source link-এ পাবেন।</p></div><div class="agent-hero-art" aria-hidden="true"><span class="agent-node">⌕</span><i class="agent-line"></i><span class="agent-node">✦</span><i class="agent-line"></i><span class="agent-node">◈</span></div></section>
    <section class="template-grid">${definitions.map(def=>{ const project=findProject(def.project); return `<article class="template-card"><div class="template-mark">${esc(def.icon)}</div><div class="template-copy"><h3>${esc(def.title)}</h3><p>${esc(project?.description || 'A reusable AI agent workflow starter.')}</p><div class="template-footer"><span class="category-tag"><span class="tag-dot"></span>${esc(def.category)}${project?' · repo template':''}</span><div style="display:flex;gap:6px;align-items:center"><button class="template-launch" data-action="use-template" data-mode="${esc(def.mode)}" data-prompt="${esc(def.prompt)}">Try template →</button>${project?`<a class="source-link" href="${esc(openSource(project))}" target="_blank" rel="noopener" aria-label="Open source project">${icon('external')}</a>`:''}</div></div></div></article>`;}).join('')}</section>
    <section class="repo-callout"><div class="repo-callout-icon">${icon('spark')}</div><div class="repo-callout-copy"><strong>Multi-agent, MCP, voice—আরও workflow আছে।</strong><p>সব category ও source code দেখতে app library ব্যবহার করুন।</p></div><button class="btn btn-primary" data-action="go-catalog">পুরো library দেখুন ${icon('arrow')}</button></section></div>`;
}
function showToast(text, type = '') {
  const root = document.getElementById('toastStack');
  const toast = document.createElement('div'); toast.className = `toast ${type}`; toast.textContent = text; root.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
function setApiStatus(configured, model = '') {
  state.apiConfigured = Boolean(configured); state.apiModel = model || '';
  const chip = document.getElementById('connectionChip');
  const label = document.getElementById('connectionLabel');
  if (chip && label) { chip.classList.toggle('is-live', state.apiConfigured); label.textContent = state.apiConfigured ? 'Live AI' : 'Demo mode'; }
  const status = document.getElementById('providerStatus');
  if (status) {
    status.classList.toggle('is-live', state.apiConfigured);
    status.innerHTML = `<span class="status-dot"></span><div><strong>${state.apiConfigured?'Live provider connected':'Demo mode · provider not connected'}</strong><small>${state.apiConfigured?`Model: ${esc(state.apiModel||'configured in server')}`:'আপনার key browser-এ সংরক্ষণ করা হয় না।'}</small></div>`;
  }
}
async function refreshApiStatus() {
  try { const response=await fetch('/api/status'); const data=await response.json(); setApiStatus(data.configured, data.model); }
  catch { setApiStatus(false, ''); }
}
function showSettings() { document.getElementById('settingsModal').hidden = false; refreshApiStatus(); }
function closeSettings() { document.getElementById('settingsModal').hidden = true; }
function saveChat() { saveJSON('mahim-chat-history', state.chatMessages.slice(-40)); }
function scrollChatToBottom() { const scroller=document.getElementById('chatScroll'); if (scroller) scroller.scrollTop=scroller.scrollHeight; }
function setPrompt(prompt, mode = 'general') {
  state.chatMode = mode;
  navigate('chat');
  const input = document.getElementById('chatInput');
  if (input) { input.value = prompt; input.focus(); input.setSelectionRange(input.value.length,input.value.length); }
}
function relevantProject(text) {
  const words = text.toLowerCase().split(/[^a-z0-9\u0980-\u09ff]+/).filter(word=>word.length>3);
  let best = null, bestScore = 0;
  for (const item of state.catalog.items) {
    const corpus = `${item.title} ${item.description} ${item.category}`.toLowerCase();
    const score = words.reduce((sum,word)=>sum+(corpus.includes(word)?1:0),0);
    if (score>bestScore) { best=item; bestScore=score; }
  }
  if (bestScore===0) return findProject('AI Deep Research Agent') || state.catalog.items[0];
  return best;
}
function demoReply(question) {
  if (state.chatMode === 'document' && state.document) {
    const terms = question.toLowerCase().split(/[^a-z0-9\u0980-\u09ff]+/).filter(word=>word.length>2);
    const chunks = state.document.text.split(/(?<=[.!?।])\s+|\n+/).map(s=>s.trim()).filter(Boolean);
    const matches = chunks.map(s=>({s,score:terms.reduce((n,w)=>n+(s.toLowerCase().includes(w)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,4);
    const excerpt = matches.length ? matches.map(x=>`• ${x.s.slice(0,450)}`).join('\n') : state.document.text.slice(0,650);
    return `এটি Mahim AI-এর local demo retrieval—লাইভ model নয়। “${state.document.name}” থেকে keyword-ভিত্তিক সম্ভাব্য মিল:\n\n${excerpt}\n\nআরও নির্ভুল উত্তর, reasoning ও citations পেতে Settings-এ server-side API configure করুন।`;
  }
  const match = relevantProject(question);
  return `এটি Mahim AI-এর demo mode—আপনার prompt কোনো AI provider-এ পাঠানো হয়নি।\n\nPrompt: “${question.slice(0,260)}”\n\nএই idea দিয়ে শুরু করতে পারেন: ${match?match.title:'Awesome LLM Apps library'}. ${match?.description||'Library-তে open-source LLM app template দেখুন.'}\n\nLive AI উত্তর পেতে Settings-এ provider যোগ করুন; আপনার API key server-side থাকবে।`;
}
async function sendChat(event) {
  event?.preventDefault();
  const input=document.getElementById('chatInput');
  if (!input || state.pending) return;
  const text=input.value.trim();
  if (!text) return;
  if (state.chatMode==='document' && !state.document) { showToast('আগে একটি document যোগ করুন।','error'); return; }
  state.chatMessages.push({role:'user',content:text});
  state.pending=true; saveChat(); renderView();
  let answer=''; let isDemo=!state.apiConfigured;
  try {
    if (state.apiConfigured) {
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:state.chatMessages.filter(m=>m.role==='user'||m.role==='assistant').slice(-16).map(m=>({role:m.role,content:m.content})),mode:state.chatMode,context:state.chatMode==='document'?state.document?.text||'':''})});
      const data=await response.json();
      if (!response.ok) throw new Error(data.error||`Request failed (${response.status})`);
      answer=data.reply||'কোনো উত্তর পাওয়া যায়নি।';
    } else answer=demoReply(text);
  } catch (error) {
    answer=`AI request ব্যর্থ হয়েছে: ${error.message}\n\nProvider setup এবং model name Settings-এ যাচাই করুন।`;
    isDemo=true;
  }
  state.chatMessages.push({role:'assistant',content:answer,demo:isDemo});
  state.pending=false; saveChat(); renderView();
}
function removeDocument() { state.document=null; if(state.chatMode==='document') state.chatMode='general'; renderView(); showToast('Document context সরানো হয়েছে।'); }
async function loadDocument(file) {
  if (!file) return;
  const allowed=/\.(txt|md|csv|json|log)$/i.test(file.name);
  if (!allowed) { showToast('TXT, MD, CSV, JSON বা LOG file দিন।','error'); return; }
  if (file.size>200*1024) { showToast('File সর্বোচ্চ 200 KB হতে পারে।','error'); return; }
  try {
    const text=await file.text();
    if (!text.trim()) { showToast('File-এ কোনো text পাওয়া যায়নি।','error'); return; }
    state.document={name:file.name,text:text.slice(0,100000),size:file.size};
    renderView(); showToast('Document browser-এ load হয়েছে।','success');
  } catch { showToast('এই file পড়া যায়নি।','error'); }
}
function handleClick(event) {
  const viewButton=event.target.closest('[data-view]');
  if (viewButton) { event.preventDefault(); navigate(viewButton.dataset.view, {resetFilters:viewButton.dataset.view==='catalog'}); return; }
  const actionButton=event.target.closest('[data-action]');
  if (!actionButton) return;
  const action=actionButton.dataset.action;
  if(action==='go-catalog'){navigate('catalog',{resetFilters:true});return;}
  if(action==='go-documents'){navigate('documents');return;}
  if(action==='open-settings'){event.preventDefault();showSettings();return;}
  if(action==='close-settings'){closeSettings();return;}
  if(action==='filter-category'){state.category=actionButton.dataset.category;renderView();return;}
  if(action==='favorite'){
    const id=actionButton.dataset.id;
    if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);
    saveJSON('mahim-favorites',[...state.favorites]);
    if(state.view==='catalog'){
      const grid=document.getElementById('catalogGrid');if(grid)grid.innerHTML=renderProjectResults(getFilteredItems());
    } else renderView();
    return;
  }
  if(action==='suggest-prompt'){setPrompt(actionButton.dataset.prompt||'',actionButton.dataset.mode||'general');return;}
  if(action==='use-template'){setPrompt(actionButton.dataset.prompt||'',actionButton.dataset.mode||'general');return;}
  if(action==='clear-chat'){state.chatMessages=[];saveChat();renderView();showToast('Chat history মুছে ফেলা হয়েছে।');return;}
  if(action==='choose-file'){document.getElementById('docFile')?.click();return;}
  if(action==='remove-document'||action==='remove-doc-context'){removeDocument();return;}
  if(action==='ask-document'){
    if(!state.document){showToast('আগে একটি document upload করুন।','error');return;}
    state.chatMode='document';navigate('chat');
    const input=document.getElementById('chatInput');if(input){input.value='এই document-এর মূল বক্তব্য কী? সবচেয়ে গুরুত্বপূর্ণ বিষয়গুলো সংক্ষেপে বলো।';input.focus();}
    return;
  }
  if(action==='open-rag'){
    const category=state.catalog.categories.find(cat=>cleanCategory(cat).toLowerCase().startsWith('rag'));
    navigate('catalog',{category:category||'all'});return;
  }
}
function handleInput(event) {
  if(event.target.id==='catalogSearch'){
    state.search=event.target.value;
    const grid=document.getElementById('catalogGrid');if(grid)grid.innerHTML=renderProjectResults(getFilteredItems());
    const count=document.getElementById('catalogCount');if(count)count.textContent=`${getFilteredItems().length}টি result`;
  }
}
function handleChange(event) {
  if(event.target.id==='chatMode'){state.chatMode=event.target.value;renderView();return;}
  if(event.target.id==='docFile'){
    const file=event.target.files?.[0];loadDocument(file);event.target.value='';
  }
}
function handleSubmit(event) { if(event.target.id==='chatForm')sendChat(event); }
main.addEventListener('click',handleClick);
main.addEventListener('input',handleInput);
main.addEventListener('change',handleChange);
main.addEventListener('submit',handleSubmit);
main.addEventListener('keydown',event=>{
  if(event.target.id==='chatInput'&&event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat();}
});
main.addEventListener('dragover',event=>{const drop=event.target.closest('#uploadDrop');if(drop){event.preventDefault();drop.classList.add('drag-over');}});
main.addEventListener('dragleave',event=>{const drop=event.target.closest('#uploadDrop');if(drop)drop.classList.remove('drag-over');});
main.addEventListener('drop',event=>{const drop=event.target.closest('#uploadDrop');if(drop){event.preventDefault();drop.classList.remove('drag-over');loadDocument(event.dataTransfer.files?.[0]);}});

document.addEventListener('click',event=>{
  const globalView=event.target.closest('[data-view]');
  if(globalView && !main.contains(globalView)){
    event.preventDefault();
    const requested=globalView.dataset.categoryShortcut;
    if(requested){
      const category=state.catalog.categories.find(cat=>cat===requested||cleanCategory(cat).toLowerCase().includes(requested.toLowerCase()))||'all';
      navigate('catalog',{category});
    } else navigate(globalView.dataset.view,{resetFilters:globalView.dataset.view==='catalog'});
    return;
  }
  const shortcut=event.target.closest('[data-category-shortcut]');
  if(shortcut && !shortcut.hasAttribute('data-action')){
    const requested=shortcut.dataset.categoryShortcut||'';
    const category=state.catalog.categories.find(cat=>cat===requested||cleanCategory(cat).toLowerCase().includes(requested.toLowerCase()))||'all';
    navigate('catalog',{category});
  }
  if(event.target===document.getElementById('settingsModal'))closeSettings();
});
document.getElementById('globalSearch').addEventListener('input',event=>{
  state.search=event.target.value;state.category='all';
  if(state.search && state.view!=='catalog')navigate('catalog');
  else if(state.view==='catalog'){
    const local=document.getElementById('catalogSearch');if(local)local.value=state.search;
    const grid=document.getElementById('catalogGrid');if(grid)grid.innerHTML=renderProjectResults(getFilteredItems());
    const count=document.getElementById('catalogCount');if(count)count.textContent=`${getFilteredItems().length}টি result`;
  }
});
document.addEventListener('keydown',event=>{
  if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();document.getElementById('globalSearch').focus();}
  if(event.key==='Escape'){closeSettings();document.getElementById('sidebar').classList.remove('open');}
});
document.getElementById('mobileMenu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
init();
