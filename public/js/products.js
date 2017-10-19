'use strict';

// main products function that calls everything
function initProducts () {

  // figure out what content we need
  checkUrlForContent();

}

// checks URL for category, or product
function checkUrlForContent () {

  // get info from URL
  let urlArray = splitUrlIntoArray();

  // if this is a products page
  if (urlArray[0] == 'products') {

    // if there's a product category
    if (urlArray.length === 3) {

      // check for category match
      checkForCategoryMatch(urlArray);

    }

    // if there's a product name
    else if (urlArray.length === 4) {

      // check for category match
      checkForProductMatch();

    }

    // if it's the products page with no other parameters
    else {

      // get all categories
      getProductCategories();

    }

  }

}

// check url for category name and id
function checkForCategoryMatch (data) {

  const qData = {
    categoryName: data[1].toString().replace(/-/g, ' '),
    method:'getCategoryFromUrl'
  }
  callProductsService(qData, categoryResult);

}
function categoryResult (data) {

  // if a match is found
  if (data !== 0) {

    // load products from category
    getProductsFromCategory(data);

  }
  else {

    // check for product name and id
    checkForProductMatch();

  }

}

// get and load products from a category
function getProductsFromCategory (catId) {
  const qData = {
    categoryId: catId,
    method:'getProductsFromCategory'
  }
  callProductsService(qData, loadCategoryProducts);
}
function loadCategoryProducts (data) {

  // get category name from id
  getCategoryName(data[0][4]);

  // hide root product page banners
  $('.js-banners').hide();

  // go through each category in the array
  data.map( (category, index) => {

    const template = `
      <div class="product-box">
        <a href="/products/${category[5].toString().replace(/ /g, '-')}/${category[1].toString().replace(/ /g, '-')}/">
          <div class="product-img" style="background-image:url('https://static.bannerstack.com/img/products/${category[2]}');"></div>
          <div class="product-name">${category[1]}</div>
          <div class="product-short-desc">${category[3]}</div>
          <div class="product-details-btn">
            <i class="fa fa-eye" aria-hidden="true"></i>
            VIEW DETAILS
            <i class="fa fa-caret-right" aria-hidden="true"></i>
          </div>
        </a>
      </div>
    `;

    // add category HTML
    $('.js-category-list').append(template);

  });

}

// gets product category name from ID
function getCategoryName (catID) {

  const qData = {
    categoryId: catID,
    method:'getCategoryName'
  }
  callProductsService(qData, loadCategoryName);

}

// send category name to title update function
function loadCategoryName (data) {
  updatePageTitle(data);
}

// init check for product name and id
function checkForProductMatch () {

  // get info from URL
  let urlArray = splitUrlIntoArray();

  // check for product match
  lookForProductMatch(urlArray);

}

// send info to products service
function lookForProductMatch (data) {

  const qData = {
    productName: data[2].toString().replace(/-/g, ' '),
    method:'getProductFromUrl'
  }
  callProductsService(qData, productResult);

}

// see if there was a product match
function productResult (data) {

  // if a match is found
  if (data !== 0) {

    // load products from category
    getProductDetails(data);

  }
  else {

    // send product not found message
    showErrorMsg('Product Not Found');

    // load product categories
    getProductCategories();

  }

}

// load product details
function getProductDetails (prodId) {

  const qData = {
    productId: prodId,
    method:'getProductDetails'
  }
  callProductsService(qData, loadProductDetails);

}

