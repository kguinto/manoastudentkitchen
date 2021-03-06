import { Template } from 'meteor/templating';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { Images } from '/imports/api/image/ImageCollection';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';

/* eslint-disable no-undef, object-shorthand, no-shadow*/

Template.Home_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Recipes.getPublicationName());
  this.subscribe(Images.getPublicationName());
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
    const allTags = Tags.find({ }, { fields: { tagName: 1 } }).fetch();
    const namesOnly = _.pluck(_.values(allTags), 'tagName');
    const frequency = _.countBy(namesOnly, function each(each) { return each; });
    const result = _.first(_.sortBy(_.uniq(namesOnly),
        function frequencyKey(frequencyKey) { return -frequency[frequencyKey]; }), 8);
    return result;
  },

  /**
   * Produces image for a recipe
   *
   */
  load_recipe_image(theRecipeID) {
    const recipeImage = Images.find({ recipeID: theRecipeID }, { fields: { imageURL: 1 } }).fetch();
    let res = '';
    if (recipeImage.length === 1) {
      res = recipeImage[0].imageURL;
    }
    return res;
  },

  /**
   * Produces image for a tag
   *
   */
  load_tag_image(theTagName) {
    const recipesWithTag = Tags.find({ tagName: theTagName }, { fields: { recipeID: 1 } }).fetch();
    const randomRecipe = _.sample(recipesWithTag);
    const recipeImage = Images.find({ recipeID: randomRecipe.recipeID }, { fields: { imageURL: 1 } }).fetch();
    let res = '';

    if (recipeImage.length === 1) {
      res = recipeImage[0].imageURL;
    }
    return res;
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
    return `/recipe/${recipeID}`;
  },

  get_search_url(text) {
    return `/search/${text}`;
  },
});


Template.Home_Page.events({
  'submit .search-recipe'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    if (text !== null && text !== '') {
      FlowRouter.go('View_Search_Page', { searchParam: text });
    } else {
      FlowRouter.go('View_Search_Page', { searchParam: '*' });
    }
    // Clear form
    target.text.value = '';
  },
  'click .create-new'(event) {
    event.preventDefault();
    const userName = Meteor.user().profile.name;
    FlowRouter.go(`/${userName}/create`);
  },
  'click .browse-all'(event) {
    event.preventDefault();
    FlowRouter.go('View_Search_Page', { searchParam: '*' });
  },

});
