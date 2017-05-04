import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.View_Recipe_Page.onCreated(function onCreated() {
  this.subscribe(Recipes.getPublicationName());
  this.subscribe(Tags.getPublicationName());
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

  costPerServing() {
    console.log(Tags.find().fetch());
    console.log(Recipes.find().fetch());
    console.log("Calling Recipes.findDocWithRecipeID with parameter " +FlowRouter.getParam('_id'))

    const recipe = Recipes.findDocWithRecipeID(FlowRouter.getParam('_id'));
    return (recipe.totalCost / recipe.noServings);
  },

});

Template.View_Recipe_Page.events({
  'submit .new-tag-form' (event, instance) {
    event.preventDefault();
    console.log(event.target.text.value);
    // Get tag name (text field)
   // const tagName = event.target.text.value;
    // Get recipe ID
    // const recipeID;
    // Create tag ID?
    //const tagID;

    //const score = 1;
/*
    const newContactData = { tagName,  };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newContactData reflects what will be inserted.
    ContactSchema.clean(newContactData);
    // Determine validity.
    instance.context.validate(newContactData);
    if (instance.context.isValid()) {
      const id = Contacts.insert(newContactData);
      instance.messageFlags.set(displayErrorMessages, false);
      instance.find('form').reset();
      instance.$('.dropdown').dropdown('restore defaults');
      FlowRouter.go('Home_Page');
    } else {
      instance.messageFlags.set(displayErrorMessages, true);
    } */
  },

});
