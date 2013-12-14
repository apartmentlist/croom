var Croom = (function() {
  var CLIENT_ID = '352455586725-d6t9jg1soigo36ggqgs7qgn6avjl9ek7.apps.googleusercontent.com';
  var OAUTH_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
  var APPS_DOMAIN = 'verticalbrands.com';

  var init = function() {
    var authBtn = $('#authorize');
    if (localStorage.access_token) {
      authBtn.remove();
    } else {
      authBtn.click(auth);
    }
  };

  var auth = function() {
    gapi.auth.authorize({
      'client_id': CLIENT_ID,
      'scope': OAUTH_SCOPE,
      'hd': APPS_DOMAIN
    }, function() {
      localStorage.access_token = gapi.auth.getToken().access_token;
      window.location = window.location; // Reload the page
    });
  };

  // Requires room slug matching div id
  var setOccupied = function(roomName) {
    var room = document.getElementById(roomName);
    room.className = 'occupied';
  };

  return {
    init: init,
    auth: auth,
    setOccupied: setOccupied
  };
})();

$(Croom.init);
