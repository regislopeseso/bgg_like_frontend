var __global = {};

function redirectToIndexPage() {
  window.location.href = "/index.html";
}

function sweetAlertSuccess(text) {
  Swal.fire({
    position: "center",
    icon: "success",
    theme: "bulma",
    title: text,
    showConfirmButton: false,
    timer: 1000,
  }).then((result) => {
    redirectToIndexPage();
  });
}
function sweetAlertError(text) {
  Swal.fire({
    position: "center",
    icon: "error",
    theme: "bulma",
    title: text,
    showConfirmButton: false,
    timer: 1500,
  }).then((result) => {
    redirectToIndexPage();
  });
}

function loadHeader(userData, roleData) {
  const isLoggedIn = userData?.content?.isUserLoggedIn === true;
  const userRole = roleData?.content?.role || null;

  const header = document.createElement("header");
  header.className = "header";

  header.innerHTML = `
    <header class="header">  
      <a href="/index.html" class="logo">BBG <span>LIKE</span> </a>
      
      <nav class="navbar">
        <div class="navOptions d-flex flex-row align-items-center justify-content-between">        
         
         
                
          <a href="/index.html">HOME</a>
          <a href="/html/explore.html">EXPLORE</a>         
          <a id="img-access-lifecounter" href="/html/lifecounter/lifecounter_manager.html"">
            <img src="/images/icons/lifecounter_white.png" alt=""/>
          </a> 
          <a id="img-play" href="/html/lifecounter/lifecounter_manager.html"">
            <img src="/images/icons/play.png" alt=""/>
          </a> 
          <a href="/html/pages_users/users_authentication.html" class="anonymous-clearance d-none">SIGN UP/IN</a>
          <a href="/html/pages_users/users_page.html" class="loggedIn-clearance d-none">USER</a>
          <a href="/html/pages_admins/admins_page.html" class="admins-clearance d-none">ADMIN</a>
          <a href="/html/pages_devs/devs.html" class="devs-clearance d-none">DEV</a>

          <div class="dropdown loggedIn-clearance d-none">
            <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-person-gear"></i>
            </a>
            <ul id="ul-profile-configurations" class="dropdown-menu">
              <li><a id="li-edit-profile" class="config-item dropdown-item m-0" href="/html/pages_users/users_edit_profile.html">Edit Profile</a></li>
              <li><a id="li-change-password" class="config-item dropdown-item m-0 " href="/html/pages_users/users_change_password.html">Change Password</a></li>
              <li><a id="li-delete-profile" class="config-item dropdown-item m-0" href="/html/pages_users/users_delete_profile.html">Delete Profile</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a id="li-sign-out" class="config-item logOut dropdown-item m-0" href="/index.html">Sign Out</a></li>
            </ul>
          </div>
          
          <a style="text-decoration: none;" href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">
            <i class="bi bi-gear" ></i>
          </a>

          <div id="role-initial-toggler">
            
          </div>
        </div>

        <div class="navHamburger">
          <nav class="navbar navbar-expand-lg">
            <div class="d-flex flex-column align-items-end">
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#toggle-hamburguer-menu">
                  <i class="bi bi-list"></i>                
              </button>

              <div class="collapse navbar-collapse text-end" id="toggle-hamburguer-menu">                 
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">               

                  <li class="nav-item">
                      <a class="nav-link" href="/index.html">HOME</a>
                  </li>                 
                  <li class="nav-item">
                    <a class="nav-link" href="/html/explore.html">EXPLORE</a>
                  </li>
                  <li class="nav-item">
                    <a id="img-access-lifecounter" href="/html/lifecounter/lifecounter_manager.html"">
                      <img src="/images/icons/lifecounter_white.png" alt=""/>
                    </a> 
                  </li>       
                   <li class="nav-item">
                    <a id="img-play" href="/html/lifecounter/lifecounter_manager.html"">
                      <img src="/images/icons/play.png" alt=""/>
                    </a> 
                  </li>         
                  <li class="nav-item">
                    <a href="/html/pages_users/users_authentication.html" class="anonymous-clearance nav-link d-none">SIGN UP/IN</a>
                  </li>
                  <li class="nav-item">
                    <a href="/html/pages_users/users_page.html" class="loggedIn-clearance nav-link d-none">USER</a>
                  </li>
                  <li class="nav-item">
                    <a href="/html/pages_admins/admins_page.html" class="admins-clearance nav-link d-none">ADMIN</a>
                  </li>
                  <li class="nav-item">
                    <a href="/html/pages_devs/devs.html" class="devs-clearance nav-link d-none">DEV</a>
                  </li>

                  <div class="dropdown loggedIn-clearance d-none">
                    <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown">
                      <i class="bi bi-person-gear"></i>
                    </a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item m-0 " href="#">Edit Profile</a></li>
                      <li><a class="dropdown-item m-0" href="#">Delete Profile</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item m-0" href="#">Sign Out</a></li>
                    </ul>
                  </div>                 

                  <li class="nav-item">
                    <butto style="text-decoration: none;" href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                      <i class="bi bi-gear" ></i>
                    </butto>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </nav>

      <div class="offcanvas-custom offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight">
        <div class="offcanvas-header pb-5">
          <h5 class=" offcanvas-title" id="offcanvasRightLabel"><span>T</span>heme <span>C</span>onfiguration</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body d-flex flex-column align-items-center">            
          <button id="theme-toggler" class="btn-theme btn btn-outline-info d-flex flex-row align-items-center justify-content-center" type="button" data-bs-dismiss="offcanvas">Light Theme</button>
        </div>
      </div>
      
    </header>
  `;
  document.body.appendChild(header);

  if (isLoggedIn === true && userRole !== null) {
    $("header").css("border-bottom", "3px solid var(--main-color)");
    $(".anonymous-clearance").addClass("d-none");
    $(".loggedIn-clearance").removeClass("d-none");

    if (userRole === "Developer") {
      $(".admins-clearance").removeClass("d-none");
      $(".devs-clearance").removeClass("d-none");
    } else if (userRole === "Administrator") {
      $(".admins-clearance").removeClass("d-none");
    } else if (userRole === "User") {
      $(".loggedIn-clearance").removeClass("d-none");
    }

    // Attach logout event after role is handled
    $(".logOut").on("click", async function (e) {
      e.preventDefault();

      $("header").css("border-bottom", "none");

      const response = await fetch("https://localhost:7081/users/signout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      if (response.content?.isUserSignOut) {
        localStorage.clear();

        //localStorage.removeItem("keyName");

        // Successfully logged out
        sweetAlertSuccess("Bye Bye!");
      } else {
        sweetAlertError("Failed to log out.");
      }
    });
  } else {
    $("header").css("border-bottom", "none");
    $(".anonymous-clearance").removeClass("d-none");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  let userData = null;
  let roleData = null;

  try {
    const statusResponse = await fetch(
      "https://localhost:7081/users/validatestatus",
      {
        method: "GET",
        credentials: "include",
      }
    );

    userData = await statusResponse.json();

    if (userData.content.isUserLoggedIn === true) {
      console.log(userData.message);
      const roleResponse = await fetch("https://localhost:7081/users/getrole", {
        method: "GET",
        credentials: "include",
      });
      roleData = await roleResponse.json();
      console.log(roleData.message);
    } else {
      console.log(userData.message);
    }
  } catch (err) {
    sweetAlertError("Failed to fetch authentication status or role", err);
  }

  loadHeader(userData, roleData);

  function SetTheme() {
    let theme = localStorage.getItem("Theme");

    if (!theme) {
      theme = "Dark";
      localStorage.setItem("Theme", theme);
    }

    if (theme === "Light") {
      $("#theme-toggler").html("Dark");
      document.documentElement.style.setProperty(
        "--bg-color",
        "rgb(200, 200, 210)"
      );
      document.documentElement.style.setProperty(
        "--second-bg-color",
        "rgb(190, 190, 200)"
      );
      document.documentElement.style.setProperty(
        "--text-color",
        "rgb(25, 25, 30)"
      );
      document.documentElement.style.setProperty(
        "--main-color",
        "rgb(0, 90, 100)"
      );
      document.documentElement.style.setProperty(
        "--reddish",
        "rgb(200, 50, 30)"
      );
      document.documentElement.style.setProperty(
        "--yellowish",
        "rgb(200, 180, 0)"
      );
      document.documentElement.style.setProperty(
        "--greenish",
        "rgb(0, 170, 110)"
      );
    } else {
      $("#theme-toggler").html("Light");
      document.documentElement.style.setProperty(
        "--bg-color",
        "rgb(31, 36, 46)"
      );
      document.documentElement.style.setProperty(
        "--second-bg-color",
        "rgb(50, 57, 70)"
      );
      document.documentElement.style.setProperty(
        "--text-color",
        "rgb(255, 255, 255)"
      );
      document.documentElement.style.setProperty(
        "--main-color",
        "rgb(0, 238, 255)"
      );
      document.documentElement.style.setProperty(
        "--reddish",
        "rgb(255, 51, 0)"
      );
      document.documentElement.style.setProperty(
        "--yellowish",
        "rgb(255, 230, 0)"
      );
      document.documentElement.style.setProperty(
        "--greenish",
        "rgb(0, 255, 128)"
      );
    }
  }

  $("#theme-toggler").on("click", function () {
    const theme = localStorage.getItem("Theme");
    localStorage.setItem("Theme", theme === "Light" ? "Dark" : "Light");
    SetTheme();
  });

  SetTheme();
});
