/**
 * Flipper Module - Handles the card flipping animation and content changes
 * This module is responsible for:
 * 1. Setting up the flip card animation
 * 2. Loading different templates when buttons are clicked
 * 3. Preventing multiple clicks during animations
 * 4. Managing the visible state of the card faces
 */

// Immediately-invoked Function Expression (IIFE) to avoid polluting global scope
const today = new Date();
const hundredYearsAgo = new Date(today);
hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);

const maxDate = today.toISOString().split("T")[0];
const minDate = hundredYearsAgo.toISOString().split("T")[0];

const Flipper = (function () {
  // Private variables
  let isRotating = false; // Track if animation is in progress
  let isSubmitting = false; // Track if a form submission is in progress
  let currentAngle = 0; // Current rotation angle
  let isBackVisible = false; // Track which side is currently visible

  // Public API
  return {
    init: function () {
      this.setupAnimation();

      // monte o HTML já com os dados
      // injete direto no front
      this.onContentChanged("user-details-template");
      $("#flip-front-content").html(loadTemplate("user-details-template"));

      // esconde o botão “SHOW USER DETAILS”, já que estamos nele
      $("#toggleUserDetails").slideUp();

      // marque que o front está visível
      isBackVisible = false;

      Flipper.setupEventListeners();

      $("#toggleUserDetails button").html(`
             <span>SHOW USER DETAILS</span>`);
    },

    // Set up the CSS transition for the flip animation
    setupAnimation: function () {
      // Add linear transition for smooth animation
      $(".flip-card-inner").css("transition", "transform 0.6s linear");
    },

    // Set up click listeners for all menu buttons
    setupEventListeners: function () {
      const menuButtons = [
        { id: "#toggleUserDetails", template: "user-details-template" },
        { id: "#userOption-playGame", template: "play-template" },
        { id: "#userOption-logSession", template: "log-session-template" },
        { id: "#userOption-editSession", template: "edit-session-template" },
        {
          id: "#userOption-deleteSession",
          template: "delete-session-template",
        },
        { id: "#userOption-rateBg", template: "rate-bg-template" },
        { id: "#userOption-editRate", template: "edit-rate-template" },
        {
          id: "#userOption-newLifeCounter",
          template: "new-life-counter-template",
        },
      ];

      // Cache menu button elements
      const $menuButtons = $(".user-menu-button");

      // Set up click handlers for each button
      menuButtons.forEach((button) => {
        $(button.id)
          .addClass("user-menu-button")
          .on("click", (e) => {
            e.preventDefault();
            this.rotateTo(button.template, $menuButtons); // Pass the button elements
          });
      });
    },

    // Function to rotate the card and show a specific template
    rotateTo: function (templateId, $menuButtons) {
      // Prevent multiple clicks during animation
      if (isRotating) {
        console.log("Rotation already in progress, ignoring request");
        return;
      }

      // Confirm before changing views if a form is being submitted
      if (isSubmitting) {
        if (
          !confirm(
            "You have a form submission in progress. Continuing will cancel it. Proceed?"
          )
        ) {
          return;
        }
        isSubmitting = false;
      }

      // Set the rotating flag to true to prevent multiple clicks
      isRotating = true;

      // Disable menu buttons
      $menuButtons?.prop("disabled", true).addClass("disabled");

      // Select which face to update (the one that's currently hidden)
      const target = isBackVisible
        ? "#flip-front-content"
        : "#flip-back-content";

      // Load the selected template into the target face

      $(target).html(loadTemplate(templateId));

      if (templateId === "user-details-template") {
        $("#toggleUserDetails").slideUp(400);
      } else {
        $("#toggleUserDetails").slideDown().show();
      }

      // Rotate the card 180 degrees
      currentAngle += 180;
      $(".flip-card-inner").css("transform", `rotateY(${currentAngle}deg)`);

      // Listen for the end of the transition
      const transitionEndHandler = () => {
        // Remove the event listener to prevent multiple triggers
        $(".flip-card-inner").off("transitionend", transitionEndHandler);

        // Reset the rotating flag when animation completes
        isRotating = false;

        // Re-enable menu buttons
        $menuButtons?.prop("disabled", false).removeClass("disabled");

        // Notify other modules that content has changed
        this.onContentChanged(templateId);
      };

      // Add the transition end event listener
      $(".flip-card-inner").on("transitionend", transitionEndHandler);

      // As a fallback, also clear the flag after a set time
      // This helps if the transitionend event somehow doesn't fire
      setTimeout(() => {
        isRotating = false;
      }, 1000); // Assuming transition takes less than 1 second

      // Toggle which face is visible
      isBackVisible = !isBackVisible;
    },

    // Called when content has changed, used by other modules to know when to initialize components
    onContentChanged: function (templateId) {
      // Trigger a custom event that other modules can listen for
      $(document).trigger("flipper:contentChanged", [templateId]);
      console.log(`Content changed to: ${templateId}`);
    },

    // Methods to be called from other modules
    setSubmitting: function (value) {
      isSubmitting = value;
    },

    isCardFlipping: function () {
      return isRotating;
    },
  };
})();

