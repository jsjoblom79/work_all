"use strict";

import {buildAliasIndex, suggest} from "/assets/js/helper/helper_functions.js";
import displaySpan from "/assets/js/components/create_span.js";
import displaySelectInput from "assets/js/components/selectInput.js";

export default function mapAndRender(columns, header, alias){
    const canonAlias = buildAliasIndex(alias, columns);
    const options = [`<option value="">- skip - </option>`]
        .concat(columns.map(f => `<option value="${f}">${f}</option>`))
        .join("");

    const rows = header.map((col, i) => {
        const guess = suggest(col, canonAlias);
        const tag = guess
            ? displaySpan('auto',['tag','auto'])
            : displaySpan('choose',['tag', 'none']);
        options.replace(`value="${guess}"`, `value="${guess}" selected`);
        const select = displaySelectInput(options,`${col}_${i}`)
        return `<tr>
                <td class="source">${col}</td>
                <td>

                </td>
                <td>${tag}</td>
                </tr>`;
    }).join("");

    return rows;
}

function normalize(s) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function buildAliasIndex(synonyms, canonical){
    let aliasToCanonical = {};
    for (const field of canonical){
        aliasToCanonical[normalize(field)] = field;
    }
    for (const [field, aliases] of Object.entries(synonyms || {})) {
        for (const a of aliases) aliasToCanonical[normalize(a)] = field;
    }

    return aliasToCanonical;
}

export function suggest(column, aliasToCanon){
    return aliasToCanon[normalize(column)] || "" ;
}