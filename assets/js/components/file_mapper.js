"use strict";

import {buildAliasIndex, suggest} from "/assets/js/helper/helper_functions.js";

export default function mapAndRender(columns, header, alias){
    const canonAlias = buildAliasIndex(alias, columns);
    const options = [`<option value="">- skip - </option>`]
        .concat(columns.map(f => `<option value="${f}">${f}</option>`))
        .join("");

    const rows = header.map((col, i) => {
        const guess = suggest(col, canonAlias);
        const tag = guess
            ? '<span class="tag auto"> auto</span>'
            : '<span class="tag none"> choose</span>';
        return `<tr>
                <td class="source">${col}</td>
                <td>
                <select class="gs-select" data-source="${col}">
                ${options.replace(`value="${guess}"`, `value="${guess}" selected`)}
                </select>
                </td>
                <td>${tag}</td>
                </tr>`;
    }).join("");

    return rows;
}