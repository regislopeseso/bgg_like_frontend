$(function () {
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
        setTimeout(typeFirst, 75);
      } else {
        setTimeout(typeSecond, 50);
      }
    }

    function typeSecond() {
      if (j < message2.length) {
        text2.text(text2.text() + message2.charAt(j));
        j++;
        setTimeout(typeSecond, 75);
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

  function loadEvents() {
    $("#signUp").on("click", function (e) {
      e.preventDefault();

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
    });

    $("#signIn").on("click", function (e) {
      e.preventDefault();

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
    });

    let eyeState = 0;
    const openEye = "images/icons/eye_show.svg";
    const closeEye = "images/icons/eye_hide.svg";

    $("#toggle-show-password").on("click", function (e) {
      e.preventDefault();

      console.log("Eye state1:", eyeState);

      eyeState = eyeState === 0 ? 1 : 0;

      console.log("Eye state2:", eyeState);

      if (eyeState === 1) {
        $("#toggle-show-password").attr("src", closeEye);
        $("#newUserPassword").attr("type", "text");
      }
      if (eyeState === 0) {
        $("#toggle-show-password").attr("src", openEye);
        $("#newUserPassword").attr("type", "password");
      }
    });

    $("#toggle-show-password-confirmation").on("click", function (e) {
      e.preventDefault();

      console.log("Eye state1:", eyeState);

      eyeState = eyeState === 0 ? 1 : 0;

      console.log("Eye state2:", eyeState);

      if (eyeState === 1) {
        $("#toggle-show-password-confirmation").attr("src", closeEye);
        $("#passwordConfirmation").attr("type", "text");
      }
      if (eyeState === 0) {
        $("#toggle-show-password-confirmation").attr("src", openEye);
        $("#passwordConfirmation").attr("type", "password");
      }
    });
  }

  function setUpSignUpForm() {
    $("#signUp-form").on("submit", function (e) {
      e.preventDefault();

      $.post(
        "https://localhost:7081/users/signup",
        $(this).serialize(),
        function (response) {}
      )
        .done(function (response) {
          if (response.content === null) {
            alert(response.message);
          } else {
            $("#welcomeTexts").addClass("d-none");
            $(".signUpBox").hide("slow");
            $("#signIn-Button").html(`Sign In`);

            $(".signInBox")
              .css({
                display: "block",
                marginLeft: "auto", // Align to left

                opacity: 0,
              })
              .animate(
                {
                  width: "100%", // Expand to full width
                  opacity: 1,
                },
                "slow"
              );

            $("#signUpSucess").removeClass("d-none");
          }
        })
        .fail(function (response) {})
        .always(function (response) {});
    });
  }

  function setUpSignInForm() {
    $("#signIn-form").on("submit", function (e) {
      e.preventDefault();

      $.ajax({
        type: "POST",
        url: "https://localhost:7081/users/signin",
        data: $(this).serialize(),
        xhrFields: {
          withCredentials: true,
        },
        success: function (response) {
          if (
            response.message &&
            response.message.includes("signed in successfully")
          ) {
            window.location.href = "users_page.html";
          } else {
            alert(response.message || "Login failed");
            window.location.href = "users_authentication.html";
          }
        },
        error: function (response) {
          alert("Login failed: ", response);
        },
      });
    });
  }

  function Build() {
    buildTypeWriterEffect();
    loadEvents();
    setUpSignUpForm();
    setUpSignInForm();
  }

  Build();
});
