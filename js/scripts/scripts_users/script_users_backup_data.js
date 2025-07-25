$(function () {
  function sweetAlertSuccess(text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "success",
      theme: "bulma",
      title: text,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  function sweetAlertError(text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "error",
      theme: "bulma",
      title: text,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  function exportUserData() {
    fetch("https://localhost:7081/users/exportuserdata", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        const { base64Data, fileName, contentType } = res.content;

        const link = document.createElement("a");
        link.href = `data:${contentType};base64,${base64Data}`;
        link.download = fileName;
        link.click();
      });
  }
  function importUserData() {
    const fileInput = $("#input-csv-file")[0];

    if (!fileInput) {
      alert("Error: CSV file input not found.");
      return;
    }

    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const base64Csv = e.target.result.split(",")[1];

      $.ajax({
        method: "POST",
        url: "https://localhost:7081/users/importuserdata",
        contentType: "application/json",
        data: JSON.stringify({ Base64CsvData: base64Csv }),
        xhrFields: { withCredentials: true },
        success: function (response) {
          $("#import-status").text(response.message);

          if (response.content != null) {
            const { base64Data, fileName, contentType } = response.content;

            const link = document.createElement("a");
            link.href = `data:${contentType};base64,${base64Data}`;
            link.download = fileName;
            link.click();
          }
        },
        error: function () {
          $("#import-status").text("Import failed.");
        },
      });
    };

    reader.readAsDataURL(file);
  }

  function loadEvents() {
    $("#button-export-user-data").on("click", (e) => {
      exportUserData();
    });

    $("#button-open-import-user-data").on("click", (e) => {
      e.preventDefault();

      $("#edit-profile-form").addClass("d-none");

      $("#div-import-file").toggleClass("d-none");
    });

    $("#button-close-import-user-data").on("click", (e) => {
      e.preventDefault();

      $("#edit-profile-form").removeClass("d-none");

      $("#div-import-file").addClass("d-none");
    });

    $("#button-confirm-import").on("click", (e) => {
      e.preventDefault();

      importUserData();
    });

    // Add Escape key listener for redirection
    $(document).on("keydown", function (e) {
      if (e.key === "Escape") {
        window.location.href = "/index.html";
      }
    });
  }

  function Build() {
    loadEvents();
  }

  Build();
});
