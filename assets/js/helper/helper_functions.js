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

