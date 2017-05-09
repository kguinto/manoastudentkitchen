import { Template } from 'meteor/templating';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';


const userSearchTerm = 'user';
const recipeSearchTerm = 'recipe';
const tagSearchTerm = 'tag';

Template.Admin_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Recipes.getPublicationName());
  this.searchTerms = new ReactiveDict();
  this.searchTerms.set(userSearchTerm, '');
  this.searchTerms.set(recipeSearchTerm, '');
  this.searchTerms.set(tagSearchTerm, '');
  this.activeOption = new ReactiveVar('');
});

Template.Admin_Page.helpers({

  /**
   * Produces matching recipes in search
   *
   */
  recipe_search_results() {
    const param = Template.instance().searchTerms.get(recipeSearchTerm);

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
    return results;
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
    if (numResults === 1) {
      message = `1 results for \'${searchParam}\'`;
    } else if (numResults > 1) {
      message = `${numResults} results for \'${searchParam}\'`;
    } else {
      message = `0 results for \'${searchParam}\'`;
    }
    return message;
  },

  /**
   * Determines which pane of the admin options has activeclass
   *
   */
  getActiveStatus(option) {
    return Template.instance().activeOption.get() === option ? 'active' : '';
  },
  /**
   * Determines if pane is active
   *
   */
  isActiveOption(option) {
    return Template.instance().activeOption.get() === option;
  },
  hasSearch() {
    return Template.instance().activeOption.get() === 'userpane' ||
    Template.instance().activeOption.get() === 'recipepane' ||
    Template.instance().activeOption.get() === 'tagpane';
  },
  /**
   * Gets name of active pane (lowercase)
   *
   */
  getOptionName() {
    return Template.instance().activeOption.get().slice(0, -4);
  },
});

Template.Admin_Page.events({
  'submit .admin-search'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Get type of search
    const searchType = Template.instance().activeOption.get().slice(0, -4);

    if (text !== null && text !== '') {
      Template.instance().searchTerms.set(searchType, text);
    }
  },
  'click .side-item-userpane'(event) {
    event.preventDefault();
    Template.instance().activeOption.set('userpane');
  },
  'click .side-item-recipepane'(event) {
    event.preventDefault();
    Template.instance().activeOption.set('recipepane');
  },
  'click .side-item-tagpane'(event) {
    event.preventDefault();
    Template.instance().activeOption.set('tagpane');
  },
  'click .side-item-reportpane'(event) {
    event.preventDefault();
    Template.instance().activeOption.set('reportpane');
  },
  'click .side-item-settingpane'(event) {
    event.preventDefault();
    Template.instance().activeOption.set('settingpane');
  },

});

