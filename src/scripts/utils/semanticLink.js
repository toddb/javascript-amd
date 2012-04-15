//  A utility class for manipulating a list of links that form a semantic interface
//  to a resource.
//
//  example data, of an object with a array called links:
//
// {
//   links: [
//     { rel: "alternate", type: "text/html", href: "http://localhost/orders/index" },
//     { rel: "collection" type: "application/json", href: "http://localhost/orders/current" },
//     { rel: "current" type: "application/json", href: "http://localhost/orders/current" },
//     { rel: "item", type: "application/json", href: "http://localhost/orders/1"},
//     { rel: "first", type: "application/json", href: "http://localhost/orders/1"},
//     { rel: "item", type: "application/json", href: "http://localhost/orders/2"},
//     { rel: "item", type: "application/json", href: "http://localhost/orders/3"},
//     { rel: "last", type: "application/json", href: "http://localhost/orders/3"},
//   ]
// }
//
//  Parameters
//  ==========
//
//  The methods of this object tend to use the following parameters:
//
//  links
//  -----
//
//  This is the first parameter to most methods on this object. It
//  is an object with some form of semantic interface, that contains
//  links. The supported forms of this parameter are:
//     - the <head> element of a html DOM
//     - the magic identifer 'HEAD' (as a synonym for the <head> element)
//     - an array of link objects with rel, type and href values
//     - an object with a 'links' object which an array of link objects
//
//  relationshipType
//  ----------------
//  
//  This parameter is a well known (or custom) relationship type. 
//  e.g 'canonical', 'alternate', 'up', 'self'
//
//  The relation stype can be:
//    - an exact matching string
//    - a magic wildcard string '*'
//    - a regular expression
//
//  mediaType
//  ---------
//
//  This paramter is a well known mime type. e.g. 'application/json',
//  'text/html' etc.
//
//  The relation stype can be:
//    - an exact matching string
//    - a magic wildcard string '*'
//    - a regular expression
//

