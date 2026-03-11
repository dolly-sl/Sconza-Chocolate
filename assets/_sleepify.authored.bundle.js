// Sleepify Starter Theme by Sleepless Media
//
// Main Javascript entry file.

console.log("%c This site was designed & developed by https://www.sleeplessmedia.com", "background:#000; color: #ae956e; padding: 10px 15px; font-size: 13px; font-weight: 500; width: 100%;");

// Create our number formatter.
var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

// Cookies functions
function setCookie(cookieName, cookieValue) {
  var today = new Date();
  var expire = new Date();
  expire.setTime(today.getTime() + 3600000 * 24 * 7);
  document.cookie = cookieName + "=" + encodeURI(cookieValue) + ";expires=" + expire.toGMTString();
}
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
// Footer accordion
var footerAccordion = document.querySelectorAll(".footer-accordion-btn");
footerAccordion.forEach(function (btn) {
  btn.addEventListener("click", function () {
    var plusBtn = btn.querySelector(".plus-icon");
    var minusBtn = btn.querySelector(".minus-icon");
    plusBtn.classList.toggle("tw-hidden");
    minusBtn.classList.toggle("tw-hidden");
    btn.nextElementSibling.classList.toggle("tw-hidden");
  });
});

// jQuery( document ).ready( function( $ ) {
//   // Simple accordion functionality
//   $( '.accordion__group button' ).on( 'click', function( e ) {
//     e.preventDefault();

//     // If item clicked on is open, close it
//     if ( $( this ).closest( '.accordion__group' ).hasClass( 'active' ) ) {
//       $( this ).closest( '.accordion__group' ).removeClass( 'active' );
//       $( this ).closest( '.accordion__group' ).find( '.accordion__copy' ).slideUp();
//     } else {

//       // Otherwise, close all others and open the one clicked on
//       $( '.accordion__group' ).removeClass( 'active' );
//       $( '.accordion__copy' ).slideUp();

//       $( this ).closest( '.accordion__group' ).addClass( 'active' );
//       $( this ).closest( '.accordion__group' ).find( '.accordion__copy' ).slideToggle();
//     }

