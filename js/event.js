// Copyright ©2021-2022 Davin Martin

console.log("" +
    "╭───────────────────────╮\n" +
    "│ ┌───┐   ╭───╮   ┌───┐ │\n" +
    "│ │   │   │   │   │   │ │\n" +
    "│ └───┘   ╰───╯   └───┘ │\n" +
    "├───────────────────────┤\n" +
    "│ ┯━┯━━━━━━━━━━━━━━━┯━┯ │\n" +
    "╰─┤ │  Website  By  │ ├─╯\n" +
    "  │ │ Davin  Martin │ │  \n" +
    "  │ └───────────────┘ │  \n" +
    "  │                   │  \n" +
    "  └───────────────────┘  ");

const eventId = window.location.search.substring(1).split("&")[0];
const categoryId = window.location.search.substring(1).split("&")[1];

if (eventId.endsWith("=")) {
    window.location.search = eventId.split("=")[0];
}

try {
    if (categoryId.startsWith("fbclid")) {
        if (window.location.search.substring(1).split("&")[2]) {
            window.location.search = eventId + "&" + window.location.search.substring(1).split("&")[2];
        } else {
            window.location.search = eventId;
        }
    }
} catch (e) {
    null
}

$(window).on('load', function() {
    loadEvent(eventId, function (event) {
        $("title").text(event.name + " | LSAV Photography")

        if (categoryId) {
            importCategory(event, categoryId);
        } else {
            importEvent(event);
        }

        initializeCustomNavbarCollapseIcon();
        initializeModals();

        updateNavbarPosition();
        lazyLoadImages();
    }, function () {
        
    })
});

$(window).on('resize scroll', function() {
    updateNavbarPosition();
    lazyLoadImages();
});

$(document).bind("contextmenu", customContextMenu);


//Event
function httpGet(theUrl, onload, onerror) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.setRequestHeader("Accept", "application/json, text/plain, */*")
    xmlHttp.onload = onload;
    xmlHttp.onerror = onerror;
    xmlHttp.send(null);
}

function loadEvent(id, onload, onerror) {
    let eventIndex = "events/" + id + "/index.json"
    httpGet(eventIndex, function(e) {
        if (onload) {
            onload(JSON.parse(e.target.responseText));
        }
    }, onerror);
}

function importEvent(event) {
    $("#gallery").empty().addClass(["row-cols-1", "row-cols-md-2", "row-cols-lg-3", "row-cols-xl-4"])
    for (let i in event.gallery) {
        let galleryCover = $("<div></div>").addClass(["gallery-cover", "event"]).on("click", function () {
            window.location.search = eventId + "&" + customURIEncode(event.gallery[i].name);
        });
        let galleryText = $("<div></div>").addClass(["gallery-text", "event"]).text(event.gallery[i].name);
        let galleryImage = $("<img>").addClass(["col", "gallery", "thumb"]).attr({
            "src": "events/" + event.id + "/" + event.gallery[i].photos[0] + "-thumb.jpg",
            "small-src": "events/" + event.id + "/" + event.gallery[i].photos[0] + "-small.jpg",
            "full-src": "events/" + event.id + "/" + event.gallery[i].photos[0] + "-full.jpg"
        });
        let galleryContainer = $("<div></div>").addClass("gallery-container").append(galleryCover).append(galleryText).append(galleryImage);
        $("#gallery").append(galleryContainer)
    }
}

function importCategory(event, category) {
    $("#navbar-brand").html("<svg class='navbar-back MuiSvgIcon-root jss79' focusable='false' viewBox='0 0 24 24' aria-hidden='true'><path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'></path></svg>" + event.name)
    try {
        if (document.referrer.includes(window.location.host) && document.referrer.split("?")[1] === eventId) {
            $("#navbar-brand").attr("href", "#").on("click", function () {
                try {
                    window.history.back()
                } catch (e) {
                    window.location.pathname = "/photos/event?" + eventId
                }
            })
        } else {
            throw "backinvalid"
        }
    } catch (e) {
        $("#navbar-brand").attr("href", "event?" + eventId)
    }
    $("#gallery").empty().addClass(["row-cols-1", "row-cols-md-2", "row-cols-lg-3", "row-cols-xl-4"])
    for (let i in event.gallery) {
        if (category === customURIEncode(event.gallery[i].name)) {
            for (let j in event.gallery[i].photos) {
                let galleryImage = $("<img>").addClass(["col", "gallery", "thumb"]).attr({
                    "src": "events/" + event.id + "/" + event.gallery[i].photos[j] + "-thumb.jpg",
                    "small-src": "events/" + event.id + "/" + event.gallery[i].photos[j] + "-small.jpg",
                    "full-src": "events/" + event.id + "/" + event.gallery[i].photos[j] + "-full.jpg"
                });
                let galleryContainer = $("<div></div>").addClass("gallery-container").append(galleryImage);
                $("#gallery").append(galleryContainer)
            }
        }
    }
}

