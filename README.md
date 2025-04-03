# bgg_like_frontend

/_ Para Firefox _/
scrollbar-width: thin;
scrollbar-color: var(--main-color) transparent;

/_ Para Chrome, Edge e Safari _/
.primary-table::-webkit-scrollbar {
display: none;
width: 1px; /_ Largura da barra _/
}

.primary-table::-webkit-scrollbar-track {
background: transparent; /_ Fundo da barra _/
border-radius: 10px;
}
.primary-table::-webkit-scrollbar-thumb {
max-height: 50px;
background-color: var(--main-color); /_ Cor do botão da barra _/
border-radius: 10px;
border: 2px solid transparent;
}
.primary-table::-webkit-scrollbar-thumb:hover {
background-color: darken(var(--main-color), 10%); /_ Cor ao passar o mouse _/
}