define(
    'utils/semanticLink',
    ['utils/log', 'jquery', 'underscore'],
    function (log, $, _) {

        function logError(links, relationshipType, mediaType) {
            if (_.isNull(links) || _.isUndefined(links)) {
                log.error("null or invalid object provided with semantic links information");
            }
            else {
                log.error('The semantic interface \'' + relationshipType + '\' (' + mediaType + ') is not available. Available semantics include ' +
                    _.map(filter(links, '*', '*'), function(link) {
                        return '\n  ' + link.rel + ' (' + link.type + ') -> ' + link.href;
                    }));
            }
        }


        //
        // Map the list of child <link> elements from the given DOM element
        // into simple link objects
        //
        function filterDom(element, relationshipType, mediaType) {
            var links = $(element)
                .find('link')
                .filter('link[href, type, rel]')
                .map(function (index, link) { return { href: link.href, rel: link.rel, type: link.type }; })
                .get();
            return filterLinks(links, relationshipType, mediaType);
        }

        function filterRepresentation(representation, relationshipType, mediaType) {
            if (!_.isUndefined(representation) && _.contains(_.keys(representation), 'links')) {
                return filterLinks(representation['links'], relationshipType, mediaType);
            }
            return []; // No links member on the object, so nothing matches
        }

        // A utility helper function to match a relationship type of media type string
        //
        // Match a link string if:
        //   a regular  expression is used
        //   the string is a special case wildcard string of '*'
        //   the string matches the link string
        //
        function matchParameter(linkString, matchString) {
            return (_.isRegExp(matchString) && linkString.match(matchString)) ||
                matchString === '*' ||
                    linkString === matchString;
        }


        //
        // Get an array of links that match the given relationship type and
        // media type, where the link has a href 
        //
        function filterLinks(links, relationshipType, mediaType) {
            if (_.isArray(links)) {
                return _.filter(links, function (link) {
                    var linkKeys = _.keys(link);
                    if (_(linkKeys).contains('href')) {
                        if (_(linkKeys).contains('rel')) {
                            if (!matchParameter(link.rel, relationshipType)) {
                                return false; // relationship type doesn't match
                            }
                        }
                        if (_(linkKeys).contains('type')) {
                            if (!matchParameter(link.type, mediaType)) {
                                return false; // media type doesn't match
                            }
                        }
                        return true; // it seems to match, and it has an url.
                    }
                    return false; // no match;
                });
            }
            log.warn('Array input expected');
            return []; // No links match the filter requirements.
        }

        // Given a set of links (which can be in several forms), generate a
        // list of filtered links that match the given relation type and media type
        function filter(arg, relationshipType, mediaType) {
            if (_.isArray(arg)) {
                // filter an array of JSON link objects
                return filterLinks(arg, relationshipType, mediaType);

            } else if (arg === 'HEAD') {
                // Filter 'link' elements from the 'head' element of the DOM, this is a
                // shortcut method so the caller doesn't have to express "$('HEAD')[0]"
                return filterDom($('head')[0], relationshipType, mediaType);

            } else if (_.isElement(arg)) {
                // Filter 'link' elements from the DOM
                return filterDom(arg, relationshipType, mediaType);

            } else {
                // Filter based on a representation with an array on 'links'
                return filterRepresentation(arg, relationshipType, mediaType);
            }
        }


        //
        //  HTTP/jqXHR utilities
        //  =====================


         function ajaxLink(links, relationshipType, mediaType, verb, data, dataType) {
             var candidateLinks = filter(links, relationshipType, mediaType);
             if (!_.isEmpty(candidateLinks)) {
                 var index = 0;
                 var link = candidateLinks[index];

                 return $.ajax({
                     type: verb,
                     url: link.href,
                     data: data,
                     dataType: dataType,
                     contentType: link.type /* set this so the default 'application/x-www-form-urlencoded' is not used*/,
                     beforeSend: function (jqXhr /*, settings */) {
                         if (verb === 'GET') {
                             jqXhr.setRequestHeader("Accept", link.type);
                         }
                     }
                 });
             }
             else {
                 var failed = new $.Deferred();
                 failed.reject(null /* no jqXhr*/, 'Error', 'The resource doesn\'t support the required interface');
                 return failed.promise();
             }
         }


         //
         //  Public interface methods
         //  ========================
         //


         function ajaxGet(links, relationshipType, mediaType) {
             return ajaxLink(links, relationshipType, mediaType, 'GET', null, null);
         }

         function ajaxPut(links, relationshipType, mediaType, data, dataType) {
             return ajaxLink(links, relationshipType, mediaType, 'PUT', data, dataType);
         }

         function ajaxPost(links, relationshipType, mediaType, data, dataType) {
             return ajaxLink(links, relationshipType, mediaType, 'POST', data, dataType);
         }

         function ajaxDelete(links, relationshipType, mediaType) {
             return ajaxLink(links, relationshipType, mediaType, 'DELETE', null, null);
         }


         function navigateTo(links, relationshipType, mediaType) {
            var candidateLinks = filter(links, relationshipType, mediaType);
            if (!_.isEmpty(candidateLinks)) {
                document.location.href = _.first(candidateLinks).href;
            } else {
                logError(links, relationshipType, mediaType);
            }
        }

        function getUri(links, relationshipType, mediaType) {
            var candidateLinks = filter(links, relationshipType, mediaType);
            if (!_.isEmpty(candidateLinks)) {
                return _.first(candidateLinks).href;
            } else {
                logError(links, relationshipType, mediaType);
                return '';
            }
        }

        // 'Static' object with functions.
        return {

            //
            // Http verbs (get, put post, delete).
            //
            // WARNING: 'delete' is a reserved identifer in javascript. The delete
            // method can be called if it is used as an array name.
            get: ajaxGet,
            put: ajaxPut,
            post: ajaxPost,
            'delete': ajaxDelete,
            _delete: ajaxDelete

            // Change the current documentation location to the first link that 
            // matches the given
            navigateTo: navigateTo,

            // Get the first 'href' that matches the filter criteria.
            getUri: getUri,

            // Filter the list of links based on a relationship type and media type.
            // The result is an array of links objects.
            //
            // The results are not sorted. When multiple link entries are matched
            // then the order should not be assumed.
            //
            filter: filter
        };
    });