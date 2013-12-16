/*global gapi */

var Croom = (function() {
  var CLIENT_ID = '352455586725-d6t9jg1soigo36ggqgs7qgn6avjl9ek7.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyDVUkeBHaf9IOX91V5cEtNORcGhPoZsfPE';
  var OAUTH_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
  var APPS_DOMAIN = 'verticalbrands.com';

  var CALENDARS = {
    'Bag the Moon' : 'verticalbrands.com_2d32383736393530322d393632@resource.calendar.google.com',
    'Blue Hole'    : 'verticalbrands.com_2d34333532313038332d373431@resource.calendar.google.com',
    'Laylin'       : 'verticalbrands.com_32383433393832383630@resource.calendar.google.com',
    'McGettigan'   : 'verticalbrands.com_3837383837353933353131@resource.calendar.google.com',
    'Treehouse'    : 'verticalbrands.com_3335333533383139343430@resource.calendar.google.com',
    'West Bay'     : 'verticalbrands.com_2d38373232393033372d343831@resource.calendar.google.com',
    'Winery'       : 'verticalbrands.com_393735353630332d3939@resource.calendar.google.com'
  };

  var init = function() {
    gapi.client.setApiKey(API_KEY);
    loadGoogleClients(function() {
      auth(true, logIn);
    });
  };

  // Requires room slug matching div id
  var setOccupied = function(roomName) {
    var room = document.getElementById(roomName);
    room.className = 'occupied';
  };


  // Private

  var auth = function(immediate, callback) {
    gapi.auth.authorize({
      'client_id' : CLIENT_ID,
      'scope'     : OAUTH_SCOPE,
      'hd'        : APPS_DOMAIN,
      'immediate' : immediate
    }, function(authResult) {
      if (authResult && !authResult.error) {
        localStorage.access_token = gapi.auth.getToken().access_token;
      }
      return (typeof(callback) === 'function') && callback(authResult);
    });
  };

  var availabilityQuery = function(id) {
    var now  = new Date();
    var soon = new Date(now.getTime() + 1000);

    return {
      calendarId: id,
      timeMin: now,
      timeMax: soon
    };
  };

  var getAvailability = function() {
    if (!localStorage.access_token) return;

    $.each(CALENDARS, function(name, id) {
      gapi.client.calendar.events
        .list(availabilityQuery(id))
        .execute(displayAvailability);
    });
  };

  var displayAuth = function(evt) {
    auth(false, logIn);
  };

  var initAuthButton = function() {
    var authBtn = $('#authorize');
    if (localStorage.access_token) {
      authBtn.hide();
    } else {
      authBtn.show();
      authBtn.click(displayAuth);
    }
  };

  var loadGoogleClients = function(callback) {
    gapi.client.load('calendar', 'v3', callback);
  };

  var logIn = function(authResult) {
    initAuthButton();
    getAvailability();
    setInterval(getAvailability, 60 * 1000); // Referesh every minute
  };

  var displayAvailability = function(eventData) {
    var calName = eventData.result.summary;
    var calEvent = eventData.result.items && eventData.result.items[0];
    var room = $('#' + calName.replace(/\s+/g, '').toLowerCase());
    if (calEvent && calEvent.kind === 'calendar#event') {
      room.removeClass('free').addClass('occupied');
      room.find('.event').text(calEvent.summary);
    } else {
      room.removeClass('occupied').addClass('free');
      room.find('.event').text('');
    }
  };

  // API

  return {
    init: init,
    setOccupied: setOccupied
  };
})();

function googleReady() {
  Croom.init();
}
