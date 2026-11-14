document.addEventListener("DOMContentLoaded", () => {
    // Aceita tanto EPISODIOS quanto EPISODIOS_INICIAIS
    const episodios = typeof EPISODIOS !== "undefined"
        ? EPISODIOS
        : (typeof EPISODIOS_INICIAIS !== "undefined" ? EPISODIOS_INICIAIS : []);

    let categoriaAtiva = "TODOS";
    let termoBusca = "";

    const episodesList = document.getElementById("episodesList");
    const episodeCounter = document.getElementById("episodeCounter");
    const searchInput = document.getElementById("searchInput");
    const filterTabs = document.getElementById("filterTabs");

    const videoModal = document.getElementById("videoModal");
    const youtubeIframe = document.getElementById("youtubeIframe");
    const videoModalBadge = document.getElementById("videoModalBadge");
    const videoModalTitle = document.getElementById("videoModalTitle");
    const videoModalGuests = document.getElementById("videoModalGuests");
    const btnExternalYoutube = document.getElementById("btnExternalYoutube");

    function escaparHTML(texto) {
        const div = document.createElement("div");
        div.textContent = texto || "";
        return div.innerHTML;
    }

    function extrairYoutubeId(url) {
        if (!url) return null;
        const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    function obterCapaEpisodio(ep) {
        if (ep.capa && ep.capa.trim() !== "") {
            return { src: ep.capa.trim(), fallback: "assets/banner-mecanicast.png" };
        }
        const ytId = extrairYoutubeId(ep.youtubeUrl);
        if (ytId) {
            return {
                src: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
                fallback: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
            };
        }
        return { src: "assets/banner-mecanicast.png", fallback: "assets/banner-mecanicast.png" };
    }

    function renderizarEpisodios() {
        const filtrados = episodios
            .map((ep, index) => ({ ...ep, _idx: index }))
            .filter(ep => {
                const bateCategoria = categoriaAtiva === "TODOS" || ep.categoria === categoriaAtiva;
                const textoCompleto = `${ep.numero} ${ep.titulo} ${ep.convidados} ${ep.descricao}`.toLowerCase();
                return bateCategoria && textoCompleto.includes(termoBusca.toLowerCase());
            });

        episodeCounter.textContent = `${String(filtrados.length).padStart(2, "0")} EPISÓDIO${filtrados.length === 1 ? "" : "S"}`;

        if (filtrados.length === 0) {
            episodesList.innerHTML = `<div class="empty-state">// NENHUM EPISÓDIO ENCONTRADO PARA ESTE FILTRO.</div>`;
            return;
        }

        episodesList.innerHTML = filtrados.map(ep => {
            const capaObj = obterCapaEpisodio(ep);
            return `
                <article class="episode-card">
                    <div class="ep-number-col">
                        <span class="ep-label">EP //</span>
                        <span class="ep-num">${escaparHTML(ep.numero)}</span>
                    </div>

                    <div class="ep-thumb-col" data-watch="${ep._idx}">
                        <img src="${escaparHTML(capaObj.src)}"
                             onerror="this.onerror=null; this.src='${escaparHTML(capaObj.fallback)}';"
                             alt="Capa do episódio ${escaparHTML(ep.titulo)}">
                        <div class="ep-thumb-overlay">
                            <span class="ep-thumb-play-icon">▶ ASSISTIR</span>
                        </div>
                    </div>

                    <div class="ep-body-col">
                        <div class="ep-meta-top">
                            <span class="ep-tag">${escaparHTML(ep.categoria)}</span>
                            <span class="ep-date">${escaparHTML(ep.data)}</span>
                            <span class="ep-duration">• ${escaparHTML(ep.duracao)}</span>
                        </div>
                        <h2 class="ep-title">${escaparHTML(ep.titulo)}</h2>
                        <div class="ep-guests">COM: ${escaparHTML(ep.convidados)}</div>
                        <p class="ep-desc">${escaparHTML(ep.descricao)}</p>
                    </div>

                    <div class="ep-actions-col">
                        <button type="button" class="btn-play-ep" data-watch="${ep._idx}">
                            ▶ ASSISTIR EPISÓDIO
                        </button>
                    </div>
                </article>
            `;
        }).join("");
    }

    searchInput.addEventListener("input", (e) => {
        termoBusca = e.target.value;
        renderizarEpisodios();
    });

    filterTabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        filterTabs.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        categoriaAtiva = btn.dataset.category;
        renderizarEpisodios();
    });

    episodesList.addEventListener("click", (e) => {
        const trigger = e.target.closest("[data-watch]");
        if (!trigger) return;

        const ep = episodios[Number(trigger.dataset.watch)];
        if (!ep) return;

        const ytId = extrairYoutubeId(ep.youtubeUrl);
        if (!ytId) {
            alert("O vídeo deste episódio estará disponível em breve.");
            return;
        }

        videoModalBadge.textContent = `// EP ${ep.numero} • ${ep.categoria}`;
        videoModalTitle.textContent = ep.titulo;
        videoModalGuests.textContent = `COM: ${ep.convidados}`;
        btnExternalYoutube.href = ep.youtubeUrl;

        youtubeIframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
        videoModal.classList.add("is-open");
        document.body.style.overflow = "hidden";
    });

    function fecharPlayer() {
        youtubeIframe.src = "";
        videoModal.classList.remove("is-open");
        document.body.style.overflow = "";
    }

    document.getElementById("btnCloseVideo").addEventListener("click", fecharPlayer);
    videoModal.addEventListener("click", (e) => {
        if (e.target === videoModal) fecharPlayer();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && videoModal.classList.contains("is-open")) fecharPlayer();
    });

    renderizarEpisodios();
});