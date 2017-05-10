import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { Images } from '/imports/api/image/ImageCollection';
import { Ingredients } from '/imports/api/ingredient/IngredientCollection';
import { Locations } from '/imports/api/location/LocationCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.View_Recipe_Page.onCreated(function onCreated() {
  this.subscribe(Recipes.getPublicationName());
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Images.getPublicationName());
  this.subscribe(Ingredients.getPublicationName());
  this.subscribe(Locations.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Recipes.getSchema().namedContext('View_Recipe_Page');

});

Template.View_Recipe_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
  recipe() {
    return Recipes.findDocWithRecipeID(FlowRouter.getParam('_id'));
  },

  recipeTags() {
    return _.where(Tags.find().fetch(), { recipeID: FlowRouter.getParam('_id') });
  },
  recipeImageURL(){
    return _.pluck(_.where(Images.find().fetch(), { recipeID: FlowRouter.getParam('_id') }), 'imageURL')[0];
  },
  ingredients() {
    return _.where(Ingredients.find().fetch(), { recipeID: FlowRouter.getParam('_id') });
  },

  get_edit_url(recipeID) {
    return `/recipe/` + FlowRouter.getParam('_id') + `/edit`;
  },

  location(ing) {
   // console.log(Locations.find().fetch());
    const locations = Locations.find().fetch();
    console.log(locations);
    console.log(ing.locationID);
    console.log(_.where(locations, {_id: ing.locationID}) );
    return _.pluck(_.where(locations, {_id: ing.locationID}), 'locationName')[0];
  },

  costPerServing() {
    const recipe = Recipes.findDocWithRecipeID(FlowRouter.getParam('_id'));
    return (recipe.totalCost / recipe.noServings);
  },
  tagsNotInRecipe() {
    return _.filter(_.uniq(_.pluck(Tags.find().fetch(), 'tagName')), function (tagName) {
      return !_.contains(_.pluck(_.where(Tags.find().fetch(), { recipeID: FlowRouter.getParam('_id') }), 'tagName'), tagName)
        }
    ), function (tagName) {

      return { title: tagName };
    };
  },

  userIsAdmin(){
    return (Meteor.user().profile.name == 'kguinto' || Meteor.user().profile.name == 'alexcw' || Meteor.user().profile.name == 'cfrifel' || Meteor.user().profile.name == 'johnson' || Meteor.user().profile.name == 'amymalia');
  }
});

Template.tagInput.onRendered(function () {
  this.$('.ui.search').search({
    source: _.map(
        _.filter(_.uniq(_.pluck(Tags.find().fetch(), 'tagName')), function (tagName) {
              return !_.contains(_.pluck(_.where(Tags.find().fetch(), { recipeID: FlowRouter.getParam('_id') }), 'tagName'), tagName)
            }
        ), function (tagName) {

          return { title: tagName };
        }
    ),
    error: false
  })
  ;

  this.$('.ui.search').search.settings.showNoResults = false;
});

Template.View_Recipe_Page.events({
  'submit .new-tag-form'(event, instance) {
    event.preventDefault();
    // Get tag name (text field)
    const tagName = event.target.text.value;
    // Get recipe ID
    const recipeID = FlowRouter.getParam('_id');
    const score = 1;

    const newTagData = { recipeID, tagName, score };

    // Clear out any old validation errors.
    // instance.context.resetValidation();
    // Invoke clean so that newContactData reflects what will be inserted.
    Tags.getSchema().clean(newTagData);
    // Determine validity.
    // instance.context.validate(newTagData);

    if (instance.context.isValid()) {
      const id = Tags.define(newTagData);

      instance.messageFlags.set(displayErrorMessages, false);
      instance.find('form').reset();
    } else {
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },

});
