$(document).on('device keyup', '.speedy-filter', function () {
  //location.hash = 'device='+$(this).val().replace(' ', '_')
  location.hash = 'device='+$('#device').val().replace(' ', '_')+'&columns='+columns+'&rows='+rows;
  rename();
})

window.onhashchange = function () {
  //search($('.speedy-filter').val(location.hash.substr(1)).val().replace('_',' '))
  //todo reset redraw values
  $('[href^="#"]').removeClass('active')
  $("[href='#{location.hash}']").addClass('active')
}

rows = 2;
columns = 16;
$('#addcol').click(function() {
    if (columns > 31) {
      return true;
    }
    var $tablerow = $('table.table-editor').find('tr');
    count = 0;

    $tablerow.each(function(index, value){
        count += 1;
        //alert('Working on row: ' + count);
        var $listitem = $(this);
        //alert('ListItem: ' + $listitem.index());
        n = parseInt($listitem.index());
        //alert('Value of n: ' + n);
        var $newRow = $("<td>" + (columns*rows+count) + "</td>");
        $("table.table-editor tr:eq(" + n + ")").append($newRow);
    });
    columns += 1;
    $("#switch-header").attr('colspan', columns);
    location.hash = 'device='+$('#device').val().replace(' ', '_')+'&columns='+columns+'&rows='+rows;

});

$('#remcol').click(function() {
    if (columns < 2) {
      return true;
    }
    var $tablerow = $('table.table-editor').find('tr');

    $tablerow.each(function(index, value){
        $("table.table-editor tr:eq("+index+") td:eq(-1)").remove();
    });
    columns -= 1;
    $("#switch-header").attr('colspan', columns);
    location.hash = 'device='+$('#device').val().replace(' ', '_')+'&columns='+columns+'&rows='+rows;
});

$('#addrow').click(function() {
    if (rows > 1) {
        return true;
    }
    if (rows%2==0){
      hclass = 'class="up2"';
    } else {
      hclass = 'class="down"';
    }
    $('table.table-editor').append("<tr "+hclass+"></tr>");
    $('table.table-editor tr:eq(0) td').each(function(index, value){
        $("table.table-editor tr:eq(-1)").append("<td>"+index+"</td>");
    });
    rows += 1;
    location.hash = 'device='+$('#device').val().replace(' ', '_')+'&columns='+columns+'&rows='+rows;
    recalc();
});

$('#remrow').click(function() {
    if (rows < 2) {
        return true;
    }
    $('table.table-editor tr:eq(-1)').remove();
    rows -= 1;
    location.hash = 'device='+$('#device').val().replace(' ', '_')+'&columns='+columns+'&rows='+rows;
    recalc();
});

function recalc() {
    var $tablerow = $('table.table-editor').find('tr');
    crows = 0;

    cports = 1;
    $tablerow.each(function(index, value){
        crows += 1;
        var $tablecell = $(this).find('td');
        ccolumns = 0;
        $tablecell.each(function(index, value){
            $(this).html(ccolumns*rows+crows);
            ccolumns += 1;
        });
    });
}

function rename() {
  var vendors = ["cisco", "arista"];
  var name = $('#device').val();
  for (i=0; i<vendors.length; ++i) {
     if (name.toLowerCase().search(vendors[i]+' ') != -1) {
       name = '<img src="images/' + vendors[i] + '.jpg" /> ' + name.replace(RegExp(vendors[i]+" ","gi"),"");
       break;
     }
  }
  if (name == '') {
     name = 'Switch name';
  }
  $('#switch-name').html(name);
}

