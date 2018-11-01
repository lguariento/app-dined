xquery version "3.1";
declare namespace output="http://www.w3.org/2010/xslt-xquery-serialization";
declare namespace tei = "http://www.tei-c.org/ns/1.0";

declare option output:method "json";
declare option output:media-type "application/json";

declare function local:get-id($n as node()) as xs:integer {
   format-number(xs:integer(substring(data($n/@xml:id), 3)), "000")
};

let $geogname := request:get-parameter('geogname', '')

let $on-disk := doc('/db/apps/app-dined/data/indices/pldb.xml')
let $nextIdNum := local:get-id($on-disk//tei:place[last()]) + 1
let $nextId := xs:ID("pl" || format-number($nextIdNum, "000"))

let $newPlace :=

<place xmlns="http://www.tei-c.org/ns/1.0" xml:id="{$nextId}">
   <placeName>
      <geogName>{$geogname}</geogName>
   </placeName>
</place>

return

let $login := xmldb:login("/db/apps/app-dined", 'admin', 'admin')

let $insert := 

update insert $newPlace following $on-disk//tei:place[last()]

return

<h3>Success! {$nextId} added</h3>