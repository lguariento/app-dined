xquery version "3.1";
declare namespace output="http://www.w3.org/2010/xslt-xquery-serialization";
declare namespace tei = "http://www.tei-c.org/ns/1.0";

declare option output:method "json";
declare option output:media-type "application/json";

declare function local:get-id($n as node()) as xs:integer {
   format-number(xs:integer(substring(data($n/@xml:id), 3)), "000")
};

let $rolename := request:get-parameter('rolename', '')
let $forename := request:get-parameter('forename', '')
let $surname := request:get-parameter('surname', '')
let $aka := request:get-parameter('aka', '')
let $on-disk := doc('/db/apps/app-dined/data/indices/pedb.xml')
let $nextIdNum := local:get-id($on-disk//tei:person[last()]) + 1
let $nextId := xs:ID("pe" || format-number($nextIdNum, "000"))

let $newPerson :=

<person xmlns="http://www.tei-c.org/ns/1.0" xml:id="{$nextId}">
   <persName>
      <roleName>{$rolename}</roleName>
      <forename>{$forename}</forename>
      <surname>{$surname}</surname>
      <addName>{$aka}</addName>
   </persName>
</person>

return

let $login := xmldb:login("/db/apps/app-dined", 'admin', 'admin')

let $insert := 

update insert $newPerson following $on-disk//tei:person[last()]

return

<h3>Success! {$nextId} added</h3>