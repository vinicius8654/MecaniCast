// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("mainHeader");
    const rpmBar = document.getElementById("rpmBar");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const toggleLabel = menuToggle?.querySelector(".toggle-label");

    // 1. Barra de RPM e sombra no scroll
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (rpmBar) rpmBar.style.width = `${scrollPercent}%`;
        if (header) header.classList.toggle("scrolled", scrollTop > 20);
    });

    // 2. Menu Mobile
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");
            menuToggle.classList.toggle("is-open", isOpen);
            menuToggle.setAttribute("aria-expanded", isOpen);

            if (toggleLabel) toggleLabel.textContent = isOpen ? "FECHAR" : "MENU";
            document.body.style.overflow = isOpen ? "hidden" : "";
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 820 && mainNav.classList.contains("is-open")) {
                mainNav.classList.remove("is-open");
                menuToggle.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
                if (toggleLabel) toggleLabel.textContent = "MENU";
                document.body.style.overflow = "";
            }
        });
    }

    // 3. Renderização do Episódio Mais Recente na Home (index.html)
    const latestSection = document.getElementById("latestEpisodeSection");
    const listaEpisodios = typeof EPISODIOS !== "undefined"
        ? EPISODIOS
        : (typeof EPISODIOS_INICIAIS !== "undefined" ? EPISODIOS_INICIAIS : []);

    if (latestSection && listaEpisodios.length > 0) {
        const ep = listaEpisodios[0]; // Pega sempre o primeiro (mais novo)

        const escaparHTML = (texto) => {
            const div = document.createElement("div");
            div.textContent = texto || "";
            return div.innerHTML;
        };

        const extrairYoutubeId = (url) => {
            if (!url) return null;
            const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(regExp);
            return match ? match[1] : null;
        };

const ytId = extrairYoutubeId(ep.youtubeUrl);
        const capaSrc = (ep.capa && ep.capa.trim() !== "")
            ? ep.capa.trim()
            : (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : "assets/banner-mecanicast.png");
        const capaFallback = ytId
            ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
            : "assets/banner-mecanicast.png";

        latestSection.innerHTML = `
            <div class="latest-section-header">
                <span>TRANSMISSÃO EM DESTAQUE</span>
                <div>ÚLTIMO LANÇAMENTO</div>
            </div>

            <div class="update-banner">
                <div class="update-info">
                    <div class="update-badges">
                        <span class="badge-novo">NO AR // EP ${escaparHTML(ep.numero)}</span>
                        <span class="badge-meta">${escaparHTML(ep.categoria)} • ${escaparHTML(ep.data)}</span>
                    </div>
                    <h2>${escaparHTML(ep.titulo)}</h2>
                    <p class="update-guests">COM: ${escaparHTML(ep.convidados)}</p>
                    <p>${escaparHTML(ep.descricao)}</p>

                    <div class="update-actions">
                        <button type="button" class="btn-primario" id="btnWatchLatest">
                            ▶ ASSISTIR AGORA
                        </button>
                        <a href="episodios.html" class="btn-secundario">
                            TODOS OS EPISÓDIOS →
                        </a>
                    </div>
                </div>

                <div class="update-thumb" id="thumbWatchLatest" title="Assistir episódio">
                    <img src="${escaparHTML(capaSrc)}"
                         onload="if (this.naturalWidth === 120) {
                             if (!this.dataset.triedMq) {
                                 this.dataset.triedMq = '1';
                                 this.src = '${escaparHTML(capaFallback)}';
                             } else {
                                 this.src = 'assets/banner-mecanicast.png';
                             }
                         }"
                         onerror="if (!this.dataset.triedMq) {
                             this.dataset.triedMq = '1';
                             this.src = '${escaparHTML(capaFallback)}';
                         } else {
                             this.onerror = null;
                             this.src = 'assets/banner-mecanicast.png';
                         }"
                         alt="Capa do episódio ${escaparHTML(ep.titulo)}">
                    <div class="thumb-play-badge">▶ PLAY</div>
                </div>
            </div>
        `;

        // Controle do Modal de Vídeo na Home
        const videoModal = document.getElementById("videoModal");
        const youtubeIframe = document.getElementById("youtubeIframe");

        const abrirVideoHome = () => {
            if (!ytId) {
                alert("O vídeo deste episódio estará disponível em breve.");
                return;
            }
            document.getElementById("videoModalBadge").textContent = `// EP ${ep.numero} • ${ep.categoria}`;
            document.getElementById("videoModalTitle").textContent = ep.titulo;
            document.getElementById("videoModalGuests").textContent = `COM: ${ep.convidados}`;
            document.getElementById("btnExternalYoutube").href = ep.youtubeUrl;

            youtubeIframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
            videoModal.classList.add("is-open");
            document.body.style.overflow = "hidden";
        };

        const fecharVideoHome = () => {
            if (!videoModal) return;
            youtubeIframe.src = "";
            videoModal.classList.remove("is-open");
            document.body.style.overflow = "";
        };

        document.getElementById("btnWatchLatest")?.addEventListener("click", abrirVideoHome);
        document.getElementById("thumbWatchLatest")?.addEventListener("click", abrirVideoHome);
        document.getElementById("btnCloseVideo")?.addEventListener("click", fecharVideoHome);

        videoModal?.addEventListener("click", (e) => {
            if (e.target === videoModal) fecharVideoHome();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && videoModal?.classList.contains("is-open")) {
                fecharVideoHome();
            }
        });
    }
});
// Atualiza automaticamente o banner "NOVO EPISÓDIO NO AR" na Home com o 1º item de EPISODIOS
if (typeof EPISODIOS !== "undefined" && EPISODIOS.length > 0) {
    const maisRecente = EPISODIOS[0];
    const bannerTitle = document.querySelector(".update-info h2");
    const bannerDesc = document.querySelector(".update-info p");
    const bannerImg = document.querySelector(".update-thumb img");
    const bannerBadge = document.querySelector(".badge-novo");

    if (bannerTitle && bannerDesc) {
        if (bannerBadge) bannerBadge.textContent = `NOVO EPISÓDIO NO AR • EP ${maisRecente.numero}`;
        bannerTitle.textContent = maisRecente.titulo;
        bannerDesc.textContent = `Com ${maisRecente.convidados}. ${maisRecente.descricao}`;
    }

    if (bannerImg && maisRecente.capa) {
        bannerImg.src = maisRecente.capa;
    }
}