function loadScript(src, callback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = callback || function () {};
  script.async = false; // preserve execution order
  document.head.appendChild(script);
}

// Load libraries in required order
loadScript("/node_modules/jquery/dist/jquery.min.js", () => {
  loadScript("/node_modules/@popperjs/core/dist/umd/popper.min.js", () => {
    loadScript("/node_modules/bootstrap/dist/js/bootstrap.min.js", () => {
      loadScript("/node_modules/select2/dist/js/select2.min.js", () => {
        loadScript("/js/plugings/page_loader.js", () => {
          loadScript("/js/plugings/content_loader.js", () => {
            loadScript("/node_modules/sweetalert2/dist/sweetalert2.all.min.js");
          });
        });
      });
    });
  });
});
