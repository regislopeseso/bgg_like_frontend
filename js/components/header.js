function loadHeader() {
  const header = document.createElement("header");
  header.className = "header";
  header.innerHTML = `
    <header class="header">
      <a href="#home" class="logo">BBG <span>LIKE</span></a>
      <nav class="navbar">
        <div class="navOptions">
          <a href="index.html">HOME</a>
          <a href="explore.html">EXPLORE</a>
          <a href="#services">USER</a>
          <a href="#portfolio">ADMIN</a>
          <a href="#contact">DEV</a>
        </div>

        <div class="navHamburger">
          <nav class="navbar navbar-expand-lg">
            <div class="container-fluid">
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                  <i class="bi bi-list"></i>                
              </button>
              <div class="collapse navbar-collapse" id="navbarTogglerDemo01">                 
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link" href="index.html">HOME</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="explore.html">EXPLORE</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#services">USER</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#portfolio">ADMIN</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#contact">DEV</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </nav>
    </header>
  `;
  document.body.appendChild(header);
}

document.addEventListener("DOMContentLoaded", loadHeader);