//   } )
// });
jQuery(document).ready(function ($) {
  // Show / hide address add form
  $('.customer--addresses .add-address').on('click', function (e) {
    $('#address-add').toggle();
    $('#address-list').toggle();
  });

  // Show / hide address add form
  $('.customer--addresses .add-address-cancel').on('click', function (e) {
    $('#address-add').toggle();
    $('#address-list').toggle();
  });
});
jQuery(document).ready(function ($) {
  /******************************************
   QTY Selector ( Simple quantity box increase / decrease )
  ******************************************/

  // PDP / PLP
  $('.js-qty:not(.js-qty--cart)').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $parent = $this.parent();
    var qtyInput = $parent.find('input');
    var qtyInputVal = qtyInput.val();
    qtyInputVal = $.isNumeric(qtyInputVal) ? qtyInputVal : 1;
    if ($this.hasClass('js-qty--plus')) {
      qtyInputVal++;
      qtyInputVal = qtyInputVal < 1 ? 1 : qtyInputVal;
    } else {
      qtyInputVal--;
      qtyInputVal = qtyInputVal < 1 ? 1 : qtyInputVal;
    }
    qtyInput.val(qtyInputVal);
  });
  $('body').on('click', '.product--default .btn--atc', function () {
    var id = $(this).attr('data-id');
    CartJS.addItem(parseInt(id), 1, {}, {
      "success": function success(data, textStatus, jqXHR) {
        jQuery.getJSON('/cart.js', function (cart) {
          refreshMiniCart(cart);
        });
      },
      "error": function error(jqXHR, textStatus, errorThrown) {
        //error state
        console.log('Error: ' + errorThrown + '!');
      }
    });
  });

  // MAIN CART

  // Allow typing of input qty for update
  var timer;
  $('.col__qty, .mobile-stuff').on('keyup', '.qty input', function () {
    var $this = $(this);
    var newVal = $this.val();
    var lineNum = $this.closest('.cart-row').attr('data-linenum');

    // clear the previous timer
    clearTimeout(timer);

    // create a new timer with a delay of 300ms seconds,
    // if the keyup is fired before the 300ms secs then the timer will be cleared
    timer = setTimeout(function () {
      // this will be executed if there is a gap of 300ms seconds between 2 keyup events
      CartJS.updateItem(lineNum, newVal, {}, {
        success: function success(data, textStatus, jqXHR) {
          location.reload();
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      });
    }, 300);
  });
  $('.col__qty, .mobile-stuff').on('click', '.js-qty--cart', function (e) {
    e.preventDefault();
    var $this = $(this);
    var qtyInput = $this.closest('.qty').find('input');
    var qtyInputVal = qtyInput.val();
    qtyInputVal = $.isNumeric(qtyInputVal) ? qtyInputVal : 1;
    var lineNum = $this.closest('.cart-row').attr('data-linenum');
    if ($this.hasClass('js-qty--plus')) {
      qtyInputVal++;
      qtyInputVal = qtyInputVal < 1 ? 1 : qtyInputVal;
    } else {
      qtyInputVal--;
      qtyInputVal = qtyInputVal < 1 ? 1 : qtyInputVal;
    }
    if (qtyInputVal >= 1) {
      console.log('got here');
      CartJS.updateItem(lineNum, qtyInputVal, {}, {
        success: function success(data, textStatus, jqXHR) {
          location.reload();
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      });
    } else {
      CartJS.removeItem(lineNum, {
        success: function success(data, textStatus, jqXHR) {
          location.reload();
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      });
    }
  });

  // MAIN CART REMOVE
  $('.actions .remove-product').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var lineID = $this.closest('.cart-row').attr('data-lineid');
    CartJS.removeItemById(lineID, {
      success: function success(data, textStatus, jqXHR) {
        location.reload();
      },
      error: function error(jqXHR, textStatus, errorThrown) {}
    });
  });

  /******************************************
    Options to change SM-RC Widget dropdowns
   ******************************************/

  // SELECT TYPE
  $('.option__wrap select').on('change', function () {
    var optionVal = $(this).val();
    var optionNum = $(this).closest('.option__wrap').attr('data-option');
    $('select[' + optionNum + ']').val(optionVal).change();
  });

  // BUTTON TYPE
  $('.option__wrap button').on('click', function (e) {
    var optionVal = $(this).attr('data-val');
    var optionNum = $(this).closest('.option__wrap').attr('data-option');

    // Set visual display of active
    $(this).closest('.option__wrap').find('button').removeClass('active');
    $(this).addClass('active');
    $('select[' + optionNum + ']').val(optionVal).change();
  });

  // RECHARE WIDGET VARIANTS
  $('.pdp__recharge input').on('click', function () {
    if ($(this).val() == 'rc-yes') {
      $('.form__group--rc').show();
      var planId = $(this).closest('.pdp__recharge').find('.frequency-select').val();
      $('[sm-rc-plan-selector]').val(planId).change();
    } else {
      $('.form__group--rc').hide();
      $('[sm-rc-plan-selector]').val('false').change();
    }
  });

  // RECHARE WIDGET SUBSCRIPTION PLAN
  $('.template__product .frequency-select').on('change', function () {
    var planId = $(this).val();
    $('[sm-rc-plan-selector]').val(planId).change();
  });
});
jQuery(document).ready(function ($) {
  // Make mobile category selector go to tag page
  $('.blog__tags select').on('change', function () {
    var tagUrl = $(this).val();
    window.location = tagUrl;
  });
});
jQuery(document).ready(function ($) {
  // Collections Carousel

  // Initially hide all sliders except the first one
  $(".swiper.flavorsSwiper").not("#slider-1").hide();

  // Click event for tabs
  $("button[id^='tab-']").click(function () {
    var index = $(this).attr("id").replace("tab-", "");
    var targetSlider = $("#slider-" + index);

    // Deactivate all tabs and activate the clicked one
    $("button[id^='tab-']").removeClass("tw-border-mainGold").addClass("tw-border-transparent");
    $(this).addClass("tw-border-mainGold").removeClass("tw-border-transparent");

    // Fade out visible slider, then fade in the target slider
    $(".swiper.flavorsSwiper:visible").fadeOut(300, function () {
      // Once fade out is complete, hide any sliders that might not have been hidden due to rapid tab switching
      $(".swiper.flavorsSwiper").hide();
      // Now, fade in the target slider
      targetSlider.fadeIn(300);
    });
  });

  /******************************************
    Header Search
  ******************************************/

  // Show desktop search on click and focus on input
  $(".icon--search").on("click", function (e) {
    e.preventDefault();
    $(".desktop-search").fadeIn("fast", "", function () {
      $("body").addClass("search-open");
      $(".desktop-search input").focus();
    });
  });

  // Close desktop search if click outside
  $("body").on("click", function (e) {
    var desktopSearch = $(".desktop-search");
    if (!desktopSearch.is(e.target) && desktopSearch.has(e.target).length === 0 && $("body").hasClass("search-open")) {
      desktopSearch.fadeOut("fast", "", function () {
        $("body").removeClass("search-open");
        $(".icon--search").focus();
      });
    }
  });

  /******************************************
    Modals
  ******************************************/

  // Launch the modal
  $(".btn--modal").on("click", function (e) {
    e.preventDefault();
    var modalID = "#" + $(this).attr("data-modal");
    if ($(this)[0].hasAttribute("data-video-yt")) {
      var videoID = $(this).attr("data-video-yt");
      $(modalID).find(".modal__inner").append('<div class="iframe-wrap"><iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoID + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
    }
    if ($(this)[0].hasAttribute("data-video-vimeo")) {
      var videoID = $(this).attr("data-video-vimeo");
      $(modalID).find(".modal__inner").append('<div class="iframe-wrap"><iframe width="560" height="315" src="https://player.vimeo.com/video/' + videoID + '"  frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen allowfullscreen></iframe></div>');
    }
    $(modalID).fadeIn("fast");
  });

  // Close the modal
  $(".modal--close, .modal__bg").on("click", function (e) {
    closeModal($(this));
  });

  // FAQ Accordion
  var items = document.querySelectorAll(".accordion button");
  for (i = 0; i < items.length; i++) {
    items[i].setAttribute("aria-expanded", "false");
  }
  function toggleAccordion() {
    var itemToggle = this.getAttribute("aria-expanded");
    for (i = 0; i < items.length; i++) {
      items[i].setAttribute("aria-expanded", "false");
    }
    if (itemToggle == "false") {
      this.setAttribute("aria-expanded", "true");
    }
  }
  items.forEach(function (item) {
    return item.addEventListener("click", toggleAccordion);
  });

  // Footer accordion
  var footerAccordion = document.querySelectorAll(".footer-accordion-btn");
  footerAccordion.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var plusBtn = btn.querySelector(".plus-icon");
      var minusBtn = btn.querySelector(".minus-icon");
      plusBtn.classList.toggle("tw-hidden");
      minusBtn.classList.toggle("tw-hidden");
      btn.nextElementSibling.classList.toggle("tw-hidden");
    });
  });
});
function closeModal(object) {
  object.closest(".modal").fadeOut("fast", function () {
    $(".modal__inner .iframe-wrap").remove();
  });
}
document.addEventListener("DOMContentLoaded", function () {
  // Sticky navbar
  function fixedHeader() {
    var header = document.querySelector(".header");
    var headerBanner = document.querySelector(".header-banner");
    var sconzaLogo = document.querySelector(".sconza-logo");
    var mobileMenu = document.querySelector(".mobile-menu");
    var searchPopup = document.querySelector(".desktop-search .absolute-wrap");
    if (this.scrollY >= 150) {
      header.classList.add("fixed-header");
      headerBanner.classList.add("tw-hidden");
      sconzaLogo.classList.add("tw-h-[74px]");
      mobileMenu.classList.add("tw-top-[74px]");
      mobileMenu.classList.remove("tw-top-[134px]");
      searchPopup.classList.add("tw-top-[74px]");
      searchPopup.classList.remove("tw-top-[134px]");
    } else {
      header.classList.remove("fixed-header");
      headerBanner.classList.remove("tw-hidden");
      sconzaLogo.classList.remove("tw-h-[74px]");
      mobileMenu.classList.remove("tw-top-[74px]");
      mobileMenu.classList.add("tw-top-[134px]");
      searchPopup.classList.remove("tw-top-[74px]");
      searchPopup.classList.add("tw-top-[134px]");
    }
  }
  window.addEventListener("scroll", fixedHeader);
  var dropdownButtons = document.querySelectorAll(".dropdown-toggle");
  var dropdownOverlay = document.querySelector(".dropdown-overlay");
  dropdownButtons.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      var dropdown = btn.querySelector(".dropdown");
      var isDropdownVisible = !dropdown.classList.contains("tw-hidden");

      // Hide all dropdowns and the overlay
      dropdownButtons.forEach(function (btn) {
        btn.classList.remove("navlink-active");
        btn.querySelector(".dropdown").classList.add("tw-hidden");
      });
      dropdownOverlay.classList.add("tw-hidden");

      // Toggle the current dropdown and overlay visibility
      if (!isDropdownVisible) {
        btn.classList.add("navlink-active");
        dropdown.classList.remove("tw-hidden");
        dropdownOverlay.classList.remove("tw-hidden");
      }
    });
  });

  //   const dropdownButton2 = document.querySelector(".show-dropdown");
  //   dropdownButton2.addEventListener("click", () => {
  //     const dropdown = dropdownButton2.querySelector(".dropdown");
  //     const isDropdownVisible = !dropdown.classList.contains("tw-hidden");

  //     // Hide all dropdowns and the overlay
  //     dropdownButtons.forEach((btn) => {
  //       btn.classList.remove("navlink-active");
  //       btn.querySelector(".dropdown").classList.add("tw-hidden");
  //     });
  //     dropdownOverlay.classList.add("tw-hidden");

  //     // Toggle the current dropdown and overlay visibility
  //     if (!isDropdownVisible) {
  //       dropdownButton2.classList.add("navlink-active");
  //       dropdown.classList.remove("tw-hidden");
  //       dropdownOverlay.classList.remove("tw-hidden");
  //     }
  //   });

  var mobileMenuButton = document.querySelector(".open-mobile-menu");
  var openMenuIcon = document.querySelector(".open-menu-icon");
  var closeMenuIcon = document.querySelector(".close-menu-icon");
  var mobileMenu = document.querySelector(".mobile-menu");
  mobileMenuButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("tw-hidden");
    openMenuIcon.classList.toggle("tw-hidden");
    closeMenuIcon.classList.toggle("tw-hidden");
  });
  var dropdownMobileButton = document.querySelector(".dropdown-mobile-toggle");
  var dropdownLinkIcon = document.querySelector(".arrow-icon");
  var dropdownMenuMobile = document.querySelector(".dropdown-menu-mobile");
  dropdownMobileButton.addEventListener("click", function () {
    dropdownLinkIcon.classList.toggle("tw-rotate-90");
    dropdownMenuMobile.classList.toggle("tw-hidden");
  });

  // Close dropdown when clicking on the overlay
  dropdownOverlay.addEventListener("click", function () {
    // Hide all dropdowns and the overlay
    dropdownButtons.forEach(function (btn) {
      btn.classList.remove("navlink-active");
      btn.querySelector(".dropdown").classList.add("tw-hidden");
    });
    dropdownOverlay.classList.add("tw-hidden");
    if (dropdownButton2) {
      dropdownButton2.classList.remove("navlink-active");
      dropdownButton2.querySelector(".dropdown").classList.add("tw-hidden");
    }
  });

  // Close dropdowns with ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      // Hide all dropdowns and the overlay
      dropdownButtons.forEach(function (btn) {
        btn.classList.remove("navlink-active");
        btn.querySelector(".dropdown").classList.add("tw-hidden");
      });
      dropdownOverlay.classList.add("tw-hidden");
      if (dropdownButton2) {
        dropdownButton2.classList.remove("navlink-active");
        dropdownButton2.querySelector(".dropdown").classList.add("tw-hidden");
      }
    }
  });
});

