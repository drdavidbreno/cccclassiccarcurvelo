const eventos = [
  {
    nome: "10&ordm; Encontro de Ve&iacute;culos Antigos",
    data: "20 de Julho de 2025",
    local: "Pra&ccedil;a Central - Curvelo/MG",
    capa: "img/eventos/foto2.jpg",
    descricao: "Um encontro marcante com motores, mem&oacute;ria e carros que atravessam gera&ccedil;&otilde;es.",
    fotos: [
      "img/eventos/foto1.jpg",
      "img/eventos/foto2.jpg",
      "img/eventos/foto3.jpg",
      "img/eventos/foto4.jpg",
      "img/eventos/foto5.jpg",
      "img/eventos/foto6.jpg",
      "img/eventos/foto7.jpg",
      "img/eventos/foto8.jpg"
    ]
  },
  {
    nome: "Noite dos Cl&aacute;ssicos",
    data: "14 de Setembro de 2025",
    local: "Centro Hist&oacute;rico - Curvelo/MG",
    capa: "img/eventos/foto4.jpg",
    descricao: "Uma noite para reunir amigos, fam&iacute;lias e m&aacute;quinas antigas sob as luzes da cidade.",
    fotos: [
      "img/eventos/foto4.jpg",
      "img/eventos/foto6.jpg",
      "img/eventos/foto8.jpg"
    ]
  },
  {
    nome: "Exposi&ccedil;&atilde;o Especial CCC",
    data: "18 e 19 de Julho de 2026",
    local: "Curvelo/MG",
    capa: "img/cartaz2026.jpg",
    descricao: "A pr&oacute;xima grande celebra&ccedil;&atilde;o do clube, preparada para receber novos registros hist&oacute;ricos.",
    fotos: []
  },
  {
    nome: "Passeio dos Antigos",
    data: "12 de Outubro de 2025",
    local: "Estrada Real - Minas Gerais",
    capa: "img/eventos/foto7.jpg",
    descricao: "Rota especial para colocar os cl&aacute;ssicos na estrada e guardar novas hist&oacute;rias sobre rodas.",
    fotos: [
      "img/eventos/foto7.jpg",
      "img/eventos/foto3.jpg",
      "img/eventos/foto5.jpg"
    ]
  }
];

const eventosGrid = document.getElementById("eventosGrid");
const albumPanel = document.getElementById("albumPanel");
const albumClose = document.getElementById("albumClose");
const albumBack = document.getElementById("albumBack");
const albumTitle = document.getElementById("albumTitle");
const albumMeta = document.getElementById("albumMeta");
const albumDescription = document.getElementById("albumDescription");
const albumEmpty = document.getElementById("albumEmpty");
const albumViewer = document.getElementById("albumViewer");
const albumMainImage = document.getElementById("albumMainImage");
const albumThumbs = document.getElementById("albumThumbs");
const albumPrev = document.getElementById("albumPrev");
const albumNext = document.getElementById("albumNext");
const photoCounter = document.getElementById("photoCounter");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxCounter = document.getElementById("lightboxCounter");

let eventoAtual = null;
let fotoAtual = 0;

function textoFotos(total) {
  if (total === 0) return "Fotos em breve";
  if (total === 1) return "1 foto";
  return `${total} fotos`;
}

function removerHtml(texto) {
  const elemento = document.createElement("span");
  elemento.innerHTML = texto;
  return elemento.textContent;
}

function criarMetaItem(icone, texto) {
  return `
    <span class="meta-item">
      <span aria-hidden="true">${icone}</span>
      ${texto}
    </span>
  `;
}

function renderizarEventos() {
  eventosGrid.innerHTML = eventos.map((evento, index) => `
    <article class="evento-card" style="--delay: ${index * 80}ms">
      <button class="evento-card-button" type="button" data-evento-index="${index}" aria-label="Abrir &aacute;lbum ${removerHtml(evento.nome)}">
        <span class="evento-cover">
          <img src="${evento.capa}" alt="Capa do evento ${removerHtml(evento.nome)}">
        </span>
        <span class="evento-card-body">
          <strong>${evento.nome}</strong>
          <span class="evento-meta-list">
            ${criarMetaItem("&#128197;", evento.data)}
            ${criarMetaItem("&#128205;", evento.local)}
            ${criarMetaItem("&#128247;", textoFotos(evento.fotos.length))}
          </span>
          <span class="evento-action">Ver &Aacute;lbum</span>
        </span>
      </button>
    </article>
  `).join("");
}

