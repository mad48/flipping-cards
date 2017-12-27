function setDemopageOptions(options) {

    document.querySelector('input[name=conf_auto]').checked = options["autoflip-mode"];
    document.querySelector('input[name=conf_autoflip_delay]').value = options["autoflip-delay"];

    document.querySelector('input[name=conf_card_width]').value = options["card-width"];
    document.querySelector('input[name=conf_card_height]').value = options["card-height"];

    document.querySelector('input[name=conf_spacing_horizontal]').value = options["spacing-horizontal"];
    document.querySelector('input[name=conf_spacing_vertical]').value = options["spacing-vertical"];

    document.querySelector('input[name=conf_transition_duration]').value = options["transition-duration"];
    document.querySelector('input[name=conf_shadow]').checked = options["shadow"];
    document.querySelector('input[name=conf_mouseover]').checked = options["mouseover-pause"];

    document.querySelector('input[name=conf_sequential_delay]').value = options["sequential-delay"];


    /*        document.querySelector('input[name=conf_cards_per_row]').value = options["cards-per-row"];
     document.querySelector('input[name=conf_number_of_rows]').value = options["number-of-rows"];*/

    var rotation = document.querySelectorAll('input[name=conf_rotation]');
    for (var i = 0; i < rotation.length; i++) {
        if (rotation[i].value == options["rotation-mode"])  rotation[i].checked = true;
    }


    document.querySelector('select[name=conf_starting_number]').options.selectedIndex = options["starting_number"];


    var sel = document.querySelector('select[name=conf_cards_per_row]');
    for (var i = 0; i < sel.options.length; i++) {

        if (sel.options[i].value == "cards-per-row" && options["cards-per-row"] > 0) {
            sel.selectedIndex = i;
            document.querySelector('input[name=conf_cards_per_row_or_rows]').value = options["cards-per-row"];
        }

        if (sel.options[i].value == "number-of-rows" && options["number-of-rows"] > 0) {
            sel.selectedIndex = i;
            document.querySelector('input[name=conf_cards_per_row_or_rows]').value = options["number-of-rows"];
        }
    }

    document.querySelector('select[name=conf_decks_count]').options.selectedIndex = document.querySelectorAll('.card-deck').length - 1;

}


function reconfigure(new_starting_number = false) {

    var options = {
        "autoflip-mode": document.querySelector('#conf_auto').checked,
        "autoflip-delay": document.querySelector('#conf_autoflip_delay').value,

        "card-width": document.querySelector('#conf_card_width').value,
        "card-height": document.querySelector('#conf_card_height').value,

        "spacing-horizontal": document.querySelector('#conf_spacing_horizontal').value,
        "spacing-vertical": document.querySelector('#conf_spacing_vertical').value,

        "shadow": document.querySelector('#conf_shadow').checked,

        "transition-duration": document.querySelector('#conf_transition_duration').value,
        "mouseover-pause": document.querySelector('#conf_mouseover').checked,

        "rotation-mode": document.querySelector('input[name=conf_rotation]:checked').value,
        "sequential-delay": document.querySelector('#conf_sequential_delay').value,
    };

    if (new_starting_number) {

        //console.log("new_starting_number=true " + (document.querySelector('select[name=conf_starting_number]').selectedIndex + 1));
        options["starting-number"] = parseInt(document.querySelector('select[name=conf_starting_number]').selectedIndex + 1);
        flipping.current_card_number = options["starting-number"] - 1;
    }
    else {
        console.log("flipping.current_card_number=" + flipping.current_card_number);
        options["starting-number"] = parseInt(flipping.current_card_number) + 1;

        //console.log("options['starting-number']" + options["starting-number"]);
        //console.log("flipping.content_index =" + flipping.content_index);
    }

    // only for demo page
    if (document.querySelector('#conf_card_width').value < 120) {
        options["card-width"] = 120;
    }
    if (document.querySelector('#conf_card_height').value < 145) {
        options["card-height"] = 145;
    }


    var sel = document.querySelector('select[name=conf_cards_per_row]').selectedIndex;
    var sel_param = document.querySelector('select[name=conf_cards_per_row]').options[sel].value;

    options[sel_param] = document.querySelector('#conf_cards_per_row_or_rows').value;


    var decks_count = document.querySelector('select[name=conf_decks_count]').options.selectedIndex + 1;

    document.getElementsByClassName("card-box")[0].innerHTML = "";
    var cont = "";
    for (i = 0; i < decks_count; i++) {
        cont = cont + content[i];
    }

    document.getElementsByClassName("card-box")[0].innerHTML = cont;

    flipping.init('flipping_cards', options);

    //console.log(options);
    flipping.configure(options);

}