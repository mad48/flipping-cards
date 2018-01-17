function qS(name, input) {
    if (input) return document.querySelector('input[name=conf_' + name + ']');
    else return document.querySelector('#conf_' + name);
}


function setDemopageOptions(options) {

    qS('auto').checked = options["autoFlipMode"];
    qS('autoflip_delay').value = options["autoFlipDelay"];

    qS('card_width').value = options["cardWidth"];
    qS('card_height').value = options["cardHeight"];

    qS('spacing_horizontal').value = options["spacingHorizontal"];
    qS('spacing_vertical').value = options["spacingVertical"];

    qS('transition_duration').value = options["transitionDuration"];
    qS('shadow').checked = options["displayShadow"];
    qS('mouseover').checked = options["pauseMouseOver"];

    qS('sequential_delay').value = options["sequentialDelay"];

    qS('decks_count').value = options["cardsToShow"];

    qS('cards_per_row').value = options["cardsPerRow"];

    var rotation = document.querySelectorAll('input[name=conf_rotation]');
    for (var i = 0; i < rotation.length; i++) {
        if (rotation[i].value == options["rotationMode"])  rotation[i].checked = true;
    }

    qS('starting_card_index').value = options["startFromIndex"];

}


function reconfigure(new_starting_card_index) {

    if (new_starting_card_index == null) new_starting_card_index = false;

    var options = {
        "autoFlipMode": document.querySelector('#conf_auto').checked,
        "autoFlipDelay": document.querySelector('#conf_autoflip_delay').value,

        "cardWidth": document.querySelector('#conf_card_width').value,
        "cardHeight": document.querySelector('#conf_card_height').value,

        "spacingHorizontal": document.querySelector('#conf_spacing_horizontal').value,
        "spacingVertical": document.querySelector('#conf_spacing_vertical').value,

        "displayShadow": document.querySelector('#conf_shadow').checked,

        "transitionDuration": document.querySelector('#conf_transition_duration').value,
        "pauseMouseOver": document.querySelector('#conf_mouseover').checked,

        "rotationMode": document.querySelector('input[name=conf_rotation]:checked').value,
        "sequentialDelay": document.querySelector('#conf_sequential_delay').value,

        "cardsToShow": document.querySelector('#conf_decks_count').value,
        "cardsPerRow": document.querySelector('#conf_cards_per_row').value

    };

    if (new_starting_card_index) {
        options["startFromIndex"] = parseInt(document.querySelector('#conf_starting_card_index').value);
        flipping.last_index = options["startFromIndex"] - 2;
        flipping.start_index = options["startFromIndex"] - 2;

    }
    else {
        flipping.last_index = flipping.start_index;
    }

    // only for demo page
    if (document.querySelector('#conf_card_width').value < 120) {
        options["cardWidth"] = 120;
    }
    if (document.querySelector('#conf_card_height').value < 145) {
        options["cardHeight"] = 145;
    }

    if (document.querySelector('#conf_decks_count').value < 1) {
        document.querySelector('#conf_decks_count').value = 1;
    }

    if (document.querySelector('#conf_decks_count').value > content.length) {
        document.querySelector('#conf_decks_count').value = content.length;
    }

    flipping.init('flipping_cards', options);
}