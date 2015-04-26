define(
['jquery', 'lodash', 'backbone', 'spin'],

function($, _, Backbone, Spinner) {
    var target = document.getElementById('htmlBody');
    var spinner = new Spinner();
    spinner.spinTarget = target;
    return spinner;
});