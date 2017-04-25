import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Recipe_Header.helpers({
  routeRecipeID() {
    return FlowRouter.getParam('recipeID');
  },
});
