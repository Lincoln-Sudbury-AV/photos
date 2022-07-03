// Copyright ©2021-2022 Davin Martin

console.log("" +
    "┌───────────────────────┐\n" +
    "│ ┌───┐   ╭───╮   ┌───┐ │\n" +
    "│ │   │   │   │   │   │ │\n" +
    "│ └───┘   ╰───╯   └───┘ │\n" +
    "├───────────────────────┤\n" +
    "│ ┯━┯━━━━━━━━━━━━━━━┯━┯ │\n" +
    "└─┤ │  Website  By  │ ├─┘\n" +
    "  │ │ Davin  Martin │ │  \n" +
    "  │ └───────────────┘ │  \n" +
    "  │                   │  \n" +
    "  └───────────────────┘  ");

$(window).on('load', function() {
    initializeCustomNavbarCollapseIcon();
    initializeModals();
});

$(window).on('load resize scroll', function() {
    updateNavbarPosition();
    lazyLoadImages();
});

$(document).bind("contextmenu", customContextMenu);


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
    if (window.scrollY > 56 || window.innerWidth < 768) {
        $("#navbar").addClass("fixed-top");
        $("#navbar-brand").css("opacity", 1);
    } else {
        $("#navbar").removeClass("fixed-top");
        $("#navbar-brand").css("opacity", 0);
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

function preloadImage(src, onload, onerror) {
    let img = new Image();
    img.src = src;
    img.onload = onload;
    img.onerror = onerror;
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
