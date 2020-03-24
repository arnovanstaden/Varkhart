// Logic

// Insert Products in Store:
if (window.location.pathname == "/winkel.html") {

    // JSON
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);

            // Get Object Keys
            const productKeys = Object.keys(response);

            // Insert HTML
            for (i = 0; i < productKeys.length; i++) {
                // Get product details
                const productID = productKeys[i];
                const product = response[productID];

                // Insert HTML
                $(".shop-product-grid").append(
                    `<a class="col-sm-6 col-md-3 product" href="./produk.html#${productID}" id="${productID}" data-product-tags="${product.name},${product.tags.toString(),product.gender}">
                    <template class=""></template>
                    <div class="product-image-container">
                    <img src="./assets/images/products/${productID}/1.png" alt="">
                    </div>
                    <p class="product-name">${product.name}</p>
                    <p class="product-price">R ${product.price}</p>
                </a>`
                );

                // Insert Product Tag
                if (product.promo !== "") {
                    $(`<span class="product-promo" data-product-promo="${product.promo}">${product.promo}</span>`).prependTo(`#${productID}.product`)
                }

            }

        }
    };

    xhttp.open("GET", "./assets/js/products.json", true);
    xhttp.send();
}



// Insert Products in Product Page:
if (window.location.pathname == "/produk.html") {

    // Get Product ID:
    let productID = window.location.hash; //Get Recipe ID
    productID = productID.substr(1); //Remove #

    // Return to home page if no hash
    if (productID == "") {
        window.location.pathname = "/winkel.html"
    }

    // JSON
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText);
            const product = response[productID]

            // Insert HTML
            document.title = product.name;
            $(".product-page-name").html(product.name);
            $(".product-page-price").html(`R ${product.price}`);
            $(".product-page-description").html(product.description);
            $(".product-page-gender p").html(product.gender);

            // Info
            const info = product.info;

            if (info.length !== 0) {
                for (i = 0; i < info.length; i++) {
                    if (i == 0) {
                        $(`<span>${info[i]}</span>`).appendTo(".product-page-info p:first-child()")

                    } else {
                        $(`<span> | ${info[i]}</span>`).appendTo(".product-page-info p:first-child()")
                    }
                }
            }

            // Material
            const material = product.material;

            if (material.length !== 0) {
                $(".product-page-info").append(
                    `<p>${product.material}</p>`
                )
            }

            // Sizes
            const sizes = product.sizes;

            if (sizes.length == 0) {
                $(".product-page-sizes-buttons").append(
                    // `<p> Een Groote </p>`
                    `<button class="active-size">Een Grootte</button>`
                )
            } else {
                for (i = 0; i < sizes.length; i++) {
                    $(".product-page-sizes-buttons").append(
                        `<button>${sizes[i]}</button>`
                    )
                }
            }



            // Colors
            const colors = product.colors;

            if (colors.length == 0) {
                $(".product-page-colours").remove();
            } else {
                for (i = 0; i < colors.length; i++) {
                    $(".product-page-colours").append(
                        `<div style="background-color:${colors[i]}"> </div>`
                    )
                }
            }

            // Images 
            for (i = 0; i < product.images; i++) {
                $(".product-slick").append(
                    `
                    <div class="product-slick-image-container">
                    <img src="./assets/images/products/${productID}/${i+1}.png" />
                    </div>
                    `
                )
            }

            $('.product-slick').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
            })

        }
    };

    xhttp.open("GET", "./assets/js/products.json", true);
    xhttp.send();
}


// Insert Products in Home:
if (window.location.pathname == "/index.html") {

    // JSON
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);

            // Get Object Keys
            const productKeys = Object.keys(response);

            // Insert HTML
            for (i = 0; i < productKeys.length; i++) {
                // Get product details
                let productID = productKeys[i];
                let product = response[productID];

                // Insert HTML
                $(".product-range").append(
                    `
                <a class="col-sm-6 col-md-3 product" href="./produk.html#${productID}" id="${productID}">
                    <div class="product-image-container">
                        <img class="img-fluid" src="./assets/images/products/${productID}/1.png" alt="">
                    </div>
                    <p class="product-name">${product.name}</p>
                    <p class="product-price">R ${product.price}</p>
                </a>`
                );

                // Insert Product Tag
                if (product.tag !== "") {
                    $(`<span class="product-tag">${product.tag}</span>`).prependTo(`#${productID}.product`)
                }

            }

        }
    };

    xhttp.open("GET", "./assets/js/products.json", true);
    xhttp.send();

}




// ---------------

// Shop Page Search,Sort & Filter

// Instant Search

const instantSearch = (term) => {

    if (term == "") {
        $(`.shop-product-grid a`).removeClass("instant-search-hide");
    } else {
        // Get shop length 
        const shopLength = $(".shop-product-grid").children().length;

        for (i = 1; i <= shopLength; i++) {
            const productName = $(`.shop-product-grid a:nth-child(${i}) .product-name`).html().toLowerCase();
            // $(`.shop-product-grid a:nth-child(${i})`).hide()
            if (!productName.includes(term.toLowerCase())) {
                $(`.shop-product-grid a:nth-child(${i})`).addClass("instant-search-hide");
            }
        }
    }
}

$("#instant-search").on("input", function () {
    instantSearch($(this).val());
});

// Nav Search Bar

const loadNavSearch = () => {
    // Get Search Term
    let searchTerm = window.location.href;
    if (searchTerm.includes("?") > 0) {
        searchTerm = searchTerm.slice(searchTerm.indexOf("?") + 1).toLocaleLowerCase();
    } else {
        searchTerm = null;
    }

    if (searchTerm != null) {
        const shopLength = $(".shop-product-grid").children().length;
        let resultsCount = 0;
        // Loop through every product to & hide non-results
        for (i = 1; i <= shopLength; i++) {
            const productTags = $(`.shop-product-grid a:nth-child(${i})`).attr("data-product-tags").toLowerCase();

            // Load Results
            if (!productTags.includes(searchTerm)) {
                $(`.shop-product-grid a:nth-child(${i})`).hide()
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



}

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

$(".shop-display-sort select").change(function () {
    shopSort($(this).val());
});

$(document).ready(function () {
    loadNavSearch();
})