


// Nav Search Bar
const loadNavSearch = () => {
    // Get Search Term
    let searchTerm = window.location.href;
    let genderReplace;
    if (searchTerm.includes("?") > 0) {
        searchTerm = searchTerm.slice(searchTerm.indexOf("?") + 1).toLocaleLowerCase();
        searchTerm = searchTerm.split("%20");
    } else {
        searchTerm = null;
    }



    // {Find products who's product tags match ~ searchterm}
    if (searchTerm !== null) {
        const shopLength = $(".shop-product-grid").children().length;
        let resultsCount = 0;
        // Loop through every product to & hide non-results
        for (i = 1; i <= shopLength; i++) {
            let tagFoundCount = 0;
            const productTags = $(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-tags").toLowerCase();
            // Load Results
            for (let j = 0; j < searchTerm.length; j++) {

                // Unisex Exeption
                if (searchTerm[j] === ("mans") || searchTerm[j] === ("vrouens")) {
                    if (productTags.includes(searchTerm[j]) || productTags.includes("unisex")) {
                        tagFoundCount++;
                    }
                } else {
                    if (productTags.includes(searchTerm[j])) {
                        tagFoundCount++;
                    }
                }
            }

            if (tagFoundCount !== searchTerm.length) {
                $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-search")
            } else {
                resultsCount++
            }
        }
        // Check for no results
        if (resultsCount == 0) {
            $(`.shop-product-grid`).hide()
            $(`.shop-products-noresults`).fadeIn()
        }
    }


    // (Insert searchterm in filters
    if (searchTerm != null) {
        $(".card-search").css("display", "flex");
        $(".card-search input").val(`-  "${searchTerm.join(" ")}"`);
    } else {
        $(".card-search").hide();
    }
}



// CLear Nav Search
$(".card-search .card-body i").click(() => {
    location.replace("./winkel.html")
})

// FILTER

// CLear Filter
$(".filter-heading i").click(() => {
    location.replace("./winkel.html")
})

// Filter Price

const loadFilterPrice = () => {
    // Get min max
    const shopLength = $(".shop-product-grid").children().length;
    let minPrice = 0;
    let maxPrice = 0;
    let currentPrice = 0;
    let priceRange = [];

    for (i = 1; i <= shopLength; i++) {
        currentPrice = parseInt($(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-price"));
        priceRange.push(currentPrice);
        priceRange.sort(function (a, b) {
            return a - b
        });
    }

    minPrice = priceRange[0];
    maxPrice = priceRange[priceRange.length - 1];
    $(".price-filter-min").attr("min", minPrice);
    $(".price-filter-min").attr("max", maxPrice);
    $(".price-filter-max").attr("min", minPrice);
    $(".price-filter-max").attr("max", maxPrice);
    $(".price-filter-min").val(minPrice);
    $(".price-filter-max").val(maxPrice);

    $(".minPriceLabel").html(minPrice);
    $(".maxPriceLabel").html(maxPrice);

    $(".minPriceLabel").html(minPrice);
    $(".maxPriceLabel").html(maxPrice);

}

$(".price-filter-min, .price-filter-max").change(function () {
    console.log($(this).val());
    minPrice = $(".price-filter-min").val();
    maxPrice = $(".price-filter-max").val();
    $(".minPriceLabel").html(minPrice);
    $(".maxPriceLabel").html(maxPrice);
    adjustFilterPrice(minPrice, maxPrice);
});

const adjustFilterPrice = (minPrice, maxPrice) => {
    const shopLength = $(".shop-product-grid").children().length;
    for (i = 1; i <= shopLength; i++) {
        currentPriceToFilter = parseInt($(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-price"));
        if (currentPriceToFilter > maxPrice || currentPriceToFilter < minPrice) {
            $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-price")
        } else {
            $(`.shop-product-grid a:nth-child(${i})`).removeClass("filter-hide-price")
        }
    }
}







// Filter Colors
const loadFilterColors = () => {
    // Get shop length 
    const shopLength = $(".shop-product-grid").children().length;
    let productColors = [];
    let currentProduct;
    let currentColor;

    // Get all Colour Groups in Shop
    for (i = 1; i <= shopLength; i++) {
        currentProduct = $(`.shop-product-grid a:nth-child(${i}) template`);
        currentColor = currentProduct.attr("data-product-color").toLowerCase();
        productColors.push(currentColor);
    }

    // Insert Colour Options
    const productColorsSet = new Set(productColors);
    productColors = productColorsSet;
    productColors.forEach(color => {
        $(".card-color .color-boxes").append(
            `<span style="background-color:${color}" data-toggle="tooltip" data-placement="top" title="${color}"></span>`
        );
    })


}

const adjustFilterColors = () => {
    const shopLength = $(".shop-product-grid").children().length;
    activeColorOptions = [];
    let activeColor = "";
    let productColor = "";

    // Get Current Active Color Filter
    for (i = 1; i <= $(".color-boxes").children().length; i++) {
        if ($(`.color-boxes span:nth-child(${i})`).hasClass("active-color-filter")) {
            activeColor = $(`.color-boxes span:nth-child(${i})`).attr("style");
            activeColor = activeColor.slice(activeColor.indexOf(":") + 1);
            activeColorOptions.push(activeColor);
        }
    }

    // Match Above against product colors
    for (i = 1; i <= shopLength; i++) {
        productColor = $(`.shop-product-grid a:nth-child(${i}) template`).attr("data-product-color");
        if (activeColorOptions.length > 0 && activeColorOptions.indexOf(productColor) < 0) {
            $(`.shop-product-grid a:nth-child(${i})`).addClass("filter-hide-color")
        } else {
            $(`.shop-product-grid a:nth-child(${i})`).removeClass("filter-hide-color")
        }
    }

}

$(document).on("click", ".card-color .color-boxes span", function () {
    $(this).toggleClass("active-color-filter");
    $(`.color-boxes span`).not("active-color-filter").addClass("active-color-filter-not");
    adjustFilterColors();
});


// Filter Categories

const loadFilterCategories = () => {
    const shopLength = $(".shop-product-grid .product").length;
    let genders = ["Mans", "Vrouens", "Kinders", "Ander"];

    genders.forEach(gender => {
        if (gender !== "Unisex") {
            $(".card-category #collapseCategory > .card-body").append(
                `       <!-- ${gender} -->
                        <h6 data-toggle="collapse" href="#collapse${gender}" role="button"
                            aria-expanded="false" aria-controls="collapse${gender}"
                            class="categoryGender collapsed" id="categoryGender${gender}">
                            <span>${gender}</span>
                        </h6>
                        <div class="collapse" id="collapse${gender}">
                            <div class="card card-body card-category-inner-body">

                            </div>
                        </div>
                        `
            );
        }


        //  Get Categories for Gender
        let categories = [];
        let currentCategory = "";
        let currentGender = "";
        for (let i = 1; i <= shopLength; i++) {
            currentCategory = $(`.shop-product-grid .product:nth-child(${i}) template`).attr("data-product-category");
            currentGender = $(`.shop-product-grid .product:nth-child(${i}) template`).attr("data-product-gender");
            // Unisex Exception
            if (gender === "Mans" && currentGender === "Unisex" && !categories.includes(currentCategory) && currentCategory !== undefined) {
                categories.push(currentCategory)
            } else if (gender === "Vrouens" && currentGender === "Unisex" && !categories.includes(currentCategory) && currentCategory !== undefined) {
                categories.push(currentCategory)
            } else if (currentGender === gender && !categories.includes(currentCategory) && currentCategory !== undefined) {
                categories.push(currentCategory)
            }
        }

        if (categories.length < 1) {
            $(`.card-category #collapseCategory > .card-body #categoryGender${gender}`).remove()
        } else {
            categories.forEach(category => {
                $(`#collapse${gender} .card-category-inner-body`).append(
                    `<div class="category-filter-item" data-filter-gender="${gender}">
                        <span>
                            <i class="material-icons">check</i>
                        </span>
                        <p>${category}<p>
                    </div>
                    `
                )
            })
        }


    });
}

// Click on category filter

$(document).on("click", ".category-filter-item", function () {
    if ($(this).hasClass("active")) {
        $(this).removeClass("active")
    } else {
        $(".category-filter-item").removeClass("active")
        $(this).toggleClass("active");
    }
    adjustFilterCategories();
});

const adjustFilterCategories = () => {
    const filterCount = $(".category-filter-item").length;
    const shopLength = $(".shop-product-grid .product").length;
    $(`.shop-product-grid .product`).removeClass("filter-hide-category")

    // Get Active Filters
    let activeFilters = {
        Mans: [],
        Vrouens: [],
        Kinders: [],
        Ander: []
    };
    let activeFilterCount = 0;

    for (let i = 0; i < filterCount; i++) {
        let category;
        let gender;

        if ($(`#collapseCategory .category-filter-item`).eq(i).hasClass("active")) {
            category = $(`#collapseCategory .category-filter-item`).eq(i).find("p").html();
            gender = $(`#collapseCategory .category-filter-item`).eq(i).attr("data-filter-gender");

            activeFilters[gender].push(category);
            activeFilterCount++;
        }
    }

    console.log(activeFilters)

    // Show / Hide products

    if (activeFilterCount > 0) {

        for (let j = 1; j <= shopLength; j++) {
            let productGender = $(`.shop-product-grid .product:nth-child(${j}) template`).attr("data-product-gender");
            let productCategory = $(`.shop-product-grid .product:nth-child(${j}) template`).attr("data-product-category");

            if (productGender !== "Unisex" && activeFilters[productGender].length > 0) {
                if (!activeFilters[productGender].includes(productCategory)) {
                    $(`.shop-product-grid .product:nth-child(${j})`).addClass("filter-hide-category");
                }
            } else {
                $(`.shop-product-grid .product:nth-child(${j})`).addClass("filter-hide-category");
                if (productGender === "Unisex") {
                    if (activeFilters["Mans"].includes(productCategory) || activeFilters["Vrouens"].includes(productCategory)) {
                        $(`.shop-product-grid .product:nth-child(${j})`).removeClass("filter-hide-category");
                    }
                }
            }

        }
    }
}





// -----------------------------------

// SORT 

// {sort products according to select options}
const shopSort = (option) => {
    switch (option) {
        case "":
            location.reload()
            break;
        case "Nuut":
            const products = $(".product > span").attr("data-product-promo", "Nuut").parent()
            $(products).detach();
            $(products).prependTo(".shop-product-grid");
            break;
        case "Price-LH":

            break;
        case "Price-HL":

            break;
        default:
            break;
    }
    // if (option == "Nuut") {

    // }
}

//  (Run sorting on select change)
$(".shop-display-sort select").change(function () {
    shopSort($(this).val());
});


// ------------------

// INSERT PRODUCTS 

// Insert Products in Store:
const loadShopProducts = () => {
    // Axios GET
    showLoader();
    axios.get(`${api_url}/products`)
        .then((response) => {
            hideLoader()
            const products = response.data;

            products.forEach(product => {
                if (product.visibility) {
                    // Thumbnail Optimisation

                    let productThumbnail = product.productThumbnailUrl;
                    productThumbnail = productThumbnail.replace("upload/", "upload/w_200/f_auto/");

                    // Insert HTML
                    $(".shop-product-grid").append(
                        `<a class="col-10 offset-1 offset-sm-0 col-sm-6 col-md-6 col-lg-4 col-xl-3 product" href="./produk.html#${product.productCode}" id="${product.productCode}" >
                        <template data-product-tags="${product.name},${product.category},${product.color},${product.gender},${product.material}, ${product.tags}"
                        data-product-color="${product.colorGroup}"
                        data-product-sizes="${product.sizes}"
                        data-product-price="${product.price - product.discount}"
                        data-product-gender="${product.gender}"
                        data-product-category="${product.category}"
                        ></template>
                        <div class="product-image-container">
                        <img src="${productThumbnail}" loading="lazy">
                        </div>
                        <p class="product-name">${product.name}</p>
                        <p class="product-price">R ${product.price - product.discount}</p>
                    </a>`
                    );

                    // Insert Product Tag
                    if (product.promo !== "") {
                        $(`<span class="product-promo" data-product-promo="${product.promo}">${product.promo}</span>`).prependTo(`#${product.productCode}`)
                    }
                }
            })
            loadNavSearch();
            loadFilterColors();
            loadFilterPrice();
            loadFilterCategories();
        })
        .catch(err => {
            console.log(err);
        });

}

// Insert Products in Product Page:
const loadProductPage = () => {
    showLoader();
    // Get Product ID:
    let productCode = window.location.hash; //Get Recipe ID
    productCode = productCode.substr(1); //Remove #

    // Return to home page if no hash
    if (productCode == "") {
        window.location.pathname = "/winkel.html"
    }

    // JSON
    axios.get(`${api_url}/products/productCode/${productCode}`)
        .then((response) => {
            hideLoader();
            const product = response.data;

            if (product !== undefined && product.visibility) {
                // Klaviyo
                trackingActions.viewedProduct(product)

                // Insert HTML
                document.title = "Varkhart | " + product.name;
                $('meta[name=description]').remove();
                $('head').append(`<meta name="description" content='${product.description}'>`);
                $(".product-page-name").html(product.name);
                if (product.discount !== null) {
                    $(".product-page-price").html(`R ${product.price - product.discount}`);
                    $(".product-page-price-container p").html(`R ${product.discount} AF`)
                } else {
                    $(".product-page-price").html(`R ${product.price}`);
                }
                $(".product-page-description").html(product.description);
                $(".product-page-gender p").html(product.gender);
                $(".product-page-color p").html(product.color);
                $(`<span>${product.info}</span>`).appendTo(".product-page-info p:first-child()")
                $(".product-page-info").append(
                    `<p>${product.material}</p>`
                )

                // Other Colours
                if (product.otherColours.length > 0) {
                    product.otherColours.forEach(otherColour => {
                        $(".product-page-other-colors p").append(
                            `
                            <a target="blank" href="${otherColour.productLink}"> ${otherColour.colour} </a> <span>|</span>
                        `
                        )
                    })
                }


                // Material

                // Sizes
                const sizes = product.sizes;
                if (sizes.length == 1) {
                    $(".product-page-sizes-buttons").append(
                        // `<p> Een Groote </p>`
                        `<button class="active-size">${sizes[0]}</button>`
                    )
                } else {
                    product.sizes.forEach(size => {
                        $(".product-page-sizes-buttons").append(
                            `<span>${size}</span>`
                        )
                    })
                }


                // Size Guide

                if (product.productSizeImageUrl) {
                    $(".product-page-sizes-guide").addClass("active")
                    $(".size-guide-modal img").attr("src", product.productSizeImageUrl)
                }

                // Images 
                product.productImageUrls.forEach(image => {
                    image = image.replace("upload/", "upload/f_auto/");
                    $(".product-slick").append(
                        `
                    <div class="product-slick-image-container">
                    <img src="${image}" alt="Varkhart Product Slide - ${productCode}"/>
                    </div>
                    `
                    )
                })

                $('.product-slick').slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                })

                // Hide arrows if 1 image
                if ($(".product-slick .slick-track").children().length <= 1) {
                    $(".product-slick-container .slick-arrow").hide();
                }


            }
        })
        .catch(err => {
            if (err.response.status === 404) {
                window.location = "/winkel.html"
            } else {
                console.log(err);
            }
        });
}




// Insert Products in Home:
const loadHomeProducts = () => {

    axios.get(`${api_url}/products`)
        .then((response) => {
            const products = response.data;
            products.forEach(product => {
                if (product.home && product.visibility) {
                    // Check for Discount
                    let productPrice;
                    if (product.discount !== null) {
                        productPrice = product.price - product.discount;
                    } else {
                        productPrice = product.price
                    }

                    let productThumbnail = product.productThumbnailUrl;
                    productThumbnail = productThumbnail.replace("upload/", "upload/w_200/f_auto/");
                    // Insert HTML
                    $(".home-grid").append(
                        `
                        <a class="col-10 offset-sm-0 col-sm-6 col-md-6 col-lg-4 col-xl-3 product" href="./produk.html#${product.productCode}" id="${product.productCode}">
                            <div class="product-image-container">
                                <img src="${productThumbnail}" alt="Varkhart Bestseller Product - ${product.productCode}">
                            </div>
                            <p class="product-name">${product.name}</p>
                            <p class="product-price">R ${productPrice}</p>
                        </a>
                        `
                    );
                    // // Insert Product Promo
                    // if (product.promo !== "") {
                    //     $(`<span class="product-promo" data-product-promo="${product.promo}">${product.promo}</span>`).prependTo(`#${productID}`)
                    // }
                }
            });
        })
        .catch(err => {
            console.log(err);
        });
}


$(document).on("click", ".product-page-sizes-buttons >*", function () {
    $(".active-size").toggleClass("active-size");
    $(this).toggleClass("active-size");
});


// ------------
// LOADING

if (window.location.pathname == "/index.html" || window.location.pathname == "/") {
    loadHomeProducts();
}

if (window.location.pathname == "/produk.html") {
    loadProductPage();
}

if (window.location.pathname == "/winkel.html") {
    loadShopProducts();
}

// SLICK

// SLick Arrows
$("#slick-next").click(() => {
    $('.product-slick').slick("slickNext");
    $('.home-slick').slick("slickNext");
});
$("#slick-prev").click(() => {
    $('.product-slick').slick("slickPrev");
    $('.home-slick').slick("slickPrev");
})

// Size Guides

const openSizeGuideModal = () => {
    $(".size-guide-modal").addClass("active")
}

const closeSizeGuideModal = () => {
    $(".size-guide-modal").removeClass("active")
};


