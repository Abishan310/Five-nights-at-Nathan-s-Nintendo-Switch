function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
};

const getCookieUserData = function () {
  const uCookie = getCookie('tCookieUserGa4');
  let userData = {
    is_user_logged_in: 'false',
    user_id: undefined,
    user_usage_info_enabled: 'false',
    user_marketing_enabled: 'false',
  };
  if (uCookie !== undefined) {
    const cObject = JSON.parse(uCookie);
    const isMarketingEnabled = 'user_marketing_enabled' in cObject ? cObject.user_marketing_enabled : false
    userData.user_marketing_enabled = isMarketingEnabled + ''
    userData.is_user_logged_in = 'true'
    if ('user_usage_info_enabled' in cObject && cObject.user_usage_info_enabled === true) {
      userData.user_usage_info_enabled = 'true'
      userData.user_id = cObject.user_id + ''
    }
  }
  return userData
}

/**
* @desc Tracking init on Page Load
*
*/
function loadGTM() {
  window.nindo.tracking.config.initOTCookies()
  var nindo = nindo || {};
  nindo.gtmContainerID = nindo.gtmContainerID || window.gtmConfig.container;
  const gtmGa4ContainerID = 'GTM-P3CK3CN'
  window.nindo.tracking.cfg.gtmGa4ContainerID = gtmGa4ContainerID;

  /**
   * @desc Check if consent for GTM was given
   * @returns {Boolean} User is opted-in or not
   */
  const isOptedIn = function () {
    const gtmGroups = ['C0002', 'C0004']
    const activeGroups = window.OnetrustActiveGroups.split(',').filter(
      (group) => group,
    )
    return gtmGroups.some((group) => activeGroups.includes(group))
  }

  if (isOptedIn()) {
    // START GA4 Google Tag Manager
    ;(function (w, d, s, l, i) {
      w[l] = w[l] || []
      w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      })
      const f = d.getElementsByTagName(s)[0]
      const j = d.createElement(s)
      const dl = l != 'dataLayer' ? '&l=' + l : ''
      j.async = true
      j.src = j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
      f.parentNode.insertBefore(j, f)
    })(window, document, 'script', 'dataLayer', gtmGa4ContainerID)
    // END GA4 Google Tag Manager

    // Initializing tracking
    window.nindo.track.init()
  }
}