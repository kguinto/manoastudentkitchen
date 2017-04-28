import { Template } from 'meteor/templating';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.View_Search_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Recipes.getPublicationName());
});

Template.View_Search_Page.helpers({

  /**
   * Produces matching recipes in search
   *
   */
  search_results() {
    const param = FlowRouter.getParam('searchParam');
    return Recipes.find({ recipeName: { $regex: `${param}` } }, { sort: { viewcount: -1, limit: 16 } }).fetch();
  },

  /**
   * Produces tags for a recipe
   *
   */
  recipe_tag(theRecipeID) {
    return Tags.find({ recipeID: theRecipeID }, {}).fetch();
  },

  convert_publish_date(publishDate) {
    const date = new Date(0);
    date.setUTCSeconds(publishDate);
    return date.toLocaleDateString();
  },

  get_recipe_url(recipeID) {
    return `/recipe/${recipeID}/view`;
  },

});
