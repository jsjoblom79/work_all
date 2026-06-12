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