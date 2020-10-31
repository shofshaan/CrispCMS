/* 
 * Copyright 2020 Pixelcat Productions <support@pixelcatproductions.net>
 * @author 2020 Justin René Back <jback@pixelcatproductions.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Ich mache es mir einfach die Klassen der Icons mit den Flaggen dynamisch zu generieren
 */

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}

/**
 * Wichtig ^^
 */
const fs = require('fs');
/**
 * Der Relative Pfad zu den SVGs/PNGs
 * @type String
 */
const DIRPath = "/themes/crisp/img/markers/svg/";

/**
 * Der Relative Pfad zum Javascript.
 * @type String
 */
const JSPath = "/themes/crisp/js/map-markers.js";


/**
 * Der Relative Pfad zur Marker MAP.
 * @type String
 */
const JSONPath = "/ajax/map-markers.json";

/**
 * Prepend to File
 */
const Headers = `/* 
 * Copyright 2020 Pixelcat Productions <support@pixelcatproductions.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* This file has been automatically generated */
/* global L */

const CountryMapMarker = L.Icon.extend({
    options: {
        iconSize: [41, 41],
        iconAnchor: [21, 40],
        popupAnchor: [0, -38]
    }
});
`;
const Dummy = `var %country%MapIcon = new CountryMapMarker({iconUrl: '%iconurl%'});\n`;
let script = "";

let StartTime = Date.now();

let markers = {};

fs.readdir(__dirname + "/../" + DIRPath, (err, files) => {
    let count = 1;
    files.forEach(file => {

        let origFile = file;

        let searchIndex = getAllIndexes(file, "-");



        file = file.split("");
        for (var j = 0; j < searchIndex.length; j++) {
            for (var i = 0; i < file.length; i++) {
                file[searchIndex[j] + 1] = file[searchIndex[j] + 1].toUpperCase();
            }
        }
        file = file.join('');
        file = file.replace(/\-/g, '');


        let DummyReplaced = Dummy.replace("%country%", file.substring(0, file.length - 4));
        DummyReplaced = DummyReplaced.replace("%iconurl%", DIRPath + origFile);

        markers[file.substring(0, file.length - 4)] = DIRPath + origFile;


        script += DummyReplaced;
        if (count === files.length) {

            let EndTime = Date.now();

            let Output;
            Output += Headers;
            Output += `/* Start Time: ${StartTime} */\n`;
            Output += script;
            Output += `/* End Time: ${EndTime} */\n`;
            Output += `/* It Took ${EndTime - StartTime} Milliseconds to process all flags */\n`;
            Output += `/* .scripts/generate_icons.js */\n`;


            fs.writeFile(__dirname + '/../' + JSPath, Output, function (err) {
                if (err)
                    throw err;
                console.log('Saved JS File!');
            });
            fs.writeFile(__dirname + '/../' + JSONPath, JSON.stringify(markers, null, 4), function (err) {
                if (err)
                    throw err;
                console.log('Saved JSON File!');
            });
        }
        count++;
    });
});
