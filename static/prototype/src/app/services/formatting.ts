import {formatLocale} from 'd3';

const localeFormatter = formatLocale({
  "decimal": ",",
  "thousands": ".",
  "grouping": [3],
  "currency": ["€", ""]
});

const numberFormat = localeFormatter.format(',');

export function formatNum(val) {
  return numberFormat(val);
}