function template() {
  var current_date = '09.01.10';
  var current_time = '14.23';
  var name = $('#device').val();
  if (name == "") {
    name = "Switch";
  }
  var template_name = 'Template SNMP ' + name + ' - www.monitoringartist.com'
  var tpl_start = "<?xml version='1.0'?>" 
  + "\n<zabbix_export version='1.0' date='" + current_date + "' time='" + current_time + "'>" 
  + "\n<hosts>"
  + "\n      <host name='" + template_name + "'>"
  + "\n          <useip>0</useip>"
  + "\n          <dns></dns>"
  + "\n          <ip>0.0.0.0</ip>"
  + "\n          <port>10150</port>"
  + "\n          <status>3</status>"
  + "\n          <groups>"
  + "\n              <group>Templates</group>"
  + "\n          </groups>"
  + "\n          <items>"
  + "\n              <item type='3' key='icmpping' value_type='3'>"
  + "\n                  <description>Ping</description>"
  + "\n                  <ipmi_sensor></ipmi_sensor>"
  + "\n                  <delay>" + $('#interval').val() + "</delay>"
  + "\n                  <history>7</history>"
  + "\n                  <trends>365</trends>"
  + "\n                  <status>0</status>"
  + "\n                  <units></units>"
  + "\n                  <multiplier>0</multiplier>"
  + "\n                  <delta>0</delta>"
  + "\n                  <formula></formula>"
  + "\n                  <lastlogsize>0</lastlogsize>"
  + "\n                  <logtimefmt></logtimefmt>"
  + "\n                  <delay_flex></delay_flex>"
  + "\n                  <params></params>"
  + "\n                  <trapper_hosts></trapper_hosts>"
  + "\n                  <snmp_community></snmp_community>"
  + "\n                  <snmp_oid></snmp_oid>"
  + "\n                  <snmp_port>161</snmp_port>"
  + "\n                  <snmpv3_securityname></snmpv3_securityname>"
  + "\n                  <snmpv3_securitylevel>0</snmpv3_securitylevel>"
  + "\n                  <snmpv3_authpassphrase></snmpv3_authpassphrase>"
  + "\n                  <snmpv3_privpassphrase></snmpv3_privpassphrase>"
  + "\n              </item>";
  // TODO add more item/trigger templates
  var tpl_item = "<item type='" + $('#version').val() + "' key='ifOutOctets.[PORT]' value_type='3'>"
  + "\n     <description>Bytes Tx port [PORT]</description>"
  + "\n     <ipmi_sensor></ipmi_sensor>"
  + "\n     <delay>" + $('#interval').val() + "</delay>"
  + "\n     <history>7</history>"
  + "\n     <trends>365</trends>"
  + "\n     <status>0</status>"
  + "\n     <data_type>0</data_type>"
  + "\n     <units>bps</units>"
  + "\n     <multiplier>1</multiplier>"
  + "\n     <delta>1</delta>"
  + "\n     <formula>8</formula>"
  + "\n     <lastlogsize>0</lastlogsize>"
  + "\n     <logtimefmt></logtimefmt>"
  + "\n     <delay_flex></delay_flex>"
  + "\n     <authtype>0</authtype>"
  + "\n     <username></username>"
  + "\n     <password></password>"
  + "\n     <publickey></publickey>"
  + "\n     <privatekey></privatekey>"
  + "\n     <params></params>"
  + "\n     <trapper_hosts></trapper_hosts>"
  + "\n     <snmp_community>" + $('#community').val() + "</snmp_community>"
  + "\n     <snmp_oid>1.3.6.1.2.1.2.2.1.16.[PORT]</snmp_oid>"
  + "\n     <snmp_port>" + $('#port').val() + "</snmp_port>"
  + "\n     <snmpv3_securityname>" + $('#secname').val() + "</snmpv3_securityname>"
  + "\n     <snmpv3_securitylevel>" + $('#seclevel').val() + "</snmpv3_securitylevel>"
  + "\n     <snmpv3_authpassphrase>" + $('#authpass').val() + "</snmpv3_authpassphrase>"
  + "\n     <snmpv3_authprotocol>" + $('#authprot').val() + "</snmpv3_authprotocol>"
  + "\n     <snmpv3_privpassphrase>" + $('#privpass').val() + "</snmpv3_privpassphrase>"
  + "\n     <snmpv3_privprotocol>" + $('#privprot').val() + "</snmpv3_privprotocol>"
  + "\n     <valuemapid>0</valuemapid>"
  + "\n     <applications/>"
  + "\n   </item>"
  + "\n	<item type='" + $('#version').val() + "' key='ifInOctets.[PORT]' value_type='3'>"
  + "\n     <description>Bytes Rx port [PORT]</description>"
  + "\n     <ipmi_sensor></ipmi_sensor>"
  + "\n     <delay>" + $('#interval').val() + "</delay>"
  + "\n     <history>7</history>"
  + "\n     <trends>365</trends>"
  + "\n     <status>0</status>"
  + "\n     <data_type>0</data_type>"
  + "\n     <units>bps</units>"
  + "\n     <multiplier>1</multiplier>"
  + "\n     <delta>1</delta>"
  + "\n     <formula>8</formula>"
  + "\n     <lastlogsize>0</lastlogsize>"
  + "\n     <logtimefmt></logtimefmt>"
  + "\n     <delay_flex></delay_flex>"
  + "\n     <authtype>0</authtype>"
  + "\n     <username></username>"
  + "\n     <password></password>"
  + "\n     <publickey></publickey>"
  + "\n     <privatekey></privatekey>"
  + "\n     <params></params>"
  + "\n     <trapper_hosts></trapper_hosts>"
  + "\n     <snmp_community>" + $('#community').val() + "</snmp_community>"
  + "\n     <snmp_oid>1.3.6.1.2.1.2.2.1.10.[PORT]</snmp_oid>"
  + "\n     <snmp_port>" + $('#port').val() + "</snmp_port>"
  + "\n     <snmpv3_securityname>" + $('#secname').val() + "</snmpv3_securityname>"
  + "\n     <snmpv3_securitylevel>" + $('#seclevel').val() + "</snmpv3_securitylevel>"
  + "\n     <snmpv3_authpassphrase>" + $('#authpass').val() + "</snmpv3_authpassphrase>"
  + "\n     <snmpv3_authprotocol>" + $('#authprot').val() + "</snmpv3_authprotocol>"
  + "\n     <snmpv3_privpassphrase>" + $('#privpass').val() + "</snmpv3_privpassphrase>"
  + "\n     <snmpv3_privprotocol>" + $('#privprot').val() + "</snmpv3_privprotocol>"
  + "\n     <valuemapid>0</valuemapid>"
  + "\n     <applications/>"
  + "\n   </item>";
 var tpl_end = "</host>"
   + "\n</hosts>"
   + "\n</zabbix_export>";

  // main build loop
  var items = '';  
  for (i=1; i<(rows*columns); ++i) {
      // TODO add only checked item/trigger templates
      items = items + tpl_item.replace('[PORT]', i, 'gm');
  }
  items = items + '</items>';

  var blob = new Blob([tpl_start+items+tpl_end], {type: "application/xml;charset=utf-8"});
  saveAs(blob, name.trim().replace(/ /gi,"_") + "_Zabbix_template_www.monitoringartist.com.xml");
}

