define(
['jquery', 'humane'],

function($, Humane) {

     var notify = Humane.create({ timeout: 2000, baseCls: 'humane-original' })
                   
     return notify;


});