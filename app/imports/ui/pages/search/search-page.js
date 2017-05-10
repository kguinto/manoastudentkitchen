import { Template } from 'meteor/templating';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from '/imports/api/image/ImageCollection';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

/* eslint-disable no-undef, object-shorthand, no-shadow*/

Template.View_Search_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Recipes.getPublicationName());
  this.subscribe(Images.getPublicationName());
  this.numResults = new ReactiveVar(0);
});

Template.search.onRendered(function () {
  if (FlowRouter.getParam('searchParam') !== '*') {
    this.$('input[name="text"]').val(FlowRouter.getParam('searchParam'));
  }
});
Template.View_Search_Page.helpers({

  /**
   * Produces matching recipes in search
   *
   */
  search_results() {
    const param = FlowRouter.getParam('searchParam');
    let findParams = { recipeName: { $regex: `${param}` } };
    if (param === '*') {
      findParams = {};
    }
    const results = Recipes.find(findParams, { sort: { viewcount: -1 } }).fetch();

    let tagSearchArr = param.split(',');
    tagSearchArr = _.map(tagSearchArr, function snip(term) { return term[0] === ' ' ? term.substr(1) : term; });
    const tagSearchMap = _.map(tagSearchArr, function searchterm(term) { return { tagName: term }; });
    const tagSearchResults = Tags.find({ $or: tagSearchMap }, { fields: { recipeID: 1 } }).fetch();
    const tagSearchResultsRenamed = _.map(tagSearchResults, function rename(item) { return { _id: item.recipeID }; });
    if (tagSearchResultsRenamed.length > 0) {
      const tagSearch = Recipes.find({ $or: tagSearchResultsRenamed }, { }).fetch();
      results.push(tagSearch);
    }
    const flatresults = _.uniq(_.flatten(results, true), function isUniq(key) {
      return key._id;
    });
    Template.instance().numResults.set(flatresults.length);
    return flatresults;
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

  search_title() {
    const searchParam = FlowRouter.getParam('searchParam');
    const numResults = Template.instance().numResults.get();
    let message = '';
    if (searchParam === '*') {
      message = 'Showing all recipes. Use searchbar to narrow search.';
    } else if (numResults === 1) {
      message = `1 results for \'${searchParam}\'`;
    } else if (numResults > 1) {
      message = `${numResults} results for \'${searchParam}\'`;
    } else {
      message = `0 results for \'${searchParam}\'`;
    }
    return message;
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

});

Template.View_Search_Page.events({
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

});
