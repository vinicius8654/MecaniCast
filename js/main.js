// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("Página carregada e JS conectado com sucesso!");

    // Exemplo de interação: animação leve ao clicar nos links do menu
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove o preventDefault se os links forem para outras páginas reais
            e.preventDefault(); 
            console.log(`Você clicou em: ${e.target.innerText}`);
        });
    });
});
// A senha secreta que o podcaster precisa digitar no teclado
const comandoSecreto = "mecanica"; 
let sequenciaDigitada = "";

// Fica ouvindo o que é digitado no teclado
window.addEventListener("keydown", (e) => {
    sequenciaDigitada += e.key.toLowerCase();

    // Mantém a string curta para não gastar memória
    if (sequenciaDigitada.length > comandoSecreto.length) {
        sequenciaDigitada = sequenciaDigitada.slice(1);
    }

    // Se a pessoa digitou a palavra secreta, abre o menu
    if (sequenciaDigitada === comandoSecreto) {
        document.getElementById("menu-admin").style.display = "block";
        alert("Acesso de Podcaster Liberado!");
        sequenciaDigitada = ""; // reseta
    }
});