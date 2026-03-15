// 27.03.2025 18:50
// to prevent Onetrust from taking over the old consent-statement 
// of the user we have to delete cookies associated with the old
// consent management.
// once the new consent management is in place for as long as old cookies might still be valid,
// which is the, 27.03.2026, this can be deleted.
function deleteOneTrustConsentIfOld(targetVersion) {
  const cookies = document.cookie;
  const matchingCookies = cookies.match(/(?:^|;\s*)OptanonConsent=([^;]+)/);
  if (matchingCookies) {

      const onetrustCookie = decodeURIComponent(matchingCookies[1]);
      const versionMatch = onetrustCookie.match(/version=([^\&]+)/);
      if (versionMatch) {

          const currentVersion = versionMatch[1];

          // String comparison works with OneTrust's version format (e.g., "202503.1.0")
          if (currentVersion < targetVersion) {

              const pathParts = window.location.pathname.split('/').filter(Boolean);
              if (pathParts.length > 0) {
                const domains = [window.location.hostname, '.' + window.location.hostname];
                domains.forEach(domain => {
                  const pathForDeletion = `/${pathParts[0]}/`
                  document.cookie = `OptanonConsent=; path=${pathForDeletion}; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
                  document.cookie = `OptanonAlertBoxClosed=; path=${pathForDeletion}; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
              })
          }
      }
  }}
}

deleteOneTrustConsentIfOld('202503.1.0')

const OT_SDK_STUB_JS_URL = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js'
const DEFAULT_ID = ''
const OT_SCRIPT_IDS_EUR = {
  'www.nintendo.co.uk': 'ad0331a1-5db1-4c07-8885-1be6e1666816',
  'www.nintendo.de': 'bd9d4b62-2c81-4bb4-b6c1-44d4afe7503e',
  'www.nintendo.ch': 'c30a438e-e915-43ae-9992-61d3f65069b0',
  'www.nintendo.at': '24923808-feb4-4ab2-9664-c57b5cac0821',
  'www.nintendo.fr': '932fea78-0540-4b37-9bf2-95060a592427',
  'www.nintendo.be': '2e0a8921-19ff-4db4-af80-cc014a7abb8a',
  'www.nintendo.es': 'b9c326df-117e-4ef7-835d-84ae19ddda1b',
  'www.nintendo.nl': '17a5f218-5b5c-4533-a9d6-3823a420a7fa',
  'www.nintendo.it': 'd9f2eabb-dfcf-4ee4-8b55-0ac47eba4df5',
  'www.nintendo.pt': '9a816de1-c7df-4d2a-98a8-93df86ebdaa9',
  'www.nintendo.co.za': 'da9779fc-717e-475f-956e-c50b146fbbb3',
}
const OT_SCRIPT_IDS_COM = {
  'en-gb': '018e3862-7f50-775c-ae46-68119cb997ba',
  'de-de': '018df521-f73d-7a66-bc86-3912586d1c3f',
  'fr-ch': '018e3865-ab25-7271-a636-0c7313591a2f',
  'de-ch': '018e3d74-61e1-77e1-8434-5fe770a10544',
  'it-ch': '018e3d74-ba89-7d3e-8f67-af6fce52b805',
  'de-at': '018e3d74-f8b9-74da-889c-78540796a802',
  'fr-fr': '018e3d75-3622-7560-8e06-3da1329bebb3',
  'nl-be': '018e3d75-968d-7a7b-a93a-1b64c533785c',
  'fr-be': '018e3d75-e66e-70cc-a831-85ef70355083',
  'es-es': '018e3d76-0f90-74dd-958a-defded58225e',
  'nl-nl': '018e3d76-390d-78bd-b825-c501d74a578b',
  'it-it': '018e3d76-63dd-764c-b9fb-c91c4063908c',
  'pt-pt': '018e3d76-9849-70dd-88d5-ab272c78270d',
  'en-za': '018e3d76-edf1-7c5c-ae85-134c944801dc',
}
const OT_SCRIPT_IDS_COM_STG = {
  'en-gb': '018e7b58-f585-788b-93dc-deace4bda850',
  'de-de': '018e7b5a-169f-71b3-9fd4-46b9333157bf',
  'fr-ch': '018e7b5e-782a-79c2-a453-ea8ac5a6e46e',
  'de-ch': '018e7b5e-d3a2-71bf-81af-eb7006ed494d',
  'it-ch': '018e7b69-ca1a-77fb-ab9c-1e8c52677dcc',
  'de-at': '018e7b6a-4466-76bd-94fd-16923f7fbb1d',
  'fr-fr': '018e7b6f-c4a1-7f38-87cb-3276f57d99d0',
  'nl-be': '018e7b71-df08-70d8-9ff5-9cf497528321',
  'fr-be': '018e7b72-2c4f-7091-9a57-63b1efc54a9f',
  'es-es': '018e7b72-7e48-725d-96c9-6daa82e37980',
  'nl-nl': '018e7b72-d1e0-7881-adf6-a7de40a97ea3',
  'it-it': '018e7b73-1d35-7c1a-a0c0-15330284c1e2',
  'pt-pt': '018e7b73-62c2-7113-a57f-042dca9c8833',
  'en-za': '018e7b73-c7b7-774c-a874-008a1627e530',
}

const otScriptExists = document.querySelector(`script[src="${OT_SDK_STUB_JS_URL}"]`) !== null

if (!otScriptExists) {
  // If there's a script already injected, we abort!
  let scriptId = DEFAULT_ID
  const currentHost = location.host
  if (currentHost.includes('nintendo.com')) { // Handle nintendo.com
    let envIdsObj = OT_SCRIPT_IDS_COM
    if (currentHost.includes('-stg')) {
      envIdsObj = OT_SCRIPT_IDS_COM_STG
    }
    const countryPath = location.pathname.split('/')[1]
    if (Object.keys(envIdsObj).includes(countryPath)) {
      scriptId = envIdsObj[countryPath]
    }
  } else if (Object.keys(OT_SCRIPT_IDS_EUR).includes(currentHost)) { // Handle eur nintendo.xx
    scriptId = OT_SCRIPT_IDS_EUR[currentHost]
  } else {
    console.error('No rules matched the location, injecting default script')
  }

  if (scriptId !== '') {
    const otScript = document.createElement('script')
    const firstScriptTag = document.getElementsByTagName('script')[0]
    otScript.src = OT_SDK_STUB_JS_URL
    otScript.async = false
    otScript.type = 'text/javascript'
    otScript.dataset.documentLanguage = 'true'
    otScript.dataset.domainScript = scriptId
    firstScriptTag.parentNode.insertBefore(otScript, firstScriptTag)
  }
}
