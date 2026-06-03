const eventos = [
  {
    nome: "Encontro em homenagem ao dia das M&atilde;es",
    data: "10 de maio de 2026",
    local: "Pracinha Aeroporto - Curvelo MG",
    capa: "img/eventos/foto2.webp",
    descricao: "Registros do encontro em homenagem ao dia das M&atilde;es, reunindo fam&iacute;lias, amigos e cl&aacute;ssicos do CCC Car.",
    fotos: [
      "img/eventos/foto1.webp",
      "img/eventos/foto2.webp",
      "img/eventos/foto3.webp",
      "img/eventos/foto4.webp",
      "img/eventos/foto5.webp",
      "img/eventos/foto6.webp",
      "img/eventos/foto7.webp",
      "img/eventos/foto8.webp"
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

function caminhoSemExtensao(caminho) {
  return caminho.endsWith(".webp") ? caminho.slice(0, -5) : null;
}

function caminhoThumb(caminho) {
  const base = caminhoSemExtensao(caminho);
  return base ? `${base}-thumb.webp` : caminho;
}

function srcsetResponsivo(caminho) {
  const base = caminhoSemExtensao(caminho);
  if (!base) return "";
  return `${base}-480.webp 480w, ${base}.webp 960w, ${base}-1600.webp 1600w`;
}

function aplicarImagemResponsiva(elemento, caminho, sizes) {
  if (!caminho) {
    elemento.removeAttribute("src");
    elemento.removeAttribute("srcset");
    elemento.removeAttribute("sizes");
    return;
  }

  elemento.src = caminho;
  const srcset = srcsetResponsivo(caminho);
  if (srcset) {
    elemento.srcset = srcset;
    elemento.sizes = sizes;
  } else {
    elemento.removeAttribute("srcset");
    elemento.removeAttribute("sizes");
  }
  elemento.loading = "lazy";
  elemento.decoding = "async";
}

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
          <img
            src="${caminhoThumb(evento.capa)}"
            srcset="${srcsetResponsivo(evento.capa)}"
            sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 360px"
            loading="lazy"
            decoding="async"
            alt="Capa do evento ${removerHtml(evento.nome)}"
          >
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
  aplicarImagemResponsiva(albumMainImage, eventoAtual.fotos[fotoAtual], "(max-width: 720px) 92vw, 920px");
  albumMainImage.alt = `${removerHtml(eventoAtual.nome)} - foto ${fotoAtual + 1}`;

  albumThumbs.querySelectorAll("button").forEach((botao, botaoIndex) => {
    botao.classList.toggle("ativo", botaoIndex === fotoAtual);
  });

  if (lightbox.classList.contains("ativo")) {
    aplicarImagemResponsiva(lightboxImage, eventoAtual.fotos[fotoAtual], "(max-width: 720px) 96vw, 1200px");
  }

  atualizarContador();
}

function renderizarThumbs() {
  albumThumbs.innerHTML = eventoAtual.fotos.map((foto, index) => `
    <button class="thumb-button" type="button" data-foto-index="${index}" aria-label="Abrir foto ${index + 1}">
      <img src="${caminhoThumb(foto)}" loading="lazy" decoding="async" alt="">
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
    aplicarImagemResponsiva(albumMainImage, "", "");
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
  aplicarImagemResponsiva(lightboxImage, eventoAtual.fotos[fotoAtual], "(max-width: 720px) 96vw, 1200px");
  atualizarContador();
}

function fecharLightbox() {
  lightbox.classList.remove("ativo");
  aplicarImagemResponsiva(lightboxImage, "", "");
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
