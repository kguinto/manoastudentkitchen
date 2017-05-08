import { Template } from 'meteor/templating';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.View_Search_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Recipes.getPublicationName());
});

Template.search.onRendered(function () {
  this.$('input[name="text"]').val(FlowRouter.getParam('searchParam'));
})
Template.View_Search_Page.helpers({

  /**
   * Produces matching recipes in search
   *
   */
  search_results() {
    const param = FlowRouter.getParam('searchParam');

    const results = Recipes.find({ recipeName: { $regex: '${param}' } }, { sort: { viewcount: -1 } }).fetch();

    let tagSearchArr = param.split(',');
    tagSearchArr = _.map(tagSearchArr, function snip(term) { return term[0] === ' ' ? term.substr(1) : term; });
    const tagSearchMap = _.map(tagSearchArr, function searchterm(term) { return { tagName: term }; });
    const tagSearchResults = Tags.find({ $or: tagSearchMap }, { fields: { recipeID: 1 } }).fetch();
    const tagSearchResultsRenamed = _.map(tagSearchResults, function rename(item) { return { _id: item.recipeID }; });
    if (tagSearchResultsRenamed.length > 0) {
      const tagSearch = Recipes.find({ $or: tagSearchResultsRenamed }, { sort: { viewcount: -1 } }).fetch();
      results.push(tagSearch);
    }
    console.log(results[0]);
    return results[0];
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

  search_param(){
    return FlowRouter.getParam('searchParam');
  },

  search_title(){
    if (search_results().length == 1)
      return search_results().length + ' result for \'' + search_param() + '\'';
    else if (search_results().length > 1)
      return search_results().length + ' results for \'' + search_param() + '\'';
    else
      return '0 results for \'' + search_param() + '\'';
  }
});

function search_param(){
  return FlowRouter.getParam('searchParam');
}

function search_results(){
  const param = FlowRouter.getParam('searchParam');

  const results = Recipes.find({ recipeName: { $regex: `${param}` } }, { sort: { viewcount: -1 } }).fetch();

  let tagSearchArr = param.split(',');
  tagSearchArr = _.map(tagSearchArr, function snip(term) { return term[0] === ' ' ? term.substr(1) : term; });
  const tagSearchMap = _.map(tagSearchArr, function searchterm(term) { return { tagName: term }; });
  const tagSearchResults = Tags.find({ $or: tagSearchMap }, { fields: { recipeID: 1 } }).fetch();
  const tagSearchResultsRenamed = _.map(tagSearchResults, function rename(item) { return { _id: item.recipeID }; });
  if (tagSearchResultsRenamed.length > 0) {
    const tagSearch = Recipes.find({ $or: tagSearchResultsRenamed }, { sort: { viewcount: -1 } }).fetch();
    results.push(tagSearch);
  }
  console.log(results[0]);
  return results[0];
}