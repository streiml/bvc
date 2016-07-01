Date.prototype.getD = function(zone) {
	zone = typeof zone !== 'undefined' ? zone : this.getTimezoneOffset();

	return Math.floor((this.getTime()-zone*60000)/86400000);
}

Date.prototype.getStdTimezone = function() {
    var jan = new Date(2015, 0, 1);
    var jul = new Date(2015, 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.getDST = function() {
    return this.getTimezoneOffset() - this.getStdTimezone();
}

Date.prototype.toShortTime = function() {
    return ('0' + this.getHours()).slice(-2) + ':' + ('0' + this.getMinutes()).slice(-2);
}