$('#version').on('change', function() {
           if($('#version').val() == '1')
           {
               $('#hcommunity').show();
               $('#hcontext').hide();
               $('#hsecname').hide();
			   $('#hseclevel').hide();
               $('#hauthprot').hide();
               $('#hauthpass').hide();
			   $('#hprivprot').hide();
               $('#hprivpass').hide();
           }
           else if($('#version').val() == '4')
           {
               $('#hcommunity').show();
               $('#hcontext').hide();
               $('#hsecname').hide();
			   $('#hseclevel').hide();
               $('#hauthprot').hide();
               $('#hauthpass').hide();
			   $('#hprivprot').hide();
               $('#hprivpass').hide();
           }
           else
           {
               $('#hcommunity').hide();
               $('#hcontext').show();
               $('#hsecname').show();
			   $('#hseclevel').show();
               if($('#seclevel').val() == '0')
               {
                   $('#hauthprot').hide();
                   $('#hauthpass').hide();
   				   $('#hprivprot').hide();
                   $('#hprivpass').hide();
               }
               else if($('#seclevel').val() == '1')
               {
                   $('#hauthprot').show();
                   $('#hauthpass').show();
   				   $('#hprivprot').hide();
                   $('#hprivpass').hide();
               }
               else
               {
                   $('#hauthprot').show();
                   $('#hauthpass').show();
   				   $('#hprivprot').show();
                   $('#hprivpass').show();
               }
           }
});

$('#seclevel').on('change', function() {
    if($('#seclevel').val() == '0')
    {
        $('#hauthprot').hide();
        $('#hauthpass').hide();
        $('#hprivprot').hide();
        $('#hprivpass').hide();
    }
    else if($('#seclevel').val() == '1')
    {
        $('#hauthprot').show();
        $('#hauthpass').show();
        $('#hprivprot').hide();
        $('#hprivpass').hide();
    }
    else
    {
        $('#hauthprot').show();
        $('#hauthpass').show();
        $('#hprivprot').show();
        $('#hprivpass').show();
    }
});