// load product
function loadProductDetails (data) {

  // handle images
  let imgHTML = '';
  data[4].map( img => {
    imgHTML = `${imgHTML} <img src="https://static.bannerstack.com/img/products/${img}" alt="${data[1]}" class="thumb js-thumb">`;
  });

  // handle product details
  const template = `
    <div class="product-details">
      <div class="container">
        <div class="row">
          <div class="column">
            <h1>${data[1]}</h1>
          </div>
        </div>
        <div class="row">
          <div class="column">
            <div class="main-img">
              <a href="https://static.bannerstack.com/img/products/${data[4][0]}" target="_blank" class="js-main-img-btn">
                <img src="https://static.bannerstack.com/img/products/${data[4][0]}" alt="${data[1]}" class="js-main-img">
              </a>
            </div>
            <div class="thumbnails">
              ${imgHTML}
            </div>
            <div class="product-description">${data[3]}</div>
          </div>
          <div class="column">
            <form class="js-add-to-cart-form">

              <div class="js-product-detail-form-elements">
                <label for="productSize">Select Size</label>
                <select id="productSize"></select>

                <div class="js-product-options"></div>

                <label for="artworkFile">Design</label>
                <select id="artworkFile">
                  <option value="upload" data-price="0">I will upload my files</option>
                  <option value="need" data-price="100">I need a design ($100)</option>
                  <option value="create" data-price="0">I want to create a design</option>
                </select>

                <label for="productQty">Quantity</label>
                <input type="number" id="productQty" value="1">

                <a href="#" class="product-details-btn js-shipping-btn">
                  <i class="fa fa-truck" aria-hidden="true"></i>
                  SETUP PRODUCTION &amp; SHIPPING
                  <i class="fa fa-caret-right" aria-hidden="true"></i>
                </a>

                <hr>
              </div>

              <h4 align="right" class="order-total">
                <strong>SUB TOTAL:</strong> $<span class="js-order-total"></span>
              </h4>

              <div class="hide js-shipping-options">
                <div class="row">
                  <div class="column">

                    <hr>

                    <label for="turnaroundTime">Turnaround Time</label>
                    <select id="turnaroundTime" class="js-shipping-service-options">
                      <option value="same">Same Day</option>
                      <option value="next">Next Day</option>
                      <option value="pickup">I'll Pick Up the Job</option>
                    </select>

                    <label for="shippingName">Ship to Name</label>
                    <input type="text" id="shippingName" maxlength="75" required placeholder="Home, Office">

                    <label for="shippingAddress">Address</label>
                    <input type="text" id="shippingAddress" maxlength="75" required placeholder="Address">

                    <div class="row">
                      <div class="column">
                        <label for="shippingCity">City</label>
                        <input type="text" id="shippingCity" maxlength="75" required placeholder="City">
                      </div>
                      <div class="column">
                        <label for="shippingState">State</label>
                        <select id="shippingState" class="js-states-select"></select>
                      </div>
                      <div class="column">
                        <label for="shippingZip">Zip</label>
                        <input type="text" id="shippingZip" maxlength="10" required placeholder="Zip">
                      </div>
                    </div>

                    <div id="shippingSelectContainer" style="display:none;">
                      <label for="shippingService">Shipping Service</label>
                      <select id="shippingService" class="js-shipping-cart">
                        <option value="" data-price="0">Waiting for rates...</option>
                      </select>
                    </div>

                    <div class="row">
                      <div class="column">
                        <a href="#" class="product-details-btn js-open-details-btn">
                          <i class="fa fa-caret-left" aria-hidden="true"></i>
                          BACK TO DETAILS
                        </a>
                      </div>
                      <div class="column">
                        <a href="#" class="product-details-btn js-shipping-rates-btn">
                          GET SHIPPING RATES
                          <i class="fa fa-caret-right" aria-hidden="true"></i>
                        </a>
                      </div>
                    </div>

                    <div class="row">
                      <div class="column">
                        <a href="#" class="product-details-btn js-add-to-cart-btn" style="display:none">
                          <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                          ADD TO CART
                          <i class="fa fa-caret-right" aria-hidden="true"></i>
                        </a>
                      </div>
                    </div>

                    <div class="address-suggestions"></div>

                  </div>
                </div>
              </div>

              <input type="hidden" id="productId" value="${data[0]}">
              <input type="hidden" id="productPrice" value="">
              <input type="hidden" id="productName" value="${data[1]}">
              <input type="hidden" id="productThumb" value="${data[4][1]}">
              <input type="hidden" id="productWidth" value="">
              <input type="hidden" id="productHeight" value="">
              <input type="hidden" id="productWeight" value="">
              <input type="hidden" id="productLength" value="">
              <input type="hidden" id="productSpecs" value="">
              <input type="hidden" id="shippingCost" value="0">

            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  // add it to page
  $('.js-category-list').append(template);

  // listen for add to cart clicks
  listenForCartClicks();

  // populate product sizes select menu
  populateProductSizesMenu(data[0]);

  // populate product options select menu
  populateProductOptions(data[5]);

  // populate state select menu
  populateStateSelect('.js-states-select');

  // listen for shipping setup clicks
  listenForShippingStepClicks();

  // listen for shipping rates click
  listenForShippingRatesClick();

  // listen for back to details btn clicks
  listenForBackToDetailsClicks();

  // listen for artowrk select menu changes
  listenForArtworkChanges();

}

// get and load product sizes
function populateProductSizesMenu (productId) {
  const qData = {
    method:'getProductSizes',
    productId: productId
  }
  callProductsService(qData, loadProductSizes);
}
function loadProductSizes (data) {

  // go thru all sizes
  data.map( (size, index) => {

    // set initial width x height
    if (index === 0) {
      $('#productWidth').val(data[index][1]);
      $('#productHeight').val(data[index][2]);
      $('#productPrice').val(data[index][3]);
      $('.js-order-total').html(`${data[index][3]}`);
      $('#productLength').val(data[index][4]);
      $('#productWeight').val(data[index][5]);
    }

    // add options
    const template = `<option value="${data[index][0]}" data-width="${data[index][1]}" data-height="${data[index][2]}" data-price="${data[index][3]}">${data[index][1]}" x ${data[index][2]}"</option>`;

    // add to select menu
    $('#productSize').append(template);

  });

  // listen for size changes
  listenForSizeChanges();

  // listen for qty changes
  listenForQtyChanges();

}

// load product options
function populateProductOptions (options) {

  options.map( (option, index) => {

    // form element safe option name
    const optionEditedName = option[0].replace(/ /g, '_');

    // set label and select menu
    const optionSelect = `
      <label id="productOptions_${optionEditedName}_label" for="productOptions_${optionEditedName}">${option[0]}</label>
      <select id="productOptions_${optionEditedName}" name="productOptions">
        <option value=''>No ${option[0]}</option>
      </select>
    `;

    $('.js-product-options').append(`${optionSelect}`);

    // populate select options
    const optionValues = option[1].split('|');
    optionValues.map( item => {
      $(`#productOptions_${optionEditedName}`).append(`<option value='${item}'>${item}</option>`);
    });

  });

}

