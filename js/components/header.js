function loadHeader() {
  const header = document.createElement("header");
  header.className = "header";
  header.innerHTML = `
    <header class="header">
      <a href="#home" class="logo">BBG <span>LIKE</span></a>
      <nav class="navbar">
        <a href="index.html">HOME</a>
        <a href="explore.html">EXPLORE</a>
        <a href="#services">USER</a>
        <a href="#portfolio">ADMIN</a>
        <a href="#contact">DEV</a>
      </nav>
    </header>
  `;
  document.body.appendChild(header);
}

document.addEventListener("DOMContentLoaded", loadHeader);
