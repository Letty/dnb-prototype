const enable_trackPiwik = true;
declare var _paq:any; // Because _pag is declared outside of TypeScript

export function trackPiwik(event, name, _value = undefined) {
  if (enable_trackPiwik && typeof _paq !== undefined) {
    const value = _value instanceof Array ? _value.join('-') : _value;
    // console.log('TrackPiwik', event, name, value)
    _paq.push(['trackEvent', event, name, value]);
  }
}
