function qS(name, input) {
    if (input) return document.querySelector('input[name=conf_' + name + ']');
    else return document.querySelector('#conf_' + name);
}


function setDemopageConfiguration(configuration) {

    qS('auto').checked = configuration["autoFlipMode"];
    qS('autoflip_delay').value = configuration["autoFlipDelay"];

    qS('card_width').value = configuration["cardWidth"];
    qS('card_height').value = configuration["cardHeight"];

    qS('spacing_horizontal').value = configuration["spacingHorizontal"];
    qS('spacing_vertical').value = configuration["spacingVertical"];

    qS('transition_duration').value = configuration["transitionDuration"];

    qS('cards_shadow').checked = configuration["cardsShadow"];
    qS('buttons_shadow').checked = configuration["buttonsShadow"];

    qS('mouseover').checked = configuration["pauseMouseOver"];

    qS('sequential_delay').value = configuration["sequentialDelay"];

    qS('decks_count').value = configuration["cardsToShow"];

    qS('cards_per_row').value = configuration["cardsPerRow"];

    var rotation = document.querySelectorAll('input[name=conf_rotation]');
    for (var i = 0; i < rotation.length; i++) {
        if (rotation[i].value == configuration["rotationMode"])  rotation[i].checked = true;
    }

    qS('starting_card_index').value = configuration["startFromIndex"];

}


function reconfigure(new_starting_card_index) {

    if (new_starting_card_index == null) new_starting_card_index = false;

    var configuration = {
        "autoFlipMode": document.querySelector('#conf_auto').checked,
        "autoFlipDelay": document.querySelector('#conf_autoflip_delay').value,

        "cardWidth": document.querySelector('#conf_card_width').value,
        "cardHeight": document.querySelector('#conf_card_height').value,

        "spacingHorizontal": document.querySelector('#conf_spacing_horizontal').value,
        "spacingVertical": document.querySelector('#conf_spacing_vertical').value,

        "cardsShadow": document.querySelector('#conf_cards_shadow').checked,
        "buttonsShadow": document.querySelector('#conf_buttons_shadow').checked,

        "transitionDuration": document.querySelector('#conf_transition_duration').value,
        "pauseMouseOver": document.querySelector('#conf_mouseover').checked,

        "rotationMode": document.querySelector('input[name=conf_rotation]:checked').value,
        "sequentialDelay": document.querySelector('#conf_sequential_delay').value,

        "cardsToShow": document.querySelector('#conf_decks_count').value,
        "cardsPerRow": document.querySelector('#conf_cards_per_row').value

    };

    if (new_starting_card_index) {
        configuration["startFromIndex"] = parseInt(document.querySelector('#conf_starting_card_index').value);
        flipping.lastIndex = configuration["startFromIndex"] - 2;
        flipping.startIndex = configuration["startFromIndex"] - 2;

    }
    else {
        flipping.lastIndex = flipping.startIndex;
    }

    // only for demo page
    if (document.querySelector('#conf_card_width').value < 120) {
        configuration["cardWidth"] = 120;
    }
    if (document.querySelector('#conf_card_height').value < 145) {
        configuration["cardHeight"] = 145;
    }

    if (document.querySelector('#conf_decks_count').value < 0) {
        document.querySelector('#conf_decks_count').value = 0;
    }

    if (document.querySelector('#conf_decks_count').value > flipping.content.length) {
        document.querySelector('#conf_decks_count').value = flipping.content.length;
    }

    flipping.init('flipping_cards', configuration);
}