// Initialize the flipper when the document is ready
$(function () {
  // First check if the user is authenticated
  fetch("https://localhost:7081/users/validatestatus", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.content.isUserLoggedIn == true) {
        // If the user is logged in, initialize the flipper
        console.log("User is authenticated. Initializing flipper...");

        Flipper.init();
      } else {
        // If the user is not authenticated, redirect them to the authentication page
        console.log("User is not authenticated. Redirecting...");
      }
    })
    .catch((error) => {
      console.error("Authentication check failed:", error);
      alert("Failed to verify login status. Please try again later.");
    });
});

function loadTemplate(templateId) {
  switch (templateId) {
    case "play-template":
      return `<p>Template "${templateId}" not yet implemented.</p>`;
    case "user-details-template":
      return `
        <div id="user-details-template">
          <h3 class="text-center pb-5">Welcome <span id="userName"></span></h3>
          <h5 class="text-start">Member since: <span id="signupDate"></span></h5>
          <h5 class="text-start">Board Games Rated: <span id="ratedBgCount"></span></h5>
          <h5 class="text-start">Played Matches: <span id="sessionsCount"></span></h5>
          <h5 class="text-start">Won matches: <span>to be implemented</span></h5>
          <h5 class="text-start">Win rate: <span>to be implemented</span></h5>
        </div>
      `;
    case "log-session-template":
      return `
      <div id="log-session-template">
        <h3 class="pb-0"><span>L</span>og a new Session</h3>

        <hr/>

        <form id="log-session-form" class="d-flex flex-column align-items-center">
          <div class="text-center w-80">
            <label class="bgList-lbl form-label" for="bgSelection-logSession"
              ><span>S</span>elect a Board Game</label
            >
            <div class="comboBox-wrapper">
              <div class="comboBox">
                <select
                  name="BoardGameId"
                  class="form-control form-select bg-select"
                  id="bgSelection-logSession"
                >
                  <option value=""></option>
                </select>
              </div>
            </div>
          </div>

          <hr/>
  
          <div class="text-center w-50">
            <label for="sessionDate" class="form-label"
              ><span>W</span>hen did you play?</label
            >
            <input
              name="Date"
              id="sessionDate"
              class="current-data new-data form-control text-center required"
              type="date"
              min="${minDate}"
              max="${maxDate}"
              oninput="if (this.value > '${maxDate}') {this.value = '${maxDate}';}"
            />
          </div>

          <hr/>
  
          <div class="text-center w-50">
            <label class="form-label"
              ><span>P</span>layers Count</label
            >
            <input
              name="PlayersCount"
              id="playersCount"
              class="current-data form-control text-center required"
              type="number"
              min="1"
              max="15"
              value="1"
              oninput="if (this.value < 0) this.value = 1;"
            />
          </div>

          <hr/>
  
          <div class="text-center w-50">
            <label class="form-label"
              ><span>H</span>ow long did the match last (minutes):</label
            >
            <input
              name="Duration_minutes"
              id="sessionDuration"
              class="current-data form-control text-center required"
              type="number"
              min="5"
              max="1440"
              oninput="
                if (this.value < 0 )
                  {this.value = 5;} 
                else if(this.value > 1440)
                  {this.value = 1440;}"
                else
                  {this.value}
            />
          </div>

          <hr/>
  
          <div class="d-flex flex-row w-100 justify-content-between mt-2 gap-3">
            <button
              type="submit"
              id="confirm-logNewSession"
              class="btn btn-lg btn-outline-info "
              disabled
            >
              Log new Session
            </button>

            <button
              type="button"
              id="reset-logNewSession"
              class="btn-refresh btn btn-sm btn-outline-warning"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>`;
    case "edit-session-template":
      return `
        <div id="edit-session-template">
          <h3 class="pb-0"><span>E</span>dit Session</h3>

          <hr/>

          <form
            id="edit-session-form"
            class="d-flex flex-column align-items-center"         
          >
            <div class="text-center w-80">
              <label class="bgList-lbl" for="bgSelection-editSession"
                ><span>S</span>elect a Board Game</label
              >
              <div class="comboBox-wrapper">
                <div class="comboBox">
                  <select
                    name="BoardGameId"
                    class="form-control form-select bg-select text-center"
                    id="bgSelection-editSession"
                  ></select>
                </div>
              </div>
            </div>

            <hr/>

            <div id="sessionComboBox" class="text-center w-50">
              <label
                id="edit-session-label"
                class="bgList-lbl"
                for="sessionSelection-edit"
                >
                <span>S</span>elect a Session</label
              >
              <select
                name="SessionId"
                id="sessionSelection-edit"
                class="current-data form-control form-select bg-select"
              ></select>
            </div>

            <hr/>

            <div class="d-flex flex-row align-items-center gap-5">
              <div class="text-center w-50">
                <label for="currentSessionDate" class="form-label"
                  ><span>C</span>urrent Session Date</label
                >
                <input
                  name="CurrentDate"
                  id="currentSessionDate"
                  type="text"
                  class="current-data form-control text-center"
                  disabled
                />
              </div>
              <div class="text-center w-50">
                <label class="form-label"
                  ><span>N</span>ew Session Date</label
                >
                <input
                  name="NewDate"
                  id="newSessionDate"
                  class="current-data form-control text-center required"                  
                  type="date"
                  min="${minDate}"
                  max="${maxDate}"
                />
              </div>
            </div>

            <hr/>

            <div class="d-flex flex-row align-items-center gap-5">
              <div class="text-center w-50">
                <label for="currentPlayersCount" class="form-label"
                  ><span>C</span>urrent Players Count</label
                >
                <input
                  name="CurrentPlayersCount"
                  id="currentPlayersCount"
                  class="current-data form-control text-center"
                  type="number"
                  disabled
                />
              </div>

              <div class="text-center w-50">
                <label class="form-label"
                  ><span>N</span>ew Players Count</label
                >
                <input
                  name="NewPlayersCount"
                  id="newPlayersCount"
                  class="current-data form-control text-center required"
                  type="number"
                  min="1"
                  max="15"
                  value="1"
                  oninput="
                    if (this.value < 0 )
                      {this.value = 5;} 
                    else if(this.value > 1440)
                      {this.value = 1440;}"
                    else
                      {this.value}
                />
              </div>
            </div>

            <hr/>

            <div class="d-flex flex-row align-items-center gap-5">
              <div class="text-center w-50">
                <label for="currentSessionDuration" class="form-label"
                  ><span>C</span>urrent Match Duration:</label
                >
                <input
                  name="CurrentDuration_minutes"
                  id="currentSessionDuration"
                  type="text"
                  class="current-data form-control text-center"
                  disabled
                />
              </div>
              <div class="text-center w-50">
                <label class="form-label"
                  ><span>N</span>ew Match Duration:</label
                >
                <input
                  name="NewDuration_minutes"
                  id="newSessionDuration"
                  class="current-data form-control text-center required "
                  type="number"
                  min="5"
                  max="1440"
                  oninput="if (this.value < 0) this.value = 5;"
                />
              </div>
            </div>

            <hr/>

            <div class="d-flex flex-row w-100 justify-content-between mt-2 gap-3">
              <button
                type="submit"
                id="confirm-editSession"
                class="btn btn-lg btn-outline-info"
                disabled
              >
                Confirm Alteration
              </button>
              <button
                type="button"
                id="reset-editSession"
                class="btn-refresh btn btn-sm btn-outline-warning"
              >
                Clear Form
              </button>
            </div>         
          </form>
        </div>`;
    case "delete-session-template":
      return `  
        <div id="delete-session-template">
          <h3 class="pb-0">
            <span style="color: var(--reddish)">D</span>elete Session
          </h3>

          <hr/>

          <form
            id="delete-session-form"
            class="d-flex flex-column align-items-center"
          >
            <div class="text-center w-80">
              <label class="bgList-lbl" for="bgSelection-deleteSession"
                ><span style="color: var(--reddish)">S</span>elect a Board
                Game</label
              >
              <div class="comboBox-wrapper">
                <div class="comboBox">
                  <select
                    name="BoardGameId"
                    class="form-control form-select bg-select"
                    id="bgSelection-deleteSession"
                  ></select>
                </div>
              </div>
            </div>

            <hr/>

            <div class="text-center w-50">
              <label
                id="delete-session-label"
                class="bgList-lbl"
                for="sessionSelection-delete"
                ><span style="color: var(--reddish)">S</span>elect a
                Session</label
              >
              <div class="comboBox-wrapper">
                <div class="comboBox">
                  <select
                    name="SessionId"
                    id="sessionSelection-delete"
                    class="current-data form-control form-select bg-select"
                  ></select>
                </div>
              </div>
            </div>

              <hr/>

            <div
              id="playersCount-delSession"
              class="sessionDataPreview mb-3 text-center w-50"
            ></div>

            <div
              id="matchDuration-delSession"
              class="sessionDataPreview mb-3 text-center w-50"
            ></div>

            <button
              type="submit"
              id="confirm-deleteSession"
              class="btn btn-lg btn-outline-info mt-2"
              style="color: var(--reddish)"
              disabled
            >
              Delete Session
            </button>
          </form>
        </div>`;
    case "rate-bg-template":
      return `
        <div id="rate-bg-template">
          <h3 class="pb-0"><span>R</span>ate a Game</h3>
          
          <hr/>

          <form
            id="rate-bg-form"
            class="d-flex flex-column align-items-center"
          >
            <div class="text-start w-80">
              <label class="bgList-lbl" for="bgSelection-rate"
                ><span>S</span>elect a Board Game</label
              >
              <div class="comboBox-wrapper">
                <div class="comboBox">
                  <select
                    name="BoardGameId"
                    class="form-control form-select bg-select"
                    id="bgSelection-rate"
                  ></select>
                </div>
              </div>
            </div>

            <hr/>

            <div class="text-center w-50">
              <label class="form-label"><span>R</span>ate</label>
              <input
                name="Rate"
                id="rate"
                class="current-data form-control text-center required"
                placeholder="rate between 0 and 5"
                type="number"
                min="0"
                max="5"
                oninput="
                    if (this.value < 0 )
                      {this.value = 0;} 
                    else if(this.value > 5)
                      {this.value = 5;}"
                    else
                      {this.value}
              />
            </div>

            <hr/>

            <button
              type="submit"
              id="confirm-rateBG"
              class="btn btn-lg btn-outline-info mt-2"
              disabled
            >
              Confirm Rating
            </button>
          </form>
        </div>`;
    case "edit-rate-template":
      return `
        <div id="edit-rate-template">
          <h3 class="pb-0"><span>E</span>dit Rate</h3>

          <hr/>

          <form
            id="edit-rate-form"
            class="d-flex flex-column align-items-center"
          >
            <div class="text-start w-80">
              <label class="bgList-lbl" for="bgSelection-edit-rate"
                ><span>S</span>elect a Board Game</label
              >
              <div class="comboBox-wrapper">
                <div class="comboBox">
                  <select
                    name="BoardGameId"
                    class="form-control form-select bg-select"
                    id="bgSelection-edit-rate"
                  ></select>
                </div>
              </div>
            </div>

            <hr/>

            <div class="d-flex flex-row align-items-center gap-5">
              <div class="text-center w-50">
                <label for="currentRate" class="form-label"
                  ><span>C</span>urrent Rate</label
                >
                <input
                  name="oldRate"
                  id="currentRate"
                  type="number"
                  class="current-data form-control text-center"
                  disabled
                />
              </div>

              <div class="text-center w-50">
                <label class="form-label"
                  ><span>N</span>ew Rate</label
                >
                <input
                  name="Rate"
                  id="newRate"
                  class="current-data form-control text-center required"
                  type="number"
                  min="0"
                  max="5"
                  placeholder="0 < rate < 5"
                  oninput="
                    if (this.value < 0 )
                      {this.value = 0;} 
                    else if(this.value > 5)
                      {this.value = 5;}"
                    else
                      {this.value}
                />
              </div>
            </div>

            <hr/>

            <button
              type="submit"
              id="confirm-newRateBG"
              class="btn btn-lg btn-outline-info mt-2"
              disabled
            >
              Confirm new Rating
            </button>
          </form>
        </div>`;
    case "new-life-counter-template":
      return `<p>Template "${templateId}" not yet implemented.</p>`;
    default:
      return `<p>Template "${templateId}" não encontrado.</p>`;
  }
}
