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

export function formatTotalResult(value) {
  return 'Insgesamt wurde' + (value > 1 ? 'e' : '') + ' ' + formatNum(value) + ' Werk' + (value > 1 ? 'e' : '') + ' gefunden.';
}

export function formatTagAction(subject, action) {
  switch (action) {
  case 'remove':
    return '„' + subject + '“ als Filter entfernen.';
  case 'select':
    return '„' + subject + '“ als Filter hinzufügen.';
  default:
    return '„' + subject + '“ anzeigen.';
  }
}
