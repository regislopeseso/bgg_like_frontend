const FormHandler_UserDetails = (function () {
  function loadUserDetails() {
    $.ajax({
      url: "https://localhost:7081/users/getprofiledetails",
      type: "GET",
      xhrFields: { withCredentials: true },
      success: function (response) {
        const userDB = response.content;

        $("#userName").html(userDB.name);
        $("#signupDate").html(userDB.signUpDate);
        $("#ratedBgCount").html(userDB.ratedBgCount);
        $("#sessionsCount").html(userDB.sessionsCount);
      },
      error: function (xhr, status, error) {
        alert("Failed to fetch user details. Try again later.");
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
