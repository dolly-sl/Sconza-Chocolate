(function($) {

    function getPredictiveSearchResults(query) {
        return $.ajax({
            url: `/search/suggest.json`,
            method: 'GET',
            dataType: 'json',
            data: {
            q: query,
            'resources[type]': 'product,page,collection,article',
            'resources[limit]': 40
            }
        }).then(function(response) {
            return {
            products: response.resources.results.products.map(item => ({
                title: item.title,
                url: item.url,
                image: item.image,
                vendor: item.vendor,
                price: item.price,
                min_price: item.price_min,
                max_price: item.price_max,
                min_compare_at_price: item.compare_at_price_min,
                max_compare_at_price: item.compare_at_price_max
            })),
            collections: response.resources.results.collections.map(item => ({
                title: item.title,
                url: item.url,
                image: item.image
            })),
            pages: response.resources.results.pages.map(item => ({
                title: item.title,
                url: item.url
            })),
            articles: response.resources.results.articles.map(item => ({
                title: item.title,
                url: item.url,
                image: item.image,
                published_at: item.published_at
            }))
            };
        }).catch(function(err) {
            console.error('Predictive search error:', err);
            return {
            products: [],
            collections: [],
            pages: [],
            articles: []
            };
        });
    }

    function setEmptySearch(){
        $('.predSearch__sideResultsContainer').hide();
        $('.predSearch__popularContainer').show();
        $('.predSearch__resultsContainer').hide();
        $('.predSearch__trendingContainer').show();
    }

    function setInitialSearch(searchHTML){
        $('.predSearch__resultsContainer').html(searchHTML);
        $('.predSearch__sideResults--collections .predSearch__sideResultList').html('');
        $('.predSearch__sideResults--pages .predSearch__sideResultList').html('');
        $('.predSearch__sideResults--articles .predSearch__sideResultList').html('');

        $('.predSearch__sideResultsContainer').show();
        $('.predSearch__popularContainer').hide();
        $('.predSearch__resultsContainer').show();
        $('.predSearch__trendingContainer').hide();
    }

    function fillNonProductList(array, element){
        for (i=0;i<array.length;i++){
            if (i < 3){
                var thisHTML = `
                    <a class="predSearch__popularLink" href="${array[i].url}">
                    ${array[i].title}
                    </a>
                `;
                element.append(thisHTML);
            }
        }
    }

    function fillResults(results){
        $('.predSearch__sideResults--collections').hide();
        $('.predSearch__sideResults--pages').hide();
        $('.predSearch__sideResults--articles').hide();

        $('.predSearch__sideResults--collections .predSearch__sideResultList').html('');
        $('.predSearch__sideResults--pages .predSearch__sideResultList').html('');
        $('.predSearch__sideResults--articles .predSearch__sideResultList').html('');

        if (results.collections.length > 0){
            $('.predSearch__sideResults--collections').show();
            fillNonProductList(results.collections, $('.predSearch__sideResults--collections .predSearch__sideResultList'));
        }
        if (results.pages.length > 0){
            $('.predSearch__sideResults--pages').show();
            fillNonProductList(results.pages, $('.predSearch__sideResults--pages .predSearch__sideResultList'));
        }
        if (results.articles.length > 0){
            $('.predSearch__sideResults--articles').show();
            fillNonProductList(results.articles, $('.predSearch__sideResults--articles .predSearch__sideResultList'));
        }
        if (results.products.length > 0){
            $('.predSearchCard--result').each(function(){
                var cardIndex = $(this).attr('data-index') * 1;
                var resultData = results.products[cardIndex];
                if (typeof resultData === 'undefined'){
                    $(this).find('a').hide();
                }
                else{
                    $(this).find('.predSearchCard__link').attr('aria-label', 'go to '+resultData.title+' product page');
                    $(this).find('.predSearchCard__link').attr('href', resultData.url);
                    $(this).find('.predSearchCard__image').removeClass('predSearchCard__image--searching');
                    $(this).find('.predSearchCard__image').attr('src', resultData.image);
                    $(this).find('.predSearchCard__image').attr('alt', resultData.title);
                    $(this).find('.predSearchCard__title').text(resultData.title);
                    if ((resultData.min_price * 1.0) < (resultData.min_compare_at_price * 1.0)){
                        $(this).find('.predSearchCard__saleTag').show();
                        $(this).find('.predSearchCard__standardPrice').hide();
                        $(this).find('.predSearchCard__salePrice').show();
                        $(this).find('.predSearchCard__crossPrice').show();
                        $(this).find('.predSearchCard__salePrice').text('$'+resultData.min_price);
                        $(this).find('.predSearchCard__crossPrice').text('($'+resultData.min_compare_at_price+'-$'+resultData.max_compare_at_price+')');
                    }
                    else{
                        $(this).find('.predSearchCard__standardPrice').text('$'+resultData.min_price+'-$'+resultData.max_price);
                    }
                }
            });
        }
        else{
            $('.predSearch__resultFlex').hide();
            $('.predSearch__noneFound').show();
            $('.predSearch__noneFoundSearchTerm').text($('.desktop-search__wrap form input[name="q"]').val().trim());
        }
    }

    function calculateFreeShippingProgress(cartData){
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
    }

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

    $(document).ready(function() {

        var $searchInput = $('.desktop-search__wrap form input[name="q"]');
        var defaultSearchHTML = $('.predSearch__resultsContainer').html();
        var searching = false;
        
        var freeShipInitialized = false;

        var cartReadyInterval = setInterval(function(){
            if (typeof CartJS === "undefined"){
                freeShipInitialized = false;
            }
            else{
                clearInterval(cartReadyInterval);
                freeShipInitialized = true;
                calculateFreeShippingProgress(CartJS.cart)
            }
        });

        $('.miniUpsellCard').each(function(){
            var thisThing = $(this);
            var variantId = $(this).attr('data-prod-id');
            if ($('.mini-cart').find('.product[data-varid="'+variantId+'"]').length > 0){
                thisThing.remove();
            }
        });

        const miniCartSlider = new Swiper('.mini-cart__upsellList', {
            loop:false,
            pagination: {
                el: '.mini-cart__upsellSliderNav',
                clickable: true
            }
        });

        $('.miniUpsellCard__buyButton').on('click', function(){
            var prodId = $(this).closest('.miniUpsellCard').attr('data-prod-id') * 1;
            var slideIndex = $(this).closest('.miniUpsellCard').attr('data-slide-index') * 1;
            CartJS.addItem(prodId, 1, {}, {
            success: function success(data, textStatus, jqXHR) {
                jQuery.getJSON("/cart.js", function (cart) {
                refreshMiniCart(cart);
                });
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
            });
            miniCartSlider.removeSlide(slideIndex);
        });

        $searchInput.on('input', function() {
            var query = $(this).val().trim();

            if (searching == false){
                if (query.length > 0){
                    searching = true;
                    setInitialSearch(defaultSearchHTML);
                    var searchRateLimit = setInterval(function(){
                        var currentQuery = $('.desktop-search__wrap form input[name="q"]').val().trim();
                        console.log(currentQuery+' vs '+query);
                        if (currentQuery == query){
                            setInitialSearch(defaultSearchHTML);
                            console.log('searching for:', query);
                            getPredictiveSearchResults(query).then(function(results) {
                            fillResults(results);
                            searching = false;
                            
                            clearInterval(searchRateLimit);
                            });
                        }
                        else{
                            query = currentQuery;
                        }
                    }, 300);
                }
                else{
                    setEmptySearch()
                }
            }
        });

    });
})(jQuery);