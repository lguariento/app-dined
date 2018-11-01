xquery version "3.1";
declare namespace output="http://www.w3.org/2010/xslt-xquery-serialization";
declare namespace tei = "http://www.tei-c.org/ns/1.0";

declare option output:method "json";
declare option output:media-type "application/json";


      let $date := xs:date(request:get-parameter('when', ()))
      let $facs := request:get-parameter('facs', '')
      let $transcription_raw := data(request:get-parameter('transcription', ''))
      let $transcription := util:parse-html((concat('<!--', $transcription_raw, '-->')))
(:      let $request := request:get-parameter-names() ! <name>{(., request:get-parameter(., ()) ! <value>{.}</value>)}</name>
:)      
      let $newentry :=
      
      <div xmlns="http://www.tei-c.org/ns/1.0" type="entry" xml:id="h{$date}">
         <pb facs="{$facs}"/>
         <ab type="metadata">
            <date when="{$date}"/>
             {for $id at $pos in request:get-parameter('peid', '')
              let $sl := request:get-parameter('slept', '')[$pos]
              return <persName ref="{$id}" slept="{$sl}"/>}
             {for $id at $pos in request:get-parameter('plid', '')
              let $host := request:get-parameter('host', '')[$pos]
              return <placeName ref="{$id}" host="{$host}"/>}
         </ab>
         <ab type="transcription">{($transcription)}
         </ab>
         </div>
      
      let $on-disk := doc('/db/apps/app-dined/data/cards/1799.xml')
      let $last_id := $on-disk//tei:div[position() eq last()]/@xml:id

      let $login := xmldb:login("/db/apps/app-dined", 'admin', 'admin')
      
      let $already := 
          for $d in $on-disk//@when 
          where ($date eq xs:date($d)) return ("1")
      
      let $insert := 
      
      if($already eq "1") then 
      update replace $on-disk//tei:body/tei:div[xs:date(tei:ab/tei:date/@when) eq $date] with $newentry
      else if ($date lt xs:date($on-disk//@when[1])) then
       update insert $newentry preceding $on-disk//tei:body/tei:div[1]
       else
       update insert $newentry following $on-disk//tei:body/tei:div[xs:date(tei:ab/tei:date/@when) lt $date][last()]
        
      let $reindex := xmldb:reindex("/db/apps/app-dined/data/cards/1799.xml")
      let $node := $on-disk//HTML
      let $delete := update delete $node
      
      return
      <h2>{if($already) then ("Entry for" || $date || " has been replaced") else("Entry for " || $date || " has been stored!")}</h2>
      