// listen for size changes
function listenForSizeChanges () {

  $('#productSize').change( event => {

    // set price based on size selected
    calculatePrice();

    // update width x height values
    $('#productWidth').val($('#productSize').find(':selected').attr('data-width'));
    $('#productHeight').val($('#productSize').find(':selected').attr('data-height'));

  });

}

// listen for qty changes
function listenForQtyChanges () {

  $('#productQty').change( event => {

    // set price based on size selected
    calculatePrice();

  });

}

// listen for qty changes
function listenForArtworkChanges () {

  $('#artworkFile').change( event => {

    // set price based on size selected
    calculatePrice();

  });

}

// calculate product price
function calculatePrice () {

  // calculate price
  const artworkCharge = Number($('#artworkFile').find(':selected').attr('data-price'));
  const sizeCharge = Number($('#productSize').find(':selected').attr('data-price'));
  const shippingCharge = Number($('#shippingService').find(':selected').attr('data-price'));
  const qtyNum = Number($('#productQty').val());
  const productPrice = (artworkCharge  + sizeCharge + shippingCharge) * qtyNum;

  // update price
  $('#productPrice').val(productPrice);
  $('.js-order-total').html(`${productPrice.toFixed(2)}`);

}

// listen for cart clicks
function listenForCartClicks () {

  $('.js-category-list').click( event => {
    event.preventDefault();

    // if img thumbnail clicked
    if ($(event.target).attr('class') === 'thumb js-thumb') {
      updateMainImage(event.target.src);
    }

    // if add to cart button was clicked
    else if ($(event.target).attr('class') === 'product-details-btn js-add-to-cart-btn') {
      addProductToCart();
    }

  });

}

