import {formatLocale} from 'd3';

const localeFormatter = formatLocale({
  'decimal': ',',
  'thousands': '.',
  'grouping': [3],
  'currency': ['€', '']
});

const numberFormat = localeFormatter.format(',');

export function formatNum(val) {
  return numberFormat(val);
}

export function formatTitleResult(topic, subject, value) {
  return topic + ' „' + subject.join(' ') + '“ hat ' + formatNum(value) + ' Ergebniss' + (value > 1 ? 'e' : '');
}