function customURIEncode(uri) {
    return encodeURIComponent(uri.replaceAll(" ", "-").toLowerCase())
}


//Gallery
function initializeCustomNavbarCollapseIcon() {
    $('.navbar-collapse').on('show.bs.collapse', function() {
        $(".navbar-toggler-icon").fadeTo(200, 0);
        setTimeout(function() {
            $(".navbar-toggler-icon").css("background-image","url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cpath" +
                " stroke='rgba(0, 0, 0, 0.5)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M7 7 L 23 23 M23 7 L 7 23'%3E%3C/path%3E%3C/svg%3E\")").fadeTo(200, 1);
        }, 150);
    });
    $('.navbar-collapse').on('hide.bs.collapse', function() {
        $(".navbar-toggler-icon").fadeTo(200, 0);
        setTimeout(function() {
            $(".navbar-toggler-icon").css("background-image","").fadeTo(200, 1);
        }, 150);
    });
}

function customContextMenu(e) {
    e.preventDefault();
    if (window.navigator.userAgent.includes("Mobile")) {
        //Change Position If Mobile
        $("#context-menu").finish().fadeIn(100).css({
            top: (e.pageY - 48) + "px",
            left: (e.pageX - 67) + "px"
        }).delay(2000).fadeOut(100);
    } else {
        $("#context-menu").finish().fadeIn(100).css({
            top: e.pageY + "px",
            left: e.pageX + "px"
        }).delay(2000).fadeOut(100);
    }
}

function updateNavbarPosition() {
    if (window.scrollY > 56 || window.innerWidth < 768 || categoryId !== undefined) {
        $("#navbar-brand").css("opacity", 1);
    } else {
        $("#navbar-brand").css("opacity", 0);
    }
    if (window.scrollY > 56 || window.innerWidth < 768) {
        $("#navbar").addClass("fixed-top");
    } else {
        $("#navbar").removeClass("fixed-top");
    }
}

function initializeModals() {
    $(".gallery-container").on("click", function (e) {
        imageModal($(e.target).children().first().attr("full-src"))
    });
}

function imageModal(img) {
    if (img === undefined || img === false) {
        $("#image-modal-image").off("load");
        $("#image-modal-container").css({"opacity": 0, "pointer-events": "none"});
    } else {
        $("#image-modal-image").hide(0).attr("src", img).on("load", function () {
            $("#image-modal-download").attr({
                "href": img,
                "download": "lsav-photography-" + eventId + "-" + categoryId + "-" + img.split('/').pop().split("-")[0] + "." + img.split('.').pop()
            }).off("click").on("click", function (e) {
                e.stopPropagation();
            });
            $("#image-modal-loading").hide(0);
            $("#image-modal-image").off("load").show(0);
        });
        $("#image-modal-loading").show(0);
        setTimeout(function () {
            $("#image-modal-container").css({"opacity": 1, "pointer-events": "auto"});
        },50)
    }
}


//Lazy Loading
function inViewport(elem) {
    const elemHeight = $(elem).height();
    const elemTop = $(elem).offset().top;
    const elemBottom = elemTop + elemHeight;

    const docViewTop = window.scrollY;
    const docViewBottom = docViewTop + window.innerHeight;

    const docRangeTop = docViewTop - elemHeight;
    const docRangeBottom = docViewBottom + elemHeight;


    return (elemBottom <= docRangeBottom) && (elemTop >= docRangeTop);
}

function lazyLoadImages() {
    for (let img = 0; img < $(".gallery-container").length; img++) {
        if (inViewport($(".gallery-container").eq(img)) && $(".thumb").eq(img).attr("small-src") !== "loaded") {
            let newImg = $("<img>").addClass("col gallery small").attr("src", $(".thumb").eq(img).attr("small-src")).on("load", function () {
                $(".thumb").eq(img).fadeOut();
            }.bind(img))
            $(".gallery-container").eq(img).append(newImg);
            $(".thumb").eq(img).attr("small-src", "loaded");
        }
    }
}
