"use strict";


import displaySpan from "/assets/js/components/create_span.js";
import displaySelectInput from "/assets/js/components/selectInput.js";
import displayTables from "/assets/js/components/tableDisplay.js";

export default async function mapAndRender(columns, header, alias){
    const canonAlias = buildAliasIndex(alias, columns);
    let options = [{ 'id': '-1', 'name': "-skip-", 'select': true}]
    columns.map(f => options.push({'id': f, 'name': f, 'select': false}));

    const rows = header.map((col, i) => {

        const guess = suggest(col, canonAlias);
        const tag = guess
            ? displaySpan('auto',['tag','auto'])
            : displaySpan('choose',['tag', 'none']);

        const hasGuess = options.some(rec => rec.id === guess);

        options = options.map(rec => {
            if(hasGuess){
                return rec.id === guess
                    ? { ...rec, name: guess, select: true }
                    : { ...rec, select: false };
            } else {
                return rec.id === '-1'
                    ? { ...rec, select: true }
                    : { ...rec, select: false };
            }
        });

        const select = displaySelectInput(options,`${col}_${i}`);
        return {
            "Source": col,
            "destination": select,
            "Status": tag
        };
    });

    return await displayTables("table_mapper",["Source", "Destination", "Status"],rows);

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