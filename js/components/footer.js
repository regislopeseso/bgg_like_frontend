function loadFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <footer class="footer">
      <div class="footer-text">
        <p>Copyright &copy; by OAK Academy</p>
      </div>
      <div class="top-icon">
        <a href="#home"><i class="fa-solid fa-arrow-up"></i></a>
      </div>
    </footer>
  `;
  document.body.appendChild(footer);
}

document.addEventListener("DOMContentLoaded", loadFooter);
