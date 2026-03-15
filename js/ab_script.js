//------- AB Test list
var abTests= {
}

// --- AB Test Custom Track function
function setAbTestCustomTracking(action, eventLabel, selector, experimentId){
    document.querySelectorAll(selector).forEach(function(element){
        if(action == "click"){
            element.addEventListener("click", function(e){
                var version = google_optimize.get(experimentId);
                dataLayer.push({
                    'event': 'uaevent',
                    'eventCategory': 'Optimize',
                    'eventAction': action,
                    'eventLabel': eventLabel + ' ' + version,
                    'nonInteraction': false
                });
            })
        }
    });
}

function pushArgumentToDataLayer() {dataLayer.push(arguments)}

if(document.documentElement.lang in abTests){
    var lang = document.documentElement.lang;
    for(var experimentId in abTests[lang]){
      var experiment = abTests[lang][experimentId];
      var callbackFunction = function (variant) {
        $( document ).ready(function() {
          /* Set tracking */
          for(var event in experiment["events"]){
              setAbTestCustomTracking(experiment["events"][event]["action"], event, experiment["events"][event]["selector"], experimentId);
          }
          /* Execute custom function */
          if(experiment["customFunction"] !== undefined) {
            experiment["customFunction"](variant);
          }
        })
      }

      pushArgumentToDataLayer('event', 'optimize.callback', {
          name: experimentId,
          callback: callbackFunction
      })
    }
}