function atualizarContador() {
  if (!eventoAtual || eventoAtual.fotos.length === 0) return;

  const texto = `${fotoAtual + 1} / ${eventoAtual.fotos.length}`;
  photoCounter.textContent = texto;
  lightboxCounter.textContent = texto;
}

function selecionarFoto(index) {
  if (!eventoAtual || eventoAtual.fotos.length === 0) return;

  fotoAtual = (index + eventoAtual.fotos.length) % eventoAtual.fotos.length;
  albumMainImage.src = eventoAtual.fotos[fotoAtual];
  albumMainImage.alt = `${removerHtml(eventoAtual.nome)} - foto ${fotoAtual + 1}`;

  albumThumbs.querySelectorAll("button").forEach((botao, botaoIndex) => {
    botao.classList.toggle("ativo", botaoIndex === fotoAtual);
  });

  if (lightbox.classList.contains("ativo")) {
    lightboxImage.src = eventoAtual.fotos[fotoAtual];
  }

  atualizarContador();
}

function renderizarThumbs() {
  albumThumbs.innerHTML = eventoAtual.fotos.map((foto, index) => `
    <button class="thumb-button" type="button" data-foto-index="${index}" aria-label="Abrir foto ${index + 1}">
      <img src="${foto}" alt="">
    </button>
  `).join("");
}

function abrirAlbum(index) {
  eventoAtual = eventos[index];
  fotoAtual = 0;

  albumTitle.innerHTML = eventoAtual.nome;
  albumDescription.innerHTML = eventoAtual.descricao;
  albumMeta.innerHTML = `
    ${criarMetaItem("&#128197;", eventoAtual.data)}
    ${criarMetaItem("&#128205;", eventoAtual.local)}
    ${criarMetaItem("&#128247;", textoFotos(eventoAtual.fotos.length))}
  `;

  const temFotos = eventoAtual.fotos.length > 0;
  albumPanel.classList.add("ativo");
  albumEmpty.classList.toggle("ativo", !temFotos);
  albumViewer.classList.toggle("ativo", temFotos);
  albumThumbs.classList.toggle("ativo", temFotos);

  if (temFotos) {
    renderizarThumbs();
    selecionarFoto(0);
  } else {
    albumMainImage.src = "";
    albumThumbs.innerHTML = "";
  }

  albumPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function fecharAlbum() {
  albumPanel.classList.remove("ativo");
  fecharLightbox();
}

function abrirLightbox() {
  if (!eventoAtual || eventoAtual.fotos.length === 0) return;

  lightbox.classList.add("ativo");
  lightboxImage.src = eventoAtual.fotos[fotoAtual];
  atualizarContador();
}

function fecharLightbox() {
  lightbox.classList.remove("ativo");
  lightboxImage.src = "";
}

function proximaFoto() {
  selecionarFoto(fotoAtual + 1);
}

function fotoAnterior() {
  selecionarFoto(fotoAtual - 1);
}

eventosGrid.addEventListener("click", (event) => {
  const botao = event.target.closest("[data-evento-index]");
  if (!botao) return;
  abrirAlbum(Number(botao.dataset.eventoIndex));
});

albumThumbs.addEventListener("click", (event) => {
  const botao = event.target.closest("[data-foto-index]");
  if (!botao) return;
  selecionarFoto(Number(botao.dataset.fotoIndex));
});

albumMainImage.addEventListener("click", abrirLightbox);
albumPrev.addEventListener("click", fotoAnterior);
albumNext.addEventListener("click", proximaFoto);
albumClose.addEventListener("click", fecharAlbum);
albumBack.addEventListener("click", fecharAlbum);
lightboxClose.addEventListener("click", fecharLightbox);
lightboxPrev.addEventListener("click", fotoAnterior);
lightboxNext.addEventListener("click", proximaFoto);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    fecharLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!albumPanel.classList.contains("ativo")) return;

  if (event.key === "Escape") {
    if (lightbox.classList.contains("ativo")) {
      fecharLightbox();
      return;
    }
    fecharAlbum();
  }

  if (event.key === "ArrowRight") {
    proximaFoto();
  }

  if (event.key === "ArrowLeft") {
    fotoAnterior();
  }
});

renderizarEventos();
