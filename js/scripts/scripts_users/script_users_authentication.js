$(function () {
  let self = this;

  let userEmail = "";
  let userPassword = "";

  self.LoadReferences = () => {
    self.DOM = $("#user-athentication-page");
    self.Form = $("#bg-data-modal");

    self.SignUpForm = self.DOM.find("#signUp-form");
    self.SignInForm = self.DOM.find("#signIn-form");
  };

  function redirectToUsersPage() {
    window.location.href = "/html/pages_users/users_page.html";
  }

  function sweetAlertSuccess(title_text, message_text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "success",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: false,
      timer: 1500,
    }).then((result) => {
      redirectToUsersPage();
    });
  }

  function sweetAlertError(title_text, message_text) {
    let timerInterval;
    let seconds = 5;

    let text = message_text || "";

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
        <p>${text}</p>
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

  function buildTypeWriterEffect() {
    const text1 = $("#welcomingText1");
    const text2 = $("#welcomingText2");

    const message1 = "Welcome visitor!";
    const message2 = "What would you like to do";

    const visitorOptions = $(".visitorOptions");

    let i = 0;
    let j = 0;

    function typeFirst() {
      if (i < message1.length) {
        // Add character one by one
        text1.text(text1.text() + message1.charAt(i));
        i++;
        setTimeout(typeFirst, 25);
      } else {
        setTimeout(typeSecond, 10);
      }
    }

    function typeSecond() {
      if (j < message2.length) {
        text2.text(text2.text() + message2.charAt(j));
        j++;
        setTimeout(typeSecond, 25);
      } else {
        // Create h1 with initial hidden state
        const newH1 = $(
          '<h1 class="pt-4 pb-3 mb-0" style="opacity: 0; transition: opacity 1s ease-in-out;"><span>?</span></h1>'
        );
        text2.append(newH1);

        // Trigger the transition after a small delay
        setTimeout(() => {
          newH1.css("opacity", "1");
        }, 10);
      }
    }

    // Start the first typing animation
    typeFirst();
  }

  function checkFormFilling() {
    let areFieldsFilled = true;

    $("#signUp-form .required:visible:enabled").each(function () {
      if ($(this).val().trim() === "") {
        areFieldsFilled = false;
      }
    });

    $("#confirm-signup").prop("disabled", !areFieldsFilled);
  }

  function checkSignInFormFilling() {
    let areFieldsFilled = true;

    $("#signIn-form .required:visible:enabled").each(function () {
      if ($(this).val().trim() === "") {
        areFieldsFilled = false;
      }
    });

    $("#confirm-signin").prop("disabled", !areFieldsFilled);
  }

  function loadEvents() {
    const openEye = "/images/icons/eye_show.svg";
    const closeEye = "/images/icons/eye_hide.svg";

    // Sign UP Events
    $("#signUp").on("click", function (e) {
      e.preventDefault();

      $("#signIn").css("pointer-events", "none");

      $("#typewritter-texts").slideUp("slow");

      if ($("#signIn").hasClass("active")) {
        $("#signIn").removeClass("active");
      }

      $("#signUp").addClass("active");

      $("#signInBox").hide("slow");

      $("#signing-options").show();

      $("#signUpBox")
        .css({
          display: "block",
          position: "absolute",
          left: "0", // Align to left
          transform: "translateX(-50%)",
          opacity: 0,
        })
        .animate(
          {
            left: "50%",
            opacity: 1,
          },
          "slow"
        );

      $("#newUserName").trigger("focus");

      setTimeout(function () {
        $("#signIn").css("pointer-events", "auto");
      }, 1000);
    });

    let signUpEyeState = 0;

    $("#toggle-show-password").on("click", function (e) {
      e.preventDefault();

      signUpEyeState = signUpEyeState === 0 ? 1 : 0;

      if (signUpEyeState === 1) {
        $("#toggle-show-password").attr("src", closeEye);
        $("#newUserPassword").attr("type", "text");
        $("#toggle-show-password").attr("title", "Hide password");
      }
      if (signUpEyeState === 0) {
        $("#toggle-show-password").attr("src", openEye);
        $("#newUserPassword").attr("type", "password");
        $("#toggle-show-password").attr("title", "Show password");
      }
    });

    $("#toggle-show-password-confirmation").on("click", function (e) {
      e.preventDefault();

      console.log("Eye state1:", signUpEyeState);

      signUpEyeState = signUpEyeState === 0 ? 1 : 0;

      console.log("Eye state2:", signUpEyeState);

      if (signUpEyeState === 1) {
        $("#toggle-show-password-confirmation").attr("src", closeEye);
        $("#passwordConfirmation").attr("type", "text");
        $("#toggle-show-password-confirmation").attr("title", "Hide password");
      }
      if (signUpEyeState === 0) {
        $("#toggle-show-password-confirmation").attr("src", openEye);
        $("#passwordConfirmation").attr("type", "password");
        $("#toggle-show-password-confirmation").attr("title", "Show password");
      }
    });

    $("#newUserPassword, #passwordConfirmation").on("input", function () {
      const password = $("#newUserPassword").val();
      const confirm = $("#passwordConfirmation").val();
      const $submit = $("#confirm-signup");
      const $confirmField = $("#passwordConfirmation");

      if (!password || !confirm) {
        // Disable submit if either field is empty
        $submit.prop("disabled", true);
        bootstrap.Popover.getInstance($confirmField[0])?.dispose();
        return;
      }

      if (password !== confirm) {
        $submit.prop("disabled", true);

        $confirmField.attr({
          "data-bs-toggle": "popover",
          "data-bs-placement": "bottom",
          "data-bs-content": "Passwords do not match",
        });

        if (!bootstrap.Popover.getInstance($confirmField[0])) {
          new bootstrap.Popover($confirmField[0]).show();
        }
      } else {
        $submit.prop("disabled", false);
        bootstrap.Popover.getInstance($confirmField[0])?.dispose();
      }
    });

    // Sign IN events

    $("#signIn").on("click", function (e) {
      e.preventDefault();

      $("#signUp").css("pointer-events", "none");

      $("#typewritter-texts").slideUp("slow");

      if ($("#signUp").hasClass("active")) {
        $("#signUp").removeClass("active");
      }

      $("#signIn").addClass("active");

      $("#signUpBox").hide("slow");

      $("#signing-options").show();

      $("#signInBox")
        .css({
          display: "block",
          position: "absolute",
          right: "0", // Align to right
          transform: "translateX(50%)",
          opacity: 0,
        })
        .animate(
          {
            right: "50%",
            opacity: 1,
          },
          "slow"
        );

      $("#signInEmail").trigger("focus");

      setTimeout(function () {
        $("#signUp").css("pointer-events", "auto");
      }, 1000);
    });

    $("#signIn-form").on("input", function () {
      checkSignInFormFilling();
    });

    let signIpEyeState = 0;

    $("#toggle-signin-password").on("click", function (e) {
      e.preventDefault();

      signIpEyeState = signIpEyeState === 0 ? 1 : 0;

      console.log("Eye state2:", signIpEyeState);

      if (signIpEyeState === 1) {
        $("#toggle-signin-password").attr("src", closeEye);
        $("#signInPassword").attr("type", "text");
        $("#toggle-signin-password").attr("title", "Hide password");
      }
      if (signIpEyeState === 0) {
        $("#toggle-signin-password").attr("src", openEye);
        $("#signInPassword").attr("type", "password");
        $("#toggle-signin-password").attr("title", "Show password");
      }
    });
  }

  function setUpSignUpForm() {
    $("#signUp-form").on("submit", function (e) {
      e.preventDefault();

      // Disable submit button to prevent double submissions
      const submitBtn = $(this).find("button[type='submit']");
      const originalBtnText = submitBtn.text();
      submitBtn.attr("disabled", true).text("Submitting...");

      userEmail = self.SignUpForm.find("#newUserEmail").val();
      userPassword = self.SignUpForm.find("#newUserPassword").val();

      $.post(
        "https://localhost:7081/users/signup",
        $(this).serialize(),
        function (response) {}
      )
        .done(function (response) {
          if (response.content === null) {
            sweetAlertError("Sign Up failed", response.message);
          } else {
            signIn(userEmail, userPassword, true);
          }
        })
        .fail(function (response) {
          sweetAlertError("Sign Up failed", response.message);
        })
        .always(function (response) {
          submitBtn.attr("disabled", true).text(originalBtnText);
        });

      // React to typing in any input
      $("#signUp-form").on("input", checkFormFilling);
    });
  }

  function signIn(userEmail, userPassword, isSignUpMode) {
    const formData = new FormData();
    formData.append("Email", userEmail);
    formData.append("Password", userPassword);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/signin",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (response.content === null) {
          sweetAlertError("Login failed!", response.message);
          return;
        } else if (response.content.remainingSignInAttempts === null) {
          if (isSignUpMode) {
            sweetAlertSuccess("Successfully signed up!");
          } else {
            sweetAlertSuccess("Welcome back!");
          }
        } else {
          sweetAlertError("Login failed!", response.message);
        }
      },
      error: function (response) {
        sweetAlertError("Login failed!", response.message);
      },
    });
  }

  function setUpSignInForm(userEmail, userPassword) {
    self.SignInForm.on("submit", function (e) {
      e.preventDefault();

      userEmail = self.SignInForm.find("#signInEmail").val();
      userPassword = self.SignInForm.find("#signInPassword").val();

      signIn(userEmail, userPassword, false);
    });
  }

  function Build() {
    self.LoadReferences();
    buildTypeWriterEffect();
    loadEvents();
    setUpSignUpForm();
    setUpSignInForm();
  }

  Build();
});
