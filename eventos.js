const fotos = Array.from(document.querySelectorAll(".galeria img"));
const lightbox = document.getElementById("lightbox");
const imagemGrande = document.getElementById("imagemGrande");
const fechar = document.getElementById("fechar");
const anterior = document.getElementById("anterior");
const proxima = document.getElementById("proxima");

let indiceAtual = 0;

function abrirLightbox(index) {
  indiceAtual = index;
  imagemGrande.src = fotos[indiceAtual].src;
  lightbox.classList.add("ativo");
}

function fecharLightbox() {
  lightbox.classList.remove("ativo");
  imagemGrande.src = "";
}

function mostrarProxima() {
  indiceAtual++;

  if (indiceAtual >= fotos.length) {
    indiceAtual = 0;
  }

  imagemGrande.src = fotos[indiceAtual].src;
}

function mostrarAnterior() {
  indiceAtual--;

  if (indiceAtual < 0) {
    indiceAtual = fotos.length - 1;
  }

  imagemGrande.src = fotos[indiceAtual].src;
}

fotos.forEach((foto, index) => {
  foto.addEventListener("click", () => {
    abrirLightbox(index);
  });
});

fechar.addEventListener("click", fecharLightbox);
proxima.addEventListener("click", mostrarProxima);
anterior.addEventListener("click", mostrarAnterior);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    fecharLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("ativo")) return;

  if (event.key === "Escape") {
    fecharLightbox();
  }

  if (event.key === "ArrowRight") {
    mostrarProxima();
  }

  if (event.key === "ArrowLeft") {
    mostrarAnterior();
  }
});