/* TODO: work out if this the best way - see http://tech.groups.yahoo.com/group/rest-discuss/message/14432
    the Allow response header determines the transitions (HTTP verbs) available 
    
    This is dubious about if I want to put this on a model and then toggle in the view
    
    Admunsen puts these in the payload, hhhmmmm.
*/
define( ['underscore', 'utils/semanticLink'], function(_, link){
  _.mixin({
    addControlData: function(item, response, accept){

      var accept = accept || '*/*'
      var controlData = {}
      controlData.removeable = /DELETE/i.test(response.getResponseHeader('Allow'))
      controlData.accept = accept
      controlData.href = link.filter( item, 'self', accept)[0].href || ""

      return _.extend(controlData, item)
    }
  })
})