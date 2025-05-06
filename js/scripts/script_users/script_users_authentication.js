$(document).ready(function () {
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

      $(".signInBox").hide("slow");

      $(".signUpBox")
        .css({
          display: "block",
          marginRight: "auto", // Align to right

          opacity: 0,
        })
        .animate(
          {
            width: "100%", // Expand to full width
            opacity: 1,
          },
          "slow"
        );
    });

    $("#signUp-form").on("submit", function (e) {
      e.preventDefault();

      $.post(
        "https://localhost:7081/users/signup",
        $(this).serialize(),
        function (response) {}
      )
        .done(function (response) {
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
        })
        .fail(function (response) {})
        .always(function (response) {});
    });

    $("#signIn").on("click", function (e) {
      e.preventDefault();

      $(".signUpBox").hide("slow");

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
    });

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
  }

  Build();
});
