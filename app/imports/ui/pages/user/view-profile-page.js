import { Template } from 'meteor/templating';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { Images } from '/imports/api/image/ImageCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';

/* eslint-disable no-undef, object-shorthand, no-shadow*/

Template.View_Profile_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Recipes.getPublicationName());
  this.subscribe(Images.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
});

Template.View_Profile_Page.helpers({

  /**
   * Produces recipes by user
   *
   */
  user_recipes() {
    return Recipes.find({ userID: Meteor.user()._id }, { sort: { viewcount: -1 } }).fetch();
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
   * Produces tags for a recipe
   *
   */
  recipe_tag(theRecipeID) {
    return Tags.find({ recipeID: theRecipeID }, {}).fetch();
  },
  /**
   * Loads user profile
   */
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
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
  is_not_current_user() {
    return !(Profiles.findDoc(Meteor.user().profile.name)._id ===
    Profiles.findDoc(FlowRouter.getParam('username'))._id);
  },
});


Template.View_Profile_Page.events({
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
