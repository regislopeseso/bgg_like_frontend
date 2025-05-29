const FormHandler_UserDetails = (function () {
  function sweetAlertError(title_text, message_text) {
    let timerInterval;
    let seconds = 5;

    Swal.fire({
      theme: "bulma",
      position: "center",
      title: title_text,
      icon: "error",
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Close",

      html: `
      <div>
        <p>${message_text}</p>
        <p>This window will close in <b>${seconds}</b>...</p>
      </div>
    `,
      timer: seconds * 1000,
      timerProgressBar: true,
      didOpen: () => {
        const content = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          seconds--;
          content.textContent = seconds;
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  }

  function loadUserDetails() {
    $.ajax({
      url: "https://localhost:7081/users/getprofiledetails",
      type: "GET",
      xhrFields: { withCredentials: true },
      success: function (response) {
        const userDB = response.content;
        if (userDB != null) {
          $("#userName").html(userDB.treatmentTitle + userDB.name);
          $("#signupDate").html(userDB.signUpDate);
          $("#ratedBgCount").html(userDB.ratedBgCount);
          $("#sessionsCount").html(userDB.sessionsCount);
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError("Failed to fetch user details.", response.message);
      },
    });
  }

  // Public API
  return {
    init: function () {
      // Listen for content changes from the Flipper module
      $(document).on("flipper:contentChanged", (event, templateId) => {
        // Initialize specific functionality based on which template was loaded
        if (templateId === "user-details-template") {
          loadUserDetails();
        }
      });
    },
  };
})();

// Initialize the form handler when the document is ready
$(function () {
  FormHandler_UserDetails.init();
});
