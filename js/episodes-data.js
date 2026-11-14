
/* ==========================================================================
   CATÁLOGO DE EPISÓDIOS - MECANICAST
COMO ADICIONAR UM NOVO EPISÓDIO PELO GITHUB:
   1. Clique no ícone de lápis (Edit) no canto superior direito deste arquivo.
   2. Copie o modelo abaixo (incluindo as chaves e a vírgula final).
   3. Cole logo abaixo de "const EPISODIOS = [" (sempre no topo, para ficar em 1º).
   4. Preencha os textos entre aspas e clique em "Commit changes".

   MODELO PARA COPIAR:
   {
       numero: "04",
       titulo: "Título do episódio aqui",
       convidados: "Nome dos participantes",
       categoria: "MERCADO", // Use: MERCADO, ENGENHARIA ou AUTOMOBILISMO
       data: "20 NOV 2026",
       duracao: "55 MIN",
       youtubeUrl: "https://www.youtube.com/watch?v=COLE_O_LINK_AQUI",
       capa: "", // Deixe vazio "" para puxar a thumbnail do YouTube automaticamente
       descricao: "Resumo do que foi debatido no episódio."
   },
========================================================================== */


const EPISODIOS_INICIAIS = [
    {
        id: "ep-01",
        numero: "01",
        titulo: "Carros elétricos x combustão",
        convidados: "Renou e Pimenta",
        categoria: "MERCADO",
        data: "14 NOV 2026",
        duracao: "45 MIN",
        capa: "",
        youtubeUrl: "https://www.youtube.com/watch?v=ZVEnXocEXO4", // Cole aqui o link completo do episódio no YouTube
        descricao: "Profissionais do setor automotivo debatem sobre o futuro dos carros elétricos e a relevância da combustão interna."
    }
];