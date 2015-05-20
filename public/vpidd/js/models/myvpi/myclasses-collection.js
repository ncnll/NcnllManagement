define(
['jquery', 'lodash', 'backbone', 'models/myvpi/myclass-model'],

function($, _, Backbone, MyClass) {

	var MyClassesCollection = Backbone.Collection.extend({
		model: MyClass,
		url: "/vpi/user/getClassType",
		parse:function(response){
			console.log(response.classType)
			for(var i=0; i<response.classType.length; i++){
				if(!response.classType[i].name){
					response.classType.splice(i,1);
				}
			}
			console.log(response.classType)
			return response.classType;
		}
	});

	return MyClassesCollection;
});