// listen for shipping/production setup
function listenForShippingStepClicks () {

  $('.js-shipping-btn').click( event => {
    event.preventDefault();

    $('.js-product-detail-form-elements').hide();
    $('.js-shipping-options').show();
  });

}

// listen for shipping rates click
function listenForShippingRatesClick () {

  $('.js-shipping-rates-btn').click( event => {
    event.preventDefault();

    // setup ship to address
    const shipTo = {
      customerName: $('#shippingName').val(),
      address: $('#shippingAddress').val(),
      city: $('#shippingCity').val(),
      state: $('#shippingState').val(),
      zip: $('#shippingZip').val(),
      countryCode: 'US',
      pkgWeight: $('#productWeight').val()
    }

    // validate address
    validateShippingAddress(shipTo)
      .then( addressResponse => {

        // if address unknown
        if (addressResponse.AddressClassification.Code === "0") {

          // empty out HTML
          $('.address-suggestions').empty();

          // add response desc
          $('.address-suggestions').append(`<h4>The address above is not valid. Following are some suggestions to correct it:</h4>`);

          // if there is more than one suggestion
          if (Array.isArray(addressResponse.AddressKeyFormat)) {

            addressResponse.AddressKeyFormat.map( addr => {

              const addressSuggestion = `
                <p>
                  ${addr.AddressLine}<br>
                  ${addr.Region}
                </p>
              `;

              // add suggestion info
              $('.address-suggestions').append(addressSuggestion);

            });

          }

          // if just one response
          else {

            const addressSuggestion = `
              <p>
                ${addressResponse.AddressKeyFormat.AddressLine}<br>
                ${addressResponse.AddressKeyFormat.Region}
              </p>
            `;

            // add suggestion info
            $('.address-suggestions').append(addressSuggestion);

          }

        }

        // if address good, then get shipping rates
        else {

          getShippingRates(shipTo)
            .then( ratesResponse => {

              // populate shipping select menu
              populateShippingOptions(ratesResponse);

              // show add to cart btn
              $('.js-add-to-cart-btn').show();

            });

        }

      });

  });

}

// listen for back to product details btn clicks
function listenForBackToDetailsClicks () {

  $('.js-open-details-btn').click( event => {
    event.preventDefault();

    $('.js-shipping-options').hide();
    $('.js-product-detail-form-elements').show();

  });

}

// updates main img in product carousel
function updateMainImage (imgSrc) {
  $('.js-main-img').attr('src', imgSrc);
  $('.js-main-img-btn').attr('href', imgSrc);
}

// get all active product categories
function getProductCategories () {
  const qData = {
    method:'getProductCategories'
  }
  callProductsService(qData, loadProductCategories);
}
// handle all categories
function loadProductCategories (data) {

  // set page title
  updatePageTitle('ALL PRODUCTS');

  // show root product page banners
  $('.js-banners').show();

  // go through each category in the array
  data.map( (category, index) => {

    const template = `
      <div class="product-box">
        <a href="/products/${category[1].toString().replace(/ /g, '-')}/">
          <div class="product-img" style="background-image:url('https://static.bannerstack.com/img/categories/${category[2]}');"></div>
          <div class="product-name">${category[1]}</div>
          <div class="product-short-desc">${category[3]}</div>
          <div class="product-details-btn">
            <i class="fa fa-eye" aria-hidden="true"></i>
            VIEW PRODUCTS
            <i class="fa fa-caret-right" aria-hidden="true"></i>
          </div>
        </a>
      </div>
    `;

    // add category HTML
    $('.js-category-list').append(template);

  });

}

// updates page main title
function updatePageTitle (title) {
  $('.js-page-title').html(title);
}

// makes all calls to products service
function callProductsService (data, callback) {

  const settings = {
    url: 'https://services.bannerstack.com/products.cfc',
    data: data,
    dataType: 'json',
    type: 'GET',
    success: callback,
    fail: showAjaxError
  }

  $.ajax(settings);

}

$(initProducts)