// jQuery(document).ready(function ($) {
// // Init header offset function
// headerOffset();
// // Update offset on scroll
// $(window).on("scroll resize", function () {
// 	headerOffset();
// });
// // Update offset on alert bar close
// $(".alert-bar .close--alert").on("click", function () {
// 	$(".alert-bar").remove();
// 	headerOffset();
// });
// // Offset content from fixed header
// function headerOffset() {
// 	var headerHeight = $(".fixed-wrap").innerHeight();
// 	$("#main").css("padding-top", headerHeight + "px");
// 	$(".pdp__images").css("top", headerHeight + "px");
// 	$(".mobile-menu__inner, .mini-cart").css(
// 		"height",
// 		"calc( 100vh - " + headerHeight + "px )"
// 	);
// 	$(window).on("scroll resize", function () {
// 		var newsHeight = $(".fixed-wrap .alert-bar").innerHeight();
// 		if ($(window).scrollTop() >= 350) {
// 			$(".fixed-wrap").addClass("scrolling");
// 			if (newsHeight != undefined) {
// 				$(".fixed-wrap").css(
// 					"transform",
// 					"translateY(-" + newsHeight + "px)"
// 				);
// 			}
// 			$(".mobile-menu__inner").css(
// 				"height",
// 				"calc( 100vh - " + headerHeight + "px )"
// 			);
// 		} else {
// 			$(".fixed-wrap").removeClass("scrolling");
// 			$(".fixed-wrap").css("transform", "translateY(0)");
// 		}
// 	});
// }
// });

