// get cart contents from express session
function validateShippingAddress (addressObj) {

  const settings = {
    url: '/validateAddress',
    type: 'GET',
    data: addressObj,
    fail: showAjaxError
  };

  return $.ajax(settings);
}

// load address verification suggestions
function loadAddressAlternatives (upsSuggestions) {

  // empty out HTML
  $('.address-suggestions').empty();

  // add response desc
  $('.address-suggestions').append(`<h4>The address above is not valid. Following are some suggestions to correct it:</h4>`);

  // if there is more than one suggestion
  if (Array.isArray(upsSuggestions.AddressKeyFormat)) {

    upsSuggestions.AddressKeyFormat.map( (addr, index) => {

      const addressSuggestion = `
        <p class="js-addr-suggestion" id="addrSuggestion_${index}">
          <span class="addr">${addr.AddressLine}</span><br>
          <span class="city">${addr.PoliticalDivision2}</span>,
          <span class="state">${addr.PoliticalDivision1}</span>
          <span class="zip">${addr.PostcodePrimaryLow}</span>
        </p>
      `;

      // add suggestion info
      $('.address-suggestions').append(addressSuggestion);

    });

  }

  // if just one response
  else {

    const addressSuggestion = `
      <p class="js-addr-suggestion" id="addrSuggestion_0">
        <span class="addr">${upsSuggestions.AddressKeyFormat.AddressLine}</span><br>
        <span class="city">${upsSuggestions.AddressKeyFormat.PoliticalDivision2}</span>,
        <span class="state">${upsSuggestions.AddressKeyFormat.PoliticalDivision1}</span>
        <span class="zip">${upsSuggestions.AddressKeyFormat.PostcodePrimaryLow}</span>
      </p>
    `;

    // add suggestion info
    $('.address-suggestions').append(addressSuggestion);

  }

  listenForAddressSuggestionClicks();

}
function listenForAddressSuggestionClicks () {

  $('.js-addr-suggestion').click( event => {
    event.preventDefault();

    // overwrite address fields
    $('#shippingAddress').val($(`#${event.currentTarget.id} .addr`).html());
    $('#shippingCity').val($(`#${event.currentTarget.id} .city`).html());
    $('#shippingState').val($(`#${event.currentTarget.id} .state`).html());
    $('#shippingZip').val($(`#${event.currentTarget.id} .zip`).html());

  });

}

// get shipping rates
function getShippingRates (shipTo) {

  const settings = {
    url: '/getShippingRates',
    data: shipTo,
    type: 'GET',
    fail: showAjaxError
  }

  return $.ajax(settings);

}

// update shipping options for cart item
function populateCartItemShippingOptions (rates, itemIndex) {

  $(`#${itemIndex}-shipping-service`).empty();

  // add pickup option
  $(`#${itemIndex}-shipping-service`).append(`
    <option value="pickup" data-price="0" data-method="Pickup" data-cart-index="${itemIndex}">
      I'll Pick Up My Order (Free)
    </option>
  `);

  // init shipping info
  updateShippingCost(itemIndex, 'Pickup', 0);

  // loop thru rates
  rates.RatedShipment.map( rate => {

    // get service name, "UPS Ground"
    const serviceName = getShippingServiceName(rate.Service.Code);

    // setup select options tag
    const template = `
      <option value="${rate.Service.Code}" data-price="${rate.TotalCharges.MonetaryValue}" data-method="${serviceName}" data-cart-index="${itemIndex}">
        ${serviceName} ($${rate.TotalCharges.MonetaryValue})
      </option>
    `;

    // add it to shipping select menu
    $(`#${itemIndex}-shipping-service`).append(template);

  });

}

// listen for shipping changes
function listenForShippingServiceChanges () {

  $('.js-shipping-cart').change( event => {
    event.preventDefault();

    // init shipping cost
    let shippingCost = 0;

    // go through each shipping item
    $('.js-shipping-cart').each( function(index) {

      // get cost
      const currentCost = Number($(`#${index}-shipping-service`).find(':selected').attr('data-price'));
      const shippingMethod = $(`#${index}-shipping-service`).find(':selected').attr('data-method');

      // calc shipping cost
      shippingCost = shippingCost + currentCost;

      // update cart item with shipping cost changes
      updateShippingCost(index, shippingMethod, currentCost);

    });

    // add to order total
    const orderTotal = Number($('#products-total').val()) + Number(shippingCost);
    setOrderTotal(orderTotal);

  });

}

// update the cart item's shipping cost in session
function updateShippingCost(cartIndex, shippingMethod, shippingCost) {

  const data = {
    cartIndex: cartIndex,
    shippingMethod, shippingMethod,
    shippingCost: shippingCost
  }
  const settings = {
    url: '/updateCart',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(data)
  }

  return $.ajax(settings);

}

// get service name
function getShippingServiceName (code) {

  const services = {
    "01": "UPS Next Day Air",
		"02": "UPS 2nd Day Air",
		"03": "UPS Ground",
		"07": "UPS Worldwide Express",
		"08": "UPS Worldwide Express Expedited",
		"11": "UPS Standard",
		"12": "UPS 3 Day Select",
		"13": "UPS Next Day Air Saver",
		"14": "UPS Next Day Air Early A.M.",
		"54": "UPS Worldwide Express Plus",
		"59": "UPS 2nd Day Air A.M.",
		"65": "UPS Saver"
  }

  let serviceName = '';

  $.each(services, function(key, value) {
    if (key.toString() === code.toString()) {
      serviceName = value.toString();
    }
  });

  return serviceName;

}
