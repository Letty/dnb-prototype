const enable_trackPiwik = true;
declare var _paq:any; // Because _pag is declared outside of TypeScript

function checkPiwikStatus(): boolean {
	return enable_trackPiwik && typeof _paq !== undefined;
}

export function trackPiwik(event, name, _value = undefined) {
  if (checkPiwikStatus()) {
    const value = _value instanceof Array ? _value.join('-') : _value;
    // console.log('TrackPiwik', event, name, value)
    _paq.push(['trackEvent', event, name, value]);
  }
}

export function getPiwikID(call) {
  if (checkPiwikStatus()) {
    let visitor_id;
    _paq.push([ function() {
			visitor_id = this.getVisitorId();
			call(visitor_id)
		}]);
  }
}
