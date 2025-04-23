function loadFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <footer class="footer">
      <div class="footer-text">
        <p>Copyright &copy; by JPR Trainings</p>
      </div>

      <div>
      Icons sources:
      <a href="https://loading.io/"> LOADING IO</a>
      and
      <a href="https://www.flaticon.com/" title="Flaticon"
          >FLATICON</a
        >
      </div>
      <div class="top-icon">
        <a href="#"><i class="fa-solid fa-arrow-up"></i></a>
      </div>
    </footer>
  `;
  document.body.appendChild(footer);
}

document.addEventListener("DOMContentLoaded", loadFooter);
