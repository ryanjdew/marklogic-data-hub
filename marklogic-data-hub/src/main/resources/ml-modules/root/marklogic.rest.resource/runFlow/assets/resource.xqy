xquery version "1.0-ml";
module namespace ml-runFlow = "http://marklogic.com/rest-api/resource/ml:runFlow";

import module namespace extut = "http://marklogic.com/rest-api/lib/extensions-util"
at "/MarkLogic/rest-api/lib/extensions-util.xqy";

declare default function namespace "http://www.w3.org/2005/xpath-functions";
declare option xdmp:mapping "false";

declare private variable $extName := "ml:runFlow";
declare private variable $modPath := "/marklogic.rest.resource/"|| $extName ||"/assets/resource.sjs";
declare private variable $caller  := xdmp:function(
  xs:QName("applyOnce"), "/data-hub/5/rest-api/lib/extensions-util.sjs"
);

declare function ml-runFlow:source-format() as xs:string {
  "javascript"
};
declare function ml-runFlow:get(
  $context as map:map, $params as map:map
) as map:map {
  xdmp:apply($caller,$extName,$modPath,"GET",$context,$params)
};
declare function ml-runFlow:delete(
  $context as map:map, $params as map:map
) as map:map {
  xdmp:apply($caller,$extName,$modPath,"DELETE",$context,$params)
};
declare function ml-runFlow:post(
  $context as map:map, $params as map:map, $input as document-node()*
) as map:map {
  xdmp:apply($caller,$extName,$modPath,"POST",$context,$params,$input)
};
declare function ml-runFlow:put($context as map:map, $params as map:map, $input as document-node()*
) as map:map {
  xdmp:apply($caller,$extName,$modPath,"PUT",$context,$params,$input)
};
declare function ml-runFlow:transform(
  $context as map:map, $params as map:map, $input as document-node()?
) as map:map {
  xdmp:apply($caller,$extName,$modPath,"transform",$context,$params,$input)
};
