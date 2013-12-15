/*global gapi */

var Croom = (function() {
  var CLIENT_ID = '352455586725-d6t9jg1soigo36ggqgs7qgn6avjl9ek7.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyDVUkeBHaf9IOX91V5cEtNORcGhPoZsfPE';
  var OAUTH_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
  var APPS_DOMAIN = 'verticalbrands.com';

  var init = function() {
    gapi.client.setApiKey(API_KEY);
    loadGoogleClients();
    auth(true, logIn);
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

  var getCalendars = function() {
    if (!localStorage.access_token) return;
    gapi.client.calendar.calendarList.list().execute(function(result) {
      $.each(result.items, function(i, calendar) {
        if (calendar.id.match(/resource/)) {
          console.log(calendar.summary, calendar.id);
        }
      });
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

  var loadGoogleClients = function() {
    gapi.client.load('calendar', 'v3', function() {
      console.log("Calendar loaded");
    });
  };

  var logIn = function(authResult) {
    initAuthButton();
    getCalendars();
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