function bindMinicartQtySelector(){
        $(".mini-cart__list .qty button").unbind('click');
        $(".mini-cart__list .qty button").on("click", function (e) {
        e.preventDefault();
        var $this = $(this);
        var $parent = $this.parent();
        var qtyInput = $parent.find("input");
        var qtyInputVal = qtyInput.val();
        qtyInputVal = $.isNumeric(qtyInputVal) ? qtyInputVal : 0;
        var lineData = $this.closest(".product").data("lineid");
        if ($this.hasClass("js-qty--plus")) {
            qtyInputVal++;
            qtyInputVal = qtyInputVal < 0 ? 1 : qtyInputVal;
        } else {
            qtyInputVal--;
            qtyInputVal = qtyInputVal < 1 ? 1 : qtyInputVal;
        }
        CartJS.updateItem(lineData, qtyInputVal, {}, {
            success: function success(data, textStatus, jqXHR) {
            jQuery.getJSON("/cart.js", function (cart) {
                refreshMiniCart(cart);
            });
            },
            error: function error(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            }
        });
        });
    }

function bindMiniCartRemove(){
  $(".mini-cart .remove-product").unbind('click');
  $(".mini-cart .remove-product").on("click", function () {
    var lineNum = $(this).closest(".product").attr("data-lineid");
    $(this).closest(".product").addClass("removed");
    CartJS.removeItem(lineNum, {
      success: function success(data, textStatus, jqXHR) {
        jQuery.getJSON("/cart.js", function (cart) {
          refreshMiniCart(cart);
        });
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  });
}

jQuery(document).ready(function ($) {
  // Close mini cart
  $(".mini-cart__bg, .mini-cart__content .close").on("click", function () {
    closeMini();
  });

  // Show mini cart and focus on the close button
  $(".header .icon--cart").on("click", function (e) {
    e.preventDefault();
    if (!$("body").hasClass("template__cart")) {
      showMini();

      // Focus on the close button after opening the mini cart
      $(".mini-cart__content .close").focus();
    } else {
      e.preventDefault();
    }
  });

  // Close mini cart with ESC key
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      if ($(".mini-cart").is(":visible")) {
        closeMini();
      }
    }
  });

  // Mini Cart Remove Product
  bindMiniCartRemove();

  // Mini Cart Upsell ATC
  $(".mini-cart__upsell .action--atc").on("click", function (e) {
    e.preventDefault();
    var dataId = $(this).closest(".upsell").attr("data-id");
    CartJS.addItem(dataId, 1, {}, {
      success: function success(data, textStatus, jqXHR) {
        jQuery.getJSON("/cart.js", function (cart) {
          refreshMiniCart(cart);
        });
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  });

  // Mini Cart Qty
  
  bindMinicartQtySelector();
  

  // Allow typing of input qty for update
  var timer;
  $(".mini-cart__list").on("keyup", ".actions .qty-val", function () {
    var $this = $(this);
    var newVal = $this.val();
    var lineData = $this.closest(".product").data("lineid");

    // clear the previous timer
    clearTimeout(timer);

    // create a new timer with a delay of 300ms seconds,
    // if the keyup is fired before the 300ms secs then the timer will be cleared
    timer = setTimeout(function () {
      // this will be executed if there is a gap of 300ms seconds between 2 keyup events
      console.log(newVal);
      CartJS.updateItem(lineData, newVal, {}, {
        success: function success(data, textStatus, jqXHR) {
          jQuery.getJSON("/cart.js", function (cart) {
            refreshMiniCart(cart);
          });
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      });
    }, 300);
  });
});
function closeMini() {
  $("body").removeClass("cart-open");
  $(".mini-cart").removeClass("is-open");
  $(".mini-cart").fadeOut("fast");
}
function showMini() {
  $("body").addClass("cart-open");
  $(".mini-cart").fadeIn("fast");
  $(".mini-cart").addClass("is-open");

  // Set height of product list for full-height mini-cart
  // var miniHead = parseInt( $( '.mini-cart__header' ).innerHeight() );
  // var miniShip = parseInt( $( '.mini-cart__ship' ).innerHeight() );
  // var miniFooter = parseInt( $( '.mini-cart__footer' ).innerHeight() );
  // var miniUp = parseInt( $( '.mini-cart__upsell' ).innerHeight() );
  // var miniTotalHeight = miniHead + miniShip + miniFooter + miniUp;
}
function refreshMiniCart(cartData) {
    var cartItems = cartData.items;

    // Free shipping updater
    var totalShip = parseInt($(".mini-cart").data("freeship"));
    var newCartTotal = cartData.items_subtotal_price;
    var awayShip = totalShip - newCartTotal;
    var shipPercent = newCartTotal / totalShip * 100;
    if (shipPercent >= 100) {
        $(".shipping-bar--progress").css("width", "100%");
        $(".mini-cart__ship").addClass("is-free");
    } else {
        if ($(".mini-cart__ship").hasClass("is-free")) {
        $(".mini-cart__ship").removeClass("is-free");
        }
        $(".free-count").text(formatter.format(awayShip / 100));
        $(".shipping-bar--progress").css("width", shipPercent + "%");
    }

    $(".mini-cart__list h3.text-center").remove();
    $('.mini-cart__list .product').remove();
    // If cart is now empty
    if (cartData.item_count == 0) {
        $(".mini-cart__list").prepend('<h3 class="text-center">Cart is empty</h3>');
    } else {
        // Build html of new products in cart
        $.each(cartItems, function (index, item) {
            // Opening
            
            var prodHTML = `
                <div class="product product--cart d-flex justify-between" style="order:${index};" data-lineid="${index + 1}" data-varid="${item.id}">
                <div class="product__image">
                <a href="${item.url}">
                    <img src="${item.featured_image.url.replace(".jpg", "_80x.jpg").replace(".png", "_80x.png")}" srcset="${item.featured_image.url.replace(".jpg", "_160x.jpg").replace(".png", "_160x.png")} 2x" alt="${item.image.alt}">
                </a>
                </div>
                <div class="product__info">
                    <div class="title d-flex">
                        <h3 class="tw-text-base tw-uppercase tw-text-mainBlack tw-font-osc tw-flex tw-justify-between">
                            <a class="no-dec trans" href="${item.url}">
                                ${item.title}
                            </a>
                            <button class="remove-product trans animate">
                                <span class="sr-only">Remove</span>
                                <img src="//sconza.com/cdn/shop/t/19/assets/icon-trash.svg?v=85424820541012395581754593823" alt="Trash Icon">
                            </button>
                        </h3>
                        <div class="var tw-font-os tw-text-xs tw-font-normal tw-text-mainBlack">
                            <span>${item.options_with_values[0].value}</span>
                        </div>
                    </div>
                    <div class="actions d-flex align-center justify-between">
                        <div class="action action--qty">
                        <div class="qty d-flex align-center">
                            <button class="js-qty js-qty--mini js-qty--minus trans">
                            <span class="sr-only">Decrease</span>
                            </button>
                            <input sm-rc-quantity-selector="" type="text" value="${item.quantity}" min="1" class="qty-val">
                            <button class="js-qty js-qty--mini js-qty--plus trans">
                            <span class="sr-only">Increase</span>
                            </button>
                        </div>
                        </div>
                        <div class="price tw-text-base tw-uppercase tw-text-mainBlack tw-font-osc">
                        ${formatter.format(item.price / 100)}
                        </div>
                    </div>
                </div>
            </div>
            `;

            $(".mini-cart__list").prepend(prodHTML);

        });
    }

    // Clear current products in cart
    $(".mini-cart__items").empty();

    // Set new subtotal
    $(".mini-cart__footer .sub-total .total").text(formatter.format(cartData.total_price / 100));

    // Set new header icon count
    $(".icon--cart .cart-count span ").text(cartData.item_count);
    
    bindMinicartQtySelector();
    bindMiniCartRemove();
    // Show mini cart
    showMini();
}

jQuery(document).ready(function ($) {});
jQuery(document).ready(function ($) {
  // Alert Slider
  var alertBar = new Swiper(".js-alertSlider", {
    slidesPerView: 1,
    loop: true,
    autoplay: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    }
  });

  // Hero Slider
  var heroSwiper = new Swiper(".heroSwiper", {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 5000
    },
    navigation: {
      nextEl: ".button-next",
      prevEl: ".button-prev"
    },
    pagination: {
      el: ".hero-pagination",
      clickable: true,
      renderBullet: function renderBullet(index, className) {
        return "<span class=\"dot swiper-pagination-bullet\"></span>";
      }
    },
    breakpoints: {
      300: {
        slidesPerView: 1
      },
      640: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 1
      },
      1024: {
        slidesPerView: 1
      }
    }
  });

  // PDP Slider
  var pdpSwiper = new Swiper(".pdpSwiper", {
    slidesPerView: 1,
    loop: true,
    navigation: {
      nextEl: ".button-next",
      prevEl: ".button-prev"
    },
    pagination: {
      el: ".pdp-pagination",
      type: "bullets"
    },
    breakpoints: {
      300: {
        slidesPerView: 1
      },
      640: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 1
      },
      1024: {
        slidesPerView: 1
      }
    }
  });

  // Collection Carousel Slider
  var flavorsSwiper = new Swiper(".flavorsSwiper", {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
      nextEl: ".button-next-2",
      prevEl: ".button-prev-2"
    },
    breakpoints: {
      300: {
        slidesPerView: 1
      },
      640: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 3
      },
      1024: {
        slidesPerView: 4
      }
    }
  });

  // Bundle Slider
  var bundleSlider = new Swiper(".bundleSlider", {
    slidesPerView: 4,
    spaceBetween: 80,
    loop: false,
    navigation: {
      nextEl: ".button-next-8",
      prevEl: ".button-prev-8"
    },
    breakpoints: {
      300: {
        slidesPerView: 1
      },
      640: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 3
      },
      1024: {
        slidesPerView: 4
      }
    }
  });

  // Category Slider
  // var categorySwiper = new Swiper(".categorySwiper", {
  //   slidesPerView: 4,
  //   spaceBetween: 20,
  //   navigation: {
  //     nextEl: ".button-next-2",
  //     prevEl: ".button-prev-2",
  //   },
  //   breakpoints: {
  //     300: {
  //       slidesPerView: 1,
  //     },
  //     640: {
  //       slidesPerView: 2,
  //     },
  //     768: {
  //       slidesPerView: 3,
  //     },
  //     1024: {
  //       slidesPerView: 4,
  //     },
  //   },
  // });

  $(".shopify-section[id*=category_section]").each(function (index) {
    $(this).attr("data-swiper", index);
    var categorySwiper = new Swiper('[data-swiper="' + index + '"] .categorySwiper', {
      loop: false,
      slidesPerView: 4,
      spaceBetween: 20,
      navigation: {
        nextEl: '[data-swiper="' + index + '"] .button-next-2',
        prevEl: '[data-swiper="' + index + '"] .button-prev-2'
      },
      breakpoints: {
        300: {
          slidesPerView: 1
        },
        640: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 3
        },
        1024: {
          slidesPerView: 4
        }
      }
    });
  });

  // Cart Slider
  var cartRelatedSwiper = new Swiper(".cartRelatedSwiper", {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: false,
    navigation: {
      nextEl: ".button-next-2",
      prevEl: ".button-prev-2"
    },
    breakpoints: {
      300: {
        slidesPerView: 1
      },
      640: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 3
      },
      1024: {
        slidesPerView: 4
      }
    }
  });

  // Pdp related Slider
  var pdpRelatedSwiper = new Swiper(".pdpRelatedSwiper", {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: false,
    navigation: {
      nextEl: ".button-next-2",
      prevEl: ".button-prev-2"
    },
    breakpoints: {
      300: {
        slidesPerView: 1
      },
      640: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 3
      },
      1024: {
        slidesPerView: 4
      }
    }
  });

  // Testimonials Slider
  var testimonialsSwiper = new Swiper(".testimonialsSwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    effect: "fade",
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    loop: true,
    pagination: {
      el: ".testimonials-pagination",
      clickable: true,
      renderBullet: function renderBullet(index, className) {
        return "<span class=\"dot swiper-pagination-bullet\"></span>";
      }
    },
    breakpoints: {
      300: {
        slidesPerView: 1,
        direction: "horizontal",
        effect: "fade"
      },
      640: {
        slidesPerView: 1,
        direction: "horizontal",
        effect: "fade"
      },
      768: {
        slidesPerView: 1,
        effect: "fade"
      },
      1024: {
        slidesPerView: 1,
        direction: "vertical",
        effect: "fade"
      }
    }
  });

  // Marquee Slider - Custom infinite animation (no Swiper autoplay)
  var marqueeSwiper = new Swiper(".marqueeSwiper", {
    // Set to true to keep slides centered
    centeredSlides: false,
    // Disable Swiper's autoplay - we'll handle animation manually
    autoplay: false,
    // Disable Swiper's loop mode - we'll handle it manually
    loop: false,
    // Space between slides
    spaceBetween: 50,
    // Number of slides per view
    slidesPerView: "auto",
    // Disable manual control of slider
    allowTouchMove: false,
    // Breakpoints for responsive design
    breakpoints: {
      300: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 3
      },
      768: {
        slidesPerView: 3
      },
      1024: {
        slidesPerView: 5
      }
    }
  });

  // Custom infinite marquee animation
  if (marqueeSwiper && marqueeSwiper.wrapperEl) {
    var wrapper = marqueeSwiper.wrapperEl;
    var slides = wrapper.querySelectorAll('.swiper-slide');
    var totalSlides = slides.length;
    var blocksPerSet = Math.floor(totalSlides / 3); // We have 3 sets of slides
    
    // Calculate the width of one complete set more accurately
    var calculateOneSetWidth = function() {
      // Method 1: Measure the distance from first slide to the start of second set
      if (slides[0] && slides[blocksPerSet]) {
        var firstSlideRect = slides[0].getBoundingClientRect();
        var secondSetFirstSlideRect = slides[blocksPerSet].getBoundingClientRect();
        var wrapperRect = wrapper.getBoundingClientRect();
        
        // Calculate the distance between the start of first set and start of second set
        var measuredWidth = secondSetFirstSlideRect.left - firstSlideRect.left;
        if (measuredWidth > 0) {
          return measuredWidth;
        }
      }
      
      // Method 2: Fallback to calculating individual slide widths
      var oneSetWidth = 0;
      var spaceBetween = marqueeSwiper.params.spaceBetween || 50;
      
      for (var i = 0; i < blocksPerSet; i++) {
        if (slides[i]) {
          var rect = slides[i].getBoundingClientRect();
          var slideWidth = rect.width || slides[i].offsetWidth;
          oneSetWidth += slideWidth;
          // Add spaceBetween for all but the last slide
          if (i < blocksPerSet - 1) {
            oneSetWidth += spaceBetween;
          }
        }
      }
      
      return oneSetWidth;
    };
    
    var oneSetWidth = 0;
    var currentPosition = 0;
    var animationSpeed = 0.5; // pixels per frame (adjust for speed)
    var isAnimating = false; // Start as false, will be set to true after calculation
    
    // Continuous animation function
    var animate = function() {
      if (!isAnimating || !marqueeSwiper || !wrapper || oneSetWidth === 0) return;
      
      // Move the wrapper
      currentPosition -= animationSpeed;
      
      // Reset when we've scrolled through one complete set
      // Use modulo-like behavior to maintain visual continuity (no stutter)
      // Since currentPosition is negative, we check if it's <= -oneSetWidth
      if (currentPosition <= -oneSetWidth) {
        currentPosition = currentPosition + oneSetWidth; // Add oneSetWidth to bring it back (seamless loop)
      }
      
      // Apply the transform
      wrapper.style.transform = 'translate3d(' + currentPosition + 'px, 0, 0)';
      wrapper.style.transition = 'none'; // No transition for smooth continuous movement
      
      // Continue animation
      requestAnimationFrame(animate);
    };
    
    // Initialize and start animation after ensuring everything is rendered
    var initializeAnimation = function() {
      // Force a layout recalculation
      if (wrapper) {
        wrapper.offsetHeight; // Trigger reflow
      }
      
      // Recalculate width with accurate measurements
      oneSetWidth = calculateOneSetWidth();
      
      // If we got a valid width, start animating
      if (oneSetWidth > 0) {
        isAnimating = true;
        animate();
      } else {
        // Retry if calculation failed
        setTimeout(initializeAnimation, 50);
      }
    };
    
    // Start after a delay to ensure Swiper and DOM are fully initialized
    setTimeout(initializeAnimation, 200);
    
    // Recalculate on resize
    var resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        oneSetWidth = calculateOneSetWidth();
      }, 250);
    });
  }

  // Brands Slider
  var brandsSwiper = new Swiper(".brandsSwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    navigation: {
      nextEl: ".button-next-3",
      prevEl: ".button-prev-3"
    },
    breakpoints: {
      300: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 4
      },
      1024: {
        slidesPerView: 5
      }
    }
  });

  // Candies Slider
  var candiesSwiper = new Swiper(".candiesSwiper", {
    slidesPerView: 3,
    centeredSlides: true,
    spaceBetween: 20,
    centeredSlidesBounds: true,
    navigation: {
      nextEl: ".button-next-4",
      prevEl: ".button-prev-4"
    },
    breakpoints: {
      300: {
        slidesPerView: 1.5,
        spaceBetween: 10
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 3
      },
      1024: {
        slidesPerView: 3
      }
    }
  });

  // Social Slider
  var socialSwiper = new Swiper(".socialSwiper", {
    slidesPerView: 5,
    spaceBetween: 26,
    loop: true,
    centeredSlides: true,
    centeredSlidesBounds: true,
    navigation: {
      nextEl: ".button-next-5",
      prevEl: ".button-prev-5"
    },
    breakpoints: {
      300: {
        slidesPerView: 1.5
      },
      640: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 3
      },
      1024: {
        slidesPerView: 4
      }
    }
  });

  // Split Images Slider
  var splitImagesSwiper = new Swiper(".splitImagesSwiper", {
    effect: "cards",
    grabCursor: true,
    loop: true
  });

  // Timeline Slider
  var timelineSwiper = new Swiper(".timelineSwiper", {
    slidesPerView: 4,
    spaceBetween: 26,
    loop: true,
    centeredSlides: true,
    centeredSlidesBounds: true,
    navigation: {
      nextEl: ".button-next-6",
      prevEl: ".button-prev-6"
    },
    breakpoints: {
      1: {
        slidesPerView: 1
      },
      300: {
        slidesPerView: 1,
        spaceBetween: 23
      },
      640: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 3
      },
      1024: {
        slidesPerView: 4
      }
    }
  });
});