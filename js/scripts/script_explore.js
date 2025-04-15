$(document).ready(function () {
  function loadAllGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/listboardgames",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (!response.content || !Array.isArray(response.content)) {
          console.error("Unexpected response format:", response);
          return;
        }

        // Limpa a tabela
        $(".table-allBoardGames tbody").empty();

        // trStart and trEnd exist only to create
        // an empty line in the beggining and end
        // of the table, they are not necessary
        let trStart = `
          <tr>
            <td class="text-start"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `;
        $(".table-allBoardGames tbody").append(trStart);

        $.each(response.content, function (index, item) {
          let tr = `
          <tr>
            <td class="text-start">${item.boardGameName}</td>
            <td>${item.avgRating}</td>
            <td>${item.ratingsCount}</td>
            <td>${item.playersCount}</td>
            <td>${item.avgDuration}</td>
            <td>${item.sessionsLogged}</td>
          </tr>
        `;
          $(".table-allBoardGames tbody").append(tr);
        });
        let trEnd = `
          <tr>
            <td class="text-start"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `;
        $(".table-allBoardGames tbody").append(trEnd);

        // Exibe a mensagem da API no console
        console.log(response.message);
      }
    );
  }

  function loadBgRankings(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        if (
          !response.content ||
          !Array.isArray(response.content.mostPlayedBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        // Acessa a lista de mostPlayedBoardGames
        const mostPlayedBG = response.content.mostPlayedBoardGames;
        // Chama a função que constrói a tabela desejada
        buildMostPlayedBgTable(mostPlayedBG);

        const bestRatedBG = response.content.bestRatedBoardGames;
        buildBestRatedBbTable(bestRatedBG);

        const shortestBG = response.content.shortestBoardGames;
        buildShortestBbTable(shortestBG);

        const longestBG = response.content.longestBoardGames;
        buildLongestBgTable(longestBG);

        const adultsFavoriteBG = response.content.adultsFavoriteBoardGames;
        buildAdultsFavoriteBgTable(adultsFavoriteBG);

        const teensFavoriteBG = response.content.teensFavoriteBoardGames;
        buildTeensFavoriteBgTable(teensFavoriteBG);

        console.log(response.message);
      }
    );
  }
  function buildMostPlayedBgTable(mostPlayedBG) {
    $(".mostPlayedGames").empty();

    // Verifica se a lista existe e tem elementos
    if (mostPlayedBG.length > 0) {
      $.each(mostPlayedBG, function (index, bgname) {
        let firstLetter = bgname[0];
        let allOtherLetters = bgname.slice(1, bgname.length);
        let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
        $(".mostPlayedGames").append(li);
      });
    } else {
      $(".mostPlayedGames").append(`
            <li class="No data available"></li>          
        `);
    }
  }
  function buildBestRatedBbTable(bestRatedBG) {
    $(".bestRatedGames").empty();

    if (bestRatedBG.length > 0) {
      $.each(bestRatedBG, function (index, bgname) {
        let firstLetter = bgname[0];
        let allOtherLetters = bgname.slice(1, bgname.length);
        let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
        $(".bestRatedGames").append(li);
      });
    } else {
      $(".bestRatedGames").append(`
            <li class="No data available"></li>          
        `);
    }
  }
  function buildShortestBbTable(shortestBG) {
    $(".shortestGames").empty();

    if (shortestBG.length > 0) {
      $.each(shortestBG, function (index, bgname) {
        let firstLetter = bgname[0];
        let allOtherLetters = bgname.slice(1, bgname.length);
        let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
        $(".shortestGames").append(li);
      });
    } else {
      $(".shortestGames").append(`
            <li class="No data available"></li>          
        `);
    }
  }
  function buildLongestBgTable(longestBG) {
    $(".longestGames").empty();

    if (longestBG.length > 0) {
      $.each(longestBG, function (index, bgname) {
        let firstLetter = bgname[0];
        let allOtherLetters = bgname.slice(1, bgname.length);
        let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
        $(".longestGames").append(li);
      });
    } else {
      $(".longestGames").append(`
            <li class="No data available"></li>          
        `);
    }
  }
  function buildAdultsFavoriteBgTable(adultsFavoriteBG) {
    $(".adultsFavoriteGames").empty();

    if (adultsFavoriteBG.length > 0) {
      $.each(adultsFavoriteBG, function (index, bgname) {
        let firstLetter = bgname[0];
        let allOtherLetters = bgname.slice(1, bgname.length);
        let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
        $(".adultsFavoriteGames").append(li);
      });
    } else {
      $(".adultsFavoriteGames").append(`
            <li class="No data available"></li>          
        `);
    }
  }
  function buildTeensFavoriteBgTable(teensFavoriteBG) {
    $(".teensFavoriteGames").empty();
    if (teensFavoriteBG.length > 0) {
      $.each(teensFavoriteBG, function (index, bgname) {
        let firstLetter = bgname[0];
        let allOtherLetters = bgname.slice(1, bgname.length);
        let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
        $(".teensFavoriteGames").append(li);
      });
    } else {
      $(".teensFavoriteGames").append(`
            <li class="No data available"></li>          
        `);
    }
  }

  function loadCategoriesRankings(data = {}) {
    $("body").load("load");

    $.get(
      "https://localhost:7081/explore/categoriesranking",
      data,
      function (response) {
        if (
          !response.content ||
          !Array.isArray(response.content.mostPlayedCategories)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        const mostPlayedCats = response.content.mostPlayedCategories;
        buildMostPlayedCatsTable(mostPlayedCats);

        const mostPopularCats = response.content.mostPopularCategories;
        buildMostPopularCatsTable(mostPopularCats);

        const bestRatedCats = response.content.bestRatedCategories;
        buildBestRatedCatsTable(bestRatedCats);

        const longestCats = response.content.longestCategories;
        buildLogestCatsTable(longestCats);

        const shortestCats = response.content.shortestCategories;
        buildShortestCatsTable(shortestCats);

        console.log(response.message);

        $("body").load("unload");
      }
    );
  }
  function buildMostPlayedCatsTable(mostPlayedCats) {
    $("#mostPlayedCategories tbody").empty();

    if (mostPlayedCats.length > 0) {
      $.each(mostPlayedCats, function (index, item) {
        let tr = `
              <tr>              
                <td>${index + 1}</td> 
                <td class="text-start">${item.categoryName}</td>            
                <td class="text-center">${item.sessionsCount}</td>           
              </tr>
            `;
        $("#mostPlayedCategories tbody").append(tr);
      });
    } else {
      $("#mostPlayedCategories tbody").append(`
            <tr>
                <td class="No data available"></td>            
                <td class="No data available"></td>           
                <td class="No data available"></td>           
            </tr>                  
        `);
    }
  }
  function buildMostPopularCatsTable(mostPopularCats) {
    $("#mostPopularCategories tbody").empty();

    if (mostPopularCats.length > 0) {
      $.each(mostPopularCats, function (index, item) {
        let tr = `
              <tr>              
                <td>${index + 1}</td> 
                <td class="text-start">${item.categoryName}</td>            
                <td class="text-center">${item.sessionsCount}</td>   
                <td class="text-center">${item.boardGamesCount}</td>         
              </tr>
            `;
        $("#mostPopularCategories tbody").append(tr);
      });
    } else {
      $("#mostPopularCategories tbody").append(`
            <tr>
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>           
            </tr>                  
        `);
    }
  }
  function buildBestRatedCatsTable(bestRatedCats) {
    $("#bestRatedCategories tbody").empty();
    if (bestRatedCats.length > 0) {
      $.each(bestRatedCats, function (index, item) {
        let tr = `
              <tr>              
                <td>${index + 1}</td> 
                <td class="text-start">${item.categoryName}</td>            
                <td class="text-center">${item.avgRating}</td>   
                <td class="text-center">${item.ratingsCount}</td>         
              </tr>
            `;
        $("#bestRatedCategories tbody").append(tr);
      });
    } else {
      $("#bestRatedCategories tbody").append(`
            <tr>
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>           
            </tr>                  
        `);
    }
  }
  function buildLogestCatsTable(longestCats) {
    $("#longestCategories tbody").empty();

    if (longestCats.length > 0) {
      $.each(longestCats, function (index, item) {
        let tr = `
              <tr>              
                <td>${index + 1}</td> 
                <td class="text-start">${item.categoryName}</td>            
                <td class="text-center">${item.duration}</td>   
                <td class="text-center">${item.sessionsCount}</td>         
              </tr>
            `;
        $("#longestCategories tbody").append(tr);
      });
    } else {
      $("#longestCategories tbody").append(`
            <tr>
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>           
            </tr>                  
        `);
    }
  }
  function buildShortestCatsTable(shortestCats) {
    $("#shortestCategories tbody").empty();
    if (shortestCats.length > 0) {
      $.each(shortestCats, function (index, item) {
        let tr = `
              <tr>              
                <td>${index + 1}</td> 
                <td class="text-start">${item.categoryName}</td>            
                <td class="text-center">${item.duration}</td>   
                <td class="text-center">${item.sessionsCount}</td>         
              </tr>
            `;
        $("#shortestCategories tbody").append(tr);
      });
    } else {
      $("#shortestCategories tbody").append(`
            <tr>
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>            
                <td class="No data available"></td>           
            </tr>                  
        `);
    }
  }

  function loadBgDetails() {
    $("#bgSelection").select2({
      ajax: {
        url: "https://localhost:7081/explore/findboardgame",
        data: (params) => ({ boardGameName: params.term }),
        processResults: (data, params) => {
          return {
            results: data.content.map((item) => ({
              id: item.boardGameId,
              text: item.boardGameName,
            })),
          };
        },
      },
      templateResult: (data) => data.text,
      templateSelection: (data) => data.text,
      placeholder: "Board Games List",
      minimumInputLength: 4,
      allowClear: true,
      theme: "classic",
      width: "20rem",
    });
  }

  function loadEvents() {
    $("#displayAllBoardGames").on("click", function (e) {
      e.preventDefault();

      $("#bgFinderToggler").hide();
      $("#bgRankingListsToggler").hide();
      $("#categoriesRankingsToggler").hide();

      $("body").load("load");
      setTimeout(() => {
        $("body").load("unload");

        $("#allGamesTable").show();
      }, 500);
    });

    $("#searchBoardGames").on("click", function (e) {
      e.preventDefault();

      $("#allGamesTable").hide();
      $("#detailsTableToggler").hide();
      $("#bgRankingListsToggler").hide();
      $("#categoriesRankingsToggler").hide();

      $("body").load("load");
      setTimeout(() => {
        $("body").load("unload");

        $("#bgFinderToggler").show();
        $("#searchBGToggler").show();
      }, 500);
    });

    $("#displayBoardGamesRankings").on("click", function (e) {
      e.preventDefault();

      $("#allGamesTable").hide();
      $("#bgFinderToggler").hide();
      $("#categoriesRankingsToggler").hide();

      $("body").load("load");
      setTimeout(() => {
        $("body").load("unload");

        $("#bgRankingListsToggler").show();
      }, 500);
    });

    $("#displayCategoriesRankings").on("click", function (e) {
      e.preventDefault();

      $("#allGamesTable").hide();
      $("#bgFinderToggler").hide();
      $("#bgRankingListsToggler").hide();

      $("body").load("load");
      setTimeout(() => {
        $("body").load("unload");

        $("#categoriesRankingsToggler").show();
      }, 500);
    });

    $("#bgSelection").on("select2:select", function (e) {
      $("#submitBG").prop("disabled", false);
    });

    $("#submitBG").on("click", function () {
      $.get(
        `https://localhost:7081/explore/showboardgamedetails?BoardGameId=${$(
          "#bgSelection"
        ).val()}`
      ).done(function (response) {
        const game = response.content;

        bgName = game.boardGameName;
        let firstLetter = bgName[0];
        let allOtherLetters = bgName.slice(1, bgName.length);

        $("#gameDetails").html(`
          <div class="textBox">
              <h1><span>${firstLetter}</span>${allOtherLetters}</h1>
          </div> 

          <div class="featuresBox">
            <h3><span>F</span>eatures</h3>
            <ul class="" >
              <li  class="">Avg Duration: ${game.avgSessionDuration} Min.</li>
              <li  class="">Avg Rating: ${game.avgSessionDuration}</li>
              <li  class="">Age: ${game.minAge}+</li>
              <li  class="">Players Count: ${
                game.minPlayersCount
              }-${game.maxPlayerCount}</li>
              <li  class="">Category: ${game.category}</li>
              <li  class="">Mechanics: ${game.mechanics.join(", ")}</li>        
              <li  class="">Logged Sessions: ${game.loggedSessions}</li>
            </ul>
          </div>        
        `);

        let imgFolder = game.boardGameName.toLowerCase();
        let imgFile = imgFolder.toLowerCase().split().join("_");
        let imgSrc = `images/${imgFolder}/${imgFile}_pic`;
        $("#gamePics").html(`
             <h3><span>I</span>mages</h3>
                <div class="slideShowBox">
                  <div class="displayArea">
                    <div id="carouselExampleCaptions" class="carousel slide container">
                      <div class="carousel-indicators">
                        <button
                          type="button"
                          data-bs-target="#carouselExampleCaptions"
                          data-bs-slide-to="0"
                          class="active"
                          aria-current="true"
                          aria-label="Slide 1"
                        ></button>
                        <button
                          type="button"
                          data-bs-target="#carouselExampleCaptions"
                          data-bs-slide-to="1"
                          aria-label="Slide 2"
                        ></button>
                        <button
                          type="button"
                          data-bs-target="#carouselExampleCaptions"
                          data-bs-slide-to="2"
                          aria-label="Slide 3"
                        ></button>
                      </div>
                
                      <div class="carousel-inner" id="carousel-items">
                        <div class="carousel-item active">
                          <div class="rounded rounded imgBoxRed">
                            <img src="${imgSrc}1.png" class="rounded">    
                          </div>
                          <div class="carousel-caption d-none d-sm-block"></div>                                  
                        </div>
                
                        <div class="carousel-item">
                          <div class="rounded imgBoxYellow">
                            <img src="${imgSrc}2.png" class="rounded">    
                          </div>
                          <div class="carousel-caption d-none d-md-block"></div>
                        </div>
                
                        <div class="carousel-item">                        
                          <div class="rounded imgBoxBlue">
                            <img src="${imgSrc}3.png" class="rounded">    
                          </div>
                          <div class="carousel-caption d-none d-md-block"></div>
                        </div>
                      </div>
                
                      <button
                        class="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="prev"
                      >
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                      </button>
                      <button
                        class="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="next"
                      >
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                      </button>
                    </div>
                                      
                  </div>
                </div>
        `);

        $("#gameDescription").html(`
          <h3><span>D</span>escription</h3>
          <p>${game.boardGameDescription}</p>
        `);

        $("#gameSessions tbody").empty(tr);
        $.each(game.lastFiveSessions, function (index, item) {
          if (index >= 5) return false;

          let tr = `
            <tr>              
              <td>${item.userNickName}</td>
              <td>${item.date}</td>
              <td>${item.playersCount}</td>
              <td>${item.duration}</td>
            </tr>
          `;
          $("#gameSessions tbody").append(tr);
        });

        $("#detailsTableToggler").show();

        $("#searchBGToggler").hide();
      });
    });

    $("#showLastFiveSessions").on("click", function (e) {
      e.preventDefault();

      if ($(".iLayer").hasClass("iLayer-show")) {
        $(".iLayer").removeClass("iLayer-show").addClass("iLayer-hide");
        $(".iLayer a").css("transform", "rotate(0deg)");
      } else {
        $(".iLayer").removeClass("iLayer-hide").addClass("iLayer-show");
        $(".iLayer a").css("transform", "rotate(180deg)");
      }

      setTimeout(() => {
        if ($(".expandBox").hasClass("unselectedState")) {
          $(".expandBox")
            .removeClass("unselectedState")
            .addClass("selectedState");
        } else {
          $(".expandBox")
            .removeClass("selectedState")
            .addClass("unselectedState");
        }
      }, 500);
    });

    $("#hideLastFiveSessions").on("click", function (e) {
      e.preventDefault();

      if ($(".iLayer").hasClass("iLayer-show")) {
        $(".iLayer").removeClass("iLayer-show").addClass("iLayer-hide");
        $(".iLayer a").css("transform", "rotate(0deg)");
      } else {
        $(".iLayer").removeClass("iLayer-hide").addClass("iLayer-show");
        $(".iLayer a").css("transform", "rotate(180deg)");
      }

      setTimeout(() => {
        if ($(".expandBox").hasClass("unselectedState")) {
          $(".expandBox")
            .removeClass("unselectedState")
            .addClass("selectedState");
        } else {
          $(".expandBox")
            .removeClass("selectedState")
            .addClass("unselectedState");
        }
      }, 1000);
    });
  }

  function loadRankings() {
    loadAllGames();
    loadBgRankings();
    loadCategoriesRankings();
  }

  function Build() {
    loadRankings();
    loadEvents();
    loadBgDetails();
  }

  Build();
});
