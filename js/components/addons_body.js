function loadScript2(src, callback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = callback || function () {};
  script.async = false; // preserve execution order
  document.body.appendChild(script);
}

// Load libraries in required order
loadScript2("/node_modules/jquery/dist/jquery.min.js", () => {
  loadScript2("/node_modules/@popperjs/core/dist/umd/popper.min.js", () => {
    loadScript2("/node_modules/bootstrap/dist/js/bootstrap.min.js", () => {
      loadScript2("/node_modules/select2/dist/js/select2.min.js", () => {
        loadScript2("/js/plugings/page_loader.js", () => {
          loadScript2("/js/plugings/content_loader.js", () => {
            loadScript2(
              "/node_modules/sweetalert2/dist/sweetalert2.all.min.js",
              () => {
                loadScript2("/js/scripts/script_explore.js");
              }
            );
          });
        });
      });
    });
  });
});
