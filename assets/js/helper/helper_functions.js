"use strict";

export default function returnDate(dateString){
    if(dateString !== null){
        const newDate = dateString.substring(0, 10);
        const [year, month, day] = newDate.split("-");
        return `${month}/${day}/${year}`;
    } else {
        return null;
    }
}

export function returnISODate(dateString){
    if(dateString !== null){
        return dateString.substring(0,10);
    } else {
        return null;
    }
}

export const notifyStatsChanged = () => {
    document.dispatchEvent(new CustomEvent('stats:changed'));
}

export const notifyLinkSelected = () => {
    document.dispatchEvent(new CustomEvent('link:clicked'));
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