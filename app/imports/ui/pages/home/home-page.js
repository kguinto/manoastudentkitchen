import { Template } from 'meteor/templating';
import { Recipes } from '/imports/api/profile/ProfileCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { _ } from 'meteor/underscore';


Template.Home_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
});

Template.Home_Page.helpers({

  /**
   * Produces top recipes for the homepage
   *
   */
  top_recipes() {
    return _.sample(Recipes.find({}, { sort: { viewcount: -1, limit: 16 } }).fetch(), 6);
  },

  /**
   * Produces top tags for homepage
   *
   */
  top_tags() {
    console.log(Tags.find({}, {}));
    const allTags = Tags.find({}, { fields: { tagName: 1 } }).fetch();
    const namesOnly = _.values(allTags);
    const frequency = _.countBy(namesOnly, function (each) { return each; });
    const result = _.first(_.sortBy(_.uniq(namesOnly),
        function (frequencyKey) { return -frequency[frequencyKey]; }), 8);
    return result;
  },

  /**
   * Produces image for a tag
   *
   */
  load_tag_image(theTagName) {
    const recipesWithTag = Tags.find({ tagName: theTagName }, { fields: { recipeID: 1 } }).fetch();
    const randomRecipe = _.sample(recipesWithTag);
    return Recipes.find({ recipeID: randomRecipe.recipeID }, {}).fetch();
  },

  /**
   * Produces tags for a recipe
   *
   */
  recipe_tag(theRecipeID) {
    return Tags.find({ recipeID: theRecipeID }, {}).fetch();
  },

});
