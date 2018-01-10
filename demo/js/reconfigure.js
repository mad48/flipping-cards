function setDemopageOptions(options) {

    document.querySelector('input[name=conf_auto]').checked = options["autoFlipMode"];
    document.querySelector('input[name=conf_autoflip_delay]').value = options["autoFlipDelay"];

    document.querySelector('input[name=conf_card_width]').value = options["cardWidth"];
    document.querySelector('input[name=conf_card_height]').value = options["cardHeight"];

    document.querySelector('input[name=conf_spacing_horizontal]').value = options["spacingHorizontal"];
    document.querySelector('input[name=conf_spacing_vertical]').value = options["spacingVertical"];

    document.querySelector('input[name=conf_transition_duration]').value = options["transitionDuration"];
    document.querySelector('input[name=conf_shadow]').checked = options["displayShadow"];
    document.querySelector('input[name=conf_mouseover]').checked = options["pauseMouseOver"];

    document.querySelector('input[name=conf_sequential_delay]').value = options["sequentialDelay"];

    document.querySelector('input[name=conf_decks_count]').value = options["cardsToShow"];

    document.querySelector('input[name=conf_cards_per_row]').value = options["cardsPerRow"];

    var rotation = document.querySelectorAll('input[name=conf_rotation]');
    for (var i = 0; i < rotation.length; i++) {
        if (rotation[i].value == options["rotationMode"])  rotation[i].checked = true;
    }

    //document.querySelector('select[name=conf_starting_card_index]').options.selectedIndex = options["starting_card_index"];

    document.querySelector('input[name=conf_starting_card_index]').value = options["startFromIndex"];

    /*
     var sel = document.querySelector('select[name=conf_cards_per_row]');
     for (var i = 0; i < sel.options.length; i++) {

     if (sel.options[i].value == "cardsPerRow" && options["cardsPerRow"] > 0) {
     sel.selectedIndex = i;
     document.querySelector('input[name=conf_cards_per_row_or_rows]').value = options["cardsPerRow"];
     }

     if (sel.options[i].value == "number-of-rows" && options["number-of-rows"] > 0) {
     sel.selectedIndex = i;
     document.querySelector('input[name=conf_cards_per_row_or_rows]').value = options["number-of-rows"];
     }
     }
     */

    //document.querySelector('select[name=conf_decks_count]').options.selectedIndex = document.querySelectorAll('.card-deck').length - 1;
    //
    // document.querySelector('input[name=conf_decks_count]').value = document.querySelectorAll('.card-stack').length;
}


function reconfigure(new_starting_card_index = false) {

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
        "cardsPerRow": document.querySelector('#conf_cards_per_row').value,

    };

    if (new_starting_card_index) {
        //console.log("new_starting_card_index=true " + (document.querySelector('select[name=conf_starting_card_index]').selectedIndex + 1));
        //options["startFromIndex"] = parseInt(document.querySelector('select[name=conf_starting_card_index]').selectedIndex + 1);
        options["startFromIndex"] = parseInt(document.querySelector('#conf_starting_card_index').value);
        flipping.current_card_number = (options["startFromIndex"] - 1);
       // console.log("flipping.current_card_number=" + flipping.current_card_number);
    }
    else {
    //  console.log("flipping.current_card_number=" + flipping.current_card_number);

        ///last change

     options["startFromIndex"] = (parseInt(flipping.current_card_number)+1);


        //options["startFromIndex"] = parseInt(document.querySelector('#conf_starting_card_index').value);

        // options["startFromIndex"] = parseInt(flipping.current_card_number) + 1;

        //console.log("options['startFromIndex']" + options["startFromIndex"]);
        //console.log("flipping.content_index =" + flipping.content_index);
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
    /*
     var sel = document.querySelector('select[name=conf_cards_per_row]').selectedIndex;
     var sel_param = document.querySelector('select[name=conf_cards_per_row]').options[sel].value;

     options[sel_param] = document.querySelector('#conf_cards_per_row_or_rows').value;
     */


    //var decks_count = document.querySelector('select[name=conf_decks_count]').options.selectedIndex + 1;
    /*    var decks_count = document.querySelector('#conf_decks_count').value;

     document.getElementsByClassName("card-box")[0].innerHTML = "";
     var cont = "";
     for (i = 0; i < decks_count; i++) {
     cont = cont + content[i];
     }

     document.getElementsByClassName("card-box")[0].innerHTML = cont;*/

    document.getElementsByClassName("card-box")[0].innerHTML = content.join('');

    flipping.init('flipping_cards', options);

    //console.log(options);
    flipping.configure(options);

}