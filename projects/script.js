const CATEGORY_COLORS = {
  "WordPress": "#5e9dff",
  "Laravel PHP": "#ff6b9d",
  "Mern & Next js": "#7ee08a",
  "Shopify": "#ffde59",
};

function initials(name){
  return name.split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();
}

function buildMockup(project, big){
  const height = big ? '260px' : '140px';
  if (project.image) {
    return `
      <div class="mockup has-image" style="height:${height}">
        <img src="${project.image}" alt="${project.name} preview" loading="lazy"
             onerror="this.parentElement.outerHTML = buildMockupFallback(${JSON.stringify(project.name)}, ${JSON.stringify(project.category)}, ${big});">
      </div>`;
  }
  return buildMockupFallback(project.name, project.category, big);
}

function buildMockupFallback(name, category, big){
  const color = CATEGORY_COLORS[category] || "#eee";
  const height = big ? '260px' : '140px';
  return `
    <div class="mockup no-preview" style="background:${color};height:${height}">
      <span class="mockup-initial" style="font-size:${big?'22px':'16px'}">${name}</span>
      <span class="mockup-badge">No preview available</span>
    </div>`;
}

const categories = ["All", ...Array.from(new Set(PROJECTS.map(p=>p.category)))];
let activeCategory = "All";
let searchTerm = "";

const tabsEl = document.getElementById("tabs");
const gridEl = document.getElementById("grid");
const countEl = document.getElementById("count");
const searchEl = document.getElementById("search");

function renderTabs(){
  tabsEl.innerHTML = categories.map(cat => `
    <button class="tab ${cat===activeCategory?'active':''}" data-cat="${cat}">${cat}</button>
  `).join("");
  tabsEl.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      activeCategory = btn.dataset.cat;
      renderTabs();
      renderGrid();
    });
  });
}

function renderGrid(){
  const filtered = PROJECTS.filter(p=>{
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  countEl.textContent = `${filtered.length} project${filtered.length!==1?'s':''}`;

  gridEl.innerHTML = filtered.map((p, i) => `
    <article class="card" data-index="${PROJECTS.indexOf(p)}">
      ${buildMockup(p, false)}
      <div class="card-body">
        <span class="card-tag" style="--tag-color:${CATEGORY_COLORS[p.category] || '#ffde59'}">${p.category}</span>
        <h3 class="card-title">${p.name}</h3>
        <p class="card-url">${p.url.replace(/^https?:\/\//,'')}</p>
      </div>
    </article>
  `).join("");

  gridEl.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("click", ()=>{
      openModal(PROJECTS[parseInt(card.dataset.index)]);
    });
  });
}

const modalOverlay = document.getElementById("modalOverlay");
const modalMockup = document.getElementById("modalMockup");
const modalTag = document.getElementById("modalTag");
const modalTitle = document.getElementById("modalTitle");
const modalUrl = document.getElementById("modalUrl");
const modalLink = document.getElementById("modalLink");

const modalCaseStudy = document.getElementById("modalCaseStudy");

function openModal(project){
  modalMockup.innerHTML = buildMockup(project, true);
  modalTag.textContent = project.category;
  modalTag.style.setProperty('--tag-color', CATEGORY_COLORS[project.category] || '#ffde59');
  modalTitle.textContent = project.name;
  modalUrl.textContent = project.url;
  modalLink.href = project.url;
  modalCaseStudy.textContent = project.caseStudy || "";
  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e)=>{
  if(e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape") closeModal();
});

searchEl.addEventListener("input", (e)=>{
  searchTerm = e.target.value;
  renderGrid();
});

document.getElementById("year").textContent = new Date().getFullYear();

renderTabs();
renderGrid();
