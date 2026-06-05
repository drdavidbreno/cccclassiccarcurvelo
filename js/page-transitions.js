(function () {
  const style = document.createElement("style");
  style.textContent = `
    html {
      background: #000;
    }

    body {
      opacity: 0;
      transform: translateY(10px);
      transition:
        opacity 0.42s ease,
        transform 0.42s ease;
    }

    body.page-ready {
      opacity: 1;
      transform: translateY(0);
    }

    body.page-leaving {
      opacity: 0;
      transform: translateY(-8px);
      pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
      body {
        transition: none;
        transform: none;
      }

      body.page-leaving,
      body.page-ready {
        transform: none;
      }
    }
  `;
  document.head.appendChild(style);

  const isInternalPageLink = (link) => {
    if (!link || !link.href) return false;
    if (link.target && link.target !== "_self") return false;
    if (link.hasAttribute("download")) return false;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.hash) return false;

    return /\.(html)?$/i.test(url.pathname) || url.pathname.endsWith("/");
  };

  const showPage = () => {
    document.body.classList.add("page-ready");
  };

  window.addEventListener("pageshow", showPage);
  document.addEventListener("DOMContentLoaded", showPage);

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!isInternalPageLink(link)) return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    document.body.classList.add("page-leaving");

    window.setTimeout(() => {
      window.location.href = link.href;
    }, 260);
  });
})();
