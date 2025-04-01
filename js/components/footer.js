function loadFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <div class="footer-text">
      <p>Copyright &copy; by JPR Trainings</p>
    </div>
    <div class="top-icon">
      <a href="#"><i class="fa-solid fa-arrow-up"></i></a>
    </div>
  `;
  document.body.appendChild(footer);
}

document.addEventListener("DOMContentLoaded", loadFooter);
