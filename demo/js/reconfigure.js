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
    document.querySelector('input[name=conf_cards_per_row]').value = options["cards-per-row"];

    var rotation = document.querySelectorAll('input[name=conf_rotation]');
    for (var i = 0; i < rotation.length; i++) {
        if (rotation[i].value == options["rotation-mode"])  rotation[i].checked = true;
    }

    //document.querySelector('select[name=conf_starter_set]').options.selectedIndex = options["starter_set"];

    document.querySelector('input[name=conf_starter_set]').value = options["starter-set"];

    /*
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
     */

    //document.querySelector('select[name=conf_decks_count]').options.selectedIndex = document.querySelectorAll('.card-deck').length - 1;
    document.querySelector('input[name=conf_decks_count]').value = document.querySelectorAll('.card-stack').length;
}


function reconfigure(new_starter_set = false) {

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

        "cards-per-row": document.querySelector('#conf_cards_per_row').value,

    };

    if (new_starter_set) {
        //console.log("new_starter_set=true " + (document.querySelector('select[name=conf_starter_set]').selectedIndex + 1));
        //options["starter-set"] = parseInt(document.querySelector('select[name=conf_starter_set]').selectedIndex + 1);
        options["starter-set"] = parseInt(document.querySelector('#conf_starter_set').value);
        flipping.current_card_number = options["starter-set"] - 1;
    }
    else {
        //console.log("flipping.current_card_number=" + flipping.current_card_number);
        options["starter-set"] = parseInt(flipping.current_card_number) + 1;
        //console.log("options['starter-set']" + options["starter-set"]);
        //console.log("flipping.content_index =" + flipping.content_index);
    }

    // only for demo page
    if (document.querySelector('#conf_card_width').value < 120) {
        options["card-width"] = 120;
    }
    if (document.querySelector('#conf_card_height').value < 145) {
        options["card-height"] = 145;
    }

    if (document.querySelector('#conf_decks_count').value <1) {
        document.querySelector('#conf_decks_count').value = 1;
    }

    if (document.querySelector('#conf_decks_count').value > content.length) {
        document.querySelector('#conf_decks_count').value = content.length;
    }
    /*
     var sel = document.querySelector('select[name=conf_cards_per_row]').selectedIndex;
     var sel_param = document.querySelector('select[name=conf_cards_per_row]').options[sel].value;

     options[sel_param] = document.querySelector('#conf_cards_per_row_or_rows').value;
     */


    //var decks_count = document.querySelector('select[name=conf_decks_count]').options.selectedIndex + 1;
    var decks_count = document.querySelector('#conf_decks_count').value;

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